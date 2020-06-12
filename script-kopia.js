var canvas;
var ctx;
var shapes = [];
var shapeType = "square";
var shapeColor = "#FEA47F";
var printed = false;
var checkedAlgorithm = "";

function init() {
    canvas = document.getElementById("my_canvas");
    ctx = canvas.getContext("2d");
    setCanvasSize();
    window.addEventListener("resize", setCanvasSize);
    document.oncontextmenu = function(e){return false;}

    let isDown = false;
    let currentShapeId;
    let dragging = false;
    let clickOnShape = false;
    let offset = {x: 0, y: 0};
    let isLeft = false;

    let newDistance = 0;
    let oldDistance = 0;
    let oldPosition;

    //line
    let startPos;
    let creatingLine = false;

    //algorytm8
    let creatingRect = false;

    //mouse down
    canvas.addEventListener('mousedown', function(e) {
        isDown = true;
        let pos = getMousePos();

        for(let i = 0; i < shapes.length; i++){
            if(shapes[i].isInside(pos)){
                currentShapeId = i;
                clickOnShape = true;
                i = shapes.length;
            }
        }
        
        if(event.button == 0){
            if(!clickOnShape){
                if(shapeType == "line"){
                    startPos = pos;
                    creatingLine = true;
                }
                else if(checkedAlgorithm == "algorytm8"){
                    startPos = pos;
                    creatingRect = true;
                }
                else if(shapeType == "polygon" && checkedAlgorithm == "algorytm1" && algorytm1(getAllPoints()).length > 2){
                    let shape = new Polygon(algorytm1(getAllPoints()), shapeColor);
                    shape.draw();
                    shapes.push(shape);
                    calculateAlgorithm(checkedAlgorithm);
                    deleteAllPoints();
                }
                else if(shapeType != "polygon"){
                    let shape = createShape(shapeType, pos, shapeColor);
                    shape.draw();
                    shapes.push(shape);
                    calculateAlgorithm(checkedAlgorithm);
                }
            }else{
                offset.x = shapes[currentShapeId].center.x - pos.x;
                offset.y = shapes[currentShapeId].center.y - pos.y;
            }
            isLeft = false;
        }
        else if(event.button == 2 && clickOnShape){
            isLeft = true;
            oldPosition = getMousePos();
        }
        
    }, true);

    //mouse move
    canvas.addEventListener('mousemove', function() {
        if(creatingLine){
            let pos = getMousePos();

            redrawShapes();
            calculateAlgorithm(checkedAlgorithm);

            new Line(startPos, getMousePos(), shapeColor, 5).draw();
        }
        else if(creatingRect){
            let pos = getMousePos();
            let width = pos.x - startPos.x;
            let height = pos.y - startPos.y;
            
            redrawShapes();
            ctx.beginPath();
            ctx.rect(startPos.x, startPos.y, width, height);
            ctx.stroke();
        }
        else if(!isLeft){
            if(isDown && clickOnShape){
                dragging = true;
                let pos = getMousePos();
                shapes[currentShapeId].move({x: pos.x + offset.x, y: pos.y + offset.y,});
                redrawShapes();
                calculateAlgorithm(checkedAlgorithm);
            }
        }
        else if(isLeft && clickOnShape){
            let pos = getMousePos();
            oldDistance = newDistance;
            newDistance = oldPosition.x - pos.x;
            
            if((newDistance < 0 && oldDistance < newDistance) || (newDistance > 0 && newDistance > oldDistance))
                shapes[currentShapeId].scaleDown();
            else
                shapes[currentShapeId].scaleUp();
            
            redrawShapes();
            calculateAlgorithm(checkedAlgorithm);
        }
      }, true);

    //mouse up
    canvas.addEventListener('mouseup', function() {
        isDown = false;
        if(!isLeft){
            if(!dragging && clickOnShape){
                deleteShape(currentShapeId);
                calculateAlgorithm(checkedAlgorithm);
            }
        }

        if(creatingLine){
            creatingLine = false;
            let shape = new Line(startPos, getMousePos(), shapeColor, 5);
            shape.draw();
            shapes.push(shape);

            redrawShapes();
            calculateAlgorithm(checkedAlgorithm);
        }
        else if(creatingRect){
            creatingRect = false;
            let pos = getMousePos();
            let width = pos.x - startPos.x;
            let height = pos.y - startPos.y;

            redrawShapes();
            ctx.beginPath();
            ctx.rect(startPos.x, startPos.y, width, height);
            ctx.stroke();

            let rect = {
                x: startPos.x,
                y: startPos.y,
                w: width,
                h: height,
            }

            algorytm8(rect, getAllPoints());
        }

        dragging = false;
        clickOnShape = false;
        isLeft = false;
      }, true);
}

