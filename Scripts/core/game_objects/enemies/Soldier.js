function Soldier(game, args){
    //Basics
    Enemy.call(this, game, args);

    //Stats
  
    //Patrolling Variables
    this.patrollingDistance = args.patrolling_distance ? args.patrolling_distance : this.defaults.patrolling_distance;
    this.stopInterval = args.stop_interval ? args.stop_interval : this.defaults.stop_interval;
    this.stopTime = args.stop_time ? args.stop_time : this.defaults.stop_time;
    this.stoppedInPatrol = true;
    this.stopPatrolTimer = this.game.time.create(false);
    this.resumePatrolTimer = this.game.time.create(false);
    this.spawnPoint = {x : this.x, y: this.y};
    this.dir.x = 1;

    //Vision Variables
    this.visionRange = args.vision_range ? args.vision_range : this.defaults.vision_range;
    this.visionAngle = args.vision_angle ? args.vision_angle : this.defaults.vision_angle;

    //Animation Hooks
    this.animHooks.idle = "idle";
    this.animHooks.run = "run";

    //Start the state machine
    this.aiStateMachine.start();
};

Soldier.prototype = Object.create(Enemy.prototype);
Soldier.prototype.constructor = Soldier;

//Constants
Soldier.prototype.defaults = {
    //Actor Defaults
    sprite : "enemy:soldier",
    hp : 5,
    base_attack : 1,
    speed : 100,
    jump_speed : 600,
    //Enemy Defaults
    ai_state_machine : "statemachine:ai:soldier",
    //Soldier Defaults
    patrolling_distance : 150,
    stop_interval : {
        min : 2000,
        max : 5000
    },
    stop_time : {
        min : 1000,
        max : 2000
    },
    vision_range : 500,
    vision_angle : 45
}

//Phaser Overrides

Soldier.prototype.update = function(){
    Enemy.prototype.update.call(this);
};

//Movement Functions

Soldier.prototype.patrol = function(){
    this.aiStateMachine.setProperty("player_in_vision", this.isPlayerInVision());
    if(this.x >= this.spawnPoint.x + this.patrollingDistance){
        this.x = this.spawnPoint.x + this.patrollingDistance;
        this.dir.x = -1;
    }else if(this.x <= this.spawnPoint.x - this.patrollingDistance){
        this.x = this.spawnPoint.x - this.patrollingDistance;
        this.dir.x = 1;
    }

    if(!this.stoppedInPatrol){
        this.move();
    }
};

Soldier.prototype.initPatrolState = function(){
    this.spawnPoint.x = this.x;
    this.spawnPoint.y = this.y;
    this.initPatrol();
};

Soldier.prototype.initPatrol = function(){
    this.togglePatrolMovement();
    this.stopPatrolTimer.add(Phaser.Math.between(this.stopInterval.min, this.stopInterval.max), function(){
        this.togglePatrolMovement();
        this.resumePatrolTimer.add(Phaser.Math.between(this.stopTime.min, this.stopTime.max), function(){
            this.resumePatrolTimer.stop();
            this.initPatrol();
        }, this);
        this.stopPatrolTimer.stop();
        this.resumePatrolTimer.start();
    }, this);
    this.stopPatrolTimer.start();
};

Soldier.prototype.togglePatrolMovement = function(){
    if(this.stoppedInPatrol){
        this.tryPlayAnimation("run");
        this.stoppedInPatrol = false;
    }else{
        this.tryPlayAnimation("idle");
        this.stoppedInPatrol = true;
    }
};

Soldier.prototype.endPatrol = function(){
    this.stopPatrolTimer.stop();
    this.resumePatrolTimer.stop();
};

Soldier.prototype.moveTowardsPlayer = function(){
    this.aiStateMachine.setProperty("player_in_vision", this.isPlayerInVision());
    if(this.x > this.heroine.x){
        console.log("Heroine is on my left");
        this.dir.x = -1;
    }else{
        this.dir.x = 1;
        console.log("Heroine is on my right");
    }
    this.move();
};

//Attack Functions

Soldier.prototype.isPlayerInVision = function(){
    let d = this.game.physics.arcade.distanceBetween(this, this.heroine);
    let a = 0;
    if(this.x >= this.heroine.x){
        a = Phaser.Math.radToDeg(this.game.physics.arcade.angleBetween(this.heroine, this));
    }else{
        a = Phaser.Math.radToDeg(this.game.physics.arcade.angleBetween(this, this.heroine));
    }

    if(a < 0){
        a *= -1;
    }

    return d <= this.visionRange && a <= this.visionAngle;
};

//Death Functions


