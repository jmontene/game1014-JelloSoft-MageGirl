const HEROINE_DEFAULT_SPEED = 200;
const HEROINE_DEFAULT_JUMP_SPEED = 600;

function Heroine(game, x, y){
    Phaser.Sprite.call(this, game, x, y, 'sprite:heroine');
    this.anchor.set(0.5,0.5);
    this.game.physics.enable(this);
    this.body.collideWorldBounds = true;

    this.speed = HEROINE_DEFAULT_SPEED;
    this.jumpSpeed = HEROINE_DEFAULT_JUMP_SPEED;
}

Heroine.prototype = Object.create(Phaser.Sprite.prototype);
Heroine.prototype.constructor = Heroine;

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