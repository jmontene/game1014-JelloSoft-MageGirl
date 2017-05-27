const GRAVITY = 1200;

PlayState = {};

//Properties
PlayState.assetFolder = "../../Assets/";
PlayState.gravity = GRAVITY;

//Game Loop Functions

PlayState.init = function(){
    this.game.renderer.renderSession.roundPixels = true;

    //Set up keyboard keys
    this.keys = this.game.input.keyboard.addKeys({
        left: Phaser.KeyCode.A,
        right: Phaser.KeyCode.D,
        up: Phaser.KeyCode.W,
        down: Phaser.KeyCode.S,
        shootLeft: Phaser.KeyCode.LEFT,
        shootRight: Phaser.KeyCode.RIGHT,
        shootUp: Phaser.KeyCode.UP,
        shootDown: Phaser.KeyCode.DOWN
    });

    //Set up keyboard events
    this.keys.up.onDown.add(function(){
        let didJump = this.heroine.jump();
    }, this);
};

PlayState.preload = function(){
    //Level Data
    this.game.load.json('level:forest', this.assetFolder + 'data/level00.json');

    //Background
    this.game.load.image('bg:forest', this.assetFolder + 'images/backgrounds/forest.png');

    //Platform images
    this.game.load.image('platform:forest:ground', this.assetFolder + 'images/tiles/forest/ground.png')
    this.game.load.image('platform:forest:4x1', this.assetFolder + 'images/tiles/forest/4x1.png');

    //Heroine Sprite
    this.game.load.image('sprite:heroine', this.assetFolder + 'images/sprites/heroine/mage.png');

    //Bullet Sprites
    this.game.load.image('sprite:bullet:energy_ball', this.assetFolder + 'images/sprites/bullets/energy_ball.png');
};

PlayState.create = function(){
    //Add the background
    this.game.add.image(0,0,'bg:forest');

    //Load the level
    this.loadLevel(this.game.cache.getJSON('level:forest'));
};

PlayState.update = function(){
    this.handleInput();
};

//Other functions of the play state

PlayState.loadLevel = function(data){
    //Set visual theme
    this.theme = data.theme;

    //Create the needed groups and layers
    this.platforms = this.game.add.group();

    //spawn platforms
    data.platforms.forEach(this.spawnPlatform, this);

    //spawn heroine and enemies
    this.spawnCharacters({heroine: data.heroine});

    //enable gravity
    this.game.physics.arcade.gravity.y = this.gravity;
};

PlayState.spawnPlatform = function(platform){
    let sprite = this.platforms.create(platform.x, platform.y, "platform:" + this.theme + ":" + platform.image);

    this.game.physics.enable(sprite);
    sprite.body.allowGravity = false;
    sprite.body.immovable = true;
};

PlayState.spawnCharacters = function(data){
    this.heroine = new Heroine(this.game, data.heroine.x, data.heroine.y);
    this.heroine.platformGroup = this.platforms;
    this.game.add.existing(this.heroine);
};

PlayState.handleInput = function(){
    if(this.keys.left.isDown){
        this.heroine.move(-1);
    }else if(this.keys.right.isDown){
        this.heroine.move(1);
    }else{
        this.heroine.move(0);
    }

    if(this.keys.shootLeft.isDown){
        this.heroine.dirShootingX = -1;
    }else if(this.keys.shootRight.isDown){
        this.heroine.dirShootingX = 1;
    }else{
        this.heroine.dirShootingX = 0;
    }

    if(this.keys.shootUp.isDown){
        this.heroine.dirShootingY = -1;
    }else if(this.keys.shootDown.isDown){
        this.heroine.dirShootingY = 1;
    }else{
        this.heroine.dirShootingY = 0;
    }
}