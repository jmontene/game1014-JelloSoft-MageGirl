function Collectible(game, args){
    //Basics
    let img = '';
    if(args.sprite){
        img = 'sprite:collectible:' + args.sprite;
    }else{
        img = null;
    }
    Phaser.Sprite.call(this, game, args.x, args.y, img);
    this.anchor.set(0.5,0.5);
    this.game.physics.enable(this);
    this.body.allowGravity = false;
    this.body.collideWorldBounds = true;

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

Collectible.prototype.onPickup = function(heroine){
    console.log("Collectible picked up");
    this.kill();
};