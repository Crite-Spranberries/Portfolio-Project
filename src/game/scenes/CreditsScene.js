import Phaser from "phaser";
import { createTextButton } from "../ui/textButton";

// 6) Credits scene
export default class CreditsScene extends Phaser.Scene {
  constructor() {
    super("Credits");
  }

  create() {
    const { width, height } = this.scale;

    this.add
      .text(width / 2, height / 4, "Credits", {
        fontFamily: '"Epilogue", system-ui, sans-serif',
        fontSize: "26px",
        color: "#ffffff",
      })
      .setOrigin(0.5);

    this.add
      .text(width / 2, height / 2, "Design & Code: You\nInspired by Cowboy Bebop", {
        fontFamily: '"Epilogue", system-ui, sans-serif',
        fontSize: "18px",
        color: "#d0d0d0",
        align: "center",
      })
      .setOrigin(0.5);

    createTextButton(
      this,
      width / 2,
      height - 60,
      "Back to Menu",
      () => this.scene.start("Menu"),
      { fontSize: "18px" },
    );
  }
}

