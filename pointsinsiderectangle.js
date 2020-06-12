// constructor(center, radius, color){
//this.center = center;
//this.radius = radius;
//this.color = color;
//this.type = "circle";
//  }

//var Point = {

//x: 12
// y:10

//};
//zliczanie punktów leżących w prostokącie
function rectangle_points(rect, points) {
  // argumenty funkcji => rect obiekt zawiera wysokość szerokosć i punkt środkowy, points to tablica z obiektami punktów zawiera wartość x i y
  var counter = 0;

  points.forEach((el) => {
    if (rect.w == 0 && rect.h == 0) {
      counter++;
    } else if (rect.w > 0 && rect.h > 0) {
      if (rect.x < el.x && el.x < rect.x + rect.w && rect.y < el.y && el.y < rect.y + rect.h) counter++;
    } else if (rect.w < 0 && rect.h > 0) {
      if (rect.x + rect.w < el.x && el.x < rect.x && rect.y < el.y && el.y < rect.y + rect.h) counter++;
    } else if (rect.w > 0 && rect.h < 0) {
      if (rect.x < el.x && el.x < rect.x + rect.w && rect.y + rect.h < el.y && el.y < rect.y) counter++;
    } else if (rect.w < 0 && rect.h < 0) {
      if (rect.x + rect.w < el.x && el.x < rect.x && rect.y + rect.h < el.y && el.y < rect.y) counter++;
    }
  });

  console.log("Liczba punktów w prostokącie" + counter);
}
