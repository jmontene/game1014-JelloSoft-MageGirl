const HEROINE_DEFAULT_SPEED = 200;
const HEROINE_DEFAULT_JUMP_SPEED = 600;
const HEROINE_BULLET_SPEED = 300;
const HEROINE_STARTING_HP = 10;

function Heroine(game, args){
    //Basics
    Phaser.Sprite.call(this, game, args.x, args.y, 'sprite:heroine');
    this.anchor.set(0.5,0.5);
    this.game.physics.enable(this);
    this.body.collideWorldBounds = true;
    this.coins = 0;

    //Stats
    this.maxHP = HEROINE_STARTING_HP;
    this.hp = HEROINE_STARTING_HP;
    this.invincible = false;
    this.invincibilityTime = 2000;
    this.dead = false;

    //Speeds
    this.speed = HEROINE_DEFAULT_SPEED;
    this.jumpSpeed = HEROINE_DEFAULT_JUMP_SPEED;

    //Shooting
    this.weapon = this.game.add.weapon();
    this.weapon.bulletSpeed = HEROINE_BULLET_SPEED;
    this.weapon.createBullets(-1, 'sprite:bullet:energy_ball');
    this.weapon.trackSprite(this);
    this.weapon.fireRate = args.fireRate;
    this.dirShootingX = 0;
    this.dirShootingY = 0;
    this.weapon.onFire.add(function(bullet, weapon){
        bullet.body.allowGravity = false;
        bullet.body.setCircle(4,4,4);
    },this);

    //Events
    this.invincibilityTimer = this.game.time.create(false);
    this.levitateTimer = this.game.time.create(false);

    //Collision Groups
    this.platformGroup = args.platformGroup;
    this.damageGroup = args.damageGroup;
}

Heroine.prototype = Object.create(Phaser.Sprite.prototype);
Heroine.prototype.constructor = Heroine;


//Phaser Overrides

Heroine.prototype.update = function(){
    this.handleCollisions();

    //Check for shooting
    if(this.dirShootingX != 0 || this.dirShootingY != 0){
        this.shoot();
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

Heroine.prototype.levitationMove = function(dirX, dirY){
    if(dirX != 0 && dirY != 0){
        this.body.velocity.x = dirX * this.speed;
        this.body.velocity.y = dirY * this.speed;
    }else{
        this.body.velocity.x = dirX * this.speed;
        this.body.velocity.y = dirY * this.speed;
    }

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

Heroine.prototype.levitationJump = function(){
    //Do nothing
};

//Heroine Controls

Heroine.prototype.move = Heroine.prototype.basicMove;
Heroine.prototype.jump = Heroine.prototype.basicJump;

Heroine.prototype.shoot = function(){
    this.weapon.fire(null, this.x + this.dirShootingX*1000, this.y + this.dirShootingY*1000);
};

//Collision Handling

Heroine.prototype.handleCollisions = function(){
    this.game.physics.arcade.collide(this, this.platformGroup);
    this.game.physics.arcade.overlap(this.weapon.bullets, this.platformGroup, this.onBulletvsPlatform, null, this);

    this.damageGroup.forEach(this.handleDamageSubGroups, this);
    
};

Heroine.prototype.handleDamageSubGroups = function(group){
    this.game.physics.arcade.overlap(this, group, this.onHeroinevsDamage, null, this);
};

Heroine.prototype.onBulletvsPlatform = function(bullet, platform){
    bullet.kill();
}

Heroine.prototype.onHeroinevsDamage = function(heroine, damage){
    if(!this.invincibility){
        heroine.hp -= 1;
        if(heroine.hp == 0){
            heroine.die();
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

Heroine.prototype.startLevitation = function(duration){
    this.body.allowGravity = false;
    this.move = this.levitationMove;
    this.jump = this.levitationJump;

    this.levitateTimer.add(duration, function(){
        this.move = this.basicMove;
        this.jump = this.basicJump;
        this.body.allowGravity = true;
        this.levitateTimer.stop();
    },this);

    this.levitateTimer.start();
};

Heroine.prototype.die = function(){
    this.dead = true;
    this.weapon.destroy();
    this.kill();
};