function getMousePos() {
    var rect = canvas.getBoundingClientRect();
    return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top
    };
}

function setCanvasSize(){
    ctx.canvas.width  = window.innerWidth - 20;
    ctx.canvas.height = window.innerHeight - 150;
    redrawShapes();
}

// class Shape{
//     type;
//     color;

//     constructor(){
//     }

//     draw() {
//     }

//     move(position){
//     }

//     scaleUp(){
//     }

//     scaleDown(){
//     }

//     isInside(position){
//     }
// }

class Point{
    constructor(center, radius, color){
        this.center = center;
        this.radius = radius;
        this.color = color;
        this.type = "point";
    }

    draw() {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.center.x, this.center.y, this.radius, 0, Math.PI*2);
        ctx.fill();
    }

    move(position){
        this.center.x = position.x;
        this.center.y = position.y;
    }

    scaleUp(){
    }

    scaleDown(){
    }

    isInside(position){
        return Math.pow(position.x - this.center.x, 2) +  Math.pow(position.y - this.center.y, 2) <= Math.pow(this.radius, 2) ? true : false;
    }
}

class Circle{
    constructor(center, radius, color){
        this.center = center;
        this.radius = radius;
        this.color = color;
        this.type = "circle";
    }

    draw() {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.center.x, this.center.y, this.radius, 0, Math.PI*2);
        ctx.fill();
    }

    move(position){
        this.center.x = position.x;
        this.center.y = position.y;
    }

    scaleUp(){
        this.radius += 0.5;
    }

    scaleDown(){
        if(this.radius - 0.5 >= 7.5)
            this.radius -= 0.5;
    }

    isInside(position){
        return Math.pow(position.x - this.center.x, 2) +  Math.pow(position.y - this.center.y, 2) <= Math.pow(this.radius, 2) ? true : false;
    }
}

class Square{
    constructor(center, length, color){
        this.center = center;
        this.length = length;
        this.color = color;
        this.type = "square";
    }

    draw() {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.center.x - this.length / 2, this.center.y - this.length / 2, this.length, this.length);
    }
    move(position){
        this.center.x = position.x;
        this.center.y = position.y;
    }

    scaleUp(){
        this.length += 1;
    }

    scaleDown(){
        if(this.length - 1 >= 15)
            this.length -= 1;
    }
    
    isInside(position){
        return this.center.x - this.length / 2 <= position.x && position.x <= this.center.x + this.length / 2 && this.center.y - this.length / 2 <= position.y && position.y <= this.center.y + this.length / 2 ? true : false;
    }
}

class Rectangle{
    constructor(center, width, height, color){
        this.center = center;
        this.width = width;
        this.height = height;
        this.color = color;
        this.type = "rectangle";
    }

    draw() {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.center.x - this.width / 2, this.center.y - this.height / 2, this.width, this.height);
    }

    move(position){
        this.center.x = position.x;
        this.center.y = position.y;
    }

    scaleUp(){
        if(this.width >= this.height){
            let k = this.width / this.height;
            this.width += k;
            this.height += 1;
        }
        else{
            let k = this.height / this.width;
            this.width += 1;
            this.height += k;
        }
    }

    scaleDown(){
        if(this.width >= this.height){
            let k = this.width / this.height;
            if(this.width - k >= 15){
                this.width -= k;
                this.height -= 1;
            }
        }
        else{
            let k = this.height / this.width;
            if(this.height - k >= 15){
                this.width -= 1;
                this.height -= k;
            }
        }
    }

    isInside(position){
        return this.center.x - this.width / 2 <= position.x && position.x <= this.center.x + this.width / 2 && this.center.y - this.height / 2 <= position.y && position.y <= this.center.y + this.height / 2 ? true : false;
    }
}

