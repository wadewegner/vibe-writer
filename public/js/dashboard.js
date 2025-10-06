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
      
      // Get original title from either table (desktop) or card (mobile)
      let originalTitle;
      const tableRow = event.currentTarget.closest('tr');
      const card = event.currentTarget.closest('.activity-card');
      
      if (tableRow) {
        // Desktop: get from table column
        originalTitle = tableRow.querySelector('td:nth-child(3)').textContent;
      } else if (card) {
        // Mobile: get from card expanded section
        const originalTitleDetail = card.querySelector('.activity-card-detail-value');
        originalTitle = originalTitleDetail ? originalTitleDetail.textContent : 'Unknown';
      }

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

      // Update the title in the table (desktop)
      const titleSpan = document.getElementById(`activity-title-${activityId}`);
      if (titleSpan) {
        titleSpan.textContent = newTitle;
      }
      
      // Update the title in the card (mobile)
      const cardTitle = document.getElementById(`activity-card-title-${activityId}`);
      if (cardTitle) {
        cardTitle.textContent = newTitle;
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

  // ============================================
  // HAMBURGER MENU FUNCTIONALITY
  // ============================================
  
  const hamburgerBtn = document.getElementById('hamburger-menu');
  const mobileNavOverlay = document.getElementById('mobile-nav-overlay');
  const mobileNavClose = document.getElementById('mobile-nav-close');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

  /**
   * Opens the mobile navigation menu
   */
  const openMobileNav = () => {
    mobileNavOverlay.classList.add('show');
    mobileNavOverlay.setAttribute('aria-hidden', 'false');
    hamburgerBtn.setAttribute('aria-expanded', 'true');
    // Prevent body scroll when menu is open
    document.body.style.overflow = 'hidden';
  };

  /**
   * Closes the mobile navigation menu
   */
  const closeMobileNav = () => {
    mobileNavOverlay.classList.remove('show');
    mobileNavOverlay.setAttribute('aria-hidden', 'true');
    hamburgerBtn.setAttribute('aria-expanded', 'false');
    // Restore body scroll
    document.body.style.overflow = '';
  };

  // Open menu when hamburger button is clicked
  if (hamburgerBtn) {
    hamburgerBtn.addEventListener('click', openMobileNav);
  }

  // Close menu when close button is clicked
  if (mobileNavClose) {
    mobileNavClose.addEventListener('click', closeMobileNav);
  }

  // Close menu when clicking outside (on the backdrop)
  if (mobileNavOverlay) {
    mobileNavOverlay.addEventListener('click', (event) => {
      if (event.target === mobileNavOverlay) {
        closeMobileNav();
      }
    });
  }

  // Close menu when any navigation link is clicked
  mobileNavLinks.forEach(link => {
    link.addEventListener('click', closeMobileNav);
  });

  // Close menu on escape key press
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && mobileNavOverlay.classList.contains('show')) {
      closeMobileNav();
    }
  });

  // ============================================
  // ACTIVITY CARD EXPAND/COLLAPSE
  // ============================================
  
  const activityCards = document.querySelectorAll('.activity-card');
  
  activityCards.forEach(card => {
    const cardHeader = card.querySelector('.activity-card-header');
    const regenerateBtn = card.querySelector('.activity-card-regenerate');
    
    /**
     * Toggles the expanded state of an activity card
     */
    const toggleCard = () => {
      const isExpanded = card.dataset.expanded === 'true';
      card.dataset.expanded = !isExpanded;
      card.classList.toggle('expanded');
    };
    
    // Toggle card when clicking on the header (but not the regenerate button)
    if (cardHeader) {
      cardHeader.addEventListener('click', (event) => {
        // Don't toggle if clicking the regenerate button
        if (!event.target.closest('.activity-card-regenerate')) {
          toggleCard();
        }
      });
    }
    
    // Prevent regenerate button click from expanding card
    if (regenerateBtn) {
      regenerateBtn.addEventListener('click', (event) => {
        event.stopPropagation();
        // The regenerate functionality is already handled by existing code
      });
    }
  });

}); 