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

module.exports = World

function hexRound (h) {
  var r = {}
  r.x = Math.round(h.x)
  r.y = Math.round(h.y)
  r.z = Math.round(-h.x - h.y)

  var xDiff = Math.abs(r.x - h.x)
  var yDiff = Math.abs(r.y - h.y)
  var zDiff = Math.abs(r.z - h.z)

  if (xDiff > yDiff && xDiff > zDiff) {
    r.x = -r.z - r.z
  } else if (yDiff > zDiff) {
    r.y = -r.x - r.z
  } else {
    r.z = -r.x - r.y
  }

  return r
}

function pixelToHex (x, y) {
  var r = {}
  x -= Hexagon.radius + 1
  y -= Hexagon.radius + 1
  r.x = (x * Math.sqrt(3) / 3 - y / 3) / Hexagon.radius
  r.y = y * 2 / 3 / Hexagon.radius
  return hexRound(r)
}
