var points = [
  { x: 10, y: 20 },
  { x: 12, y: 18 },
  { x: 20, y: 30 },
  { x: 5, y: 40 },
  { x: 100, y: 2 },
];
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

function d(point) {
  return Math.pow(point.x, 2) + Math.pow(point.y, 2);
}

var closest = points.slice(1).reduce(
  function (min, p) {
    if (d(p) < min.d) min.point = p;
    return min;
  },
  { point: points[0], d: d(points[0]) }
).point;

closest;
