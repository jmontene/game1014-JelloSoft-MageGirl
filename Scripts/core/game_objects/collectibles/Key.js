function Key(game, args){
    Collectible.call(this, game, args);

    this.door = args.door;
};

Key.prototype = Object.create(Collectible.prototype);
Key.prototype.constructor = Key;

//Constants
Key.prototype.defaults = {
    //Change defaults
    radius : 4,
    sprite : "sprite:collectible:key",
    sfx : "sfx:select"
};

Key.prototype.onPickup = function(heroine){
    this.door.locked = false;
    this.game.sound.play(this.sfx);
    this.kill();
}