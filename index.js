const canvas = document.querySelector("#canvas");
const grid_size_input = document.querySelector(".grid-size");
const canvas_width = document.querySelector(".width");
const canvas_height = document.querySelector(".height");
canvas.width = 500;
canvas.height = 500;
const ctx = canvas.getContext("2d");
ctx.fillStyle = "white";
ctx.fillRect(0, 0, canvas.width, canvas.height);
let gridSquare_Size = localStorage.getItem("size") || 16;
const gridLineWidth = 1;
const undoArray = [];
const redoArray = [];
let GlobalColor = "black";
let scale_canvas = 1;
console.log(ctx);
function confirm_size() {
  canvas.width = Number(canvas_width.value);
  canvas.height = Number(canvas_height.value);
  document.querySelector(".modal").style.display = "none";
  drawGrid(gridSquare_Size);
}
grid_size_input.addEventListener("change", (e) => {
  if (!e.target.value) return;
  gridSquare_Size = Number(e.target.value);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  localStorage.setItem("size", gridSquare_Size);
  drawGrid(e.target.value);
});
function drawGrid(gridSquareSize) {
  gridSquareSize = Number(gridSquareSize);
  if (!gridSquareSize) return;
  const number_of_horizontal_grid = canvas.height / gridSquareSize;
  const number_of_vertical_grid = canvas.width / gridSquareSize;
  canvas.width = Math.round(
    number_of_horizontal_grid * (gridSquareSize - gridLineWidth)
  );
  canvas.height = Math.round(
    number_of_vertical_grid * (gridSquareSize - gridLineWidth)
  );
  for (let i = 1; i <= Math.round(number_of_horizontal_grid); i++) {
    ctx.lineWidth = gridLineWidth;
    ctx.beginPath();
    ctx.moveTo(0, i * gridSquareSize);
    ctx.lineTo(canvas.width, i * gridSquareSize);
    ctx.closePath();
    ctx.stroke();
  }
  for (let j = 1; j <= Math.round(number_of_vertical_grid); j++) {
    ctx.lineWidth = gridLineWidth;
    ctx.beginPath();
    ctx.moveTo(j * gridSquareSize, 0);
    ctx.lineTo(j * gridSquareSize, canvas.height);
    ctx.stroke();
    ctx.closePath();
  }
}
canvas.addEventListener("click", (e) => {
  // erasing a single grid square
  if (eraser_selected) {
    Erase(e);
  }
  if (any_tool_selected) return;
  let color = "black";
  if (ColorPicker()) {
    color = ColorPicker();
    GlobalColor = ColorPicker();
  }
  const x_position = Position(e).x;
  const y_position = Position(e).y;
  ctx.fillStyle = color;
  ctx.fillRect(x_position, y_position, gridSquare_Size, gridSquare_Size);
  UndoAndRedo({
    x: x_position,
    y: y_position,
    color,
    width: gridSquare_Size,
    height: gridSquare_Size,
  });
});
function UndoAndRedo(gridData) {
  if (undoArray.length > 50) {
    undoArray.pop();
  }
  if (redoArray.length > 50) {
    redoArray.pop();
  }
  undoArray.push(gridData);
  redoArray.push(gridData);
}
function undoAction() {
  const toUndo = undoArray[undoArray.length - 1];
  ctx.clearRect(
    toUndo.x + gridLineWidth,
    toUndo.y + gridLineWidth,
    toUndo.width - gridLineWidth,
    toUndo.height - gridLineWidth
  );
  undoArray.pop();
  drawGrid(gridSquare_Size || localStorage.getItem("size"));
  redoArray.push(toUndo);
}
function redoAction() {
  const toredo = redoArray[redoArray.length - 1];
  ctx.fillStyle = GlobalColor;
  ctx.fillRect(toredo.x, toredo.y, toredo.width, toredo.height);
  redoArray.pop();
  undoArray.push(toredo);
}
window.addEventListener("keydown", (event) => {
  if (event.ctrlKey && event.key === "z") {
    undoAction();
  }
  if (event.ctrlKey && event.key === "y") {
    redoAction();
  }
  if (event.ctrlKey && event.key === "q") {
    scale_canvas += 0.3;
    canvas.style.transform = `scale(${scale_canvas})`;
    console.log(scale_canvas);
  }
  if (event.ctrlKey && event.key === "a") {
    scale_canvas -= 0.3;
    canvas.style.transform = `scale(${scale_canvas})`;
    console.log(scale_canvas);
  }
});

function Erase(e) {
  const x_position = Position(e).x;
  const y_position = Position(e).y;
  ctx.clearRect(
    x_position + gridLineWidth,
    y_position + gridLineWidth,
    gridSquare_Size - (gridLineWidth + 1),
    gridSquare_Size - (gridLineWidth + 1)
  );
}

function Save() {
  const ImageData = canvas.toDataURL("image/png", 1);
  const a_tag = document.createElement("a");
  a_tag.download =
    "Pixel-Art-Creator " +
    Date.now() +
    ` ${gridSquare_Size} x ${gridSquare_Size}` +
    ".png";
  a_tag.href = ImageData;
  a_tag.click();
  alert("Saved_successfully");
}
