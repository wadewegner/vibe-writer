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
    button.addEventListener('click', (event) => {
      const activityId = event.currentTarget.dataset.activityId;
      const originalTitle = document.getElementById(`activity-title-${activityId}`).textContent;

      // Store data on the modal for the 'accept' handler
      modal.dataset.activityId = activityId;
      modal.dataset.newTitle = ''; // Clear previous new title

      // Populate and show the modal immediately for better UX
      originalTitleEl.textContent = originalTitle;
      newTitleEl.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Generating...';
      acceptBtn.disabled = true;
      modal.classList.add('show');

      // Make the API call asynchronously
      (async () => {
        try {
          const response = await fetch(`/api/activities/${activityId}/regenerate-title`, {
            method: 'POST',
          });

          if (!response.ok) {
            throw new Error('Server responded with an error');
          }

          const data = await response.json();

          // Update modal with the new title
          newTitleEl.textContent = data.newTitle;
          modal.dataset.newTitle = data.newTitle;
          acceptBtn.disabled = false; // Re-enable accept button

        } catch (error) {
          console.error('Error during title regeneration:', error);
          newTitleEl.textContent = 'Error: Could not generate a new title.';
          // Keep accept button disabled on error
        }
      })();
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