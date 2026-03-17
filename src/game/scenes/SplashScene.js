import Phaser from "phaser";
import { attachYellowCursor } from "../cursor";

// 1) Splash scene: handles loading and shows a progress bar
export default class SplashScene extends Phaser.Scene {
  constructor() {
    super("Splash");
    this.failedFiles = [];
  }

  preload() {
    const { width, height } = this.scale;

    // Reset any previous failures (defensive)
    this.failedFiles = [];

    // Progress bar graphics
    const barWidth = Math.min(width * 0.5, 400);
    const barHeight = 20;
    const x = width / 2 - barWidth / 2;
    const y = height / 2;

    const border = this.add.rectangle(
      width / 2,
      y,
      barWidth + 4,
      barHeight + 4,
      0x000000,
      0.6,
    );
    border.setStrokeStyle(2, 0xffffff, 0.8);

    const progressBar = this.add.rectangle(
      x,
      y,
      0,
      barHeight,
      0xffffff,
    );
    progressBar.setOrigin(0, 0.5);

    this.add
      .text(width / 2, y - 40, "Loading...", {
        fontFamily: '"Epilogue", system-ui, sans-serif',
        fontSize: "20px",
        color: "#ffffff",
      })
      .setOrigin(0.5);

    // Hook loader progress to the bar
    this.load.on("progress", (value) => {
      progressBar.width = barWidth * value;
    });

    // Track any asset load failures so we can surface them on the splash screen
    this.load.on("loaderror", (file) => {
      if (file && file.key) {
        this.failedFiles.push(file.key);
      }
    });

    // Load game assets here. BGM is played via our own HTMLAudioElement in bgm.js,
    // so we don't load it through Phaser (avoids device/codec errors and conflicts).
    // Tiny dummy image so the progress bar has something to track.
    this.load.image(
      "dummy",
      "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAEklEQVR4nGNgYGD4zwABBgEAAT9Hq2sAAAAASUVORK5CYII=",
    );

    // Placeholder player ship sprite for the gameplay scene.
    this.load.image(
      "galaga-sample",
      new URL("../../assets/bebop/sprites/galaga_sample.png", import.meta.url).href,
    );

    // Placeholder projectile sprite for the gameplay scene.
    this.load.image(
      "galaga-bullet",
      new URL("../../assets/bebop/sprites/galaga_bulletsample.png", import.meta.url).href,
    );
  }

  create() {
    // Set a default BGM volume the first time the game boots (40%).
    if (typeof this.registry.get("bgmVolume") !== "number") {
      this.registry.set("bgmVolume", 0.4);
    }

    const { width, height } = this.scale;

    attachYellowCursor(this);

    // If any assets failed to load, surface a small warning list in the bottom-left
    if (this.failedFiles && this.failedFiles.length > 0) {
      const header = this.add
        .text(16, height - 24 - this.failedFiles.length * 18, "Issues loading assets:", {
          fontFamily: '"Epilogue", system-ui, sans-serif',
          fontSize: "14px",
          color: "#ff6666",
        })
        .setOrigin(0, 0.5);

      let y = header.y + 20;
      this.failedFiles.forEach((key) => {
        this.add
          .text(16, y, `• ${key}`, {
            fontFamily: '"Epilogue", system-ui, sans-serif',
            fontSize: "12px",
            color: "#ff6666",
          })
          .setOrigin(0, 0.5);
        y += 16;
      });
    }

    // Once "loaded", go to the audio permission scene.
    // If there were failures, linger a bit longer so the warnings are visible.
    const delayMs = this.failedFiles && this.failedFiles.length > 0 ? 1400 : 400;
    this.time.delayedCall(delayMs, () => {
      this.scene.start("AudioConsent");
    });
  }
}

