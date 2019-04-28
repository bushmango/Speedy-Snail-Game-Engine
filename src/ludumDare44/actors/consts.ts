function dirToOxy(dir: number) {
  let ox = 0
  let oy = 0
  switch (dir) {
    case 0:
      ox = 0
      oy = -1
      break
    case 1:
      ox = 1
      oy = 0
      break
    case 2:
      ox = 0
      oy = 1
      break
    case 3:
      ox = -1
      oy = 0
      break
  }
  return { ox, oy }
}

function turnRight(dir: number) {
  dir++
  if (dir > 3) {
    dir = 0
  }
  return dir
}
function turnLeft(dir: number) {
  dir--
  if (dir < 0) {
    dir = 3
  }
  return dir
}

export const consts = {
  gridWidth: 32,
  gridHeight: 32,
  blockSize: 32,
  dirToOxy,
  turnRight,
  turnLeft,
}
