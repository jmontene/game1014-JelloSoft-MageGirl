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

    //Vision/Range Variables
    this.visionRange = args.vision_range ? args.vision_range : this.defaults.vision_range;
    this.visionAngle = args.vision_angle ? args.vision_angle : this.defaults.vision_angle;
    this.range = args.range ? args.range : this.defaults.range;

    //Slashing
    this.sword = new BasicSword(game, {
        x : 0,
        y : 0,
        tracked_sprite : this,
        base_attack : this.baseAttack,
        sprite : "sprite:melee:enemy_slash",
        slash_speed : 20,
        horizontal_offset : 50
    });
    game.add.existing(this.sword);
    this.enemyDamageGroup.add(this.sword);
    this.attackCooldownTimer = this.game.time.create(false);
    this.attackCooldown = args.attack_cooldown ? args.attack_cooldown : this.defaults.attack_cooldown;

    //Animations
    this.animations.add('attack', [0,0,0], 2, false);
    this.animations.getAnimation("attack").onComplete.add(function(){
        this.attackCooldownTimer.add(this.attackCooldown, function(){
            this.aiStateMachine.setProperty("attacking", false);
            this.attackCooldownTimer.stop();
        }, this)
        this.attackCooldownTimer.start();
    },this);

    //Animation Hooks
    this.animHooks.idle = "idle";
    this.animHooks.run = "run";
    this.animHooks.attack = "attack";

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
    vision_angle : 45,
    range : 70,
    attack_cooldown : 1000,
    attack_windup : 1000
};

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
    this.dir.x = 1;
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
    this.dir.x = 0;
};

Soldier.prototype.endPursuit = function(){
    this.dir.x = 0;
};

Soldier.prototype.moveTowardsPlayer = function(){
    this.aiStateMachine.setProperty("player_in_vision", this.isPlayerInVision());
    this.aiStateMachine.setProperty("player_in_range", this.isPlayerInRange());
    if(this.x > this.heroine.x){
        this.dir.x = -1;
    }else{
        this.dir.x = 1;
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

Soldier.prototype.isPlayerInRange = function(){
    return this.game.physics.arcade.distanceBetween(this,this.heroine) <= this.range;
};

Soldier.prototype.attack = function(){
    this.body.velocity.x = 0;
    this.aiStateMachine.setProperty("attacking", true);
    this.sword.slashDir.x = this.heroine.x < this.x ? -1 : 1;
    this.tryPlayAnimation("attack");
    this.sword.stateMachine.setProperty("slashing", true);
};

//Death Functions


