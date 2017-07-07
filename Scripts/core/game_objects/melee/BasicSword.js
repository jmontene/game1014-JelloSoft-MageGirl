function BasicSword(game, args){
    //Basics
    Melee.call(this, game, args);   
}

BasicSword.prototype = Object.create(Melee.prototype);
BasicSword.prototype.constructor = BasicSword;

//Constants
BasicSword.prototype.defaults = {
    sprite : "sprite:melee:slash",
    horizontal_offset : 30,
    vertical_offset : 30,
    base_attack : 1,
    slash_frames : ["sword_shockwave_1","sword_shockwave_2","sword_shockwave_3"],
    slash_speed : 15
}

//Attack Functions

BasicSword.prototype.slash = function(){
    Melee.prototype.slash.call(this);
    if(this.slashDir.x == 1){
        this.xOffset = this.horizontalOffset;
        this.animations.play('slash');
    }else if(this.slashDir.x == -1){
        this.xOffset = -this.horizontalOffset;
        this.animations.play('slash');
        this.scale.x = -this.origScale.x;
    }else if(this.slashDir.y == -1){
        this.yOffset = -this.verticalOffset;
        this.animations.play('slash');
        this.rotation = Phaser.Math.degToRad(-90);
    }else if(this.slashDir.y == 1){
        this.yOffset = this.verticalOffset;
        this.animations.play('slash');
        this.rotation = Phaser.Math.degToRad(90);
    }
};