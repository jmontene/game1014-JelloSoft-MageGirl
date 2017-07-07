function Enemy(game, args){
    //Basics
    Actor.call(this, game, args);

    //Stats

    //Enemies deal damage by collision
    this.damage = new Damage(this,{"baseValue": 1});
    this.damage.onTargetCollision = function(){
        //Do nothing
    }

    //Reference to the heroine
    this.heroine = args.heroine;

    //AI State Machine
    this.aiKey = args.ai_state_machine ? args.ai_state_machine : this.defaults.ai_state_machine;
    this.aiStateMachine = new StateMachine(this, Object.create(this.game.cache.getJSON(this.aiKey)));
}

Enemy.prototype = Object.create(Actor.prototype);
Enemy.prototype.constructor = Enemy;


//Phaser Overrides

Enemy.prototype.update = function(){
    Actor.prototype.update.call(this);
    if(!this.dead){
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

//Function Wiring

Enemy.prototype.executeAI = Enemy.prototype.basicAI;
Enemy.prototype.die = Enemy.prototype.basicEnemyDeath;