const ENEMY_DEFAULT_SPEED = 200;

function Enemy(game, args){
    //Basics
    Phaser.Sprite.call(this, game, args.x, args.y, "sprite:enemy:" + args.key);
    this.anchor.set(0.5,0.5);
    this.game.physics.enable(this);
    this.body.collideWorldBounds = true;

    //Stats
    this.hp = args.hp;
    this.maxHP = args.hp;

    //Speeds
    this.speed = args.speed;

    //Collision Groups
    this.platformGroup = args.platformGroup;
    args.enemyGroup.add(this);
    this.enemyDamageGroup = args.enemyDamageGroup;

    //Reference to the heroine
    this.heroine = args.heroine;
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
    this.enemyDamageGroup.forEach(this.processDamageCollisions, this);
};

Enemy.prototype.processDamageCollisions = function(damage){
    if(damage instanceof Phaser.Group){
        damage.forEach(this.processDamageCollisions, this);   
    }else{
        this.game.physics.arcade.overlap(this, damage, this.onDamage, null, this);
    }
};

Enemy.prototype.onDamage = function(enemy, obj){
    let damage = obj.damage;
    enemy.hp -= damage.baseValue;
    damage.onTargetCollision();
    if(enemy.hp == 0){
        enemy.die();
    }
}

//Status change

Enemy.prototype.die = function(){
    this.kill();
};