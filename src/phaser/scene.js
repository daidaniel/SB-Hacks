import Phaser, { Game } from "phaser";
import skyImg from "../assets/sky.png";
import groundImg from "../assets/platform.png";
import tpImg from "../assets/tp.png";
import bombImg from "../assets/bomb.png";
import dudeSprite from "../assets/dude.png";
import dude2Sprite from "../assets/dude2.png";

var player = {
    name: 'player',
    sprite: null,
    covid: false,
    handsan: false,
    tp: false,
    dead: false,
    collide: false,
    scoreText: '',
    covidText: '',
    timedEvent: null,
};
var bot = {
    name: 'bot',
    sprite: null,
    covid: true,
    handsan: false,
    tp: false,
    dead: false,
    collide: false,
    scoreText: '',
    covidText: '',
    timedEvent: null,
};
var tp;
var platforms;
var cursors;
var noDir;
var bnoDir;

const vel = 180;
const accel = 200;


function die(p) {
    p.disableBody(true, true);
}

function collectTP(p, tp) {
    tp.disableBody(true, true);
    if (p === player.sprite && player.tp == false){
        player.tp = true;
        player.scoreText.setText(player.name + ': ' + player.tp);
    }
    else{
        bot.tp = true; 
        bot.scoreText.setText(bot.name + ': ' + bot.tp); 
    }
}

