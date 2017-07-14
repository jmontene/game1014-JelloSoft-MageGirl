function LevelEnd(game, args){
    //Basics
    Collectible.call(this, game, args);
    this.winSfx = args.win_sfx ? args.win_sfx : this.defaults.win_sfx;
    this.hitboxWidth = args.hitbox_width ? args.hitbox_width : this.defaults.hitbox_width;
    this.hitboxHeight = args.hitbox_height ? args.hitbox_height : this.defaults.hitbox_height;
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
    this.game.camera.onFadeComplete.addOnce(function(){
        this.game.state.start("GameOver");
    }, this);
    heroine.parentHeroine.setInputEnabled(false);
    this.game.sound.removeByKey("bgm:castle");
    this.game.sound.play(this.winSfx, 0.5);
    this.game.camera.fade(0x000000, 2500);
    this.kill();
}