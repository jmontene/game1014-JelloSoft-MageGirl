function Operable(game, args){
    //Basics
    args.sprite = args.sprite ? args.sprite : this.defaults.sprite;
    Phaser.Sprite.call(this, game, args.x, args.y, args.sprite);
    this.game.physics.enable(this);
    this.body.allowGravity = false;

    this.heroine = args.heroine;

    //Collision
    this.hitboxWidth = args.hitbox_width ? args.hitbox_width : this.defaults.hitbox_width;
    this.hitboxHeight = args.hitbox_height ? args.hitbox_height : this.defaults.hitbox_height;
    this.body.setSize(this.hitboxWidth, this.hitboxHeight);
};

Operable.prototype = Object.create(Phaser.Sprite.prototype);
Operable.prototype.constructor = Operable;

Operable.prototype.operate = function(){
}

Operable.prototype.onEnter = function(){
};

Operable.prototype.onExit = function(){
};