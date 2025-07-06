document.addEventListener('DOMContentLoaded', () => {
  const animatedTitle = document.getElementById('animated-title');
  if (!animatedTitle) return;

  const titles = [
    "Crushed that 10-mile tempo run!",
    "Sunset vibes on the evening ride.",
    "Exploring new trails in the mountains.",
    "Another brick in the wall for marathon prep.",
    "Easy spin to start the week right."
  ];

  let currentIndex = 0;

  setInterval(() => {
    // Fade out the current title
    animatedTitle.classList.add('fade-out');
    
    // After the fade-out animation completes
    setTimeout(() => {
      // Change the text content
      currentIndex = (currentIndex + 1) % titles.length;
      animatedTitle.textContent = titles[currentIndex];
      
      // Fade in the new title
      animatedTitle.classList.remove('fade-out');
      animatedTitle.classList.add('fade-in');
      
      // Clean up the class after the animation is done
      setTimeout(() => {
        animatedTitle.classList.remove('fade-in');
      }, 500);

    }, 500); // This should match the animation duration

  }, 3000); // Change title every 3 seconds
}); 