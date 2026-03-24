import Phaser from "phaser";
import { createTextButton } from "../ui/textButton";
import { attachYellowCursor } from "../cursor";

// 6) Credits scene — scrollable viewport
export default class CreditsScene extends Phaser.Scene {
  constructor() {
    super("Credits");
  }

  create() {
    const { width, height } = this.scale;

    attachYellowCursor(this);
    const centerX = width / 2;
    const panelPadding = 20;
    const panelWidth = Math.min(width * 0.88, 520);
    const panelHeight = height * 0.5;
    const panelY = height / 2 + 16;

    // Title (fixed above panel)
    this.add
      .text(centerX, 48, "Credits", {
        fontFamily: '"Bytebounce", system-ui, sans-serif',
        fontSize: "28px",
        color: "#ffffff",
      })
      .setOrigin(0.5);

    // Panel = viewport (fixed background + border)
    this.add
      .rectangle(centerX, panelY, panelWidth, panelHeight, 0x000000, 0.7)
      .setStrokeStyle(1, 0xffffff, 0.3);

    // Scrollable content container (position and mask set below)
    const content = this.add.container(centerX, panelY);
    const style = {
      fontFamily: '"Bytebounce", system-ui, sans-serif',
      fontSize: "15px",
      color: "#d0d0d0",
    };
    const headerStyle = { ...style, fontSize: "14px", color: "#aaaaaa" };
    const lineHeight = 20;
    const smallGap = 6;
    const sectionGap = 14;

    let y = 0;

    const addLine = (text, s = style) => {
      const t = this.add.text(0, y, text, s).setOrigin(0.5, 0);
      content.add(t);
      y += lineHeight;
      return t;
    };

    addLine("Design & code", headerStyle);
    addLine("Samuel B. Chua");
    y += smallGap;

    addLine("Sprite art & animations", headerStyle);
    addLine("Samuel B. Chua");
    y += sectionGap;

    addLine("SFX", headerStyle);
    addLine("Swordfish II sfx — [TBD]");
    addLine("Asteroid sfx — [TBD]");
    addLine("Explosion sfx — [TBD]");
    addLine("Enemy ship sfx — [TBD]");
    addLine("Engine / thruster sfx — [TBD]");
    addLine("UI / menu sfx — [TBD]");
    y += sectionGap;

    addLine("Music", headerStyle);
    addLine('"Space Lion" — The Seatbelts');
    addLine('"Rush" — The Seatbelts');
    y += sectionGap;

    const taglineStyle = { ...style, fontSize: "13px", color: "#999999" };
    addLine("A fan game inspired by Cowboy Bebop.", taglineStyle);
    addLine("All credits go to the original creators.", taglineStyle);
    addLine("Made for fun and learning.", taglineStyle);
    y += smallGap;
    addLine("Powered by Phaser 3, React, JavaScript", {
      ...style,
      fontSize: "12px",
      color: "#888888",
    });

    const contentHeight = y;
    const viewportHeight = panelHeight - 2 * panelPadding;

    // Mask so only the panel area shows the content
    const maskShape = this.add.graphics();
    maskShape.setPosition(centerX - panelWidth / 2, panelY - panelHeight / 2);
    maskShape.fillStyle(0xffffff);
    maskShape.beginPath();
    maskShape.fillRect(0, 0, panelWidth, panelHeight);
    maskShape.setVisible(false);
    const mask = maskShape.createGeometryMask();
    content.setMask(mask);

    // Position container so first line is at top of viewport (with padding)
    content.setPosition(centerX, panelY - panelHeight / 2 + panelPadding);

    // Scroll state
    let scrollY = 0;
    const maxScroll = Math.max(0, contentHeight - viewportHeight);

    const applyScroll = () => {
      scrollY = Phaser.Math.Clamp(scrollY, 0, maxScroll);
      content.y = panelY - panelHeight / 2 + panelPadding - scrollY;
    };

    // Mouse wheel
    this.input.on("wheel", (pointer, gameObjects, deltaX, deltaY) => {
      scrollY += deltaY * 0.4;
      applyScroll();
    });

    // Touch / drag scroll
    this.input.on("pointerdown", (pointer) => {
      if (!this.scrollDrag) this.scrollDrag = { y: pointer.y, scroll: scrollY };
    });
    this.input.on("pointermove", (pointer) => {
      if (this.scrollDrag) {
        scrollY = this.scrollDrag.scroll + (this.scrollDrag.y - pointer.y);
        applyScroll();
      }
    });
    this.input.on("pointerup", () => {
      this.scrollDrag = null;
    });
    this.input.on("pointerupoutside", () => {
      this.scrollDrag = null;
    });

    // Hint when scrollable
    if (maxScroll > 0) {
      this.add
        .text(centerX, panelY + panelHeight / 2 - 28, "Scroll to see more", {
          fontFamily: '"Bytebounce", system-ui, sans-serif',
          fontSize: "11px",
          color: "#666666",
        })
        .setOrigin(0.5);
    }

    createTextButton(
      this,
      centerX,
      height - 52,
      "Back to Menu",
      () => this.scene.start("Menu"),
      { fontSize: "18px" },
    );
  }
}
