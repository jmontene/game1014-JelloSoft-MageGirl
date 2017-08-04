function Dash(game, args){
    //Basics
    Collectible.call(this, game, args);
    this.wrongSfx = args.wrong_sfx ? args.wrong_sfx : this.defaults.wrong_sfx;
};

Dash.prototype = Object.create(Collectible.prototype);
Dash.prototype.constructor = Dash;

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
        this.game.state.states[this.game.state.current].showMessage("Use Secondary Ability \nwith the Spacebar")
        this.kill();
    }else{
        this.game.sound.play(this.wrongSfx);
    }
}