function BasicShooterEnemy(game, args){
    //Basics\
    args.sprite = args.sprite ? args.sprite : this.defaults.sprite;
    Enemy.call(this, game, args);
    this.horizontalRange = args.horizontal_range ? args.horizontal_range : this.defaults.horizontal_range;
    this.currentDir = 1;
    this.rightLimit = this.x + this.horizontalRange;
    this.leftLimit = this.x - this.horizontalRange;
    this.range = args.range ? args.range : this.defaults.range;
    this.dir.x = 1;

    //Shooting
    this.weapon = this.game.add.weapon();
    this.weapon.bulletSpeed = args.bullet_speed ? args.bullet_speed : this.defaults.bullet_speed;
    this.weapon.bulletKillType = Phaser.Weapon.KILL_WORLD_BOUNDS;
    this.weapon.createBullets(-1, "sprite:bullet:" + (args.bullet_sprite ? args.bullet_sprite : this.defaults.bullet_sprite));
    this.weapon.trackSprite(this);
    this.weapon.onFire.add(function(bullet, weapon){
        bullet.body.allowGravity = false;
        bullet.body.setCircle(4,4,4);
        bullet.damage = new Damage(bullet, {"baseValue": this.currentAttack});
    },this);
    this.weapon.fireRate = args.fire_rate ? args.fire_rate : this.defaults.fire_rate;
    args.enemyDamageGroup.add(this.weapon.bullets);
}

BasicShooterEnemy.prototype = Object.create(Enemy.prototype);
BasicShooterEnemy.prototype.constructor = BasicShooterEnemy;

//Constants
BasicShooterEnemy.prototype.defaults = {
    sprite : "enemy:basic_shooter",
    horizontal_range : 50,
    speed : 100,
    bullet_sprite : "enemy_energy_ball",
    bullet_speed : 200,
    fire_rate : 2000,
    hp : 15,
    base_attack : 1,
    range : 300
};

//Phaser Overrides

BasicShooterEnemy.prototype.update = function(){
    Enemy.prototype.update.call(this);
};

//Movement Functions

//Attack Functions

BasicShooterEnemy.prototype.shoot = function(){
    this.weapon.fire(null, this.heroine.x, this.heroine.y);
};

//Death Functions
BasicShooterEnemy.prototype.shooterDeath = function(){
    this.weapon.destroy();
    this.dead = true;
    this.kill();
};

//AI Handling
BasicShooterEnemy.prototype.basicAI = function(){
    if(this.x > this.rightLimit){
        this.x = this.rightLimit;
        this.dir.x = -1;
    }else if(this.x < this.leftLimit){
        this.x = this.leftLimit;
        this.dir.x = 1;
    }

    this.move();

    if(this.game.physics.arcade.distanceBetween(this, this.heroine) <= this.range){
        this.shoot();
    }
}

//Collision Handling

//Damage Handling

//Function Wiring

BasicShooterEnemy.prototype.executeAI = BasicShooterEnemy.prototype.basicAI;
BasicShooterEnemy.prototype.die = BasicShooterEnemy.prototype.shooterDeath;