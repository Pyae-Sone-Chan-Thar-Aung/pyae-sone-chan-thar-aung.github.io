// Play birthday song automatically when the page loads
window.onload = () => {
  const audio = document.getElementById("birthday-audio");

  // Play the audio automatically
  audio.play().catch((error) => {
    console.error("Error with autoplay: ", error);
  });

  // Trigger confetti animation
  showConfetti();
};

// Function to trigger confetti animation
function showConfetti() {
  confetti({
    particleCount: 100,
    spread: 70,
    origin: { x: 0.5, y: 0.5 },
    colors: ['#ff9e00', '#ffcc00', '#ff6600']
  });
}
