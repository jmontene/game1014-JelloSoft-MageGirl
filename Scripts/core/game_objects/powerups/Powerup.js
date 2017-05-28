function Powerup(game, args){
    //Basics
    Phaser.Sprite.call(this, game, args.x, args.y, 'sprite:powerup:' + args.image);
    this.anchor.set(0.5,0.5);
    this.game.physics.enable(this);
    this.body.allowGravity = false;
    this.body.collideWorldBounds = true;
    this.body.setCircle(args.radius, args.offsetX, args.offsetY);

    //Collision
    this.heroine = args.heroine;

    args.powerupGroup.add(this);
}

Powerup.prototype = Object.create(Phaser.Sprite.prototype);
Powerup.prototype.constructor = Powerup;

//Phaser overrides

Powerup.prototype.update = function(){
    this.game.physics.arcade.overlap(this, this.heroine, this.onPickup, null, this);
}

//Custom functions

Powerup.prototype.onPickup = function(powerup, heroine){
    console.log("Powerup picked up");
    this.kill();
};