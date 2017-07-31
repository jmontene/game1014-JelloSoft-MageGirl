function Ladder(game, args){
    //Basics
    Operable.call(this, game, args);
}

Ladder.prototype = Object.create(Operable.prototype);
Ladder.prototype.constructor = Ladder;

Ladder.prototype.defaults = {
    //Operable defaults
    sprite : null,
    hitbox_width : 200,
    hitbox_length : 200
};

Ladder.prototype.onEnter = function(){
    this.heroine.currentHeroine.body.allowGravity = false;
    this.heroine.backupHeroine.body.allowGravity = false;

    this.heroine.currentHeroine.move = Heroine.prototype.ladderMove;
    this.heroine.backupHeroine.move = Heroine.prototype.ladderMove;

    this.heroine.currentHeroine.jump = Heroine.prototype.emptyJump;
    this.heroine.backupHeroine.jump = Heroine.prototype.emptyJump;
}

Ladder.prototype.onExit = function(){
    this.heroine.currentHeroine.body.allowGravity = true;
    this.heroine.backupHeroine.body.allowGravity = true;

    this.heroine.currentHeroine.move = Heroine.prototype.basicMove;
    this.heroine.backupHeroine.move = Heroine.prototype.basicMove;

    this.heroine.currentHeroine.jump = Heroine.prototype.basicJump;
    this.heroine.backupHeroine.jump = Heroine.prototype.basicJump;
}