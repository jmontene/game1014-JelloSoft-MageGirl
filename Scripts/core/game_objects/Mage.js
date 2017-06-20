function Mage(game, args){
    //Basics
    Heroine.call(this, game, args);

    //Shooting
    this.weapon = this.game.add.weapon();
    this.weapon.bulletSpeed = args.bullet_speed;
    this.weapon.createBullets(-1, 'sprite:bullet:' + args.bullet_sprite);
    this.weapon.trackSprite(this);
    this.weapon.fireRate = args.fire_rate;
    this.dirShootingX = 0;
    this.dirShootingY = 0;
    this.weapon.onFire.add(function(bullet, weapon){
        bullet.body.allowGravity = false;
        bullet.body.setCircle(4,4,4);
        bullet.damage = new Damage(bullet, {"baseValue": this.attack});
    },this);

    //Events
    this.levitateTimer = this.game.time.create(false);

    //Collision Groups
    this.enemyDamageGroup.add(this.weapon.bullets);
}

Mage.prototype = Object.create(Heroine.prototype);
Mage.prototype.constructor = Mage;


//Phaser Overrides

Mage.prototype.update = function(){
    Heroine.prototype.update.call(this);
    this.handleWeaponCollisions();

    //Check for shooting
    if(this.dirShootingX != 0 || this.dirShootingY != 0){
        this.shoot();
    }
}

//Unique Movement functions
Mage.prototype.levitationMove = function(dirX, dirY){
    if(dirX != 0 && dirY != 0){
        this.body.velocity.x = dirX * this.speed;
        this.body.velocity.y = dirY * this.speed;
    }else{
        this.body.velocity.x = dirX * this.speed;
        this.body.velocity.y = dirY * this.speed;
    }

    if(this.body.velocity.x < 0){
        this.scale.x = -1;
    }else if(this.body.velocity.x > 0){
        this.scale.x = 1;
    } 
};

//Unique Jump Functions

Mage.prototype.levitationJump = function(){
    //Do nothing
};

//Unique Attack Functions

Mage.prototype.shoot = function(){
    this.weapon.fire(null, this.x + this.dirShootingX*1000, this.y + this.dirShootingY*1000);
};

//Mage Controls

Mage.prototype.move = Heroine.prototype.basicMove;
Mage.prototype.jump = Heroine.prototype.basicJump;
Mage.prototype.attack = Mage.prototype.shoot;

//Input Handling
Mage.prototype.handleInput = function(){
    Heroine.prototype.handleInput.call(this);

    if(this.keys.attackLeft.isDown){
        this.dirShootingX = -1;
    }else if(this.keys.attackRight.isDown){
        this.dirShootingX = 1;
    }else{
        this.dirShootingX = 0;
    }

    if(this.keys.attackUp.isDown){
        this.dirShootingY = -1;
    }else if(this.keys.attackDown.isDown){
        this.dirShootingY = 1;
    }else{
        this.dirShootingY = 0;
    }
}

//Collision Handling

Mage.prototype.handleWeaponCollisions = function(){
    this.game.physics.arcade.overlap(this.weapon.bullets, this.platformGroup, this.onBulletvsPlatform, null, this);
};

Mage.prototype.onBulletvsPlatform = function(bullet, platform){
    bullet.kill();
}

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
    Heroine.prototype.die.call(this);
    this.weapon.destroy();
};

//Powerup hooks

Mage.prototype.onArcane = Mage.prototype.startLevitation;