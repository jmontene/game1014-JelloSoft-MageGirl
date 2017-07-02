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
    this.heroineA.velocity = this.heroineB.velocity;
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
};

DualHeroine.prototype = Object.create(Phaser.Sprite.prototype);
DualHeroine.prototype.constructor = DualHeroine;

DualHeroine.prototype.update = function(){
    this.position.x = this.currentHeroine.position.x;
    this.position.y = this.currentHeroine.position.y;
    this.hp = this.currentHeroine.hp;
    if(this.keys.switch.justDown){
        this.onSwitch.dispatch();
    }
};

DualHeroine.prototype.switch = function(){
    this.currentHeroine.exists = false;
    this.currentHeroine.enabled = false;
    if(this.currentHeroine === this.heroineA){
        this.currentHeroine = this.heroineB;
        this.heroineB.velocity = this.heroineA.velocity;
    }else{
        this.currentHeroine = this.heroineA;
        this.heroineA.velocity = this.heroineB.velocity;
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