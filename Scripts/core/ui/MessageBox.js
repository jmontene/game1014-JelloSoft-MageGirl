function MessageBox(game, args){
    //Basics
    Phaser.Sprite.call(this, game, args.x, args.y, args.sprite);
    this.font = this.game.add.retroFont(args.font, 32, 32, "ABCDEFGHIJKLMNOPQRSTUVWXYZ.!?()123456789",10);
    this.fixedToCamera = true;
    this.scale.setTo(3.4,1);

    //Text
    this.font.text = "";
    this.message = this.game.make.image(this.x, this.y, this.font);
    this.message.fixedToCamera = true;
    this.message.scale.setTo(0.6);
    this.alpha = 0;
    this.message.alpha = 0;

    this.game.add.existing(this);
    this.game.add.existing(this.message);
}

MessageBox.prototype = Object.create(Phaser.Sprite.prototype);
MessageBox.prototype.constructor = MessageBox;

MessageBox.prototype.showMessage = function(text){
    this.font.setText(text, true,0,8);
    this.width = this.message.width + 10;
    this.height = this.message.height + 10;
    let t1 = this.game.add.tween(this).to({alpha : 1}, 2000, Phaser.Easing.Linear.None, true);
    this.game.add.tween(this.message).to({alpha : 1}, 2000, Phaser.Easing.Linear.None, true);

    t1.onComplete.add(function(){
        this.game.add.tween(this).to({alpha : 0}, 2000, Phaser.Easing.Linear.None, true, 3000);
        this.game.add.tween(this.message).to({alpha : 0}, 2000, Phaser.Easing.Linear.None, true, 3000);
    },this);
};