// pointy-topped hexagon

var playerColors = [
  {r: 213, g: 213, b: 195},
  {r: 255, g: 110, b: 110},
  {r: 110, g: 110, b: 255}
]

function Hexagon (x, y, z) {
  this.x = x
  this.y = y
  this.z = z

  this.radius = 40
  this.height = this.radius * 2
  this.width = (Math.sqrt(3) / 2) * this.height

  this.color = '#fff'
  this.highlightColor = 'rgba(226, 193, 53, 0.4)'

  this.highlighted = false

  this.info = {
    unit: null,
    owner: 0, // 0 -> no owner, other number -> owner id
    city: false,
    resources: Math.round(Math.random() * 9) // between 0-9
  }

  // polygon corners in pixel coordinates
  this.polygon = []
  var p = this.getPixel()
  for (var i = 0; i < 6; i++) {
    this.polygon.push(
      {
        x: this.radius * Math.cos(i * 1 / 3 * Math.PI + 1 / 6 * Math.PI) + p.x,
        y: this.radius * Math.sin(i * 1 / 3 * Math.PI + 1 / 6 * Math.PI) + p.y
      }
    )
  }
}

Hexagon.radius = 40

Hexagon.offset = {
  x: Hexagon.radius,
  y: Hexagon.radius + 1
}

Hexagon.prototype.draw = function (ctx) {
  ctx.save()
  ctx.beginPath()
  drawPolygon(ctx, this.polygon)
  ctx.fillStyle = applyResourceColorization(playerColors[this.info.owner], this.info.resources)
  ctx.strokeStyle = '#000000'
  ctx.lineWidth = 2
  ctx.stroke()
  ctx.fill()
  ctx.closePath()
  ctx.restore()

  if (this.info.unit) {
    this.info.unit.draw(ctx)
  }
}

Hexagon.prototype.drawHighlight = function (ctx, time) {
  // set pulsating lineWidth
  var averageLineWidth = 3
  var lineWidthRange = 2
  var highlightBlinkRate = 4
  var lineWidth = Math.round(Math.sin(time * highlightBlinkRate) * lineWidthRange) + averageLineWidth

  ctx.save()
  ctx.beginPath()
  drawPolygon(ctx, this.polygon)
  ctx.strokeStyle = '#fff'
  ctx.lineWidth = lineWidth
  ctx.stroke()
  ctx.closePath()
  ctx.restore()
}

Hexagon.prototype.drawReachableHighlight = function (ctx, world) {
  var reachableTiles = this.getReachableTiles(world, 1)
  reachableTiles.push(this)

  for (var i = 0; i < reachableTiles.length; i++) {
    var h = reachableTiles[i]
    var neighbors = h.getNeighbors(world)

    // drawing lines between reachable and unreachable hexagons
    ctx.save()
    ctx.strokeStyle = '#e68a00'
    ctx.lineWidth = 3
    if (reachableTiles.indexOf(neighbors['topLeft']) < 0) {
      ctx.beginPath()
      ctx.moveTo(h.polygon[0].x, h.polygon[0].y)
      ctx.lineTo(h.polygon[1].x, h.polygon[1].y)
      ctx.closePath()
      ctx.stroke()
    }
    if (reachableTiles.indexOf(neighbors['left']) < 0) {
      ctx.beginPath()
      ctx.moveTo(h.polygon[1].x, h.polygon[1].y)
      ctx.lineTo(h.polygon[2].x, h.polygon[2].y)
      ctx.closePath()
      ctx.stroke()
    }
    if (reachableTiles.indexOf(neighbors['bottomLeft']) < 0) {
      ctx.beginPath()
      ctx.moveTo(h.polygon[2].x, h.polygon[2].y)
      ctx.lineTo(h.polygon[3].x, h.polygon[3].y)
      ctx.closePath()
      ctx.stroke()
    }
    if (reachableTiles.indexOf(neighbors['bottomRight']) < 0) {
      ctx.beginPath()
      ctx.moveTo(h.polygon[3].x, h.polygon[3].y)
      ctx.lineTo(h.polygon[4].x, h.polygon[4].y)
      ctx.closePath()
      ctx.stroke()
    }
    if (reachableTiles.indexOf(neighbors['right']) < 0) {
      ctx.beginPath()
      ctx.moveTo(h.polygon[4].x, h.polygon[4].y)
      ctx.lineTo(h.polygon[5].x, h.polygon[5].y)
      ctx.closePath()
      ctx.stroke()
    }
    if (reachableTiles.indexOf(neighbors['topRight']) < 0) {
      ctx.beginPath()
      ctx.moveTo(h.polygon[5].x, h.polygon[5].y)
      ctx.lineTo(h.polygon[0].x, h.polygon[0].y)
      ctx.closePath()
      ctx.stroke()
    }
    ctx.restore()
  }
}

