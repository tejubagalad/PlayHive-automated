// universalControls.js
// Unified handler for both keyboard and swipe gestures.

export function bindUniversalControls({
  onMoveUp,
  onMoveDown,
  onMoveLeft,
  onMoveRight,
  element = window,
}) {
  let startX = 0,
    startY = 0;
  const threshold = 25; // pixels before it counts as a swipe

  // Handle keyboard arrow keys
  function handleKeyDown(e) {
    const k = e.key;
    if (k === "ArrowUp") onMoveUp && onMoveUp();
    else if (k === "ArrowDown") onMoveDown && onMoveDown();
    else if (k === "ArrowLeft") onMoveLeft && onMoveLeft();
    else if (k === "ArrowRight") onMoveRight && onMoveRight();
  }

  // Touch gesture start
  function handleTouchStart(e) {
    const t = e.touches && e.touches[0];
    if (!t) return;
    startX = t.clientX;
    startY = t.clientY;
  }

  // Touch gesture end
  function handleTouchEnd(e) {
    const t = e.changedTouches && e.changedTouches[0];
    if (!t) return;
    const dx = t.clientX - startX;
    const dy = t.clientY - startY;

    if (Math.abs(dx) > Math.abs(dy)) {
      // Horizontal swipe
      if (dx > threshold) onMoveRight && onMoveRight();
      else if (dx < -threshold) onMoveLeft && onMoveLeft();
    } else {
      // Vertical swipe
      if (dy > threshold) onMoveDown && onMoveDown();
      else if (dy < -threshold) onMoveUp && onMoveUp();
    }
  }

  // Attach listeners
  element.addEventListener("keydown", handleKeyDown);
  element.addEventListener("touchstart", handleTouchStart, { passive: true });
  element.addEventListener("touchend", handleTouchEnd, { passive: true });

  // Detach on cleanup
  return function unbind() {
    element.removeEventListener("keydown", handleKeyDown);
    element.removeEventListener("touchstart", handleTouchStart);
    element.removeEventListener("touchend", handleTouchEnd);
  };
}
