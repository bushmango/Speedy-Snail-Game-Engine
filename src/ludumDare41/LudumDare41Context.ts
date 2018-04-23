
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
import { ModeBar } from 'ludumDare41/ui/ModeBar2';
import io from 'socket.io-client';
import { EffectManager } from 'ludumDare41/entities/Effect';
import { BulletManager } from 'ludumDare41/entities/Bullet';
import { PowerupManager } from 'ludumDare41/entities/Powerup';

const showSplashScreen = false
const useLocalServer = false
//const testServerAddress = 'http://localhost:4002'
//const testServerAddress = 'http://192.168.0.113:4041'
const testServerAddress = 'https://ludumdare41.steviebushman.com'



export class LudumDare41Context {

  sge: SimpleGameEngine

  menuManager = new MenuManager()
  splash: SplashScreen

  rootContainer: PIXI.Container

  layerObjects: PIXI.Container
  layerEffects: PIXI.Container
  layerPowerups: PIXI.Container
  layerCards: PIXI.Container
  layerBullets: PIXI.Container

  gameMap = new GameMap()
  ninjas = new NinjaManager()
  cards = new CardManager()
  modeBar = new ModeBar()
  effects = new EffectManager()
  bullets = new BulletManager()
  powerups = new PowerupManager()

  socket: any
  playerId: number

  commandRunner = new CommandRunnerClient()
  localServer = new Server()

  scale = 3
  mx = 50
  my = 50

  textMode: PIXI.extras.BitmapText
  textAlive: PIXI.extras.BitmapText

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
    this.layerPowerups = this.addLayer()
    this.layerBullets = this.addLayer()
    this.layerEffects = this.addLayer()
    this.layerCards = this.addLayer()
    this.addLayer(this.menuManager.menuManager.container)
    this.addLayer(this.menuManager.container)

    this.setLayerSettings(this.gameMap.tileMap.containers[0])
    this.setLayerSettings(this.layerObjects)
    this.setLayerSettings(this.layerBullets)
    this.setLayerSettings(this.layerEffects)
    this.setLayerSettings(this.layerPowerups)

    this.effects.init(this, this.layerEffects)
    this.bullets.init(this, this.layerBullets)

    for (let i = 0; i < 10; i++) {
      // this.effects.createAt(i, i)
      // this.bullets.createAt(i, i, 0)
    }

    this.powerups.init(this, this.layerPowerups)
    this.ninjas.init(this)
    // this.addLayer(this.ninjas.container)
    // this.ninjas.createAt(0, 0)
    // this.ninjas.createAt(2, 0)
    // this.ninjas.createAt(0, 3)
    // this.ninjas.createAt(3, 3)

    this.cards.init(this)

    let cardSize = 4 * 8 * 3
    let cx = this.mx + cardSize / 2
    let cy = this.my + 22 * 8 * this.scale + cardSize / 2 + 2 + 12 * this.scale
    this.layerCards.position.set(cx, cy)
    this.layerCards.scale.set(4)

    for (let i = 0; i < 6; i++) {
      //this.cards.createAt((8 * 3 + 2) * i, 0)
      this.cards.createAt((8 * 3 + 2) * 0, 0)
    }

    this.sge.stage.addChild(this.rootContainer)
    if (showSplashScreen) {
      this.sge.stage.addChild(this.splash.container)
    }

    // Setup local server
    this.commandRunner.init(this)

    if (useLocalServer) {
      this.localServer.onLocalMessage = (message) => {
        this.commandRunner.run(message)
      }
      this.localServer.init(true)
      let player = this.localServer.addPlayer(false)
      this.localServer.localPlayer = player
      this.playerId = player.id
    } else {
      this.socket = io(testServerAddress, {
        reconnection: false,
        transports: ['websocket'],
      });
      this.socket.on('connect', () => {
        console.log('W>', 'connected')
      });
      this.socket.on('event', (message) => {
        console.log('W>', 'event', message)
        this.commandRunner.run(message)
      });
      this.socket.on('disconnect', () => {
        console.log('W>', 'disconnect')
      });
    }

    this.textMode = new PIXI.extras.BitmapText(``, { font: '8px defaultfont', align: 'left' })
    this.textMode.anchor = new PIXI.Point(0, 0)
    this.rootContainer.addChild(this.textMode)
    this.textMode.position.set(5, 20)
    this.textMode.scale.set(3)

    this.textAlive = new PIXI.extras.BitmapText(``, { font: '8px defaultfont', align: 'left' })
    this.textAlive.anchor = new PIXI.Point(0, 0)
    this.rootContainer.addChild(this.textAlive)
    this.textAlive.position.set(500, 2)
    this.textAlive.scale.set(2)

    this.modeBar.init(this)
    this.rootContainer.addChild(this.modeBar.container)

  }

  onChoseCard = (cardInfo: ICard, dir: number) => {
    this.sendCommandToServer({
      command: 'play',
      cardName: cardInfo.name,
      direction: dir,
    })
  }

  sendCommandToServer(clientMessage: IClientMesssage) {
    if (useLocalServer) {
      // TODO: actually send to server
      console.log('send command', clientMessage)
      this.localServer.receiveLocal(clientMessage)
    } else {
      this.socket.emit('event', clientMessage)
    }
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
    this.bullets.update()
    this.cards.update()
    this.menuManager.update()
    this.modeBar.update()
    this.powerups.update()
    this.effects.update()

    // Update title

    this.textMode.text = 'Trying to connect to server...'

    if (this.playerId) {
      this.textMode.text = 'Trying to connect to server...' + this.playerId
      _.forEach(this.ninjas.items, c => {
        if (c.id === this.playerId) {

          if (c.isAlive) {
            this.textMode.text = 'You are the green human! Survive the longest'

            if (c.className && c.className !== 'human') {
              if (c.className === 'robot') {
                this.textMode.text = 'You are a killer death robot'
              }
              if (c.className === 'wizard') {
                this.textMode.text = "You're a wizard, Harry!"
              }
              if (c.className === 'ninja') {
                this.textMode.text = "You're a ninja!"
              }
              if (c.className === 'cat') {
                this.textMode.text = "You're a cat!"
              }
              if (c.className === 'pirate') {
                this.textMode.text = "You're a pirate bandit!"
              }
            }

          }
          else {
            this.textMode.text = 'You are dead! Respawn or wait for the next round'
          }

        }
      })
    }


  }

}

