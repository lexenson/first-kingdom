var socketio = require('socket.io')

var io = socketio()
io.on('connection', function (socket) {
  // new client connected
  socket.ready = false
  socket.orders = null

  socket.on('ready', function () {
    socket.ready = true
    var allReady = io.sockets.clients().every(function (s) {
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
    var allOrdersSent = io.sockets.clients().every(function (s) {
      return !!s.orders
    })
    if (allOrdersSent) {
      // calculateNewGameState() with all socket orders
      var changes = [] // populate with changes
      io.sockets.clients().forEach(function (s) {
        s.orders = null
      })
      io.sockets.emit('changes', changes)
    }
  })
})
io.listen(8080)
