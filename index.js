window.addEventListener("load", function() {
  svg = document.getElementById("global");
  cameraSVG = document.getElementById("camera");

  // Global setup

  globalScreenMatrix = TransformationMatrix.translate(
    svg.getAttribute("width") / 2,
    svg.getAttribute("height") / 2
  );
  screenCenter = TransformationMatrix.applyToPoint(globalScreenMatrix, {
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

  cameraScreenMatrix = TransformationMatrix.translate(
    cameraSVG.getAttribute("width") / 2,
    cameraSVG.getAttribute("height") / 2
  );
  screenCenter = TransformationMatrix.applyToPoint(cameraScreenMatrix, {
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
      x: 0, // origin coordinates
      y: 0,
      angle: 0,
      angleCenterX: 0,
      angleCenterY: 0,
      scale: 1,
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
        svg: document.createElementNS("http://www.w3.org/2000/svg", "line"),
        cameraSVG: document.createElementNS(
          "http://www.w3.org/2000/svg",
          "line"
        ),
        clientDOM: document.getElementById("client")
      }
    }
  };

  clientScreenMatrix = TransformationMatrix.translate(
    document.getElementById("client").getAttribute("width") / 2,
    document.getElementById("client").getAttribute("height") / 2
  );

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
      nodeSVG.style.transform =
        TransformationMatrix.toCSS(originMatrix);
    }

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

  draw(point, globalScreenMatrix, "svg");
  draw(camera, cameraScreenMatrix, "cameraSVG");
  draw(camera, clientScreenMatrix, "clientDOM");

  window.addEventListener(
    "keydown",
    function(e) {
      // space and arrow keys
      if ([37, 38, 39, 40].indexOf(e.keyCode) > -1) {
        e.preventDefault();
      }
    },
    false
  );

  window.addEventListener("keyup", function(event) {
    cameraMatrix = TransformationMatrix.inverse(
      TransformationMatrix.compose(
        TransformationMatrix.translate(camera.x, camera.y),
        TransformationMatrix.rotateDEG(
          camera.angle,
          camera.angleCenterX,
          camera.angleCenterY
        ),
        TransformationMatrix.scale(camera.scale)
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
        y: -5
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
        y: 5
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
