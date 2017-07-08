function Door(game, args){
    //Basics
    Operable.call(this, game, args);

    this.target = args.target;
};

Door.prototype = Object.create(Operable.prototype);
Door.prototype.constructor = Door;

Door.prototype.defaults = {
    //Operable defaults
    sprite : "sprite:operable:door"
}

Door.prototype.operate = function(){
    this.heroine.teleportTo(this.target.position.x, this.target.position.y);
};