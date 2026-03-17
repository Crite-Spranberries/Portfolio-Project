// Lightweight session helpers for the Bebop game.
// This keeps track of whether a gameplay \"run\" is in progress so we can later
// hang score saving, analytics, and audio rules off of it.

export const beginGameSession = (scene) => {
  const now = Date.now();
  const existingCounter = scene.registry.get("sessionCounter") || 0;
  const sessionId = existingCounter + 1;

  scene.registry.set("sessionCounter", sessionId);
  scene.registry.set("sessionActive", true);
  scene.registry.set("currentSession", {
    id: sessionId,
    startedAt: now,
    // Placeholder properties we can expand later.
    score: 0,
  });
};

export const endGameSession = (scene, summary = {}) => {
  if (!scene.registry.get("sessionActive")) return;

  const current = scene.registry.get("currentSession") || {};
  const endedAt = Date.now();

  const fullSummary = {
    ...current,
    ...summary,
    endedAt,
    durationMs: endedAt - (current.startedAt || endedAt),
  };

  scene.registry.set("sessionActive", false);
  scene.registry.set("lastSession", fullSummary);
  scene.registry.set("currentSession", null);

  // For now we just log to the console; later this could post to an API
  // or be shown on an in-game scoreboard.
  // eslint-disable-next-line no-console
  console.log("[Bebop] Session ended:", fullSummary);
};

