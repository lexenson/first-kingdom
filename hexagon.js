var world = require('./world.js')
var config = require('./config.js')

// pointy-topped hexagon

var playerColors = config.colors.playerColors

var neutralColor = config.colors.hexagonBackground

exports.createModel = function (x, y, z) {
  var hexModel = {}

  hexModel.x = x
  hexModel.y = y
  hexModel.z = z

  hexModel.radius = 45
  hexModel.height = hexModel.radius * 2
  hexModel.width = (Math.sqrt(3) / 2) * hexModel.height

  hexModel.color = '#fff'
  hexModel.highlightColor = 'rgba(226, 193, 53, 0.4)'

  hexModel.highlighted = false

  var p = getPixel(hexModel) // should pixel stuff only be in the view?

  hexModel.hasTrees = Math.random() > 0.8
  if (hexModel.hasTrees) {
    var numberOfTrees = Math.round(Math.random() * 2) + 1
    hexModel.trees = Array(numberOfTrees).fill(0)
      .map(function () {
        var tree = {}
        tree.x = p.x + Math.round(Math.random() * 1 * hexModel.radius - hexModel.radius)
        tree.y = p.y + Math.round(Math.random() * 1 * hexModel.radius - hexModel.radius)
        return tree
      })
      .sort(function (a, b) {
        return b.y - a.y
      })
  }
  if (!hexModel.hasTrees) hexModel.mountains = Math.random() > 0.80
  if (!hexModel.hasTrees && !hexModel.mountains) {
    hexModel.castle = Math.random() > 0.8
  } else {
    hexModel.castle = false
  }

  hexModel.info = {
    owner: 0, // 0 -> no owner, other number -> owner id
    city: false
  }

  // polygon corners in pixel coordinates
  hexModel.polygon = []
  for (var i = 0; i < 6; i++) {
    hexModel.polygon.push(
      {
        x: hexModel.radius * Math.cos(i * 1 / 3 * Math.PI + 1 / 6 * Math.PI) + p.x,
        y: hexModel.radius * Math.sin(i * 1 / 3 * Math.PI + 1 / 6 * Math.PI) + p.y
      }
    )
  }

  return hexModel
}

var radius = 45

var offset = {
  x: -190,
  y: -20
}

function draw (hexModel, ctx) {
  ctx.save()
  ctx.beginPath()
  drawPolygon(ctx, hexModel.polygon)
  var playerId = Number(hexModel.info.owner)
  ctx.fillStyle = playerId > 0 ? playerColors[playerId % playerColors.length] : neutralColor
  ctx.strokeStyle = config.colors.hexagonBorder
  ctx.lineWidth = 2
  ctx.stroke()
  ctx.fill()
  ctx.closePath()
  var p = getPixel(hexModel)

  ctx.fillStyle = '#000'
  ctx.font = '24px Arial'

  if (hexModel.mountains) {
    ctx.drawImage(document.querySelector('#mountains'), p.x - 30, p.y - 30)
  }
  if (hexModel.hasTrees) {
    hexModel.trees.forEach(function (tree) {
      ctx.drawImage(document.querySelector('#tree'), tree.x, tree.y)
    })
  }

  if (hexModel.castle) {
    ctx.drawImage(document.querySelector('#castle'), p.x - 30, p.y - 29)
  }

  if (hexModel.info.unitCountdown) {
    ctx.fillText(hexModel.info.unitCountdown, p.x - 10, p.y - 15)
  }
  ctx.restore()
}

function drawHighlight (hexModel, ctx, time) {
  // set pulsating lineWidth
  var averageLineWidth = 3.5
  var lineWidthRange = 1.5
  var highlightBlinkRate = 5
  var lineWidth = Math.sin(time * highlightBlinkRate) * lineWidthRange + averageLineWidth

  ctx.save()
  ctx.beginPath()
  drawPolygon(ctx, hexModel.polygon)
  ctx.strokeStyle = '#fff'
  ctx.lineWidth = lineWidth
  ctx.stroke()
  ctx.closePath()
  ctx.restore()

  var p = getPixel(hexModel)
  // TODO: image clipping in own module
  ctx.drawImage(
    document.querySelector('#unitmenu'),
    0,  // source coordinates
    0,
    76,
    48,
    p.x - 2 * hexModel.radius, // target coordinates
    p.y - 2 * hexModel.radius,
    76,
    48
  )
}

function drawReachableHighlight (hexModel, ctx, worldModel) {
  var reachableTiles = getReachableTiles(hexModel, worldModel, 1)
  reachableTiles.push(hexModel)

  for (var i = 0; i < reachableTiles.length; i++) {
    var h = reachableTiles[i]
    var neighbors = getNeighbors(h, worldModel)

    // drawing lines between reachable and unreachable hexagons
    ctx.save()
    ctx.strokeStyle = config.colors.hexagonHighlightBorder
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

function getPixel (hexModel) {
  var p = {}
  p.x = hexModel.radius * Math.sqrt(3) * (hexModel.x + hexModel.y / 2) + offset.x
  p.y = hexModel.radius * 3 / 2 * hexModel.y + offset.y
  return p
}

// returns an object with the coordinates of the neighbours of hexagon a
function getNeighborCoordinates (hexModel) {
  var x = hexModel.x
  var y = hexModel.y
  var z = hexModel.z

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
function getNeighbors (hexModel, worldModel) {
  var neigborCoordinates = getNeighborCoordinates(hexModel)
  var neighbors = {}
  for (var dir in neigborCoordinates) {
    var neighborCoordinate = neigborCoordinates[dir]
    var x = neighborCoordinate.x
    var y = neighborCoordinate.y

    var hex = world.getHexagonFromCoordinate(worldModel, x, y)
    if (hex) neighbors[dir] = hex
  }

  return neighbors
}

function isAdjacent (hexModel, otherHexModel) {
  return getDistance(hexModel, otherHexModel) === 1
}

function getDistance (hexModel, otherHexModel) {
  return (Math.abs(hexModel.x - otherHexModel.x) + Math.abs(hexModel.y - otherHexModel.y) + Math.abs(hexModel.z - otherHexModel.z)) / 2
}

// returns a list of reachable hexagons; n is the range
function getReachableTiles (hexModel, worldModel, n) {
  // get tiles that are within distance
  var tilesWithinRange = []
  var hexagons = worldModel.hexagons
  for (var i in hexagons) {
    var dist = getDistance(hexModel, hexagons[i])
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

    hexModel.distance = 0
    var q = [hexModel]
    while (q.length > 0) {
      var current = q.shift()

      for (var k = 0; k < tilesWithinRange.length; k++) {
        var node = tilesWithinRange[k]
        if (isAdjacent(current, node) && node.distance === Infinity) {
          node.distance = current.distance + 1
          reachableTiles.push(node)
          q.push(node)
        }
      }
    }

    // delete distance property only used for bfs
    for (var l = 0; l < tilesWithinRange.length; l++) {
      var hex = tilesWithinRange[l]
      delete hex.distance
    }

    return reachableTiles
  }
}

function drawPolygon (c, polygon) {
  c.beginPath()
  c.moveTo(polygon[0].x, polygon[0].y)
  for (var i = 1; i < polygon.length; i++) c.lineTo(polygon[i].x, polygon[i].y)
  c.lineTo(polygon[0].x, polygon[0].y)
  c.closePath()
}

exports.radius = radius
exports.offset = offset

exports.draw = draw
exports.drawHighlight = drawHighlight
exports.getPixel = getPixel
exports.drawReachableHighlight = drawReachableHighlight
exports.isAdjacent = isAdjacent
exports.getDistance = getDistance
