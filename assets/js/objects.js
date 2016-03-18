function Player(){
    var health = 50;
    var kerosene = 100;
    var score = 0;
    var cheats = {
        451: false,
        bible: false,
        dandelion: false,
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
    beetle.setPoints = function(num){
        if(typeof num === "number") points = num;
    };
    beetle.getDamage = function(){
        return damage;
    };
    beetle.setDamage = function(num){
        if(typeof num === "number") damage = num;
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
    fireman.setPoints = function(num){
        if(typeof num === "number") points = num;
    };
    fireman.getDamage = function(){
        return damage;
    };
    fireman.setDamage = function(num){
        if(typeof num === "number") damage = num;
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
    hound.setPoints = function(num){
        if(typeof num === "number") points = num;
    };
    hound.getDamage = function(){
        return damage;
    };
    hound.setDamage = function(num){
        if(typeof num === "number") damage = num;
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
        if(sum > 100 && !player.hasCheat("dandelion")) player.setKerosene(100);
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
        if(sum > 50 && !player.hasCheat("dandelion")) player.setHealth(50);
        else player.setHealth(sum);
    };
    heart.reset();
    return heart;
}