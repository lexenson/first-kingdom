function createModel (id) {
  var playerModel = {}
  playerModel.id = id
  playerModel.resources = 0
  return playerModel
}

exports.createModel = createModel
