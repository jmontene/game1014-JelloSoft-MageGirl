PlayState = {};

PlayState.assetFolder = "../../Assets/";

//Game Loop Functions

PlayState.init = function(){
    this.game.renderer.renderSession.roundPixels = true;
}

PlayState.preload = function(){
    //Background
    this.game.load.image('bg:forest', this.assetFolder + 'images/backgrounds/forest.png');
}

PlayState.create = function(){
    this.game.add.image(0,0,'bg:forest');
}

PlayState.update = function(){
    
}

//Other functions of the play state