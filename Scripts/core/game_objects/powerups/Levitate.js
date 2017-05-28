function Levitate(game, args){
    //Basics
    Powerup.call(this, game, args);
    this.duration = args.duration;
};

Levitate.prototype = Object.create(Powerup.prototype);
Levitate.prototype.constructor = Levitate;

//Powerup Overrides

Levitate.prototype.onPickup = function(powerup, heroine){
    heroine.startLevitation(this.duration);
    this.kill();
};