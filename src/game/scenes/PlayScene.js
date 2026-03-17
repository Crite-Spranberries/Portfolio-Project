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
    this.player = null;
    this.playerLastPos = null;
    this.runActive = false;
  }

  startRun() {
    const { width, height } = this.scale;

    if (!this.player) {
      // Simple triangle placeholder for the player ship.
      this.player = this.add
        .triangle(width / 2, height / 2, 0, -24, -18, 18, 18, 18, 0xffffff)
        .setOrigin(0.5);

      this.playerLastPos = new Phaser.Math.Vector2(this.player.x, this.player.y);

      // Pointer movement controls: player follows the cursor and rotates so
      // the triangle tip points in the direction of movement.
      this.input.on("pointermove", (pointer) => {
        if (!this.runActive || !this.player) return;

        const x = Phaser.Math.Clamp(pointer.x, 0, width);
        const y = Phaser.Math.Clamp(pointer.y, 0, height);

        const last = this.playerLastPos || new Phaser.Math.Vector2(this.player.x, this.player.y);
        const dx = x - last.x;
        const dy = y - last.y;

        if (dx !== 0 || dy !== 0) {
          const angle = Phaser.Math.Angle.Between(last.x, last.y, x, y);
          // Triangle is defined pointing up (-Y); rotate so the tip faces movement.
          this.player.rotation = angle + Math.PI / 2;
          this.playerLastPos.set(x, y);
        }

        this.player.setPosition(x, y);
      });
    } else {
      this.player.setPosition(width / 2, height / 2);
      this.playerLastPos.set(width / 2, height / 2);
    }

    this.runActive = true;
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
    // three small icons (lives) and one larger icon (player avatar).
    const hudY = 40;
    const largeRadius = 26;
    const smallRadius = 12;
    const rightMargin = 32;

    // Big icon (player avatar placeholder)
    this.add
      .circle(width - rightMargin, hudY, largeRadius, 0xffffff)
      .setStrokeStyle(2, 0xffffff, 0.8);

    // Three smaller icons to the left of the big one (spaceships / lives)
    const spacing = 2 * smallRadius + 6;
    for (let i = 0; i < 3; i += 1) {
      const x = width - rightMargin - largeRadius - 16 - i * spacing;
      this.add
        .circle(x, hudY, smallRadius, 0xffffff)
        .setStrokeStyle(1.5, 0xffffff, 0.8);
    }

    this.add
      .text(width - rightMargin, hudY - largeRadius - 16, "Spike's face", {
        fontFamily: '"Epilogue", system-ui, sans-serif',
        fontSize: "14px",
        color: "#ffffff",
      })
      .setOrigin(1, 1);

    // When entering gameplay, show a 3-2-1-GO countdown overlay before
    // the player starts interacting.
    this.scene.launch("Countdown");
  }
}

