// This file will contain the client-side JavaScript for the dashboard page,
// including the logic for regenerating and updating activity titles. 

document.addEventListener('DOMContentLoaded', () => {
  const modalEl = document.getElementById('regenerate-modal');
  const originalTitleEl = document.getElementById('original-title-placeholder');
  const newTitleEl = document.getElementById('new-title-placeholder');
  const acceptBtn = document.getElementById('accept-regenerate');
  const regenerateAgainBtn = document.getElementById('regenerate-again');
  const cancelBtn = document.getElementById('cancel-regenerate');
  const closeBtn = document.querySelector('.modal-close-btn');

  const showModal = () => modalEl.classList.add('show');
  const hideModal = () => modalEl.classList.remove('show');

  /**
   * Handles the asynchronous process of fetching a new title.
   * @param {string} activityId - The ID of the activity to regenerate.
   */
  const handleRegeneration = async (activityId) => {
    // Set loading state in the modal
    newTitleEl.innerHTML = '<span>Generating...</span>'; // Simple text-based loading state
    acceptBtn.disabled = true;
    regenerateAgainBtn.disabled = true;

    try {
      const response = await fetch(`/api/activities/${activityId}/regenerate-title`, {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Server responded with an error');
      }

      const data = await response.json();

      // Update modal with the newly generated title
      newTitleEl.textContent = data.newTitle;
      modalEl.dataset.newTitle = data.newTitle;
      acceptBtn.disabled = false; // Re-enable buttons
      regenerateAgainBtn.disabled = false;

    } catch (error) {
      console.error('Error during title regeneration:', error);
      newTitleEl.textContent = 'Error: Could not generate a new title.';
      // Allow user to try again on failure
      regenerateAgainBtn.disabled = false;
    }
  };

  // Add event listeners to all regenerate buttons on the main page
  document.querySelectorAll('.regenerate-btn').forEach(button => {
    button.addEventListener('click', (event) => {
      const activityId = event.currentTarget.dataset.activityId;
      // In the new layout, the original title is in a sibling td
      const originalTitle = event.currentTarget.closest('tr').querySelector('td:nth-child(3)').textContent;

      // Store data on the modal for other handlers to use
      modalEl.dataset.activityId = activityId;

      // Populate and show the modal, then trigger the regeneration
      originalTitleEl.textContent = originalTitle;
      showModal();
      handleRegeneration(activityId);
    });
  });

  // Add event listener to the "Regenerate Again" button inside the modal
  regenerateAgainBtn.addEventListener('click', () => {
    const activityId = modalEl.dataset.activityId;
    if (activityId) {
      handleRegeneration(activityId);
    }
  });

  // Add event listener to the "Accept" button
  acceptBtn.addEventListener('click', async () => {
    const activityId = modalEl.dataset.activityId;
    const newTitle = modalEl.dataset.newTitle;

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

    } catch (error) {
      console.error('Error updating title:', error);
      alert('An error occurred while updating the title. Please try again.');
    }
  });

  // Add event listeners for closing the modal
  cancelBtn.addEventListener('click', hideModal);
  closeBtn.addEventListener('click', hideModal);

  // Also close modal if user clicks on the overlay
  modalEl.addEventListener('click', (event) => {
    if (event.target === modalEl) {
      hideModal();
    }
  });
}); 