class Polygon{
    constructor(points, color){
        this.type = "polygon";
        this.color = color;
        this.segments = [];
        this.points = points;

        this.createSegments();
        this.numberOfSegments = this.segments.length;

        this.center = {x:0, y:0,};

        for(let i = 0; i < points.length; i++){
            this.center.x += points[i].center.x;
            this.center.y += points[i].center.y;
        }

        this.center.x /= points.length;
        this.center.y /= points.length;
    }

    createSegments(){
        this.segments = [];
        for(let i = 0; i < this.points.length - 1; i++){
            this.segments.push({p1: this.points[i], p2: this.points[i + 1],});
        }

        this.segments.push({p1: this.points[this.points.length - 1], p2: this.points[0],});
    }
    
    getSegments(){
        return this.segments;
    }

    draw(){
        ctx.beginPath(); 
        ctx.moveTo(this.segments[0].p1.center.x, this.segments[0].p1.center.y);
        this.segments.forEach((el) => {        
            ctx.lineTo(el.p2.center.x, el.p2.center.y);
            ctx.stroke();
        });
        ctx.closePath();
        ctx.fillStyle = this.color;
        ctx.fill();
    }

    move(position){
        let diffrence = {x: position.x - this.center.x, y: position.y - this.center.y,};
        this.center = position;
        for(let i = 0; i < this.points.length; i++){
            this.points[i].center.x += diffrence.x;
            this.points[i].center.y += diffrence.y;
        }

        this.createSegments();
    }

    scaleUp(){
        this.points.forEach((el) => {
            let dx = el.center.x - this.center.x;
            let dy = el.center.y - this.center.y;
            dx *= 0.01;
            dy *= 0.01;
            el.center.x += dx;
            el.center.y += dy;
        });
        this.createSegments();
    }

    scaleDown(){
        this.points.forEach((el) => {
            let dx = el.center.x - this.center.x;
            let dy = el.center.y - this.center.y;
            dx *= 0.01;
            dy *= 0.01;
            el.center.x -= dx;
            el.center.y -= dy;
        });
        this.createSegments();
    }

    isInside(position){
        return algorytm0(this, position);
    }
}

class Line{
    constructor(start, end, color, width){
        this.start = start;
        this.end = end;
        this.color = color;
        this.type = "line";
        this.center = {x: (start.x + end.x) / 2, y: (start.y + end.y) / 2,};
        this.width = width;
    }

    draw() {
        ctx.beginPath();
        ctx.lineWidth = this.width;
        ctx.strokeStyle = this.color;
        ctx.moveTo(this.start.x, this.start.y);
        ctx.lineTo(this.end.x, this.end.y);
        ctx.stroke();
    }

    move(position){
        let diffrence = {x: position.x - this.center.x, y: position.y - this.center.y,};

        this.center.x = position.x;
        this.center.y = position.y;
        this.start.x += diffrence.x;
        this.start.y += diffrence.y;
        this.end.x += diffrence.x;
        this.end.y += diffrence.y;
    }

    scaleUp(){
    }

    scaleDown(){
    }

    isInside(position){
    }
}

function deleteAllPoints() {
    let index = [];
    for(let i = 0; i < shapes.length; i++)
        if(shapes[i].type == "point")
            index.push(i);
    
    for(let i = index.length - 1; i >= 0; i--)
        shapes.splice(index[i], 1);

    redrawShapes();
}

function getAllPoints() {
    let points = [];
    for(let i = 0; i < shapes.length; i++)
        if(shapes[i].type == "point")
            points.push(shapes[i]);

    return points;
}

function createShape(type, position, color, points){
    switch(type){
        case "point":
            return new Point(position, 5, color);
        case "circle":
            return new Circle(position, 20, color);
        case "square":
            return new Square(position, 40, color);
        case "rectangle":
            return new Rectangle(position, 60, 40, color);
    }
}

function deleteShape(shapeId){
    let shape = shapes[shapeId];
    shapes.splice(shapeId, 1);
    redrawShapes();
}

function redrawShapes() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for(let i = shapes.length - 1; i >= 0; i--)
        shapes[i].draw();   
}

function changeShape(type){
    shapeType = type;
}

function changeColor(color){
    shapeColor = color;
}

function btnClear(){
    shapes = [];
    redrawShapes();
}

