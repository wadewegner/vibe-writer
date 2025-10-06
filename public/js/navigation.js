// Shared navigation functionality for all pages
// Handles hamburger menu for mobile navigation

document.addEventListener('DOMContentLoaded', () => {
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
});

