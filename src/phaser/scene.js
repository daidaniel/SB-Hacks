import Phaser from "phaser";
import skyImg from "../assets/sky.png";
import groundImg from "../assets/platform.png";
import starImg from "../assets/star.png";
import bombImg from "../assets/bomb.png";
import dudeSprite from "../assets/dude.png";

var player;
var star;
var platforms;
var cursors;

function collectStar (player, star)
{
    star.disableBody(true, true);
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
            frameHeight: 48,
        });
    }
    create() {
        //background START
        this.add.image(0, 0, "sky").setOrigin(0, 0);
        //background END

        //level code START
        platforms = this.physics.add.staticGroup();

        platforms.create(400, 568, "ground").setScale(2).refreshBody();

        platforms.create(600, 400, "ground");
        platforms.create(50, 250, "ground");
        platforms.create(750, 220, "ground");

        //player code START
        player = this.physics.add.sprite(100, 450, "dude");
        player.setBounce(0.2);
        player.setCollideWorldBounds(true);

        this.anims.create({
            key: "left",
            frames: this.anims.generateFrameNumbers("dude", {
                start: 0,
                end: 3,
            }),
            frameRate: 10,
            repeat: -1,
        });

        this.anims.create({
            key: "turn",
            frames: [{ key: "dude", frame: 4 }],
            frameRate: 20,
        });

        this.anims.create({
            key: "right",
            frames: this.anims.generateFrameNumbers("dude", {
                start: 5,
                end: 8,
            }),
            frameRate: 10,
            repeat: -1,
        });

        this.physics.add.collider(player, platforms);
        //player code END

        //level objects
        star = this.physics.add.sprite(600, 150, "star");

        star.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));

        this.physics.add.collider(star, platforms);
        this.physics.add.overlap(player, star, collectStar, null, this);
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
        
        if (cursors.left.isDown || cursors.a.isDown) {
            player.setVelocityX(-160);

            player.anims.play("left", true);
        } else if (cursors.right.isDown || cursors.d.isDown) {
            player.setVelocityX(160);

            player.anims.play("right", true);
        } else {
            player.setVelocityX(0);

            player.anims.play("turn");
        }

        if ((cursors.up.isDown || cursors.w.isDown) && player.body.touching.down) {
            player.setVelocityY(-330);
        }
    }
}

export default playGame;
