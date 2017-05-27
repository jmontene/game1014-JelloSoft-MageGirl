const HEROINE_DEFAULT_SPEED = 200;
const HEROINE_DEFAULT_JUMP_SPEED = 600;

function Heroine(game, x, y){
    //Basics
    Phaser.Sprite.call(this, game, x, y, 'sprite:heroine');
    this.anchor.set(0.5,0.5);
    this.game.physics.enable(this);
    this.body.collideWorldBounds = true;

    //Speeds
    this.speed = HEROINE_DEFAULT_SPEED;
    this.jumpSpeed = HEROINE_DEFAULT_JUMP_SPEED;

    //Shooting
    this.weapon = new Phaser.Weapon(game);
    this.weapon.bulletSpeed = 900;
    this.weapon.createBullets(20, 'sprite:bullet:energy_ball');
    this.weapon.trackSprite(this);
    this.dirShootingX = 0;
    this.dirShootingY = 0;

    this.weapon.onFire.add(function(bullet, weapon){
        bullet.body.allowGravity = false;
    },this);
}

Heroine.prototype = Object.create(Phaser.Sprite.prototype);
Heroine.prototype.constructor = Heroine;


//Phaser Overrides

Heroine.prototype.update = function(){
    //Check for shooting
    if(this.dirShootingX != 0 || this.dirShootingY != 0){
        this.shoot();
    }
}

//Custom Functions

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
}

Heroine.prototype.shoot = function(){
    this.weapon.fire(null, this.x + this.dirShootingX*1000, this.y + this.dirShootingY*1000);
}