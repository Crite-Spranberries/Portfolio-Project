import { bebopAsset } from "../assets";

// BGM via plain HTMLAudioElement; loaded only after user consent (keeps large file off initial load).
const BGM_PATH = "audio/music/space-lion-retro.mp3";
// Dev: literal path works with Vite's server. Prod: use resolved asset URL.
const getBgmUrl = () =>
  typeof window !== "undefined" && import.meta.env.DEV
    ? window.location.origin + "/src/assets/bebop/" + BGM_PATH
    : bebopAsset(BGM_PATH);

let bgmAudio = null;

const ensureAudioElement = () => {
  if (!bgmAudio) {
    bgmAudio = new Audio(getBgmUrl());
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

