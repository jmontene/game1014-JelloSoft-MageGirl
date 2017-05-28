const HEROINE_DEFAULT_SPEED = 200;
const HEROINE_DEFAULT_JUMP_SPEED = 600;
const HEROINE_BULLET_SPEED = 700;
const HEROINE_STARTING_HP = 10;

function Heroine(game, args){
    //Basics
    Phaser.Sprite.call(this, game, args.x, args.y, 'sprite:heroine');
    this.anchor.set(0.5,0.5);
    this.game.physics.enable(this);
    this.body.collideWorldBounds = true;

    //Stats
    this.maxHP = HEROINE_STARTING_HP;
    this.hp = HEROINE_STARTING_HP;
    this.invincible = false;
    this.invincibilityTime = 3000;

    //Speeds
    this.speed = HEROINE_DEFAULT_SPEED;
    this.jumpSpeed = HEROINE_DEFAULT_JUMP_SPEED;

    //Shooting
    this.weapon = new Phaser.Weapon(game);
    this.weapon.bulletSpeed = HEROINE_BULLET_SPEED;
    this.weapon.createBullets(20, 'sprite:bullet:energy_ball');
    this.weapon.trackSprite(this);
    this.dirShootingX = 0;
    this.dirShootingY = 0;
    this.weapon.onFire.add(function(bullet, weapon){
        bullet.body.allowGravity = false;
        bullet.body.setCircle(4,4,4);
    },this);

    //Events
    this.invincibilityTimer = this.game.time.create(false);

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

//Heroine Controls

Heroine.prototype.move = function(direction){
    this.body.velocity.x = direction * this.speed;

    if(this.body.velocity.x < 0){
        this.scale.x = -1;
    }else if(this.body.velocity.x > 0){
        this.scale.x = 1;
    }
};

Heroine.prototype.jump = function(){
    let canJump = this.body.touching.down;

    if(canJump){
        this.body.velocity.y = -this.jumpSpeed;
    }

    return canJump;
};

Heroine.prototype.shoot = function(){
    this.weapon.fire(null, this.x + this.dirShootingX*1000, this.y + this.dirShootingY*1000);
};

//Collision Handling

Heroine.prototype.handleCollisions = function(){
    this.game.physics.arcade.collide(this, this.platformGroup);
    this.game.physics.arcade.overlap(this.weapon.bullets, this.platformGroup, this.onBulletvsPlatform, null, this);
    this.game.physics.arcade.overlap(this, this.damageGroup, this.onHeroinevsDamage, null, this);
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
}

Heroine.prototype.die = function(){
    this.kill();
}