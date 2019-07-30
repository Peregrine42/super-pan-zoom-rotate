window.addEventListener("load", function() {
  svg = document.getElementById("global");
  cameraSVG = document.getElementById("camera");

  // Global setup

  screenMatrix = TransformationMatrix.translate(
    svg.getAttribute("width") / 2,
    svg.getAttribute("height") / 2
  );
  screenCenter = TransformationMatrix.applyToPoint(screenMatrix, {
    x: 0,
    y: 0
  });

  xAxisSVG = document.createElementNS("http://www.w3.org/2000/svg", "line");

  xAxisSVG.setAttribute("x1", screenCenter.x);
  xAxisSVG.setAttribute("y1", screenCenter.y);
  xAxisSVG.setAttribute("x2", screenCenter.x + 100);
  xAxisSVG.setAttribute("y2", screenCenter.y);
  xAxisSVG.setAttribute("stroke-width", "1px");
  xAxisSVG.setAttribute("stroke", "black");
  xAxisSVG.setAttribute("marker-end", "url(#arrow)");

  svg.appendChild(xAxisSVG);

  yAxisSVG = document.createElementNS("http://www.w3.org/2000/svg", "line");

  yAxisSVG.setAttribute("x1", screenCenter.x);
  yAxisSVG.setAttribute("y1", screenCenter.y);
  yAxisSVG.setAttribute("x2", screenCenter.x);
  yAxisSVG.setAttribute("y2", screenCenter.y + 100);
  yAxisSVG.setAttribute("stroke-width", "1px");
  yAxisSVG.setAttribute("stroke", "black");
  yAxisSVG.setAttribute("marker-end", "url(#arrow)");

  svg.appendChild(yAxisSVG);

  // Camera setup

  screenMatrix = TransformationMatrix.translate(
    cameraSVG.getAttribute("width") / 2,
    cameraSVG.getAttribute("height") / 2
  );
  screenCenter = TransformationMatrix.applyToPoint(screenMatrix, {
    x: 0,
    y: 0
  });

  xAxisSVG = document.createElementNS("http://www.w3.org/2000/svg", "line");

  xAxisSVG.setAttribute("x1", screenCenter.x);
  xAxisSVG.setAttribute("y1", screenCenter.y);
  xAxisSVG.setAttribute("x2", screenCenter.x + 100);
  xAxisSVG.setAttribute("y2", screenCenter.y);
  xAxisSVG.setAttribute("stroke-width", "1px");
  xAxisSVG.setAttribute("stroke", "black");
  xAxisSVG.setAttribute("marker-end", "url(#arrow)");

  cameraSVG.appendChild(xAxisSVG);

  yAxisSVG = document.createElementNS("http://www.w3.org/2000/svg", "line");

  yAxisSVG.setAttribute("x1", screenCenter.x);
  yAxisSVG.setAttribute("y1", screenCenter.y);
  yAxisSVG.setAttribute("x2", screenCenter.x);
  yAxisSVG.setAttribute("y2", screenCenter.y + 100);
  yAxisSVG.setAttribute("stroke-width", "1px");
  yAxisSVG.setAttribute("stroke", "black");
  yAxisSVG.setAttribute("marker-end", "url(#arrow)");

  cameraSVG.appendChild(yAxisSVG);

  list = {
    x: 0, // camera coordinates (these stay at 0)
    y: 0,
    angle: 0,
    angleCenterX: 0, // touch devices need to pivot
    angleCenterY: 0, // around a non-central origin
    scale: 1,
    svg: document.createElementNS("http://www.w3.org/2000/svg", "line"),
    cameraSVG: document.createElementNS("http://www.w3.org/2000/svg", "line"),
    child: {
      x: 50, // origin coordinates
      y: 60,
      angle: 0,
      angleCenterX: 0,
      angleCenterY: 0,
      scale: 1,
      svg: document.createElementNS("http://www.w3.org/2000/svg", "line"),
      cameraSVG: document.createElementNS("http://www.w3.org/2000/svg", "line"),
      child: {
        x: 30, // global coordinates
        y: 15,
        child: null,
        angle: 0,
        angleCenterX: 0,
        angleCenterY: 0,
        scale: 1,
        svg: document.createElementNS("http://www.w3.org/2000/svg", "line"),
        cameraSVG: document.createElementNS(
          "http://www.w3.org/2000/svg",
          "line"
        )
      }
    }
  };

  camera = list;
  origin = camera.child;
  point = origin.child;

  svg.appendChild(origin.svg);
  svg.appendChild(point.svg);

  cameraSVG.appendChild(camera.cameraSVG);
  cameraSVG.appendChild(origin.cameraSVG);
  cameraSVG.appendChild(point.cameraSVG);

  function draw(node, originMatrix, attribute) {
    if (node == null) return;

    nodeSVG = node[attribute];

    nodeSVG.setAttribute("x1", 0);
    nodeSVG.setAttribute("y1", 0);
    nodeSVG.setAttribute("x2", node.x);
    nodeSVG.setAttribute("y2", node.y);
    nodeSVG.setAttribute("transform", TransformationMatrix.toCSS(originMatrix));
    nodeSVG.setAttribute("stroke-width", "1px");
    nodeSVG.setAttribute("stroke", "black");
    nodeSVG.setAttribute("marker-start", "url(#dot)");
    nodeSVG.setAttribute("marker-end", "url(#dot)");

    newMatrix = TransformationMatrix.compose(
      originMatrix,
      TransformationMatrix.translate(node.x, node.y),
      TransformationMatrix.rotateDEG(
        node.angle,
        node.angleCenterX,
        node.angleCenterY
      ),
      TransformationMatrix.scale(node.scale)
    );
    draw(node.child, newMatrix, attribute);
  }

  draw(point, screenMatrix, "svg");
  draw(camera, screenMatrix, "cameraSVG");

  window.addEventListener("keyup", function(event) {
    if (event.key === "ArrowLeft") {
      origin.x += 5;
      draw(point, screenMatrix, "svg");
      draw(camera, screenMatrix, "cameraSVG");
    } else if (event.key === "ArrowRight") {
      origin.x -= 5;
      draw(point, screenMatrix, "svg");
      draw(camera, screenMatrix, "cameraSVG");
    } else if (event.key === "ArrowUp") {
      origin.y -= 5;
      draw(point, screenMatrix, "svg");
      draw(camera, screenMatrix, "cameraSVG");
    } else if (event.key === "ArrowDown") {
      origin.y += 5;
      draw(point, screenMatrix, "svg");
      draw(camera, screenMatrix, "cameraSVG");
    } else if (event.key === "[") {
      camera.angle -= 5;
      draw(point, screenMatrix, "svg");
      draw(camera, screenMatrix, "cameraSVG");
    } else if (event.key === "]") {
      camera.angle += 5;
      draw(point, screenMatrix, "svg");
      draw(camera, screenMatrix, "cameraSVG");
    } else if (event.key === "=") {
      camera.scale *= 1.1;
      draw(point, screenMatrix, "svg");
      draw(camera, screenMatrix, "cameraSVG");
    } else if (event.key === "-") {
      camera.scale *= 0.9;
      draw(point, screenMatrix, "svg");
      draw(camera, screenMatrix, "cameraSVG");
    }
  });
});
