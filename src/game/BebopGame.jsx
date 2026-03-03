import { useEffect, useRef } from "react";
import Phaser from "phaser";

// Helper so all Bebop game assets live under src/assets/bebop/**
// Usage example:
//   this.load.image("menu-bg", bebopAsset("images/menu-bg.png"));
//   this.load.audio("click", bebopAsset("audio/sfx/click.wav"));
const bebopAsset = (subpath) =>
  new URL(`../assets/bebop/${subpath}`, import.meta.url).href;

// 1) Splash scene: handles (fake) loading and shows a progress bar
class SplashScene extends Phaser.Scene {
  constructor() {
    super("Splash");
  }

  preload() {
    const { width, height } = this.scale;

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

    // For now we don't have real assets in src/assets/bebop yet, so we keep a tiny dummy file.
    // Once you add real files, swap this out for something like:
    //
    //   this.load.image("splash-bg", bebopAsset("images/splash-bg.png"));
    //   this.load.image("player", bebopAsset("sprites/player.png"));
    //   this.load.audio("main-theme", bebopAsset("audio/music/main-theme.ogg"));
    //
    this.load.image(
      "dummy",
      "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAEklEQVR4nGNgYGD4zwABBgEAAT9Hq2sAAAAASUVORK5CYII=",
    );
  }

  create() {
    // Once "loaded", go to the audio permission scene
    this.time.delayedCall(400, () => {
      this.scene.start("AudioConsent");
    });
  }
}

// 2) Audio permission scene: ask whether to enable sound
class AudioConsentScene extends Phaser.Scene {
  constructor() {
    super("AudioConsent");
  }

  create() {
    const { width, height } = this.scale;

    this.add
      .rectangle(width / 2, height / 2, width * 0.9, height * 0.5, 0x000000, 0.85)
      .setStrokeStyle(2, 0xffffff, 0.4);

    this.add
      .text(width / 2, height / 2 - 60, "Enable audio?", {
        fontFamily: '"Epilogue", system-ui, sans-serif',
        fontSize: "24px",
        color: "#ffffff",
      })
      .setOrigin(0.5);

    const makeButton = (label, y, onClick) => {
      const text = this.add
        .text(width / 2, y, label, {
          fontFamily: '"Epilogue", system-ui, sans-serif',
          fontSize: "20px",
          color: "#ffffff",
        })
        .setOrigin(0.5)
        .setInteractive({ useHandCursor: true });

      text.on("pointerover", () => text.setAlpha(0.8));
      text.on("pointerout", () => text.setAlpha(1));
      text.on("pointerup", onClick);
      return text;
    };

    makeButton("Enable audio", height / 2, () => {
      this.sound.mute = false;
      this.registry.set("audioEnabled", true);
      this.scene.start("Menu");
    });

    makeButton("Play muted", height / 2 + 40, () => {
      this.sound.mute = true;
      this.registry.set("audioEnabled", false);
      this.scene.start("Menu");
    });
  }
}

// 3) Main menu scene: Start / Settings / Credits
class MenuScene extends Phaser.Scene {
  constructor() {
    super("Menu");
  }

  create() {
    const { width, height } = this.scale;

    this.add.rectangle(width / 2, height / 2, width, height, 0x000000, 0.6);

    this.add
      .text(width / 2, height / 4, "Bebop Fan Game", {
        fontFamily: '"Epilogue", system-ui, sans-serif',
        fontSize: "32px",
        color: "#ffffff",
      })
      .setOrigin(0.5);

    const makeButton = (label, y, onClick) => {
      const text = this.add
        .text(width / 2, y, label, {
          fontFamily: '"Epilogue", system-ui, sans-serif',
          fontSize: "22px",
          color: "#ffffff",
        })
        .setOrigin(0.5)
        .setInteractive({ useHandCursor: true });

      text.on("pointerover", () => text.setAlpha(0.8));
      text.on("pointerout", () => text.setAlpha(1));
      text.on("pointerup", onClick);
      return text;
    };

    makeButton("Start", height / 2 - 20, () => {
      this.scene.start("Play");
    });

    makeButton("Settings", height / 2 + 20, () => {
      this.scene.start("Settings");
    });

    makeButton("Credits", height / 2 + 60, () => {
      this.scene.start("Credits");
    });
  }
}

