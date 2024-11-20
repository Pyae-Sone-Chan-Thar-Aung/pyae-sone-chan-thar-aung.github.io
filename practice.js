// JavaScript to handle the hamburger menu toggle
const hamburger = document.querySelector('.hamburger');
const navList = document.querySelector('.nav__list');

hamburger.addEventListener('click', () => {
  navList.classList.toggle('active');
  hamburger.classList.toggle('hamburger__open');
});

// Toggle dark mode
const toggleDarkMode = () => {
  document.body.classList.toggle('dark-mode'); // Add/remove dark-mode class from the body
  const darkModeButton = document.querySelector('.dark-mode-toggle');
  darkModeButton.classList.toggle('dark'); // Toggle the class for the button itself
};

// Add event listener for dark mode button
const darkModeButton = document.querySelector('.dark-mode-toggle');

if (darkModeButton) {
  darkModeButton.addEventListener('click', toggleDarkMode);
}
