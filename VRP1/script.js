var canvas = document.getElementById("viewPort");
var addVertexBtn = document.getElementById("addVertex");
var xValue = document.getElementById("xAxis");
var yValue = document.getElementById("yAxis");

var vertexArr = [];
var binarySelected = [];

window.onload = function () {
    canvasListen();
}
function canvasListen(){
    canvas.addEventListener('click',function(e){
        var selected = isClicked(getEventPosition(e));
        if(selected){
            switch (binarySelected.length) {
                case 0:
                    ReDraw();
                case 1:
                    Draw(selected.x, selected.y, "red");
                    binarySelected.push(getEventPosition(e));
                    DrawLine(binarySelected[0], binarySelected[1]);
                    break;
                case 2:
                    binarySelected = [];
                    break;
            }
        }
        console.log(getEventPosition(e));
    },false);
}

addVertexBtn.onclick = function () {
    var top;
    var left;
    // use for default value
    if(!(parseInt($("input#xAxis").val()) && parseInt($("input#yAxis").val()))){
        if(!parseInt($("input#xAxis").val()))
            top = randomInt(0, 600);
        if(!parseInt($("input#yAxis").val()))
            left = randomInt(0, 800);
    }
    if(!top){
        top = parseInt($("input#xAxis").val());
    }
    if(!left){
        left = parseInt($("input#yAxis").val());
    }
    Draw(left, top);
    vertexArr.push({x: left, y: top});
};
function Draw(left, top, clr = "black") {
    var ctx = canvas.getContext("2d");
    ctx.beginPath();
    ctx.arc(left, top, 10, 0, 2 * Math.PI);
    ctx.fillStyle = clr;
    ctx.fill();
    ctx.closePath();
}
function ReDraw() {
    vertexArr.forEach(function (item) {
        Draw(item.x, item.y);
    });
}

function DrawLine(pos1, pos2) {
    var ctx = canvas.getContext("2d");
    var distance = Math.sqrt(Math.pow(pos1.x-pos2.x, 2) + Math.pow(pos1.y - pos2.y, 2)).toFixed(2);
    ctx.beginPath();
    ctx.textAlign = 'center';
    ctx.moveTo(pos1.x, pos1.y);
    ctx.lineTo(pos2.x, pos2.y);
    ctx.closePath();
    ctx.fillText(distance.toString(), (pos1.x+pos2.x)/2, (pos1.y+pos2.y)/2);
    ctx.strokeText(distance.toString(), (pos1.x+pos2.x)/2, (pos1.y+pos2.y)/2);
    ctx.stroke();
}

function getEventPosition(ev){
    var x, y;
    if (ev.layerX || ev.layerX == 0) {
        x = ev.layerX;
        y = ev.layerY;
    } else if (ev.offsetX || ev.offsetX == 0) { // Opera
        x = ev.offsetX;
        y = ev.offsetY;
    }
    return {x: x, y: y};
}
function isClickedSingle(pos1, pos2){
    return pos1.x <= pos2.x + 10 && pos1.x >= pos2.x - 10 && pos1.y <= pos2.y + 10 && pos1.y >= pos2.y - 10;
}

function isClicked(e) {
    var i = 0;
    for(i = 0; i < vertexArr.length; i++){
        if(isClickedSingle(e, vertexArr[i]))
            return vertexArr[i];
    }
    return 0;
}




function randomInt(min, max) {
    return Math.random()*(max - min) + min;
}