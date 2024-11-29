const colorSchemes = [
  // Dark Mode
  { "--text-color": "#ffffff", "--background-color": "#121212" },

  // Black and White
  { "--text-color": "#000000", "--background-color": "#ffffff" },

  // Monochromatic Blue
  { "--text-color": "#002147", "--background-color": "#E6F1FF" },

  // Analogous Purple
  { "--text-color": "#4B0082", "--background-color": "#E6CCFF" },

  // Complementary Orange
  { "--text-color": "#FF8C00", "--background-color": "#1B325F" },

  // Triadic Red-Green-Blue
  { "--text-color": "#FF0000", "--background-color": "#00FF00" },

  // Split Complementary Yellow-Purple
  { "--text-color": "#FFD700", "--background-color": "#460063" },

  // Monochromatic Green
  { "--text-color": "#006400", "--background-color": "#D0F0C0" },

  // Analogous Pink
  { "--text-color": "#FF69B4", "--background-color": "#FFF0F5" },

  // Complementary Teal
  { "--text-color": "#008080", "--background-color": "#FFAA6E" },

  // Monochromatic Cyan
  { "--text-color": "#00FFFF", "--background-color": "#E0FFFF" },

  // Analogous Yellow
  { "--text-color": "#FFD700", "--background-color": "#FFF7DD" },

  // Split Complementary Blue-Green
  { "--text-color": "#4682B4", "--background-color": "#FF7F50" },

  // Monochromatic Purple
  { "--text-color": "#800080", "--background-color": "#E6E6FA" },

  // Analogous Green
  { "--text-color": "#008000", "--background-color": "#D1FFA9" },

  // Complementary Magenta
  { "--text-color": "#FF00FF", "--background-color": "#003300" },

  // Monochromatic Red
  { "--text-color": "#FF0000", "--background-color": "#FFC1C1" },

  // Analogous Orange
  { "--text-color": "#FF4500", "--background-color": "#FFF5E0" },

  // Split Complementary Red-Green
  { "--text-color": "#FF0000", "--background-color": "#44FF00" },

  // Monochromatic Yellow
  { "--text-color": "#FFFF00", "--background-color": "#FFFFE0" },

  // Fresh Green
  { "--text-color": "#ffffff", "--background-color": "#00cc99" },

  // Ocean Blue
  { "--text-color": "#ffffff", "--background-color": "#004d99" },

  // Vibrant Yellow
  { "--text-color": "#000000", "--background-color": "#ffcc00" },

  // Purple Haze
  { "--text-color": "#ffffff", "--background-color": "#663399" },

  // Elegant Gray
  { "--text-color": "#ffffff", "--background-color": "#808080" },

  // Pastel Pink
  { "--text-color": "#000000", "--background-color": "#ffb6c1" },

  // Earthy Brown
  { "--text-color": "#ffffff", "--background-color": "#8b4513" },

  // Sunshine Yellow
  { "--text-color": "#000000", "--background-color": "#ffd700" },

  // Coral Reef
  { "--text-color": "#000000", "--background-color": "#ff7f50" },

  // Royal Red
  { "--text-color": "#ffffff", "--background-color": "#8b0000" },

  // Teal Dream
  { "--text-color": "#ffffff", "--background-color": "#008080" },

  // Midnight Sky
  { "--text-color": "#ffffff", "--background-color": "#000080" },

  // Sunset Orange
  { "--text-color": "#000000", "--background-color": "#ff4500" },

  // Mellow Yellow
  { "--text-color": "#000000", "--background-color": "#ffff66" },

  // Serene Green
  { "--text-color": "#ffffff", "--background-color": "#009933" },

  // Deep Sea
  { "--text-color": "#ffffff", "--background-color": "#006699" },

  // Lavender Bliss
  { "--text-color": "#000000", "--background-color": "#e6e6fa" },

  // Monochrome Gray
  { "--text-color": "#ffffff", "--background-color": "#333333" },
];

let currentColorSchemeIndex = 0;

function changeColorScheme(direction) {
  if (direction === "next") {
    currentColorSchemeIndex =
      (currentColorSchemeIndex + 1) % colorSchemes.length;
  } else if (direction === "previous") {
    currentColorSchemeIndex =
      (currentColorSchemeIndex - 1 + colorSchemes.length) % colorSchemes.length;
  }

  const colorScheme = colorSchemes[currentColorSchemeIndex];

  for (const [property, value] of Object.entries(colorScheme)) {
    document.documentElement.style.setProperty(property, value);
  }

  updateColorSchemeIndexDisplay();
}

function updateColorSchemeIndexDisplay() {
  let indexDisplay = document.getElementById("color-scheme-index");

  if (!indexDisplay) {
    indexDisplay = document.createElement("div");
    indexDisplay.id = "color-scheme-index";
    indexDisplay.style.position = "absolute";
    indexDisplay.style.bottom = "10px";
    indexDisplay.style.left = "10px";
    indexDisplay.style.backgroundColor = "aquamarine";
    indexDisplay.style.color = "black";
    indexDisplay.style.padding = "5px";
    indexDisplay.style.fontFamily = "Inter";
    document.body.appendChild(indexDisplay);
  }

  indexDisplay.innerText = `Color Scheme Index: ${currentColorSchemeIndex}`;
}

function handleKeydown(event) {
  if (event.key === "ArrowRight") {
    changeColorScheme("next");
  } else if (event.key === "ArrowLeft") {
    changeColorScheme("previous");
  }
}

document.addEventListener("keydown", handleKeydown);
changeColorScheme("next");