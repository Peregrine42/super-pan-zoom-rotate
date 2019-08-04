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
    angleCenterX: 0, // touch devices need to pivot
    angleCenterY: 0, // around a non-central origin
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

  startup();
});

var ongoingTouches = [];
var startedX = null;
var startedY = null;
var startedCameraX = null;
var startedCameraY = null;
var startedCameraScale = null;
var startedDistance = null;
var camera = null;
var origin = null;
var point = null;
function startup() {
  var el = document.getElementById("client-background");
  el.addEventListener("touchstart", handleStart, false);
  el.addEventListener("touchend", handleEnd, false);
  el.addEventListener("touchcancel", handleCancel, false);
  el.addEventListener("touchmove", handleMove, false);
  console.log("initialized.");
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
    TransformationMatrix.translate(node.x, node.y),

    TransformationMatrix.translate(node.angleCenterX, node.angleCenterY),
    TransformationMatrix.rotateDEG(node.angle),
    TransformationMatrix.translate(-node.angleCenterX, -node.angleCenterY),
    TransformationMatrix.translate(-node.scaleCenterX, -node.scaleCenterY),
    TransformationMatrix.scale(node.scale),
    TransformationMatrix.translate(node.scaleCenterX, node.scaleCenterY),
  );
  draw(node.child, newMatrix, attribute);
}

function handleStart(evt) {
  evt.preventDefault();
  var el = document.getElementById("client-background");
  var touches = evt.changedTouches;

  for (var i = 0; i < touches.length; i++) {
    ongoingTouches.push(copyTouch(touches[i]));
  }

  if (ongoingTouches.length > 0) {
    var evt = ongoingTouches[0];
    // if (startedX === null) {
    var evt2 = ongoingTouches[1];
    // evt2 = { pageX: 100, pageY: 450 };
    // evt2 = { pageX: 30, pageY: 230 };
    if (evt2) {
      // box = el.getBoundingClientRect();
      // x1 = evt.pageX - box.left;
      // x2 = evt2.pageX - box.left;
      // newX = (x1 + x2) / 2;
      // newX = newX - box.width / 2;
      // startedX = newX;
      // startedCameraX = camera.x;
      //
      // x = evt.pageX - evt2.pageX;
      // y = evt.pageY - evt2.pageY;
      // startedDistance = Math.sqrt(x * x + y * y);
      // startedCameraScale = camera.scale;
      //
      // console.log("started");
      // // offsetBox = el.getBoundingClientRect();
      // console.log(x, y);
      // console.log(startedDistance);

      x = evt.pageX - evt2.pageX;
      y = evt.pageY - evt2.pageY;
      distance = Math.sqrt(x * x + y * y)
      angle = Math.atan2(evt.pageY - evt2.pageY, evt2.pageX - evt.pageX) * 180 / Math.PI;

      box = el.getBoundingClientRect()

      startX = (((evt.pageX + evt2.pageX) / 2))
      startY = (((evt.pageY + evt2.pageY) / 2))
    }
    // }
  } else if (startedX === null && ongoingTouches.length === 2) {
    // var evt1 = ongoingTouches[0];
    // var evt2 = ongoingTouches[1];
    //
    // startedX = (evt2.pageX - evt1.pageX) / 2 + evt1.pageX;
    // startedY = (evt2.pageY - evt1.pageY) / 2 + evt1.pageY;
    //
    // startedCameraX = camera.x;
    // startedCameraY = camera.y;
  }
}

