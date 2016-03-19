var hexagon = require('./hexagon.js')

exports.createModel = function (radius) {
  var worldModel = {}
  var width = radius * 2
  var height = radius * 2
  worldModel.hexagons = {}
  for (var x = 0; x < width; x++) {
    for (var y = 0; y < height; y++) {
      var hexModel = hexagon.createModel(x, y, -y - x)
      if (hexagon.getDistance(hexModel, {x: radius, y: radius, z: -2 * radius}) < radius) {
        worldModel.hexagons[x + ',' + y] = hexModel
      }
    }
  }
  return worldModel
}

exports.draw = function (worldModel, ctx) {
  for (var index in worldModel.hexagons) {
    hexagon.draw(worldModel.hexagons[index], ctx)
  }
}

exports.getHexagonFromPixel = function (worldModel, x, y) {
  var pos = pixelToHex(x, y)
  return worldModel.hexagons[pos.x + ',' + pos.y]
}

exports.getHexagonFromCoordinate = function (worldModel, x, y) {
  return worldModel.hexagons[x + ',' + y]
}

exports.unhighlightAll = function (worldModel) {
  for (var tileIndex in worldModel.hexagons) {
    var hexModel = worldModel.hexagons[tileIndex]
    hexModel.highlighted = false
  }
}

exports.getHightlightedHexagon = function (worldModel) {
  for (var tileIndex in worldModel.hexagons) {
    var hexModel = worldModel.hexagons[tileIndex]
    if (hexModel.highlighted) return hexModel
  }
}

exports.distributeResources = function (worldModel, playerModels) {
  for (var tileIndex in worldModel.hexagons) {
    var hexModel = worldModel.hexagons[tileIndex]
    if (hexModel.info.owner > 0) {
      playerModels[hexModel.info.owner - 1].resources += hexModel.info.resources
    }
  }
}

exports.updateTileOwnership = function (worldModel, entityModels) {
  Object.keys(entityModels).forEach(function (entityModelId) {
    var entityModel = entityModels[entityModelId]
    var x = entityModel.x
    var y = entityModel.y
    var hexModel = exports.getHexagonFromCoordinate(worldModel, x, y)

    hexModel.info.owner = entityModel.playerId
  })
}

exports.getRandomHexagon = function (worldModel) {
  var hexagonKeys = Object.keys(worldModel.hexagons)
  var randomIndex = Math.round(Math.random() * hexagonKeys.length)
  var randomKey = hexagonKeys[randomIndex]
  return worldModel.hexagons[randomKey]
}

// returns snapped coordinates in 3d hexagonal cube grid
// hexPos is a point in the 2d axial hexagonal space
function hexRound (hexPos) {
  // rounds and converts to three-dimensional hexagonal coordinates
  var res = {}
  hexPos.z = -hexPos.x - hexPos.y
  res.x = Math.round(hexPos.x)
  res.y = Math.round(hexPos.y)
  res.z = Math.round(hexPos.z)

  // makes coordinate which is furthest away from any hexagon Center Coordinate
  // dependant upon the others
  var xDiff = Math.abs(res.x - hexPos.x)
  var yDiff = Math.abs(res.y - hexPos.y)
  var zDiff = Math.abs(res.z - hexPos.z)

  if (xDiff > yDiff && xDiff > zDiff) {
    res.x = -res.y - res.z
  } else if (yDiff > zDiff) {
    res.y = -res.x - res.z
  } else {
    res.z = -res.x - res.y
  }

  return res
}

// returns coordinates of appropriate hex in 3d grid
function pixelToHex (x, y) {
  // offset
  x -= hexagon.radius + 1
  y -= hexagon.radius + 1

  // converts pixel coordinates to 2d axial hexagonal space
  var res = {}
  res.x = (x * Math.sqrt(3) / 3 - y / 3) / hexagon.radius
  res.y = y * 2 / 3 / hexagon.radius

  res = hexRound(res)

  return res
}
