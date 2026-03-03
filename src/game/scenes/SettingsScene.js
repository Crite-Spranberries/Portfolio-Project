import Phaser from "phaser";
import { ensureBgmPlaying, setBgmMuted, setBgmVolume } from "../audio/bgm";
import { createTextButton } from "../ui/textButton";

// 5) Settings scene
export default class SettingsScene extends Phaser.Scene {
  constructor() {
    super("Settings");
  }

  create() {
    const { width, height } = this.scale;

    this.add
      .text(width / 2, height / 4, "Settings", {
        fontFamily: '"Epilogue", system-ui, sans-serif',
        fontSize: "26px",
        color: "#ffffff",
      })
      .setOrigin(0.5);

    const audioEnabled = this.registry.get("audioEnabled");
    let bgmVolume = this.registry.get("bgmVolume");
    if (typeof bgmVolume !== "number") {
      bgmVolume = 0.6;
      this.registry.set("bgmVolume", bgmVolume);
    }

    const status = this.add
      .text(width / 2, height / 2 - 10, `Audio: ${audioEnabled ? "On" : "Muted"}`, {
        fontFamily: '"Epilogue", system-ui, sans-serif',
        fontSize: "18px",
        color: "#d0d0d0",
      })
      .setOrigin(0.5);

    const toggle = createTextButton(
      this,
      width / 2,
      height / 2 + 20,
      "Toggle audio",
      () => {
        const currentlyOn = this.registry.get("audioEnabled");
        const next = !currentlyOn;
        this.registry.set("audioEnabled", next);
        // Also control our HTMLAudio-based BGM
        setBgmMuted(!next);
        status.setText(`Audio: ${next ? "On" : "Muted"}`);

        if (next) {
          ensureBgmPlaying(this);
        }
      },
      { fontSize: "18px" },
    );

    // Music volume controls
    const volumeLabel = this.add
      .text(
        width / 2,
        height / 2 + 60,
        `Music volume: ${(bgmVolume * 100).toFixed(0)}%`,
        {
          fontFamily: '"Epilogue", system-ui, sans-serif',
          fontSize: "18px",
          color: "#d0d0d0",
        },
      )
      .setOrigin(0.5);

    const applyVolume = () => {
      this.registry.set("bgmVolume", bgmVolume);
      volumeLabel.setText(`Music volume: ${(bgmVolume * 100).toFixed(0)}%`);
      setBgmVolume(bgmVolume);
    };

    const volDown = createTextButton(
      this,
      width / 2 - 80,
      height / 2 + 90,
      "- Volume",
      () => {
        bgmVolume = Phaser.Math.Clamp(bgmVolume - 0.1, 0, 1);
        applyVolume();
      },
      { fontSize: "16px" },
    );

    const volUp = createTextButton(
      this,
      width / 2 + 80,
      height / 2 + 90,
      "+ Volume",
      () => {
        bgmVolume = Phaser.Math.Clamp(bgmVolume + 0.1, 0, 1);
        applyVolume();
      },
      { fontSize: "16px" },
    );

    // Back to menu
    createTextButton(
      this,
      width / 2,
      height - 60,
      "Back to Menu",
      () => this.scene.start("Menu"),
      { fontSize: "18px" },
    );

    // Simple on-screen debug so you can see audio state while learning.
    const debugText = this.add
      .text(
        12,
        12,
        `Muted: ${!audioEnabled}\n(BGM managed via HTMLAudioElement)`,
        {
          fontFamily: '"Epilogue", system-ui, sans-serif',
          fontSize: "12px",
          color: "#888888",
          align: "left",
        },
      )
      .setOrigin(0, 0);

    // Update debug text whenever we change audio settings in this scene
    const refreshDebug = () => {
      const enabled = this.registry.get("audioEnabled");
      debugText.setText(`Muted: ${!enabled}\n(BGM managed via HTMLAudioElement)`);
    };

    // Hook debug refresh into our local controls
    toggle.on("pointerup", refreshDebug);
    volDown.on("pointerup", refreshDebug);
    volUp.on("pointerup", refreshDebug);
  }
}

