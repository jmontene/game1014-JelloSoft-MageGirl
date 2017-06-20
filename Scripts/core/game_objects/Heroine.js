function Heroine(game, args){
    //Basics
    Phaser.Sprite.call(this, game, args.x, args.y, 'sprite:heroine:' + args.sprite);
    this.anchor.set(0.5,0.5);
    this.game.physics.enable(this);
    this.body.collideWorldBounds = false;
    this.outOfCameraBoundsKill = true;

    //Stats
    this.maxHP = args.hp;
    this.hp = args.hp;
    this.invincible = false;
    this.invincibilityTime = 2000;
    this.dead = false;
    this.baseAttack = args.attack;
    this.attack = args.attack;

    //Speeds
    this.speed = args.speed;
    this.jumpSpeed = args.jump_speed;

    //Events
    this.invincibilityTimer = this.game.time.create(false);

    //Event Listeners
    this.events.onKilled.add(this.die, this);

    //Keys
    this.keys = args.keys;

    //Collision Groups
    this.platformGroup = args.platformGroup;
    this.damageGroup = args.damageGroup;
    this.enemyDamageGroup = args.enemyDamageGroup;
}

Heroine.prototype = Object.create(Phaser.Sprite.prototype);
Heroine.prototype.constructor = Heroine;

//Phaser Overrides

Heroine.prototype.update = function(){
    this.handleCollisions();
    if(!this.dead){
        this.handleInput();
    }
}

//Movement functions
Heroine.prototype.basicMove = function(dirX, dirY){
    this.body.velocity.x = dirX * this.speed;

    if(this.body.velocity.x < 0){
        this.scale.x = -1;
    }else if(this.body.velocity.x > 0){
        this.scale.x = 1;
    }
};

//Jump Functions

Heroine.prototype.basicJump = function(){
    let canJump = this.body.touching.down;

    if(canJump){
        this.body.velocity.y = -this.jumpSpeed;
    }

    return canJump;
};

//Attack Functions
Heroine.prototype.basicAttack = function(){
    console.log("Attacking");
};

//Heroine Controls

Heroine.prototype.move = Heroine.prototype.basicMove;
Heroine.prototype.jump = Heroine.prototype.basicJump;
Heroine.prototype.attack = Heroine.prototype.basicAttack;

//Input handling
Heroine.prototype.handleInput = function(){
    let dirX = 0;
    let dirY = 0;

    if(this.keys.left.isDown){
        dirX = -1;
    }else if(this.keys.right.isDown){
        dirX = 1;
    }

    if(this.keys.up.isDown){
        dirY = -1;
    }else if(this.keys.down.isDown){
        dirY = 1;
    }

    this.move(dirX, dirY);

    if(this.keys.up.justDown){
        let didJump = this.jump();
    }
};

//Collision Handling

Heroine.prototype.handleCollisions = function(){
    this.game.physics.arcade.collide(this, this.platformGroup);
    this.damageGroup.forEach(this.handleDamageSubGroups, this);
};

Heroine.prototype.handleDamageSubGroups = function(group){
    this.game.physics.arcade.overlap(this, group, this.onHeroinevsDamage, null, this);
};

Heroine.prototype.onHeroinevsDamage = function(heroine, damage){
    if(!this.invincibility){
        heroine.hp -= 1;
        if(heroine.hp == 0){
            heroine.kill();
        }
        heroine.startInvincibility();
    }
};

//Status Changes

Heroine.prototype.startInvincibility = function(){
    this.invincibility = true;
    this.tint = 0xff00ff;
    this.invincibilityTimer.add(this.invincibilityTime, function(){
        this.invincibility = false;
        this.tint = 0xffffff;
        this.invincibilityTimer.stop();
    },this);
    this.invincibilityTimer.start();
};

Heroine.prototype.die = function(){
    this.game.camera.fade();
    this.dead = true;
};

//Powerup Hooks

Heroine.prototype.onArcane = function(args){
    console.log("Arcane powerup picked on this base heroine instance");
};