const bodyRec = document.body.getBoundingClientRect();

const canvas = document.createElement("canvas");
const context = canvas.getContext("2d");

canvas.height = bodyRec.height;
canvas.width = bodyRec.width;

document.body.appendChild(canvas);

// GRAV

const grav = document.getElementById("grav");
// if (!grav) return;
const gravRec = grav.getBoundingClientRect();

let acc = {
  x: 0,
  y: 0,
};

const bounce = 1.5;
function gravity(div) {
  document.body.appendChild(div);
  div.style.position = "absolute";
  div.style.left = 300 + "px";
  div.style.top = 300 + "px";

  let once = false;
  setInterval(() => {
    const rec = div.getBoundingClientRect();
    if (isDragging) {
      acc.x = 0;
      acc.y = 0;
      return;
    }
    context.fillStyle = "white";
    context.strokeStyle = "white";
    context.fillRect(rec.x + 20, rec.y + 20, 5, 5);
    if (acc.y < 0) acc.y -= 0.001;
    if (acc.y > 0) acc.y += 0.001;
    if (acc.x > 0) acc.x -= 0.001;
    if (acc.x < 0) acc.x += 0.001;

    const gX = gravRec.x;
    const gY = gravRec.y;

    if (!once) {
      acc.x += (gX - rec.x) / 1000;
      acc.y += (gY - rec.y) / 1000;
      // once = true;
    }

    if (bodyRec.bottom <= rec.bottom + acc.y) {
      acc.y = (-1 * acc.y) / bounce;
      return;
    }
    if (bodyRec.left >= rec.left + acc.x) {
      acc.x = (-1 * acc.x) / bounce;
      return;
    }

    if (bodyRec.right <= rec.right + acc.x) {
      acc.x = (-1 * acc.x) / bounce;
      return;
    }
    if (bodyRec.top >= rec.top + acc.y) {
      acc.y = (-1 * acc.y) / bounce;
      return;
    }

    div.style.top = rec.top + acc.y + "px";
    div.style.left = rec.left + acc.x + "px";
  });
}

const div = document.createElement("div");
gravity(div);

let isDragging = false;
let diffX = 0;
let diffY = 0;
let mouseX = 0;
let mouseY = 0;
div.onmousedown = (e) => {
  isDragging = true;
  console.log(e.clientX, e.clientY);
  const x = div.getBoundingClientRect();

  diffX = e.clientX - x.left;
  diffY = e.clientY - x.top;
};

document.body.onmousemove = (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  if (!isDragging) return;

  mQueue.push({ mouseX, mouseY });

  div.style.left = mouseX - diffX + "px";
  div.style.top = mouseY - diffY + "px";
};

document.onmouseup = () => {
  if (!isDragging) return;
  isDragging = false;

  let ySum = 0;
  let xSum = 0;
  for (let i = Math.round(mQueue.length / 2); i < mQueue.length; i++) {
    ySum += mQueue[i].mouseY - mQueue[i - 1].mouseY;
    xSum += mQueue[i].mouseX - mQueue[i - 1].mouseX;
  }
  const yAvg = ySum / mQueue.length;
  const xAvg = xSum / mQueue.length;

  // acc.y = yAvg > 3 ? 3 : yAvg < -3 ? -3 : yAvg;
  // acc.x = xAvg > 3 ? 3 : xAvg < -3 ? -3 : xAvg;
  acc.y = yAvg;
  acc.x = xAvg;

  mQueue = [];
};
const avg = { mouseX, mouseY };

let mQueue = [];

document.onkeydown = (e) => {
  const fact = 10;
  console.log("here");
  if (e.key === "ArrowRight") acc.x = +fact;
  if (e.key === "ArrowLeft") acc.x = -fact;
  if (e.key === "ArrowUp") acc.y = -fact;
  if (e.key === "ArrowDown") acc.y = +fact;
};
setInterval(() => {
  //   const clone = div.cloneNode();
  //   clone.style.pointerEvents = "none";
  //   clone.style.backgroundColor = "blue";
  //   clone.style.height = "5px";
  //   clone.style.width = "5px";
  //   document.body.appendChild(clone);
});
