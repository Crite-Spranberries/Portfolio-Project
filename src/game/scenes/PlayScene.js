import Phaser from "phaser";
import { createTextButton } from "../ui/textButton";
import {
  pauseBgm,
  playRetroRush,
  pauseRetroRush,
  ensureBgmPlaying,
} from "../audio/bgm";

// 4) Placeholder play scene: where the actual game will live
// When gameplay starts we:
// - Pause the menu background music
// - Start the \"Retro Rush\" track at the same user‑selected volume
// When leaving gameplay we:
// - Stop \"Retro Rush\"
// - Resume the normal background music on the menu
export default class PlayScene extends Phaser.Scene {
  constructor() {
    super("Play");
  }

  create() {
    const { width, height } = this.scale;

    // Swap to gameplay track at current volume
    pauseBgm();
    playRetroRush(this);

    this.add
      .text(width / 2, height / 2 - 20, "Gameplay goes here", {
        fontFamily: '"Epilogue", system-ui, sans-serif',
        fontSize: "24px",
        color: "#ffffff",
      })
      .setOrigin(0.5);

    createTextButton(
      this,
      width / 2,
      height / 2 + 40,
      "Back to Menu",
      () => {
        pauseRetroRush();
        ensureBgmPlaying(this.scene.get("Menu") || this);
        this.scene.start("Menu");
      },
      { fontSize: "18px" },
    );
  }
}

