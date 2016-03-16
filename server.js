var socketio = require('socket.io')

var world = require('./world.js')
var player = require('./player.js')
var unit = require('./unit.js')
var entity = require('./entity.js')

var io = socketio()

var model = {
  worldModel: null,
  playerModels: [],
  entityModels: {}
}

var worldWidth = 12
var worldHeight = 12
var currentPlayerId = 1

function initializeGame () {
  model.worldModel = world.createModel(worldWidth, worldHeight)

  model.playerModels.forEach(function (playerModel) {
    var unitModel = unit.createModel(
      Math.round(Math.random() * (worldWidth - 1)),
      Math.round(Math.random() * (worldHeight - 1)),
      playerModel.id
    )
    entity.add(model.entityModels, unitModel)
    player.addUnit(playerModel, unitModel, model.worldModel)
  })

  return model
}

function applyOrders (model, orders) {
  Object.keys(orders).forEach(function (entityModelId) {
    var orderModel = orders[entityModelId]
    var entityModel = entity.getFromId(model.entityModels, entityModelId)
    if (orderModel.type === 'moveUnit') {
      var serverHexModel = world.getHexagonFromCoordinate(model.worldModel, orderModel.info.pos.x, orderModel.info.pos.y)
      unit.moveTo(entityModel, serverHexModel)
    }
  })
}

function getSockets () {
  var sockets = []
  for (var socketid in io.sockets.sockets) {
    if (io.sockets.sockets.hasOwnProperty(socketid)) sockets.push(io.sockets.sockets[socketid])
  }
  return sockets
}

io.on('connection', function (socket) {
  // new client connected
  socket.ready = false
  socket.orders = null
  socket.playerId = currentPlayerId
  console.log('Player', currentPlayerId, 'joined.')
  model.playerModels.push(player.createModel(socket.playerId))
  currentPlayerId++

  socket.emit('playerid', socket.playerId)

  socket.on('ready', function () {
    socket.ready = true
    var sockets = getSockets()
    var allReady = sockets.every(function (s) {
      return s.ready
    })
    if (allReady) {
      // initialize Game
      model = initializeGame()
      io.sockets.emit('start', model)
    }
  })

  socket.on('orders', function (orders) {
    applyOrders(model, orders)
    socket.orders = orders
    var allOrdersSent = getSockets().every(function (s) {
      return !!s.orders
    })
    if (allOrdersSent) {
      getSockets().forEach(function (s) {
        s.orders = null
      })
      io.sockets.emit('changes', model)
    }
  })
})
io.listen(8080)