function handleMove(evt) {
  evt.preventDefault();
  var el = document.getElementById("client-background");
  var touches = evt.changedTouches;

  for (var i = 0; i < touches.length; i++) {
    var idx = ongoingTouchIndexById(touches[i].identifier);

    if (idx >= 0) {
      ongoingTouches.splice(idx, 1, copyTouch(touches[i])); // swap in the new touch record
    } else {
      console.log("can't figure out which touch to continue");
    }

    if (ongoingTouches.length > 0) {
      var evt = ongoingTouches[0];

      var evt2 = ongoingTouches[1];
      // evt2 = { pageX: 100, pageY: 450 };
      // evt2 = { pageX: 30, pageY: 230 };
      // if (startedX !== null) {
        if (evt2) {
          // x = evt2.pageX - evt.pageX;
          // y = evt2.pageY - evt.pageY;
          //
          // newDistance = Math.sqrt(x * x + y * y);
          // newScale = (newDistance - startedDistance) / newDistance;
          // // console.log("newDistance", newDistance)
          // // console.log("startedDistance", startedDistance)
          // // console.log("newScale", newScale)
          //
          // camera.scale = startedCameraScale + newScale;
          // if (camera.scale < 0.25) camera.scale = 0.25;
          // if (camera.scale > 4) camera.scale = 4;
          //
          // // console.log("camera.scale", camera.scale);
          //
          // box = el.getBoundingClientRect();
          //
          // x1 = evt.pageX - box.left;
          // x2 = evt2.pageX - box.left;
          // newX = (x1 + x2) / 2;
          // newX = newX - box.width / 2;
          // // x = x * camera.scale
          //
          // distanceX = newX * camera.scale - startedX;
          //
          // // console.log("---tick---")
          // // console.log(newX)
          // // console.log(startedX)
          // camera.scaleCenterX = newX;
          box = el.getBoundingClientRect()


          centerX = box.left + (box.width/2)
          centerY = box.top + (box.height/2)


          newX = (((evt.pageX + evt2.pageX) / 2))
          newY = (((evt.pageY + evt2.pageY) / 2))

          newAngle = Math.atan2(evt.pageY - evt2.pageY, evt2.pageX - evt.pageX) * 180 / Math.PI;

          // console.log(camera.scale)

          x = evt2.pageX - evt.pageX;
          y = evt2.pageY - evt.pageY;
          newDistance = Math.sqrt(x * x + y * y)

          newScale = 1 + (newDistance / distance - 1)

          camera.scale *= newScale
          console.log(angle)
          console.log(newAngle)
          console.log(newAngle - angle)
          camera.angle -= newAngle - angle
          // console.log(newScale)
          if (camera.scale > 2) camera.scale = 2
          if (camera.scale < 0.5) camera.scale = 0.5

          origin.x +=  + (newX - centerX) - (newScale * (newX - centerX))
          origin.y += ((newY - startY)/camera.scale) + (newY - centerY) - (newScale * (newY - centerY))

          distance = newDistance
          startX = newX
          startY = newY
          angle = newAngle
        }

        // camera.x = startedCameraX - (startedX - evt.pageX);
        // camera.y = startedCameraY - (startedY - evt.pageY);
      // }

      draw(point, globalScreenMatrix, "svg");
      draw(camera, cameraScreenMatrix, "cameraSVG");
      draw(camera, clientScreenMatrix, "clientDOM");
    } else if (startedX !== null && ongoingTouches.length === 2) {
      // var evt1 = ongoingTouches[0];
      // var evt2 = ongoingTouches[1];
      //
      // centerX = (evt2.pageX - evt1.pageX) / 2 + evt1.pageX;
      // centerY = (evt2.pageY - evt1.pageY) / 2 + evt1.pageY;
      //
      // camera.x = startedCameraX - (startedX - centerX);
      // camera.y = startedCameraY - (startedY - centerY);
      //
      // draw(point, globalScreenMatrix, "svg");
      // draw(camera, cameraScreenMatrix, "cameraSVG");
      // draw(camera, clientScreenMatrix, "clientDOM");
    }
  }
}

function handleEnd(evt) {
  evt.preventDefault();
  var el = document.getElementById("client-background");
  var touches = evt.changedTouches;

  for (var i = 0; i < touches.length; i++) {
    var idx = ongoingTouchIndexById(touches[i].identifier);

    if (idx >= 0) {
      ongoingTouches.splice(idx, 1); // remove it; we're done
    } else {
      console.log("can't figure out which touch to end");
    }
  }

  if (ongoingTouches.length === 0) {
    startedX = null;
  }
}

function handleCancel(evt) {
  evt.preventDefault();
  var touches = evt.changedTouches;

  for (var i = 0; i < touches.length; i++) {
    var idx = ongoingTouchIndexById(touches[i].identifier);
    ongoingTouches.splice(idx, 1); // remove it; we're done
  }

  if (ongoingTouches.length === 0) {
    startedX = null;
  }
}

function copyTouch(touch) {
  return {
    identifier: touch.identifier,
    pageX: touch.pageX,
    pageY: touch.pageY
  };
}

function ongoingTouchIndexById(idToFind) {
  for (var i = 0; i < ongoingTouches.length; i++) {
    var id = ongoingTouches[i].identifier;

    if (id == idToFind) {
      return i;
    }
  }
  return -1; // not found
}
