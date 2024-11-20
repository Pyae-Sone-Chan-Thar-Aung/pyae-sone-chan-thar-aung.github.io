// Hamburger menu toggle logic
const hamburger = document.querySelector('.hamburger');
const navList = document.querySelector('.nav__list');
const bars = document.querySelectorAll('.bar'); // All bars of the hamburger icon
const navItems = document.querySelectorAll('.nav__link'); // All nav items in the slide bar

// Function to toggle the hamburger menu
function toggleHamburger() {
  // Toggle the active state for hamburger (open or close)
  hamburger.classList.toggle('hamburger__open');
  navList.classList.toggle('active');
}

// Add event listener to hamburger icon for opening/closing the slide bar
hamburger.addEventListener('click', toggleHamburger);

// Close the menu when a nav item is clicked
navItems.forEach(item => {
  item.addEventListener('click', () => {
    // Close the menu and reset the hamburger to 3 equal strikes
    hamburger.classList.remove('hamburger__open');
    navList.classList.remove('active');
  });
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

type();


const apiKey = 'cbb0b276f1724b6fb1420151241811'; // Your WeatherAPI key
const davaoCity = 'Davao'; // Your location (Davao City, Philippines)

function callAPI() {
    // Get user's geolocation
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            const userLatitude = position.coords.latitude;
            const userLongitude = position.coords.longitude;

            // Display a message while loading
            document.querySelector("#user_city").textContent = "Loading...";
            document.querySelector("#user_temperature").textContent = "--";
            document.querySelector("#user_condition").textContent = "--";
            document.querySelector("#user_time").textContent = "--";

            // Fetch weather data for user's location
            const userWeatherUrl = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${userLatitude},${userLongitude}&aqi=no`;
            fetchWeatherData(userWeatherUrl, 'user');

            // Fetch weather data for Davao City
            const davaoWeatherUrl = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${davaoCity}&aqi=no`;
            fetchWeatherData(davaoWeatherUrl, 'my');

        }, function(error) {
            console.error("Error getting user's location: ", error);
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
                // Update weather for the user's location
                document.querySelector("#user_city").textContent = data.location.name || 'N/A';
                document.querySelector("#user_temperature").textContent = `${data.current.temp_c}°C` || 'N/A';
                document.querySelector("#user_condition").textContent = data.current.condition.text || 'N/A';
                
                // Get the user's time based on their location's timezone
                const userTime = new Date().toLocaleString('en-US', { timeZone: data.location.tz_id });
                document.querySelector("#user_time").textContent = userTime || 'N/A';
            }
            else if (location === 'my') {
                // Update weather for Davao City
                document.querySelector("#my_temperature").textContent = `${data.current.temp_c}°C` || 'N/A';
                document.querySelector("#my_condition").textContent = data.current.condition.text || 'N/A';
                
                // Get the current time in Davao (Asia/Manila timezone)
                const davaoTime = new Date().toLocaleString('en-US', { timeZone: 'Asia/Manila' });
                document.querySelector("#my_time").textContent = davaoTime || 'N/A';
            }
        })
        .catch(error => {
            console.error('Error fetching weather data:', error);
            alert("Error fetching weather data. Please try again.");
        });
}

