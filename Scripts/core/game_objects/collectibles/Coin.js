function Coin(game, args){
    //Basics
    if(!args.sprite){
        args.sprite = this.defaults.sprite;
    }
    Collectible.call(this, game, args);

    this.animations.add('rotate', [0,1,2,1], 6, true);
    this.animations.play('rotate');
    this.body.setCircle(
        args.radius ? args.radius : this.defaults.radius,
        args.offsetX ? args.offsetX : this.defaults.offsetX,
        args.offsetY ? args.offsetY : this.defaults.offsetY
    );
};

Coin.prototype = Object.create(Collectible.prototype);
Coin.prototype.constructor = Coin;

//Constants
Coin.prototype.defaults = {
    sprite : "coin",
    radius : 4,
    offsetX : 0,
    offsetY : 0
};

//Collectible Overrides

Coin.prototype.onPickup = function(heroine){
    heroine.onCoinPickup.dispatch();
    this.kill();
};