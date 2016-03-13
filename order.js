var entity = require('./entity.js')
var hexagon = require('./hexagon.js')
var world = require('./world.js')

function createModel (type, info, entityId) {
  var orderModel = {}

  orderModel.type = type
  orderModel.info = info
  orderModel.entityId = entityId

  return orderModel
}

function draw (orderModel, worldModel, entityModels, ctx) {
  if (orderModel.type === 'moveUnit') {
    var unitModel = entity.getFromId(entityModels, orderModel.entityId)
    var pos = orderModel.info.pos
    var toHexModel = world.getHexagonFromCoordinate(worldModel, pos.x, pos.y)
    var fromHexModel = world.getHexagonFromCoordinate(worldModel, unitModel.x, unitModel.y)
    var pixelFrom = hexagon.getPixel(fromHexModel)
    var pixelTo = hexagon.getPixel(toHexModel)
    ctx.save()
    ctx.beginPath()
    ctx.lineWidth = 2
    ctx.strokeStyle = '#000000'
    ctx.moveTo(pixelFrom.x, pixelFrom.y)
    ctx.lineTo(pixelTo.x, pixelTo.y)
    ctx.stroke()
    ctx.restore()
  }
}

exports.createModel = createModel
exports.draw = draw
