function Melee(game, args){
    //Basics
    args.sprite = args.sprite ? args.sprite : this.defaults.sprite;
    Phaser.Sprite.call(this, game, args.x, args.y, args.sprite);
    this.anchor.set(0.5,0.5);
    this.game.physics.enable(this);
    this.body.collideWorldBounds = false;
    this.body.allowGravity = false;
    this.origScale = {x : 5, y : 2};
    this.scale.x = this.origScale.x;
    this.scale.y = this.origScale.y;

    //Stats
    this.baseAttack = args.base_attack ? args.base_attack : this.defaults.base_attack;
    this.currentAttack = this.baseAttack;
    this.damage = new Damage(this.sword, {"baseValue": this.baseAttack});
    this.damage.onTargetCollision = function(){
        //Do nothing
    }

    //State Machine
    this.stateMachine = new StateMachine(this, this.game.cache.getJSON("statemachine:animations:melee"));

    //Tracking
    this.trackedSprite = args.tracked_sprite;
    this.xOffset = 0;
    this.yOffset = 0;

    //Slashing
    this.horizontalOffset = args.horizontal_offset ? args.horizontal_offset : this.defaults.horizontal_offset;
    this.verticalOffset = args.vertical_offset ? args.vertical_offset : this.defaults.vertical_offset;
    this.slashDir = {x : 0, y : 0};


    //Animations
    this.animations.add('slash', this.defaults.slash_frames, 15, false);
    this.animations.getAnimation("slash").onComplete.add(function(){
        this.stateMachine.setProperty("slashing", false);
    },this);

    //Initialization
    this.exists = false
};

Melee.prototype = Object.create(Phaser.Sprite.prototype);
Melee.prototype.constructor = Melee;

//Constants

//Phaser Overrides

Melee.prototype.update = function(){
    this.position.x = this.trackedSprite.position.x + this.xOffset;
    this.position.y = this.trackedSprite.position.y + this.yOffset;
    this.stateMachine.update();
};

//Attack Functions

Melee.prototype.slash = function(){
    this.exists = true;
};

//Behaviour Functions

Melee.prototype.neutral = function(){
    this.exists = false;
    this.xOffset = 0;
    this.yOffset = 0;
    this.scale.x = this.origScale.x;
    this.scale.y = this.origScale.y;
    this.rotation = Phaser.Math.degToRad(0);
};