Hexagon.prototype.getPixel = function () {
  var p = {}
  p.x = this.radius * Math.sqrt(3) * (this.x + this.y / 2) + Hexagon.offset.x
  p.y = this.radius * 3 / 2 * this.y + Hexagon.offset.y
  return p
}

// returns an object with the coordinates of the neighbours of hexagon a
Hexagon.prototype.getNeighborCoordinates = function () {
  var x = this.x
  var y = this.y
  var z = this.z

  var res = {
    'topRight': {x: x + 1, y: y, z: z - 1},
    'right': {x: x + 1, y: y - 1, z: z},
    'bottomRight': {x: x, y: y - 1, z: z + 1},
    'bottomLeft': {x: x - 1, y: y, z: z + 1},
    'left': {x: x - 1, y: y + 1, z: z},
    'topLeft': {x: x, y: y + 1, z: z - 1}
  }

  return res
}

// returns an object with the neighboring hexagons
Hexagon.prototype.getNeighbors = function (world) {
  var neigborCoordinates = this.getNeighborCoordinates()
  var neighbors = {}
  for (var dir in neigborCoordinates) {
    var neighborCoordinate = neigborCoordinates[dir]
    var x = neighborCoordinate.x
    var y = neighborCoordinate.y
    neighbors[dir] = world.getHexagonFromCoordinate(x, y)
  }

  return neighbors
}

// returns a list of reachable hexagons
Hexagon.prototype.getReachableTiles = function (world, n) {
  // get tiles that are within distance
  var tilesWithinRange = []
  var hexagons = world.hexagons
  for (var i in hexagons) {
    var dist = this.getDistance(hexagons[i])
    if (dist > 0 && dist <= n) {
      tilesWithinRange.push(hexagons[i])
    }
  }

  // do a bfs to find tiles that are reachable
  var reachableTiles = []

  if (tilesWithinRange.length > 0) {
    for (var j = 0; j < tilesWithinRange.length; j++) {
      tilesWithinRange[j].distance = Infinity
    }

    this.distance = 0
    var q = [this]
    while (q.length > 0) {
      var current = q.shift()

      for (var k = 0; k < tilesWithinRange.length; k++) {
        var node = tilesWithinRange[k]
        if (current.isAdjacent(node) && node.distance === Infinity) {
          node.distance = current.distance + 1
          reachableTiles.push(node)
          q.push(node)
        }
      }
    }

    for (var l = 0; l < tilesWithinRange.length; l++) {
      var hex = tilesWithinRange[l]
      delete hex.distance
    }

    return reachableTiles
  }
}

Hexagon.prototype.isAdjacent = function (otherHex) {
  return this.getDistance(otherHex) === 1
}

Hexagon.prototype.getDistance = function (otherHex) {
  return (Math.abs(this.x - otherHex.x) + Math.abs(this.y - otherHex.y) + Math.abs(this.z - otherHex.z)) / 2
}

function drawPolygon (c, polygon) {
  c.beginPath()
  c.moveTo(polygon[0].x, polygon[0].y)
  for (var i = 1; i < polygon.length; i++) c.lineTo(polygon[i].x, polygon[i].y)
  c.lineTo(polygon[0].x, polygon[0].y)
  c.closePath()
}

// darken color(in rgb)
function applyResourceColorization (color, resourceValue) {
  var r = color.r - resourceValue * 10
  var g = color.g - resourceValue * 10
  var b = color.b - resourceValue * 10
  return 'rgb(' + r + ',' + g + ',' + b + ')'
}

module.exports = Hexagon
