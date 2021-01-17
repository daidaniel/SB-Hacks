import Phaser, { Game } from "phaser";
import overlayImg from "../assets/overlay.png";
import grassImg from "../assets/grass.png";

var play;

class menu extends Phaser.Scene {
    constructor() {
        super("menu");
    }

    preload() {
        this.load.image("grass", grassImg);
        this.load.image("menu", overlayImg);
    }
    create() {
        this.add.image(0, 0, "grass").setOrigin(0, 0);
        this.add.image(0, 0, "menu").setOrigin(0, 0);

        play = this.add
            .text(640, 400, "PLAY")
            .setOrigin(0.5, 0.5)
            .setInteractive()
            .on("pointerup", () => {
                this.scene.launch("PlayGame");
            });
    }
}

export default menu;
