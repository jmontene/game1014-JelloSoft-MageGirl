function IceSword(game, args){
    //Basics
    BasicSword.call(this, game, args);

    this.damage.onTargetCollision = function(target){
        target.onFreezeEnter();
    };
};

IceSword.prototype = Object.create(BasicSword.prototype);
IceSword.prototype.constructor = IceSword;

//Constants
IceSword.prototype.defaults = {
    sprite : "sprite:melee:enemy_slash",
    horizontal_offset : 30,
    vertical_offset : 30,
    base_attack : 1,
    slash_frames : ["sword_shockwave_1","sword_shockwave_2","sword_shockwave_3"],
    slash_speed : 15
}