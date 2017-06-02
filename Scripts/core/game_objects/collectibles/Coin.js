function Coin(game, args){
    //Basics
    Collectible.call(this, game, args);

    this.animations.add('rotate', [0,1,2,1], 6, true);
    this.animations.play('rotate');
    this.body.setCircle(args.radius, args.offsetX, args.offsetY);
};

Coin.prototype = Object.create(Collectible.prototype);
Coin.prototype.constructor = Coin;

//Collectible Overrides

Coin.prototype.onPickup = function(powerup, heroine){
    heroine.coins += 1;
    this.kill();
};