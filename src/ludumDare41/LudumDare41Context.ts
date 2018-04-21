
const { Rectangle, Sprite } = PIXI
const { TextureCache } = PIXI.utils

import { _ } from 'engine/importsEngine'
import { SimpleGameEngine } from 'engine/SimpleGameEngine'
import { GamepadTester } from 'engine/gamepad/GamepadTester'
import { InputControl } from 'engine/gamepad/InputControl'

import { ParticleEmitter } from 'engine/particles/ParticleEmitter'

import { MenuManager } from 'ludumDareStart/menu/MenuManager'
import { SplashScreen } from 'engine/misc/SplashScreen'
import { Ninja, NinjaManager } from 'ludumDare41/entities/Ninja'
import { Card, CardManager } from 'ludumDare41/entities/Card'
import { Server } from 'ludumDare41/server/Server';
import { CommandRunnerClient } from 'ludumDare41/server/CommandRunnerClient';
import { ICard } from 'ludumDare41/server/CardInfo';
import { IClientMesssage } from 'ludumDare41/server/IMessage';
import { GameMap } from 'ludumDare41/entities/GameMap'

const showSplashScreen = false

export class LudumDare41Context {


  sge: SimpleGameEngine

  menuManager = new MenuManager()
  splash: SplashScreen

  rootContainer: PIXI.Container

  layerObjects: PIXI.Container
  layerCards: PIXI.Container

  gameMap = new GameMap()
  ninjas = new NinjaManager()
  cards = new CardManager()

  commandRunner = new CommandRunnerClient()
  localServer = new Server()

  scale = 3
  mx = 50
  my = 50

  setLayerSettings(layer: PIXI.Container) {

    layer.position.set(this.mx, this.my)
    layer.scale.set(this.scale)
  }

  onLoaded(_sge: SimpleGameEngine) {
    this.sge = _sge

    this.rootContainer = new PIXI.Container()

    this.menuManager.init(this.sge)

    if (showSplashScreen) {
      this.rootContainer.visible = false
      this.splash = new SplashScreen()
      this.splash.init(this.sge, 'prariesnailgames', () => {
        this.rootContainer.visible = true
      })
    }

    this.gameMap.init(this)

    // Add layers    
    this.addLayer(this.gameMap.tileMap.containers[0])
    this.layerObjects = this.addLayer()
    this.layerCards = this.addLayer()
    this.addLayer(this.menuManager.menuManager.container)
    this.addLayer(this.menuManager.container)

    this.setLayerSettings(this.gameMap.tileMap.containers[0])
    this.setLayerSettings(this.layerObjects)

    this.ninjas.init(this)
    // this.addLayer(this.ninjas.container)
    this.ninjas.createAt(0, 0)
    this.ninjas.createAt(2, 0)
    this.ninjas.createAt(0, 3)
    this.ninjas.createAt(3, 3)

    this.cards.init(this)

    let cardSize = 4 * 8 * 3
    let cx = this.mx + cardSize / 2
    let cy = this.my + 22 * 8 * this.scale + cardSize / 2 + 2
    this.layerCards.position.set(cx, cy)
    this.layerCards.scale.set(4)

    for (let i = 0; i < 6; i++) {
      this.cards.createAt((8 * 3 + 2) * i, 0)
    }

    this.sge.stage.addChild(this.rootContainer)
    if (showSplashScreen) {
      this.sge.stage.addChild(this.splash.container)
    }

    // Setup local server
    this.commandRunner.init(this)
    this.localServer.onLocalMessage = (message) => {
      this.commandRunner.run(message)
    }
    this.localServer.init(true)
    let player = this.localServer.addPlayer()
    this.localServer.localPlayer = player

  }

  onChoseCard = (cardInfo: ICard, dir: number) => {
    this.sendCommandToServer({
      command: 'play',
      cardName: cardInfo.name,
      direction: dir,
    })
  }

  sendCommandToServer(clientMessage: IClientMesssage) {
    // TODO: actually send to server
    console.log('send command', clientMessage)
    this.localServer.receiveLocal(clientMessage)
  }

  addLayer(container: PIXI.Container = null) {
    if (!container) {
      container = new PIXI.Container()
    }
    this.rootContainer.addChild(container)
    return container
  }

  onUpdate() {
    if (showSplashScreen) {
      this.splash.update()
    }
    this.gameMap.update()
    this.ninjas.update()
    this.cards.update()
    this.menuManager.update()
  }


}

