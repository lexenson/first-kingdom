var createKeyboard = require('crtrdg-keyboard')
var keyboard = createKeyboard()

var World = require('./world.js')
var Player = require('./player.js')
var Unit = require('./unit.js')
var HUD = require('./hud.js')
var Menu = require('./menu.js')

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

// States:
// - 'menu'
// - 'playing'
var state = 'menu'

var hud = new HUD(game)

var menu = new Menu(0, 100, 100, 100, '#000', '#fff', '#777', 'Arial', keyboard)
menu.addItem('Start', function () {
  state = 'playing'
})

init()

// Creating canvas
var canvas = document.createElement('canvas')
canvas.width = game.width
canvas.height = game.height
document.body.appendChild(canvas)
var ctx = canvas.getContext('2d')

// keyboard input
keyboard.on('keyup', function (key) {
  if (state === 'playing') {
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
  }
})

keyboard.on('keydown', function (key) {
  if (state === 'menu') {
    if (key === '<down>') menu.down()
    if (key === '<up>') menu.up()
    if (key === '<enter>') menu.select()
    if (key === '<escape>') state = 'playing'
  } else if (state === 'playing') {
    if (key === '<escape>') state = 'menu'
  }
})

// mouse input
document.onmouseup = function (e) {
  if (state === 'playing') {
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
  if (state === 'playing') {
    hud.update(dt)

    for (var i = 0; i < game.objects.length; i++) {
      if (game.objects[i].update) {
        game.objects[i].update(dt)
      }
    }
  }
}

function draw (totalTime) {
  // clears the context in preparation for redrawing
  ctx.fillStyle = '#D8D3D0'
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  if (state === 'playing') {
    for (var i = 0; i < game.objects.length; i++) {
      if (game.objects[i].draw) {
        game.objects[i].draw(ctx)
      }
    }

    // drawing the highlight on selected hexagon
    var hightlightedHex = game.world.getHightlightedHexagon()

    // drawing overlay on reachable tiles
    if (game.mode === 'move') {
      if (hightlightedHex) hightlightedHex.drawReachableHighlight(ctx, game.world)
    }

    if (hightlightedHex) hightlightedHex.drawHighlight(ctx, totalTime)

    hud.draw(ctx)
  } else if (state === 'menu') {
    menu.draw(ctx, totalTime)
  }
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
