function Swordfighter(game, args){
    //Basics
    args.sprite = args.sprite ? args.sprite : this.defaults.sprite
    Heroine.call(this, game, args);
    this.scale.x = 1.3;
    this.scale.y = 1.3;

    //Slashing
    this.sword = new BasicSword(game, {
        x : 0,
        y : 0,
        tracked_sprite : this,
        base_attack : this.baseAttack
    });
    game.add.existing(this.sword);
    this.enemyDamageGroup.add(this.sword);

    //Dashing
    this.dashSpeed = args.dash_speed ? args.dash_speed : this.defaults.dash_speed;
    this.originalSpeed = this.speed;
    this.dashTimer = this.game.time.create(false);
    this.dashTime = args.dash_time ? args.dash_time : this.defaults.dash_time;
    this.dashing = false;

    //Animations
    this.animations.add('idle',["idle"], 6, true);
    this.animations.add('run', ["run_2", "run_3", "run_4", "run_5"], 12, true);
    this.animations.add('attack', ["slash_1", "slash_2", "slash_3"], 12, false);
    this.animations.add('attack_run',["slash_run_1", "slash_run_2", "slash_run_3, slash_run_4, slash_run_5"], 8, false);
    this.animations.add('jump', ["jump"], 6, false);
    this.animations.add('dash', ["dash"], 6, false);

    //Animation Hooks
    this.animHooks.idle = 'idle';
    this.animHooks.run = 'run';
    this.animHooks.attack = 'attack';
    this.animHooks.jump = 'jump';
    this.animHooks.attack_run = 'attack_run';
    this.animHooks.dash = "dash";

    //State variables
    this.slashing = false;

    //Animation Events
    this.animations.getAnimation("attack").onComplete.add(function(){
        this.animationStateMachine.setProperty("attacking", false);
        this.slashing = false;
    },this);
    this.animations.getAnimation("attack_run").onComplete.add(function(){
        this.animationStateMachine.setProperty("attacking", false);
        this.slashing = false;
    },this);
}

Swordfighter.prototype = Object.create(Heroine.prototype);
Swordfighter.prototype.constructor = Swordfighter;

//Constants
Swordfighter.prototype.defaults = {
    //Actor Defaults
    sprite : "heroine:sword",
    hp : 3,
    speed : 250,
    base_attack : 3,
    jump_speed : 800,
    //Heroine Defaults
    invincibility_time : 2000,
    animation_state_machine : "statemachine:animations:heroine",
    ui_tint : 0x00ff00,
    ui_back : "ui:lifebar:back:sword",
    //Swordfighter defaults
    dash_speed : 400,
    dash_time : 450
};

//Phaser overrides

Swordfighter.prototype.update = function(){
    Heroine.prototype.update.call(this);
}

//Movement Functions

//Jump Functions

//Attack Functions
Swordfighter.prototype.slash = function(){
    if(!this.slashing && (this.attackDir.x != 0 || this.attackDir.y != 0)){
        this.slashing = true;
        this.animationStateMachine.setProperty("attacking", true);
        this.sword.slashDir.x = this.attackDir.x;
        this.sword.slashDir.y = this.attackDir.y;
        this.sword.stateMachine.setProperty("slashing", true);
    }
};

//Death Functions

//Secondary Functions
Swordfighter.prototype.secondaryAbility = function(){
    if(this.isGrounded() && !this.dashing){
        this.dir.x = this.scale.x < 0 ? -1 : 1;
        this.speed = this.dashSpeed;
        this.dashing = true;
        this.animationStateMachine.setProperty("dashing", true);
        this.body.setSize(this.width / this.scale.x, (this.height / 2) / this.scale.y, 0, (this.height / 2) / this.scale.y);
        this.dashTimer.add(this.dashTime, function(){
            this.speed = this.originalSpeed;
            this.dashing = false;
            this.animationStateMachine.setProperty("dashing", false);
            this.body.setSize(this.width / this.scale.x, this.height / this.scale.y, 0, 0);
            this.dashTimer.stop();
        }, this);
        this.dashTimer.start();
    }
};

//Input Handling

Swordfighter.prototype.handleMovementInput = function(){
    //Movement
    if(this.keys.left.isDown){
        this.dir.x = Actor.DIRX_LEFT;
    }else if(this.keys.right.isDown){
        this.dir.x = Actor.DIRX_RIGHT;
    }else if(!this.dashing){
        this.dir.x = Actor.DIR_NONE;
    }

    if(this.keys.up.isDown){
        this.dir.y = Actor.DIRY_UP;
    }else if(this.keys.down.isDown){
        this.dir.y = Actor.DIRY_DOWN;
    }else{
        this.dir.y = Actor.DIR_NONE;
    }
};

//Collision Handling

//Function Wiring
Swordfighter.prototype.move = Heroine.prototype.basicMove;
Swordfighter.prototype.jump = Heroine.prototype.basicJump;
Swordfighter.prototype.attack = Swordfighter.prototype.slash;