import Phaser from "phaser";
import { createTextButton } from "../ui/textButton";
import { restartBgm, ensureBgmPlaying } from "../audio/bgm";
import { beginGameSession } from "../session";
import { attachYellowCursor } from "../cursor";

// 3) Main menu scene: Start / Settings / Credits
export default class MenuScene extends Phaser.Scene {
  constructor() {
    super("Menu");
  }

  create() {
    const { width, height } = this.scale;

    attachYellowCursor(this);

    this.add.rectangle(width / 2, height / 2, width, height, 0x000000, 0.6);

    this.add
      .text(width / 2, height / 4, "Swordfish Skirmish", {
        fontFamily: '"Bytebounce", system-ui, sans-serif',
        fontSize: "32px",
        color: "#ffffff",
      })
      .setOrigin(0.5);

    createTextButton(this, width / 2, height / 2 - 20, "Start", () => {
      // Begin a new arcade-style run. Later we can hook score saving,
      // difficulty, etc. off this session metadata.
      beginGameSession(this);
      this.scene.start("Play");
    });

    createTextButton(this, width / 2, height / 2 + 20, "Settings", () => {
      this.scene.start("Settings");
    });

    createTextButton(this, width / 2, height / 2 + 60, "Credits", () => {
      this.scene.start("Credits");
    });

    // If we arrived here from the gameplay scene, restart the menu BGM
    // from the beginning. For other menu pages (Settings, Credits, etc.),
    // keep the current playback position and just ensure it's running.
    const fromPlay = this.registry.get("fromPlay");
    try {
      if (fromPlay) {
        restartBgm(this);
      } else {
        ensureBgmPlaying(this);
      }
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error("Error starting BGM in MenuScene:", e);
    }
    this.registry.set("fromPlay", false);
  }
}
