const GRAVITY = 1200;

PlayState = {};

//Properties
PlayState.assetFolder = "Assets/";
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
        attackLeft: Phaser.KeyCode.LEFT,
        attackRight: Phaser.KeyCode.RIGHT,
        attackUp: Phaser.KeyCode.UP,
        attackDown: Phaser.KeyCode.DOWN
    });
};

PlayState.preload = function(){
    //Level Data
    this.game.load.json('level:forest', this.assetFolder + 'data/firstPlayable.json');

    //Animation Data
    this.game.load.json('statemachine:animations:heroine', this.assetFolder + 'data/state_machines/animations/heroine.json');
    this.game.load.json('statemachine:animations:melee', this.assetFolder + 'data/state_machines/animations/melee.json');

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
    this.game.load.image('platform:forest:2x1', this.assetFolder + 'images/tiles/forest/2x1.png');

    //Heroine Sprites
    this.game.load.image('sprite:heroine:mage', this.assetFolder + 'images/sprites/heroine/mage.png');
    this.game.load.atlas('sprite:heroine:sword', this.assetFolder + 'images/sprites/heroine/sword.png', this.assetFolder + 'data/atlases/sword_girl.json');

    //Enemy Sprites
    this.game.load.image('sprite:enemy:basic_shooter', this.assetFolder + 'images/sprites/enemies/basic_shooter.png');
    this.game.load.image('sprite:enemy:flying_shooter', this.assetFolder + 'images/sprites/enemies/flying_shooter.png');

    //Bullet Sprites
    this.game.load.image('sprite:bullet:energy_ball', this.assetFolder + 'images/sprites/bullets/energy_ball.png');
    this.game.load.image('sprite:bullet:enemy_energy_ball', this.assetFolder + 'images/sprites/bullets/enemy_energy_ball.png');

    //Melee Sprites
    this.game.load.atlas('sprite:melee:slash', this.assetFolder + 'images/sprites/melee/slash_shockwave.png', this.assetFolder + 'data/atlases/sword_shockwave.json');

    //Collectible Sprites
    this.game.load.image('sprite:collectible:arcane', this.assetFolder + 'images/sprites/collectibles/levitate.png');
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
    //Do nothing for now
};

//Level Loading

PlayState.loadLevel = function(data){
    //Set visual theme
    this.theme = data.theme;

    //Set world bounds
    this.game.world.setBounds(data.world.originX,data.world.originY,data.world.width, data.world.height);

    //Create the needed groups and layers
    this.platforms = this.game.add.group(); //Platforms
    this.enemies = this.game.add.group(); //Enemies
    this.damageGroup = this.game.add.group(); //Stuff that deals damage to heroines
    this.damageGroup.add(this.enemies); //Add the enemies to the damage group
    this.enemyDamageGroup = this.game.add.group(); //Stuff that deals damage to enemies
    this.collectibles = this.game.add.group(); //Collectibles

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
    this.spawnHeroine(data.heroine);

    //Enemies
    data.enemies.forEach(this.spawnEnemy, this);
};

PlayState.spawnHeroine = function(heroine){
    heroine.args.damageGroup = this.damageGroup;
    heroine.args.enemyDamageGroup = this.enemyDamageGroup;
    heroine.args.platformGroup = this.platforms;
    heroine.args.enemyGroup = this.enemies;
    heroine.args.keys = this.keys;
    if(heroine.args.sprite){
        heroine.args.sprite = "heroine:" + heroine.args.sprite;
    }
    let h = undefined;

    switch(heroine.class){
        case "mage":
            h = new Mage(this.game, heroine.args);
            break;
        case "swordfighter":
            h = new Swordfighter(this.game, heroine.args);
            break;
        default:
            h = new Heroine(this.game, heroine.args);
    }

    this.game.add.existing(h);
    this.heroine = h;
}

PlayState.spawnEnemy = function(enemy){
    enemy.args.damageGroup = this.enemyDamageGroup;
    enemy.args.enemyDamageGroup = this.damageGroup;
    enemy.args.platformGroup = this.platforms;
    enemy.args.enemyGroup = this.enemies;
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
        case "arcane":
            c = new Arcane(this.game, collectible.args);
            break;
        case "coin":
            c = new Coin(this.game, collectible.args);
            break;
        case "deadzone":
            c = new Deadzone(this.game, collectible.args);
            this.deadzone = c;
            break;
        default:
            c = new Collectible(this.game, collectible.args);
    }
};

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