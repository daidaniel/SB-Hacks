import Phaser from "phaser";
import skyImg from "../assets/sky.png";
import groundImg from "../assets/platform.png";
import starImg from "../assets/star.png";
import bombImg from "../assets/bomb.png";
import dudeSprite from "../assets/dude.png";

var player = {
    sprite: null,
    covid: false,
    handsan: false,
    tp: false,
    dead: false,
};
var bot = {
    sprite: null,
    covid: true,
    handsan: false,
    tp: false,
    dead: false,
};
var star;
var platforms;
var cursors;
var noDir;

const vel = 180;

function collectStar(player, star) {
    star.disableBody(true, true);
    
    //player.tp = true;
}

function collision(p1, p2) {
    if(p1.covid === true) {

    }
    else if(p2.covid === true) {

    }
}

class playGame extends Phaser.Scene {
    constructor() {
        super("PlayGame");
    }
    preload() {
        this.load.image("sky", skyImg);
        this.load.image("ground", groundImg);
        this.load.image("star", starImg);
        this.load.image("bomb", bombImg);
        this.load.spritesheet("dude", dudeSprite, {
            frameWidth: 32,
            frameHeight: 32,
        });
    }
    create() {
        //background START
        this.add.image(0, 0, "sky").setOrigin(0, 0);
        //background END

        //level code START
        platforms = this.physics.add.staticGroup();

        //don't forget to set new hitboxes
        platforms.create(1280, 0, "ground").setScale(0.25,3).refreshBody();
        platforms.create(1280, 640, "ground").setScale(0.25,3).refreshBody();
        platforms.create(0, 640, "ground").setScale(0.25,3).refreshBody();
        platforms.create(0, 0, "ground").setScale(0.25,3).refreshBody();

        //player code START
        player.sprite = this.physics.add.sprite(100, 450, "dude");
        player.sprite.body.allowGravity = false;
        player.sprite.setCollideWorldBounds(true);
        player.sprite.body.pushable = false;
        
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

        star = this.physics.add.sprite(600, 150, "star");
        star.body.allowGravity = false;

        this.physics.add.collider(star, platforms);
        this.physics.add.overlap(player.sprite, star, collectStar, null, this);

        bot.sprite = this.physics.add.sprite(500, 450, "dude");
        bot.sprite.body.allowGravity = false;
        bot.sprite.setCollideWorldBounds(true);
        bot.sprite.body.setBounceX(0.1);
        bot.sprite.body.setBounceY(0.1);
        bot.sprite.body.pushable = false;

        this.physics.add.collider(bot.sprite, player.sprite);
        this.physics.add.collider(bot.sprite, star);
        this.physics.add.overlap(bot.sprite, player.sprite, collision, null, this);
        this.physics.add.overlap(bot.sprite, star, collectStar, null, this);
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

        noDir = true;

        if (cursors.up.isDown || cursors.w.isDown) {
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
        }
    }
}

export default playGame;
