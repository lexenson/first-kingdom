var Hexagon = require('./hex.js');

var RADIUS = 25

//Creating canvas
var canvas = document.createElement("canvas");
canvas.width = 1000;
canvas.height = 500;
document.body.appendChild(canvas);
var ctx = canvas.getContext("2d");

ctx.fillStyle = '#D8D3D0'
ctx.fillRect(0, 0, 800, 600)

function pixelToHex2(x, y) {
  x += RADIUS+1;
  y += RADIUS;
  var h_z = Math.round(y/(RADIUS/2));

  var y_inter = y - (30*Math.PI/180) * x;

  var x_dist = Math.sqrt(Math.pow(x,2) + (Math.pow(y - y_inter),2));
  var h_x = Math.round(x_dist/((3/2)*RADIUS));
  var h_y = -h_z -h_x;

  return {
    x: h_x,
    y: h_y,
    z: h_z
  }
}

function hexRound(h) {
  var r = {}
  r.x = Math.round(h.x)
  r.y = Math.round(h.y)
  r.z = Math.round(-h.x-h.y)

  var xDiff = Math.abs(r.x - h.x)
  var yDiff = Math.abs(r.y - h.y)
  var zDiff = Math.abs(r.z - h.z)

  if (xDiff > yDiff && xDiff > zDiff) {
    r.x = -r.z-r.z
  } else if (yDiff > zDiff) {
    r.y = -r.x-r.z
  } else {
    r.z = -r.x-r.y
  }

  return r
}

function pixelToHex(x, y) {
  var r = {}
  x -= RADIUS + 1
  y -= RADIUS + 1
  r.x = (x * Math.sqrt(3)/3 - y / 3) / RADIUS
  r.y = y * 2/3 / RADIUS
  return hexRound(r)
}

var hexagons = {}

for(var x = 0; x < 10; x++) {
  for(var y = 0; y < 10; y++) {
    hexagons[x + ',' + y] = new Hexagon(x, y, -y-x)
  }
}

var i;

//Game variables
var game_state = ["menu", "paused", "running"];
var current_state = game_state[0]; // game starts in menu

//input
var keyState = {};
keyState.left = false;
keyState.right = false;
keyState.up = false;
keyState.down = false;
keyState.numpad1 = false;
keyState.numpad1 = false;
keyState.numpad2 = false;
keyState.numpad3 = false;
keyState.numpad4 = false;
keyState.numpad5 = false;
keyState.numpad6 = false;
keyState.numpad7 = false;
keyState.numpad8 = false;
keyState.numpad9 = false;

window.addEventListener("keyup", keyUpHandler, false);

window.addEventListener("keydown", keyDownHandler, false);

function keyUpHandler(event) {
  event.preventDefault();
  if(event.keyCode == 37){
    keyState.left = false;
    event.preventDefault();
  } else if(event.keyCode == 38){
    keyState.up = false;
    event.preventDefault();
  } else if(event.keyCode == 39){
    keyState.right = false;
    event.preventDefault();
  } else if(event.keyCode == 40){
    keyState.down = false;
    event.preventDefault();
  } else if(event.keyCode == 97){
    keyState.down = false;
    event.preventDefault();
  }  else if(event.keyCode == 98){
    keyState.down = true;
    event.preventDefault();
  }  else if(event.keyCode == 99){
    keyState.down = true;
    event.preventDefault();
  }  else if(event.keyCode == 100){
    keyState.down = true;
    event.preventDefault();
  }  else if(event.keyCode == 101){
    keyState.down = true;
    event.preventDefault();
  }  else if(event.keyCode == 102){
    keyState.down = true;
    event.preventDefault();
  }  else if(event.keyCode == 103){
    keyState.down = true;
    event.preventDefault();
  }  else if(event.keyCode == 104){
    keyState.down = true;
    event.preventDefault();
  }  else if(event.keyCode == 105){
    keyState.down = true;
    event.preventDefault();
  }
}

function keyDownHandler(event) {
  if(event.keyCode == 37){
    keyState.left = true;
    event.preventDefault();
  } else if(event.keyCode == 38){
    keyState.up = true;
    event.preventDefault();
  } else if(event.keyCode == 39){
    keyState.right = true;
    event.preventDefault();
  } else if(event.keyCode == 40){
    keyState.down = true;
    event.preventDefault();
  }  else if(event.keyCode == 97){
    keyState.down = false;
    event.preventDefault();
  }  else if(event.keyCode == 98){
    keyState.down = false;
    event.preventDefault();
  }  else if(event.keyCode == 99){
    keyState.down = false;
    event.preventDefault();
  }  else if(event.keyCode == 100){
    keyState.down = false;
    event.preventDefault();
  }  else if(event.keyCode == 101){
    keyState.down = false;
    event.preventDefault();
  }  else if(event.keyCode == 102){
    keyState.down = false;
    event.preventDefault();
  }  else if(event.keyCode == 103){
    keyState.down = false;
    event.preventDefault();
  }  else if(event.keyCode == 104){
    keyState.down = false;
    event.preventDefault();
  }  else if(event.keyCode == 105){
    keyState.down = false;
    event.preventDefault();
  }
}

// mouse

document.onmousemove = function (e) {
  var pos = pixelToHex(e.pageX, e.pageY)

  var hex = hexagons[pos.x + ',' + pos.y]
  if (hex) hex.color = '#ff0000'
}


var gameObjects = []

//main game functions
function main() {
  now  = timestamp();
  dt = (now - last) / 1000; //in ms
  while(dt > step){
    dt = dt - step;
    update(dt);
  }
  draw(dt);

  last = now;

  requestAnimationFrame(main);
}

function init() {

}

function update(dt) {
  for(i=0; i<gameObjects.length; i++){
    if(gameObjects[i].update){
      gameObjects[i].update(dt);
    }
  }
}


function draw(dt) {
  //clears the context in preparation for redrawing
  //ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (var index in hexagons) {
    hexagons[index].draw(ctx)
  }
  for(i=0; i<gameObjects.length; i++){
    if(gameObjects[i].draw){
      gameObjects[i].draw();
    }
  }
}


function timestamp() {
  return window.performance && window.performance.now ? window.performance.now() : new Date().getTime();
}
//Running the Game
var now, dt;
var step = 1/60;
var last = timestamp();
init();
requestAnimationFrame(main);
