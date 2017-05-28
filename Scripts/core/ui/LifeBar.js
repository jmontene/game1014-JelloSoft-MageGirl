const LIFEBAR_TINT = 0xff0000;

LifeBar = function(game, args){
    //Basics
    Phaser.Sprite.call(this, game, args.x, args.y, null);

    //Parts
    this.parts = this.game.add.group();

    //Tracked Heroine
    this.heroine = args.heroine;

    //Set up initial events
    this.events.onAddedToGroup.add(function(sprite, group){
        this.content = this.parts.create(27,18,args.content);
        this.back = this.parts.create(0,0,args.back);
        this.front = this.parts.create(0,0,args.front);

        //Initial settings
        this.content.scale.x = 1;
        this.content.tint = LIFEBAR_TINT;
    }, this);
}

LifeBar.prototype = Object.create(Phaser.Sprite.prototype);
LifeBar.prototype.constructor = LifeBar;

//Phaser Overrides

LifeBar.prototype.update = function(){
    let perc = this.heroine.hp / this.heroine.maxHP;
    this.content.scale.x = perc;
};