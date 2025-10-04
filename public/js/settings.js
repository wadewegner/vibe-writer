// Settings page interactivity

document.addEventListener('DOMContentLoaded', () => {
  // Get all elements
  const selectAllBtn = document.getElementById('select-all-btn');
  const deselectAllBtn = document.getElementById('deselect-all-btn');
  const showMoreBtn = document.getElementById('show-more-btn');
  const expandedContainer = document.getElementById('expanded-types-container');
  const showMoreText = document.getElementById('show-more-text');
  const showMoreIcon = document.getElementById('show-more-icon');
  const activityCheckboxes = document.querySelectorAll('input[name="activity_types"]');

  // Select All functionality
  if (selectAllBtn) {
    selectAllBtn.addEventListener('click', () => {
      activityCheckboxes.forEach(checkbox => {
        checkbox.checked = true;
      });
    });
  }

  // Deselect All functionality
  if (deselectAllBtn) {
    deselectAllBtn.addEventListener('click', () => {
      activityCheckboxes.forEach(checkbox => {
        checkbox.checked = false;
      });
    });
  }

  // Show More / Show Less toggle
  if (showMoreBtn && expandedContainer) {
    showMoreBtn.addEventListener('click', () => {
      const isExpanded = expandedContainer.style.display !== 'none';
      
      if (isExpanded) {
        // Collapse
        expandedContainer.style.display = 'none';
        showMoreText.textContent = 'Show More Activity Types';
        showMoreIcon.textContent = '▼';
      } else {
        // Expand
        expandedContainer.style.display = 'block';
        showMoreText.textContent = 'Show Fewer Activity Types';
        showMoreIcon.textContent = '▲';
      }
    });
  }
});

