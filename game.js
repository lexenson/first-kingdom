var createKeyboard = require('crtrdg-keyboard')
var keyboard = createKeyboard()

var connectClient = require('./client.js')

var world = require('./world.js')
var unit = require('./unit.js')
var hexagon = require('./hexagon.js')
var HUD = require('./hud.js')
var Menu = require('./menu.js')
var order = require('./order.js')
var player = require('./player.js')

// Global game object
var model = {
  worldModel: null,
  playerModels: {},
  entityModels: {}
}

var game = {
  mode: 'default', // 'move'
  width: window.innerWidth,
  height: window.innerHeight,
  objects: [],
  turn: 1,
  orders: {},
  connected: false,
  playerId: null
}

// States:
// - 'menu'
// - 'playing'
// - 'waiting'
// - 'waiting_for_players'
var state = 'menu'

var hud = new HUD(model, game)

var serverURL = 'http://localhost:8080'
var client = connectClient(serverURL)
client.on('connect', function () {
  game.connected = true
})

var menu = new Menu(0, 100, 100, 100, '#000', '#fff', '#777', 'Arial', keyboard)
menu.addItem('Start new game', function () {
  state = 'waiting_for_players'
  client.emit('newgame')
})

menu.addItem('Join game', function () {
  var gameId = window.prompt('Enter the game id')
  game.id = gameId
  state = 'waiting_for_players'
  client.emit('joingame', gameId)
})

// client handlers

client.on('gameid', function (gameId) {
  console.log('Game:', gameId)
  game.id = gameId
})
client.on('playerid', function (playerId) {
  game.playerId = playerId
  console.log(playerId)
})
client.on('players', function (playerModels) {
  // update new playings joining
  model.playerModels = playerModels
  console.log(playerModels)
})
client.on('start', function (serverModel) {
  model = serverModel
  state = 'playing'
})
client.on('changes', function (serverModel) {
  model = serverModel
  world.unhighlightAll(model.worldModel)
  game.mode = 'default'
  state = 'playing'
})

// Creating canvas
var canvas = document.createElement('canvas')
canvas.width = game.width
canvas.height = game.height
document.body.appendChild(canvas)
var ctx = canvas.getContext('2d')

// keyboard input
keyboard.on('keyup', function (key) {
  if (state === 'menu') {
    if (key === '<down>') menu.down()
    if (key === '<up>') menu.up()
    if (key === '<enter>') menu.select()
    if (key === '<escape>') state = 'playing'
  } else if (state === 'waiting_for_players') {
    if (key === '<enter>') {
      console.log('I am ready.')
      client.emit('ready')
    }
  } else if (state === 'playing') {
    if (key === '<escape>') state = 'menu'

    var currentHex = world.getHightlightedHexagon(model.worldModel)

    // mode-specific commands
    if (game.mode === 'default') {
      if (key === 'M' && currentHex) {
        var unitModelAtHex = unit.getUnitFromCoordinate(model.entityModels, currentHex.x, currentHex.y, currentHex.z)
        if (unitModelAtHex) {
          game.mode = 'move'
        }
      }
    } else if (game.mode === 'move') {
      if (key === 'M') game.mode = 'default'
    }

    // general commands
    if (key === '<enter>') {
      nextTurn()
    }
  }
})

// mouse input
document.onmouseup = function (e) {
  if (state === 'playing') {
    var hexModel = world.getHexagonFromPixel(model.worldModel, e.pageX, e.pageY)
    var unitModel = unit.getUnitFromCoordinate(model.entityModels, hexModel.x, hexModel.y, hexModel.z)
    if (game.mode === 'move' && hexModel) {
      var lastHexModel = world.getHightlightedHexagon(model.worldModel)
      var lastUnitModel = unit.getUnitFromCoordinate(model.entityModels, lastHexModel.x, lastHexModel.y, lastHexModel.z)
      if (lastHexModel && lastUnitModel && hexagon.isAdjacent(lastHexModel, hexModel)) {
        if (!unitModel) {
          // create moveUnit order
          var orderInfo = {
            pos: {
              x: hexModel.x,
              y: hexModel.y
            }
          }

          // adding the order to the game info; overwriting any previous orders for the same unit
          var orderModel = order.createModel('moveUnit', orderInfo, lastUnitModel.id)
          game.orders[lastUnitModel.id] = orderModel

          // issuing a move order deselects current unit
          world.unhighlightAll(model.worldModel)
          game.mode = 'default'
        }
      }
    }
    if (game.mode === 'default') {
      world.unhighlightAll(model.worldModel)
      if (hexModel && unitModel) {
        if (unitModel.playerId === game.playerId) {
          hexModel.highlighted = true
        }
      }
    }
  }
}

// additional game logic

function nextTurn () {
  client.emit('orders', game.orders)
  game.orders = {}
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

function update (dt) {
  if (state === 'playing') {
    hud.update(dt)

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

    // unit drawing
    Object.keys(model.entityModels).forEach(function (entityId) {
      var entity = model.entityModels[entityId]
      if (entity.type === 'unit') {
        unit.draw(entity, model.worldModel, ctx)
      }
    })

    // order drawing
    Object.keys(game.orders).forEach(function (unitModelId) {
      var orderModel = game.orders[unitModelId]
      order.draw(orderModel, model.worldModel, model.entityModels, ctx)
    })

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
  } else if (state === 'waiting_for_players') {
    player.drawPlayerList(model.playerModels, game.playerId, game.id, ctx)
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
