// Simple helper for consistent interactive text buttons across scenes.
export const createTextButton = (scene, x, y, label, onClick, style = {}) => {
  const text = scene.add
    .text(x, y, label, {
      fontFamily: '"Epilogue", system-ui, sans-serif',
      fontSize: "20px",
      color: "#ffffff",
      ...style,
    })
    .setOrigin(0.5)
    .setInteractive({ useHandCursor: true });

  text.on("pointerover", () => text.setAlpha(0.8));
  text.on("pointerout", () => text.setAlpha(1));
  text.on("pointerup", onClick);

  return text;
};

