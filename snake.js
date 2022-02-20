//Elements vars
var $body = document.querySelector("body");
var $container = document.querySelector(".container");
var $leaderboard = document.querySelector(".leaderboard");
var $snake = document.getElementsByClassName("snake");
var $inside = document.querySelector(".inside");
var $outside = document.querySelector(".outside");
var $points = document.querySelector(".points");
var $root = document.querySelector(":root");

//Object vars
var bodySide = $body.getBoundingClientRect().width;
var sides = bodySide * 0.40 - ((bodySide * 0.40) % 100);    //The field sides have 40% of view width
var snakeSize = sides * 0.05;   //Snake have 5% of field size
var points = 0;
var username = localStorage.getItem("Name");
var userpoints = localStorage.getItem("Points");
var size = $snake.length;
var head = $snake[size - 1];
var createFood = null;
var game = null;
var lock = false;
var headDirection = null;

function createGame(){
    biggestScore = userpoints;
    if(username == null){
    	document.querySelector(".username").innerText = "Usuário";
    	document.querySelector(".userpoints").innerText = "0";
    }else{
    	document.querySelector(".username").innerText = username;
    	document.querySelector(".userpoints").innerText = userpoints;
    }
    headDirection = "Down";
    $outside.style.width = sides + (snakeSize * 2) + "px";
    $outside.style.height = sides + (snakeSize * 2) + "px";
    $outside.style.left = ($body.getBoundingClientRect().width / 2) - ($outside.getBoundingClientRect().width / 2) + "px";
    $outside.style.top = ($body.getBoundingClientRect().height / 2) - ($outside.getBoundingClientRect().height / 2) + "px";
    $inside.style.width = sides + "px";
    $inside.style.height = sides + "px";
    $leaderboard.style.width = "25%";
    $leaderboard.style.right = "2.5%";
    $leaderboard.style.top = ($body.getBoundingClientRect().height * 0.25) + "px";
    $root.style.setProperty("--size", snakeSize + "px");
    
    if($inside.getBoundingClientRect().height % 10 != 0){
        $inside.style.height = $inside.getBoundingClientRect().height - ($inside.getBoundingClientRect().height % 10) + "px";
    }
    if($inside.getBoundingClientRect().width % 10 != 0){
        $inside.style.width = $inside.getBoundingClientRect().width - ($inside.getBoundingClientRect().width % 10) + "px";
    }
}

function headHorizontalPosition(){
    return head.getBoundingClientRect().left;
}

function headVerticalPosition(){
    return head.getBoundingClientRect().top;
}

function headNearPosition(direction){
    if(direction == "Down"){
        return headVerticalPosition() + snakeSize;
    }
    if(direction == "Up"){
        return headVerticalPosition() - snakeSize;
    }
    if(direction == "Right"){
        return headHorizontalPosition() + snakeSize;
    }
    if(direction == "Left"){
        return headHorizontalPosition() - snakeSize;
    }
}

function getNearElement(direction){
    if(direction == "Down"){
        return document.elementFromPoint(headHorizontalPosition(), headNearPosition("Down"));
    }
    if(direction == "Up"){
        return document.elementFromPoint(headHorizontalPosition(), headNearPosition("Up"));
    }
    if(direction == "Right"){
        return document.elementFromPoint(headNearPosition("Right"), headVerticalPosition());
    }
    if(direction == "Left"){
        return document.elementFromPoint(headNearPosition("Left"), headVerticalPosition());
    }
}

function end(){
    clearInterval(createFood);
    clearInterval(game);
    $end = document.createElement("div");
    $end.setAttribute("class", "end");
    let msgWidth = $inside.getBoundingClientRect().width / 2;
    let msgHeight = $inside.getBoundingClientRect().height / 2;
    $end.style.width = $inside.getBoundingClientRect().width + "px";
    $end.style.height = $inside.getBoundingClientRect().height / 4 + "px";
    $end.style.left = ($body.getBoundingClientRect().width / 2) - $inside.getBoundingClientRect().width / 2 + "px";
    $end.style.top = ($body.getBoundingClientRect().height / 2) - ($inside.getBoundingClientRect().width * 0.2) + "px";
    if(points > biggestScore){
    	$end.innerHTML = "<h1>Novo recorde</h1><input class='input_name' type='text' placeholder='Informe seu nome' autofocus><button class='retry'>Tentar novamente</button>";
		$container.appendChild($end);
    	let $button = document.querySelector(".retry");
    	$button.addEventListener("click", function(){
    		localStorage.setItem("Name", document.querySelector(".input_name").value);
    		localStorage.setItem("Points", points);
	        document.location.reload();
	    });
	    document.addEventListener("keydown", function(e){
	    	console.log(e);
	    	if(e.key == "Enter"){
	    		localStorage.setItem("Name", document.querySelector(".input_name").value);
	    		localStorage.setItem("Points", points);
		        document.location.reload();
		    }
	    });
    }else{
    	$end.innerHTML = "<h1 class='lose'>Perdeu</h1><button class='retry'>Tentar novamente</button>";
		$container.appendChild($end);
    	let $button = document.querySelector(".retry");
    	$button.addEventListener("click", function(){
	        document.location.reload();
	    });
	    document.addEventListener("keydown", function(e){
	    	if(e.key == "Enter"){
		        document.location.reload();
		    }
		});
    }
}

