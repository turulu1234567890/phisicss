const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const repelRadiusInput = document.getElementById("repelRadius");
const repelStrengthInput = document.getElementById("repelStrength");
const repelRadiusVal = document.getElementById("repelRadiusVal");
const repelStrengthVal = document.getElementById("repelStrengthVal");
const spawnOnRelease = document.getElementById("spawnOnRelease");
const resetBtn = document.getElementById("resetBtn");
const ballCountDisplay = document.getElementById("ballCountDisplay");

let balls = [];
let mouse = { x: 0, y: 0, down: false };

function resize() {
  canvas.width = innerWidth;
  canvas.height = innerHeight;
}
window.addEventListener("resize", resize);
resize();

repelRadiusVal.textContent = repelRadiusInput.value;
repelStrengthVal.textContent = repelStrengthInput.value;

repelRadiusInput.oninput = () =>
  repelRadiusVal.textContent = repelRadiusInput.value;

repelStrengthInput.oninput = () =>
  repelStrengthVal.textContent = repelStrengthInput.value;

canvas.addEventListener("pointerdown", e => {
  mouse.down = true;
  mouse.x = e.clientX;
  mouse.y = e.clientY;
});

canvas.addEventListener("pointerup", e => {
  mouse.down = false;
  if (spawnOnRelease.checked) spawnBall(e.clientX, e.clientY);
});

canvas.addEventListener("pointermove", e => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
});

resetBtn.onclick = () => {
  balls.length = 0;
};

function spawnBall(x, y) {
  balls.push({
    x, y,
    vx: (Math.random() - 0.5) * 4,
    vy: (Math.random() - 0.5) * 4,
    r: 6 + Math.random() * 6
  });
}

function update() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const repelRadius = +repelRadiusInput.value;
  const repelStrength = +repelStrengthInput.value;

  for (const b of balls) {
    const dx = b.x - mouse.x;
    const dy = b.y - mouse.y;
    const d = Math.hypot(dx, dy);

    if (mouse.down && d < repelRadius && d > 0.1) {
      const f = repelStrength / (d * d);
      b.vx += (dx / d) * f * 0.016;
      b.vy += (dy / d) * f * 0.016;
    }

    b.x += b.vx;
    b.y += b.vy;
    b.vx *= 0.99;
    b.vy *= 0.99;

    if (b.x < b.r || b.x > canvas.width - b.r) b.vx *= -1;
    if (b.y < b.r || b.y > canvas.height - b.r) b.vy *= -1;

    ctx.beginPath();
    ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
    ctx.fillStyle = "#6cf";
    ctx.fill();
  }

  ballCountDisplay.textContent = balls.length;
  requestAnimationFrame(update);
}

update();