function btnSave(){
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open("POST", "server.php", true);
    xmlhttp.onload = function() {
        if (this.readyState == 4 && xmlhttp.status === 200) {
          console.log("Cannot Save. Error?: " + this.responseText);
        }
    }
    console.log(shapes);
    xmlhttp.send(JSON.stringify({
      "shapes": shapes,
      "what": 1
    }));  
}

function btnLoad(){
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open("POST", "server.php", true);
    xmlhttp.onload = function() {
      if (this.readyState == 4 && xmlhttp.status === 200) {
        console.log("Response on load: " + xmlhttp.response);
        shapes = [];
        let plainJSObjects = JSON.parse(xmlhttp.response);
        plainJSObjects.forEach(object => {
            let shape = new Shape(object.type, object.x, object.y, object.height, object.width, object.color);
            shapes.push(shape);
        });
        redrawShapes();
      }
  };
  xmlhttp.send(JSON.stringify({
    "what":2
  }));
}

function handleRadioButtonClick() {
    var radios = document.getElementsByName('algorytm');

    for (var i = 0, length = radios.length; i < length; i++) {
        if (radios[i].checked) {
            checkedAlgorithm = radios[i].id;
            break;
        }
    }

    calculateAlgorithm(checkedAlgorithm);
}

function calculateAlgorithm(algorithm) {
    switch(algorithm){
        case "algorytm1":
            algorytm1(getAllPoints());
            break;
        case "algorytm2":
            algorytm2(shapes);
            break;
        case "algorytm3":
            redrawShapes();
            algorytm3(getAllPoints());
            break;
        case "algorytm4":
            algorytm4(shapes);
            break;
        case "algorytm8":
            break;
        case "algorytm16":
            algorytm16(getAllPoints());
            break;
        default:
            console.log("nierozpoznany algorytm: " + algorithm);
    }
}

//algorytm 0
function cross(v, w){
    return v.x * w.y - v.y * w.x;
}

class Ray{
    constructor(startPoint){
        this.p = startPoint;
        this.theta = Math.random() * 2 * Math.PI;
        this.r = {
            x: Math.cos(this.theta),
            y: Math.sin(this.theta),
        };
    }

    intersects(segment){
        let q = segment.p1;
        
        let s = {
            x: segment.p2.center.x - segment.p1.center.x,
            y: segment.p2.center.y - segment.p1.center.y,
        };

        let temp1 = cross(this.r, s);
        let temp2 = cross({x: q.center.x - this.p.x, y: q.center.y - this.p.y,}, this.r);

        if(temp1 == 0 && temp2 == 0)
            return false;
        else if(temp1 == 0 && temp2 != 0)
            return false;
        else if(temp1 != 0){
            let t = cross({
                x: q.center.x - this.p.x,
                y: q.center.y - this.p.y,
            }, s) / temp1;
            let u = temp2 / temp1;
            if(0 <= t && 0 <= u && u <= 1){
                return true;
            }
        }

        return false;
    }

    draw(){
        ctx.beginPath(); 
        ctx.moveTo(this.p.x, this.p.y);
        ctx.lineTo(this.p.x + 1000*this.r.x, this.p.y + 1000*this.r.y);
        ctx.stroke();
    }
}

function algorytm0(polygon, point){
    let segments = polygon.getSegments();
    let numberOfIntersections = 0;
    let ray = new Ray(point);

    for(let i = 0; i < polygon.numberOfSegments; i++){
        if(ray.intersects(segments[i]))
            numberOfIntersections++;
    }

    return numberOfIntersections % 2 == 1;
}

