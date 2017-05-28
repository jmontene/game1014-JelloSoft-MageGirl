function FlyingShooterEnemy(game, args){
    //Basics
    BasicShooterEnemy.call(this, game, args);
    this.body.allowGravity = false;
    this.heroine = args.heroine;
}

FlyingShooterEnemy.prototype = Object.create(BasicShooterEnemy.prototype);
FlyingShooterEnemy.prototype.constructor = FlyingShooterEnemy;

//Phaser overrides

FlyingShooterEnemy.prototype.update = function(){
    Enemy.prototype.update.call(this);
};

//BasicShooterEnemy overrides
FlyingShooterEnemy.prototype.shoot = function(){
    console.log("Fired");
    this.weapon.fire(null, this.heroine.x, this.heroine.y);
};