import Phaser from "phaser";
import { createTextButton } from "../ui/textButton";

// 4) Placeholder play scene: where the actual game will live
export default class PlayScene extends Phaser.Scene {
  constructor() {
    super("Play");
  }

  create() {
    const { width, height } = this.scale;

    this.add
      .text(width / 2, height / 2 - 20, "Gameplay goes here", {
        fontFamily: '"Epilogue", system-ui, sans-serif',
        fontSize: "24px",
        color: "#ffffff",
      })
      .setOrigin(0.5);

    createTextButton(this, width / 2, height / 2 + 40, "Back to Menu", () => {
      this.scene.start("Menu");
    }, { fontSize: "18px" });
  }
}

