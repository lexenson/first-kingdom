function Menu (x, y, width, height, textColor, highlightColor, backgroundColor, font, keyboard) {
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
  this.keyboard = keyboard
}

Menu.prototype.draw = function (ctx, time) {
  var itemSize = this.height / this.items.length
  var textSize = Math.floor(0.8 * itemSize)
  ctx.save()
  // draw background
  ctx.fillStyle = this.backgroundColor
  ctx.fillRect(this.x, this.y, this.width, this.height)

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

Menu.prototype.input = function () {
  var self = this
  this.keyboard.on('keydown', function (key) {
    if (key === '<down>') {
      self.selectedItemIndex = (self.selectedItemIndex + 1) % self.items.length
    }

    if (key === '<up>') {
      self.selectedItemIndex = (((self.selectedItemIndex - 1) % self.items.length) + self.items.length) % self.items.length
    }

    if (key === '<enter>') {
      self.items[self.selectedItemIndex].action()
    }
  })
}

Menu.prototype.addItem = function (text, action) {
  var item = {
    text: text,
    action: action
  }
  this.items.push(item)
}

module.exports = Menu
