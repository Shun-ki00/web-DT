// controller.js（マルチタッチ対応：touchIdでスティック追跡）

const inputState = {
  up: false,
  down: false,
  stickX: 0, // -1..1
  stickY: 0, // -1..1（画面下方向が +）
};

let frame, ball, hudTextEl;

let centerX = 0, centerY = 0;
let maxRadius = 0;

// ジョイスティック用：どの指で操作してるか（タッチID）
let stickTouchId = null;

function safeGet(id) {
  const el = document.getElementById(id);
  if (!el) console.error(`[controller] Missing element: #${id}`);
  return el;
}

function recalcStick() {
  const fr = frame.getBoundingClientRect();
  const br = ball.getBoundingClientRect();

  centerX = fr.left + fr.width / 2;
  centerY = fr.top + fr.height / 2;

  const ballRadius = br.width / 2;
  maxRadius = fr.width / 2 - ballRadius - 2;
}

function setBall(dx, dy) {
  const len = Math.hypot(dx, dy);
  if (len > maxRadius && len > 0.0001) {
    const k = maxRadius / len;
    dx *= k;
    dy *= k;
  }

  ball.style.left = `calc(50% + ${dx}px)`;
  ball.style.top  = `calc(50% + ${dy}px)`;

  inputState.stickX = +(dx / maxRadius).toFixed(3);
  inputState.stickY = +(dy / maxRadius).toFixed(3);
}

function resetStick() {
  ball.style.left = "50%";
  ball.style.top  = "50%";
  inputState.stickX = 0;
  inputState.stickY = 0;
}

function bindHoldButton(id, key) {
  const btn = safeGet(id);
  if (!btn) return;

  const set = (v) => { inputState[key] = v; };

  // Touch（スマホ用）
  btn.addEventListener("touchstart", (e) => {
    e.preventDefault();
    set(true);
  }, { passive: false });

  btn.addEventListener("touchend", (e) => {
    e.preventDefault();
    set(false);
  }, { passive: false });

  btn.addEventListener("touchcancel", () => set(false), { passive: true });

  // PCテスト用
  btn.addEventListener("mousedown", () => set(true));
  window.addEventListener("mouseup", () => set(false));
}

function updateHud() {
  if (!hudTextEl) return;

  hudTextEl.textContent =
    `UP   : ${inputState.up ? "ON" : "OFF"}\n` +
    `DOWN : ${inputState.down ? "ON" : "OFF"}\n` +
    `X    : ${inputState.stickX.toFixed(3)}\n` +
    `Y    : ${inputState.stickY.toFixed(3)}`;

  requestAnimationFrame(updateHud);
}

function initStickTouchHandlers() {
  // 重要：ブラウザのスクロール/ズームを抑制
  frame.style.touchAction = "none";

  frame.addEventListener("touchstart", (e) => {
    e.preventDefault();

    // すでに別の指でスティック操作中なら無視
    if (stickTouchId !== null) return;

    const t = e.changedTouches[0];
    stickTouchId = t.identifier;

    const dx = t.clientX - centerX;
    const dy = t.clientY - centerY;
    setBall(dx, dy);
  }, { passive: false });

  frame.addEventListener("touchmove", (e) => {
    e.preventDefault();
    if (stickTouchId === null) return;

    // “操作中の指”だけを探す（これがマルチタッチの肝）
    let t = null;
    for (const touch of e.touches) {
      if (touch.identifier === stickTouchId) {
        t = touch;
        break;
      }
    }
    if (!t) return;

    const dx = t.clientX - centerX;
    const dy = t.clientY - centerY;
    setBall(dx, dy);
  }, { passive: false });

  const endStick = (e) => {
    e.preventDefault();
    if (stickTouchId === null) return;

    // 離れた指が “スティック操作中の指” ならリセット
    for (const t of e.changedTouches) {
      if (t.identifier === stickTouchId) {
        stickTouchId = null;
        resetStick();
        break;
      }
    }
  };

  frame.addEventListener("touchend", endStick, { passive: false });
  frame.addEventListener("touchcancel", endStick, { passive: false });
}

function init() {
  frame = safeGet("joystick-frame");
  ball = safeGet("joystick-ball");
  hudTextEl = safeGet("hud-text");

  if (!frame || !ball) return;

  recalcStick();
  initStickTouchHandlers();

  bindHoldButton("pad-up", "up");
  bindHoldButton("pad-down", "down");

  window.addEventListener("resize", recalcStick);
  window.addEventListener("orientationchange", () => setTimeout(recalcStick, 150));

  updateHud();
  console.log("[controller] multitouch ready");
}

init();

// 外部取得用
window.getInputState = () => ({ ...inputState });
