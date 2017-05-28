const BASIC_SHOOTER_ENEMY_HORIZONTAL_RANGE = 100;

function BasicShooterEnemy(game, args){
    //Basics
    Enemy.call(this, game, args);
    this.horizontalRange = args.horizontalRange;
    this.currentDir = 1;
    this.rightLimit = this.x + this.horizontalRange;
    this.leftLimit = this.x - this.horizontalRange;
}

BasicShooterEnemy.prototype = Object.create(Enemy.prototype);
BasicShooterEnemy.prototype.constructor = BasicShooterEnemy;

//Phaser Overrides

BasicShooterEnemy.prototype.update = function(){
    Enemy.prototype.update.call(this);

    this.move(this.currentDir);

    if(this.x > this.rightLimit){
        this.x = this.rightLimit;
        this.currentDir = -1;
    }else if(this.x < this.leftLimit){
        this.x = this.leftLimit;
        this.currentDir = 1;
    }
};