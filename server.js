var socketio = require('socket.io')

var io = socketio()

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
      var game = {}
      io.sockets.emit('start', game)
    }
  })

  socket.on('orders', function (orders) {
    socket.orders = orders
    var allOrdersSent = getSockets().every(function (s) {
      return !!s.orders
    })
    if (allOrdersSent) {
      // calculateNewGameState() with all socket orders
      var changes = [] // populate with changes
      getSockets().forEach(function (s) {
        s.orders = null
      })
      io.sockets.emit('changes', changes)
    }
  })
})
io.listen(8080)