//algorytm 1
function algorytm1(points, draw = true){
    function find(find){
        var elementPos = A.findIndex(i => i.center.x === find.center.x && i.center.y === find.center.y);
        A.splice(elementPos, 1);
    }
    var A = points;

    if(A.length > 2){
        var len = A.length;
        A.sort(function(a, b){return a.center.y - b.center.y});
        var B = [];
        B.push(A[len-1]);

        for(k=0; k<=len; k++){
            var lengthB = B.length;
            var lengthA = A.length;
            var lastP = B[lengthB-1];
            var nextP = A[0];
            var notDone = true;

            while(notDone){
                var lenA  = A.length;
                for(i=0; i<=lenA-1; i++){
                    var JHvalue = ((lastP.center.x - nextP.center.x) * (A[i].center.y - nextP.center.y)) - ((A[i].center.x - nextP.center.x) * (lastP.center.y - nextP.center.y));
                    if(JHvalue<0){
                        nextP = A[i];
                        break;
                    }
                    else if(i == lenA-1){
                        if(nextP.center.x == B[0].center.x && nextP.center.y == B[0].center.y){
                            k=len;
                        }         

                        B.push(nextP);
                        find(nextP);
                        notDone = false; 
                    }
                }
            }
        }
        var len2 = B.length;
        if(draw){
            if(printed == false){
                //draw polygon
                ctx.beginPath();
                ctx.moveTo(B[0].center.x, B[0].center.y);
                for(i=1; i<=len2-1; i++){ 
                    ctx.lineTo(B[i].center.x, B[i].center.y);
                }
                ctx.closePath();
                ctx.stroke();
                ctx.fillStyle = "rgba(255,0,0,0.3)";
                ctx.fill();
                printed = true;
            }else if(printed == true){
                redrawShapes();
                //draw polygon
                ctx.beginPath();
                ctx.moveTo(B[0].center.x, B[0].center.y);
                for(i=1; i<=len2-1; i++){ 
                    ctx.lineTo(B[i].center.x, B[i].center.y);
                }
                ctx.closePath();
                ctx.stroke();
                ctx.fillStyle = "rgba(255,0,0,0.3)";
                ctx.fill();
            }
        }
        B.pop();
        return B;
    }
    return [];
}

//algorytm 2
function algorytm2(shapes){
    let polygons = [];
    let result = [];

    shapes.forEach((el) => {if(el.type == "polygon") polygons.push(el)});
    
    if(polygons.length > 1){
        let points = [];

        polygons.forEach((el) => points = points.concat(el.points));

        result = algorytm1(points, false);

        ctx.beginPath()
        ctx.moveTo(result[0].center.x, result[0].center.y);
        for(let i = 1; i < result.length; i++){
            ctx.lineTo(result[i].center.x, result[i].center.y);
        }
        ctx.lineTo(result[0].center.x, result[0].center.y);
        ctx.stroke();
        ctx.closePath();
    }
    return result;
}

//algorytm 3
function distance(a, b){
    return Math.sqrt(Math.pow(a.center.x - b.center.x, 2) + Math.pow(a.center.y - b.center.y, 2));
}

function trivial(R){
    if(R.length == 0){
        return {x: 0, y: 0, r: 0,};
    }
    if(R.length == 1){
        return {x: R[0].center.x, y: R[0].center.y, r: 5,};
    }
    if(R.length == 2){
        let x = (R[0].center.x + R[1].center.x) / 2;
        let y = (R[0].center.y + R[1].center.y) / 2;
        let distance = Math.sqrt(Math.pow(R[0].center.x - R[1].center.x, 2) + Math.pow(R[0].center.y - R[1].center.y, 2));
        let r = distance / 2;

        return {x: x, y: y, r: r,};
    }
    else if(R.length == 3){
        let sides = [];
        let a = distance(R[0], R[1]);
        let b = distance(R[1], R[2]);
        let c = distance(R[2], R[0]);
        let longest = a < c && b < c ? {a: R[2], b: R[0], c: c,} : a < b && c < b ? {a: R[1], b: R[2], c: b,} : {a: R[0], b: R[1], c: a,};

        sides.push(a);
        sides.push(b);
        sides.push(c);

        sides.sort((a, b) => {
            return a - b;
        });

        
        //rozwarty
        if(sides[0] * sides[0] + sides[1] * sides[1] < sides[2] * sides[2]){
            let x = (longest.a.center.x + longest.b.center.x) / 2;
            let y = (longest.a.center.y + longest.b.center.y) / 2;
            let distance = Math.sqrt(Math.pow(longest.a.center.x - longest.b.center.x, 2) + Math.pow(longest.a.center.y - longest.b.center.y, 2));
            let r = distance / 2;

            return {x: x, y: y, r: r,};
        }
        //ostry
        else{
            let ma = (R[1].center.y - R[0].center.y) / (R[1].center.x - R[0].center.x);
            let mb = (R[2].center.y - R[1].center.y) / (R[2].center.x - R[1].center.x);
        
            let x = (ma * mb * (R[0].center.y - R[2].center.y) + mb * (R[0].center.x + R[1].center.x) - ma * (R[1].center.x + R[2].center.x)) / (2 * (mb - ma));
            let y = (-1 / mb) * (x - ((R[1].center.x + R[2].center.x) / 2)) + ((R[1].center.y + R[2].center.y) / 2);
            let r = Math.sqrt(Math.pow(R[0].center.x - x, 2) + Math.pow(R[0].center.y - y, 2));
        
            return {x: x, y: y, r: r,};
        }
    }
}

