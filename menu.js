function Menu (x, y, width, height, textColor, highlightColor, backgroundColor, font) {
  this.items = []
  this.selectedItemIndex = 0
  this.x = x
  this.y = y
  this.width = width
  this.height = height
  this.textColor = textColor
  this.highlightColor = highlightColor
  this.backgroundColor = backgroundColor
  this.font = font
}

Menu.prototype.draw = function (ctx, time) {
  var itemSize = this.height / this.items.length
  var textSize = Math.floor(0.8 * itemSize)
  ctx.save()

  // draw items
  ctx.textBaseline = 'top'
  ctx.fillStyle = this.textColor
  ctx.font = textSize.toString() + 'px ' + this.font
  for (var i = 0; i < this.items.length; i++) {
    var item = this.items[i]

    ctx.save()
    if (i === this.selectedItemIndex) {
      ctx.fillStyle = this.highlightColor
    }
    ctx.fillText(item.text, this.x, this.y + i * itemSize)
    ctx.restore()
  }
}

Menu.prototype.down = function () {
  this.selectedItemIndex = (this.selectedItemIndex + 1) % this.items.length
}

Menu.prototype.up = function () {
  this.selectedItemIndex = (((this.selectedItemIndex - 1) % this.items.length) + this.items.length) % this.items.length
}

Menu.prototype.select = function () {
  this.items[this.selectedItemIndex].action()
}

Menu.prototype.addItem = function (text, action) {
  var item = {
    text: text,
    action: action
  }
  this.items.push(item)
}

module.exports = Menu
