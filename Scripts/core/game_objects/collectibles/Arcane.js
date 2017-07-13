function Arcane(game, args){
    //Basics
    if(!args.sprite){
        args.sprite = this.defaults.sprite;
    }
    Collectible.call(this, game, args);
    this.duration = args.duration ? args.duration : this.defaults.duration;
    this.body.setCircle(
        args.radius ? args.radius : this.defaults.radius,
        args.offsetX ? args.offsetX : this.defaults.offsetX,
        args.offsetY ? args.offsetY : this.defaults.offsetY
    );

    this.regenTime = args.regen_time ? args.regen_time : this.defaults.regen_time;
    this.regenTimer = this.game.time.create(false);
    this.origPos = {x : this.x, y: this.y};
};

Arcane.prototype = Object.create(Collectible.prototype);
Arcane.prototype.constructor = Arcane;

//Constants
Arcane.prototype.defaults = {
    sprite : "sprite:collectible:arcane",
    radius : 4,
    offsetX : 0,
    offsetY : 0,
    duration : 3000,
    regen_time : 2000
};

//Powerup Overrides

Arcane.prototype.onPickup = function(heroine){
    heroine.onArcane({"duration": this.duration});
    if(this.regen_time <= 0){
        this.kill();
    }else{
        this.alpha = 0;
        this.body.enable = false;
        this.regenTimer.add(this.regenTime, function(){
            this.alpha = 1;
            this.body.enable = true;
            this.regenTimer.stop();
        }, this);
        this.regenTimer.start();
    }
};