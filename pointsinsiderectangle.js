//zliczanie punktów leżących w prostokącie
function rectangle_points(rect, points) {
  // argumenty funkcji => rect obiekt zawiera wysokość szerokosć i punkt środkowy, points to tablica z obiektami punktów zawiera wartość x i y
  var counter = 0;

  points.forEach((el) => {
    if (rect.w == 0 && rect.h == 0) {
      counter++;
    } else if (rect.w > 0 && rect.h > 0) {
      if (
        rect.x < el.center.x &&
        el.center.x < rect.x + rect.w &&
        rect.y < el.center.y &&
        el.center.y < rect.y + rect.h
      )
        counter++;
    } else if (rect.w < 0 && rect.h > 0) {
      if (
        rect.x + rect.w < el.center.x &&
        el.center.x < rect.x &&
        rect.y < el.center.y &&
        el.center.y < rect.y + rect.h
      )
        counter++;
    } else if (rect.w > 0 && rect.h < 0) {
      if (
        rect.x < el.center.x &&
        el.center.x < rect.x + rect.w &&
        rect.y + rect.h < el.center.y &&
        el.center.y < rect.y
      )
        counter++;
    } else if (rect.w < 0 && rect.h < 0) {
      if (
        rect.x + rect.w < el.center.x &&
        el.center.x < rect.x &&
        rect.y + rect.h < el.center.y &&
        el.center.y < rect.y
      )
        counter++;
    }
  });

  console.log("Liczba punktów w prostokącie" + counter);
}