var createKeyboard = require('crtrdg-keyboard')
var keyboard = createKeyboard()

var client = require('./client.js')

var world = require('./world.js')
var player = require('./player.js')
var unit = require('./unit.js')
var hexagon = require('./hexagon.js')
var HUD = require('./hud.js')
var Menu = require('./menu.js')

// Global game object
var model = {
  worldModel: null,
  playerModels: []
}

var game = {
  mode: 'default', // 'move'
  width: window.innerWidth,
  height: window.innerHeight,
  objects: [],
  turn: 1,
  orders: [],
  connected: false
}

// States:
// - 'menu'
// - 'playing'
// - 'waiting'
var state = 'menu'

var hud = new HUD(model, game)

var serverURL = 'http://localhost:8080'

var menu = new Menu(0, 100, 100, 100, '#000', '#fff', '#777', 'Arial', keyboard)
menu.addItem('Start', function () {
  client.setReady()
  state = 'waiting'
})
menu.addItem('Connect', function () {
  client.connect(serverURL, function () {
    game.connected = true
    client.receiveStart(function (worldModel) {
      model.worldModel = worldModel
      init()
      state = 'playing'
    })
    client.receiveChanges(function (changes) {
      state = 'playing'
    })
  })
})

// Creating canvas
var canvas = document.createElement('canvas')
canvas.width = game.width
canvas.height = game.height
document.body.appendChild(canvas)
var ctx = canvas.getContext('2d')

// keyboard input
keyboard.on('keyup', function (key) {
  if (state === 'playing') {
    var currentHex = world.getHightlightedHexagon(model.worldModel)

    // mode-specific commands
    if (game.mode === 'default') {
      if (key === 'M' && currentHex && currentHex.info.unitModel) game.mode = 'move'
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
    var hexModel = world.getHexagonFromPixel(model.worldModel, e.pageX, e.pageY)
    if (game.mode === 'move' && hexModel) {
      var lastHexModel = world.getHightlightedHexagon(model.worldModel)
      if (lastHexModel && lastHexModel.info.unitModel && hexagon.isAdjacent(lastHexModel, hexModel)) {
        if (!hexModel.info.unitModel) {
          unit.moveTo(lastHexModel.info.unitModel, hexModel, game.orders)
          world.unhighlightAll(model.worldModel)
          hexModel.highlighted = true
        }
      }
    }
    if (game.mode === 'default') {
      world.unhighlightAll(model.worldModel)
      if (hexModel && hexModel.info.unitModel) hexModel.highlighted = true
    }
  }
}

// additional game logic

function nextTurn () {
  client.sendOrders(game.orders) // TODO: implement orders
  game.orders = []
  state = 'waiting'
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
  model.playerModels.push(player.createModel(1))

  var hexModel = world.getHexagonFromCoordinate(model.worldModel, 0, 0)
  var unitModel = unit.createModel(hexModel, 1)

  player.addUnit(model.playerModels[0], unitModel)
}

function update (dt) {
  if (state === 'playing') {
    hud.update(dt)

    world.update(model.worldModel, dt)
    // for (var i = 0; i < game.objects.length; i++) {
    //   if (game.objects[i].update) {
    //     game.objects[i].update(dt)
    //   }
    // }
  }
}

function draw (totalTime) {
  // clears the context in preparation for redrawing
  ctx.fillStyle = '#D8D3D0'
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  if (state === 'playing') {
    // for (var i = 0; i < game.objects.length; i++) {
    //   if (game.objects[i].draw) {
    //     game.objects[i].draw(ctx)
    //   }
    // }
    world.draw(model.worldModel, ctx)
    unit.draw(model.playerModels[0].unitModels[0], ctx)

    // drawing the highlight on selected hexagon
    var hightlightedHexModel = world.getHightlightedHexagon(model.worldModel)

    // drawing overlay on reachable tiles
    if (game.mode === 'move') {
      if (hightlightedHexModel) {
        hexagon.drawReachableHighlight(hightlightedHexModel, ctx, model.worldModel)
      }
    }

    if (hightlightedHexModel) hexagon.drawHighlight(hightlightedHexModel, ctx, totalTime)

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
