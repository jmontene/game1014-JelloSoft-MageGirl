const GRAVITY = 1200;

PlayState = {};

//Properties
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
        switch: Phaser.KeyCode.ENTER,
        secondary: Phaser.KeyCode.SPACEBAR,
        invincible_cheat: Phaser.KeyCode.ONE,
        operate : Phaser.KeyCode.SHIFT
    });
};

PlayState.preload = function(){

};

PlayState.create = function(){
    //Intro Effects
    this.game.camera.flash(0x000000, 1000);

    //Add the background
    this.bg = this.game.add.image(0,0,'bg:castle');
    this.bg.scale.x /= 1.5;
    this.bg.scale.y /= 1.5;
    this.bg.fixedToCamera = true;

    //Load the level
    this.loadLevel();

    //Add sounds
    this.game.sound.play('bgm:castle',0.4,true);

    //Enable Gravity
    this.game.physics.arcade.gravity.y = PlayState.gravity;
    this.game.physics.arcade.TILE_BIAS = 50;
};

PlayState.update = function(){
    if(this.keys.invincible_cheat.justDown){
        this.heroine.toggleInvincibility();
    }
};

//Level Loading

PlayState.findObjectsByType = function(type, map, layer) {
    var result = new Array();
    map.objects[layer].forEach(function(element){
      if(element.type === type) {
        //Phaser uses top left, Tiled bottom left so we have to adjust the y position
        //also keep in mind that the cup images are a bit smaller than the tile which is 16x16
        //so they might not be placed in the exact pixel position as in Tiled
        result.push(element);
      }      
    });
    return result;
};

PlayState.loadLevel = function(){
    this.map = this.game.add.tilemap('level:castle');
    this.map.addTilesetImage('Castle', 'tileset:castle');

    //create layer
    this.map.createLayer('Background');
    this.map.createLayer('Floor Fleshing');
    this.map.createLayer('Doors');
    this.map.createLayer('Objects & Power ups');
    this.platformLayer = this.map.createLayer('Terrain');
 
    //collisions
    this.map.setCollisionBetween(0,500, true, 'Terrain');
 
    //resizes the game world to match the layer dimensions
    this.platformLayer.resizeWorld();

    //Create the needed groups and layers
    this.platforms = this.platformLayer; //Platforms
    this.enemies = this.game.add.group(); //Enemies
    this.enemies.name = "enemies";
    this.damageGroup = this.game.add.group(); //Stuff that deals damage to heroines
    this.damageGroup.add(this.enemies); //Add the enemies to the damage group
    this.enemyDamageGroup = this.game.add.group(); //Stuff that deals damage to enemies
    this.collectibles = this.game.add.group(); //Collectibles
    this.operables = this.game.add.group();

    //Get the targets object
    this.mapTargets = this.createMapTargets();

    //Set an object to store doors
    this.doors = {};

    //Create the UI
    this.uiManager = this.createUI();

    //spawn heroine and enemies
    this.spawnCharacters();

    //spawn operables
    this.spawnOperables();

    //spawn powerups
    this.spawnCollectibles();

    //Set Camera
    this.game.camera.focusOn(this.heroine);
    this.game.camera.follow(this.heroine, Phaser.Camera.FOLLOW_PLATFORMER, 0.05, 0.1);
};

PlayState.createMapTargets = function(){
    let res = {};
    let targetArr = this.findObjectsByType('target', this.map, "Objects");
    for(var i=0;i<targetArr.length;++i){
        res[targetArr[i].properties.targetID] = targetArr[i];
    }
    return res;
};

PlayState.spawnCharacters = function(){
    //Heroine
    this.spawnHeroine();
    //this.heroine.toggleSwitch();
    //this.heroine.toggleSecondary();

    //Enemies
    let enemies = this.findObjectsByType('enemySpawn', this.map, 'Objects');
    for(var i=0;i < enemies.length ; ++i){
        this.spawnEnemy(enemies[i]);
    }
};

PlayState.spawnCollectibles = function(){
    let collectibles = this.findObjectsByType('collectible', this.map, 'Objects');
    for(var i=0;i<collectibles.length;++i){
        this.spawnCollectible(collectibles[i]);
    }
};

