function Position(e) {
  // finding the x position for drawing the square
  // dividing the mouse position by the width of the grid square to get the closest line to the grid
  // then multiplying that line number by grid square size to get tje x position of the sqaure
  // Same algorithm for y position
  // subtracting gridsqquare from offset to avoid rounding error
  // to visualize this try to draw a grid box after removing that line
  const horizantal_line = Math.round(
    (e.offsetX - gridSquare_Size / 2) / gridSquare_Size
  );
  const vertical_line = Math.round(
    (e.offsetY - gridSquare_Size / 2) / gridSquare_Size
  );
  const x_position = horizantal_line * gridSquare_Size;
  const y_position = vertical_line * gridSquare_Size;
  return { x: x_position, y: y_position };
}
