function Arcane(game, args){
    //Basics
    Collectible.call(this, game, args);
    this.duration = args.duration;
    this.body.setCircle(args.radius, args.offsetX, args.offsetY);
};

Arcane.prototype = Object.create(Collectible.prototype);
Arcane.prototype.constructor = Arcane;

//Powerup Overrides

Arcane.prototype.onPickup = function(powerup, heroine){
    heroine.onArcane({"duration": this.duration});
    this.kill();
};