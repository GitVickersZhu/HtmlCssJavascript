var canvas = document.getElementById("viewPort");

var addVertexBtn = document.getElementById("addVertex");

var refreshBtn = document.getElementById("refreshGraph");

var tbl = document.getElementById("graph");

var vertexTopArr = [];
var vertexLeftArr = [];

var counter = 0;

addVertexBtn.onclick = function () {
    var top = randomInt(0, canvas.height);
    var left = randomInt(0, canvas.width);

    var ctx = canvas.getContext("2d");
    ctx.beginPath();
    ctx.arc(left, top, 10, 0, 2 * Math.PI);
    ctx.fillStyle = "black";
    ctx.fill();
    ctx.closePath();
    vertexLeftArr.push(left);
    vertexTopArr.push(top);
    ExpTbl();
    Over();
};

refreshBtn.onclick = function () {
    var ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for(var i = 0 ; i < vertexTopArr.length; i++){
        var top = randomInt(0, canvas.height);
        var left = randomInt(0, canvas.width);
        ctx.beginPath();
        ctx.arc(left, top, 10, 0, 2 * Math.PI);
        ctx.fillStyle = "black";
        ctx.fill();
        ctx.closePath();
        vertexLeftArr.shift(vertexLeftArr[i]);
        vertexTopArr.shift(vertexTopArr[i]);
        vertexLeftArr.push(left);
        vertexTopArr.push(top);
    }
};

window.setInterval(Over,20);

function Over() {
    for(var i = 0; i < vertexTopArr.length; i++){
        for(var j = 0; j < vertexTopArr.length; j++){
            tbl.rows[i].cells[j].onmouseover = function () {
                var ctx = canvas.getContext("2d");
                ctx.beginPath();
                ctx.arc(vertexLeftArr[i], vertexTopArr[i], 10, 0, 2 * Math.PI);
                ctx.arc(vertexLeftArr[j], vertexTopArr[j], 10, 0, 2 * Math.PI);
                ctx.fillStyle = "yellow";
                ctx.fill();
                ctx.closePath();
            }
            tbl.rows[i].cells[j].onmouseleave = function () {
                alert(i+"+"+j);
                var ctx = canvas.getContext("2d");
                ctx.beginPath();
                ctx.arc(vertexLeftArr[i], vertexTopArr[i], 10, 0, 2 * Math.PI);
                ctx.arc(vertexLeftArr[j], vertexTopArr[j], 10, 0, 2 * Math.PI);
                ctx.fillStyle = "black";
                ctx.fill();
                ctx.closePath();
            }
        }
    }
}
function randomInt(min, max) {
    return Math.random()*(max - min) + min;
}

function ExpTbl() {
    if(!tbl.rows.length){
        var row = tbl.insertRow();
        var cell = row.insertCell();
        cell.innerHTML = "<input type='text'>";
    }
    else {
        for(var i = 0; i < vertexTopArr.length - 1; i++){
            var cell = tbl.rows[i].insertCell();
            cell.innerHTML = "<input type='text'>";
        }
        var row = tbl.insertRow();
        for(var i = 0; i < vertexTopArr.length; i++){
            var cell = row.insertCell();
            cell.innerHTML = "<input type='text'>";
        }
    }
}