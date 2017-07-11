function Dash(game, args){
    //Basics
    Collectible.call(this, game, args);
    this.sfx = args.sfx ? args.sfx : this.defaults.sfx;
    this.wrongSfx = args.wrong_sfx ? args.wrong_sfx : this.defaults.wrong_sfx;
};

Dash.prototype = Object.create(Collectible.prototype);
Dash.prototype.constructor = Change;

//Constants
Dash.prototype.defaults = {
    //Change defaults
    radius : 4,
    sprite : "sprite:collectible:dash",
    sfx : "sfx:select",
    wrong_sfx : "sfx:wrong"
};

Dash.prototype.onPickup = function(heroine){
    if(this.heroine.getType() == "Swordfighter"){
        this.heroine.currentHeroine.secondaryEnabled = true;
        this.game.sound.play(this.sfx);
        this.kill();
    }else{
        this.game.sound.play(this.wrongSfx);
    }
}