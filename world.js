var Hexagon = require('./hexagon.js')

function World (width, height) {
  this.tiles = {}
  for (var x = 0; x < width; x++) {
    for (var y = 0; y < height; y++) {
      this.tiles[x + ',' + y] = new Hexagon(x, y, -y - x)
    }
  }
}

World.prototype.getHexagonFromPixel = function (x, y) {
  var pos = pixelToHex(x, y)
  return this.tiles[pos.x + ',' + pos.y]
}

World.prototype.draw = function (ctx) {
  for (var index in this.tiles) {
    this.tiles[index].draw(ctx)
  }
}

World.prototype.unhighlightAll = function () {
  for (var tileIndex in this.tiles) {
    this.tiles[tileIndex].highlighted = false
  }
}

module.exports = World

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
  x -= Hexagon.radius + 1
  y -= Hexagon.radius + 1

  // converts pixel coordinates to 2d axial hexagonal space
  var res = {}
  res.x = (x * Math.sqrt(3) / 3 - y / 3) / Hexagon.radius
  res.y = y * 2 / 3 / Hexagon.radius

  res = hexRound(res)

  return res
}
