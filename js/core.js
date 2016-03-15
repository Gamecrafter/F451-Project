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
function updateFromMenu(){
    time2 = parseInt(document.getElementById("testGame1").value);
    createEnemies(parseInt(document.getElementById("testGame2").value));
    createItems(parseInt(document.getElementById("testGame3").value));
    player.setHealth(parseInt(document.getElementById("testPlayer1").value));
    player.setKerosene(parseInt(document.getElementById("testPlayer2").value));
    player.setScore(parseInt(document.getElementById("testPlayer3").value));
    player.maxSpeed = parseInt(document.getElementById("testPlayer4").value);
    player.minSpeed = parseInt(document.getElementById("testPlayer5").value);
    //TODO: Add the rest
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
        case "dandelion":
            player.setCheat("dandelion", true);
            document.getElementById("testMenu").style.display = "block";
            outMessage.style.color = "#488214";
            outMessage.innerHTML = "Testing mode enabled! The test menu is now accessible.";
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
                "<button type='button' onclick='document.location.reload();'><h2>Play again</h2></button>"
            ];
            var out = "";
            for(var i = 0; i < html.length; i++) out += html[i];
            gameOver.innerHTML = out;
            gameOver.style.display = "block";
        }, 2000);
    }
}
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