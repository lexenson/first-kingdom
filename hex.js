//pointy-topped hexagon
var hex = {
  size: 10,
  center: center(this)
}

hex.pos = {
    x: 0,
    y: 0,
    z: 0
  }

hex.height = hex.size*2;

hex.width = (Math.sqrt(3)/2) * hex.height;

//returns the manhatten distance between hexagon a and hexagon b
function distance(a,b) {
  return (Math.abs(a.x - b.x) + Math.abs(a.y - b.y) + Math.abs(a.z - b.z))/2;
}

//returns the x-and y-coordinates of the centre of the given hexagon a
function center(a){
  return {x: (this.x)*(this.width/2) * (3*this.height/2) + (this.y)*(-this.width/2)*(3*this.height/2), y: this.width * this.z }
}

//returns an object with the coordinates of the neighbours of hexagon a
function getNeighborCoordinates(a) {
  var x,y,z;
  x = a.pos.x;
  y = a.pos.y;
  z = a.pos.z;
  return {
    'topRight':     {x: x+1, y: y, z: z-1},
    'right':        {x: x+1, y: y-1, z: z},
    'bottomRight':  {x: x, y: y-1, z: z+1},
    'bottomLeft':   {x: x-1, y: y, z: z+1},
    'left':         {x: x-1, y: y+1, z: z},
    'topLeft':      {x: x, y: y+1, z: z-1}
  }
}

//returns a list of the coordinates of the hexagons within range n of hexagon a
function getHexagonsWithinRange(hexes, a, n) {
  range = [];
  for (hex of hexes) {
    if (distance(a, hex)<=n) {
      range.push(hex);
    }
  }

  return range;
}

// takes the position of  a hexagon and returns the index at which it is stored in inside the array of hexes, if it were in it
function getIndexFromCoordinates(pos) {
  var coordinateSum = Math.abs(pos.x) + Math.abs(pos.y) + Math.abs(pos.z);
  var ring = coordinateSum / 2
  var base = 2*ring + 1; // base of the numbers of that particular ring, if lowest number is transformed to 0

  // indices for all the lower rings are added up
  var index = 0; // 0-th ring is already counted
  for (i = 1; i < ring; i++) {
    index += 6*i;
  }
  console.log(index);

  // transforming the x and z coordinate (only to are needed to find out the index) into numbers from base 2*ring+1
  var x_trans = base*(pos.x + ring);
  var z_trans = (pos.z + ring);
  var trans = x_trans + z_trans;

  //resulting ring_index is just the number in the base system - all the instances where x == z, because they can't actually exist in the ring
  var ring_index = (trans) - Math.floor(trans/(base+1));

  console.log(ring_index);
  return index + ring_index;

  //DOESN'T work
  //There is not enough indices being subtracted inside the ring index equation (e.g.: -2,-1 is not subtracted, even though it doesn't exist)
  // all numbers have to be subtracted where |x + z| > ring
}

console.log(getIndexFromCoordinates({x:-2, y:2, z:0}));
