function Deadzone(game, args){
    //Basics
    Collectible.call(this, game, args);

    this.anchor.set(0,0);
    this.body.setSize(args.width ? args.width : this.defaults.width, args.height ? args.height : this.defaults.height);
    this.body.collideWorldBounds = false;
}

Deadzone.prototype = Object.create(Collectible.prototype);
Deadzone.prototype.constructor = Deadzone;

Deadzone.prototype.defaults = {
    sprite : null,
    radius : 4,
    offsetX : 0,
    offsetY : 0,
    sfx : "sfx:coin",
    //Deadzone Defaults
    width : 200,
    height : 200
};

//Collectible overrides

Deadzone.prototype.onPickup = function(heroine){
    heroine.onDeath.dispatch();
};