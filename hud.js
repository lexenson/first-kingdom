function HUD (model, game) {
  this.game = game
  this.model = model

  this.texts = []

  this.pos = {
    x: 10,
    y: game.height - this.texts.length * 15
  }
}

HUD.prototype.update = function (dt) {
  this.texts = [
    'FIRST KINGDOM',
    'mode: ' + this.game.mode
  ]
  this.pos.y = this.game.height - this.texts.length * 15
}

HUD.prototype.draw = function (ctx) {
  var pos = this.pos
  ctx.save()
  ctx.fillStyle = '#000'
  ctx.font = '14px Arial'
  this.texts.forEach(function (text, index) {
    ctx.fillText(text, pos.x, pos.y + index * 15)
  })
  ctx.restore()
}

module.exports = HUD
