import { useEffect, useRef } from "react";
import Phaser from "phaser";
import SplashScene from "./scenes/SplashScene";
import AudioConsentScene from "./scenes/AudioConsentScene";
import MenuScene from "./scenes/MenuScene";
import PlayScene from "./scenes/PlayScene";
import SettingsScene from "./scenes/SettingsScene";
import CreditsScene from "./scenes/CreditsScene";

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
      // BGM is played via our own HTMLAudioElement; avoid Phaser creating a suspended
      // Web Audio context that can interfere with autoplay policy.
      audio: {
        disableWebAudio: true,
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

