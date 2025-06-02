// Hamburger menu toggle logic
const hamburger = document.querySelector('.hamburger');
const navList = document.querySelector('.nav__list');
const bars = document.querySelectorAll('.bar');
const navItems = document.querySelectorAll('.nav__link');

// Function to toggle the hamburger menu
function toggleHamburger() {
  hamburger.classList.toggle('hamburger__open');
  navList.classList.toggle('active');
}

// Add event listener to hamburger icon
hamburger.addEventListener('click', toggleHamburger);

// Close the menu when a nav item is clicked
navItems.forEach(item => {
  item.addEventListener('click', () => {
    hamburger.classList.remove('hamburger__open');
    navList.classList.remove('active');
  });
});

// Dark mode toggle
const toggleDarkMode = () => {
  document.body.classList.toggle('dark-mode');
  const darkModeButton = document.querySelector('.dark-mode-toggle');
  darkModeButton.classList.toggle('dark');
};

// Add event listener for dark mode button
const darkModeButton = document.querySelector('.dark-mode-toggle');
if (darkModeButton) {
  darkModeButton.addEventListener('click', toggleDarkMode);
}

// Typing animation for name
const moveElement = document.getElementById('move');
const moves = ['Pyae Sone C. Aung'];
let moveIndex = 0;
let charIndex = 0;
let deleting = false;
let typingSpeed = 200; 
let deletingSpeed = 400; 
let pauseBeforeDeleting = 1000; 
let pauseAfterDeleting = 2000; 

function type() {
    if (deleting) {
        if (charIndex > 9) {
            moveElement.textContent = moves[moveIndex].substring(0, charIndex - 1);
            charIndex--;
            setTimeout(type, deletingSpeed);
        } else {
            deleting = false;
            moveIndex = (moveIndex + 1) % moves.length;
            setTimeout(type, pauseBeforeDeleting);
        }
    } else {
        if (charIndex < moves[moveIndex].length) {
            moveElement.textContent = moves[moveIndex].substring(0, charIndex + 1);
            charIndex++;
            setTimeout(type, typingSpeed);
        } else {
            deleting = true;
            setTimeout(type, pauseAfterDeleting); 
        }
    }
}

// Start typing animation if element exists
if (moveElement) {
    type();
}

// Weather API functionality
const apiKey = 'cbb0b276f1724b6fb1420151241811';
const davaoCity = 'Davao';

function callAPI() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            const userLatitude = position.coords.latitude;
            const userLongitude = position.coords.longitude;

            // Display loading message
            document.querySelector("#user_city").textContent = "Loading...";
            document.querySelector("#user_temperature").textContent = "--";
            document.querySelector("#user_condition").textContent = "--";
            document.querySelector("#user_time").textContent = "--";

            // Fetch weather data
            const userWeatherUrl = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${userLatitude},${userLongitude}&aqi=no`;
            fetchWeatherData(userWeatherUrl, 'user');

            // Fetch Davao weather data
            const davaoWeatherUrl = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${davaoCity}&aqi=no`;
            fetchWeatherData(davaoWeatherUrl, 'my');

        }, function(error) {
            console.error("Error getting location: ", error);
            alert("Unable to retrieve your location. Please allow location access.");
        });
    } else {
        alert("Geolocation is not supported by this browser.");
    }
}

function fetchWeatherData(url, location) {
    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (location === 'user') {
                document.querySelector("#user_city").textContent = data.location.name || 'N/A';
                document.querySelector("#user_temperature").textContent = `${data.current.temp_c}°C` || 'N/A';
                document.querySelector("#user_condition").textContent = data.current.condition.text || 'N/A';
                const userTime = new Date().toLocaleString('en-US', { timeZone: data.location.tz_id });
                document.querySelector("#user_time").textContent = userTime || 'N/A';
            }
            else if (location === 'my') {
                document.querySelector("#my_temperature").textContent = `${data.current.temp_c}°C` || 'N/A';
                document.querySelector("#my_condition").textContent = data.current.condition.text || 'N/A';
                const davaoTime = new Date().toLocaleString('en-US', { timeZone: 'Asia/Manila' });
                document.querySelector("#my_time").textContent = davaoTime || 'N/A';
            }
        })
        .catch(error => {
            console.error('Error fetching weather data:', error);
            alert("Unable to fetch the weather data. Please try again later!");
        });
}

// Seminar Gallery and Filtering System
document.addEventListener('DOMContentLoaded', function() {
    // Set active nav link based on current page
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav__link');
    
    navLinks.forEach(link => {
        const linkPage = link.getAttribute('href');
        if ((currentPage === 'index.html' && linkPage === '#about') || 
            (currentPage === 'seminars.html' && linkPage === 'seminars.html') ||
            (currentPage.includes('seminar') && linkPage === 'seminars.html')) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });

    // Gallery thumbnail navigation
    const thumbnails = document.querySelectorAll('.gallery-thumbnails img');
    const mainImage = document.querySelector('.gallery-main img');
    
    if (thumbnails && mainImage) {
        thumbnails.forEach(thumb => {
            thumb.addEventListener('click', function() {
                // Remove active class from all thumbnails
                thumbnails.forEach(t => t.classList.remove('active'));
                // Add active class to clicked thumbnail
                this.classList.add('active');
                // Change main image
                mainImage.src = this.src;
                
                // Add smooth transition effect
                mainImage.style.opacity = 0;
                setTimeout(() => {
                    mainImage.style.opacity = 1;
                }, 100);
            });
        });
    }

    // Filter functionality for seminars page
    const filterButtons = document.querySelectorAll('.filter-btn');
    const eventCards = document.querySelectorAll('.event-card');

    if (filterButtons.length > 0) {
        filterButtons.forEach(button => {
            button.addEventListener('click', function() {
                // Remove active class from all buttons
                filterButtons.forEach(btn => btn.classList.remove('active'));
                // Add active class to clicked button
                this.classList.add('active');
                
                const filterValue = this.getAttribute('data-filter');
                
                // Filter event cards with smooth animation
                eventCards.forEach(card => {
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(20px)';
                    card.style.transition = 'all 0.3s ease';
                    
                    setTimeout(() => {
                        if (filterValue === 'all' || card.classList.contains(filterValue)) {
                            card.style.display = 'block';
                        } else {
                            card.style.display = 'none';
                        }
                        
                        // Trigger reflow for animation
                        void card.offsetWidth;
                        
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, 50);
                });
            });
        });
    }

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
});

// Initialize weather data if on index page
if (document.querySelector('#weather')) {
    // Optionally call API automatically:
    // callAPI();
}