function FlightZone(game, args){
    //Basics
    Operable.call(this, game, args);
};

FlightZone.prototype = Object.create(Operable.prototype);
FlightZone.prototype.constructor = FlightZone;

FlightZone.prototype.defaults = {
    //Operable defaults
    sprite : null,
    hitbox_width : 200,
    hitbox_height : 200
};

FlightZone.prototype.onEnter = function(){
    if(this.heroine.currentHeroine instanceof Mage){
        this.heroine.currentHeroine.startFlight();
    }
};

FlightZone.prototype.onExit = function(){
    if(this.heroine.currentHeroine instanceof Mage){
        this.heroine.currentHeroine.endFlight();
    }
};