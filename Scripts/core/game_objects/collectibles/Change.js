function Change(game, args){
    //Basics
    Collectible.call(this, game, args);
    this.scale.setTo(1.3);
};

Change.prototype = Object.create(Collectible.prototype);
Change.prototype.constructor = Change;

//Constants
Change.prototype.defaults = {
    //Change defaults
    radius : 4,
    sprite : "sprite:collectible:change",
    sfx : "sfx:select"
};

Change.prototype.onPickup = function(heroine){
    this.heroine.toggleSwitch();
    this.game.sound.play(this.sfx);
    this.kill();
}