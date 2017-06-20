function Damage(parent, args){
    this.baseValue = args.baseValue;
    this.parent = parent;
}

Damage.prototype.onTargetCollision = function(){
    this.parent.kill();
};