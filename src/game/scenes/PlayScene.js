import Phaser from "phaser";
import { createTextButton } from "../ui/textButton";
import { pauseBgm, playRetroRush, pauseRetroRush } from "../audio/bgm";
import { attachYellowCursor } from "../cursor";

// 4) Placeholder play scene: where the actual game will live
// When gameplay starts we:
// - Pause the menu background music
// - Start the \"Retro Rush\" track at the same user‑selected volume
// When leaving gameplay we:
// - Stop \"Retro Rush\"
// - Resume the normal background music on the menu
export default class PlayScene extends Phaser.Scene {
  constructor() {
    super("Play");
    this.player = null;
    this.playerLastPos = null;
    this.runActive = false;
    this.cursor = null;
    this.cursorTarget = null;
    this.playerLastRotation = 0;
    this.velocity = new Phaser.Math.Vector2(0, 0);
    this.shipNoseLength = 20;
  }

  handlePointerMove(pointer) {
    const { width, height } = this.scale;

    // cursor.js already keeps the yellow cursor in sync with the pointer.
    // Here we just remember where the ship should be trying to move toward.
    const x = Phaser.Math.Clamp(pointer.x, 0, width);
    const y = Phaser.Math.Clamp(pointer.y, 0, height);
    if (!this.cursorTarget) {
      this.cursorTarget = new Phaser.Math.Vector2(x, y);
    } else {
      this.cursorTarget.set(x, y);
    }
  }

  startRun() {
    const { width, height } = this.scale;

    if (!this.player) {
      // Galaga sample sprite placeholder for the player ship.
      // The sprite stays centered on its own body, while the nose offset
      // is derived from the actual image height so it can later swap cleanly
      // to a real ship sprite and hitbox.
      this.player = this.add
        .image(width / 2, height / 2, "galaga-sample")
        .setOrigin(0.5)
        .setScale(0.14);
      this.shipNoseLength = this.player.displayHeight * 0.5;

      this.playerLastPos = new Phaser.Math.Vector2(this.player.x, this.player.y);
    } else {
      this.player.setPosition(width / 2, height / 2);
      this.playerLastPos.set(width / 2, height / 2);
    }

    this.velocity.set(0, 0);
    this.runActive = true;
  }

  create() {
    const { width, height } = this.scale;

    // Swap away from menu music; actual gameplay track starts
    // after the 3-2-1-GO countdown completes.
    pauseBgm();

    // Attach shared yellow cursor used across all scenes.
    this.cursor = attachYellowCursor(this);
    this.cursorTarget = new Phaser.Math.Vector2(width / 2, height / 2);
    this.input.on("pointermove", this.handlePointerMove, this);

    // Pause button at the top center of the viewport.
    createTextButton(
      this,
      width / 2,
      32,
      "Pause",
      () => {
        // Launch pause overlay and pause this scene's update loop.
        this.scene.launch("Pause");
        this.scene.pause();
      },
      { fontSize: "18px" },
    );

    // HUD placeholder in the top‑right corner:
    // three small icons (lives) and one larger icon (player avatar).
    const hudY = 40;
    const largeRadius = 26;
    const smallRadius = 12;
    const rightMargin = 32;

    // Big icon (player avatar placeholder)
    this.add
      .circle(width - rightMargin, hudY, largeRadius, 0xffffff)
      .setStrokeStyle(2, 0xffffff, 0.8);

    // Three smaller icons to the left of the big one (spaceships / lives)
    const spacing = 2 * smallRadius + 6;
    for (let i = 0; i < 3; i += 1) {
      const x = width - rightMargin - largeRadius - 16 - i * spacing;
      this.add
        .circle(x, hudY, smallRadius, 0xffffff)
        .setStrokeStyle(1.5, 0xffffff, 0.8);
    }

    this.add
      .text(width - rightMargin, hudY - largeRadius - 16, "Spike's face", {
        fontFamily: '"Epilogue", system-ui, sans-serif',
        fontSize: "14px",
        color: "#ffffff",
      })
      .setOrigin(1, 1);

    // When entering gameplay, show a 3-2-1-GO countdown overlay before
    // the player and ship start interacting.
    this.scene.launch("Countdown");
  }

