var createKeyboard = require('crtrdg-keyboard')

var World = require('./world.js')
var Player = require('./player.js')
var Unit = require('./unit.js')
var HUD = require('./hud.js')

// Global game object
var game = {
  mode: 'default', // 'move'
  world: null,
  width: window.innerWidth,
  height: window.innerHeight,
  objects: [],
  players: [],
  turn: 1
}

var hud = new HUD(game)

init()

// Creating canvas
var canvas = document.createElement('canvas')
canvas.width = game.width
canvas.height = game.height
document.body.appendChild(canvas)
var ctx = canvas.getContext('2d')

// keyboard input
var keyboard = createKeyboard()
keyboard.on('keydown', function (key) {
  var currentHex = game.world.getHightlightedHexagon()

  // mode-specific commands
  if (game.mode === 'default') {
    if (key === 'M' && currentHex && currentHex.info.unit) game.mode = 'move'
  } else if (game.mode === 'move') {
    if (key === 'M') game.mode = 'default'
  }

  // general commands
  if (key === '<enter>') {
    nextTurn()
  }
})

// mouse input
document.onmouseup = function (e) {
  var hex = game.world.getHexagonFromPixel(e.pageX, e.pageY)
  if (game.mode === 'move' && hex) {
    var lastHex = game.world.getHightlightedHexagon()
    if (lastHex && lastHex.info.unit && lastHex.isAdjacent(hex)) {
      if (!hex.info.unit) {
        lastHex.info.unit.moveTo(hex)
        game.world.unhighlightAll()
        hex.highlighted = true
      }
    }
  }
  if (game.mode === 'default') {
    game.world.unhighlightAll()
    if (hex && hex.info.unit) hex.highlighted = true
  }
}

// additional game logic

function nextTurn () {
  game.turn++
  game.world.distributeResources()
}

// main game functions
function main () {
  now = timestamp()
  dt = (now - last) / 1000 // in ms
  totalTime += dt
  while (dt > step) {
    dt = dt - step
    update(dt)
  }
  draw(totalTime)

  last = now

  window.requestAnimationFrame(main)
}

function init () {
  game.world = new World(12, 12, game) // map

  game.players.push(new Player(1))

  var hex = game.world.hexagons['0,0']
  var unit = new Unit(hex, 1)
  game.players[0].addUnit(unit)

  game.objects = [game.world, unit]
}

function update (dt) {
  hud.update(dt)

  for (var i = 0; i < game.objects.length; i++) {
    if (game.objects[i].update) {
      game.objects[i].update(dt)
    }
  }
}

function draw (dt) {
  // clears the context in preparation for redrawing
  ctx.fillStyle = '#D8D3D0'
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  for (var i = 0; i < game.objects.length; i++) {
    if (game.objects[i].draw) {
      game.objects[i].draw(ctx)
    }
  }

  // drawing the highlight on selected hexagon
  var hightlightedHex = game.world.getHightlightedHexagon()
  if (hightlightedHex) hightlightedHex.drawHighlight(ctx, dt)

  hud.draw(ctx)
}

function timestamp () {
  return window.performance && window.performance.now ? window.performance.now() : new Date().getTime()
}
// Running the Game
var now, dt
var step = 1 / 60
var last = timestamp()
var totalTime = 0
window.requestAnimationFrame(main)
