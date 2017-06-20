function Swordfighter(game, args){
    //Basics
    Heroine.call(this, game, args);

    //Slashing
    this.slashRate = args.slashRate;
    this.dirSlashingX = 0;
    this.dirSlashingY = 0;
    this.canSlash = true;

    this.slashSprite = this.addChild(new Phaser.Sprite(0,0,'sprite:melee:'+args.slash_sprite));

    //Events
    this.slashTimer = this.game.time.create(false);
}

Swordfighter.prototype = Object.create(Heroine.prototype);
Swordfighter.prototype.constructor = Swordfighter;

//Phaser overrides

Swordfighter.prototype.update = function(){
    Heroine.prototype.update.call(this);
}

//Unique Movement Functions

//Unique Jump Functions

//Unique Attack Functions
Swordfighter.prototype.slash = function(){
    if(this.canSlash){

    }
};

//Swordfighter controls
Swordfighter.prototype.move = Heroine.prototype.basicMove;
Swordfighter.prototype.jump = Heroine.prototype.basicJump;
Swordfighter.prototype.attack = Swordfighter.prototype.slash;