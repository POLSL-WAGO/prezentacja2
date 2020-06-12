/*
    Kuśmierz Wojciech
    Rojek Marcin
    Wiśniewski Mateusz

    Dodatek do biblioteki zawierający losowanie punktów, bądź odcinków
*/

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
  }
  
function randomPoints(pktRandom){
    console.log(pktRandom);
    var x = 0;
    var y = 0;
    for(i = 0; i < pktRandom; i++){
        x = getRandomInt(0, 500);
        y = getRandomInt(0, 500);
        DrawPoint(x, y, 0);
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