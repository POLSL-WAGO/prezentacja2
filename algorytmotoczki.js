var points = [
  { x: 101, y: 20 },
  { x: 12, y: 18 },
  { x: 20, y: 30 },
  { x: 100, y: 30 },
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

//generateArray(100, 200);

var closest = points.slice(1).reduce(
  function (min, p) {
    if (d(p) < min.d) min.point = p;
    return min;
  },
  { point: points[0], d: d(points[0]) }
).point;

console.log(closest);
var sortedArray = points.sort(function (a, b) {
  return a.x - b.x;
});

console.log("war x" + sortedArray[1].x);
const ranges = [];
for (var index = 0; index < sortedArray.length; index++) {
  // console.log(
  //   Math.sqrt(
  //     Math.pow(Math.abs(sortedArray[index].x - sortedArray[index].x)) +
  //       Math.pow(Math.abs(sortedArray[index].y - sortedArray[index].y))
  //   )
  // );
  console.log(pointsgit[index].y);
}
console.log("ranges" + ranges);

//Math.sqrt(Math.pow(Math.abs(x1 - x2)) + Math.pow(Math.abs(y1 - y2)))
///// kod wyżej znajduje punkt który jest najbliżej pierwszemu punkowi w tablicy
