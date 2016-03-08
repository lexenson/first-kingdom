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
  // this.highlightColor = 'rgba(226, 193, 53, 0.4)'

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

  return {
    'topRight': {x: x + 1, y: y, z: z - 1},
    'right': {x: x + 1, y: y - 1, z: z},
    'bottomRight': {x: x, y: y - 1, z: z + 1},
    'bottomLeft': {x: x - 1, y: y, z: z + 1},
    'left': {x: x - 1, y: y + 1, z: z},
    'topLeft': {x: x, y: y + 1, z: z - 1}
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
