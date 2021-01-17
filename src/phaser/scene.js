import Phaser, { Game } from "phaser";
import grassImg from "../assets/grass.png";
import groundImg from "../assets/platform.png";
import tpImg from "../assets/tp.png";
import bombImg from "../assets/bomb.png";
import dudeSprite from "../assets/dude.png";
import dude2Sprite from "../assets/dude2.png";
import cpuSprite from "../assets/cpu.png";
import houseImg from "../assets/house.png";
import house2Img from "../assets/house2.png";
import overlayImg from "../assets/overlay.png";
import musictodelight from "../assets/musictodelight.mp3";

var cpu = {
    name: "cpu",
    sprite: null,
    covid: true,
    tp: false,
    tpStatus: null,
    icon: null,
};
var cpu2 = {
    name: "cpu2",
    sprite: null,
    covid: true,
    tp: false,
    tpStatus: null,
    icon: null,
};
var cpu3 = {
    name: "cpu3",
    sprite: null,
    covid: true,
    tp: false,
    tpStatus: null,
    icon: null,
};
var cpu4 = {
    name: "cpu4",
    sprite: null,
    covid: true,
    tp: false,
    tpStatus: null,
    icon: null,
};
var player = {
    name: "player",
    sprite: null,
    covid: false,
    tp: false,
    tpStatus: null,
    icon: null,
    covidText: "",
    timedEvent: null,
    win: false,
};
var player2 = {
    name: "player2",
    sprite: null,
    covid: false,
    tp: false,
    tpStatus: null,
    icon: null,
    covidText: "",
    timedEvent: null,
    win: false,
};
var tp;
var platforms;
var cursors;
var house;
var house2;
var overlay;
var startText;
var timer;
var started = false;
let sfx;

const vel = 180;

function die(p) {
    p.disableBody(true, true);
}

function collectTP(p, tp) {
    tp.disableBody(false, true);
    if (p === player.sprite && player.tp === false) {
        player.tp = true;
    } else if (p === player2.sprite && player2.tp === false) {
        player2.tp = true;
    } else if (p === cpu.sprite && cpu.tp === false) {
        cpu.tp = true;
    } else if (p === cpu2.sprite && cpu2.tp === false) {
        cpu2.tp = true;
    } else if (p === cpu3.sprite && cpu3.tp === false) {
        cpu3.tp = true;
    } else {
        cpu4.tp = true;
    }
}

