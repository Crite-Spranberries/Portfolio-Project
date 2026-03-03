// BGM via plain HTMLAudioElement (same approach that worked in your console test).
// Use the exact path that worked: /src/assets/bebop/audio/music/space-lion-retro.mp3
const getBgmUrl = () => {
  if (typeof window === "undefined") return "";
  return window.location.origin + "/src/assets/bebop/audio/music/space-lion-retro.mp3";
};

let bgmAudio = null;

const ensureAudioElement = () => {
  if (!bgmAudio) {
    const url = getBgmUrl();
    bgmAudio = new Audio(url);
    bgmAudio.loop = true;
  }
  return bgmAudio;
};

// Ensure background music is playing at the desired volume.
// Must run in the same call stack as the user click so play() is allowed by autoplay policy.
export const ensureBgmPlaying = (scene) => {
  const audio = ensureAudioElement();

  let volume = scene.registry.get("bgmVolume");
  if (typeof volume !== "number") {
    volume = 0.6;
    scene.registry.set("bgmVolume", volume);
  }
  audio.volume = volume;
  audio.muted = false;

  // Call play() synchronously so it's inside the user gesture (required by browsers).
  if (audio.paused) {
    audio.play().catch(() => {});
  }
};

export const setBgmMuted = (muted) => {
  if (bgmAudio) {
    bgmAudio.muted = muted;
  }
};

export const setBgmVolume = (volume) => {
  if (bgmAudio) {
    bgmAudio.volume = volume;
  }
};

