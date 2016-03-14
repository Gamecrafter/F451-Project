//Globals
var paused = false;
var time1 = 10;
var time2 = 120;
var timing1;
var timing2;
var timing3;
var timing4;
var scene;
var back;
var player;
var fireballs = [];
var enemies = [];
var items = [];
//Player
function Player(){
    var health = 50;
    var kerosene = 100;
    var score = 0;
    var cheats = {
        451: false,
        bible: false,
        endgame: false,
        eternal: false,
        library: false,
        phoenix: false,
        wave: false
    };
    var lastDamageCause = null;
    var info = {
        fireball: 0,
        beetle: 0,
        fireman: 0,
        hound: 0,
        book: 0,
        canister: 0,
        heart: 0
    };
    var player = new Sprite(scene, "images/player.png", 192, 264);
    player.loadAnimation(192, 264, 64, 66);
    player.generateAnimationCycles();
    player.renameCycles(["down", "left", "right", "up"]);
    player.setAnimationSpeed(500);
    player.pauseAnimation();
    player.setCurrentCycle("down");
    player.maxSpeed = 10;
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
        else if(keysDown[K_UP]){
            this.changeSpeedBy(1);
            if(this.speed > this.maxSpeed) this.setSpeed(this.maxSpeed);
            player.playAnimation();
            player.setMoveAngle(0);
            player.setCurrentCycle("up");
        }
        else if(keysDown[K_RIGHT]){
            this.changeSpeedBy(1);
            if(this.speed > this.maxSpeed) this.setSpeed(this.maxSpeed);
            player.playAnimation();
            player.setMoveAngle(90);
            player.setCurrentCycle("right");
        }
        else if(keysDown[K_DOWN]){
            this.changeSpeedBy(1);
            if(this.speed > this.maxSpeed) this.setSpeed(this.maxSpeed);
            player.playAnimation();
            player.setMoveAngle(180);
            player.setCurrentCycle("down");
        }
        else if(keysDown[K_SPACE]){
            if(this.getKerosene() > 0 || this.hasCheat("451")){
                if(!this.hasCheat("451")) this.setKerosene(this.getKerosene() - 1);
                var fireball = new Fireball();
                fireball.launch();
                fireballs.push(fireball);
            }
        }
    };
    player.getHealth = function(){
        return health;
    };
    player.setHealth = function(num){
        if(typeof num === "number" && !this.hasCheat("phoenix")) health = num;
        document.getElementById("health").innerHTML = this.getHealth() > 0 ? Math.ceil(this.getHealth()) : -1;
    };
    player.getKerosene = function(){
        return kerosene;
    };
    player.setKerosene = function(num){
        if(typeof num === "number" && !this.hasCheat("451")) kerosene = num;
        document.getElementById("kerosene").innerHTML = this.getKerosene();
    };
    player.getScore = function(){
        return score;
    };
    player.setScore = function(num){
        if(typeof num === "number") score = num;
        document.getElementById("score").innerHTML = this.getScore();
    };

    player.hasCheat = function(name){
        return cheats[name];
    };
    player.setCheat = function(name, value){
        if(typeof value === "boolean") cheats[name] = value;
        document.getElementById("cheats").innerHTML = this.hasCheat(name) ? "On" : "Off";
    };
    player.getLastDamageCause = function(){
        return lastDamageCause;
    };
    player.getInfo = function(){
        return info;
    };
    player.check = function(){
        for(var a = 0; a < enemies.length; a++){
            if(player.distanceTo(enemies[a]) < 30 && !this.hasCheat("phoenix")){
                lastDamageCause = enemies[a];
                player.setHealth(player.getHealth() - enemies[a].getDamage());
            }
        }
        for(var b = 0; b < items.length; b++){
            if(player.distanceTo(items[b]) < 30){
                var item = items[b];
                item.action();
                item.hide();
                items.splice(items.indexOf(item), 1);
                player.getInfo()[item.getName()] += 1;
            }
        }
    };
    return player;
}
//Fireball
function Fireball(){
    var fireball = new Sprite(scene, "images/fireball.png", 32, 32);
    fireball.launch = function(){
        fireball.setSpeed(20);
        this.setBoundAction(DIE);
        this.setPosition(player.x, player.y);
        this.setAngle(player.getMoveAngle());
        this.setImage("images/fireball.png");
        this.setSpeed(20);
        player.getInfo()["fireball"] += 1;
    };
    fireball.check = function(){
        for(var i = 0; i < enemies.length; i++){
            if(fireball.distanceTo(enemies[i]) < 30){
                var enemy = enemies[i];
                fireball.hide();
                fireballs.splice(fireballs.indexOf(this), 1);
                enemies[i].setHealth(enemies[i].getHealth() - 5);
                if(enemy.getHealth() <= 0){
                    enemy.hide();
                    enemies.splice(i, 1);
                    player.setScore(player.getScore() + enemy.getPoints());
                    player.getInfo()[enemy.getName()] += 1;
                }
            }
        }
    };
    return fireball;
}
//Enemies
function Beetle(){
    var name = "beetle";
    var fname = "beetle";
    var damage = 0.05;
    var health = 30;
    var points = 20;
    var beetle = new Sprite(scene, "images/beetle.png", 128, 128);
    beetle.maxSpeed = 9;
    beetle.minSpeed = 0;
    beetle.setSpeed(0);
    beetle.setAngle(90);
    beetle.getName = function(){
        return name;
    };
    beetle.getFName = function(){
        return fname;
    };
    beetle.getDamage = function(){
        return damage;
    };
    beetle.getPoints = function(){
        return points;
    };
    beetle.getHealth = function(){
        return health;
    };
    beetle.setHealth = function(num){
        if(typeof num === "number") health = num;
    };
    beetle.reset = function(){
        this.setPosition(Math.random() * this.cWidth, Math.random() * this.cHeight);
    };
    beetle.move = function(){
        this.changeYby(this.maxSpeed);
    };
    beetle.reset();
    return beetle;
}
function Fireman(){
    var name = "fireman";
    var fname = "firemanalt";
    var damage = 0.01;
    var health = 10;
    var points = 5;
    var fireman = new Sprite(scene, "images/fireman.png", 192, 264);
    fireman.loadAnimation(192, 264, 64, 66);
    fireman.generateAnimationCycles();
    fireman.renameCycles(["down", "left", "right", "up"]);
    fireman.setAnimationSpeed(500);
    fireman.pauseAnimation();
    fireman.setCurrentCycle("right");
    fireman.maxSpeed = 5;
    fireman.minSpeed = 0;
    fireman.setSpeed(0);
    fireman.setAngle(90);
    fireman.getName = function(){
        return name;
    };
    fireman.getFName = function(){
        return fname;
    };
    fireman.getDamage = function(){
        return damage;
    };
    fireman.getPoints = function(){
        return points;
    };
    fireman.getHealth = function(){
        return health;
    };
    fireman.setHealth = function(num){
        if(typeof num === "number") health = num;
    };
    fireman.reset = function(){
        this.setPosition(Math.random() * this.cWidth, Math.random() * this.cHeight);
    };
    fireman.move = function(){
        this.changeSpeedBy(1);
        if(this.speed > this.maxSpeed) this.setSpeed(this.maxSpeed);
        fireman.playAnimation();
        fireman.setMoveAngle(90);
    };
    fireman.reset();
    return fireman;
}
function Hound(){
    var name = "hound";
    var fname = "hound";
    var damage = 0.8;
    var health = 50;
    var points = 40;
    var hound = new Sprite(scene, "images/hound.png", 128, 128);
    hound.maxSpeed = 7;
    hound.minSpeed = 0;
    hound.setSpeed(0);
    hound.setAngle(90);
    hound.getName = function(){
        return name;
    };
    hound.getFName = function(){
        return fname;
    };
    hound.getDamage = function(){
        return damage;
    };
    hound.getPoints = function(){
        return points;
    };
    hound.getHealth = function(){
        return health;
    };
    hound.setHealth = function(num){
        if(typeof num === "number") health = num;
    };
    hound.reset = function(){
        this.setPosition(Math.random() * this.cWidth, Math.random() * this.cHeight);
    };
    hound.move = function(){
        this.changeXby(-this.maxSpeed);
    };
    hound.reset();
    return hound;
}
//Items
function Book(){
    var name = "book";
    var value = Math.round(Math.random() * 4) + 1;
    var points = player.hasCheat("library") ? value * 10 * 3 : value * 10;
    var book = new Sprite(scene, null, 32, 32);
    book.setSpeed(0);
    book.getName = function(){
        return name;
    };
    book.getPoints = function(){
        return points;
    };
    book.reset = function(){
        this.value = Math.round(Math.random() * 4) + 1;
        this.changeImage("images/book"+value+".png");
        this.setPosition(Math.random() * this.cWidth, Math.random() * this.cHeight);
    };
    book.action = function(){
        player.setScore(player.getScore() + this.getPoints());
    };
    book.reset();
    return book;
}
function Canister(){
    var name = "canister";
    var canister = new Sprite(scene, "images/canister.png", 32, 32);
    canister.setSpeed(0);
    canister.getName = function(){
        return name;
    };
    canister.reset = function(){
        this.setPosition(Math.random() * this.cWidth, Math.random() * this.cHeight);
    };
    canister.action = function(){
        var sum = player.getKerosene() + 20;
        if(sum > 100) player.setKerosene(100);
        else player.setKerosene(sum);
    };
    canister.reset();
    return canister;
}
function Heart(){
    var name = "heart";
    var heart = new Sprite(scene, "images/heart.png", 32, 32);
    heart.setSpeed(0);
    heart.getName = function(){
        return name;
    };
    heart.reset = function(){
        this.setPosition(Math.random() * this.cWidth, Math.random() * this.cHeight);
    };
    heart.action = function(){
        var sum = player.getHealth() + 10;
        if(sum > 50) player.setHealth(50);
        else player.setHealth(sum);
    };
    heart.reset();
    return heart;
}
//Game
function createEnemies(num){
    for(var i = 0; i < num; i++){
        var rand = Math.floor(Math.random() * 100);
        if(rand >= 0 && rand <= 80) enemies.push(new Fireman());
        else if(rand >= 81 && rand <= 95) enemies.push(new Beetle());
        else if(rand >= 96 && rand <= 100) enemies.push(new Hound());
    }
}
function createItems(num){
    for(var i = 0; i < num; i++){
        var rand = Math.floor(Math.random() * 100);
        if(rand >= 0 && rand <= 70) items.push(new Book());
        else if(rand >= 71 && rand <= 90) items.push(new Canister());
        else if(rand >= 91 && rand <= 100) items.push(new Heart());
    }
}
function updateEnemies(){
    for(var i = 0; i < enemies.length; i++){
        enemies[i].move();
        enemies[i].update();
        player.check();
    }
}
function updateItems(){
    for(var i = 0; i < items.length; i++) items[i].update();
}
function updateFireballs(){
    for(var i = 0; i < fireballs.length; i++){
        fireballs[i].update();
        fireballs[i].check();
    }
}
function togglePause(){
    if(paused){
        paused = false;
        scene.start();
    }
    else{
        paused = true;
        scene.stop();
    }
}
function countDown(key){
    switch(key){
        case 1:
            if(time1 > 0) time1--;
            document.getElementById("time1").innerHTML = time1;
            break;
        case 2:
            if(!paused){
                if(time2 > 0) time2--;
                document.getElementById("time2").innerHTML = time2;
            }
            break;
    }
}
function reveal(){
    document.getElementById("titleCode").innerHTML = "Cheat code: \"eternal\"";
}
function checkCode(){
    var code = document.getElementById("code");
    var outMessage = document.getElementById("outMessage");
    switch(code.value.toLowerCase()){
        case "451":
            player.setKerosene(-1);
            player.setCheat("451", true);
            outMessage.style.color = "#488214";
            outMessage.innerHTML = "Infinite kerosene enabled! You won't need to collect canisters from now on.";
            break;
        case "bible":
            player.maxSpeed = 30;
            player.setCheat("bible", true);
            outMessage.style.color = "#488214";
            outMessage.innerHTML = "Superspeed enabled! Your maximum speed has been set to 30.";
            break;
        case "endgame":
            player.setCheat("endgame", true);
            outMessage.style.color = "#488214";
            outMessage.innerHTML = "Annihilation mode enabled! Press the caps lock key to annihilate all enemies!";
            break;
        case "eternal":
            player.setCheat("eternal", true);
            outMessage.style.color = "#488214";
            outMessage.innerHTML = "Infinite time enabled! Time is no longer a problem!";
            time2 = -1;
            break;
        case "library":
            player.setCheat("library", true);
            outMessage.style.color = "#488214";
            outMessage.innerHTML = "Books will now be worth triple their original value!";
            break;
        case "phoenix":
            player.setHealth(-1);
            player.setCheat("phoenix", true);
            outMessage.style.color = "#488214";
            outMessage.innerHTML = "Infinite life enabled! There's no point in collecting hearts anymore.";
            break;
        case "wave":
            player.setCheat("wave", true);
            outMessage.style.color = "#488214";
            outMessage.innerHTML = "Wave mode enabled! Press the tab key to spawn enemies!";
            break;
        default:
            outMessage.style.color = "#ff0000";
            outMessage.innerHTML = "Sorry, that code didn't look right. Try again.";
            break;
    }
    code.value = "";
}
function cycleColors(){
    var colors = ["ff4500", "ff5719", "ff6a32", "ff7c4c", "ff8f66"];
    var active = 0;
    setInterval(function(){
        document.getElementById("titleCode").style.color = "#"+colors[active];
        if(++active === colors.length) active = 0;
    }, 800);
}
function replay(){
    document.location.reload();
}
function annihilate(){
    if(player.hasCheat("endgame")){
        for(var i = 0; i < enemies.length; i++){
            var enemy = enemies[i];
            enemy.hide();
            enemies.splice(i, 1);
            player.setScore(player.getScore() + enemy.getPoints());
            player.getInfo()[enemy.getName()] += 1;
        }
    }
}
function init(){
    timing1 = setInterval(function(){
        countDown(1);
    }, 1000);
    scene = new Scene();
    scene.hide();
    scene.hideCursor();
    back = new Sprite(scene, "images/back.png", 1200, 1200);
    back.setSpeed(0);
    player = new Player();
    createItems(10);
    createEnemies(20);
    setTimeout(function(){
        clearInterval(timing1);
        timing2 = setInterval(function(){
            countDown(2);
        }, 1000);
        document.getElementById("gameStart").style.display = "none";
        scene.show();
        document.getElementById("info").style.display = "block";
        scene.start();
        timing3 = setInterval(function(){
            createItems(5);
        }, 10000);
        timing4 = setInterval(function(){
            createEnemies(20);
        }, 20000);
    }, 10000);
}
function update(){
    scene.clear();
    back.update();
    player.checkKeys();
    updateItems();
    updateEnemies();
    updateFireballs();
    player.update();
    if((player.getHealth() <= 0 && !player.hasCheat("phoenix")) || (time2 <= 0 && !player.hasCheat("eternal"))){
        clearInterval(timing2);
        clearInterval(timing3);
        clearInterval(timing4);
        scene.stop();
        setTimeout(function(){
            scene.hide();
            document.getElementById("info").style.display = "none";
            var gameOver = document.getElementById("gameOver");
            var info = player.getInfo();
            var damager = player.getLastDamageCause();
            var html = [
                "<h1>Game over!</h1>",
                player.getLastDamageCause() !== null ? "<img src='images/"+damager.getFName()+".png' style='display:block;height:256px;margin:0 auto;width:256px;'>" : "",
                player.getLastDamageCause() !== null ? "<h3>You were last damaged by a <strong>"+damager.getName()+"</strong>!</h3>" : "",
                "<h4><img src='images/fireball.png'> <strong>"+info["fireball"]+"</strong> fireballs fired</h4>",
                "<h4><img src='images/beetle.png'> <strong>"+info["beetle"]+"</strong> beetles killed</h4>",
                "<h4><img src='images/firemanalt.png'> <strong>"+info["fireman"]+"</strong> firemen killed</h4>",
                "<h4><img src='images/hound.png'> <strong>"+info["hound"]+"</strong> hounds killed</h4>",
                "<h4><img src='images/book1.png'> <strong>"+info["book"]+"</strong> books collected</h4>",
                "<h4><img src='images/canister.png'> <strong>"+info["canister"]+"</strong> canisters collected</h4>",
                "<h4><img src='images/heart.png'> <strong>"+info["heart"]+"</strong> hearts collected</h4>",
                "<h1>Final score: <strong>"+player.getScore()+"</strong></h1>",
                "<button type='button' onclick='replay();'><h2>Play again</h2></button>"
            ];
            var out = "";
            for(var i = 0; i < html.length; i++) out += html[i];
            gameOver.innerHTML = out;
            gameOver.style.display = "block";
        }, 2000);
    }
}
//Events
window.addEventListener("keydown", function(event){
    switch(event.keyCode){
        case K_LEFT: //37
        case K_UP: //38
        case K_RIGHT: //39
        case K_DOWN: //40
        case K_SPACE: //32
            event.preventDefault();
            break;
        case 9: //Tab key
            event.preventDefault();
            createEnemies(20);
            break;
        case 13: //Return key
            event.preventDefault();
            checkCode();
            break;
        case 20: //Cap lock key
            event.preventDefault();
            annihilate();
            break;
        default:
            break;
    }
}, false);