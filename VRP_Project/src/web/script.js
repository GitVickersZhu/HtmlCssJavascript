var canvas = document.getElementById("viewPort");
var addVertexBtn = document.getElementById("addVertex");
var solveBtn = document.getElementById("solve");
var loadBtn = document.getElementById("load");

var modal = document.getElementById('myModal');
var span = document.getElementsByClassName("close")[0];

var vertexArr = [];
var solutions;
var counter_node = 0;
var routeColors = ["Tomato", "Orange", "DodgerBlue", "SlateBlue", "Violet", "DeepPink", "Gold", "Sienna"];

var popup = document.getElementById("myPopup");

var datafile = "info.dat"

window.onclick = function(event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
}

window.onload = function () {
    canvasListen();
};

function getEventPosition(ev){
    var x, y;
    if (ev.layerX || ev.layerX == 0) {
        x = ev.layerX;
        y = ev.layerY;
    } else if (ev.offsetX || ev.offsetX == 0) { // Opera
        x = ev.offsetX;
        y = ev.offsetY;
    }
    return {X: x, Y: y};
}

function canvasListen(){
    canvas.addEventListener('click',function(e){
        popup.style.visibility = "hidden";

        var current = getEventPosition(e);
        var selected = isClicked(current);

        console.log(current);
        console.log(selected);

        if(selected){
            console.log("SEL");
            $("li:first-child").text("X: "+selected.X);
            $("li:nth-child(2)").text("Y: "+selected.Y);
            popup.style.top = (selected.Y-105).toString() + "px";
            popup.style.left = (selected.X).toString() + "px";
            $("li:nth-child(3)").text("id: "+selected.id);
            popup.style.visibility = "visible";
        }
    },false);
}
function isClickedSingle(pos1, pos2){
    return pos1.X <= pos2.X + 10 && pos1.X >= pos2.X - 10 && pos1.Y <= pos2.Y + 10 && pos1.Y >= pos2.Y - 10;
}

function isClicked(e) {
    var i = 0;
    for(i = 0; i < vertexArr.length; i++){
        if(isClickedSingle(e, vertexArr[i]))
            return vertexArr[i];
    }
    return 0;
}

$('#xScr').on('input',function(){
    $('#xAxis').val($(this).val());
});
$('#xAxis').on('input',function(){
    if($(this).val() < 0 || $(this).val() > 800)
        alert("Over range!");
    $('#xScr').val($(this).val());
});
$('#yScr').on('input',function(){
    $('#yAxis').val($(this).val());
});
$('#yAxis').on('input',function(){
    if($(this).val() < 0 || $(this).val() > 600)
        alert("Over range!");
    $('#yScr').val($(this).val());
});
$('#numOfVehicles').on('input',function(){
    $('#vNum').val($(this).val());
});
$('#vNum').on('input',function(){
    if($(this).val() < 0 || $(this).val() > 10)
        alert("Over range!");
    $('#numOfVehicles').val($(this).val());
});

addVertexBtn.onclick = function () {
    var X = parseInt($("input#xAxis").val());
    var Y = parseInt($("input#yAxis").val());

    // POST data
    const item = {
        'id':counter_node,
        'X':X,
        'Y':Y
    };
    vertexArr.push(item);
    draw(item);
    counter_node++;
}

function postNode(item) {
    $.ajax({
        type: 'POST',
        url: 'http://localhost:1234/node',
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json, charset=utf-8"
        },
        data: JSON.stringify(item),
        dataType:"json",

        error: function (jqXHR, textStatus, errorThrown) {
            console.log(jqXHR.statusText);
            console.log(textStatus);
            console.log(errorThrown);
        },

        success: function (result) {
            console.log(result);
        }
    });
};