PlayState.spawnOperables = function(){
    let operables = this.findObjectsByType('operable', this.map, 'Objects');
    for(var i=0;i<operables.length;++i){
        this.spawnOperable(operables[i]);
    }
};

PlayState.spawnHeroine = function(){
    let result = this.findObjectsByType('playerSpawn', this.map, 'Objects');
    let args = {}

    args.x = result[0].x;
    args.y = result[0].y;
    args.damageGroup = this.damageGroup;
    args.enemyDamageGroup = this.enemyDamageGroup;
    args.platformGroup = this.platforms;
    args.enemyGroup = this.enemies;
    args.collectibleGroup = this.collectibles;
    args.operableGroup = this.operables;
    args.keys = this.keys;
    args.heroine_A = new Mage(this.game, Object.create(args));
    args.heroine_B = new Swordfighter(this.game, Object.create(args));
    args.uiManager = this.uiManager;

    let h = undefined;
    h = new DualHeroine(this.game, args);

    //UI Stuff
    this.uiManager.lifebar.setHeroine(h);
    this.uiManager.coinCounter.setHeroine(h);

    this.game.add.existing(h);
    this.heroine = h;
}

PlayState.spawnEnemy = function(enemy){
    args = {};
    args.x = enemy.x;
    args.y = enemy.y;
    args.damageGroup = this.enemyDamageGroup;
    args.enemyDamageGroup = this.damageGroup;
    args.platformGroup = this.platforms;
    args.enemyGroup = this.enemies;
    args.heroine = this.heroine;
    let e = undefined;
    
    switch(enemy.properties.class){
        case "soldier":
            e = new Soldier(this.game, args);
            break;
        case "mage":
            e = new EnemyMage(this.game, args);
            break;
        case "bat":
            e = new Bat(this.game, args);
            break;
    }

    this.game.add.existing(e);
    this.enemies.add(e);
};

PlayState.spawnCollectible = function(collectible){
    let args = {};
    args.x = collectible.x;
    args.y = collectible.y;
    args.heroine = this.heroine;
    let c = undefined;

    switch(collectible.properties.class){
        case "arcane":
            c = new Arcane(this.game, args);
            break;
        case "coin":
            c = new Coin(this.game, args);
            break;
        case "deadzone":
            c = new Deadzone(this.game, args);
            break;
        case "change":
            c = new Change(this.game, args);
            break;
        case "dash":
            c = new Dash(this.game, args);
            break;
        case "key":
            args.door = this.doors[collectible.properties.door];
            c = new Key(this.game, args);
            break;
        case "levelEnd":
            args.hitbox_width = collectible.width;
            args.hitbox_height = collectible.height;
            c = new LevelEnd(this.game, args);
            break;
    }
    if(c){
        this.game.add.existing(c);
        this.collectibles.add(c);
    }
};

PlayState.spawnOperable = function(operable){
    let args = {};
    args.x = operable.x;
    args.y = operable.y;
    args.heroine = this.heroine;
    args.hitbox_width = operable.width;
    args.hitbox_height = operable.height;
    let o = undefined;

    switch(operable.properties.class){
        case "door":
            args.target = {
                position : {
                    x : this.mapTargets[operable.properties.targetID].x,
                    y : this.mapTargets[operable.properties.targetID].y
                }
            };
            args.locked = operable.properties.locked == "true" ? true : false;
            o = new Door(this.game, args);
            this.doors[operable.name] = o;
            break;
        case "flightzone":
            o = new FlightZone(this.game, args);
            break;
        case "ladder":
            o = new Ladder(this.game, args);
            break;
        case "changeGate":
            args.h_type = operable.properties.h_type;
            o = new ChangeGate(this.game, args);
            break;
    }

    if(o){
        this.game.add.existing(o);
        this.operables.add(o);
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

//Status Change
PlayState.reverseGravity = function(){
    this.game.physics.arcade.gravity.y *= -1;
    this.heroine.currentHeroine.scale.y *= -1;
    this.heroine.backupHeroine.scale.y *= -1;

    let enems = this.enemies.getAll();
    for(var i=0;i<enems.length;++i){
        enems[i].scale.y *= -1;
    }
};