function insideCircle(circle, point){
    let a = circle.x;
    let b = circle.y;
    let r = circle.r;
    let x = point.center.x;
    let y = point.center.y;

    if(Math.pow(x - a, 2) + Math.pow(y - b, 2) < Math.pow(r, 2))
        return true;
    
    return false;
}

function removeExcess(R, S) {
    let indexes = [];

    let circle = trivial([R[1], R[2], R[3]]);
    if(insideCircle(circle, R[0])){
        indexes.push(0);
    }

    circle = trivial([R[0], R[2], R[3]]);
    if(insideCircle(circle, R[1])){
        indexes.push(1);
    }
    
    circle = trivial([R[0], R[1], R[3]]);
    if(insideCircle(circle, R[2])){
        indexes.push(2);
    }

    circle = trivial([R[0], R[1], R[2]]);
    if(insideCircle(circle, R[3])){
        indexes.push(3);
    }

    for(let i = indexes.length - 1; i >= 0; i--){
        S.push(R.splice(indexes[i], 1)[0]);
    }
    
    if(R.length == 4){
        S.push(R.splice(0, 1)[0]);
    }
}

function algorytm3(points) {
     if(points.length > 1){
        let P = [].concat(points);
        let R = [];
        let circle = trivial(R);
        let S = [];

        while(P.length > 0){
            let index = Math.floor(Math.random() * P.length);
            let p = P[index];

            P.splice(index, 1);

            if(!insideCircle(circle, p)){
                R.push(p);

                if(R.length > 3)
                    removeExcess(R, S);
            }
            else{
                S.push(p);
            }

            circle = trivial(R);

            for(let i = 0; i < S.length; i++){
                if(!insideCircle(circle, S[i])){
                    P = P.concat(S);
                    S = [];
                    break;
                }
            }
        }

        ctx.beginPath();
        ctx.arc(circle.x, circle.y, circle.r, 0, Math.PI*2);
        ctx.stroke();
    }
}

//algorytm 4
function lineIntersection(line1, line2){
    //line 1
    let p = line1.start;
    let r = {
        x: line1.end.x - p.x,
        y: line1.end.y - p.y,
    };

    //line 2
    let q = line2.start;
    let s = {
        x: line2.end.x - q.x,
        y: line2.end.y - q.y,
    };

    let qMINUSp = {
        x: q.x - p.x,
        y: q.y - p.y,
    };

    let rCROSSs = cross(r, s);

    if(rCROSSs != 0){
        let t = cross(qMINUSp, s) / rCROSSs;
        let u = cross(qMINUSp, r) / rCROSSs;
    
        if(0 <= t && t <= 1 && 0 <= u && u <= 1){
            return {
                x: p.x + t * r.x,
                y: p.y + t * r.y,
            };
        }
    }
}

function algorytm4(shapes) {
    if(shapes.length > 1){
        let lines = [];
        let results = [];

        shapes.forEach((el) => {
            if(el.type == "line")
                lines.push(el);
        });

        if(lines.length > 1){
            for(let i = 0; i < lines.length; i++){
                for(let j = i + 1; j < lines.length; j++){
                    let temp = lineIntersection(lines[i], lines[j]);
                    if(temp != undefined){
                        results.push(temp);
                    }
                }
            }
        }

        results.forEach((el) => {
            new Point(el, 5, "#eb2f06").draw();
        });
    }
}

//algorytm 8
function algorytm8(rect, points){
    let counter = 0;

    points.forEach((el) => {
        if(rect.w > 0 && rect.h > 0){
            if(rect.x < el.center.x && el.center.x < rect.x + rect.w && rect.y < el.center.y && el.center.y < rect.y + rect.h)
                counter++;
        }
        else if(rect.w > 0 && rect.h < 0){
            if(rect.x < el.center.x && el.center.x < rect.x + rect.w && rect.y + rect.h < el.center.y && el.center.y < rect.y)
                counter++;
        }
        else if(rect.w < 0 && rect.h > 0){
            if(rect.x + rect.w < el.center.x && el.center.x < rect.x && rect.y < el.center.y && el.center.y < rect.y + rect.h)
                counter++;
        }
        else if(rect.w < 0 && rect.h < 0){
            if(rect.x + rect.w < el.center.x && el.center.x < rect.x && rect.y + rect.h < el.center.y && el.center.y < rect.y)
                counter++;
        }
    });
    
    if(counter == 1)
        console.log("There is " + counter + " point in the rectangle.");
    else
        console.log("There are " + counter + " points in the rectangle.");
}

