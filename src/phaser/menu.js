import Phaser, { Game } from "phaser";
import overlayImg from "../assets/overlay.png";
import grassImg from "../assets/grass.png";
import playImg from "../assets/play.png";

var play;

class menu extends Phaser.Scene {
    constructor() {
        super("menu");
    }

    preload() {
        this.load.image("grass", grassImg);
        this.load.image("menu", overlayImg);
        this.load.image("play", playImg);
    }
    create() {
        this.add.image(0, 0, "grass").setOrigin(0, 0);
        this.add.image(0, 0, "menu").setOrigin(0, 0);

        play = this.add
            .image(640, 400, "play")
            .setOrigin(0.5, 0.5)
            .setInteractive()
            .on("pointerup", () => {
                this.scene.launch("PlayGame");
            });
    }
}

export default menu;
