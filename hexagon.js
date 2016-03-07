// pointy-topped hexagon

function Hexagon (x, y, z) {
  this.x = x
  this.y = y
  this.z = z

  this.color = '#fff'
  this.highlightColor = 'rgba(226, 193, 53, 0.4)'

  this.highlighted = false

  this.radius = 40

  this.resourceColors = []
  var rgb = {
    r: 100,
    g: 150,
    b: 100
  }
  for (var j = 0; j < 10; j++) {
    rgb.r -= 10
    rgb.g -= 10
    rgb.b -= 10
    this.resourceColors[j] = 'rgb(' + rgb.r + ',' + rgb.g + ',' + rgb.b + ')'
  }

  this.info = {
    units: 0,
    city: false,
    resources: Math.round(Math.random() * 9) // between 0-9
  }

  this.height = this.radius * 2
  this.width = (Math.sqrt(3) / 2) * this.height

  // polygon corners in pixel coordinates
  this.polygon = []
  var p = this.getPixel()
  for (var i = 0; i < 6; i++) {
    this.polygon.push(
      {
        x: this.radius * Math.cos(i * 1 / 3 * Math.PI + 1 / 6 * Math.PI) + p.x + this.radius + 1,
        y: this.radius * Math.sin(i * 1 / 3 * Math.PI + 1 / 6 * Math.PI) + p.y + this.radius + 1
      }
    )
  }
}

Hexagon.radius = 40

Hexagon.prototype.draw = function (ctx) {
  ctx.save()
  ctx.beginPath()
  drawPolygon(ctx, this.polygon)
  ctx.fillStyle = this.resourceColors[this.info.resources]
  ctx.strokeStyle = '#000000'
  ctx.lineWidth = 2
  ctx.stroke()
  ctx.fill()
  ctx.closePath()

  if (this.highlighted) {
    ctx.beginPath()
    drawPolygon(ctx, this.polygon)
    ctx.fillStyle = this.highlightColor
    ctx.fill()
    ctx.closePath()
  }
  ctx.restore()
}

Hexagon.prototype.getPixel = function () {
  var p = {}
  p.x = this.radius * Math.sqrt(3) * (this.x + this.y / 2)
  p.y = this.radius * 3 / 2 * this.y
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

function drawPolygon (c, polygon) {
  c.beginPath()
  c.moveTo(polygon[0].x, polygon[0].y)
  for (var i = 1; i < polygon.length; i++) c.lineTo(polygon[i].x, polygon[i].y)
  c.lineTo(polygon[0].x, polygon[0].y)
  c.closePath()
}

// returns the manhatten distance between hexagon a and hexagon b
function distance (a, b) {
  return (Math.abs(a.x - b.x) + Math.abs(a.y - b.y) + Math.abs(a.z - b.z)) / 2
}

module.exports = Hexagon
