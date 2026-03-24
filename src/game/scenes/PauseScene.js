import Phaser from "phaser";
import { createTextButton } from "../ui/textButton";
import { pauseRetroRush } from "../audio/bgm";
import { endGameSession } from "../session";
import { attachYellowCursor } from "../cursor";

// Lightweight overlay scene shown on top of PlayScene when the user hits Pause.
// While this scene is active, gameplay music is paused; the Countdown scene
// is responsible for resuming it when the player comes back.
export default class PauseScene extends Phaser.Scene {
  constructor() {
    super("Pause");
  }

  create() {
    const { width, height } = this.scale;

    // As soon as we enter the pause screen, pause the gameplay track.
    pauseRetroRush();

    // Dim the gameplay behind the pause modal.
    this.add
      .rectangle(width / 2, height / 2, width, height, 0x000000, 0.6)
      .setScrollFactor(0);

    // Keep the custom yellow cursor active while paused so the pointer
    // still feels responsive even though the Play scene is frozen.
    attachYellowCursor(this);

    this.add
      .text(width / 2, height / 2 - 60, "Paused", {
        fontFamily: '"Bytebounce", system-ui, sans-serif',
        fontSize: "28px",
        color: "#ffffff",
      })
      .setOrigin(0.5);

    // Resume button: close this overlay and run a short countdown before
    // letting PlayScene continue.
    createTextButton(
      this,
      width / 2,
      height / 2,
      "Resume",
      () => {
        this.scene.stop(); // stop Pause
        this.scene.launch("Countdown", { fromPause: true });
      },
      { fontSize: "18px" },
    );

    // Back to Menu: mark that we are leaving gameplay, stop PlayScene,
    // and return to the menu. MenuScene decides how to handle BGM.
    createTextButton(
      this,
      width / 2,
      height / 2 + 40,
      "Back to Menu",
      () => {
        const sceneManager = this.scene;
        const registry = this.registry;
        const pauseScene = this;

        // Defer the transition one tick so the button callback can return
        // before Phaser starts tearing scenes down and rebuilding Menu.
        setTimeout(() => {
          registry.set("fromPlay", true);
          pauseRetroRush();
          endGameSession(pauseScene);

          const playScene = sceneManager.get("Play");
          if (playScene && typeof playScene.shutdownSceneState === "function") {
            playScene.shutdownSceneState();
          }

          if (sceneManager.isActive("Countdown")) {
            sceneManager.stop("Countdown");
          }
          if (sceneManager.isActive("Play")) {
            sceneManager.stop("Play");
          }

          sceneManager.stop("Pause");
          sceneManager.start("Menu");
        }, 0);
      },
      { fontSize: "18px" },
    );
  }
}

