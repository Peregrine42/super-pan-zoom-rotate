window.addEventListener("load", function() {
  svg = document.getElementById("global");
  cameraSVG = document.getElementById("camera");

  // Global setup

  var svgRect = svg.getBoundingClientRect();

  globalScreenMatrix = TransformationMatrix.identity();
  screenCenter = TransformationMatrix.applyToPoint(globalScreenMatrix, {
    x: 0,
    y: 0
  });

  xAxisSVG = document.createElementNS("http://www.w3.org/2000/svg", "line");

  xAxisSVG.setAttribute("x1", 0);
  xAxisSVG.setAttribute("y1", 0);
  xAxisSVG.setAttribute("x2", 30);
  xAxisSVG.setAttribute("y2", 0);
  xAxisSVG.setAttribute("stroke-width", "1px");
  xAxisSVG.setAttribute("stroke", "black");
  xAxisSVG.setAttribute("marker-end", "url(#arrow)");
  xAxisSVG.setAttribute(
    "transform",
    TransformationMatrix.toCSS(globalScreenMatrix)
  );

  svg.appendChild(xAxisSVG);

  yAxisSVG = document.createElementNS("http://www.w3.org/2000/svg", "line");

  yAxisSVG.setAttribute("x1", 0);
  yAxisSVG.setAttribute("y1", 0);
  yAxisSVG.setAttribute("x2", 0);
  yAxisSVG.setAttribute("y2", 30);
  yAxisSVG.setAttribute("stroke-width", "1px");
  yAxisSVG.setAttribute("stroke", "black");
  yAxisSVG.setAttribute("marker-end", "url(#arrow)");
  yAxisSVG.setAttribute(
    "transform",
    TransformationMatrix.toCSS(globalScreenMatrix)
  );

  svg.appendChild(yAxisSVG);

  // Camera setup
  var svgRect = svg.getBoundingClientRect();

  cameraScreenMatrix = TransformationMatrix.identity();
  screenCenter = TransformationMatrix.applyToPoint(cameraScreenMatrix, {
    x: 0,
    y: 0
  });

  xAxisSVG = document.createElementNS("http://www.w3.org/2000/svg", "line");

  xAxisSVG.setAttribute("x1", 0);
  xAxisSVG.setAttribute("y1", 0);
  xAxisSVG.setAttribute("x2", 30);
  xAxisSVG.setAttribute("y2", 0);
  xAxisSVG.setAttribute("stroke-width", "1px");
  xAxisSVG.setAttribute("stroke", "black");
  xAxisSVG.setAttribute("marker-end", "url(#arrow)");
  xAxisSVG.setAttribute(
    "transform",
    TransformationMatrix.toCSS(cameraScreenMatrix)
  );

  cameraSVG.appendChild(xAxisSVG);

  yAxisSVG = document.createElementNS("http://www.w3.org/2000/svg", "line");

  yAxisSVG.setAttribute("x1", 0);
  yAxisSVG.setAttribute("y1", 0);
  yAxisSVG.setAttribute("x2", 0);
  yAxisSVG.setAttribute("y2", 30);
  yAxisSVG.setAttribute("stroke-width", "1px");
  yAxisSVG.setAttribute("stroke", "black");
  yAxisSVG.setAttribute("marker-end", "url(#arrow)");
  yAxisSVG.setAttribute(
    "transform",
    TransformationMatrix.toCSS(cameraScreenMatrix)
  );

  cameraSVG.appendChild(yAxisSVG);

  list = {
    x: 0, // camera coordinates (these stay at 0)
    y: 0,
    angle: 0,
    angleCenterX: 50, // touch devices need to pivot
    angleCenterY: 50, // around a non-central origin
    scale: 1,
    scaleCenterX: 0,
    scaleCenterY: 0,
    svg: document.createElementNS("http://www.w3.org/2000/svg", "line"),
    cameraSVG: document.createElementNS("http://www.w3.org/2000/svg", "line"),
    child: {
      x: 0, // origin coordinates
      y: 0,
      angle: 0,
      angleCenterX: 0,
      angleCenterY: 0,
      scale: 1,
      scaleCenterX: 0,
      scaleCenterY: 0,
      svg: document.createElementNS("http://www.w3.org/2000/svg", "line"),
      cameraSVG: document.createElementNS("http://www.w3.org/2000/svg", "line"),
      child: {
        x: 0, // global coordinates
        y: 0,
        child: null,
        angle: 0,
        angleCenterX: 0,
        angleCenterY: 0,
        scale: 1,
        scaleCenterX: 0,
        scaleCenterY: 0,
        svg: document.createElementNS("http://www.w3.org/2000/svg", "line"),
        cameraSVG: document.createElementNS(
          "http://www.w3.org/2000/svg",
          "line"
        ),
        clientDOM: document.getElementById("client")
      }
    }
  };

  var clientRect = document.getElementById("client").getBoundingClientRect();

  clientScreenMatrix = TransformationMatrix.identity();

  camera = list;
  origin = camera.child;
  point = origin.child;

  svg.appendChild(origin.svg);
  svg.appendChild(point.svg);

  cameraSVG.appendChild(camera.cameraSVG);
  cameraSVG.appendChild(origin.cameraSVG);
  cameraSVG.appendChild(point.cameraSVG);

  var elements = [
    camera.svg,
    origin.svg,
    point.svg,
    camera.cameraSVG,
    origin.cameraSVG,
    point.cameraSVG
  ];
  for (var i = 0; i < elements.length; i++) {
    var element = elements[i];
    element.setAttribute("stroke-width", "1px");
    element.setAttribute("stroke", "black");
    element.setAttribute("marker-start", "url(#dot)");
    element.setAttribute("marker-end", "url(#dot)");
  }

  function draw(node, originMatrix, attribute) {
    if (node == null) return;

    nodeSVG = node[attribute];

    if (nodeSVG) {
      nodeSVG.setAttribute("x1", 0);
      nodeSVG.setAttribute("y1", 0);
      nodeSVG.setAttribute("x2", node.x);
      nodeSVG.setAttribute("y2", node.y);
      nodeSVG.style.transform = TransformationMatrix.toCSS(originMatrix);
    }

    newMatrix = TransformationMatrix.compose(
      originMatrix,
      TransformationMatrix.translate(node.angleCenterX, node.angleCenterY),
      TransformationMatrix.rotateDEG(node.angle),
      TransformationMatrix.translate(-node.angleCenterX, -node.angleCenterY),
      TransformationMatrix.translate(node.scaleCenterX, node.scaleCenterY),
      TransformationMatrix.scale(node.scale),
      TransformationMatrix.translate(-node.scaleCenterX, -node.scaleCenterY),
      TransformationMatrix.translate(node.x, node.y)
    );
    draw(node.child, newMatrix, attribute);
  }

  draw(point, globalScreenMatrix, "svg");
  draw(camera, cameraScreenMatrix, "cameraSVG");
  draw(camera, clientScreenMatrix, "clientDOM");

  window.addEventListener(
    "keydown",
    function(e) {
      // arrow keys
      if ([37, 38, 39, 40].indexOf(e.keyCode) > -1) {
        e.preventDefault();
      }
    },
    false
  );

  window.addEventListener("keyup", function(event) {
    cameraMatrix = TransformationMatrix.inverse(
      TransformationMatrix.compose(
        TransformationMatrix.rotateDEG(camera.angle),
        TransformationMatrix.scale(camera.scale),
        TransformationMatrix.translate(camera.x, camera.y)
      )
    );

    if (event.key === "ArrowLeft") {
      event.preventDefault();
      event.stopPropagation();

      offset = TransformationMatrix.applyToPoint(cameraMatrix, {
        x: 5,
        y: 0
      });

      origin.x += offset.x;
      origin.y += offset.y;
      draw(point, globalScreenMatrix, "svg");
      draw(camera, cameraScreenMatrix, "cameraSVG");
      draw(camera, clientScreenMatrix, "clientDOM");
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      event.stopPropagation();

      offset = TransformationMatrix.applyToPoint(cameraMatrix, {
        x: -5,
        y: 0
      });

      origin.x += offset.x;
      origin.y += offset.y;
      draw(point, globalScreenMatrix, "svg");
      draw(camera, cameraScreenMatrix, "cameraSVG");
      draw(camera, clientScreenMatrix, "clientDOM");
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      event.stopPropagation();

      offset = TransformationMatrix.applyToPoint(cameraMatrix, {
        x: 0,
        y: 5
      });

      origin.x += offset.x;
      origin.y += offset.y;
      draw(point, globalScreenMatrix, "svg");
      draw(camera, cameraScreenMatrix, "cameraSVG");
      draw(camera, clientScreenMatrix, "clientDOM");
    } else if (event.key === "ArrowDown") {
      event.preventDefault();
      event.stopPropagation();

      offset = TransformationMatrix.applyToPoint(cameraMatrix, {
        x: 0,
        y: -5
      });

      origin.x += offset.x;
      origin.y += offset.y;
      draw(point, globalScreenMatrix, "svg");
      draw(camera, cameraScreenMatrix, "cameraSVG");
      draw(camera, clientScreenMatrix, "clientDOM");
    } else if (event.key === "[") {
      event.preventDefault();
      event.stopPropagation();
      camera.angle -= 5;
      draw(point, globalScreenMatrix, "svg");
      draw(camera, cameraScreenMatrix, "cameraSVG");
      draw(camera, clientScreenMatrix, "clientDOM");
    } else if (event.key === "]") {
      event.preventDefault();
      event.stopPropagation();
      camera.angle += 5;
      draw(point, globalScreenMatrix, "svg");
      draw(camera, cameraScreenMatrix, "cameraSVG");
      draw(camera, clientScreenMatrix, "clientDOM");
    } else if (event.key === "=") {
      event.preventDefault();
      event.stopPropagation();
      camera.scale *= 1.1;
      draw(point, globalScreenMatrix, "svg");
      draw(camera, cameraScreenMatrix, "cameraSVG");
      draw(camera, clientScreenMatrix, "clientDOM");
    } else if (event.key === "-") {
      event.preventDefault();
      event.stopPropagation();
      camera.scale *= 0.9;
      draw(point, globalScreenMatrix, "svg");
      draw(camera, cameraScreenMatrix, "cameraSVG");
      draw(camera, clientScreenMatrix, "clientDOM");
    }
  });
});
