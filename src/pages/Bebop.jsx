import { useEffect } from "react";
import BebopGame from "../game/BebopGame";
import "./Bebop.css";

// Top‑level page component for the Bebop mini‑game.
// It is responsible for:
// - Setting the browser tab title while the page is active
// - Rendering the game canvas
// - Showing supporting text sections that explain the game
function Bebop() {
  useEffect(() => {
    // When this page mounts, update the browser tab title so it is
    // clear to the user that they are on the Bebop game screen.
    document.title = "Bebop";

    // When the user navigates away from this page, restore the main
    // portfolio title so other pages keep their expected branding.
    return () => {
      document.title = "Samuel Chua";
    };
  }, []);

  return (
    <div className="bebop-page">
      {/*
        Main game area.
        The actual game logic and rendering live inside the <BebopGame />
        component so this page component can stay focused on layout only.
      */}
      <section className="bebop-game-container" aria-label="Game section">
        <div className="bebop-game-inner">
          <div className="bebop-game-viewport">
            <BebopGame />
          </div>
        </div>
      </section>

      {/*
        Supporting content area.
        This section is meant to read like a lightweight case study for the
        game: overview, controls, and a short note on the tech stack.
      */}
      <section
        className="bebop-game-description"
        aria-label="Game details and description"
      >
        <div className="bebop-game-description-inner">
          {/* Overview row: what the game is and the core loop */}
          <div className="bebop-desc-row">
            <div className="bebop-desc-media">
              {/* Screenshot or key art for the game can be placed here. */}
            </div>
            <div className="bebop-desc-copy">
              <h2>Game Overview</h2>
              <p>High-level description of the game and its core loop.</p>
            </div>
          </div>

          {/* Controls row: split out desktop vs. mobile so beginners can scan it quickly */}
          <div className="bebop-desc-row">
            <div className="bebop-desc-media">
              {/* Controls diagram / UI reference image (keyboard, gamepad, or touch layout). */}
            </div>
            <div className="bebop-desc-copy">
              <h3>How to Play (Desktop)</h3>
              <p>Desktop controls, tips.</p>

              <h3>How to Play (Mobile)</h3>
              <p>Mobile / touch controls, tips.</p>
            </div>
          </div>

          {/* Tech row: where you can talk about Phaser, build tooling, or link to a repo */}
          <div className="bebop-desc-row">
            <div className="bebop-desc-media">
              {/* Logos, code snippets, or a simple diagram of the game architecture. */}
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
