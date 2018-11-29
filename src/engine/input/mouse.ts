// see : https://stackoverflow.com/questions/322378/javascript-check-if-mouse-button-down
let mouseDown = [false, false, false, false, false, false]
document.body.onmousedown = (evt) => {
  // console.log('onmousedown', evt.button)
  mouseDown[evt.button] = true
}
document.body.onmouseup = (evt) => {
  // console.log('onmouseup')
  mouseDown[evt.button] = false
}
document.body.oncontextmenu = () => {
  // Disable right click context menu
  return false
}

let isLeftDown = false
let isLeftJustDown = false
let isLeftJustUp = false

let isRightDown = false
let isRightJustDown = false
let isRightJustUp = false

let x = 0
let y = 0

let isConsumedThisFrame = false

// Call once per update cycle
export function scan(mouseX, mouseY) {
  x = mouseX
  y = mouseY

  // reset consumption
  isConsumedThisFrame = false

  let newIsLeftDown = mouseDown[0]
  isLeftJustDown = false
  isLeftJustUp = false
  if (newIsLeftDown !== isLeftDown) {
    isLeftJustDown = newIsLeftDown
    isLeftJustUp = !newIsLeftDown
  }
  isLeftDown = newIsLeftDown

  let newIsRightDown = mouseDown[2] || mouseDown[3]
  isRightJustDown = false
  isRightJustUp = false
  if (newIsRightDown !== isRightDown) {
    isRightJustDown = newIsRightDown
    isRightJustUp = !newIsRightDown
  }
  isRightDown = newIsRightDown
}
export function consume() {
  isConsumedThisFrame = true
}
export function getMouse() {
  return {
    isLeftDown,
    isLeftJustDown,
    isLeftJustUp,
    isRightDown,
    isRightJustDown,
    isRightJustUp,
    x,
    y,
    isConsumedThisFrame,
  }
}
