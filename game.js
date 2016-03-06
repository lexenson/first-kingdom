var World = require('./world.js')

var world = new World(12, 12) // map

var gameObjects = [ world ]

// Creating canvas
var canvas = document.createElement('canvas')
canvas.width = 1000
canvas.height = 500
document.body.appendChild(canvas)
var ctx = canvas.getContext('2d')

// Game variables
// var game_state = ['menu', 'paused', 'running']
// var current_state = game_state[0] // game starts in menu

// input
var keyState = {}
keyState.left = false
keyState.right = false
keyState.up = false
keyState.down = false
keyState.numpad1 = false
keyState.numpad1 = false
keyState.numpad2 = false
keyState.numpad3 = false
keyState.numpad4 = false
keyState.numpad5 = false
keyState.numpad6 = false
keyState.numpad7 = false
keyState.numpad8 = false
keyState.numpad9 = false

window.addEventListener('keyup', keyUpHandler, false)

window.addEventListener('keydown', keyDownHandler, false)

function keyUpHandler (event) {
  event.preventDefault()
  if (event.keyCode === 37) {
    keyState.left = false
    event.preventDefault()
  } else if (event.keyCode === 38) {
    keyState.up = false
    event.preventDefault()
  } else if (event.keyCode === 39) {
    keyState.right = false
    event.preventDefault()
  } else if (event.keyCode === 40) {
    keyState.down = false
    event.preventDefault()
  } else if (event.keyCode === 97) {
    keyState.down = false
    event.preventDefault()
  } else if (event.keyCode === 98) {
    keyState.down = true
    event.preventDefault()
  } else if (event.keyCode === 99) {
    keyState.down = true
    event.preventDefault()
  } else if (event.keyCode === 100) {
    keyState.down = true
    event.preventDefault()
  } else if (event.keyCode === 101) {
    keyState.down = true
    event.preventDefault()
  } else if (event.keyCode === 102) {
    keyState.down = true
    event.preventDefault()
  } else if (event.keyCode === 103) {
    keyState.down = true
    event.preventDefault()
  } else if (event.keyCode === 104) {
    keyState.down = true
    event.preventDefault()
  } else if (event.keyCode === 105) {
    keyState.down = true
    event.preventDefault()
  }
}

function keyDownHandler (event) {
  if (event.keyCode === 37) {
    keyState.left = true
    event.preventDefault()
  } else if (event.keyCode === 38) {
    keyState.up = true
    event.preventDefault()
  } else if (event.keyCode === 39) {
    keyState.right = true
    event.preventDefault()
  } else if (event.keyCode === 40) {
    keyState.down = true
    event.preventDefault()
  } else if (event.keyCode === 97) {
    keyState.down = false
    event.preventDefault()
  } else if (event.keyCode === 98) {
    keyState.down = false
    event.preventDefault()
  } else if (event.keyCode === 99) {
    keyState.down = false
    event.preventDefault()
  } else if (event.keyCode === 100) {
    keyState.down = false
    event.preventDefault()
  } else if (event.keyCode === 101) {
    keyState.down = false
    event.preventDefault()
  } else if (event.keyCode === 102) {
    keyState.down = false
    event.preventDefault()
  } else if (event.keyCode === 103) {
    keyState.down = false
    event.preventDefault()
  } else if (event.keyCode === 104) {
    keyState.down = false
    event.preventDefault()
  } else if (event.keyCode === 105) {
    keyState.down = false
    event.preventDefault()
  }
}

// mouse

document.onmousemove = function (e) {
  var hex = world.getHexagonFromPixel(e.pageX, e.pageY)
  if (hex) hex.color = '#ff0000'
}

// main game functions
function main () {
  now = timestamp()
  dt = (now - last) / 1000 // in ms
  while (dt > step) {
    dt = dt - step
    update(dt)
  }
  draw(dt)

  last = now

  window.requestAnimationFrame(main)
}

function init () {
}

function update (dt) {
  for (var i = 0; i < gameObjects.length; i++) {
    if (gameObjects[i].update) {
      gameObjects[i].update(dt)
    }
  }
}

function draw (dt) {
  // clears the context in preparation for redrawing
  ctx.fillStyle = '#D8D3D0'
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  for (var i = 0; i < gameObjects.length; i++) {
    if (gameObjects[i].draw) {
      gameObjects[i].draw(ctx)
    }
  }
}

function timestamp () {
  return window.performance && window.performance.now ? window.performance.now() : new Date().getTime()
}
// Running the Game
var now, dt
var step = 1 / 60
var last = timestamp()
init()
window.requestAnimationFrame(main)
