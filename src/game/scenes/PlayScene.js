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
// Small, reusable projectile helper so future entities (enemies, turrets, etc.)
// can share the same pool + spawn logic with different configs.
const createProjectilePool = (scene, { textureKey, maxSize = 48 } = {}) =>
  scene.physics.add.group({
    classType: Phaser.Physics.Arcade.Image,
    maxSize,
    runChildUpdate: false,
    defaultKey: textureKey,
  });

export default class PlayScene extends Phaser.Scene {
  constructor() {
    super("Play");

    // --- Ship / movement state ---
    this.player = null;
    this.playerLastPos = null;
    this.runActive = false;
    this.cursor = null;
    this.cursorTarget = null;
    this.playerLastRotation = 0;
    this.velocity = new Phaser.Math.Vector2(0, 0);
    this.shipNoseLength = 20;
    this.boostKey = null;
    this.pauseKey = null;

    // --- Boost meter state (resource & HUD) ---
    this.boostMeter = 1; // 0–1, starts full
    this.boostCooldownUntil = 0; // ms timestamp when boost can be used again
    this.boostBarFill = null;
    this.boostBarMaxWidth = 0;

    // --- Projectile system state (player bullets) ---
    this.projectiles = null;
    this.fireIntervalMs = 200; // time between shots when holding LMB
    this.lastShotAt = -Infinity;

    // Cached input handlers so we can unregister cleanly on shutdown.
    this.onPointerMove = null;
    this.onPointerDown = null;
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

  handlePointerDown(pointer) {
    if (pointer?.leftButtonDown?.()) {
      this.fireProjectile(this.time.now);
    }
  }

  startRun() {
    const { width, height } = this.scale;

    if (!this.player || !this.player.active) {
      if (this.player && !this.player.active) {
        this.player.destroy();
      }
      // Galaga sample sprite placeholder for the player ship.
      // The sprite stays centered on its own body, while the nose offset
      // is derived from the actual image height so it can later swap cleanly
      // to a real ship sprite and hitbox.
      this.player = this.add
        .image(width / 2, height / 2, "galaga-sample")
        .setOrigin(0.5)
        .setScale(0.14);
      this.shipNoseLength = this.player.displayHeight * 0.5;

      this.playerLastPos = new Phaser.Math.Vector2(
        this.player.x,
        this.player.y,
      );
    } else {
      this.player.setPosition(width / 2, height / 2);
      this.playerLastPos.set(width / 2, height / 2);
    }

    this.velocity.set(0, 0);
    this.runActive = true;
    this.lastShotAt = -Infinity;
  }

  // --- Projectile helpers ---------------------------------------------------

  fireProjectile(time) {
    if (!this.runActive || !this.player || !this.projectiles) return;
    if (time - this.lastShotAt < this.fireIntervalMs) return;

    // Forward direction based on ship rotation (our sprite points "up").
    const shotAngle = this.player.rotation - Math.PI / 2;

    // Spawn from slightly in front of the ship nose so bullets don't overlap it.
    const spawnOffset = this.shipNoseLength + 10;
    const spawnX = this.player.x + Math.cos(shotAngle) * spawnOffset;
    const spawnY = this.player.y + Math.sin(shotAngle) * spawnOffset;

    const projectile = this.projectiles.get(spawnX, spawnY);
    if (!projectile) return;

    // Visual setup – easy to tweak per-entity later.
    projectile
      .setActive(true)
      .setVisible(true)
      .setDepth(5)
      .setOrigin(0.5)
      .setScale(0.08)
      .setRotation(this.player.rotation);

    // Physics setup – speed and behaviour are centralized here so we can
    // reuse this for enemies with different values.
    const PROJECTILE_SPEED = 1450; // faster than before for a snappier feel

    projectile.enableBody(true, spawnX, spawnY, true, true);
    projectile.body.setAllowGravity(false);
    projectile.body.reset(spawnX, spawnY);
    projectile.body.setVelocity(
      Math.cos(shotAngle) * PROJECTILE_SPEED,
      Math.sin(shotAngle) * PROJECTILE_SPEED,
    );

    this.lastShotAt = time;
  }

  updateProjectiles() {
    if (!this.projectiles) return;

    const { width, height } = this.scale;
    const margin = 96;

    this.projectiles.children.each((projectile) => {
      if (!projectile || !projectile.active) return;

      // Simple viewport culling: anything that leaves the screen with a
      // small margin is returned to the pool.
      if (
        projectile.x < -margin ||
        projectile.x > width + margin ||
        projectile.y < -margin ||
        projectile.y > height + margin
      ) {
        projectile.disableBody(true, true);
      }
    });
  }

  shutdownSceneState() {
    if (this.scene.isActive("Countdown")) {
      this.scene.stop("Countdown");
    }

    this.input.off("pointermove", this.onPointerMove, this);
    this.input.off("pointerdown", this.onPointerDown, this);

    if (this.projectiles) {
      this.projectiles.clear(true, true);
      this.projectiles.destroy(true);
      this.projectiles = null;
    }

    if (this.player) {
      this.player.destroy();
      this.player = null;
    }

    if (this.cursor) {
      this.cursor.destroy();
      this.cursor = null;
    }

    // Destroy any remaining visible PlayScene objects such as the pause button
    // and HUD circles/text so nothing lingers when we return to the menu.
    const remainingChildren = [...this.children.list];
    remainingChildren.forEach((child) => {
      if (child && !child.destroyed) {
        child.destroy();
      }
    });

    this.playerLastPos = null;
    this.cursorTarget = null;
    this.boostKey = null;
    this.runActive = false;
    this.velocity.set(0, 0);
    this.lastShotAt = -Infinity;
  }

  create() {
    const { width, height } = this.scale;

    // Make sure any stale objects from a prior stop/start are discarded.
    this.shutdownSceneState();

    // Swap away from menu music; actual gameplay track starts
    // after the 3-2-1-GO countdown completes.
    pauseBgm();

    // Attach shared yellow cursor used across all scenes.
    this.cursor = attachYellowCursor(this);
    this.cursorTarget = new Phaser.Math.Vector2(width / 2, height / 2);
    this.onPointerMove = this.handlePointerMove.bind(this);
    this.onPointerDown = this.handlePointerDown.bind(this);
    this.input.on("pointermove", this.onPointerMove);
    this.input.on("pointerdown", this.onPointerDown);
    this.boostKey = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.E,
    );
    this.pauseKey = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.ESC,
    );

