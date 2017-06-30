function Swordfighter(game, args){
    //Basics
    args.sprite = args.sprite ? args.sprite : this.defaults.sprite
    Heroine.call(this, game, args);
    this.scale.x = 1.5;
    this.scale.y = 1.5;

    //Slashing
    this.sword = new Melee(game, {
        x : 0,
        y : 0,
        sprite : null,
        base_attack : this.baseAttack,
        attack_rate : 2000,
        tracked_sprite : this,
        horizontal_offset : 20,
        vertical_offset : 20,
        slash_width : 20,
        slash_height : 40,
        slash_sprite : "sprite:melee:slash"
    })
    //game.add.existing(this.sword);

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

    //Animation Events
    this.animations.getAnimation("attack").onComplete.add(function(){
        this.animationStateMachine.setProperty("attacking", false);
    },this);
    this.animations.getAnimation("attack_run").onComplete.add(function(){
        this.animationStateMachine.setProperty("attacking", false);
    },this);
}

Swordfighter.prototype = Object.create(Heroine.prototype);
Swordfighter.prototype.constructor = Swordfighter;

//Constants
Swordfighter.prototype.defaults = {
    sprite : "heroine:sword",
    hp : 15,
    speed : 250,
    base_attack : 1,
    jump_speed : 600,
    fire_rate : 200,
    bullet_speed : 300,
    bullet_sprite : "energy_ball",
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
    if(this.attackDir.x != 0 || this.attackDir.y != 0){
        this.animationStateMachine.setProperty("attacking", true);
    }
};

//Death Functions

//Input Handling

//Collision Handling

//Function Wiring
Swordfighter.prototype.move = Heroine.prototype.basicMove;
Swordfighter.prototype.jump = Heroine.prototype.basicJump;
Swordfighter.prototype.attack = Swordfighter.prototype.slash;