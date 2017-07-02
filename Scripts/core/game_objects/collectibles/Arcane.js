function Arcane(game, args){
    //Basics
    if(!args.sprite){
        args.sprite = this.defaults.sprite;
    }
    Collectible.call(this, game, args);
    this.duration = args.duration ? args.duration : this.defaults.duration;
    this.body.setCircle(
        args.radius ? args.radius : this.defaults.radius,
        args.offsetX ? args.offsetX : this.defaults.offsetX,
        args.offsetY ? args.offsetY : this.defaults.offsetY
    );
};

Arcane.prototype = Object.create(Collectible.prototype);
Arcane.prototype.constructor = Arcane;

//Constants
Arcane.prototype.defaults = {
    sprite : "arcane",
    radius : 4,
    offsetX : 0,
    offsetY : 0,
    duration : 3000
};

//Powerup Overrides

Arcane.prototype.onPickup = function(heroine){
    heroine.onArcane({"duration": this.duration});
    this.kill();
};