function getRandom(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

function collision(p1, p2) {
    const rand = getRandom(2) === 1;

    if (p1.covid != p2.covid && rand) {
        if (p1.covid) {
            p2.covid = true;
        } else if (p2.covid) {
            p1.covid = true;
        }
    }

    if (p1.tp || p2.tp) {
        if (p1.sprite.body.x > p2.sprite.body.x) {
            if (p1.sprite.body.x + 90 > 1220)
                tp.enableBody(
                    true,
                    p2.sprite.body.x - 90,
                    p1.sprite.body.y,
                    true,
                    true
                );
            else
                tp.enableBody(
                    true,
                    p1.sprite.body.x + 90,
                    p1.sprite.body.y,
                    true,
                    true
                );
        } else {
            if (p2.sprite.body.x + 90 > 1220)
                tp.enableBody(
                    true,
                    p1.sprite.body.x - 90,
                    p2.sprite.body.y,
                    true,
                    true
                );
            else
                tp.enableBody(
                    true,
                    p2.sprite.body.x + 90,
                    p2.sprite.body.y,
                    true,
                    true
                );
        }

        p1.tp ? (p1.tp = false) : (p2.tp = false);
    }
}

function checkWin(p) {
    if (p.tp) p.win = true;
}

function moveTP(tp, dir, val) {
    if (dir === "y") {
        tp.body.y += val;
    } else {
        tp.body.x += val;
    }
}

class playGame extends Phaser.Scene {
    constructor() {
        super("PlayGame");
    }
    preload() {
        this.load.image("grass", grassImg);
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
        this.load.spritesheet("cpu", cpuSprite, {
            frameWidth: 32,
            frameHeight: 32,
        });
        this.load.image("house", houseImg);
        this.load.image("house2", house2Img);
        this.load.image("overlay", overlayImg);
        this.load.audio("musictodelight", musictodelight);
    }
    create() {
        sfx = this.sound.add("musictodelight", {loop: true});
        sfx.play();
        this.scene.stop("menu");

        //background START
        this.add.image(0, 0, "grass").setOrigin(0, 0);
        //background END

        //level code START
        platforms = this.physics.add.staticGroup();

        //don't forget to set new hitboxes
        platforms.create(1280, 0, "ground").setScale(26, 3).refreshBody(); //top
        platforms.create(1280, 640, "ground").setScale(0.5, 13).refreshBody(); //right
        platforms.create(0, 640, "ground").setScale(26, 0.5).refreshBody(); //bottom
        platforms.create(0, 0, "ground").setScale(0.5, 13).refreshBody(); //left

        overlay = this.add.image(0, 0, "overlay").setOrigin(0, 0);

        //player code START
        player.sprite = this.physics.add
            .sprite(120, 580, "dude")
            .setInteractive();
        player.sprite.body.allowGravity = false;
        player.sprite.setCollideWorldBounds(true);
        player.sprite.body.setBounce(1);

        this.anims.create({
            key: "turn",
            frames: [{ key: "dude", frame: 0 }],
        });
        this.anims.create({
            key: "up",
            frames: [{ key: "dude", frame: 1 }],
        });
        this.anims.create({
            key: "upright",
            frames: [{ key: "dude", frame: 2 }],
        });
        this.anims.create({
            key: "right",
            frames: [{ key: "dude", frame: 3 }],
        });
        this.anims.create({
            key: "downright",
            frames: [{ key: "dude", frame: 4 }],
        });
        this.anims.create({
            key: "down",
            frames: [{ key: "dude", frame: 5 }],
        });
        this.anims.create({
            key: "downleft",
            frames: [{ key: "dude", frame: 6 }],
        });
        this.anims.create({
            key: "left",
            frames: [{ key: "dude", frame: 7 }],
        });
        this.anims.create({
            key: "upleft",
            frames: [{ key: "dude", frame: 8 }],
        });

        this.physics.add.collider(player.sprite, platforms);
        //player code END

        //level objects

        tp = this.physics.add.sprite(640, 185, "tp");
        tp.body.allowGravity = false;

        this.physics.add.overlap(player.sprite, tp, collectTP, null, this);

        player2.sprite = this.physics.add
            .sprite(1160, 580, "dude2")
            .setInteractive();
        player2.sprite.body.allowGravity = false;
        player2.sprite.setCollideWorldBounds(true);
        player2.sprite.body.setBounce(1);

        this.physics.add.collider(player2.sprite, platforms);

        this.anims.create({
            key: "turn2",
            frames: [{ key: "dude2", frame: 0 }],
        });
        this.anims.create({
            key: "up2",
            frames: [{ key: "dude2", frame: 1 }],
        });
        this.anims.create({
            key: "upright2",
            frames: [{ key: "dude2", frame: 2 }],
        });
        this.anims.create({
            key: "right2",
            frames: [{ key: "dude2", frame: 3 }],
        });
        this.anims.create({
            key: "downright2",
            frames: [{ key: "dude2", frame: 4 }],
        });
        this.anims.create({
            key: "down2",
            frames: [{ key: "dude2", frame: 5 }],
        });
        this.anims.create({
            key: "downleft2",
            frames: [{ key: "dude2", frame: 6 }],
        });
        this.anims.create({
            key: "left2",
            frames: [{ key: "dude2", frame: 7 }],
        });
        this.anims.create({
            key: "upleft2",
            frames: [{ key: "dude2", frame: 8 }],
        });

        this.physics.add.collider(player.sprite, player2.sprite, function () {
            collision(player, player2);
        });

        cpu.sprite = this.physics.add.sprite(100, 280, "cpu").setInteractive();
        cpu.sprite.body.allowGravity = false;
        cpu.sprite.setCollideWorldBounds(true);
        cpu.sprite.body.setBounce(1);
        cpu.sprite.setVelocityX(0);
        cpu.sprite.setVelocityY(0);

        this.physics.add.collider(player.sprite, cpu.sprite, function () {
            collision(player, cpu);
        });

        this.physics.add.collider(player2.sprite, cpu.sprite, function () {
            collision(player2, cpu);
        });

        this.physics.add.collider(cpu.sprite, platforms);

        cpu2.sprite = this.physics.add.sprite(360, 180, "cpu").setInteractive();
        cpu2.sprite.body.allowGravity = false;
        cpu2.sprite.setCollideWorldBounds(true);
        cpu2.sprite.body.setBounce(1);
        cpu2.sprite.setVelocityX(0);
        cpu2.sprite.setVelocityY(0);

        this.physics.add.collider(player.sprite, cpu2.sprite, function () {
            collision(player, cpu2);
        });

        this.physics.add.collider(player2.sprite, cpu2.sprite, function () {
            collision(player2, cpu2);
        });

        this.physics.add.collider(cpu2.sprite, platforms);

        cpu3.sprite = this.physics.add.sprite(920, 180, "cpu").setInteractive();
        cpu3.sprite.body.allowGravity = false;
        cpu3.sprite.setCollideWorldBounds(true);
        cpu3.sprite.body.setBounce(1);
        cpu3.sprite.setVelocityX(0);
        cpu3.sprite.setVelocityY(0);

        this.physics.add.collider(player.sprite, cpu3.sprite, function () {
            collision(player, cpu3);
        });

        this.physics.add.collider(player2.sprite, cpu3.sprite, function () {
            collision(player2, cpu3);
        });

        this.physics.add.collider(cpu3.sprite, platforms);

        cpu4.sprite = this.physics.add
            .sprite(1180, 280, "cpu")
            .setInteractive();
        cpu4.sprite.body.allowGravity = false;
        cpu4.sprite.setCollideWorldBounds(true);
        cpu4.sprite.body.setBounce(1);
        cpu4.sprite.setVelocityX(0);
        cpu4.sprite.setVelocityY(0);

        this.physics.add.collider(player.sprite, cpu4.sprite, function () {
            collision(player, cpu4);
        });

        this.physics.add.collider(player2.sprite, cpu4.sprite, function () {
            collision(player2, cpu4);
        });

        this.physics.add.collider(cpu4.sprite, platforms);

        this.physics.add.collider(cpu.sprite, cpu2.sprite, function () {
            collision(cpu, cpu2);
        });
        this.physics.add.collider(cpu.sprite, cpu3.sprite, function () {
            collision(cpu, cpu3);
        });
        this.physics.add.collider(cpu.sprite, cpu4.sprite, function () {
            collision(cpu, cpu4);
        });
        this.physics.add.collider(cpu2.sprite, cpu3.sprite, function () {
            collision(cpu2, cpu3);
        });
        this.physics.add.collider(cpu2.sprite, cpu4.sprite, function () {
            collision(cpu2, cpu4);
        });
        this.physics.add.collider(cpu3.sprite, cpu4.sprite, function () {
            collision(cpu3, cpu4);
        });

        this.physics.add.overlap(player2.sprite, tp, collectTP, null, this);
        this.physics.add.overlap(cpu.sprite, tp, collectTP, null, this);
        this.physics.add.overlap(cpu2.sprite, tp, collectTP, null, this);
        this.physics.add.overlap(cpu3.sprite, tp, collectTP, null, this);
        this.physics.add.overlap(cpu4.sprite, tp, collectTP, null, this);

        player.icon = this.add.image(50, 35, "dude").setOrigin(0, 0);
        player.tpStatus = this.add.image(90, 35, "tp").setOrigin(0, 0);
        player2.icon = this.add.image(50, 70, "dude2").setOrigin(0, 0);
        player2.tpStatus = this.add.image(90, 70, "tp").setOrigin(0, 0);
        cpu.icon = this.add.image(1198, 35, "cpu").setOrigin(0, 0);
        cpu.tpStatus = this.add.image(1158, 35, "tp").setOrigin(0, 0);
        cpu2.icon = this.add.image(1198, 70, "cpu").setOrigin(0, 0);
        cpu2.tpStatus = this.add.image(1158, 70, "tp").setOrigin(0, 0);

        cpu3.icon = this.add.image(1098, 35, "cpu").setOrigin(0, 0);
        cpu3.tpStatus = this.add.image(1058, 35, "tp").setOrigin(0, 0);
        cpu4.icon = this.add.image(1098, 70, "cpu").setOrigin(0, 0);
        cpu4.tpStatus = this.add.image(1058, 70, "tp").setOrigin(0, 0);

        player.covidText = this.add
            .text(135, 38, "", {
                fontFamily: "Roboto",
                fontWeight: 700,
                fontSize: "20px",
                fill: "#000",
            })
            .setOrigin(0, 0);
        player2.covidText = this.add
            .text(135, 73, "", {
                fontFamily: "Roboto",
                fontWeight: 700,
                fontSize: "20px",
                fill: "#000",
            })
            .setOrigin(0, 0);
        //level code END

        //houses code
        house = this.physics.add.sprite(200, 603, "house").setImmovable();
        this.physics.add.collider(house, player.sprite, function () {
            checkWin(player);
        });
        this.physics.add.collider(house, player2.sprite);
        this.physics.add.collider(house, cpu.sprite);
        this.physics.add.collider(house, cpu2.sprite);
        this.physics.add.collider(house, cpu3.sprite);
        this.physics.add.collider(house, cpu4.sprite);
        this.physics.add.overlap(
            house,
            tp,
            function () {
                moveTP(tp, "x", 50);
            },
            null,
            this
        );

        house2 = this.physics.add.sprite(1080, 603, "house2").setImmovable();
        this.physics.add.collider(house2, player2.sprite, function () {
            checkWin(player2);
        });
        this.physics.add.collider(house2, player.sprite);
        this.physics.add.collider(house2, cpu.sprite);
        this.physics.add.collider(house2, cpu2.sprite);
        this.physics.add.collider(house2, cpu3.sprite);
        this.physics.add.collider(house2, cpu4.sprite);
        this.physics.add.overlap(
            house2,
            tp,
            function () {
                moveTP(tp, "x", 50);
            },
            null,
            this
        );

        startText = this.add.text(640, 320, "", {
            fontFamily: "Roboto",
            fontWeight: 700,
            fontSize: "32px",
            fill: "#000",
        });

        timer = this.time.delayedCall(
            3000,
            function () {
                started = true;
            },
            [],
            this
        );
    }
    update() {
        if (!started) {
            startText.setText(
                (4 - 3 * timer.getProgress()).toString().substr(0, 1)
            );
        } else {
            //keyboard controls
            startText.setText("");
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

            if (cursors.w.isDown && cursors.d.isDown) {
                player.tp
                    ? player.sprite.setVelocityX(vel * 0.88)
                    : player.sprite.setVelocityX(vel);
                player.tp
                    ? player.sprite.setVelocityY(-vel * 0.88)
                    : player.sprite.setVelocityY(-vel);
                player.sprite.anims.play("upright", true);
            } else if (cursors.w.isDown && cursors.a.isDown) {
                player.tp
                    ? player.sprite.setVelocityX(-vel * 0.88)
                    : player.sprite.setVelocityX(-vel);
                player.tp
                    ? player.sprite.setVelocityY(-vel * 0.88)
                    : player.sprite.setVelocityY(-vel);
                player.sprite.anims.play("upleft", true);
            } else if (cursors.s.isDown && cursors.d.isDown) {
                player.tp
                    ? player.sprite.setVelocityX(vel * 0.88)
                    : player.sprite.setVelocityX(vel);
                player.tp
                    ? player.sprite.setVelocityY(vel * 0.88)
                    : player.sprite.setVelocityY(vel);
                player.sprite.anims.play("downright", true);
            } else if (cursors.s.isDown && cursors.a.isDown) {
                player.tp
                    ? player.sprite.setVelocityX(-vel * 0.88)
                    : player.sprite.setVelocityX(-vel);
                player.tp
                    ? player.sprite.setVelocityY(vel * 0.88)
                    : player.sprite.setVelocityY(vel);
                player.sprite.anims.play("downleft", true);
            } else if (cursors.w.isDown) {
                player.sprite.setVelocityX(0);
                player.tp
                    ? player.sprite.setVelocityY(-vel * 0.88)
                    : player.sprite.setVelocityY(-vel);
                player.sprite.anims.play("up", true);
            } else if (cursors.a.isDown) {
                player.tp
                    ? player.sprite.setVelocityX(-vel * 0.88)
                    : player.sprite.setVelocityX(-vel);
                player.sprite.setVelocityY(0);
                player.sprite.anims.play("left", true);
            } else if (cursors.s.isDown) {
                player.sprite.setVelocityX(0);
                player.tp
                    ? player.sprite.setVelocityY(vel * 0.88)
                    : player.sprite.setVelocityY(vel);
                player.sprite.anims.play("down", true);
            } else if (cursors.d.isDown) {
                player.tp
                    ? player.sprite.setVelocityX(vel * 0.88)
                    : player.sprite.setVelocityX(vel);
                player.sprite.setVelocityY(0);
                player.sprite.anims.play("right", true);
            } else {
                player.sprite.setVelocityX(0);
                player.sprite.setVelocityY(0);
                player.sprite.anims.play("turn");
            }

            if (cursors.up.isDown && cursors.right.isDown) {
                player2.tp
                    ? player2.sprite.setVelocityX(vel * 0.88)
                    : player2.sprite.setVelocityX(vel);
                player2.tp
                    ? player2.sprite.setVelocityY(-vel * 0.88)
                    : player2.sprite.setVelocityY(-vel);
                player2.sprite.anims.play("upright2", true);
            } else if (cursors.up.isDown && cursors.left.isDown) {
                player2.tp
                    ? player2.sprite.setVelocityX(-vel * 0.88)
                    : player2.sprite.setVelocityX(-vel);
                player2.tp
                    ? player2.sprite.setVelocityY(-vel * 0.88)
                    : player2.sprite.setVelocityY(-vel);
                player2.sprite.anims.play("upleft2", true);
            } else if (cursors.down.isDown && cursors.right.isDown) {
                player2.tp
                    ? player2.sprite.setVelocityX(vel * 0.88)
                    : player2.sprite.setVelocityX(vel);
                player2.tp
                    ? player2.sprite.setVelocityY(vel * 0.88)
                    : player2.sprite.setVelocityY(vel);
                player2.sprite.anims.play("downright2", true);
            } else if (cursors.down.isDown && cursors.left.isDown) {
                player2.tp
                    ? player2.sprite.setVelocityX(-vel * 0.88)
                    : player2.sprite.setVelocityX(-vel);
                player2.tp
                    ? player2.sprite.setVelocityY(vel * 0.88)
                    : player2.sprite.setVelocityY(vel);
                player2.sprite.anims.play("downleft2", true);
            } else if (cursors.up.isDown) {
                player2.sprite.setVelocityX(0);
                player2.tp
                    ? player2.sprite.setVelocityY(-vel * 0.88)
                    : player2.sprite.setVelocityY(-vel);
                player2.sprite.anims.play("up2", true);
            } else if (cursors.left.isDown) {
                player2.tp
                    ? player2.sprite.setVelocityX(-vel * 0.88)
                    : player2.sprite.setVelocityX(-vel);
                player2.sprite.setVelocityY(0);
                player2.sprite.anims.play("left2", true);
            } else if (cursors.down.isDown) {
                player2.sprite.setVelocityX(0);
                player2.tp
                    ? player2.sprite.setVelocityY(vel * 0.88)
                    : player2.sprite.setVelocityY(vel);
                player2.sprite.anims.play("down2", true);
            } else if (cursors.right.isDown) {
                player2.tp
                    ? player2.sprite.setVelocityX(vel * 0.88)
                    : player2.sprite.setVelocityX(vel);
                player2.sprite.setVelocityY(0);
                player2.sprite.anims.play("right2", true);
            } else {
                player2.sprite.setVelocityX(0);
                player2.sprite.setVelocityY(0);
                player2.sprite.anims.play("turn2");
            }

            if (player.covid) {
                if (!player.timedEvent) {
                    player.timedEvent = this.time.delayedCall(
                        30000,
                        die,
                        [player.sprite],
                        this
                    );
                }
                if (30 * player.timedEvent.getProgress() < 20) {
                    player.covidText.setText(
                        "You got COVID! Time until death: " +
                            (30 - 30 * player.timedEvent.getProgress())
                                .toString()
                                .substr(0, 4)
                    );
                } else if (player.timedEvent.getProgress() === 1) {
                    player.covidText.setText("You died. :(");
                    player.dead = true;
                    player.sprite.disableBody(true, true);
                } else {
                    player.covidText.setText(
                        "You got COVID! Time until death: " +
                            (30 - 30 * player.timedEvent.getProgress())
                                .toString()
                                .substr(0, 3)
                    );
                }
            }

            if (player.dead) {
                player.icon.setTexture("dude", 9);
                if (player.tp) {
                    tp.enableBody(
                        true,
                        player.sprite.body.x,
                        player.sprite.body.y,
                        true,
                        true
                    );
                    player.tp = false;
                }
            }

            if (player2.covid) {
                if (!player2.timedEvent) {
                    player2.timedEvent = this.time.delayedCall(
                        30000,
                        die,
                        [player2.sprite],
                        this
                    );
                }
                if (30 * player2.timedEvent.getProgress() < 20) {
                    player2.covidText.setText(
                        "You got COVID! Time until death: " +
                            (30 - 30 * player2.timedEvent.getProgress())
                                .toString()
                                .substr(0, 4)
                    );
                } else if (player2.timedEvent.getProgress() === 1) {
                    player2.covidText.setText("You died. :(");
                    player2.dead = true;
                    player2.sprite.disableBody(true, true);
                } else {
                    player2.covidText.setText(
                        "You got COVID! Time until death: " +
                            (30 - 30 * player2.timedEvent.getProgress())
                                .toString()
                                .substr(0, 3)
                    );
                }
            }

            if (player2.dead) {
                player2.icon.setTexture("dude2", 9);
                if (player2.tp) {
                    tp.enableBody(
                        true,
                        player2.sprite.body.x,
                        player2.sprite.body.y,
                        true,
                        true
                    );
                    player2.tp = false;
                }
            }

            if (player.win) {
                //display winscreen
                this.scene.launch("EndGame", {
                    message: "Player 1 Wins!",
                    player: 1,
                });
                sfx.stop();
                started = false;
                player.win = false;
                player.tp = false;
                player.covid = false;
                player.timedEvent = null;
                player.dead = false;
                player2.covid = false;
                player2.timedEvent = null;
                player2.dead = false;
                cpu.tp = false;
                cpu2.tp = false;
                cpu3.tp = false;
                cpu4.tp = false;
            }
            if (player2.win) {
                //display winscreen
                this.scene.launch("EndGame", {
                    message: "Player 2 Wins!",
                    player: 2,
                });
                sfx.stop();
                started = false;
                player2.win = false;
                player2.tp = false;
                player.covid = false;
                player.timedEvent = null;
                player.dead = false;
                player2.covid = false;
                player2.timedEvent = null;
                player2.dead = false;
                cpu.tp = false;
                cpu2.tp = false;
                cpu3.tp = false;
                cpu4.tp = false;
            }

            if (player.dead && player2.dead) {
                this.scene.launch("EndGame", {
                    message: "Everyone died :(",
                    player: 0,
                });
                sfx.stop();
                started = false;
                player.win = false;
                player2.win = false;
                player2.tp = false;
                player.covid = false;
                player.timedEvent = null;
                player.dead = false;
                player2.covid = false;
                player2.timedEvent = null;
                player2.dead = false;
                cpu.tp = false;
                cpu2.tp = false;
                cpu3.tp = false;
                cpu4.tp = false;
            }

            if (cpu.sprite.body.velocity.x === 0) {
                cpu.sprite.setVelocityX(vel * 1.1);
            }
            if (cpu.sprite.body.velocity.y === 0) {
                cpu.sprite.setVelocityY(vel * 1.1);
            }
            if (cpu2.sprite.body.velocity.x === 0) {
                cpu2.sprite.setVelocityX(vel * 1.1);
            }
            if (cpu2.sprite.body.velocity.y === 0) {
                cpu2.sprite.setVelocityY(-vel * 1.1);
            }
            if (cpu3.sprite.body.velocity.x === 0) {
                cpu3.sprite.setVelocityX(-vel * 1.1);
            }
            if (cpu3.sprite.body.velocity.y === 0) {
                cpu3.sprite.setVelocityY(-vel * 1.1);
            }
            if (cpu4.sprite.body.velocity.x === 0) {
                cpu4.sprite.setVelocityX(-vel * 1.1);
            }
            if (cpu4.sprite.body.velocity.y === 0) {
                cpu4.sprite.setVelocityY(vel * 1.1);
            }

            if (tp.body.y < 150) {
                tp.body.y += 20;
            }
            if (tp.body.y > 620) {
                tp.body.y -= 20;
            }
        }
        if (player.tp) {
            player.tpStatus.visible = true;
        } else {
            player.tpStatus.visible = false;
        }
        if (player2.tp) {
            player2.tpStatus.visible = true;
        } else {
            player2.tpStatus.visible = false;
        }
        if (cpu.tp) {
            cpu.tpStatus.visible = true;
        } else {
            cpu.tpStatus.visible = false;
        }
        if (cpu2.tp) {
            cpu2.tpStatus.visible = true;
        } else {
            cpu2.tpStatus.visible = false;
        }
        if (cpu3.tp) {
            cpu3.tpStatus.visible = true;
        } else {
            cpu3.tpStatus.visible = false;
        }
        if (cpu4.tp) {
            cpu4.tpStatus.visible = true;
        } else {
            cpu4.tpStatus.visible = false;
        }
    }
}

export default playGame;
