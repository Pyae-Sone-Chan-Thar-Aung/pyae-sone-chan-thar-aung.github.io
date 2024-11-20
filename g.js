const roleElement = document.getElementById('role');
const roles = ['Geoffrey Diapana','Geoffrey "Fr3y" Diapana'];
let roleIndex = 0;
let charIndex = 0;
let deleting = false;
let typingSpeed = 150; 
let deletingSpeed = 200; 
let pauseBeforeDeleting = 1200; 
let pauseAfterDeleting = 3550; 

function type() {
    if (deleting) {
        if (charIndex > 8) {
            roleElement.textContent = roles[roleIndex].substring(0, charIndex - 1);
            charIndex--;
            setTimeout(type, deletingSpeed);
        } else {
            deleting = false;
            roleIndex = (roleIndex + 1) % roles.length;
            setTimeout(type, pauseBeforeDeleting);
        }
    } else {
        if (charIndex < roles[roleIndex].length) {
            roleElement.textContent = roles[roleIndex].substring(0, charIndex + 1);
            charIndex++;
            setTimeout(type, typingSpeed);
        } else {
            deleting = true;
            setTimeout(type, pauseAfterDeleting); 
        }
    }
}

type();

const darkModeMediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

// Get dark mode preference from sessionStorage
let darkMode = sessionStorage.getItem('darkMode') === 'true';

darkModeMediaQuery.addEventListener("change", (e) => {
  if (e.matches) {
    darkMode = true;
  } else {
    darkMode = false;
  }
});

function drawBuildings() {
 state.buildings.forEach((building) => {
    ctx.fillStyle = darkMode ? "#254D7E" : "#947285";
    ctx.fillRect(building.x, 0, building.width, building.height);
  });
}

const lightIcon = document.getElementById("light-icon");
const darkIcon = document.getElementById("dark-icon");

// Set dark-mode class on body and icon visibility based on initial darkMode
if (darkMode) {
  document.body.classList.add("dark-mode");
  darkIcon.setAttribute("display", "none");
} else {
  lightIcon.setAttribute("display", "none");
}

function toggleDarkMode() {
  // Toggle darkMode variable
  darkMode = !darkMode;

  // Toggle dark-mode class on body
  document.body.classList.toggle("dark-mode");

  // Toggle light and dark icons
  if (darkMode) {
    lightIcon.setAttribute("display", "block");
    darkIcon.setAttribute("display", "none");
  } else {
    lightIcon.setAttribute("display", "none");
    darkIcon.setAttribute("display", "block");
  }

  // Save dark mode preference in sessionStorage
  sessionStorage.setItem('darkMode', darkMode);
}

// Hamburger menu logic
const navbarToggle = document.querySelector('.navbar-toggle');
const navbarMenu = document.querySelector('.navbar-menu');

navbarToggle.addEventListener('click',   
 () => {
  navbarMenu.classList.toggle('active');   

});