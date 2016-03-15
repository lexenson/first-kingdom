var hexagon = require('./hexagon.js')
var world = require('./world.js')

exports.createModel = function (x, y, playerId) {
  var unitModel = {}

  unitModel.type = 'unit'
  unitModel.x = x
  unitModel.y = y
  unitModel.z = -x - y

  unitModel.id = Math.round(Math.random() * 1000000000)

  unitModel.playerId = playerId

  unitModel.color = '#000'
  return unitModel
}

function draw (unitModel, worldModel, ctx) {
  var hexModel = world.getHexagonFromCoordinate(worldModel, unitModel.x, unitModel.y)
  var pixelPos = hexagon.getPixel(hexModel)

  ctx.save()
  ctx.beginPath()
  ctx.arc(pixelPos.x, pixelPos.y, hexModel.radius / 2, 0, 2 * Math.PI)
  ctx.fillStyle = unitModel.color
  ctx.fill()
  ctx.closePath()
  ctx.restore()
}

function moveTo (unitModel, newHexModel) {
  unitModel.x = newHexModel.x
  unitModel.y = newHexModel.y
  unitModel.z = newHexModel.z

  newHexModel.info.owner = unitModel.playerId
}

function getUnitFromCoordinate (entityModels, x, y, z) {
  var resUnitModel = null
  Object.keys(entityModels).forEach(function (entityId) {
    var entityModel = entityModels[entityId]
    if (entityModel.type === 'unit' && entityModel.x === x && entityModel.y === y && entityModel.z === z) {
      resUnitModel = entityModel
      return
    }
  })
  return resUnitModel
}

exports.draw = draw
exports.moveTo = moveTo
exports.getUnitFromCoordinate = getUnitFromCoordinate
