function Coin(game, args){
    //Basics
    Collectible.call(this, game, args);

    this.animations.add('rotate', [0,1,2,1], 6, true);
    this.animations.play('rotate');
    this.body.setCircle(
        args.radius ? args.radius : this.defaults.radius,
        args.offsetX ? args.offsetX : this.defaults.offsetX,
        args.offsetY ? args.offsetY : this.defaults.offsetY
    );

    this.sfx = args.sfx ? args.sfx : this.defaults.sfx;
};

Coin.prototype = Object.create(Collectible.prototype);
Coin.prototype.constructor = Coin;

//Constants
Coin.prototype.defaults = {
    sprite : "sprite:collectible:coin",
    radius : 4,
    offsetX : 0,
    offsetY : 0,
    sfx : "sfx:coin"
};

//Collectible Overrides

Coin.prototype.onPickup = function(heroine){
    heroine.onCoinPickup.dispatch();
    this.game.sound.play(this.sfx,1,false);
    this.kill();
};