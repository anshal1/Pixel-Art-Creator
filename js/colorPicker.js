const color_picker = document.querySelector(".color-picker");
let color = "";
color_picker.addEventListener("change", (e) => {
  color = e.target.value;
});
function ColorPicker() {
  return color;
}
