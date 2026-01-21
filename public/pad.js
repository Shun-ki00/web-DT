// pad.js

const padState = {
  up: false,
  down: false,
};

function bindPadButton(id, key) {
  const btn = document.getElementById(id);

  // touch
  btn.addEventListener("touchstart", (e) => {
    e.preventDefault();
    padState[key] = true;
  }, { passive: false });

  btn.addEventListener("touchend", (e) => {
    e.preventDefault();
    padState[key] = false;
  }, { passive: false });

  btn.addEventListener("touchcancel", () => {
    padState[key] = false;
  });

  // mouse（PCテスト用）
  btn.addEventListener("mousedown", () => padState[key] = true);
  window.addEventListener("mouseup", () => padState[key] = false);
}

bindPadButton("pad-up", "up");
bindPadButton("pad-down", "down");

/* 外部取得用 */
window.getPadState = () => ({ ...padState });
