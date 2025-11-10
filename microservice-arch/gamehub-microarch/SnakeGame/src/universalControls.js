// src/universalControls.js

export function bindUniversalControls({ onMoveUp, onMoveDown, onMoveLeft, onMoveRight }) {
  const handleKey = (e) => {
    switch (e.key) {
      case "ArrowUp":
      case "w":
        onMoveUp();
        break;
      case "ArrowDown":
      case "s":
        onMoveDown();
        break;
      case "ArrowLeft":
      case "a":
        onMoveLeft();
        break;
      case "ArrowRight":
      case "d":
        onMoveRight();
        break;
      default:
        break;
    }
  };

  document.addEventListener("keydown", handleKey);

  // === Mobile touch/swipe controls ===
  let touchStartX = 0, touchStartY = 0;
  const threshold = 50;

  const handleTouchStart = (e) => {
    const touch = e.touches[0];
    touchStartX = touch.clientX;
    touchStartY = touch.clientY;
  };

  const handleTouchMove = (e) => {
    if (!touchStartX || !touchStartY) return;

    const touch = e.touches[0];
    const diffX = touch.clientX - touchStartX;
    const diffY = touch.clientY - touchStartY;

    if (Math.abs(diffX) > Math.abs(diffY)) {
      if (diffX > threshold) onMoveRight();
      else if (diffX < -threshold) onMoveLeft();
    } else {
      if (diffY > threshold) onMoveDown();
      else if (diffY < -threshold) onMoveUp();
    }

    touchStartX = 0;
    touchStartY = 0;
  };

  document.addEventListener("touchstart", handleTouchStart);
  document.addEventListener("touchmove", handleTouchMove);

  return () => {
    document.removeEventListener("keydown", handleKey);
    document.removeEventListener("touchstart", handleTouchStart);
    document.removeEventListener("touchmove", handleTouchMove);
  };
}
