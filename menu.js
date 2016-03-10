function Menu (items, x, y, width, height, textColor, highlightColor, backgroundColor, font, keyboard) {
  this.items = items
  this.selectedItemIndex = 0
  this.x = x
  this.y = y
  this.width = width
  this.height = height
  this.textColor = textColor
  this.highlightColor = highlightColor
  this.backgroundColor = backgroundColor
  this.font = font
  this.keyboard = keyboard
}

Menu.prototype.draw = function (ctx, time) {
  var itemSize = Math.floor(0.8 * this.height / this.items.length)
  ctx.save()
  // draw background
  ctx.fillStyle = this.backgroundColor
  ctx.fillRect(this.x, this.y, this.width, this.height)

  // draw items
  ctx.textBaseline = 'top'
  ctx.fillStyle = this.textColor
  ctx.font = itemSize.toString() + 'px ' + this.font
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

Menu.prototype.input = function () {
  var menu = this
  this.keyboard.on('keydown', function (key) {
    if (key === '<down>') {
      menu.selectedItemIndex = (menu.selectedItemIndex + 1) % menu.items.length
    }

    if (key === '<up>') {
      menu.selectedItemIndex = (((menu.selectedItemIndex - 1) % menu.items.length) + menu.items.length) % menu.items.length
    }

    if (key === '<enter>') {
      menu.items[menu.selectedItemIndex].action()
    }
  })
}

module.exports = Menu
