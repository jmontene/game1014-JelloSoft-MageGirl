SWORD_SLASHING_RIGHT = 1;
SWORD_SLASHING_LEFT = -1;
SWORD_SLASHING_UP = 2;
SWORD_SLASHING_DOWN = -2;
SWORD_SLASHING_NONE = 0;

SLASH_SCALE = 4;

function Swordfighter(game, args){
    //Basics
    Heroine.call(this, game, args);

    //Slashing
    this.slashes = this.game.add.group();
    this.slashRate = args.slash_rate;
    this.slashing = false;
    this.canSlash = true;

    this.slashSprite = this.game.add.sprite(0,0,'sprite:melee:'+args.slash_sprite, 0);
    this.game.physics.enable(this.slashSprite);
    this.slashSprite.body.allowGravity = false;

    this.slashSprite.animations.add('slash', [0,1,2,3], 15, false);
    this.slashSprite.scale.set(SLASH_SCALE,1);
    this.slashSprite.exists = false;
    this.addChild(this.slashes);
    this.addChild(this.slashSprite);

    this.slashOffset = {};
    this.slashOffset.y = 20;
    this.slashOffset.x = 18;

    this.slashingDir = SWORD_SLASHING_NONE;

    //Events
    this.slashTimer = this.game.time.create(false);

    let slashAnim = this.slashSprite.animations.getAnimation("slash");
    slashAnim.onComplete.add(function(){
        this.slashSprite.exists = false;
        this.slashSprite.x = 0;
        this.slashSprite.y = 0;
        this.slashSprite.rotation = 0;
        this.slashSprite.scale.x = 1;
        this.slashing = false;

        this.slashTimer.add(this.slashRate, function(){
            this.canSlash = true;
            this.slashTimer.stop();
        }, this)
        this.slashTimer.start();
    }, this);

    //Collision Groups
    this.slashSprite.damage = new Damage(this.slashSprite, {"baseValue": this.attack});
    this.slashSprite.damage.onTargetCollision = function(){
        //Do nothing
    }
    this.slashes.add(this.slashSprite);
}

Swordfighter.prototype = Object.create(Heroine.prototype);
Swordfighter.prototype.constructor = Swordfighter;

//Phaser overrides

Swordfighter.prototype.update = function(){
    Heroine.prototype.update.call(this);
    this.handleSlashCollisions();

    if(this.canSlash && this.slashingDir != SWORD_SLASHING_NONE){
        this.slash();
    }
}

//Unique Movement Functions
Swordfighter.prototype.swordBasicMove = function(dirX, dirY){
    this.body.velocity.x = dirX * this.speed;

    if(!this.slashing){
        if(this.body.velocity.x < 0){
            this.scale.x = -1;
        }else if(this.body.velocity.x > 0){
            this.scale.x = 1;
        }
    }
};

//Unique Jump Functions

//Unique Attack Functions
Swordfighter.prototype.slash = function(){
    this.slashSprite.exists = true;
    this.slashing = true;
    this.canSlash = false;
    switch(this.slashingDir){
        case SWORD_SLASHING_RIGHT:
            this.slashSprite.x = this.slashOffset.x;
            this.slashSprite.y = -this.slashOffset.y;
            this.slashSprite.scale.x = SLASH_SCALE;
            this.slashSprite.animations.play("slash");
            break;
        case SWORD_SLASHING_LEFT:
            this.slashSprite.x = -this.slashOffset.x;
            this.slashSprite.y = -this.slashOffset.y;
            this.slashSprite.scale.x = -SLASH_SCALE;
            this.slashSprite.animations.play("slash");
            break;
        case SWORD_SLASHING_UP:
            this.slashSprite.y = -this.slashOffset.y;
            this.slashSprite.x = -this.slashOffset.x;
            this.slashSprite.scale.x = SLASH_SCALE;
            this.slashSprite.rotation = -this.game.math.degToRad(90);
            this.slashSprite.animations.play("slash");
            break;
        case SWORD_SLASHING_DOWN:
            this.slashSprite.y = this.slashOffset.y;
            this.slashSprite.x = this.slashOffset.x;
            this.slashSprite.scale.x = SLASH_SCALE;
            this.slashSprite.rotation = this.game.math.degToRad(90);
            this.slashSprite.animations.play("slash");
            break;
    }
};

//Swordfighter controls
Swordfighter.prototype.move = Swordfighter.prototype.swordBasicMove;
Swordfighter.prototype.jump = Heroine.prototype.basicJump;
Swordfighter.prototype.attack = Swordfighter.prototype.slash;

//Input Handling
Swordfighter.prototype.handleInput = function(){
    Heroine.prototype.handleInput.call(this);

    if(this.keys.attackRight.isDown){
        this.slashingDir = this.scale.x == 1 ? SWORD_SLASHING_RIGHT : SWORD_SLASHING_LEFT;
    }else if(this.keys.attackLeft.isDown){
        this.slashingDir = this.scale.x == -1 ? SWORD_SLASHING_RIGHT : SWORD_SLASHING_LEFT;
    }else if(this.keys.attackUp.isDown){
        this.slashingDir = SWORD_SLASHING_UP;
    }else if(this.keys.attackDown.isDown){
        this.slashingDir = SWORD_SLASHING_DOWN;
    }else{
        this.slashingDir = SWORD_SLASHING_NONE;
    }
}

//Collision Handling
Swordfighter.prototype.handleSlashCollisions = function(){
    this.game.physics.arcade.overlap(this.slashes, this.enemies, this.handleSlash, null, this);
}

Swordfighter.prototype.handleSlash = function(slash, enemy){
    enemy.onDamage(enemy, slash);
};