import Phaser from "phaser";

// Attach a small yellow circle cursor to the given scene and hide
// the system cursor. Returns the circle instance.
export const attachYellowCursor = (scene) => {
  const { width, height } = scene.scale;

  scene.input.setDefaultCursor("none");

  const baseTint = 0xffff00;
  const pressedTint = 0xe0c000;

  const cursor = scene.add.circle(width / 2, height / 2, 6, baseTint).setDepth(9999);

  const handleMove = (pointer) => {
    const x = Phaser.Math.Clamp(pointer.x, 0, width);
    const y = Phaser.Math.Clamp(pointer.y, 0, height);
    cursor.setPosition(x, y);
  };

  const handleDown = () => {
    cursor.setFillStyle(pressedTint);
  };

  const handleUp = () => {
    cursor.setFillStyle(baseTint);
  };

  scene.input.on("pointermove", handleMove);
  scene.input.on("pointerdown", handleDown);
  scene.input.on("pointerup", handleUp);

  scene.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
    cursor.destroy();
    scene.input.off("pointermove", handleMove);
    scene.input.off("pointerdown", handleDown);
    scene.input.off("pointerup", handleUp);
  });

  return cursor;
};

