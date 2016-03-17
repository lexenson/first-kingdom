var socketio = require('socket.io-client')

var socket

var client = {
  connect: connect,
  receivePlayerId: receivePlayerId,
  setReady: setReady,
  receiveStart: receiveStart,
  sendOrders: sendOrders,
  receiveChanges: receiveChanges,
  receivePlayerModels: receivePlayerModels
}

function connect (serverURL, cb) {
  socket = socketio(serverURL)
  socket.on('connect', function () {
    cb()
  })
}

function receivePlayerId (cb) {
  socket.on('playerid', function (playerId) {
    cb(playerId)
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

function receivePlayerModels (cb) {
  socket.on('players', function (playerModels) {
    cb(playerModels)
  })
}

module.exports = client
