var world = require('./world.js')

function createModel (id) {
  var playerModel = {}
  playerModel.id = id
  playerModel.resources = 0
  playerModel.unitIds = []
  return playerModel
}

function addUnit (playerModel, unitModel, worldModel) {
  var hexModel = world.getHexagonFromCoordinate(worldModel, unitModel.x, unitModel.y)
  hexModel.info.owner = playerModel.id
  playerModel.unitIds.push(unitModel.id)
}

exports.createModel = createModel
exports.addUnit = addUnit
