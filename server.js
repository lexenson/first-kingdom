var socketio = require('socket.io')
var randomString = require('randomString')

var world = require('./world.js')
var player = require('./player.js')
var unit = require('./unit.js')
var entity = require('./entity.js')

var io = socketio()

var models = {}

var worldRadius = 6
var currentPlayerId = 1

function initializeGame (model) {
  model.entityModels = {}
  model.worldModel = world.createModel(worldRadius)

  Object.keys(model.playerModels).forEach(function (playerId) {
    var playerModel = model.playerModels[playerId]
    var randomHexagonModel = world.getRandomHexagon(model.worldModel)
    var unitModel = unit.createModel(
      randomHexagonModel.x,
      randomHexagonModel.y,
      playerModel.id
    )
    entity.add(model.entityModels, unitModel)
  })
  world.updateTileOwnership(model.worldModel, model.entityModels)

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

function removePlayer (playerModels, playerId) {
  delete playerModels[playerId]
}

io.on('connection', function (socket) {
  // new client connected
  socket.gameId = null

  function newPlayer () {
    var model = models[socket.gameId]
    console.log('Player', currentPlayerId, 'joined', socket.gameId)
    socket.playerId = currentPlayerId
    model.playerModels[currentPlayerId] = player.createModel(socket.playerId)
    currentPlayerId++

    socket.emit('playerid', socket.playerId)
    io.to(socket.gameId).emit('players', model.playerModels)
  }

  socket.on('newgame', function () {
    var gameId = randomString.generate(7)
    models[gameId] = {
      playerModels: {}
    }
    socket.gameId = gameId
    socket.emit('gameid', gameId)
    socket.join(gameId)
    newPlayer()
  })

  socket.on('joingame', function (gameId) {
    socket.join(gameId)
    socket.gameId = gameId
    newPlayer()
  })

  socket.on('ready', function () {
    var model = models[socket.gameId]
    var playerModel = model.playerModels[socket.playerId]
    playerModel.ready = true
    io.to(socket.gameId).emit('players', model.playerModels)
    var allReady = Object.keys(model.playerModels).every(function (playerId) {
      return model.playerModels[playerId].ready
    })
    if (allReady) {
      // initialize Game
      model = initializeGame(model)
      io.to(socket.gameId).emit('start', model)
    }
  })

  socket.on('orders', function (orders) {
    var model = models[socket.gameId]
    var playerModel = model.playerModels[socket.playerId]
    applyOrders(model, orders)
    playerModel.orders = orders
    var allOrdersSent = Object.keys(model.playerModels).every(function (playerId) {
      return !!model.playerModels[playerId].orders
    })
    if (allOrdersSent) {
      world.fightUnits(model.entityModels)
      world.updateTileOwnership(model.worldModel, model.entityModels)
      world.spawnNewUnits(model.worldModel, model.entityModels)
      for (var playerId in model.playerModels) {
        model.playerModels[playerId].orders = null
      }
      io.to(socket.gameId).emit('changes', model)
    }
  })

  socket.on('disconnect', function () {
    var model = models[socket.gameId]
    if (model) {
      removePlayer(model.playerModels, socket.playerId)
      console.log('Player', socket.playerId, 'disconnected')
    }
  })
})
io.listen(8080)
