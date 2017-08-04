function Ice(game, args){
    //Basics
    Collectible.call(this, game, args);
    this.wrongSfx = args.wrong_sfx ? args.wrong_sfx : this.defaults.wrong_sfx;
};

Ice.prototype = Object.create(Collectible.prototype);
Ice.prototype.constructor = Ice;

//Constants
Ice.prototype.defaults = {
    //Change defaults
    radius : 4,
    sprite : "sprite:collectible:arcane",
    sfx : "sfx:select",
    wrong_sfx : "sfx:wrong"
};

Ice.prototype.onPickup = function(heroine){
    if(this.heroine.getType() == "Swordfighter"){
        this.heroine.currentHeroine.sword = this.heroine.currentHeroine.iceSword;
        console.log(this.heroine.currentHeroine.iceSword);
        this.game.state.states[this.game.state.current].showMessage("Your sword now freezes enemies")
        this.kill();
    }else{
        this.game.sound.play(this.wrongSfx);
    }
}