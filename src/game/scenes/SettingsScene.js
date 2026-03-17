import Phaser from "phaser";
import { ensureBgmPlaying, setBgmMuted, setBgmVolume } from "../audio/bgm";
import { createTextButton } from "../ui/textButton";
import { attachYellowCursor } from "../cursor";

// 5) Settings scene
export default class SettingsScene extends Phaser.Scene {
  constructor() {
    super("Settings");
  }

  create() {
    const { width, height } = this.scale;

    attachYellowCursor(this);

    this.add
      .text(width / 2, height / 4, "Settings", {
        fontFamily: '"ArcadeClassic", system-ui, sans-serif',
        fontSize: "26px",
        color: "#ffffff",
      })
      .setOrigin(0.5);

    const audioEnabled = this.registry.get("audioEnabled");
    let bgmVolume = this.registry.get("bgmVolume");
    // Default all background music (menu + gameplay) to 40% volume.
    if (typeof bgmVolume !== "number") {
      bgmVolume = 0.4;
      this.registry.set("bgmVolume", bgmVolume);
    }

    const status = this.add
      .text(width / 2, height / 2 - 10, `Audio: ${audioEnabled ? "On" : "Muted"}`, {
        fontFamily: '"ArcadeClassic", system-ui, sans-serif',
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

    // Music volume controls:
    // Visual layout:  Volume  [====bar====]  -  +
    const volumeRowY = height / 2 + 70;

    const volumeLabel = this.add
      .text(width / 2 - 170, volumeRowY, "Volume", {
        fontFamily: '"ArcadeClassic", system-ui, sans-serif',
        fontSize: "18px",
        color: "#d0d0d0",
      })
      .setOrigin(0, 0.5);

    const barWidth = 160;
    const barHeight = 10;
    const barX = volumeLabel.x + volumeLabel.width + 16;

    // Background of the volume bar
    this.add
      .rectangle(barX + barWidth / 2, volumeRowY, barWidth, barHeight, 0x111111, 0.9)
      .setStrokeStyle(1, 0xffffff, 0.25);

    // Filled portion of the bar that visualizes the current volume
    const volumeFill = this.add
      .rectangle(barX, volumeRowY, barWidth * bgmVolume, barHeight, 0xffffff)
      .setOrigin(0, 0.5);

    // Numeric percentage shown under the bar for clarity while learning
    const volumePercentLabel = this.add
      .text(
        barX + barWidth / 2,
        volumeRowY + 18,
        `${(bgmVolume * 100).toFixed(0)}%`,
        {
          fontFamily: '"ArcadeClassic", system-ui, sans-serif',
          fontSize: "14px",
          color: "#b5b5b5",
        },
      )
      .setOrigin(0.5);

    const applyVolume = () => {
      this.registry.set("bgmVolume", bgmVolume);
      volumeFill.width = barWidth * bgmVolume;
      setBgmVolume(bgmVolume);
      volumePercentLabel.setText(`${(bgmVolume * 100).toFixed(0)}%`);
    };

    const volDown = createTextButton(
      this,
      barX + barWidth + 28,
      volumeRowY,
      "-",
      () => {
        bgmVolume = Phaser.Math.Clamp(bgmVolume - 0.1, 0, 1);
        applyVolume();
      },
      { fontSize: "18px" },
    );

    const volUp = createTextButton(
      this,
      barX + barWidth + 60,
      volumeRowY,
      "+",
      () => {
        bgmVolume = Phaser.Math.Clamp(bgmVolume + 0.1, 0, 1);
        applyVolume();
      },
      { fontSize: "18px" },
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
          fontFamily: '"ArcadeClassic", system-ui, sans-serif',
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

