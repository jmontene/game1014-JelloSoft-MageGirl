function LevelEnd(game, args){
    //Basics
    Collectible.call(this, game, args);
    this.winSfx = args.win_sfx ? args.win_sfx : this.defaults.win_sfx;
    this.hitboxWidth = args.hitbox_width ? args.hitbox_width : this.defaults.hitbox_width;
    this.hitboxHeight = args.hitbox_height ? args.hitbox_height : this.defaults.hitbox_height;
    this.nextLevel = args.next_level ? args.next_level : undefined;
    this.body.setSize(this.hitboxWidth, this.hitboxHeight);
}

LevelEnd.prototype = Object.create(Collectible.prototype);
LevelEnd.prototype.constructor = LevelEnd;

LevelEnd.prototype.defaults = {
    //Collectible defaults
    sfx : "sfx:select",
    //LevelEnd defaults
    hitbox_witdth : 50,
    hitbox_height : 50,
    win_sfx : "sfx:win"
}

LevelEnd.prototype.onPickup = function(heroine){
    this.game.state.states[this.game.state.current].changeLevel(this.nextLevel);
};