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
    this.game.load.json('level:forest', this.assetFolder + 'data/firstPlayable.json');

    //Background
    this.game.load.image('bg:forest', this.assetFolder + 'images/backgrounds/forest.png');

    //UI Elements
    this.game.load.image('ui:lifebar:back', this.assetFolder + 'images/ui/lifebar/back.png');
    this.game.load.image('ui:lifebar:front', this.assetFolder + 'images/ui/lifebar/front.png');
    this.game.load.image('ui:lifebar:content', this.assetFolder + 'images/ui/lifebar/content.png');
    this.game.load.image('ui:icon:coin', this.assetFolder + 'images/ui/icons/coin.png');

    //Platform images
    this.game.load.image('platform:forest:ground', this.assetFolder + 'images/tiles/forest/ground.png')
    this.game.load.image('platform:forest:4x1', this.assetFolder + 'images/tiles/forest/4x1.png');

    //Heroine Sprite
    this.game.load.image('sprite:heroine', this.assetFolder + 'images/sprites/heroine/mage.png');

    //Enemy Sprites
    this.game.load.image('sprite:enemy:basic_shooter', this.assetFolder + 'images/sprites/enemies/basic_shooter.png');
    this.game.load.image('sprite:enemy:flying_shooter', this.assetFolder + 'images/sprites/enemies/flying_shooter.png');

    //Bullet Sprites
    this.game.load.image('sprite:bullet:energy_ball', this.assetFolder + 'images/sprites/bullets/energy_ball.png');
    this.game.load.image('sprite:bullet:enemy_energy_ball', this.assetFolder + 'images/sprites/bullets/enemy_energy_ball.png');

    //Collectible Sprites
    this.game.load.image('sprite:collectible:levitate', this.assetFolder + 'images/sprites/collectibles/levitate.png');
    this.game.load.spritesheet('sprite:collectible:coin', this.assetFolder + 'images/sprites/collectibles/coin.png',22,22);

    //Fonts
    this.game.load.image('ui:font:numbers', this.assetFolder + 'images/ui/fonts/numbers.png');
};

PlayState.create = function(){
    //Add the background
    this.bg = this.game.add.image(0,0,'bg:forest');
    this.bg.fixedToCamera = true;

    //Load the level
    this.loadLevel(this.game.cache.getJSON('level:forest'));

    //Create the UI
    this.createUI();
};

PlayState.update = function(){
    this.handleInput();
};

//Level Loading

PlayState.loadLevel = function(data){
    //Set visual theme
    this.theme = data.theme;

    //Set world bounds
    this.game.world.setBounds(0,0,data.world.width, data.world.height);

    //Create the needed groups and layers
    this.platforms = this.game.add.group();
    this.enemies = this.game.add.group();
    this.damageGroup = this.game.add.group();
    this.collectibles = this.game.add.group();

    //spawn platforms
    data.platforms.forEach(this.spawnPlatform, this);

    //spawn heroine and enemies
    this.spawnCharacters(data);

    //spawn powerups
    data.collectibles.forEach(this.spawnCollectible, this);

    //enable gravity
    this.game.physics.arcade.gravity.y = this.gravity;

    //More group operations
    this.damageGroup.add(this.enemies);

    //Set Camera
    this.game.camera.follow(this.heroine);
};

PlayState.spawnPlatform = function(platform){
    let sprite = this.platforms.create(platform.x, platform.y, "platform:" + this.theme + ":" + platform.image);

    this.game.physics.enable(sprite);
    sprite.body.allowGravity = false;
    sprite.body.immovable = true;
};

PlayState.spawnCharacters = function(data){
    //Heroine
    this.heroine = new Heroine(this.game, {
        "x": data.heroine.x, 
        "y": data.heroine.y,
        "platformGroup": this.platforms,
        "damageGroup": this.damageGroup
    });
    this.heroine.platformGroup = this.platforms;
    this.game.add.existing(this.heroine);

    //Enemies
    data.enemies.forEach(this.spawnEnemy, this);
};

PlayState.spawnEnemy = function(enemy){
    enemy.args.damageGroup = this.damageGroup;
    enemy.args.platformGroup = this.platforms;
    enemy.args.enemyGroup = this.enemies;
    enemy.args.heroineBullets = this.heroine.weapon.bullets;
    enemy.args.heroine = this.heroine;
    let e = undefined;
    
    switch(enemy.class){
        case "basic_shooter":
            e = new BasicShooterEnemy(this.game, enemy.args);
            break;
        case "flying_shooter":
            e = new FlyingShooterEnemy(this.game, enemy.args);
            break;
        default:
            e = new Enemy(this.game, enemy.args);
    }
};

PlayState.spawnCollectible = function(collectible){
    collectible.args.heroine = this.heroine;
    collectible.args.collectibleGroup = this.collectibles;
    let c = undefined;

    switch(collectible.class){
        case "levitate":
            p = new Levitate(this.game, collectible.args);
            break;
        case "coin":
            p = new Coin(this.game, collectible.args);
            break;
        default:
            p = new Collectible(this.game, collectible.args);
    }
};

//Input

PlayState.handleInput = function(){
    let dirX = 0;
    let dirY = 0;

    if(this.keys.left.isDown){
        dirX = -1;
    }else if(this.keys.right.isDown){
        dirX = 1;
    }

    if(this.keys.up.isDown){
        dirY = -1;
    }else if(this.keys.down.isDown){
        dirY = 1;
    }

    this.heroine.move(dirX, dirY);

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

//UI

PlayState.createUI = function(){
    this.ui = this.game.add.group();

    let lifebar = new LifeBar(this.game,{
        "x": 0,
        "y": 0,
        "back": "ui:lifebar:back",
        "content": "ui:lifebar:content",
        "front": "ui:lifebar:front",
        "heroine": this.heroine
    });

    let coinCounter = new CoinCounter(this.game,{
        "x": 190,
        "y": 0,
        "icon": "coin",
        "font": "numbers",
        "heroine": this.heroine
    });

    this.ui.add(lifebar);
    this.ui.add(coinCounter);
};