// 4) Placeholder play scene: where the actual game will live
class PlayScene extends Phaser.Scene {
  constructor() {
    super("Play");
  }

  create() {
    const { width, height } = this.scale;

    this.add
      .text(width / 2, height / 2 - 20, "Gameplay goes here", {
        fontFamily: '"Epilogue", system-ui, sans-serif',
        fontSize: "24px",
        color: "#ffffff",
      })
      .setOrigin(0.5);

    const back = this.add
      .text(width / 2, height / 2 + 40, "Back to Menu", {
        fontFamily: '"Epilogue", system-ui, sans-serif',
        fontSize: "18px",
        color: "#ffffff",
      })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true });

    back.on("pointerover", () => back.setAlpha(0.8));
    back.on("pointerout", () => back.setAlpha(1));
    back.on("pointerup", () => {
      this.scene.start("Menu");
    });
  }
}

// 5) Settings scene
class SettingsScene extends Phaser.Scene {
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

    const status = this.add
      .text(width / 2, height / 2 - 10, `Audio: ${audioEnabled ? "On" : "Muted"}`, {
        fontFamily: '"Epilogue", system-ui, sans-serif',
        fontSize: "18px",
        color: "#d0d0d0",
      })
      .setOrigin(0.5);

    const toggle = this.add
      .text(width / 2, height / 2 + 30, "Toggle audio", {
        fontFamily: '"Epilogue", system-ui, sans-serif',
        fontSize: "18px",
        color: "#ffffff",
      })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true });

    toggle.on("pointerover", () => toggle.setAlpha(0.8));
    toggle.on("pointerout", () => toggle.setAlpha(1));
    toggle.on("pointerup", () => {
      const currentlyOn = this.registry.get("audioEnabled");
      const next = !currentlyOn;
      this.registry.set("audioEnabled", next);
      this.sound.mute = !next;
      status.setText(`Audio: ${next ? "On" : "Muted"}`);
    });

    const back = this.add
      .text(width / 2, height - 60, "Back to Menu", {
        fontFamily: '"Epilogue", system-ui, sans-serif',
        fontSize: "18px",
        color: "#ffffff",
      })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true });

    back.on("pointerover", () => back.setAlpha(0.8));
    back.on("pointerout", () => back.setAlpha(1));
    back.on("pointerup", () => {
      this.scene.start("Menu");
    });
  }
}

// 6) Credits scene
class CreditsScene extends Phaser.Scene {
  constructor() {
    super("Credits");
  }

  create() {
    const { width, height } = this.scale;

    this.add
      .text(width / 2, height / 4, "Credits", {
        fontFamily: '"Epilogue", system-ui, sans-serif',
        fontSize: "26px",
        color: "#ffffff",
      })
      .setOrigin(0.5);

    this.add
      .text(width / 2, height / 2, "Design & Code: You\nInspired by Cowboy Bebop", {
        fontFamily: '"Epilogue", system-ui, sans-serif',
        fontSize: "18px",
        color: "#d0d0d0",
        align: "center",
      })
      .setOrigin(0.5);

    const back = this.add
      .text(width / 2, height - 60, "Back to Menu", {
        fontFamily: '"Epilogue", system-ui, sans-serif',
        fontSize: "18px",
        color: "#ffffff",
      })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true });

    back.on("pointerover", () => back.setAlpha(0.8));
    back.on("pointerout", () => back.setAlpha(1));
    back.on("pointerup", () => {
      this.scene.start("Menu");
    });
  }
}

function BebopGame() {
  const containerRef = useRef(null);
  const gameRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current || gameRef.current) return;

    const config = {
      type: Phaser.AUTO,
      width: 960,
      height: 540,
      parent: containerRef.current,
      backgroundColor: "#000000",
      scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
      },
      scene: [SplashScene, AudioConsentScene, MenuScene, PlayScene, SettingsScene, CreditsScene],
      physics: {
        default: "arcade",
        arcade: {
          gravity: { y: 0 },
        },
      },
    };

    const game = new Phaser.Game(config);
    gameRef.current = game;

    return () => {
      game.destroy(true);
      gameRef.current = null;
    };
  }, []);

  return <div ref={containerRef} className="bebop-game-root" />;
}

export default BebopGame;

