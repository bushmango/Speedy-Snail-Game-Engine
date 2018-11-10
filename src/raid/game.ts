// See: https://github.com/kittykatattack/learningPixi

const { Rectangle, Sprite } = PIXI;
const { TextureCache } = PIXI.utils;

import * as log from "./log";

import { _ } from "engine/importsEngine";
import { SimpleGameEngine } from "engine/SimpleGameEngine";
import * as settingsGeneric from "engine/misc/settingsGeneric";
import * as ldSounds from "ludumDare41/sounds/ldSounds";
import { RaidContext } from "./RaidContext";

let sge = new SimpleGameEngine();

let ctx = new RaidContext();

export function preload() {
  settingsGeneric.load("ludum-dare-start-v001");

  sge.preloadAudioSprites([
    // 'audioSprite',
  ]);
  sge.preloadBitmapFonts(["defaultfont"]);
  sge.preloadSprites([
    // 'test-ship',
    "prariesnailgames",
    "parallax-buildings",
    "player1"
  ]);
  sge.preloadSpriteSheets([
    "test-tileset",
    "gui-tileset",
    "ase-512-16",
    "ase-512-8"
  ]);
  sge.preloadTiledMaps([]);
  sge.preloadPackedSprites([]);
}

let pixiMode = "unknown";
export function run() {
  log.x("Raid test by Stevie Bushman");

  // Make crisp
  PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;

  sge.init();
  sge.createRenderer();
  let stage = sge.stage;
  let renderer = sge.renderer;

  preload();
  sge.preload("/public/raid", () => {
    onLoaded();
  });

  window.onresize = () => {
    sge.resize();
  };

  function onLoaded() {
    sge.onUpdateCallback = onUpdate;

    // Now load sounds & music
    ldSounds.load(sge);

    ctx.onLoaded(sge);

    sge.startGameLoop();
  }

  function onUpdate() {
    ctx.onUpdate();
  }
}
