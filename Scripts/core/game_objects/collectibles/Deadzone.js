function Deadzone(game, args){
    //Basics
    Collectible.call(this, game, args);

    this.anchor.set(0,0);
    this.body.setSize(args.width, args.height);
    this.body.collideWorldBounds = false;
}

Deadzone.prototype = Object.create(Collectible.prototype);
Deadzone.prototype.constructor = Deadzone;

//Collecible overrides

Deadzone.prototype.onPickup = function(collectible, heroine){
    heroine.kill();
};