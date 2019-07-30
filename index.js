window.addEventListener("load", function() {
  screenMatrix = TransformationMatrix.translate(250, 250);
  screenCenter = TransformationMatrix.applyToPoint(screenMatrix, {
    x: 0,
    y: 0
  });

  svg = document.getElementById("test");
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

  list = {
    x: 50,
    y: 60,
    angle: 0,
    scale: 1,
    svg: document.createElementNS("http://www.w3.org/2000/svg", "line"),
    child: {
      x: 100,
      y: 120,
      angle: 0,
      scale: 1,
      svg: document.createElementNS("http://www.w3.org/2000/svg", "line"),
      child: {
        x: 60,
        y: 30,
        child: null,
        angle: 0,
        scale: 1,
        svg: document.createElementNS("http://www.w3.org/2000/svg", "line")
      }
    }
  };

  svg.appendChild(list.svg);
  svg.appendChild(list.child.svg);
  svg.appendChild(list.child.child.svg);

  selected = list;

  function draw(node, originMatrix) {
    if (node == null) return;

    nodeSVG = node.svg;

    nodeSVG.setAttribute("x1", 0);
    nodeSVG.setAttribute("y1", 0);
    nodeSVG.setAttribute("x2", node.x);
    nodeSVG.setAttribute("y2", node.y);
    nodeSVG.setAttribute("transform", TransformationMatrix.toCSS(originMatrix));
    nodeSVG.setAttribute("stroke-width", "1px");
    nodeSVG.setAttribute("stroke", node === selected ? "orange" : "grey");
    nodeSVG.setAttribute("marker-end", "url(#dot)");

    newMatrix = TransformationMatrix.compose(
      originMatrix,
      TransformationMatrix.translate(node.x, node.y),
      TransformationMatrix.scale(node.scale),
      TransformationMatrix.rotateDEG(node.angle),
    );
    draw(node.child, newMatrix);
  }

  draw(list, screenMatrix);

  window.addEventListener("keyup", function(event) {
    if (event.key === "n") {
      if (selected === null) {
        selected = list;
      } else {
        selected = selected.child;
      }
      draw(list, screenMatrix);
    } else if (event.key === "ArrowLeft") {
      selected.x -= 5;
      draw(list, screenMatrix);
    } else if (event.key === "ArrowRight") {
      selected.x += 5;
      draw(list, screenMatrix);
    } else if (event.key === "ArrowUp") {
      selected.y += 5;
      draw(list, screenMatrix);
    } else if (event.key === "ArrowDown") {
      selected.y -= 5;
      draw(list, screenMatrix);
    } else if (event.key === "[") {
      selected.angle += 5;
      draw(list, screenMatrix);
    } else if (event.key === "]") {
      selected.angle -= 5;
      draw(list, screenMatrix);
    } else if (event.key === "=") {
      selected.scale *= 1.1;
      draw(list, screenMatrix);
    } else if (event.key === "-") {
      selected.scale *= 0.9;
      draw(list, screenMatrix);
    }
  });
});
