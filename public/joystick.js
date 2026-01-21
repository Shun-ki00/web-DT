let joystickBall;
let joystickCenterX;
let joystickCenterY;
let joystickLimitNumber = 35;

const init = () => {
  setupJoystick();
};

const setupJoystick = () => {
  joystickBall = document.getElementById("joystick-ball");
  joystickCenterX =
    joystickBall.getBoundingClientRect().left + joystickBall.clientWidth / 2;
  joystickCenterY =
    joystickBall.getBoundingClientRect().top + joystickBall.clientHeight / 2;
  joystickBall.addEventListener("touchmove", dragMove);
  joystickBall.addEventListener("touchend", dragLeave);
};

const dragMove = (event) => {
  event.preventDefault();

  const pageX = event.touches[0].pageX;
  const pageY = event.touches[0].pageY;

  let touchX =
    Math.abs(pageX - joystickCenterX) < joystickLimitNumber
      ? pageX - joystickCenterX
      : pageX - joystickCenterX > 0
      ? joystickLimitNumber
      : -joystickLimitNumber;

  let touchY =
    Math.abs(pageY - joystickCenterY) < joystickLimitNumber
      ? pageY - joystickCenterY
      : pageY - joystickCenterY > 0
      ? joystickLimitNumber
      : -joystickLimitNumber;

  joystickBall.style.left = `calc(50% + ${touchX}px)`;
  joystickBall.style.top = `calc(50% + ${touchY}px)`;
};

const dragLeave = () => {
  joystickBall.style.top = "50%";
  joystickBall.style.left = "50%";
};

init();

window.addEventListener("resize", () => {
  joystickCenterX =
    joystickBall.getBoundingClientRect().left + joystickBall.clientWidth / 2;
  joystickCenterY =
    joystickBall.getBoundingClientRect().top + joystickBall.clientHeight / 2;
});