function Actor(game, args){
    //Basics
    args.sprite = args.sprite ? args.sprite : this.defaults.sprite;
    Phaser.Sprite.call(this, game, args.x, args.y, "sprite:" + args.sprite);
    this.anchor.set(0.5,0.5);
    this.game.physics.enable(this);
    this.body.allowGravity = true;
    this.body.collideWorldBounds = true;
    this.state = this.game.state.states[this.game.state.current];

    //Stats
    this.hp = args.hp ? args.hp : this.defaults.hp;
    this.maxHP = this.hp;
    this.baseAttack = args.base_attack ? args.base_attack : this.defaults.base_attack;
    this.currentAttack = this.baseAttack;
    this.speed = args.speed ? args.speed : this.defaults.speed;
    this.jumpSpeed = args.jump_speed ? args.jump_speed : this.defaults.jump_speed;

    //Status
    this.dead = false;
    this.facingDir = {
        x : 1,
        y : -1
    }

    //Collision Groups
    this.platformGroup = args.platformGroup;
    this.damageGroup = args.damageGroup;
    this.enemyDamageGroup = args.enemyDamageGroup;

    //Controls
    this.dir = {"x": Actor.DIR_NONE, "y": Actor.DIR_NONE};
    this.attackDir = {"x": Actor.DIR_NONE, "y": Actor.DIR_NONE};

    //Animations
    this.animHooks = {
        idle : null,
        run : null
    };

    //Events
    this.onDeath = new Phaser.Signal();
    this.onDeath.add(this.die, this);
}

Actor.prototype = Object.create(Phaser.Sprite.prototype);
Actor.prototype.constructor = Actor;

//Constants
Actor.DIR_NONE = 0;
Actor.DIRX_RIGHT = 1;
Actor.DIRX_LEFT = -1;
Actor.DIRY_UP = -1;
Actor.DIRY_DOWN = 1;

Actor.prototype.defaults = {};

//Phaser Overrides
Actor.prototype.update = function(){
    this.handleCollisions();
    this.updateFacingDir();
};

Actor.prototype.tryPlayAnimation = function(key){
    if(this.animHooks[key]){
        this.animations.play(key);
    }
};

//Movement Functions
Actor.prototype.basicMove = function(){
    this.body.velocity.x = this.dir.x * this.speed;

    if(this.body.velocity.x < 0 && this.scale.x > 0){
        this.scale.x *= -1;
    }else if(this.body.velocity.x > 0 && this.scale.x < 0){
        this.scale.x *= -1;
    }
};

Actor.prototype.updateFacingDir = function(){
    this.facingDir.x = this.body.velocity.x >= 0 ? 1 : -1;
    this.facingDir.y = this.body.velocity.y >= 0 ? 1 : -1;
};

Actor.prototype.isGrounded = function(){
    return this.game.physics.arcade.gravity.y >= 0 ? (this.body.blocked.down || this.body.touching.down) : (this.body.blocked.up || this.body.touching.up);
};

//Attack Functions
Actor.prototype.basicAttack = function(){
    //console.log("Base Actor attacked");
};

//Death Functions
Actor.prototype.basicDeath = function(){
    this.dead = true;
    this.kill();
};

//Collision Handling
Actor.prototype.handleCollisions = function(){
    this.game.physics.arcade.collide(this, this.platformGroup);
    this.damageGroup.forEach(this.processDamageCollisions, this);
};

//Damage Handling
Actor.prototype.processDamageCollisions = function(damage){
    if(damage instanceof Phaser.Group){
        damage.forEach(this.processDamageCollisions, this);
    }else{
        this.game.physics.arcade.overlap(this, damage, this.processSingleDamage, null, this);
    }
}

Actor.prototype.processSingleDamage = function(actor, obj){
    let damage = obj.damage;
    damage.onTargetCollision(this);
}

Actor.prototype.onDamageHit = function(damage){
    this.dealDamage(damage.baseValue);
}

Actor.prototype.dealDamage = function(amount){
    this.hp -= amount;
    if(this.hp <= 0){
        this.hp = 0;
        this.onDeath.dispatch();
    }
}

//Function Wiring
Actor.prototype.move = Actor.prototype.basicMove;
Actor.prototype.attack = Actor.prototype.basicAttack;
Actor.prototype.die = Actor.prototype.basicDeath;