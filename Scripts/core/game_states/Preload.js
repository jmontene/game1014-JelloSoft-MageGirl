Preload = {};

Preload.assetFolder = "Assets/";

Preload.preload = function(){
    this.preloadFont = this.game.add.retroFont('ui:font:basic', 32, 32,"ABCDEFGHIJKLMNOPQRSTUVWXYZ.!?()123456789",10);
    this.preloadFont.text = "LOADING...";
    this.message = this.game.make.image(this.game.world.centerX - 150, this.game.world.centerY - 40, this.preloadFont);
    this.game.add.existing(this.message);

    //Load Game Assets
    //Level Data
    this.game.load.json('level:forest', this.assetFolder + 'data/firstPlayable.json');
    this.load.tilemap('level:castle', this.assetFolder + '/data/levels/castle.json', null, Phaser.Tilemap.TILED_JSON);
    this.load.image('tileset:castle', this.assetFolder + '/images/tiles/castle/tileset.png');

    //Animation Data
    this.game.load.json('statemachine:animations:heroine', this.assetFolder + 'data/state_machines/animations/heroine.json');
    this.game.load.json('statemachine:animations:mage', this.assetFolder + 'data/state_machines/animations/mage.json');
    this.game.load.json('statemachine:animations:melee', this.assetFolder + 'data/state_machines/animations/melee.json');

    //AI Data
    this.game.load.json('statemachine:ai:soldier', this.assetFolder + 'data/state_machines/ai/soldier.json');
    
    //Background
    this.game.load.image('bg:castle', this.assetFolder + 'images/backgrounds/castle.png');

    //UI Elements
    this.game.load.image('ui:texts:title', this.assetFolder + 'images/ui/texts/title.png');
    this.game.load.image('ui:texts:game_over', this.assetFolder + 'images/ui/texts/game_over.png');
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
    this.game.load.atlas('sprite:heroine:mage', this.assetFolder + 'images/sprites/heroine/mage.png', this.assetFolder + 'data/atlases/mage_girl.json');
    this.game.load.atlas('sprite:heroine:sword', this.assetFolder + 'images/sprites/heroine/sword.png', this.assetFolder + 'data/atlases/sword_girl.json');

    //Enemy Sprites
    this.game.load.image('sprite:enemy:soldier', this.assetFolder + 'images/sprites/enemies/soldier.png');
    this.game.load.image('sprite:enemy:mage', this.assetFolder + 'images/sprites/enemies/mage.png');
    this.game.load.image('sprite:enemy:bat', this.assetFolder + 'images/sprites/enemies/bat.png');

    //Bullet Sprites
    this.game.load.image('sprite:bullet:energy_ball', this.assetFolder + 'images/sprites/bullets/energy_ball.png');
    this.game.load.image('sprite:bullet:enemy_energy_ball', this.assetFolder + 'images/sprites/bullets/enemy_energy_ball.png');

    //Melee Sprites
    this.game.load.atlas('sprite:melee:slash', this.assetFolder + 'images/sprites/melee/slash_shockwave.png', this.assetFolder + 'data/atlases/sword_shockwave.json');
    this.game.load.atlas('sprite:melee:enemy_slash', this.assetFolder + 'images/sprites/melee/slash_shockwave_enemy.png', this.assetFolder + 'data/atlases/sword_shockwave.json');

    //Collectible Sprites
    this.game.load.image('sprite:collectible:arcane', this.assetFolder + 'images/sprites/collectibles/levitate.png');
    this.game.load.spritesheet('sprite:collectible:coin', this.assetFolder + 'images/sprites/collectibles/coin.png',22,22);

    //Operable Sprites
    this.game.load.image('sprite:operable:door', this.assetFolder + 'images/sprites/operables/door.png');

    //Fonts
    this.game.load.image('ui:font:numbers', this.assetFolder + 'images/ui/fonts/numbers.png');

    //BGM
    this.game.load.audio('bgm:title', this.assetFolder + 'audio/bgm/title.mp3');
    this.game.load.audio('bgm:castle', this.assetFolder + 'audio/bgm/castle.mp3');
    this.game.load.audio('bgm:game_over', this.assetFolder + 'audio/bgm/game_over.mp3');

    //SFX
    this.game.load.audio('sfx:coin', this.assetFolder + 'audio/sfx/coin.wav');
    this.game.load.audio('sfx:hover', this.assetFolder + 'audio/sfx/hover.wav');
    this.game.load.audio('sfx:select', this.assetFolder + 'audio/sfx/select.wav');
};

Preload.create = function(){
    this.game.state.start("MainMenu");
};