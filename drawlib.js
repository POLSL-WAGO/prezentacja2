/*
    Wojciech Kuśmierz
    Rojek Marcin
    Wiśniewski Mateusz

    Biblioteka rysująca punkty, okrąg, linie oraz wielokąt na CANVAS
*/


const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");

var shapes = [];

function DrawPoint(pkt_x, pkt_y, pkt_color) {
  // funkcja rysująca punkt
  console.log(pkt_x + "," + pkt_y + "," + pkt_color);
  ctx.beginPath();
  ctx.arc(pkt_x, pkt_y, 6, 0, 2 * Math.PI, false);
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