function getRandom(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

function collision(p1, p2) {
    const rand = getRandom(20) === 1;
    
    if (p1.covid != p2.covid && rand) {
        if (p1.covid === true) {
            p2.covid = true;
            console.log(p2.covid);
        } else if (p2.covid === true) {
            p1.covid = true;
            console.log(p1.covid);
        }
    }
}

class playGame extends Phaser.Scene {
    constructor() {
        super("PlayGame");
    }
    preload() {
        this.load.image("sky", skyImg);
        this.load.image("ground", groundImg);
        this.load.image("tp", tpImg);
        this.load.image("bomb", bombImg);
        this.load.spritesheet("dude", dudeSprite, {
            frameWidth: 32,
            frameHeight: 32,
        });
        this.load.spritesheet("dude2", dude2Sprite, {
            frameWidth: 32,
            frameHeight: 32,
        });
    }
    create() {
        //background tpT
        this.add.image(0, 0, "sky").setOrigin(0, 0);
        //background END

        //level code tpT
        platforms = this.physics.add.staticGroup();

        //don't forget to set new hitboxes
        platforms.create(1280, 0, "ground").setScale(26, 0.5).refreshBody(); //top
        platforms.create(1280, 640, "ground").setScale(0.5, 13).refreshBody(); //right
        platforms.create(0, 640, "ground").setScale(26, 0.5).refreshBody(); //bottom
        platforms.create(0, 0, "ground").setScale(0.5, 13).refreshBody(); //left

        //player code tpT
        player.sprite = this.physics.add.sprite(100, 450, "dude").setInteractive();
        player.sprite.body.allowGravity = false;
        player.sprite.setCollideWorldBounds(true);
        player.sprite.body.setBounce(0.5);
        
        this.anims.create({
            key: "turn",
            frames: [{ key: "dude", frame: 0 }],
        });
        
        this.anims.create({
            key: "up",
            frames: [{ key: "dude", frame: 1 }],
        });

        this.anims.create({
            key: "down",
            frames: [{ key: "dude", frame: 2 }],
        });
        
        this.anims.create({
            key: "left",
            frames: [{ key: "dude", frame: 3 }],
        });

        this.anims.create({
            key: "right",
            frames: [{ key: "dude", frame: 4 }],
        });

        this.physics.add.collider(player.sprite, platforms);
        //player code END

        //level objects

        tp = this.physics.add.sprite(600, 150, "tp");
        tp.body.allowGravity = false;

        this.physics.add.overlap(player.sprite, tp, collectTP, null, this);

        bot.sprite = this.physics.add.sprite(500, 450, "dude2").setInteractive();
        bot.sprite.body.allowGravity = false;
        bot.sprite.setCollideWorldBounds(true);
        bot.sprite.body.setBounce(0.5);

        this.physics.add.collider(bot.sprite, platforms);

        this.anims.create({
            key: "turn2",
            frames: [{ key: "dude2", frame: 0 }],
        });
        
        this.anims.create({
            key: "up2",
            frames: [{ key: "dude2", frame: 1 }],
        });

        this.anims.create({
            key: "down2",
            frames: [{ key: "dude2", frame: 2 }],
        });
        
        this.anims.create({
            key: "left2",
            frames: [{ key: "dude2", frame: 3 }],
        });

        this.anims.create({
            key: "right2",
            frames: [{ key: "dude2", frame: 4 }],
        });

        this.physics.add.collider(
            player.sprite,
            bot.sprite,
            function ()
            {
                collision(player, bot);
            });

        this.physics.add.overlap(bot.sprite, tp, collectTP, null, this);

        player.scoreText = this.add.text(30, 35, 'player: initial', {fontFamily: 'Roboto', fontSize: '32px', fill: '#000'});
        bot.scoreText = this.add.text(30, 70, 'bot: initial', {fontFamily: 'Roboto', fontSize: '32px', fill: '#000'});

        player.covidText = this.add.text(250, 35, '', {fontFamily: 'Roboto', fontSize: '32px', fill: '#000'});
        bot.covidText = this.add.text(250, 70, '', {fontFamily: 'Roboto', fontSize: '32px', fill: '#000'});
        //level code END
    }
    update() {
        //keyboard controls
        cursors = this.input.keyboard.createCursorKeys();
        cursors = this.input.keyboard.addKeys({
            w: Phaser.Input.Keyboard.KeyCodes.W,
            s: Phaser.Input.Keyboard.KeyCodes.S,
            a: Phaser.Input.Keyboard.KeyCodes.A,
            d: Phaser.Input.Keyboard.KeyCodes.D,
            up: Phaser.Input.Keyboard.KeyCodes.UP,
            down: Phaser.Input.Keyboard.KeyCodes.DOWN,
            left: Phaser.Input.Keyboard.KeyCodes.LEFT,
            right: Phaser.Input.Keyboard.KeyCodes.RIGHT,
        });

        bnoDir = true;
        noDir = true;

        if (cursors.up.isDown) {
            bot.sprite.setVelocityY(-vel);
            bot.sprite.anims.play("up2", true);
            bnoDir = false;
        }
        else if (cursors.down.isDown) {
            bot.sprite.setVelocityY(vel);
            bot.sprite.anims.play("down2", true);
            bnoDir = false;
        }
        else {
            bot.sprite.setVelocityY(0);
        }

        if (cursors.left.isDown) {
            bot.sprite.setVelocityX(-vel);
            bot.sprite.anims.play("left2", true);
            bnoDir = false;
        }
        else if (cursors.right.isDown) {
            bot.sprite.setVelocityX(vel);
            bot.sprite.anims.play("right2", true);
            bnoDir = false;
        }
        else {
            bot.sprite.setVelocityX(0);
        }

        if (bnoDir) {
            bot.sprite.anims.play("turn2");
        }

        if (cursors.w.isDown) {
            player.sprite.setVelocityY(-vel);
            player.sprite.anims.play("up", true);
            noDir = false;
        }
        else if (cursors.s.isDown) {
            player.sprite.setVelocityY(vel);
            player.sprite.anims.play("down", true);
            noDir = false;
        }
        else {
            player.sprite.setVelocityY(0);
        }

        if (cursors.a.isDown) {
            player.sprite.setVelocityX(-vel);
            player.sprite.anims.play("left", true);
            noDir = false;
        }
        else if (cursors.d.isDown) {
            player.sprite.setVelocityX(vel);
            player.sprite.anims.play("right", true);
            noDir = false;
        }
        else {
            player.sprite.setVelocityX(0);
        }

        if (noDir) {
            player.sprite.anims.play("turn");
        }

        /*if (cursors.up.isDown || cursors.w.isDown) {
            player.sprite.setVelocityY(-vel);
            player.sprite.anims.play("up", true);
            noDir = false;
        }
        else if (cursors.down.isDown || cursors.s.isDown) {
            player.sprite.setVelocityY(vel);
            player.sprite.anims.play("down", true);
            noDir = false;
        }

        if (cursors.left.isDown || cursors.a.isDown) {
            player.sprite.setVelocityX(-vel);
            player.sprite.anims.play("left", true);
            noDir = false;
        }
        else if (cursors.right.isDown || cursors.d.isDown) {
            player.sprite.setVelocityX(vel);
            player.sprite.anims.play("right", true);
            noDir = false;
        }

        if (noDir) {
            player.sprite.setVelocityX(0);
            player.sprite.setVelocityY(0);
            player.sprite.anims.play("turn");
        }*/

        if(player.covid) {
            if(!player.timedEvent) {
                player.timedEvent = this.time.delayedCall(30000, die, [player.sprite], this);
            }
            player.covidText.setText('covid timer: ' + (30 - (30 *player.timedEvent.getProgress())).toString().substr(0, 4));
        }
        
        if(bot.covid) {
            if(!bot.timedEvent) {
                bot.timedEvent = this.time.delayedCall(30000, die, [bot.sprite], this);
            }
            bot.covidText.setText('covid timer: ' + (30 - (30 *bot.timedEvent.getProgress())).toString().substr(0, 4));
        }
    }
}

export default playGame;
