const COINCOUNTER_NUMBERS = '0123456789X';

CoinCounter = function(game, args){
    //Basics
    Phaser.Sprite.call(this, game, args.x, args.y, null);
    this.font = this.game.add.retroFont('ui:font:' + args.font, 20, 26, COINCOUNTER_NUMBERS,6);

    //Parts
    this.parts = this.game.add.group();
    this.parts.fixedToCamera = true;
    this.icon = this.game.make.image(this.x,this.y,'ui:icon:' + args.icon);
    this.amount = this.game.make.image(this.icon.x + this.icon.width, this.icon.y + this.icon.height/2, this.font);
    this.amount.anchor.set(0,0.5);
    this.parts.add(this.icon);
    this.parts.add(this.amount);

    //Tracked Heroine
    this.heroine = args.heroine;
}

CoinCounter.prototype = Object.create(Phaser.Sprite.prototype);
CoinCounter.prototype.constructor = CoinCounter;

//Phaser Overrides

CoinCounter.prototype.update = function(){
    this.font.text = `x${this.heroine.coins}`;
};