// declare var PIXI

// See: https://github.com/kittykatattack/learningPixi

const { Rectangle, Sprite } = PIXI
const { TextureCache } = PIXI.utils

let pixiMode = 'unknown'
export function run() {

  console.log('Running tutorial 1')

  // Create the renderer
  let renderer = PIXI.autoDetectRenderer(
    256, 256,
    {
      antialias: false,
      transparent: false,
      resolution: 1,
    }
  )
  if (renderer instanceof PIXI.CanvasRenderer) {
    pixiMode = 'canvas'
  } else {
    pixiMode = 'openGl'
  }
  // renderer.backgroundColor = 0x061639
  renderer.view.style.position = "absolute"
  renderer.view.style.display = "block"
  renderer.autoResize = true
  renderer.resize(window.innerWidth, window.innerHeight)
  document.body.appendChild(renderer.view)

  let stage = new PIXI.Container()
  renderer.render(stage)

  PIXI.loader.on("progress", onloaderProgress)
  PIXI.loader
    .add("public/images/test-ship.png")
    .add("public/images/test-tileset.png")
    .load(onLoaded)

  function onloaderProgress(loader, resource) {
    console.log(loader.progress + "%" + " - " + resource.url)
  }

  let rocket: PIXI.Sprite = null
  let message: PIXI.Text = null
  function onLoaded() {

    // Simple Sprite
    let sprite = new Sprite(
      PIXI.loader.resources["public/images/test-ship.png"].texture
    )

    sprite.x = 96
    sprite.y = 96
    sprite.scale.set(2, 2)
    sprite.rotation = 0.5

    stage.addChild(sprite)

    // Tileset sprite
    // Create the `tileset` sprite from the texture
    let texture = TextureCache["public/images/test-tileset.png"]

    let size = 32

    let rectangle = new Rectangle(size * 3, size * 2, size, size)
    texture.frame = rectangle
    rocket = new Sprite(texture)

    // Position the rocket sprite on the canvas
    rocket.x = 32
    rocket.y = 32

    // Add the rocket to the stage
    stage.addChild(rocket)


    message = new PIXI.Text(
      "Hello Pixi!",
      { fontFamily: "Arial", fontSize: 32, fill: "white" }
    );

    message.position.set(0, 0);
    stage.addChild(message);

    renderer.render(stage)

    // Start game loop
    gameLoop()
  }

  let frameNum = 0
  function gameLoop() {

    // Loop this function at 60 frames per second
    requestAnimationFrame(gameLoop)

    // Update the current game state:
    frameNum++
    message.text = '' + frameNum + ' (' + pixiMode + ')'
    stateUpdate()

    // Render the stage to see the animation
    renderer.render(stage)
  }

  function stateUpdate() {
    rocket.x += 1
  }

}

