GameOver = {};

GameOver.init = function(){
    this.game.world._width = 960;
    this.game.world._height = 600;
    this.game.world.resize(960, 600);
};

GameOver.create = function(){
    console.log(this.game.world._width);
    this.game.camera.flash(0x000000, 1000);
    this.game.sound.play("bgm:game_over", 0.6);

    this.title = this.game.add.image(this.game.world.centerX, this.game.world.centerY - 40, 'ui:texts:game_over');
    this.title.scale.setTo(2);
    this.title.anchor.setTo(0.5);

    this.startFont = this.game.add.retroFont('ui:font:basic', 32, 32,"ABCDEFGHIJKLMNOPQRSTUVWXYZ.!?()123456789",10);
    this.startFont.text = "BACK TO TITLE";

    this.startMessage = this.game.add.button(this.game.world.centerX, this.game.world.centerY + 110, this.startFont);
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
        this.backToTitle();
    }, this);
};

GameOver.backToTitle = function(){
    this.game.sound.removeByKey("bgm:game_over");
    this.game.sound.play("sfx:select");
    this.startMessage.inputEnabled = false;
    this.game.camera.fade(0x000000, 1000);
    this.game.camera.onFadeComplete.addOnce(function(){
        this.game.state.start("MainMenu");
    },this)
};