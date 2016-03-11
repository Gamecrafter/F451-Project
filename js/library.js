//Globals
var scene;
var back;
var player;
var beetles;
var firemen;
var hounds;
var books;
var canisters;
var hearts;
//Player
function Player(){
    var health = 4;
    var level = 1;
    var score = 0;
    var cheats = false;
    var player = new Sprite(scene, "images/player.png", 192, 264);
    player.loadAnimation(192, 264, 64, 66);
    player.generateAnimationCycles();
    player.renameCycles(["down", "left", "right", "up"]);
    player.setAnimationSpeed(500);
    player.pauseAnimation();
    player.setCurrentCycle("down");
    player.maxSpeed = 5;
    player.minSpeed = 0;
    player.setSpeed(0);
    player.setAngle(90);
    player.setX(400);
    player.setY(200);
    player.checkKeys = function(){
        if(keysDown[K_LEFT]){
            this.changeSpeedBy(1);
            if(this.speed > this.maxSpeed) this.setSpeed(this.maxSpeed);
            player.playAnimation();
            player.setMoveAngle(270);
            player.setCurrentCycle("left");
        }
        else if(keysDown[K_RIGHT]){
            this.changeSpeedBy(1);
            if(this.speed > this.maxSpeed) this.setSpeed(this.maxSpeed);
            player.playAnimation();
            player.setMoveAngle(90);
            player.setCurrentCycle("right");
        }
        else if(keysDown[K_UP]){
            this.changeSpeedBy(1);
            if(this.speed > this.maxSpeed) this.setSpeed(this.maxSpeed);
            player.playAnimation();
            player.setMoveAngle(0);
            player.setCurrentCycle("up");
        }
        else if(keysDown[K_DOWN]){
            this.changeSpeedBy(1);
            if(this.speed > this.maxSpeed) this.setSpeed(this.maxSpeed);
            player.playAnimation();
            player.setMoveAngle(180);
            player.setCurrentCycle("down");
        }
    };
    player.getHealth = function(){
        return health;
    };
    player.setHealth = function(num){
        if(typeof num === "number") health = num;
    };
    player.getLevel = function(){
        return level;
    };
    player.setLevel = function(num){
        if(typeof num === "number") level = num;
    };
    player.getScore = function(){
        return score;
    };
    player.setScore = function(num){
        if(typeof num === "number") score = num;
    };
    player.hasCheats = function(){
        return cheats;
    };
    player.setCheats = function(value){
        if(typeof value === "boolean") cheats = value;
    };
    return player;
}
//Enemies
function Beetle(){
    var health = 5;
    var beetle = new Sprite(scene, "images/beetle.png", 32, 32);
    beetle.getHealth = function(){
        return health;
    };
    beetle.setHealth = function(num){
        if(typeof num === "number") health = num;
    };
    return beetle;
}
function Fireman(){
    var health = 2;
    var fireman = new Sprite(scene, "images/fireman.png", 192, 264);
    fireman.loadAnimation(192, 264, 64, 66);
    fireman.generateAnimationCycles();
    fireman.renameCycles(["down", "left", "right", "up"]);
    fireman.setAnimationSpeed(500);
    fireman.pauseAnimation();
    fireman.setCurrentCycle("down");
    fireman.maxSpeed = 5;
    fireman.minSpeed = 0;
    fireman.setSpeed(0);
    fireman.setAngle(90);
    fireman.getHealth = function(){
        return health;
    };
    fireman.setHealth = function(num){
        if(typeof num === "number") health = num;
    };
    return fireman;
}
function Hound(){
    var health = 6;
    var hound = new Sprite(scene, "images/hound.png", 32, 32);
    hound.getHealth = function(){
        return health;
    };
    hound.setHealth = function(num){
        if(typeof num === "number") health = num;
    };
    return hound;
}
//Items
function Book(){
    var book = new Sprite(scene, "images/book.png", 32, 32);
    return book;
}
function Canister(){
    var canister = new Sprite(scene, "images/canister.png", 32, 32);
    return canister;
}
function Heart(){
    var heart = new Sprite(scene, "images/heart.png", 32, 32);
    return heart;
}
//Game
function checkCode(){
    var code = document.getElementById("code").value.toLowerCase();;
    var outMessage = document.getElementById("outMessage");
    switch(code){
        case "451":
            outMessage.style.color = "#488214";
            outMessage.innerHTML = "Infinite fire enabled! You won't need to collect canisters from now on.";
            break;
        case "bible":
            outMessage.style.color = "#488214";
            outMessage.innerHTML = "Superspeed enabled! You'll now move 6 times faster than you did before.";
            player.maxSpeed = 30;
            break;
        case "library":
            outMessage.style.color = "#488214";
            outMessage.innerHTML = "Books will now spawn more frequently!";
            break;
        case "phoenix":
            outMessage.style.color = "#488214";
            outMessage.innerHTML = "Infinite life enabled! There's no point in collecting hearts anymore.";
            break;
        default:
            outMessage.style.color = "#ff0000";
            outMessage.innerHTML = "Sorry, that code didn't look right.";
            break;
    }
}
function init(){
    scene = new Scene();
    back = new Sprite(scene, "images/back.png", 1200, 1200);
    back.setSpeed(0);
    player = new Player();
    scene.start();
}
function update(){
    scene.clear();
    back.update();
    player.checkKeys();
    player.update();
}
//Events
window.addEventListener("keydown", function(event){
    switch(event.keyCode){
        case K_LEFT:
        case K_RIGHT:
        case K_UP:
        case K_DOWN:
        case K_SPACE:
            event.preventDefault();
            break
        default:
            break;
    }
}, false);