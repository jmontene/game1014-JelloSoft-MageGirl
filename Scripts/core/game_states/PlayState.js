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
        attackDown: Phaser.KeyCode.DOWN,
        switch: Phaser.KeyCode.ENTER
    });
};

PlayState.preload = function(){
    //Level Data
    this.game.load.json('level:forest', this.assetFolder + 'data/firstPlayable.json');
    this.load.tilemap('level:castle', this.assetFolder + '/data/levels/castle.json', null, Phaser.Tilemap.TILED_JSON);
    this.load.image('tileset:castle', this.assetFolder + '/images/tiles/castle/tileset.png');

    //Animation Data
    this.game.load.json('statemachine:animations:heroine', this.assetFolder + 'data/state_machines/animations/heroine.json');
    this.game.load.json('statemachine:animations:melee', this.assetFolder + 'data/state_machines/animations/melee.json');

    //Background
    this.game.load.image('bg:castle', this.assetFolder + 'images/backgrounds/castle.png');

    //UI Elements
    this.game.load.image('ui:lifebar:back', this.assetFolder + 'images/ui/lifebar/back.png');
    this.game.load.image('ui:lifebar:back:sword', this.assetFolder + 'images/ui/lifebar/back_sword.png');
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
    this.bg = this.game.add.image(0,0,'bg:castle');
    this.bg.scale.x /= 1.5;
    this.bg.scale.y /= 1.5;
    this.bg.fixedToCamera = true;

    this.map = this.game.add.tilemap('level:castle');
    this.map.addTilesetImage('castle', 'tileset:castle');

    //create layer
    this.platformLayer = this.map.createLayer('platforms');
 
    //collision on blockedLayer
    this.map.setCollisionBetween(1, 100, true, 'platforms');
 
    //resizes the game world to match the layer dimensions
    this.platformLayer.resizeWorld();

    //Create the UI
    this.uiManager = this.createUI();

    //Load the level
    this.loadLevel();

    //Enable Gravity
    this.game.physics.arcade.gravity.y = 1200;
    this.game.physics.arcade.TILE_BIAS = 40;
};

PlayState.update = function(){
    //Do nothing for now
};

//Level Loading

PlayState.findObjectsByType = function(type, map, layer) {
    var result = new Array();
    map.objects[layer].forEach(function(element){
      if(element.type === type) {
        //Phaser uses top left, Tiled bottom left so we have to adjust the y position
        //also keep in mind that the cup images are a bit smaller than the tile which is 16x16
        //so they might not be placed in the exact pixel position as in Tiled
        element.y -= map.tileHeight;
        result.push(element);
      }      
    });
    return result;
};

PlayState.loadLevel = function(){
    //Create the needed groups and layers
    this.platforms = this.platformLayer; //Platforms
    this.enemies = this.game.add.group(); //Enemies
    this.damageGroup = this.game.add.group(); //Stuff that deals damage to heroines
    this.damageGroup.add(this.enemies); //Add the enemies to the damage group
    this.enemyDamageGroup = this.game.add.group(); //Stuff that deals damage to enemies
    this.collectibles = this.game.add.group(); //Collectibles

    //spawn heroine and enemies
    this.spawnCharacters();

    //spawn powerups
    /*data.collectibles.forEach(this.spawnCollectible, this);

    //More group operations
    this.damageGroup.add(this.enemies);*/

    //Set Camera
    this.game.camera.follow(this.heroine);
};

PlayState.spawnCharacters = function(){
    //Heroine
    this.spawnHeroine();

    //Enemies
    //data.enemies.forEach(this.spawnEnemy, this);
};

PlayState.spawnHeroine = function(){
    let result = this.findObjectsByType('playerSpawn', this.map, 'Objects')
    let args = {}

    args.x = result[0].x;
    args.y = result[0].y;
    args.damageGroup = this.damageGroup;
    args.enemyDamageGroup = this.enemyDamageGroup;
    args.platformGroup = this.platforms;
    args.enemyGroup = this.enemies;
    args.collectibleGroup = this.collectibles;
    args.keys = this.keys;
    args.heroine_A = new Mage(this.game, Object.create(args));
    args.heroine_B = new Swordfighter(this.game, Object.create(args));
    args.uiManager = this.uiManager;

    let h = undefined;
    h = new DualHeroine(this.game, args);
    this.uiManager.lifebar.setHeroine(h);
    this.uiManager.coinCounter.setHeroine(h);

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
    });

    let coinCounter = new CoinCounter(this.game,{
        "x": 190,
        "y": 0,
        "icon": "coin",
        "font": "numbers",
    });

    this.ui.add(lifebar);
    this.ui.add(coinCounter);

    return {
        lifebar : lifebar,
        coinCounter : coinCounter
    }
};