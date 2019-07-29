console.log("basic transform");

x = 50;
y = 25;

console.log("point global coords");
console.log(x, y);

cameraX = 25;
cameraY = 0;
cameraMatrix = TransformationMatrix.translate(cameraX, cameraY);
console.log("camera global coords");
console.log(cameraX, cameraY);

console.log("point screen coords");
console.log("expected", { x: 75, y: 25 });

point = TransformationMatrix.applyToPoint(cameraMatrix, { x: x, y: y });

console.log("actual  ", point);

console.log("----------------");
console.log("basic scale");

x = 50;
y = 25;
cameraX = 0;
cameraY = 0;
cameraScale = 2;

cameraMatrix = TransformationMatrix.scale(cameraScale);

console.log("point global coords");
console.log(x, y);
console.log("camera global coords");
console.log(cameraX, cameraY);

console.log("point screen coords");
console.log("expected", { x: 100, y: 50 });
point = TransformationMatrix.applyToPoint(cameraMatrix, { x: x, y: y });

console.log("actual  ", point);
console.log("----------------");

console.log("basic rotate");

x = 50;
y = 25;

cameraX = 0;
cameraY = 0;
cameraAngle = -90; // note the negative angle

cameraMatrix = TransformationMatrix.rotateDEG(cameraAngle);

cameraMatrix = TransformationMatrix.smoothMatrix(cameraMatrix);

console.log("point global coords");
console.log(x, y);
console.log("camera global coords");
console.log(cameraX, cameraY);

console.log("point screen coords");
console.log("expected", { x: 25, y: -50 });
point = TransformationMatrix.applyToPoint(cameraMatrix, { x: x, y: y });

console.log("actual  ", point);
console.log("----------------");

console.log("screen offset rotate");

x = 50;
y = 25;

cameraX = 0;
cameraY = 0;
cameraAngle = -180;
cameraAngleOffsetX = 100;
cameraAngleOffsetY = 0;

cameraMatrix = TransformationMatrix.rotateDEG(
  cameraAngle,
  cameraAngleOffsetX,
  cameraAngleOffsetY
);

cameraMatrix = TransformationMatrix.smoothMatrix(cameraMatrix);

console.log("point global coords");
console.log(x, y);
console.log("camera global coords");
console.log(cameraX, cameraY);

console.log("point screen coords");
console.log("expected", { x: 150, y: -25 });
point = TransformationMatrix.applyToPoint(cameraMatrix, { x: x, y: y });

console.log("actual  ", point);
console.log("----------------");

console.log("move then rotate");

screenCenterX = 250;
screenCenterY = 250;
x = 50;
y = 25;

cameraX = 0;
cameraY = 50;
cameraAngle = -90;

cameraMatrix = TransformationMatrix.compose(
  TransformationMatrix.inverse(
    TransformationMatrix.translate(cameraX, -cameraY)
  ),
  TransformationMatrix.rotateDEG(
    cameraAngle,
    cameraAngleOffsetX + cameraX,
    -(cameraAngleOffsetY + cameraY)
  ),
  TransformationMatrix.translate(cameraX, -cameraY)
);

cameraMatrix = TransformationMatrix.smoothMatrix(cameraMatrix);

console.log("point global coords");
console.log(x, y);
console.log("camera global coords");
console.log(cameraX, cameraY);

console.log("point screen coords");
console.log("expected", { x: 25, y: -50 });
point = TransformationMatrix.applyToPoint(cameraMatrix, { x: x, y: y });

console.log("actual  ", point);
console.log("----------------");

window.addEventListener("load", function() {
  svg = document.getElementById("test");
  xAxisSVG = document.createElementNS("http://www.w3.org/2000/svg", "line");

  xAxisSVG.setAttribute("x1", screenCenterX);
  xAxisSVG.setAttribute("y1", screenCenterY);
  xAxisSVG.setAttribute("x2", screenCenterX + 100);
  xAxisSVG.setAttribute("y2", screenCenterY);
  xAxisSVG.setAttribute("stroke-width", "1px");
  xAxisSVG.setAttribute("stroke", "black");
  xAxisSVG.setAttribute("marker-end", "url(#arrow)");

  svg.appendChild(xAxisSVG);

  yAxisSVG = document.createElementNS("http://www.w3.org/2000/svg", "line");

  yAxisSVG.setAttribute("x1", screenCenterX);
  yAxisSVG.setAttribute("y1", screenCenterY);
  yAxisSVG.setAttribute("x2", screenCenterX);
  yAxisSVG.setAttribute("y2", screenCenterY + 100);
  yAxisSVG.setAttribute("stroke-width", "1px");
  yAxisSVG.setAttribute("stroke", "black");
  yAxisSVG.setAttribute("marker-end", "url(#arrow)");

  svg.appendChild(yAxisSVG);

  cameraMarker = document.createElementNS("http://www.w3.org/2000/svg", "line");

  cameraMarker.setAttribute("x1", cameraX + screenCenterX);
  cameraMarker.setAttribute("y1", cameraY + screenCenterY);
  cameraMarker.setAttribute("x2", cameraX + screenCenterX + 1);
  cameraMarker.setAttribute("y2", cameraY + screenCenterY);
  cameraMarker.setAttribute("stroke-width", "2px");
  cameraMarker.setAttribute("stroke", "blue");
  cameraMarker.setAttribute("marker-end", "url(#arrow)");

  svg.appendChild(cameraMarker);

  pointMarker = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "circle"
  );

  pointMarker.setAttribute("cx", x + screenCenterX);
  pointMarker.setAttribute("cy", y + screenCenterY);
  pointMarker.setAttribute("r", 5);
  pointMarker.setAttribute("fill", "red");

  svg.appendChild(pointMarker);
});
