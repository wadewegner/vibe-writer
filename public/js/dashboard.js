// This file will contain the client-side JavaScript for the dashboard page,
// including the logic for regenerating and updating activity titles. 

document.addEventListener('DOMContentLoaded', () => {
  const regenerateButtons = document.querySelectorAll('.regenerate-btn');
  const modal = document.getElementById('regenerate-modal');
  const originalTitleEl = document.getElementById('original-title-placeholder');
  const newTitleEl = document.getElementById('new-title-placeholder');
  const cancelBtn = document.getElementById('cancel-regenerate');
  const closeBtn = modal.querySelector('.btn-close');
  const acceptBtn = document.getElementById('accept-regenerate');

  const hideModal = () => {
    modal.classList.remove('show');
  };

  regenerateButtons.forEach(button => {
    button.addEventListener('click', async (event) => {
      const activityId = event.currentTarget.dataset.activityId;
      
      try {
        const response = await fetch(`/api/activities/${activityId}/regenerate-title`, {
          method: 'POST',
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to regenerate title');
        }

        const data = await response.json();
        const originalTitle = document.getElementById(`activity-title-${activityId}`).textContent;

        // Store data on the modal for the 'accept' handler to use
        modal.dataset.activityId = activityId;
        modal.dataset.newTitle = data.newTitle;

        // Populate and show the modal
        originalTitleEl.textContent = originalTitle;
        newTitleEl.textContent = data.newTitle;
        modal.classList.add('show');

      } catch (error) {
        console.error('Error during title regeneration:', error);
        alert('An error occurred while regenerating the title. Please try again.');
      }
    });
  });

  acceptBtn.addEventListener('click', async () => {
    const activityId = modal.dataset.activityId;
    const newTitle = modal.dataset.newTitle;

    if (!activityId || !newTitle) {
      console.error('Missing activityId or newTitle on modal');
      return;
    }

    try {
      const response = await fetch(`/api/activities/${activityId}/title`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ newTitle }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update title');
      }

      // Update the title in the UI
      const titleSpan = document.getElementById(`activity-title-${activityId}`);
      if (titleSpan) {
        titleSpan.textContent = newTitle;
      }
      hideModal();
      console.log('Title updated successfully.');

    } catch (error) {
      console.error('Error updating title:', error);
      alert('An error occurred while updating the title. Please try again.');
    }
  });

  cancelBtn.addEventListener('click', hideModal);
  closeBtn.addEventListener('click', hideModal);
}); 