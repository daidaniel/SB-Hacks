import Phaser from "phaser";
import React from "react";
import ReactDOM from "react-dom";
import App from "./components/App.jsx";
import endScene from "./phaser/end"; 
import playGame from "./phaser/scene";
import menu from "./phaser/menu";


//console.log(App);

export const config = {
  type: Phaser.AUTO,
  parent: "phaser",
  width: 1280,
  height: 640,
  scene: [menu, playGame, endScene],
  physics: {
    default: 'arcade',
    arcade: {
        debug: false
    }
  },
  antialias: false,
  pixelArt: true,
};

const game = new Phaser.Game(config);

ReactDOM.render(
  document.getElementById("root") || document.createElement("div")
);
