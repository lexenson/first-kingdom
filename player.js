var world = require('./world.js')

function createModel (id) {
  var playerModel = {}
  playerModel.id = id
  playerModel.resources = 0
  playerModel.unitModels = []
  return playerModel
}

function addUnit (playerModel, unitModel, worldModel) {
  var hexModel = world.getHexagonFromCoordinate(worldModel, unitModel.x, unitModel.y)
  hexModel.info.owner = playerModel.id
  playerModel.unitModels.push(unitModel)
}

function getUnitFromId (playerModel, unitId) {
  return playerModel.unitModels.filter(function (unitModel) {
    return unitModel.id === unitId
  })[0]
}

function getUnitFromCoordinate (playerModel, x, y, z) {
  var resUnitModel = null
  playerModel.unitModels.forEach(function (unitModel) {
    if (unitModel.x === x && unitModel.y === y && unitModel.z === z) {
      resUnitModel = unitModel
      return
    }
  })
  return resUnitModel
}

exports.createModel = createModel
exports.getUnitFromCoordinate = getUnitFromCoordinate
exports.addUnit = addUnit
exports.getUnitFromId = getUnitFromId
