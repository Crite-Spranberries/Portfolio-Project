import Phaser from "phaser";
import { createTextButton } from "../ui/textButton";
import { pauseBgm, playRetroRush, pauseRetroRush } from "../audio/bgm";
import { attachYellowCursor } from "../cursor";

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
    this.cursor = null;
    this.cursorTarget = null;
    this.playerLastRotation = 0;
  }

  handlePointerMove(pointer) {
    const { width, height } = this.scale;

    // cursor.js already keeps the yellow cursor in sync with the pointer.
    // Here we just remember where the ship should be trying to move toward.
    const x = Phaser.Math.Clamp(pointer.x, 0, width);
    const y = Phaser.Math.Clamp(pointer.y, 0, height);
    if (!this.cursorTarget) {
      this.cursorTarget = new Phaser.Math.Vector2(x, y);
    } else {
      this.cursorTarget.set(x, y);
    }
  }

  startRun() {
    const { width, height } = this.scale;

    if (!this.player) {
      // Simple triangle placeholder for the player ship.
      this.player = this.add
        .triangle(width / 2, height / 2, 0, -24, -18, 18, 18, 18, 0xffffff)
        .setOrigin(0.5);

      this.playerLastPos = new Phaser.Math.Vector2(this.player.x, this.player.y);
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

    // Attach shared yellow cursor used across all scenes.
    this.cursor = attachYellowCursor(this);
    this.cursorTarget = new Phaser.Math.Vector2(width / 2, height / 2);
    this.input.on("pointermove", this.handlePointerMove, this);

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
    // the player and ship start interacting.
    this.scene.launch("Countdown");
  }

  update(time, delta) {
    if (!this.runActive || !this.player || !this.cursorTarget) return;

    const prevX = this.player.x;
    const prevY = this.player.y;

    // Smoothly slide toward the cursor target so it feels a bit physics-based.
    const lerpFactor = 0.12 * (delta / 16.67);
    const nx = Phaser.Math.Linear(prevX, this.cursorTarget.x, Phaser.Math.Clamp(lerpFactor, 0, 1));
    const ny = Phaser.Math.Linear(prevY, this.cursorTarget.y, Phaser.Math.Clamp(lerpFactor, 0, 1));

    this.player.setPosition(nx, ny);

    const dx = nx - prevX;
    const dy = ny - prevY;
    if (dx !== 0 || dy !== 0) {
      const angle = Phaser.Math.Angle.Between(prevX, prevY, nx, ny);
      this.player.rotation = angle + Math.PI / 2;
      this.playerLastRotation = this.player.rotation;
      if (this.playerLastPos) {
        this.playerLastPos.set(nx, ny);
      }
    } else if (this.playerLastRotation !== undefined) {
      this.player.rotation = this.playerLastRotation;
    }
  }
}