    // Player projectile pool – reuse this same helper later for enemies
    // by passing a different textureKey and, if needed, size.
    this.projectiles = createProjectilePool(this, {
      textureKey: "galaga-bullet",
      maxSize: 64,
    });

    this.events.once(
      Phaser.Scenes.Events.SHUTDOWN,
      this.shutdownSceneState,
      this,
    );

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
        fontFamily: '"ArcadeClassic", system-ui, sans-serif',
        fontSize: "14px",
        color: "#ffffff",
      })
      .setOrigin(1, 1);

    // Boost meter bar under the HUD icons so players can see how much
    // speed‑boost resource remains. It spans from the left edge of the
    // leftmost life icon to the right edge of the avatar icon.
    const boostBarHeight = 6;
    const lifeSpacing = 2 * smallRadius + 6;
    const leftmostLifeCenterX =
      width - rightMargin - largeRadius - 16 - 2 * lifeSpacing;
    const leftmostLifeLeftEdge = leftmostLifeCenterX - smallRadius;
    const avatarCenterX = width - rightMargin;
    const avatarRightEdge = avatarCenterX + largeRadius;

    const boostBarLeftX = leftmostLifeLeftEdge;
    const boostBarRightX = avatarRightEdge;
    const boostBarWidth = boostBarRightX - boostBarLeftX;
    const boostBarY = hudY + largeRadius + 10;

    // Background track
    this.add
      .rectangle(
        boostBarLeftX + boostBarWidth / 2,
        boostBarY,
        boostBarWidth,
        boostBarHeight,
        0x333333,
        0.9,
      )
      .setOrigin(0.5);

    // Foreground fill
    this.boostBarMaxWidth = boostBarWidth;
    this.boostBarFill = this.add
      .rectangle(
        boostBarLeftX,
        boostBarY,
        boostBarWidth,
        boostBarHeight,
        0x66ccff,
        1,
      )
      .setOrigin(0, 0.5);

    // Lightweight controls caption in the top‑left corner so players can see
    // the keybinds at a glance.
    this.add.text(
      24,
      24,
      "CONTROLS:\n\n[LMB] Fire\n[E] Speed Boost\n[Move Cursor] Aim/Maneuver\n[ESC] Pause Game",
      {
        fontFamily: '"ArcadeClassic", system-ui, sans-serif',
        fontSize: "12px",
        color: "#999999",
        align: "left",
      },
    );

    // When entering gameplay, show a 3-2-1-GO countdown overlay before
    // the player and ship start interacting.
    this.scene.launch("Countdown");
  }

  // --- Boost meter update ---------------------------------------------------

  updateBoostMeter(time, dt, isBoostKeyDown) {
    const COOLDOWN_MS = 4000;
    const FULL_DRAIN_SECONDS = 3; // drain to empty in ~3s of held boost
    const DRAIN_RATE = 1 / FULL_DRAIN_SECONDS;
    const RECHARGE_RATE = 0.25; // per second, refills from empty in ~4s

    const inCooldown = time < this.boostCooldownUntil;

    // Can we apply boost this frame?
    const canBoost = !inCooldown && this.boostMeter > 0.001;
    const boostActive = isBoostKeyDown && canBoost;

    // Drain while boosting.
    if (boostActive) {
      this.boostMeter -= DRAIN_RATE * dt;
      if (this.boostMeter <= 0) {
        this.boostMeter = 0;
        this.boostCooldownUntil = time + COOLDOWN_MS;
      }
    } else {
      // Recharge over time, even during cooldown – but actual boost usage is
      // still locked out until cooldown expires.
      if (this.boostMeter < 1) {
        this.boostMeter += RECHARGE_RATE * dt;
        if (this.boostMeter > 1) this.boostMeter = 1;
      }
    }

    // Update HUD bar fill to reflect current meter.
    if (this.boostBarFill && this.boostBarMaxWidth > 0) {
      this.boostBarFill.displayWidth = this.boostBarMaxWidth * this.boostMeter;
    }

    return boostActive;
  }

  update(time, delta) {
    if (!this.runActive || !this.player || !this.cursorTarget) return;

    const dt = delta / 1000; // seconds
    // Speed boost is driven by the E key, gated by the boost meter and cooldown.
    const isBoostKeyDown = !!this.boostKey?.isDown;
    const boostActive = this.updateBoostMeter(time, dt, isBoostKeyDown);

    // ESC key also pauses, in addition to the on‑screen Pause button.
    if (this.pauseKey && Phaser.Input.Keyboard.JustDown(this.pauseKey)) {
      this.scene.launch("Pause");
      this.scene.pause();
      return;
    }

    if (this.input.activePointer?.isDown) {
      this.fireProjectile(time);
    }

    // Treat the ship's position as the nose (tip) of the triangle.
    const prevX = this.player.x;
    const prevY = this.player.y;

    const targetX = this.cursorTarget.x;
    const targetY = this.cursorTarget.y;

    const MAX_SPEED = boostActive ? 1060 : 760;
    const STEER_FORCE = boostActive ? 1600 : 1100;
    const DRAG = boostActive ? 0.035 : 0.08;
    const ARRIVE_RADIUS = 140;
    const HOLD_RADIUS = 28;
    const REST_OFFSET = this.shipNoseLength + 6;
    const MIN_SPEED_SCALE = boostActive ? 0.42 : 0.18;

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
    const maxSteer = STEER_FORCE * (0.35 + 0.65 * arriveEase) * dt;
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

    this.updateProjectiles();
  }
}
