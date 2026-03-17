import Phaser from "phaser";
import { createTextButton } from "../ui/textButton";
import { pauseBgm, playRetroRush, pauseRetroRush } from "../audio/bgm";

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

    // Swap away from menu music; actual gameplay track starts
    // after the 3-2-1-GO countdown completes.
    pauseBgm();

    // Pause button at the top center of the viewport.
    createTextButton(
      this,
      width / 2,
      32,
      "Pause",
      () => {
        // Launch pause overlay and pause this scene's update loop.
        this.scene.launch("Pause");
        this.scene.pause();
      },
      { fontSize: "18px" },
    );

    // HUD placeholder in the top‑right corner:
    // three small icons (lives) and one larger icon (character face).
    const hudY = 40;
    const largeRadius = 26;
    const smallRadius = 12;
    const rightMargin = 32;

    // Big icon (Spike's face placeholder)
    this.add
      .circle(width - rightMargin, hudY, largeRadius, 0x7fdc7f)
      .setStrokeStyle(2, 0xffffff, 0.8);

    // Three smaller icons to the left of the big one (spaceships / lives)
    const spacing = 2 * smallRadius + 6;
    for (let i = 0; i < 3; i += 1) {
      const x = width - rightMargin - largeRadius - 16 - i * spacing;
      this.add
        .circle(x, hudY, smallRadius, 0x7fdc7f)
        .setStrokeStyle(1.5, 0xffffff, 0.8);
    }

    this.add
      .text(width - rightMargin, hudY - largeRadius - 16, "Spike's face", {
        fontFamily: '"Epilogue", system-ui, sans-serif',
        fontSize: "14px",
        color: "#ffffff",
      })
      .setOrigin(1, 1);

    this.add
      .text(width - rightMargin - largeRadius - 16, hudY + largeRadius + 6, "Spaceships (Lives)", {
        fontFamily: '"Epilogue", system-ui, sans-serif',
        fontSize: "12px",
        color: "#b5b5b5",
      })
      .setOrigin(1, 0);

    // Placeholder text for the gameplay area itself.
    this.add
      .text(width / 2, height / 2, "Gameplay goes here", {
        fontFamily: '"Epilogue", system-ui, sans-serif',
        fontSize: "24px",
        color: "#ffffff",
      })
      .setOrigin(0.5);

    // When entering gameplay, show a 3-2-1-GO countdown overlay before
    // the player starts interacting.
    this.scene.launch("Countdown");
  }
}

