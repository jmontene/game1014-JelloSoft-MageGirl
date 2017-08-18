function Enemy(game, args){
    //Basics
    Actor.call(this, game, args);

    //Stats
    this.aiEnabled = true;

    //Enemies deal damage by collision
    this.damage = new Damage(this,{"baseValue": 1});
    this.damage.onTargetCollision = function(){
        //Do nothing
    }

    //Reference to the heroine
    this.heroine = args.heroine;

    //AI State Machine
    this.aiKey = args.ai_state_machine ? args.ai_state_machine : this.defaults.ai_state_machine;
    this.aiStateMachine = new StateMachine(this, this.game.cache.getJSON(this.aiKey, true));
}

Enemy.prototype = Object.create(Actor.prototype);
Enemy.prototype.constructor = Enemy;


//Phaser Overrides

Enemy.prototype.update = function(){
    Actor.prototype.update.call(this);
    if(!this.dead && this.aiEnabled){
        this.aiStateMachine.update();
    }
};

//Movement Functions

//Attack Functions

//Death Functions
Enemy.prototype.basicEnemyDeath = function(){
    this.dead = true;
    this.kill();
};

//AI Handling

//Collision Handling

//Damage Handling

//Status Functions
Enemy.prototype.onFreezeEnter = function(){
    let args = {
        platformGroup : this.platformGroup,
        damageGroup : this.damageGroup,
        enemyDamageGroup : this.enemyDamageGroup,
        enemy : this,
        heroine : this.heroine,
        x : this.x,
        y : this.y
    };
    let icube = new IceCube(this.game, args);
    this.game.add.existing(icube);
};

Enemy.prototype.onFreezeExit = function(respawnPos){
    this.dead = true;
    this.kill();
};

//Function Wiring

Enemy.prototype.executeAI = Enemy.prototype.basicAI;
Enemy.prototype.die = Enemy.prototype.basicEnemyDeath;