//algorytm 16
function getPointsOrderedByY(minX, maxX, allPointsOrderedByY) {
 return allPointsOrderedByY.filter(function (p) {
   return p.x >= minX && p.x < maxX;
});
}

function divide(points) {
    var half = Math.floor(points.orderedByX.length / 2),
        leftByX = points.orderedByX.slice(0, half),
        leftByY = getPointsOrderedByY(-Infinity, points.orderedByX[half].x, points.orderedByY),
        rightByX = points.orderedByX.slice(half),
        rightByY = getPointsOrderedByY(points.orderedByX[half].x, Infinity, points.orderedByY);

    return {
      left: {orderedByX: leftByX, orderedByY: leftByY},
      right: {orderedByX: rightByX, orderedByY: rightByY}
    };
}

function minBy(collection, key){
    return collection.reduce((a, b) => a[key] <= b[key] ? a : b, {});
};

function baseCase(points) {
    var combinations;

    if (points.length === 2) {
        return points;
    }

    combinations = [
      [points[0], points[1]],
      [points[0], points[2]],
      [points[1], points[2]]
    ];

    return minBy(combinations, getDistance);
}

function getDistance(pair) {
    return Math.sqrt(Math.pow(pair[0].center.x - pair[1].center.x, 2) + Math.pow(pair[0].center.y - pair[1].center.y, 2));
}

function getCandidates(orderedByY, validXInterval) {
    return orderedByY.filter(function (p) {
        return (p.x > validXInterval.min) && (p.x < validXInterval.max);
    });
}

function getClosestPairInIntersection(points) {
    var minDist = Infinity,
        closestPair;

    for (let i = 0; i < points.length; i++) {
        for (let j = i + 1; j < points.length && j - i <= 15; j++) {
            let distance = getDistance([points[i], points[j]]);
            if (distance < minDist) {
                minDist = distance;
                closestPair = [points[i], points[j]];
            }
        }
    }

    return closestPair;
}

function combine(left, right, closestOnLeft, closestOnRight) {
    var closestPair = minBy([closestOnLeft, closestOnRight], getDistance),
        minDist = getDistance(closestPair),
        allOrderedByY = left.orderedByY.concat(right.orderedByY),
        frontierPoint = left.orderedByX[left.orderedByX.length - 1],
        xInterval = {min: frontierPoint.x - minDist, max: frontierPoint.x + minDist},
        candidatesByY = getCandidates(allOrderedByY, xInterval)
        closestInIntersection = getClosestPairInIntersection(candidatesByY);

    if (!closestInIntersection) return closestPair;
    return Math.minBy([closestPair, closestInIntersection], getDistance);
}

  // T(n) = 2T(n/2) + O(n) + O(n) = O(n log n)
function getClosestPairOrdered(points) {
    var subproblems, closestOnLeft, closestOnRight;

    if (points.orderedByX.length <= 3) {
      return baseCase(points.orderedByX); // O(1)
}

    subproblems = divide(points); // O(n)
    closestOnLeft = getClosestPairOrdered(subproblems.left);
    closestOnRight = getClosestPairOrdered(subproblems.right);

    return combine(subproblems.left, subproblems.right, closestOnLeft, closestOnRight); // O(n)
}

function compareX(p1, p2) {
    return p1.center.x - p2.center.x;
}
function compareY(p1, p2) {
    return p1.center.y - p2.center.y;
}

function algorytm16(points) {
    let result = getClosestPairOrdered({
        orderedByX: points.sort(compareX),
        orderedByY: points.sort(compareY),
    });

    ctx.beginPath()
    ctx.moveTo(result[0].center.x, result[0].center.y);
    ctx.lineTo(result[1].center.x, result[1].center.y);
    ctx.stroke();
    ctx.closePath();
}