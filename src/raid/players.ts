import { _ } from "engine/importsEngine";
import { SimpleGameEngine } from "engine/SimpleGameEngine";
import { RaidContext } from "./RaidContext";
import * as log from "./log";
import { KeyCodes, Keyboard } from "engine/input/Keyboard";

const isActive = true;

interface IPlayer {
  sprite: PIXI.Sprite;
  frameIndex: number;
  frameTimeLeft: number;
  currentAnimation: IAnim;
  y: number;
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

export function create(ctx: RaidContext, container: PIXI.Container) {
  log.x("create player");
  let item: IPlayer = {
    sprite: null,
    frameIndex: 0,
    frameTimeLeft: 0,
    currentAnimation: null,
    y: 0
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
  item.frameIndex = 0;
  item.frameTimeLeft = anim.frameTime || 10 / 60;
}

let playerControllerValues = {
  maxJumpTime: 0.38,
  jumpAccel: 3000,
  fallAccel: -4000,
  endJumpDamp: 0.33,
  jumpStartVelocity: 500,
  jumpTerminalVelocity: 5000,
  fallTerminalVelocity: -5000
};
let playerController = {
  isJumping: false,
  isFalling: false,
  isOnLand: true,
  isDucking: false,
  curJumpTime: 0,
  velY: 0
};

import { InputControl } from "engine/gamepad/InputControl";
export function updateAll(ctx: RaidContext) {
  let kb = ctx.sge.keyboard;

  let elapsedTime = 1.0 / 60.0;

  _.forEach(items, c => {
    // log.x("update player", c.sprite.x, c.sprite.y);

    // Are we on land?
    if (playerController.isOnLand) {
      playerController.velY = 0;
      if (kb.isPressed(KeyCodes.arrowUp)) {
        playerController.isJumping = true;
        playerController.isOnLand = false;
        playerController.curJumpTime = 0;
        playerController.velY = playerControllerValues.jumpStartVelocity;
      }
    }

    // Are we jumping?
    if (playerController.isJumping) {
      // Check for button released
      if (kb.isUp(KeyCodes.arrowUp)) {
        playerController.isJumping = false;
        playerController.isFalling = true;
        playerController.velY *= playerControllerValues.endJumpDamp;
      }
      // Check for end of jumping
      if (playerController.isJumping) {
        playerController.curJumpTime += elapsedTime;
        if (
          playerController.curJumpTime >= playerControllerValues.maxJumpTime
        ) {
          playerController.isJumping = false;
          playerController.isFalling = true;
          playerController.velY *= playerControllerValues.endJumpDamp;
        }
      }
      if (playerController.isJumping) {
        playerController.velY += elapsedTime * playerControllerValues.jumpAccel;
      }
    }

    if (playerController.isFalling) {
      if (c.y <= 0) {
        playerController.isFalling = false;
        playerController.isOnLand = true;
        playerController.velY = 0;
        c.y = 0;
      }
      if (playerController.isFalling) {
        playerController.velY += elapsedTime * playerControllerValues.fallAccel;
      }
    }

    if (playerController.velY > playerControllerValues.jumpTerminalVelocity) {
      playerController.velY = playerControllerValues.jumpTerminalVelocity;
    }

    if (playerController.velY < playerControllerValues.fallTerminalVelocity) {
      playerController.velY = playerControllerValues.fallTerminalVelocity;
    }

    if (kb.isPressed(KeyCodes.arrowDown)) {
      playerController.isDucking = true;
    } else {
      playerController.isDucking = false;
    }

    if (playerController.isDucking) {
      playAnim(c, animDuck);
    } else {
      if (playerController.isFalling) {
        playAnim(c, animFall, false);
      }
      if (playerController.isJumping) {
        playAnim(c, animFall, false);
      }
      if (playerController.isOnLand) {
        playAnim(c, animRun, false);
      }
    }

    c.y += playerController.velY * elapsedTime;

    if (c.y <= 0) {
      playerController.isFalling = false;
      playerController.isOnLand = true;
      playerController.velY = 0;
      c.y = 0;
    }

    log.x(JSON.stringify(playerController, null, 2));

    // let isJumping = false;

    // let adj = 0;
    // if (kb.isPressed(KeyCodes.arrowUp)) {
    //   isJumping = true;
    //   playAnim(c, animFall);
    // } else if (kb.isPressed(KeyCodes.arrowDown)) {
    //   //adj = 20;
    //   playAnim(c, animDuck);
    // } else {
    //   playAnim(c, animRun, false);
    // }

    let base = 600;

    // if (isJumping) {
    //   c.y += 20;
    // } else {
    //   if (c.y > 0) {
    //     c.y -= 10;
    //   }
    //   if (c.y < 0) {
    //     c.y = 0;
    //   }
    // }

    c.sprite.y = -c.y + base;

    if (c.currentAnimation) {
      c.frameTimeLeft -= elapsedTime;
      if (c.frameTimeLeft < 0) {
        c.frameIndex++;
        if (
          c.frameIndex >= c.currentAnimation.frames.length &&
          c.currentAnimation.loop
        ) {
          c.frameIndex = 0;
        }
        if (c.frameIndex < c.currentAnimation.textures.length) {
          c.sprite.texture = c.currentAnimation.textures[c.frameIndex];
        }
        c.frameTimeLeft = c.currentAnimation.frameTime;
      }
    }
  });
}
