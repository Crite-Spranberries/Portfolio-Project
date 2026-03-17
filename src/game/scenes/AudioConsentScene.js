import Phaser from "phaser";
import { ensureBgmPlaying, setBgmMuted } from "../audio/bgm";
import { createTextButton } from "../ui/textButton";
import { attachYellowCursor } from "../cursor";

// 2) Audio permission scene: ask whether to enable sound
export default class AudioConsentScene extends Phaser.Scene {
  constructor() {
    super("AudioConsent");
  }

  create() {
    const { width, height } = this.scale;

    attachYellowCursor(this);

    this.add
      .rectangle(width / 2, height / 2, width * 0.9, height * 0.5, 0x000000, 0.85)
      .setStrokeStyle(2, 0xffffff, 0.4);

    this.add
      .text(width / 2, height / 2 - 60, "Enable audio?", {
        fontFamily: '"ArcadeClassic", system-ui, sans-serif',
        fontSize: "24px",
        color: "#ffffff",
      })
      .setOrigin(0.5);

    createTextButton(this, width / 2, height / 2, "Enable audio", () => {
      this.sound.unlock();
      this.sound.mute = false;
      this.registry.set("audioEnabled", true);
      setBgmMuted(false);
      try {
        ensureBgmPlaying(this);
      } catch (e) {
        console.error("Error starting BGM in Enable audio handler:", e);
      }
      this.scene.start("Menu");
    });

    createTextButton(this, width / 2, height / 2 + 40, "Play muted", () => {
      this.sound.unlock();
      this.sound.mute = true;
      this.registry.set("audioEnabled", false);
      try {
        setBgmMuted(true);
        ensureBgmPlaying(this);
      } catch (e) {
        console.error("Error starting BGM in Play muted handler:", e);
      }
      this.scene.start("Menu");
    });
  }
}

