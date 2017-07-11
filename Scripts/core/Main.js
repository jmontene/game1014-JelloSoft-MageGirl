window.onload = function(){
    let game = new Phaser.Game(960, 600, Phaser.AUTO, 'game');
    game.state.add('Boot', Boot)
    game.state.add('Preload', Preload);
    game.state.add('MainMenu', MainMenu);
    game.state.add('PlayState', PlayState);
    game.state.add('GameOver', GameOver);
    game.state.start('Boot');
}