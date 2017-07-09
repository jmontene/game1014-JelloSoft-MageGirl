function DualHeroine(game, args){
    //Basics
    Phaser.Sprite.call(this, game, args.x, args.y, null);
    this.anchor.set(0.5,0.5);

    //Heroines
    this.heroineA = args.heroine_A;
    this.heroineB = args.heroine_B;
    this.currentHeroine = this.heroineA;
    this.game.add.existing(this.heroineA);
    this.game.add.existing(this.heroineB);
    this.heroineB.exists = false;
    this.heroineB.enabled = false;
    this.heroineA.onDeath.add(this.die, this);
    this.heroineB.onDeath.add(this.die, this);

    //Stats
    this.hp = this.currentHeroine.hp;
    this.maxHP = this.currentHeroine.maxHP;

    //Items
    this.coins = 0;
    this.heroineA.onCoinPickup.add(function(){
        this.coins += 1;
    },this);
    this.heroineB.onCoinPickup.add(function(){
        this.coins += 1;
    },this);

    //Keys
    this.keys = args.keys;

    //UI
    this.uiManager = args.uiManager;

    //Events
    this.onSwitch = new Phaser.Signal();
    this.onSwitch.add(this.switch, this);
    this.teleportTimer = this.game.time.create(false);

    //State
    this.inputEnabled = true;
};

DualHeroine.prototype = Object.create(Phaser.Sprite.prototype);
DualHeroine.prototype.constructor = DualHeroine;

DualHeroine.prototype.update = function(){
    this.game.debug.body(this.currentHeroine);
    this.position.x = this.currentHeroine.position.x;
    this.position.y = this.currentHeroine.position.y;
    this.hp = this.currentHeroine.hp;
    if(this.inputEnabled){
        this.handleInput();
    }
};

DualHeroine.prototype.handleInput = function(){
    if(this.keys.switch.justDown){
        this.onSwitch.dispatch();
    }
};

DualHeroine.prototype.switch = function(){
    this.currentHeroine.exists = false;
    this.currentHeroine.enabled = false;
    if(this.currentHeroine === this.heroineA){
        this.currentHeroine = this.heroineB;
        this.heroineB.body.velocity = this.heroineA.body.velocity;
    }else{
        this.currentHeroine = this.heroineA;
        this.heroineA.body.velocity = this.heroineB.body.velocity;
    }
    this.currentHeroine.exists = true;
    this.currentHeroine.enabled = true;
    this.currentHeroine.position.x = this.position.x;
    this.currentHeroine.position.y = this.position.y;
    this.maxHP = this.currentHeroine.maxHP;

    this.uiManager.lifebar.changeTint(this.currentHeroine.uiTint);
    this.uiManager.lifebar.setBack(this.currentHeroine.uiBack);
};

DualHeroine.prototype.die = function(){
    this.game.camera.fade();
};

DualHeroine.prototype.setJumpEnabled = function(enabled){
    this.heroineA.setJumpEnabled(enabled);
    this.heroineB.setJumpEnabled(enabled);
}

DualHeroine.prototype.teleportTo = function(x, y){
    this.currentHeroine.inputEnabled = false;
    this.inputEnabled = false;
    this.currentHeroine.dir.x = 0;
    this.game.camera.onFadeComplete.add(function(){
        this.currentHeroine.x = x;
        this.currentHeroine.y = y;
        this.currentHeroine.inputEnabled = true;
        this.inputEnabled = true;
        this.game.camera.focusOn(this.currentHeroine);
        this.game.camera.flash(0x000000, 1000);
    },this);
    this.game.camera.fade(0x000000, 1000);
}