function EnemyMage(game, args){
    //Basics
    Soldier.call(this, game, args);

    //Shooting
    this.weapon = this.game.add.weapon();
    this.weapon.bulletSpeed = args.bullet_speed ? args.bullet_speed : this.defaults.bullet_speed;
    this.weapon.createBullets(-1, args.bullet_sprite ? args.bullet_sprite : this.defaults.bullet_sprite);
    this.weapon.trackSprite(this);
    this.weapon.fireRate = args.fire_rate ? args.fire_rate : this.defaults.fire_rate;
    this.weapon.onFire.add(function(bullet, weapon){
        bullet.body.allowGravity = false;
        bullet.body.setCircle(4,4,4);
        bullet.damage = new Damage(bullet, {"baseValue": this.currentAttack});
    },this);
    this.enemyDamageGroup.add(this.weapon.bullets);

};

EnemyMage.prototype = Object.create(Soldier.prototype);
EnemyMage.prototype.constructor = EnemyMage;

//Constants
EnemyMage.prototype.defaults = {
    //Actor Defaults
    sprite : "enemy:mage",
    hp : 5,
    base_attack : 1,
    speed : 50,
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
    vision_range : 500,
    vision_angle : 45,
    range : 400,
    attack_cooldown : 100,
    attack_windup : 100,
    //EnemyMage Defaults
    bullet_sprite : "sprite:bullet:enemy_energy_ball",
    bullet_speed : 300,
    fire_rate : 200
};

//Attack Functions
EnemyMage.prototype.attack = function(){
    this.body.velocity.x = 0;
    this.aiStateMachine.setProperty("attacking", true);
    this.tryPlayAnimation("attack");

   this.weapon.fire(null, this.heroine.x, this.heroine.y);
};