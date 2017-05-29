const BASIC_SHOOTER_ENEMY_HORIZONTAL_RANGE = 100;
const BASIC_SHOOTER_ENEMY_BULLET_SPEED = 200;
const BASIC_SHOOTER_ENEMY_FIRE_RATE = 2000;

function BasicShooterEnemy(game, args){
    //Basics
    Enemy.call(this, game, args);
    this.horizontalRange = args.horizontalRange;
    this.currentDir = 1;
    this.rightLimit = this.x + this.horizontalRange;
    this.leftLimit = this.x - this.horizontalRange;
    this.range = args.range;

    //Shooting
    this.weapon = this.game.add.weapon();
    this.weapon.bulletSpeed = BASIC_SHOOTER_ENEMY_BULLET_SPEED;
    this.weapon.bulletKillType = Phaser.Weapon.KILL_WORLD_BOUNDS;
    this.weapon.createBullets(-1, "sprite:bullet:" + args.bullet);
    this.weapon.trackSprite(this);
    this.weapon.onFire.add(function(bullet, weapon){
        bullet.body.allowGravity = false;
        bullet.body.setCircle(4,4,4);
    },this);
    this.fireRate = BASIC_SHOOTER_ENEMY_FIRE_RATE;
    args.damageGroup.add(this.weapon.bullets);

    //Events
    this.fireTimer = this.game.time.create(false);
    this.fireTimer.loop(this.fireRate, this.shoot, this);
    this.fireTimer.start();
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

//Enemy Overrides
BasicShooterEnemy.prototype.die = function(){
    this.fireTimer.destroy();
    this.weapon.destroy();
    this.kill();
};

//Actions

BasicShooterEnemy.prototype.shoot = function(){
    if(this.game.physics.arcade.distanceBetween(this, this.heroine) <= this.range){
        this.weapon.fire(null, this.heroine.x, this.heroine.y);
    }
};

