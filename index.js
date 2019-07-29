window.addEventListener("load", function() {
  screenCenterX = 250;
  screenCenterY = 250;

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

  list = {
    x: 50,
    y: 10,
    svg: document.createElementNS("http://www.w3.org/2000/svg", "line"),
    child: {
      x: 100,
      y: 120,
      svg: document.createElementNS("http://www.w3.org/2000/svg", "line"),
      child: {
        x: 60,
        y: 30,
        child: null,
        svg: document.createElementNS("http://www.w3.org/2000/svg", "line")
      }
    }
  };

  svg.appendChild(list.svg);
  svg.appendChild(list.child.svg);
  svg.appendChild(list.child.child.svg);

  selected = list

  function draw(node, originX, originY) {
    if (node == null) return;

    nodeSVG = node.svg;
    nodeSVG.setAttribute("x1", originX);
    nodeSVG.setAttribute("y1", originY);
    nodeSVG.setAttribute("x2", originX + node.x);
    nodeSVG.setAttribute("y2", originY + node.y);
    nodeSVG.setAttribute("stroke-width", "1px");
    nodeSVG.setAttribute("stroke", node === selected ? "orange" : "grey");
    nodeSVG.setAttribute("marker-end", "url(#dot)");

    draw(node.child, originX + node.x, originY + node.y);
  }

  draw(list, screenCenterX, screenCenterY);

  window.addEventListener("keyup", function(event) {
    if (event.key === "n") {
      if (selected) {
        selected = selected.child
      } else {
        selected = list
      }
      draw(list, screenCenterX, screenCenterY)
    } else if (event.key === "ArrowLeft") {
      selected.x -= 5
      draw(list, screenCenterX, screenCenterY)
    } else if (event.key === "ArrowRight") {
      selected.x += 5
      draw(list, screenCenterX, screenCenterY)
    } else if (event.key === "ArrowUp") {
      selected.y += 5
      draw(list, screenCenterX, screenCenterY)
    } else if (event.key === "ArrowDown") {
      selected.y -= 5
      draw(list, screenCenterX, screenCenterY)
    }
  })
});
