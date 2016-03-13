var socketio = require('socket.io')

var world = require('./world.js')
var player = require('./player.js')
var unit = require('./unit.js')

var io = socketio()

var model = null

function initializeGame () {
  var model = {
    worldModel: world.createModel(12, 12),
    playerModels: []
  }
  model.playerModels.push(player.createModel(1))

  var unitModel = unit.createModel(0, 0, 0, model.playerModels[0].id)
  player.addUnit(model.playerModels[0], unitModel, model.worldModel)

  return model
}

function applyOrders (model, orders) {
  orders.forEach(function (order) {
    var unitModel
    model.playerModels.forEach(function (playerModel) {
      var playerUnitModel = player.getUnitFromId(playerModel, order.unitId)
      if (playerUnitModel) {
        unitModel = playerUnitModel
      }
    })
    var serverHexModel = world.getHexagonFromCoordinate(model.worldModel, order.newHexModel.x, order.newHexModel.y)
    unit.moveTo(unitModel, serverHexModel)
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
