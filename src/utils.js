import marked from "marked-katex";
import katex from "katex";

export function debounce(func, wait) {
  let timeout;
  return function(...args) {
    const context = this;
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(context, args), wait);
  }
}

export function clamp(val, minVal, maxVal) {
  if (val < minVal)
    return minVal;

  if (val > maxVal)
    return maxVal;

  return val;
}


export function pointOnRect(x, y, minX, minY, maxX, maxY, validate) {
  //assert minX <= maxX;
  //assert minY <= maxY;
  if (validate && (minX < x && x < maxX) && (minY < y && y < maxY))
    throw "Point " + [x,y] + "cannot be inside "
    + "the rectangle: " + [minX, minY] + " - " + [maxX, maxY] + ".";
  var midX = (minX + maxX) / 2;
  var midY = (minY + maxY) / 2;
  // if (midX - x == 0) -> m == ±Inf -> minYx/maxYx == x (because value / ±Inf = ±0)
  var m = (midY - y) / (midX - x);

  if (x <= midX) { // check "left" side
    var minXy = m * (minX - x) + y;
    if (minY <= minXy && minXy <= maxY)
      return {x: minX, y: minXy};
  }

  if (x >= midX) { // check "right" side
    var maxXy = m * (maxX - x) + y;
    if (minY <= maxXy && maxXy <= maxY)
      return {x: maxX, y: maxXy};
  }

  if (y <= midY) { // check "top" side
    var minYx = (minY - y) / m + x;
    if (minX <= minYx && minYx <= maxX)
      return {x: minYx, y: minY};
  }

  if (y >= midY) { // check "bottom" side
    var maxYx = (maxY - y) / m + x;
    if (minX <= maxYx && maxYx <= maxX)
      return {x: maxYx, y: maxY};
  }

  // edge case when finding midpoint intersection: m = 0/0 = NaN
  if (x === midX && y === midY) return {x: x, y: y};

  // Should never happen :) If it does, please tell me!
  throw "Cannot find intersection for " + [x,y]
  + " inside rectangle " + [minX, minY] + " - " + [maxX, maxY] + ".";
}

export function htmlDecode(input){
  let e = document.createElement('div');
  e.innerHTML = input;
  return e.childNodes.length === 0 ? "" : e.childNodes[0].nodeValue;
}

export function markedTex(markdownText, mdOptions={}, texOptions={}) {
  let html = marked(markdownText, ...mdOptions);
  html = html.replace(/<code>\s*\$\$([^\$]*)\$\$\s*<\/code>/gi, function (match, tex) {
    return katex.renderToString(htmlDecode(tex), { display: true, ...texOptions });
  });
  html = html.replace(/<code>\s*\$([^\$]*)\$?\$\s*<\/code>/gi, function (match, tex) {
    return katex.renderToString(htmlDecode(tex), { display: false, ...texOptions });
  });

  return html;
}
