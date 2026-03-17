import { useEffect, useRef } from "react";
import Phaser from "phaser";
import SplashScene from "./scenes/SplashScene";
import AudioConsentScene from "./scenes/AudioConsentScene";
import MenuScene from "./scenes/MenuScene";
import PlayScene from "./scenes/PlayScene";
import PauseScene from "./scenes/PauseScene";
import CountdownScene from "./scenes/CountdownScene";
import SettingsScene from "./scenes/SettingsScene";
import CreditsScene from "./scenes/CreditsScene";
import { pauseBgm, pauseRetroRush } from "./audio/bgm";

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
      scene: [
        SplashScene,
        AudioConsentScene,
        MenuScene,
        PlayScene,
        PauseScene,
        CountdownScene,
        SettingsScene,
        CreditsScene,
      ],
      physics: {
        default: "arcade",
        arcade: {
          gravity: { y: 0 },
        },
      },
      // BGM is played via our own HTMLAudioElement; avoid Phaser creating a suspended
      // Web Audio context that can interfere with autoplay policy.
      audio: {
        disableWebAudio: true,
      },
    };

    const game = new Phaser.Game(config);
    gameRef.current = game;

    // Keep audio scoped to the game viewport.
    // - Clicking anywhere outside the game viewport pauses the music.
    // - Clicking inside the viewport does not change tracks; scenes control
    //   which music should be playing (menu vs gameplay).
    const handlePointerDown = (event) => {
      const container = containerRef.current;
      if (!container) return;

      if (!container.contains(event.target)) {
        pauseBgm();
        pauseRetroRush();
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      game.destroy(true);
      gameRef.current = null;
    };
  }, []);

  return <div ref={containerRef} className="bebop-game-root" />;
}

export default BebopGame;

