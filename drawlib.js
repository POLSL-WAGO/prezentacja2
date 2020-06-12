/*
    Wojciech Kuśmierz
    Rojek Marcin
    Wiśniewski Mateusz
    
*/


const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");

var shapes = [];

function DrawPoint(pkt_x, pkt_y, pkt_color) {
  // funkcja rysująca punkt
  console.log(pkt_x + "," + pkt_y + "," + pkt_color);
  ctx.beginPath();
  ctx.arc(pkt_x, pkt_y, 2, 0, 2 * Math.PI, false);
  //console.log("x= " + pkt_x + " y= " + pkt_y); w konsoli wyświtla współrzene punktu
  ctx.fillStyle = pkt_color;
  ctx.fill();
  shapes.push({ x: pkt_x, y: pkt_y, width: pkt_x, radius: 6, isDragging: false });
}

function DrawCircle(circle_x, circle_y, circle_r, circle_color) {
  //funkcja rysuje okrąg w wybranym przez nas miejscu,rozmiarze i kolorze
  //console.log(circle_size);
  ctx.beginPath();
  ctx.arc(circle_x, circle_y, circle_r, 0, 2 * Math.PI, false);
  ctx.strokeStyle = circle_color;
  ctx.stroke();
}

function DrawLine(start_x, start_y, end_x, end_y, line_color) {
  // ta funkcja rysuje linie
  ctx.beginPath();
  ctx.moveTo(start_x, start_y);
  ctx.lineTo(end_x, end_y);
  ctx.strokeStyle = line_color;
  ctx.stroke();
}

var Points2;

function DrawPolygon(Points2) {
  console.log(Points2);
  console.log(Points2[0][0]);
  var pol_color = document.getElementById("pol_color").value;
  ctx.beginPath();
  ctx.moveTo(Points2[0][0], Points2[0][1]);
  for (item = 1; item <= Points2.length - 1; item += 1) {
    ctx.lineTo(Points2[item][0], Points2[item][1]);
  }
  ctx.closePath();
  ctx.strokeStyle = pol_color;
  ctx.stroke();
}

var points = [];
var kwadrat = {
  x: 12,
  y: 10,
  w: 100,
  h: 50,
};

function DrawRectangle(rec_x, rec_y, rec_h, rec_w, rec_color){
  console.log(rec_x, rec_y, rec_h, rec_w, rec_color);
  ctx.strokeStyle = rec_color;
  ctx.strokeRect(rec_x,  rec_y, rec_w, rec_h);
  rectangle_points(kwadrat, points);
}

function randomPoints(pktRandom){
    console.log(points);
    generateArray(pktRandom, 500);
    for(i = 0; i < pktRandom; i++){
        DrawPoint(points[i].x, points[i].y, 0);
    }
  }

  function randomPoint(pktRandom){
    console.log(points);
    generateArray(pktRandom, 500);
    for(i = 0; i < pktRandom; i++){
      if(i == 0){
        DrawPoint(points[i].x, points[i].y, "red");
      }else {
        DrawPoint(points[i].x, points[i].y, "black");
      }
    }
  }

  function randomLines(linRandom){
    console.log(linRandom);
    var x1 = 0;
    var y1 = 0;
    var x2 = 0;
    var y2
    for(i = 0; i < linRandom; i++){
        x1 = getRandomInt(0, 500);
        y1 = getRandomInt(0, 500);
        x2 = getRandomInt(0, 500);
        y2 = getRandomInt(0, 500);
        DrawLine(x1, y1, x2, y2, 0)
    }
  }

  function randomDirectionLine(lin_x, lin_y, linRandom){
    console.log(linRandom);
    console.log(lin_x);
    console.log(lin_y);
    var x2 = 0;
    var y2
    for(i = 0; i < linRandom; i++){
        x2 = getRandomInt(0, 500);
        y2 = getRandomInt(0, 500);
        DrawLine(lin_x, lin_y, x2, y2, 0)
    }
  }

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

// Algorytm1
//zliczanie punktów leżących w prostokącie
function rectangle_points(rect, points) {
  // argumenty funkcji => rect obiekt zawiera wysokość szerokosć i punkt środkowy, points to tablica z obiektami punktów zawiera wartość x i y
  var counter = 0;
  console.log(points);
  console.log(rect);
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
  document.getElementById("result").innerHTML = "Liczba punktów w prostokącie: " + counter;
  console.log("Liczba punktów w prostokącie" + counter);
}

function rectangleCheck(rec_x, rec_y, rec_h, rec_w, rec_color, pkt_size){
  kwadrat.x = rec_x;
  kwadrat.y = rec_y;
  kwadrat.h = rec_h;
  kwadrat.w = rec_w;
  DrawRectangle(rec_x, rec_y, rec_h, rec_w, rec_color);
  randomPoints(pkt_size);
  rectangle_points(kwadrat, points);
}

// Algorytm 2
function d(point) {
  return Math.pow(point.x, 2) + Math.pow(point.y, 2);
}

//generateArray(100, 200);
function closedPoint(pktrandom){
  randomPoint(pktrandom);
  var closest = points.slice(1).reduce(
    function (min, p) {
      if (d(p) < min.d) min.point = p;
      return min;
    },
    { point: points[0], d: d(points[0]) }
  ).point;

  console.log(closest);
  document.getElementById("result").innerHTML = "Współrzędne najbliższego punktu x: " + closest.x + " y: " + closest.y + " do puntku x: " + points[0].x + " y: " + points[0].y;
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
    console.log(points[index].y);
  }
  console.log("ranges" + ranges);
}
//Math.sqrt(Math.pow(Math.abs(x1 - x2)) + Math.pow(Math.abs(y1 - y2)))
///// kod wyżej znajduje punkt który jest najbliżej pierwszemu punkowi w tablicy