function FlyingShooterEnemy(game, args){
    //Basics
    BasicShooterEnemy.call(this, game, args);
    this.body.allowGravity = false;
}

FlyingShooterEnemy.prototype = Object.create(BasicShooterEnemy.prototype);
FlyingShooterEnemy.prototype.constructor = FlyingShooterEnemy;

//Phaser overrides

FlyingShooterEnemy.prototype.update = function(){
    Enemy.prototype.update.call(this);
};