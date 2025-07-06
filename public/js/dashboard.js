// This file will contain the client-side JavaScript for the dashboard page,
// including the logic for regenerating and updating activity titles. 

document.addEventListener('DOMContentLoaded', () => {
  const modalEl = document.getElementById('regenerate-modal');
  const bsModal = new bootstrap.Modal(modalEl); // Create a Bootstrap Modal instance
  const originalTitleEl = document.getElementById('original-title-placeholder');
  const newTitleEl = document.getElementById('new-title-placeholder');
  const acceptBtn = document.getElementById('accept-regenerate');
  const regenerateAgainBtn = document.getElementById('regenerate-again');

  /**
   * Handles the asynchronous process of fetching a new title.
   * @param {string} activityId - The ID of the activity to regenerate.
   */
  const handleRegeneration = async (activityId) => {
    // Set loading state in the modal
    newTitleEl.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Generating...';
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
      const originalTitle = document.getElementById(`activity-title-${activityId}`).textContent;

      // Store data on the modal for other handlers to use
      modalEl.dataset.activityId = activityId;

      // Populate and show the modal, then trigger the regeneration
      originalTitleEl.textContent = originalTitle;
      bsModal.show(); // Use Bootstrap's API to show the modal
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
      bsModal.hide(); // Use Bootstrap's API to hide the modal

    } catch (error) {
      console.error('Error updating title:', error);
      alert('An error occurred while updating the title. Please try again.');
    }
  });

  // The 'cancel' and 'close' buttons are now handled by Bootstrap's `data-bs-dismiss="modal"`
  // because we are using the official Bootstrap JS API.
}); 