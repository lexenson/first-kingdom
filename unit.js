var hexagon = require('./hexagon.js')

exports.createModel = function (hexModel, playerId) {
  var unitModel = {}
  unitModel.hexModel = hexModel
  unitModel.hexModel.info.unitModel = unitModel
  unitModel.id = 'unit' + Math.round(Math.random() * 10000000)

  unitModel.playerId = playerId

  unitModel.color = '#000'
  return unitModel
}

function draw (unitModel, ctx) {
  var pixelPos = hexagon.getPixel(unitModel.hexModel)

  ctx.save()
  ctx.beginPath()
  ctx.arc(pixelPos.x, pixelPos.y, unitModel.hexModel.radius / 2, 0, 2 * Math.PI)
  ctx.fillStyle = unitModel.color
  ctx.fill()
  ctx.closePath()
  ctx.restore()
}

function moveTo (unitModel, newHexModel, orders) {
  orders[0] = {
    unitId: unitModel.id,
    newHexModelx: newHexModel.x,
    newHexModely: newHexModel.y,
    newHexModelz: newHexModel.z
  }
  unitModel.hexModel.info.unitModel = null
  newHexModel.info.unitModel = unitModel
  unitModel.hexModel = newHexModel
}

exports.draw = draw
exports.moveTo = moveTo
