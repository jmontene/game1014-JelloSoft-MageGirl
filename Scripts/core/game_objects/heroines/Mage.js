function Mage(game, args){
    //Basics
    args.sprite = args.sprite ? args.sprite : this.defaults.sprite;
    Heroine.call(this, game, args);

    //Shooting
    this.weapon = this.game.add.weapon();
    this.weapon.bulletSpeed = args.bullet_speed ? args.bullet_speed : this.defaults.bullet_speed;
    this.weapon.createBullets(-1, 'sprite:bullet:' + (args.bullet_sprite ? args.bullet_sprite : this.defaults.bullet_sprite));
    this.weapon.trackSprite(this);
    this.weapon.fireRate = args.fire_rate ? args.fire_rate : this.defaults.fire_rate;
    this.weapon.onFire.add(function(bullet, weapon){
        bullet.body.allowGravity = false;
        bullet.body.setCircle(4,4,4);
        bullet.damage = new Damage(bullet, {"baseValue": this.currentAttack});
    },this);

    //Events
    this.levitateTimer = this.game.time.create(false);

    //Collision Groups
    this.enemyDamageGroup.add(this.weapon.bullets);
}

Mage.prototype = Object.create(Heroine.prototype);
Mage.prototype.constructor = Mage;

//Constants
Mage.prototype.defaults = {
    sprite : "heroine:mage",
    hp : 15,
    speed : 200,
    base_attack : 1,
    jump_speed : 600,
    fire_rate : 200,
    bullet_speed : 300,
    bullet_sprite : "energy_ball",
    invincibility_time : 2000,
    animation_state_machine : "statemachine:animations:heroine",
    ui_tint : 0xff0000,
    ui_back : "ui:lifebar:back"
};

//Phaser Overrides

Mage.prototype.update = function(){
    Heroine.prototype.update.call(this);
    this.handleWeaponCollisions();
}

//Movement functions

Mage.prototype.levitationMove = function(){
    this.body.velocity.x = this.dir.x * this.speed;
    this.body.velocity.y = this.dir.y * this.speed;

    if(this.body.velocity.x < 0){
        this.scale.x = -1;
    }else if(this.body.velocity.x > 0){
        this.scale.x = 1;
    } 
};

//Jump Functions

Mage.prototype.levitationJump = function(){
    //Do nothing
};

//Unique Attack Functions

Mage.prototype.shoot = function(){
    if(this.attackDir.x != 0 || this.attackDir.y != 0){
        this.weapon.fire(null, this.x + this.attackDir.x*1000, this.y + this.attackDir.y*1000);
    }
};

//Death Functions

//Input Handling

//Collision Handling

Mage.prototype.handleWeaponCollisions = function(){
    this.game.physics.arcade.collide(this.weapon.bullets, this.platformGroup, this.onBulletvsPlatform, null, this);
};

Mage.prototype.onBulletvsPlatform = function(bullet, platform){
    console.log("Bullet collided");
    bullet.kill();
}

//Damage Handling

//Status Changes

Mage.prototype.startLevitation = function(args){
    let duration = args.duration;
    this.body.allowGravity = false;
    this.move = this.levitationMove;
    this.jump = this.levitationJump;

    this.levitateTimer.add(duration, function(){
        this.move = this.basicMove;
        this.jump = this.basicJump;
        this.body.allowGravity = true;
        this.levitateTimer.stop();
    },this);

    this.levitateTimer.start();
};

Mage.prototype.die = function(){
    this.weapon.destroy();
    Heroine.prototype.die.call(this);
};

//Function Wiring

Mage.prototype.move = Actor.prototype.basicMove;
Mage.prototype.jump = Heroine.prototype.basicJump;
Mage.prototype.attack = Mage.prototype.shoot;

//Powerup hooks

Mage.prototype.onArcane = Mage.prototype.startLevitation;