import { useEffect } from "react";
import BebopGame from "../game/BebopGame";
import "./Bebop.css";

function Bebop() {
  useEffect(() => {
    document.title = "Bebop";
    return () => {
      document.title = "Samuel Chua";
    };
  }, []);

  return (
    <div className="bebop-page">
      <section className="bebop-game-container" aria-label="Game section">
        <div className="bebop-game-inner">
          <div className="bebop-game-viewport">
            <BebopGame />
          </div>
        </div>
      </section>

      <section
        className="bebop-game-description"
        aria-label="Game details and description"
      >
        <div className="bebop-game-description-inner">
          <div className="bebop-desc-row">
            <div className="bebop-desc-media">
              {/* Screenshot or key art goes here */}
            </div>
            <div className="bebop-desc-copy">
              <h2>Game Overview</h2>
              <p>High-level description of the game and its core loop.</p>
            </div>
          </div>

          <div className="bebop-desc-row">
            <div className="bebop-desc-media">
              {/* Controls diagram / UI reference image */}
            </div>
            <div className="bebop-desc-copy">
              <h3>How to Play (Desktop)</h3>
              <p>Desktop controls, tips.</p>
              <h3>How to Play (Desktop)</h3>
              <p>Desktop controls, tips.</p>
            </div>
          </div>

          <div className="bebop-desc-row">
            <div className="bebop-desc-media">
              {/* Logos, code snippets, or diagram for the stack */}
            </div>
            <div className="bebop-desc-copy">
              <h3>Tech Stack & Repo</h3>
              <p>
                Details on Phaser, tooling, and a link to the standalone build.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Bebop;
