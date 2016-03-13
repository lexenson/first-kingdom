var hexagon = require('./hexagon.js')
var world = require('./world.js')

exports.createModel = function (x, y, z, playerId) {
  var unitModel = {}

  unitModel.x = x
  unitModel.y = y
  unitModel.z = z

  unitModel.id = 'unit' + Math.round(Math.random() * 10000000)

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

function orderTo (unitModel, newHexModel, orders) {
  orders.push({
    unitId: unitModel.id,
    newHexModel: newHexModel
  })
}

function moveTo (unitModel, newHexModel) {
  unitModel.x = newHexModel.x
  unitModel.y = newHexModel.y
  unitModel.z = newHexModel.z

  newHexModel.info.owner = unitModel.playerId
}

exports.draw = draw
exports.moveTo = moveTo
exports.orderTo = orderTo
