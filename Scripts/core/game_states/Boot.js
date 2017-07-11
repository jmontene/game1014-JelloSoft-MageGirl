Boot = {};

Boot.preload = function(){
    this.load.image('ui:font:basic', "Assets/images/ui/fonts/basic_font.png");
};

Boot.create = function(){
    this.game.physics.startSystem(Phaser.Physics.ARCADE);
    this.game.state.start('Preload');
};