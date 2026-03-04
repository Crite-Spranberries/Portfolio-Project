import Phaser from "phaser";
import { createTextButton } from "../ui/textButton";
import { ensureBgmPlaying } from "../audio/bgm";

// 3) Main menu scene: Start / Settings / Credits
export default class MenuScene extends Phaser.Scene {
  constructor() {
    super("Menu");
  }

  create() {
    const { width, height } = this.scale;

    this.add.rectangle(width / 2, height / 2, width, height, 0x000000, 0.6);

    this.add
      .text(width / 2, height / 4, "[Placeholder Title]", {
        fontFamily: '"Epilogue", system-ui, sans-serif',
        fontSize: "32px",
        color: "#ffffff",
      })
      .setOrigin(0.5);

    createTextButton(this, width / 2, height / 2 - 20, "Start", () => {
      this.scene.start("Play");
    });

    createTextButton(this, width / 2, height / 2 + 20, "Settings", () => {
      this.scene.start("Settings");
    });

    createTextButton(this, width / 2, height / 2 + 60, "Credits", () => {
      this.scene.start("Credits");
    });

    // Try to (re)start background music when arriving at the menu.
    // If it fails, the game still runs normally.
    try {
      ensureBgmPlaying(this);
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error("Error starting BGM in MenuScene:", e);
    }
  }
}
