function FlyingShooterEnemy(game, args){
    //Basics
    BasicShooterEnemy.call(this, game, args);
    this.body.allowGravity = false;
}

FlyingShooterEnemy.prototype = Object.create(BasicShooterEnemy.prototype);
FlyingShooterEnemy.prototype.constructor = FlyingShooterEnemy;

//Constants
FlyingShooterEnemy.prototype.defaults = Object.create(BasicShooterEnemy.prototype.defaults);
FlyingShooterEnemy.prototype.defaults.sprite = "enemy:flying_shooter";

//Phaser overrides

FlyingShooterEnemy.prototype.update = function(){
    Enemy.prototype.update.call(this);
};

//Movement Functions

//Attack Functions

//Death Functions

//Ai Handling

FlyingShooterEnemy.prototype.basicAI = function(){
    if(this.game.physics.arcade.distanceBetween(this, this.heroine) <= this.range){
        this.shoot();
    }
};

//Collision Handling

//Damage Handling

//Function Wiring

FlyingShooterEnemy.prototype.executeAI = FlyingShooterEnemy.prototype.basicAI;