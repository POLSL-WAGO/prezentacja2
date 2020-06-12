var points = [];

var kwadrat = {
  x: 12,
  y: 10,
  w: 100,
  h: 50,
};

function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateArray(size, range) {
  //generuje tablice punktów w argumencie przyjmuje wielkość tablicy
  for (let index = 0; index < size; index++) {
    points.push({ x: getRandomIntInclusive(0, range), y: getRandomIntInclusive(0, range) }); //przedział w którym generowane sąpunkty można zmienić
  }
}

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
generateArray(100, 200);
console.log(points);
rectangle_points(kwadrat, points);
