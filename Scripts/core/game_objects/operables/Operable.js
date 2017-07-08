function Operable(game, args){
    //Basics
    args.sprite = args.sprite ? args.sprite : this.defaults.sprite;
    Phaser.Sprite.call(this, game, args.x, args.y, args.sprite);
    this.anchor.set(0.5,0.5);
    this.game.physics.enable(this);
    this.body.allowGravity = false;

    this.heroine = args.heroine;
};

Operable.prototype = Object.create(Phaser.Sprite.prototype);
Operable.prototype.constructor = Operable;

Operable.prototype.operate = function(){
    console.log("Operated");
}