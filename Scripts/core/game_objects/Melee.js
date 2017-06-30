function Melee(game, args){
    //Basics
    Phaser.Sprite.call(this, game, args.x, args.y, args.sprite);
    this.anchor.set(0.5,0.5);
    this.game.physics.enable(this);
    this.body.collideWorldBounds = false;
    this.body.allowGravity = false;

    //Stats
    this.baseAttack = args.base_attack ? args.base_attack : this.defaults.base_attack;
    this.currentAttack = this.baseAttack;
    this.attackRate = args.attack_rate ? args.attack_rate : this.defaults.attack_rate;

    //Collision Groups
    this.enemyDamageGroup = args.enemy_damage_group;

    //Tracking
    this.trackedSprite = args.tracked_sprite;

    //Slashing
    this.horizontalOffset = args.horizontal_offset ? args.horizontal_offset : this.defaults.horizontal_offset;
    this.verticalOffset = args.vertical_offset ? args.vertical_offset : this.defaults.vertical_offset;
    this.slashWidth = args.slash_width ? args.slash_width : this.defaults.slash_width;
    this.slashHeight = args.slash_height ? args.slash_height : this.defaults.slash_height;
    this.slashSprite = new Phaser.Sprite(0,0,null);
    this.slashSprite.anchor.set(0.5,0.5);
    this.game.physics.enable(this.slashSprite);
    this.slashSprite.body.allowGravity = false;
    this.slashSprite.body.collideWorldBounds = false;
    this.slashSprite.exists = false;
    this.slashKey = args.slash_sprite ? args.slash_sprite : this.defaults.slash_sprite;
};

Melee.prototype = Object.create(Phaser.Sprite.prototype);
Melee.prototype.constructor = Melee;

//Constants

//Phaser Overrides

Melee.prototype.update = function(){
    this.position.x = this.trackedSprite.position.x;
    this.position.y = this.trackedSprite.position.y;
};

//Attack Functions

Melee.prototype.slash = function(direction){
    if(direction.x == 1){
        this.slashSprite.exists = true;
        this.slashSprite.body.setSize(this.slashWidth, this.slashHeight);
        this.slashSprite.position.x += this.horizontalOffset;
    }
}
