function Heroine(game, args){
    //Basics
    Actor.call(this, game, args);
    this.outOfCameraBoundsKill = true;
    this.body.collideWorldBounds = false;

    //Stats

    //Status
    this.invincible = false;
    this.invincibilityTime = args.invincibility_time ? args.invincibility_time : this.defaults.invincibility_time;

    //Events
    this.invincibilityTimer = this.game.time.create(false);

    //Keys
    this.keys = args.keys;

    //Collision Groups
    this.platformGroup = args.platformGroup;
    this.damageGroup = args.damageGroup;
    this.enemyDamageGroup = args.enemyDamageGroup;
}

Heroine.prototype = Object.create(Actor.prototype);
Heroine.prototype.constructor = Heroine;

//Constants
Heroine.prototype.defaults = {
    invincibility_time : 2000
};

//Phaser Overrides

Heroine.prototype.update = function(){
    Actor.prototype.update.call(this);
    if(!this.dead){
        this.handleInput();
    }
}

//Movement Functions

//Jump Functions

Heroine.prototype.basicJump = function(){
    let canJump = this.body.touching.down;

    if(canJump){
        this.body.velocity.y = -this.jumpSpeed;
    }

    return canJump;
};

//Attack Functions

//Death Functions

//Input handling

Heroine.prototype.handleInput = function(){
    //Movement
    if(this.keys.left.isDown){
        this.dir.x = Actor.DIRX_LEFT;
    }else if(this.keys.right.isDown){
        this.dir.x = Actor.DIRX_RIGHT;
    }else{
        this.dir.x = Actor.DIR_NONE;
    }

    if(this.keys.up.isDown){
        this.dir.y = Actor.DIRY_UP;
    }else if(this.keys.down.isDown){
        this.dir.y = Actor.DIRY_DOWN;
    }else{
        this.dir.y = Actor.DIR_NONE;
    }

    this.move();

    //Jumping
    if(this.keys.up.justDown){
        let didJump = this.jump();
    }

    //Attacking
    if(this.keys.attackLeft.isDown){
        this.attackDir.x = Actor.DIRX_LEFT;
    }else if(this.keys.attackRight.isDown){
        this.attackDir.x = Actor.DIRX_RIGHT;
    }else{
        this.attackDir.x = Actor.DIR_NONE;
    }

    if(this.keys.attackUp.isDown){
        this.attackDir.y = Actor.DIRY_UP;
    }else if(this.keys.attackDown.isDown){
        this.attackDir.y = Actor.DIRY_DOWN;
    }else{
        this.attackDir.y = Actor.DIR_NONE;
    }

    this.attack();
};

//Collision Handling

//Damage Handling

Heroine.prototype.dealDamage = function(amount){
    if(this.invincible){
        return;
    }
    this.hp -= amount;
    if(this.hp <= 0){
        this.hp = 0;
        this.die();
    }else if(amount > 0){
        this.startInvincibility();
    }
}

//Status Changes

Heroine.prototype.startInvincibility = function(){
    this.invincible = true;
    this.tint = 0xff00ff;
    this.invincibilityTimer.add(this.invincibilityTime, function(){
        this.invincible = false;
        this.tint = 0xffffff;
        this.invincibilityTimer.stop();
    },this);
    this.invincibilityTimer.start();
};

//Function Wiring

Heroine.prototype.move = Actor.prototype.basicMove;
Heroine.prototype.jump = Heroine.prototype.basicJump;
Heroine.prototype.attack = Actor.prototype.basicAttack;
Heroine.prototype.die = Actor.prototype.basicDeath;

//Powerup Hooks

Heroine.prototype.onArcane = function(args){
    console.log("Arcane powerup picked on this base heroine instance");
};