function Unit (hex) {
  this.hex = hex

  this.color = '#000'
}

Unit.prototype.draw = function (ctx) {
  var pixelPos = this.hex.getPixel()

  ctx.save()
  ctx.beginPath()
  ctx.arc(pixelPos.x, pixelPos.y, this.hex.radius / 2, 0, 2 * Math.PI)
  ctx.fillStyle = this.color
  ctx.fill()
  ctx.closePath()
  ctx.restore()
}

Unit.prototype.moveTo = function (newHex) {
  this.hex.info.unit = null
  newHex.info.unit = this
  this.hex = newHex
}

module.exports = Unit
