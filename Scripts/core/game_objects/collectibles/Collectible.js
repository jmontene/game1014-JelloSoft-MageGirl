function Collectible(game, args){
    //Basics
    Phaser.Sprite.call(this, game, args.x, args.y, 'sprite:collectible:' + args.image);
    this.anchor.set(0.5,0.5);
    this.game.physics.enable(this);
    this.body.allowGravity = false;
    this.body.collideWorldBounds = true;
    this.body.setCircle(args.radius, args.offsetX, args.offsetY);

    //Collision
    this.heroine = args.heroine;

    args.collectibleGroup.add(this);
}

Collectible.prototype = Object.create(Phaser.Sprite.prototype);
Collectible.prototype.constructor = Collectible;

//Phaser overrides

Collectible.prototype.update = function(){
    this.game.physics.arcade.overlap(this, this.heroine, this.onPickup, null, this);
}

//Custom functions

Collectible.prototype.onPickup = function(collectible, heroine){
    console.log("Collectible picked up");
    this.kill();
};