var size = 20;
var theblock = [];
var direction = "up";
var prevDirection = "";
var timer;
var segment;
var speed = 300;
var tailX;
var tailY;


$(function () {
    prevDirection = direction;
    var element = document.getElementById("game-body");
    var mc = new Hammer(element);
    mc.get('swipe').set({ direction: Hammer.DIRECTION_ALL });
    mc.on("swipeleft", function () {
        //direction = "left";
        prevDirection = direction;
        direction = prevDirection != "right" ? "left" : direction;
    });
    mc.on("swiperight", function () {
        //direction = "right";
        prevDirection = direction;
        direction = prevDirection != "left" ? "right" : direction;
    });
    mc.on("swipeup", function () {
        //direction = "up";
        prevDirection = direction;
        direction = prevDirection != "down" ? "up" : direction;
    });
    mc.on("swipedown", function () {
        //direction = "down";
        prevDirection = direction;
        direction = prevDirection != "up" ? "down" : direction;
    });

    

    //load the game
    load();
});

function gameOver(){
    $('.game-result-backdrop').show();
}

function increaseSpeed(){
    if(speed >= 100){
        speed -= 20;
        clearInterval(timer);
        timer = setInterval(function () { move(); }, speed);
        console.log(speed, theblock);
    }
}

function updateScore(){
    $('.score').val(theblock.length);
    console.log($('.score').html(theblock.length * 10 - 20));
}

function drawGrid() {
    $("#grid tbody tr").remove();
    for (var i = 0; i < size; i++) {
        var row = document.createElement("tr");

        for (var x = 0; x < size; x++) {
            var cell = document.createElement("td");
            row.appendChild(cell);
        }

        $("#grid tbody").append(row);
        //document.getElementById("grid").appendChild(row);
    }
    var {width, height} = document.querySelector('.game-content').getBoundingClientRect();
    //console.log(width, height);
    document.querySelectorAll('#grid td').forEach(td => {
        //console.log(width/size);
        td.style.width = width/size + 'px';
    })
}

function load() {
    //size = 30;
    theblock = [];
    direction = "up";
    prevDirection = "";
    speed = 300;
    
    $('.game-result-backdrop').hide();

    drawGrid();
    theblock = [{ x: Math.floor(size / 2), y: Math.floor(size / 2) }, { x: Math.floor(size / 2), y: Math.floor(size / 2) + 1}];
    drawBlock();
    createSegment();
    start();
}

function drawBlock() {
    $('.black').removeClass('black'); 
    var parent = document.getElementById("grid");
    theblock.forEach(function (item, index) {
        //parent.rows[item.y].cells[item.x].style.backgroundColor = "black";
        parent.rows[item.y].cells[item.x].classList.add('black');
     });
    //parent.rows[theblock.y].cells[theblock.x].style.backgroundColor = "black";    
}

function move() {
    var parent = document.getElementById("grid");
    var tail = theblock[theblock.length - 1];
    tailX = tail.x;
    tailY = tail.y;
    //parent.rows[tail.y].cells[tail.x].style.backgroundColor = "white";
    //$('.black').removeClass('black'); //.addClass('white');
    var x = 0, y = 0;
    switch (direction) {
        case "up":
            //theblock.y--;
            y--;
            break;
        case "down":
            //theblock.y++;
            y++;
            break;
        case "right":
            //theblock.x++;
            x++;
            break;
        case "left":
            //theblock.x--;
            x--;
            break;
    }

    for (var i = theblock.length - 1; i > 0; i--) {
        theblock[i].x = theblock[i - 1].x;
        theblock[i].y = theblock[i - 1].y;
    }
        
    theblock[0].x += x;
    theblock[0].y += y;

    //if border game over else move the block
    var head = theblock[0];
    if (head.x >= size || head.x < 0 || head.y >= size || head.y < 0|| parent.rows[head.y].cells[head.x].className == "black"){
        clearInterval(timer);
        //alert("Game Over");
        gameOver();
    }
    else {
        
        //parent.rows[theblock.y].cells[theblock.x].style.backgroundColor = "black";
        //parent.rows[theblock.y].cells[theblock.x].classList.remove('white');
        //parent.rows[theblock.y].cells[theblock.x].classList.add('black');
        checkCollision();
        drawBlock();
    }
}


function start() {
    document.onkeydown = checkKey;
    timer = setInterval(function () { move(); }, speed);
}


function checkKey(e) {
    e = e || window.event;
    prevDirection = direction;
    if (e.keyCode == '38') {
        // up arrow
        //alert('up');
        direction = prevDirection != "down" ? "up" : direction;
    }
    else if (e.keyCode == '40') {
        // down arrow
        //alert('down');
        direction = prevDirection != "up" ? "down" : direction;
        //direction = "down";
    }
    else if (e.keyCode == '37') {
        // left arrow
        //alert('left');
        direction = prevDirection != "right" ? "left" : direction;
        //direction = "left";
    }
    else if (e.keyCode == '39') {
        // right arrow
        //alert('right');
        direction = prevDirection != "left" ? "right" : direction;
        //direction = "right";
    }
    //console.log(direction);
    //move();
}

function getRandomPosition(){
    var randomX = Math.floor(Math.random() * size);
    var randomY = Math.floor(Math.random() * size);

    return { x: randomX, y: randomY };
}

function createSegment() {
    //var randomX = Math.floor(Math.random() * size);
    //var randomY = Math.floor(Math.random() * size);
    
    do{
        segment = getRandomPosition();
    }while(isOverlapping(segment));

    //segment = { x: randomX, y: randomY };

    var parent = document.getElementById("grid");
    //parent.rows[segment.y].cells[segment.x].style.backgroundColor = "red";
    parent.rows[segment.y].cells[segment.x].classList.add('red');
    
}

function isOverlapping(segment) {
    var isTrue = false;
    //console.log(segment);
    theblock.forEach(function (item, index) {
        //console.log(item);
        //console.log(index);
        if (segment.x == item.x && segment.y == item.y) {
            isTrue = true;
        }
        //console.log(isTrue);
    });
    return isTrue;
}



function checkCollision() {
    var head = theblock[0];
    if (segment.x == head.x && segment.y == head.y) {
        $('.red').removeClass('red');
        console.log(speed);
        increaseSpeed();
        addNewBlock();
        createSegment();
        updateScore();
    }

}

function addNewBlock() {
//    var tail = theblock[theblock.length - 1];
//    var isBoundry = false;
//    var newX = tail.x;
//    var newY = tail.y;
//    switch (direction) {
//        case "up":                    
//            isBoundry = tail.x == size - 1 ? true : false;
//            newX++;
//            break;
//        case "down":
//            isBoundry = tail.x == 0 ? true : false;
//            newX--;
//            break;
//        case "right":
//            isBoundry = tail.y == 0 ? true : false;
//            newY--;
//            break;
//        case "left":
//            isBoundry = tail.y == size - 1 ? true : false;
//            newY++;
//            break;
//    }

    theblock.push({ x: tailX, y: tailY });
    //drawBlock()
}