solveBtn.onclick = function () {
    if (vertexArr.length > 1) {
        n_vehicles = parseInt($("input#vNum").val());

        $.ajax({
            type: 'POST',
            url: 'http://localhost:1234/vehicles',
            headers: {
                Accept: "application/json",
            },
            data: $("input#vNum").val(),
    
            error: function (jqXHR, textStatus, errorThrown) {
                console.log(jqXHR.statusText);
                console.log(textStatus);
                console.log(errorThrown);
            },
    
            success: function (result) {
                console.log(result);
            }
        });

        vertexArr.forEach(function(item) {
            postNode(item);
        })

        $.ajax({
            type: 'GET',
            url: 'http://localhost:1234/solution',
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json, charset=utf-8"
            },
    
            error: function (jqXHR, textStatus, errorThrown) {
                console.log(jqXHR.statusText);
                console.log(textStatus);
                console.log(errorThrown);
            },
            
            success: function (result) {
                solutions = result;

                clearCanvas();
                drawSolutions();
                reDraw();
            }
        });
        modal.style.display = "block";
    }
};

loadBtn.onclick = function () {
    $.ajax({
        type: 'GET',
        url: 'http://localhost:1234/data',
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json, charset=utf-8"
        },

        error: function (jqXHR, textStatus, errorThrown) {
            console.log(jqXHR.statusText);
            console.log(textStatus);
            console.log(errorThrown);
        },
        
        success: function (result) {
            $("input#vNum").val(parseInt(result[0]));
            $("input#numOfVehicles").val(parseInt(result[0]));
            nodes = result.slice(1, result.length);
            vertexArr.length = 0
            nodes.forEach(function(item) {
                vertexArr.push(JSON.parse(item))
            });
            counter_node = vertexArr.length;

            clearCanvas();
            reDraw();
        }
    });
};

function randomInt(min, max) {
    return Math.random()*(max - min) + min;
}

function draw(item) {
    var ctx = canvas.getContext("2d");
    ctx.beginPath();
    ctx.arc(item.X, item.Y, 10, 0, 2 * Math.PI);

    if (item.id == 0) {
        ctx.fillStyle = "red";
    } else {
        ctx.fillStyle = "black";
    }

    ctx.fill();
    ctx.closePath();

    ctx.textAlign = 'center';
    ctx.fillStyle = "white";
    ctx.fillText(item.id.toString(), item.X, item.Y+3);
    ctx.stroke();
}

function clearCanvas() {
    var ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function reDraw(clear) {
    vertexArr.forEach(function (item) {
        draw(item);
    });
}

function drawSolutions() {
    var ctx = canvas.getContext("2d");
    var total_distance = 0;

    $('#infoSolutions').empty();
    $('#infoSolutions').append('<p><strong>Distance by vehicle:</strong></p>');

    for (var i = 0; i < n_vehicles; i++) {
        sol = solutions[i];
        route_dist = 0
        for (var j = 0; j < sol[1].length; j++) {
            x1 = vertexArr[sol[0][j]].X
            y1 = vertexArr[sol[0][j]].Y
            x2 = vertexArr[sol[0][j+1]].X
            y2 = vertexArr[sol[0][j+1]].Y

            dist = sol[1][j];
            route_dist += dist;

            ctx.beginPath();
            ctx.textAlign = 'center';
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);

            //ctx.moveTo((x1+x2)/2, (y1+y2)/2);
            //ctx.lineTo((x1+x2)*1.5/2, (y1+y2)*1.5/2);
            //ctx.lineTo((x1+x2)/2+50, (y1+y2)/2+50);

            ctx.strokeStyle = routeColors[i];
            ctx.stroke();

            ctx.fillStyle = "green";
            ctx.fillText(dist.toString(), (x1+x2)/2, (y1+y2)/2);
            ctx.strokeStyle = "green";
            ctx.strokeText(dist.toString(), (x1+x2)/2, (y1+y2)/2);

        }
        // Display solutions in text
        str0 = '<p style="color:'.concat(routeColors[i])
        str1 = ';">Vehicle ';
        str2 = i.toString();
        str3 = ": ";
        str4 = route_dist.toString();
        str5 = "m</p>"
        res = str0.concat(str1, str2, str3, str4, str5);
        $('#infoSolutions').append(res);

        total_distance += route_dist;
    }
    $('#infoSolutions').append("<p><strong>Total distance:</strong></p>");
    $('#infoSolutions').append("<p>".concat(total_distance.toString(), "m</p>"));
}