  update(time, delta) {
    if (!this.runActive || !this.player || !this.cursorTarget) return;

    const dt = delta / 1000; // seconds

    // Treat the ship's position as the nose (tip) of the triangle.
    const prevX = this.player.x;
    const prevY = this.player.y;

    const targetX = this.cursorTarget.x;
    const targetY = this.cursorTarget.y;

    const MAX_SPEED = 760;
    const STEER_FORCE = 1100;
    const DRAG = 0.08;
    const ARRIVE_RADIUS = 140;
    const HOLD_RADIUS = 28;
    const REST_OFFSET = this.shipNoseLength + 6;
    const MIN_SPEED_SCALE = 0.18;

    // Steering model:
    // - build a desired velocity toward the cursor
    // - turn the current velocity toward it gradually
    // - keep only a light drag so momentum carries through curves
    const desired = new Phaser.Math.Vector2(targetX - prevX, targetY - prevY);
    const distance = desired.length();
    if (distance > 0.0001) {
      desired.normalize();
    }

    // Keep the ship's center trailing behind the cursor while the top nose
    // point is the part that visually leads the movement.
    const cursorAngle = Math.atan2(targetY - prevY, targetX - prevX);
    const noseWorldOffsetX = Math.cos(cursorAngle) * REST_OFFSET;
    const noseWorldOffsetY = Math.sin(cursorAngle) * REST_OFFSET;
    const centerTargetX = targetX - noseWorldOffsetX;
    const centerTargetY = targetY - noseWorldOffsetY;

    // Ease the ship down as it gets close to the cursor so it settles instead
    // of bouncing around the target.
    const centerDistance = Phaser.Math.Distance.Between(
      prevX,
      prevY,
      centerTargetX,
      centerTargetY,
    );
    const proximity = Phaser.Math.Clamp(centerDistance / ARRIVE_RADIUS, 0, 1);
    const arriveEase = proximity * proximity * (3 - 2 * proximity); // smoothstep
    const speedScale = MIN_SPEED_SCALE + (1 - MIN_SPEED_SCALE) * arriveEase;

    if (centerDistance <= HOLD_RADIUS) {
      // Close enough to the cursor: stop accelerating, then brake hard so the
      // ship coasts into a stationary hover instead of snapping to a stop.
      const HOLD_DRAG = 5.5;
      this.velocity.scale(Math.max(0, 1 - HOLD_DRAG * dt));

      if (this.velocity.length() < 4) {
        this.velocity.set(0, 0);
      }

      const nx = prevX + this.velocity.x * dt;
      const ny = prevY + this.velocity.y * dt;
      this.player.setPosition(nx, ny);

      const holdAngle = Math.atan2(targetY - ny, targetX - nx);
      this.player.rotation = holdAngle + Math.PI / 2;
      this.playerLastRotation = this.player.rotation;
      if (this.playerLastPos) {
        this.playerLastPos.set(nx, ny);
      }
      return;
    }

    const desiredCenter = new Phaser.Math.Vector2(
      centerTargetX - prevX,
      centerTargetY - prevY,
    );
    if (desiredCenter.length() > 0.0001) {
      desiredCenter.normalize();
    }

    const desiredVelocity = desiredCenter.clone().scale(MAX_SPEED * speedScale);
    const steer = desiredVelocity.clone().subtract(this.velocity);

    // Limit how quickly we can re-aim, which creates drift on sharp turns.
    const maxSteer = (STEER_FORCE * (0.35 + 0.65 * arriveEase)) * dt;
    const steerLen = steer.length();
    if (steerLen > maxSteer && steerLen > 0.0001) {
      steer.scale(maxSteer / steerLen);
    }

    this.velocity.add(steer);

    // Extra braking as we approach the cursor so the ship can settle into a
    // stable hover without wobbling back and forth around the target.
    const drag = DRAG + (1 - arriveEase) * 0.22;
    this.velocity.scale(1 - drag * dt);

    if (this.velocity.length() > MAX_SPEED) {
      this.velocity.setLength(MAX_SPEED);
    }

    const nx = prevX + this.velocity.x * dt;
    const ny = prevY + this.velocity.y * dt;

    this.player.setPosition(nx, ny);

    // Keep the ship facing the cursor even while it drifts through turns.
    const aimAngle = Math.atan2(targetY - ny, targetX - nx);
    this.player.rotation = aimAngle + Math.PI / 2;
    this.playerLastRotation = this.player.rotation;
    if (this.playerLastPos) {
      this.playerLastPos.set(nx, ny);
    }
  }
}

