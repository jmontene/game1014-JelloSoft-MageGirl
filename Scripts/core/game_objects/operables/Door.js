function Door(game, args){
    //Basics
    Operable.call(this, game, args);

    this.target = args.target;
    this.locked = args.locked ? args.locked : false;
    this.wrongSfx = args.wrong_sfx ? args.wrong_sfx : this.defaults.wrong_sfx;
};

Door.prototype = Object.create(Operable.prototype);
Door.prototype.constructor = Door;

Door.prototype.defaults = {
    //Operable defaults
    sprite : null,
    hitbox_width : 50,
    hitbox_height : 50,
    wrong_sfx : "sfx:wrong"
}

Door.prototype.operate = function(){
    if(this.locked){
        this.game.sound.play(this.wrongSfx);
    }else{
        this.heroine.teleportTo(this.target.position.x, this.target.position.y);
    }
};