const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");


function resizeCanvas() {
  canvas.width = canvas.clientWidth;
  canvas.height = canvas.clientHeight;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);


let drawing = false;
let currentTool = "pen";
let color = "#000000";
let size = 5;
let startX = 0;
let startY = 0;
let snapshot = null;


document.querySelectorAll(".toolbar button").forEach(btn => {
  btn.addEventListener("click", () => {
    currentTool = btn.dataset.tool;
    console.log("Tool:", currentTool); // DEBUG

    if (currentTool === "text") canvas.style.cursor = "text";
    else canvas.style.cursor = "crosshair";
  });
});


document.getElementById("colorPicker").addEventListener("change", e => {
  color = e.target.value;
});

document.getElementById("brushSize").addEventListener("input", e => {
  size = e.target.value;
});

canvas.addEventListener("mousedown", e => {
  drawing = true;
  startX = e.offsetX;
  startY = e.offsetY;

  ctx.strokeStyle = color;
  ctx.lineWidth = size;
  ctx.beginPath();
  ctx.moveTo(startX, startY);

  snapshot = ctx.getImageData(0, 0, canvas.width, canvas.height);
});


canvas.addEventListener("mousemove", e => {
  if (!drawing) return;

  const x = e.offsetX;
  const y = e.offsetY;

  ctx.strokeStyle = color;
  ctx.lineWidth = size;

  if (currentTool === "pen") {
    ctx.lineTo(x, y);
    ctx.stroke();
  }

  else if (currentTool === "eraser") {
    ctx.clearRect(x - size, y - size, size * 2, size * 2);
  }

  else if (currentTool === "line") {
    ctx.putImageData(snapshot, 0, 0);
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(x, y);
    ctx.stroke();
  }

  else if (currentTool === "rect") {
    ctx.putImageData(snapshot, 0, 0);
    ctx.strokeRect(startX, startY, x - startX, y - startY);
  }

else if (currentTool === "circle") {
    ctx.putImageData(snapshot, 0, 0);
    const radius = Math.hypot(x - startX, y - startY);
    ctx.beginPath();
    ctx.arc(startX, startY, radius, 0, Math.PI * 2);
    ctx.stroke();
  }
});

canvas.addEventListener("mouseup", () => {
  drawing = false;
});

document.getElementById("clearBtn").addEventListener("click", () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
});
window.addEventListener("load", () => {
  const data = localStorage.getItem("savedDrawing");
  if (!data) return;

  const img = new Image();
  img.onload = () => {
    ctx.drawImage(img, 0, 0);
  };
  img.src = data;
});
document.getElementById("saveBtn").addEventListener("click", () => {
  const data = canvas.toDataURL("image/png");
  localStorage.setItem("savedDrawing", data);
  alert("Drawing saved. You can continue later!");
});


document.getElementById("loadBtn").addEventListener("click", () => {
  const data = localStorage.getItem("savedDrawing");

  if (!data) {
    alert("No saved drawing found");
    return;
  }

  const img = new Image();
  img.onload = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0);
  };
  img.src = data;
});


