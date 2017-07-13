MainMenu = {};

MainMenu.create = function(){
    this.game.sound.play("bgm:title", 0.6, true);

    this.title = this.game.add.image(this.game.world.centerX, this.game.world.centerY - 200, 'ui:texts:title');
    this.title.scale.setTo(2);
    this.title.anchor.setTo(0.5);

    this.startFont = this.game.add.retroFont('ui:font:basic', 32, 32,"ABCDEFGHIJKLMNOPQRSTUVWXYZ.!?()123456789",10);
    this.startFont.text = "START";

    this.startMessage = this.game.add.button(this.game.world.centerX, this.game.world.centerY - 20, this.startFont);
    this.startMessage.anchor.setTo(0.5);
    this.startMessage.onInputOver.add(function(){
        this.startMessage.scale.setTo(1.5);
        this.game.sound.play("sfx:hover");
    }, this);
    this.startMessage.onInputOut.add(function(){
        this.startMessage.scale.setTo(1);
    }, this);
    this.startMessage.onInputDown.add(function(){
        this.startMessage.scale.setTo(0.5);
    }, this);
    this.startMessage.onInputUp.add(function(){
        this.startMessage.scale.setTo(1);
        this.startPlay();
    }, this);

    this.insFont = this.game.add.retroFont('ui:font:basic', 32, 32,"ABCDEFGHIJKLMNOPQRSTUVWXYZ.!?()123456789",10);
    this.insFont.text = "INSTRUCTIONS";

    this.insMessage = this.game.add.button(this.game.world.centerX, this.game.world.centerY + 60, this.insFont);
    this.insMessage.anchor.setTo(0.5);

    this.insMessage.onInputOver.add(function(){
        this.insMessage.scale.setTo(1.5);
        this.game.sound.play("sfx:hover");

    }, this);
    this.insMessage.onInputOut.add(function(){
        this.insMessage.scale.setTo(1);
    }, this);
    this.insMessage.onInputDown.add(function(){
        this.insMessage.scale.setTo(0.5);
    }, this);
    this.insMessage.onInputUp.add(function(){
        this.insMessage.scale.setTo(1);
        this.game.sound.play("sfx:select");
        this.toggleInstructions();
    }, this);


    this.instructions = this.addInstructionMessages();    
    this.setInstructionsVisibility(false);
};

MainMenu.startPlay = function(){
    this.game.sound.removeByKey("bgm:title");
    this.game.sound.play("sfx:select");
    this.startMessage.inputEnabled = false;
    this.insMessage.inputEnabled = false;
    this.game.camera.fade(0x000000, 1000);
    this.game.camera.onFadeComplete.addOnce(function(){
        this.game.state.start("PlayState");
    },this)
};

MainMenu.addInstructionMessages = function(){
    let xOff = 400;
    let yOff = -70;
    let yInc = 40;
    this.mFont = this.game.add.retroFont('ui:font:basic', 32, 32,"ABCDEFGHIJKLMNOPQRSTUVWXYZ.!?()123456789",10);
    this.mFont.text = "MOVEMENT         WASD";
    this.movement = this.game.add.image(this.game.world.centerX - xOff, this.game.world.centerY + yOff, this.mFont);
    this.movement.anchor.setTo(0);
    yOff += yInc

    this.jFont = this.game.add.retroFont('ui:font:basic', 32, 32,"ABCDEFGHIJKLMNOPQRSTUVWXYZ.!?()123456789",10);
    this.jFont.text = "JUMP             W";
    this.jump = this.game.add.image(this.game.world.centerX - xOff, this.game.world.centerY + yOff, this.jFont);
    this.jump.anchor.setTo(0);
    yOff += yInc

    this.aFont = this.game.add.retroFont('ui:font:basic', 32, 32,"ABCDEFGHIJKLMNOPQRSTUVWXYZ.!?()123456789",10);
    this.aFont.text = "ATTACK           ARROW KEYS";
    this.attack = this.game.add.image(this.game.world.centerX - xOff, this.game.world.centerY + yOff, this.aFont);
    this.attack.anchor.setTo(0);
    yOff += yInc

    this.sFont = this.game.add.retroFont('ui:font:basic', 32, 32,"ABCDEFGHIJKLMNOPQRSTUVWXYZ.!?()123456789",10);
    this.sFont.text = "SECONDARY        SPACEBAR";
    this.secondary = this.game.add.image(this.game.world.centerX - xOff, this.game.world.centerY + yOff, this.sFont);
    this.secondary.anchor.setTo(0);
    yOff += yInc

    this.wFont = this.game.add.retroFont('ui:font:basic', 32, 32,"ABCDEFGHIJKLMNOPQRSTUVWXYZ.!?()123456789",10);
    this.wFont.text = "SWITCH           ENTER";
    this.switch = this.game.add.image(this.game.world.centerX - xOff, this.game.world.centerY + yOff, this.wFont);
    this.switch.anchor.setTo(0);

    this.bFont = this.game.add.retroFont('ui:font:basic', 32, 32,"ABCDEFGHIJKLMNOPQRSTUVWXYZ.!?()123456789",10);
    this.bFont.text = "GO BACK";
    yOff += yInc

    this.back = this.game.add.button(this.game.world.centerX, this.game.world.centerY + yOff*2, this.bFont);
    this.back.anchor.setTo(0.5);

    this.back.onInputOver.add(function(){
        this.back.scale.setTo(1.5);
        this.game.sound.play("sfx:hover");
    }, this);
    this.back.onInputOut.add(function(){
        this.back.scale.setTo(1);
    }, this);
    this.back.onInputDown.add(function(){
        this.back.scale.setTo(0.5);
    }, this);
    this.back.onInputUp.add(function(){
        this.back.scale.setTo(1);
        this.game.sound.play("sfx:select");
        this.toggleInstructions();
    }, this);

    return [this.movement, this.jump, this.attack, this.secondary, this.switch];
};

MainMenu.setInstructionsVisibility = function(val){
    for(var i=0;i<this.instructions.length;++i){
        this.instructions[i].visible = val;
    }
    this.back.visible = val;
};

MainMenu.toggleInstructions = function(){
    this.startMessage.visible = this.startMessage.visible ? false : true;
    this.insMessage.visible = this.startMessage.visible ? true : false;
    this.setInstructionsVisibility(this.startMessage.visible ? false : true);
};