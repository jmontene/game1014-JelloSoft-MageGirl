function Bat(game, args){
    //Basics
    EnemyMage.call(this, game, args);

    this.body.allowGravity = false;
};

Bat.prototype = Object.create(EnemyMage.prototype);
Bat.prototype.constructor = Bat;

//Constants
Bat.prototype.defaults = {
    //Actor Defaults
    sprite : "enemy:bat",
    hp : 5,
    base_attack : 1,
    speed : 200,
    jump_speed : 600,
    //Enemy Defaults
    ai_state_machine : "statemachine:ai:soldier",
    //Soldier Defaults
    patrolling_distance : 50,
    stop_interval : {
        min : 2000,
        max : 5000
    },
    stop_time : {
        min : 1000,
        max : 2000
    },
    vision_range : 600,
    vision_angle : 45,
    range : 600,
    attack_cooldown : 100,
    attack_windup : 100,
    //EnemyMage Defaults
    bullet_sprite : "sprite:bullet:enemy_energy_ball",
    bullet_speed : 300,
    fire_rate : 200
};

Bat.prototype.moveTowardsPlayer = function(){
    this.aiStateMachine.setProperty("player_in_vision", this.isPlayerInVision());
    this.aiStateMachine.setProperty("player_in_range", this.isPlayerInRange());
};

Bat.prototype.isPlayerInVision = Bat.prototype.isPlayerInRange;