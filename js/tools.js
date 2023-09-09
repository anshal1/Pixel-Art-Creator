const rect_tool = document.querySelector(".rect_tool");
const eraser = document.querySelector(".eraser");
const dropdown = document.querySelector(".drop-down");
const NewFile = document.querySelector("#new-file");
let any_tool_selected = false;
let rect_tool_selected = false;
let eraser_selected = false;
let start_position_x = 0;
let start_position_y = 0;
let end_positon_x = 0;
let end_positon_y = 0;
let show_rect_preview = false;
let globalColor = ColorPicker() || "black";
gridSquare_Size = Number(localStorage.getItem("size")) || 16;
rect_tool.addEventListener("click", () => {
  rect_tool_selected = !rect_tool_selected;
  eraser_selected = false;
  any_tool_selected = true;
});
eraser.addEventListener("click", () => {
  rect_tool_selected = false;
  eraser_selected = !eraser_selected;
  any_tool_selected = true;
});
// getting the starting line/position of the square
canvas.addEventListener("mousedown", (e) => {
  if (!rect_tool_selected) return;
  globalColor = ColorPicker() || "black";
  show_rect_preview = true;
  ctx.fillStyle = globalColor;
  const startline_x = Math.round(
    (e.offsetX - gridSquare_Size / 2) / gridSquare_Size
  );
  const startline_y = Math.round(
    (e.offsetY - gridSquare_Size / 2) / gridSquare_Size
  );
  start_position_x = startline_x * gridSquare_Size;
  start_position_y = startline_y * gridSquare_Size;
});
canvas.addEventListener("mouseup", (e) => {
  if (!rect_tool_selected) return;
  show_rect_preview = false;
  DrawRect(e);
});
canvas.addEventListener("mousemove", (e) => {
  if (!show_rect_preview) return;
  DrawRect(e);
});
function DrawRect(e) {
  // getting the end line of the square/ end position
  const end_x = Math.round((e.offsetX - gridSquare_Size / 2) / gridSquare_Size);
  const end_y = Math.round((e.offsetY - gridSquare_Size / 2) / gridSquare_Size);
  end_positon_x = end_x * gridSquare_Size;
  end_positon_y = end_y * gridSquare_Size;
  // finding the difference between start and end point to check how many squares can fit between them
  const diff = end_positon_x + gridSquare_Size - start_position_x;
  const diff_x = end_positon_y + gridSquare_Size - start_position_y;
  // getting the width and height of the square by multiplying the number of square that can
  // fit by the grid square size
  const x_width = Math.round(diff / gridSquare_Size) * gridSquare_Size;
  const y_width = Math.round(diff_x / gridSquare_Size) * gridSquare_Size;
  ctx.fillRect(start_position_x, start_position_y, x_width, y_width);
  UndoAndRedo({
    x: start_position_x,
    y: start_position_y,
    color: globalColor,
    width: x_width,
    height: y_width,
  });
}

function showDropdown() {
  if (dropdown.style.display === "block") {
    dropdown.style.display = "none";
  } else {
    dropdown.style.display = "block";
  }
}
function newFile() {
  NewFile.click();
}
NewFile.addEventListener("change", (e) => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const image = new Image();
  image.width = canvas.width.toString();
  image.height = canvas.height.toString();
  image.style.display = "block";
  const reader = new FileReader();
  reader.onload = (event) => {
    image.src = event.target.result;
  };
  reader.readAsDataURL(e.target.files[0]);
  image.onload = () => {
    ctx.drawImage(image, 0, 0, image.width, image.height);
  };
});
