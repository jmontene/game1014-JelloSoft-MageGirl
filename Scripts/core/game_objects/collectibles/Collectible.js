function Collectible(game, args){
    //Basics
    if(!args.sprite){
        args.sprite = this.defaults.sprite;
    }
    Phaser.Sprite.call(this, game, args.x, args.y, args.sprite);
    this.anchor.set(0.5,0.5);
    this.game.physics.enable(this);
    this.body.allowGravity = false;
    this.body.collideWorldBounds = true;
    this.sfx = args.sfx ? args.sfx : this.defaults.sfx;

    //Collision
    this.heroine = args.heroine;
}

Collectible.prototype = Object.create(Phaser.Sprite.prototype);
Collectible.prototype.constructor = Collectible;

//Phaser overrides

Collectible.prototype.update = function(){
    this.game.physics.arcade.overlap(this, this.heroine, this.onPickup, null, this);
}

//Custom functions

Collectible.prototype.onPickup = function(heroine){
    console.log("Collectible picked up");
    this.kill();
};