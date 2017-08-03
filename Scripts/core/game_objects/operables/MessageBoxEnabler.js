function MessageBoxEnabler(game, args){
    Operable.call(this, game, args);
    this.mBox = args.m_box;
    this.text = args.text;
}

MessageBoxEnabler.prototype = Object.create(Operable.prototype);
MessageBoxEnabler.prototype.constructor = MessageBoxEnabler;

MessageBoxEnabler.prototype.defaults = {
    sprite : null,
    hitbox_width : 200,
    hitbox_height : 200
};

MessageBoxEnabler.prototype.onEnter = function(){
    this.mBox.showMessage(this.text);
    this.destroy();
};