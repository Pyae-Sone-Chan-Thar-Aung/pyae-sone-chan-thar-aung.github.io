// Clone the content element from the HTML and add the 'd-absolute' class to it
var content = document.querySelector("#content").cloneNode(true);
content.classList.add("d-absolute");

// Set the text and background colors for the cloned element
content.style.setProperty("--text-color", "black");
content.style.setProperty("--background-color", "white");

// Add the cloned element to the body of the page
document.body.appendChild(content);

// Get the original content element from the HTML
const content2 = document.querySelector("#content");

// Add event listeners to the child elements of the original content element
for (const child of content2.children) {
  child.addEventListener("mouseover", () => {
    // Increase the size of the circle when the mouse hovers over it
    content.style.setProperty("--size", "200px");
  });
  child.addEventListener("mouseleave", () => {
    // Decrease the size of the circle when the mouse leaves it
    content.style.setProperty("--size", "20px");
  });
}

// Add an event listener to the window to update the position of the cloned element based on the user's mouse movements
window.addEventListener("mousemove", (e) => {
  // Calculate the position of the mouse relative to the window
  const x = (e.clientX / window.innerWidth) * 100;
  const y = (e.clientY / window.innerHeight) * 100;

  // Set the CSS variables for the position of the cloned element
  content.style.setProperty("--x", `${x}%`);
  content.style.setProperty("--y", `${y}%`);
});