function getNearClass(direction){
    return getNearElement(direction).getAttribute("class");
}

function eat(direction){
    $inside.removeChild(getNearElement(direction));
    document.querySelector(".points_value").innerText = ++points;
    for(var i = 0; i < 2; i++){
        var newPart = document.createElement("div");
        newPart.setAttribute("class", "snake");
        newPart.style.top = headVerticalPosition() - $inside.getBoundingClientRect().top + "px";
        newPart.style.left = headHorizontalPosition() - $inside.getBoundingClientRect().left + "px";
        $inside.appendChild(newPart);
    }
    $snake = document.getElementsByClassName("snake");
    size = document.getElementsByClassName("snake").length;
    head = document.getElementsByClassName("snake")[size - 1];
}

function move(direction){
    //Note: The head position must adjusted in relation to inside due to the absolute position attribute
    let x = headHorizontalPosition();
    let y = headVerticalPosition();
    if(direction == "Down"){
        head.style.top = headNearPosition("Down") - $inside.getBoundingClientRect().top + "px";
    }
    if(direction == "Up"){
        head.style.top = headNearPosition("Up") - $inside.getBoundingClientRect().top + "px";
    }
    if(direction == "Left"){
        head.style.left = headNearPosition("Left") - $inside.getBoundingClientRect().left + "px";
    }
    if(direction == "Right"){
        head.style.left = headNearPosition("Right") - $inside.getBoundingClientRect().left + "px";
    }
    for(let slice = size - 2; slice >= 0; slice--){
        let newX = $snake[slice].getBoundingClientRect().left;
        let newY = $snake[slice].getBoundingClientRect().top;
        $snake[slice].style.left = x - $inside.getBoundingClientRect().left + "px";
        $snake[slice].style.top = y - $inside.getBoundingClientRect().top + "px";
        x = newX;
        y = newY;
    }
}

function startGame(){
    document.addEventListener("keydown", function(e){
        if(lock == false){
            if(e.key == "ArrowDown"){
                if(headDirection != "Up"){
                    headDirection = "Down";
                    lock = true;
                }
            }

            if(e.key == "ArrowUp"){
                if(headDirection != "Down"){
                    headDirection = "Up";
                    lock = true;
                }
            }

            if(e.key == "ArrowRight"){
                if(headDirection != "Left"){
                    headDirection = "Right";
                    lock = true;
                }
            }

            if(e.key == "ArrowLeft"){
                if(headDirection != "Right"){
                    headDirection = "Left";
                    lock = true;
                }
            }
        }
    });

    createFood = setInterval(function(){
        var $food = document.createElement("div");
        $food.setAttribute("class", "food");
        let x = (Math.random() * $inside.getBoundingClientRect().width);
        let y = (Math.random() * $inside.getBoundingClientRect().height);
        if(x % snakeSize != 0){
            x -= x % snakeSize;
        }
        if(y % snakeSize != 0){
            y -= y % snakeSize;
        }
        if(document.elementFromPoint(x + $inside.getBoundingClientRect().left, y + $inside.getBoundingClientRect().top).getAttribute("class") == "inside"){   
            $food.style.top = y + "px";
            $food.style.left = x + "px";
            $inside.appendChild($food);
        }
    }, 3000);

    game = setInterval(function(){
        if(getNearClass(headDirection) == "snake" || getNearClass(headDirection) == "outside"){
                end();
        }else{
            if(getNearClass(headDirection) == "food"){
                eat(headDirection);
            }
            move(headDirection);
        }
        lock = false;
    },60);
}

createGame();
startGame();