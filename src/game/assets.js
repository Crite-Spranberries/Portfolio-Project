// Central helper for Bebop game asset paths.
// Ensures everything lives under src/assets/bebop/**
export const bebopAsset = (subpath) =>
  new URL(`../assets/bebop/${subpath}`, import.meta.url).href;

