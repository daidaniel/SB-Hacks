import Phaser from "phaser";
import React from "react";
import ReactDOM from "react-dom";
import App from "./components/App.jsx";
import playGame from "./phaser/scene";

//console.log(App);

export const config = {
  type: Phaser.AUTO,
  parent: "phaser",
  width: 1280,
  height: 640,
  scene: playGame,
  physics: {
    default: 'arcade',
    arcade: {
        gravity: { y: 300 },
        debug: false
    }
  },
};

const game = new Phaser.Game(config);

ReactDOM.render(
  document.getElementById("root") || document.createElement("div")
);
