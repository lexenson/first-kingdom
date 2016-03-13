function createModel (id) {
  var playerModel = {}
  playerModel.id = id
  playerModel.resources = 0
  playerModel.unitModels = []
  return playerModel
}

function addUnit (playerModel, unitModel) {
  playerModel.unitModels.push(unitModel)
}

exports.createModel = createModel
exports.addUnit = addUnit
