function Swordfighter(game, args){
    //Basics
    args.sprite = args.sprite ? args.sprite : this.defaults.sprite
    Heroine.call(this, game, args);
    this.scale.x = 1.5;
    this.scale.y = 1.5;

    //Slashing
    this.sword = new BasicSword(game, {
        x : 0,
        y : 0,
        tracked_sprite : this,
        base_attack : this.baseAttack,
    });
    game.add.existing(this.sword);
    this.enemyDamageGroup.add(this.sword);

    //Animations
    this.animations.add('idle',["idle"], 6, true);
    this.animations.add('run', ["run_2", "run_3", "run_4", "run_5"], 12, true);
    this.animations.add('attack', ["slash_1", "slash_2", "slash_3"], 12, false);
    this.animations.add('attack_run',["slash_run_1", "slash_run_2", "slash_run_3, slash_run_4, slash_run_5"], 8, false);
    this.animations.add('jump', ["jump"], 6, false);

    //Animation Hooks
    this.animHooks.idle = 'idle';
    this.animHooks.run = 'run';
    this.animHooks.attack = 'attack';
    this.animHooks.jump = 'jump';
    this.animHooks.attack_run = 'attack_run';

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
    sprite : "heroine:sword",
    hp : 10,
    speed : 250,
    base_attack : 3,
    jump_speed : 800,
    invincibility_time : 2000,
    animation_state_machine : "statemachine:animations:heroine"
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

//Input Handling

//Collision Handling

//Function Wiring
Swordfighter.prototype.move = Heroine.prototype.basicMove;
Swordfighter.prototype.jump = Heroine.prototype.basicJump;
Swordfighter.prototype.attack = Swordfighter.prototype.slash;