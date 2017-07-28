function IceCube(game, args){
    //Basics
    Enemy.call(this, game, args);
    this.containedEnemy = args.enemy;

    //Physics
    this.body.allowGravity = false;
    this.body.immovable = true;

    //Movement
    this.moveTimer = this.game.time.create(false);
    this.moveDuration = args.move_duration ? args.move_duration : this.defaults.move_duration;

    //Respawn
    this.respawnTime = args.respawn_time ? args.respawn_time : this.defaults.respawn_time;
    this.respawnTimer = this.game.time.create(false);

    this.init();
    this.respawnPos = {
        x : this.containedEnemy.world.x,
        y : this.containedEnemy.world.y
    }

    this.aiStateMachine.start();
}

IceCube.prototype = Object.create(Enemy.prototype);
IceCube.prototype.constructor = IceCube;

//Constants
IceCube.prototype.defaults = {
    //Actor defaults
    sprite : "enemy:ice_cube",
    hp : 1,
    base_attack : 1,
    speed : 500,
    jump_speed : 200,
    //Enemy Defaults
    ai_state_machine : "statemachine:ai:ice_cube",
    //Ice Cube defaults
    move_duration : 500,
    respawn_time : 5000
};

//Init/Destroy
IceCube.prototype.init = function(){
    this.containedEnemy.aiEnabled = false;
    this.containedEnemy.body.enable = false;
    this.containedEnemy.body.allowGravity = false;
    this.addChild(this.containedEnemy);
    this.containedEnemy.x = 0;
    this.containedEnemy.y = 0;
    this.width = this.containedEnemy.width;
    this.height = this.containedEnemy.height;
};

IceCube.prototype.finish = function(){
    this.containedEnemy.onFreezeExit(this.respawnPos);
    this.destroy();
};

//AI States
IceCube.prototype.frozenStateEnter = function(){
    this.body.velocity.x = 0;
    this.body.velocity.y = 0;
    this.dir.x = 0;
    this.dir.y = 0;
};

IceCube.prototype.frozenState = function(){
    this.game.physics.arcade.collide(this, this.heroine.currentHeroine, this.onHeroineCollision, null, this);
};

IceCube.prototype.movingStateEnter = function(){
    this.body.velocity.x = this.dir.x * this.speed;
    this.body.velocity.y = this.dir.y * this.speed;

    this.moveTimer.add(this.moveDuration, function(){
        this.aiStateMachine.setProperty("moving", false);
        this.moveTimer.stop();
    }, this);
    this.moveTimer.start();
};

IceCube.prototype.stopStateEnter = function(){
    this.body.velocity.x = 0;
    this.body.velocity.y = 0;
    this.dir.x = 0;
    this.dir.y = 0;

    this.respawnTimer.add(this.respawnTime, function(){
        this.finish();
        this.respawnTimer.stop();
    }, this);
    this.respawnTimer.start();
};

IceCube.prototype.stopState = function(){
    this.game.physics.arcade.collide(this, this.heroine.currentHeroine);
};


//Events
IceCube.prototype.onDamageHit = function(damage){
    //Do nothing
};

IceCube.prototype.onHeroineCollision = function(ice, heroine){
    if(ice.body.touching.up){
        return;
    }
    this.aiStateMachine.setProperty("moving", true);
    
    if(ice.body.touching.left){
        ice.dir.x = 1;
    }else if(ice.body.touching.right){
        ice.dir.x = -1;
    }else if(ice.body.touching.down){
        ice.dir.y = -1; 
    }
};

IceCube.prototype.onFreezeEnter = function(){
    //Do nothing
};