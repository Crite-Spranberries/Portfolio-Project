import { bebopAsset } from "../assets";

// BGM via plain HTMLAudioElement; loaded only after user consent (keeps large file off initial load).
const BGM_PATH = "audio/music/space-lion-retro.mp3";
const RETRO_RUSH_PATH = "audio/music/rush-retro.mp3";
// Dev: literal path works with Vite's server. Prod: use resolved asset URL.
const getBgmUrl = () =>
  typeof window !== "undefined" && import.meta.env.DEV
    ? window.location.origin + "/src/assets/bebop/" + BGM_PATH
    : bebopAsset(BGM_PATH);

let bgmAudio = null;
let retroRushAudio = null;
let isBgmMuted = false;

// Gameplay music runs slightly quieter than the menu by default.
// With bgmVolume defaulting to 0.4 (40%), this yields 0.25 (25%) in Play.
const GAMEPLAY_VOLUME_SCALE = 0.625;

const ensureAudioElement = () => {
  if (!bgmAudio) {
    bgmAudio = new Audio(getBgmUrl());
    bgmAudio.loop = true;
  }
  return bgmAudio;
};

const getRetroRushUrl = () =>
  typeof window !== "undefined" && import.meta.env.DEV
    ? window.location.origin + "/src/assets/bebop/" + RETRO_RUSH_PATH
    : bebopAsset(RETRO_RUSH_PATH);

const ensureRetroRushElement = () => {
  if (!retroRushAudio) {
    retroRushAudio = new Audio(getRetroRushUrl());
    retroRushAudio.loop = true;
  }
  return retroRushAudio;
};

// Ensure background music is playing at the desired volume.
// Must run in the same call stack as the user click so play() is allowed by autoplay policy.
export const ensureBgmPlaying = (scene) => {
  const audio = ensureAudioElement();

  let volume = scene.registry.get("bgmVolume");
  if (typeof volume !== "number") {
    volume = 0.4;
    scene.registry.set("bgmVolume", volume);
  }
  audio.volume = volume;
  audio.muted = isBgmMuted;

  // Whenever we are (re)starting the menu BGM, make sure gameplay music
  // is not still running in the background.
  if (retroRushAudio) {
    retroRushAudio.pause();
  }

  // Call play() synchronously so it's inside the user gesture (required by browsers).
  if (audio.paused) {
    audio.play().catch(() => {});
  }
};

export const setBgmMuted = (muted) => {
  isBgmMuted = muted;
  if (bgmAudio) {
    bgmAudio.muted = muted;
  }
  if (retroRushAudio) {
    retroRushAudio.muted = muted;
  }
};

export const setBgmVolume = (volume) => {
  if (bgmAudio) {
    bgmAudio.volume = volume;
  }
  if (retroRushAudio) {
    retroRushAudio.volume = volume;
  }
};

export const pauseBgm = () => {
  if (bgmAudio) {
    bgmAudio.pause();
  }
};

export const resumeBgm = () => {
  if (bgmAudio && bgmAudio.paused) {
    bgmAudio.play().catch(() => {});
  }
};

// Explicitly restart the background music from the beginning.
export const restartBgm = (scene) => {
  const audio = ensureAudioElement();

  let volume = scene.registry.get("bgmVolume");
  if (typeof volume !== "number") {
    volume = 0.4;
    scene.registry.set("bgmVolume", volume);
  }

  audio.currentTime = 0;
  audio.volume = volume;
  audio.muted = isBgmMuted;
  if (retroRushAudio) {
    retroRushAudio.pause();
  }
  audio.play().catch(() => {});
};

export const playRetroRush = (scene) => {
  const audio = ensureRetroRushElement();

  let volume = scene.registry.get("bgmVolume");
  if (typeof volume !== "number") {
    volume = 0.4;
    scene.registry.set("bgmVolume", volume);
  }

  // Always restart the gameplay track when (re)entering Play.
  audio.currentTime = 0;
  audio.volume = volume * GAMEPLAY_VOLUME_SCALE;
  audio.muted = isBgmMuted;
  audio.play().catch(() => {});
};

export const pauseRetroRush = () => {
  if (retroRushAudio) {
    retroRushAudio.pause();
  }
};

export const resumeRetroRush = (scene) => {
  const audio = ensureRetroRushElement();

  let volume = scene.registry.get("bgmVolume");
  if (typeof volume !== "number") {
    volume = 0.4;
    scene.registry.set("bgmVolume", volume);
  }

  // Do not reset currentTime here; just continue from where it left off.
  audio.volume = volume * GAMEPLAY_VOLUME_SCALE;
  audio.muted = isBgmMuted;
  if (audio.paused) {
    audio.play().catch(() => {});
  }
};

