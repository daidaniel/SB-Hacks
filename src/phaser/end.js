import Phaser, { Game } from "phaser";
import grassImg from "../assets/grass.png";
import overlayImg from "../assets/overlay.png";

var message = "";
var play;

class EndScene extends Phaser.Scene {
    constructor() {
        super("EndGame");
    }

    init(data) {
        this.message = data.message;
        this.player = data.player;
    }

    preload() {
        this.load.image("grass", grassImg);
        this.load.image("overlay", overlayImg);
    }

    create() {
        this.add.image(0, 0, "grass").setOrigin(0, 0);
        this.add.image(0, 0, "overlay").setOrigin(0, 0);
        message = this.add
            .text(640, 320, this.message, {
                fontFamily: "Roboto",
                fontWeight: 700,
                fontSize: "32px",
                fill: "#000",
            })
            .setOrigin(0.5, 0.5);

        if (this.player === 1) {
        } else if (this.player === 2) {
        } else {
        }

        play = this.add
            .text(640, 450, "RESTART")
            .setOrigin(0.5, 0.5)
            .setInteractive()
            .on("pointerup", () => {
                this.scene.start("PlayGame");
            });
    }
}

export default EndScene;
