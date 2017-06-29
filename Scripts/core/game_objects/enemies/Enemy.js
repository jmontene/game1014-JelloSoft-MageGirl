function Enemy(game, args){
    //Basics
    Actor.call(this, game, args);

    //Stats

    //Collision Groups
    args.enemyGroup.add(this);

    //Enemies deal damage by collision
    this.damage = new Damage(this,{"baseValue": 1});
    this.damage.onTargetCollision = function(){
        //Do nothing
    }

    //Reference to the heroine
    this.heroine = args.heroine;
}

Enemy.prototype = Object.create(Actor.prototype);
Enemy.prototype.constructor = Enemy;


//Phaser Overrides

Enemy.prototype.update = function(){
    Actor.prototype.update.call(this);
    if(!this.dead){
        this.executeAI();
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
Enemy.prototype.basicAI = function(){
    console.log("Executed AI");
}

//Collision Handling

//Damage Handling

//Function Wiring

Enemy.prototype.executeAI = Enemy.prototype.basicAI;
Enemy.prototype.die = Enemy.prototype.basicEnemyDeath;