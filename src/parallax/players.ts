import { _ } from "engine/importsEngine";
import { SimpleGameEngine } from "engine/SimpleGameEngine";
import { ParallaxContext } from "./ParallaxContext";
import * as log from "./log";
import { KeyCodes, Keyboard } from "engine/input/Keyboard";

const isActive = true;

interface IPlayer {
  sprite: PIXI.Sprite;
  frameIndex: number;
  frameTimeLeft: number;
  currentAnimation: IAnim;
}
let items: IPlayer[] = [];

function frame16(y, x, w, h) {
  return new PIXI.Rectangle(16 * x, 16 * y, 16 * w, 16 * h);
}

var framesRun = [frame16(2, 2, 2, 2), frame16(2, 4, 2, 2)];

interface IAnim {
  frames: PIXI.Rectangle[];
  textures?: PIXI.Texture[];
  frameTime?: number;
  loop?: boolean;
}

var animRun: IAnim = {
  frames: framesRun,
  frameTime: 10 / 60,
  loop: true
};
var animFall: IAnim = {
  frames: [frame16(2, 6, 2, 2)],
  frameTime: 10 / 60
};
var animDuck: IAnim = {
  frames: [frame16(2, 8, 2, 2)],
  frameTime: 10 / 60
};

export function create(ctx: ParallaxContext, container: PIXI.Container) {
  log.x("create player");
  let item: IPlayer = {
    sprite: null,
    frameIndex: 0,
    frameTimeLeft: 0,
    currentAnimation: null
  };

  let baseTex = ctx.sge.getTexture("player1");

  var texs = _.map(framesRun, c => new PIXI.Texture(baseTex.baseTexture, c));
  var tex0 = texs[0];

  let sprite = new PIXI.Sprite(tex0);
  sprite.anchor.set(0, 0);
  sprite.y = 400;
  sprite.x = 250;
  sprite.scale.set(4);
  container.addChild(sprite);
  item.sprite = sprite;
  items.push(item);

  playAnim(item, animRun);

  return item;
}

export function playAnim(item: IPlayer, anim: IAnim, force = false) {
  if (!anim.textures) {
    anim.textures = _.map(anim.frames, c => {
      return new PIXI.Texture(item.sprite.texture.baseTexture, c);
    });
  }

  // Continue playing current animation?
  if (!force && item.currentAnimation === anim) {
    return;
  }

  item.currentAnimation = anim;
  item.sprite.texture = anim.textures[0];
  item.frameTimeLeft = anim.frameTime || 10 / 60;
}

import { InputControl } from "engine/gamepad/InputControl";
export function updateAll(ctx: ParallaxContext) {
  let kb = ctx.sge.keyboard;

  _.forEach(items, c => {
    // log.x("update player", c.sprite.x, c.sprite.y);

    let adj = 0;
    if (kb.isPressed(KeyCodes.arrowUp)) {
      adj = -20;
      playAnim(c, animFall);
    } else if (kb.isPressed(KeyCodes.arrowDown)) {
      //adj = 20;
      playAnim(c, animDuck);
    } else {
      playAnim(c, animRun, false);
    }

    c.sprite.y += adj;

    if (c.currentAnimation) {
      c.frameTimeLeft -= 1 / 60;
      if (c.frameTimeLeft < 0) {
        c.frameIndex++;
        if (c.frameIndex >= c.currentAnimation.frames.length) {
          c.frameIndex = 0;
        }
        c.sprite.texture = c.currentAnimation.textures[c.frameIndex];
        c.frameTimeLeft = c.currentAnimation.frameTime;
      }
    }
  });
}
