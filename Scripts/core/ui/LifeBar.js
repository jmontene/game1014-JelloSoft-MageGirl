LifeBar = function(game, args){
    //Basics
    Phaser.Sprite.call(this, game, args.x, args.y, null);

    //Parts
    this.parts = this.game.add.group();
    this.parts.fixedToCamera = true;

    //Tracked Heroine
    this.heroine = args.heroine;

    //Set up initial events
    this.events.onAddedToGroup.add(function(sprite, group){
        this.content = this.parts.create(27,18,args.content ? args.content : this.defaults.content);
        this.back = this.parts.create(0,0,args.back ? args.back : this.defaults.back);
        this.front = this.parts.create(0,0,args.front ? args.front : this.defaults.front);

        //Initial settings
        this.content.scale.x = 1;
        this.content.tint = args.tint ? args.tint : this.defaults.tint;
    }, this);
}

LifeBar.prototype = Object.create(Phaser.Sprite.prototype);
LifeBar.prototype.constructor = LifeBar;

//Constants
LifeBar.prototype.defaults = {
    back : "ui:lifebar:back",
    front : "ui:lifebar:front",
    content : "ui:lifebar:content",
    tint : 0xff0000
};

//Phaser Overrides

LifeBar.prototype.update = function(){
    this.updateContent();
};

LifeBar.prototype.updateContent = function(){
    let perc = this.heroine.hp / this.heroine.maxHP;
    this.content.scale.x = perc;
}

//Utility
LifeBar.prototype.changeTint = function(tint){
    this.content.tint = tint;
};

LifeBar.prototype.setHeroine = function(heroine){
    this.heroine = heroine;
};

LifeBar.prototype.setBack = function(back){
    this.back.loadTexture(back);
};