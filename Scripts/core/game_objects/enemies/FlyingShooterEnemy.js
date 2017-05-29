function FlyingShooterEnemy(game, args){
    //Basics
    BasicShooterEnemy.call(this, game, args);
    this.body.allowGravity = false;
    this.heroine = args.heroine;
    this.range = args.range;
}

FlyingShooterEnemy.prototype = Object.create(BasicShooterEnemy.prototype);
FlyingShooterEnemy.prototype.constructor = FlyingShooterEnemy;

//Phaser overrides

FlyingShooterEnemy.prototype.update = function(){
    Enemy.prototype.update.call(this);
};

//BasicShooterEnemy overrides
FlyingShooterEnemy.prototype.shoot = function(){
    if(this.game.physics.arcade.distanceBetween(this, this.heroine) <= this.range){
        this.weapon.fire(null, this.heroine.x, this.heroine.y);
    }
};