function createModel (id) {
  var playerModel = {}
  playerModel.id = id
  return playerModel
}

function drawPlayerList (playerModels, ownPlayerId, gameID, ctx) {
  var itemSize = 50
  var textSize = Math.floor(0.8 * itemSize)
  var position = 0

  // draw players
  ctx.save()
  ctx.textBaseline = 'top'
  ctx.fillStyle = '#000000'
  ctx.font = textSize.toString() + 'px Arial'
  ctx.fillText('Players:', 100, 10 + position * itemSize)
  position++
  for (var playerId in playerModels) {
    var text = Number(ownPlayerId) === Number(playerId) ? 'You' : 'Player ' + playerId
    var player = playerModels[playerId]
    if (player.ready) text += ' (ready)'
    ctx.fillText(text, 100, 10 + position * itemSize)
    position++
  }
  if (gameID) {
    ctx.fillText('Game ID: ' + gameID, 100, 10 + position * itemSize)
    position++
  }
  ctx.fillText('Press Enter to be ready.', 100, 10 + position * itemSize)
  ctx.restore()
}

exports.createModel = createModel
exports.drawPlayerList = drawPlayerList
