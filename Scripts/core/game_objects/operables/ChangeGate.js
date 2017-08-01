function ChangeGate(game, args){
    //Basics
    Operable.call(this, game, args);

    this.hType = args.h_type;
};

ChangeGate.prototype = Object.create(Operable.prototype);
ChangeGate.prototype.constructor = ChangeGate;

ChangeGate.prototype.defaults = {
    //Operable defaults
    sprite : null,
    hitbox_width : 200,
    hitbox_height : 200
};

ChangeGate.prototype.onEnter = function(){
    let checkClass = Heroine;
    switch(this.hType){
        case "mage":
            checkClass = Mage;
            break;
        case "swordfighter":
            checkClass = Swordfighter;
            break;
    }
    if(!(this.heroine.currentHeroine instanceof checkClass)){
        this.heroine.switch();
    };
    this.heroine.toggleSwitch();
    this.destroy();
};