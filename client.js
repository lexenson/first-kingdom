var socketio = require('socket.io-client')

var socket

var client = {
  connect: connect,
  setReady: setReady,
  receiveStart: receiveStart,
  sendOrders: sendOrders,
  receiveChanges: receiveChanges
}

function connect (serverURL, cb) {
  socket = socketio(serverURL)
  socket.on('connect', function () {
    cb()
  })
}

function setReady () {
  socket.emit('ready')
}

function receiveStart (cb) {
  socket.on('start', function (game) {
    cb(game)
  })
}

function sendOrders (orders) {
  socket.emit('orders', orders)
}

function receiveChanges (cb) {
  socket.on('changes', function (changes) {
    cb(changes)
  })
}

module.exports = client
