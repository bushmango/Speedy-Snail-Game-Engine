const { Rectangle, Sprite } = PIXI;
const { TextureCache } = PIXI.utils;

import { _ } from "engine/importsEngine";
import { SimpleGameEngine } from "engine/SimpleGameEngine";
import { GamepadTester } from "engine/gamepad/GamepadTester";
import { InputControl } from "engine/gamepad/InputControl";

import * as parallaxLayers from "./parallaxLayers";
import * as log from "./log";

const showSplashScreen = false;
const useLocalServer = false;

export class ParallaxContext {
  sge: SimpleGameEngine;

  rootContainer: PIXI.Container;

  layerP1: PIXI.Container;
  layerP2: PIXI.Container;
  layerP3: PIXI.Container;
  layerP4: PIXI.Container;
  layerP5: PIXI.Container;

  onLoaded(_sge: SimpleGameEngine) {
    let ctx = this;

    ctx.sge = _sge;
    ctx.rootContainer = new PIXI.Container();

    ctx.layerP1 = this.addLayer();
    ctx.layerP2 = this.addLayer();
    ctx.layerP3 = this.addLayer();
    ctx.layerP4 = this.addLayer();
    ctx.layerP5 = this.addLayer();

    parallaxLayers.create(ctx, ctx.layerP1, 0.25, 0.5, 25);
    parallaxLayers.create(ctx, ctx.layerP2, 0.5, 1, 90);
    parallaxLayers.create(ctx, ctx.layerP3, 1, 2, 200);
    parallaxLayers.create(ctx, ctx.layerP4, 1.5, 3, 300);
    parallaxLayers.create(ctx, ctx.layerP5, 2, 4, 500);

    ctx.sge.stage.addChild(ctx.rootContainer);
    //this.rootContainer.addChild(this.modeBar.container)
  }

  addLayer(container: PIXI.Container = null) {
    if (!container) {
      container = new PIXI.Container();
    }
    this.rootContainer.addChild(container);
    return container;
  }

  onUpdate() {
    let ctx = this;
    log.x("update");

    parallaxLayers.updateLayers(ctx);
  }
}
