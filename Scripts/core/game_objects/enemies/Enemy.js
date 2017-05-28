const ENEMY_DEFAULT_SPEED = 200;

function Enemy(game, args){
    //Basics
    Phaser.Sprite.call(this, game, args.x, args.y, "sprite:enemy:" + args.key);
    this.anchor.set(0.5,0.5);
    this.game.physics.enable(this);
    this.body.collideWorldBounds = true;

    //Speeds
    this.speed = args.speed;

    //Collision Groups (Set by caller)
    this.platformGroup = args.platformGroup;
    args.enemyGroup.add(this);
}

Enemy.prototype = Object.create(Phaser.Sprite.prototype);
Enemy.prototype.constructor = Enemy;


//Phaser Overrides

Enemy.prototype.update = function(){
    this.handleCollisions();
}

//Enemy actions

Enemy.prototype.move = function(direction){
    this.body.velocity.x = direction * this.speed;

    if(this.body.velocity.x < 0){
        this.scale.x = -1;
    }else if(this.body.velocity.x > 0){
        this.scale.x = 1;
    }
};

//Collision Handling

Enemy.prototype.handleCollisions = function(){
    this.game.physics.arcade.collide(this, this.platformGroup);
};