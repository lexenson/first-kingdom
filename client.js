var socketio = require('socket.io-client')

var socket

var client = {
  connect: connect,
  sendChanges: sendChanges,
  receiveChanges: receiveChanges
}

function sendChanges (changes) {
  socket.send(changes)
}

function connect (serverURL, cb) {
  socket = socketio(serverURL)
  socket.on('connect', function () {
    cb()
  })
}

function receiveChanges (cb) {
  socket.on('message', function () {
    cb()
  })
}

module.exports = client
