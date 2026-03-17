import Phaser from "phaser";
import { playRetroRush, resumeRetroRush } from "../audio/bgm";

// Simple 3-2-1-GO countdown overlay.
// Usage:
// - From PlayScene when starting gameplay: this.scene.launch("Countdown");
// - From PauseScene when resuming: this.scene.launch("Countdown", { fromPause: true });
// When the countdown finishes:
// - Starts the gameplay music (Retro Rush) at the current volume
// - If fromPause is true, PlayScene is resumed.
// - The overlay scene stops itself.
export default class CountdownScene extends Phaser.Scene {
  constructor() {
    super("Countdown");
  }

  init(data) {
    this.fromPause = !!data.fromPause;
  }

  create() {
    const { width, height } = this.scale;

    // Darken the gameplay background.
    this.add
      .rectangle(width / 2, height / 2, width, height, 0x000000, 0.7)
      .setScrollFactor(0);

    const label = this.add
      .text(width / 2, height / 2, "", {
        fontFamily: '"Epilogue", system-ui, sans-serif',
        fontSize: "48px",
        color: "#ffffff",
      })
      .setOrigin(0.5);

    const steps = ["3", "2", "1", "GO!"];
    let index = 0;
    label.setText(steps[index]);

    this.time.addEvent({
      delay: 1000,
      repeat: steps.length - 1,
      callback: () => {
        index += 1;
        label.setText(steps[index]);

        if (index === steps.length - 1) {
          // After showing GO!, give a short moment then:
          // - start or resume gameplay music at the selected volume
          // - resume PlayScene if we came from Pause
          // - clear this overlay
          this.time.delayedCall(500, () => {
            const playScene = this.scene.get("Play");
            if (this.fromPause) {
              // Coming back from Pause: continue from previous playback position.
              resumeRetroRush(playScene);
              this.scene.resume("Play");
            } else {
              // First time entering gameplay: start the Retro Rush track from the top.
              playRetroRush(playScene);
            }
            if (playScene && typeof playScene.startRun === "function") {
              playScene.startRun();
            }
            this.scene.stop();
          });
        }
      },
    });
  }
}

