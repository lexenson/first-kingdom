function Player (id) {
  this.id = id
  this.resources = 0
  this.units = []
}

Player.prototype.addUnit = function (unit) {
  this.units.push(unit)
}

module.exports = Player
