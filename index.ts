var width = 500;
var height = 500;
var canvas = document.createElement('canvas');
var clock:number = 0;
var shift = 0;
enum Star {
  x,
  y,
  size,
  yVel,
  xVel,
}

canvas.setAttribute('height', `${height}px`);
canvas.setAttribute('width', `${width}px`);

document.body.appendChild(canvas);
var ctx = canvas.getContext('2d');

var stars:number[][] = [];

class Player {
  x: number;
  y: number;
  vX: number = 0;
  vY: number = 0;

  constructor(x:number, y:number) {
    this.x = x;
    this.y = y;

    window.addEventListener('keydown', (e:KeyboardEvent) => {
      if (e.keyCode === 38) {
        this.vY -= 0.1;
      }

      if (e.keyCode === 40) {
        this.vY += 0.1;
      }

      if (e.keyCode === 37) {
        this.vX -= 0.1;
      }

      if (e.keyCode === 39) {
        this.vX += 0.1;
      }
    });
  }

  private shift() {
    if (shift > 0) {
      shift -= 4;
    } else {
      shift += 10;
    }
  }

  tick() {
    this.y += this.vY;
    this.x += this.vX;

    if (this.y < 0 || this.y > height) {
      this.y -= this.vY;
      this.vY *= -0.3;
      this.y += this.vY;
      this.shift();
    }


    if (this.x < 0 || this.x > width) {
      this.x -= this.vX;
      this.vX *= -0.3;
      this.x += this.vX;
      this.shift();
    }
  }
}

function genStar(idx:number) {
  stars[idx] = stars[idx] || [];
  stars[idx][Star.x] = Math.random() * width;
  stars[idx][Star.y] = -1;
  stars[idx][Star.yVel] = .4 + Math.random() * 10;
  stars[idx][Star.xVel] = (~~(Math.random() * 2 > 0.5) ? -1 : 1) * Math.random() * 0.1;
  stars[idx][Star.size] = 1 + Math.random() * 2;
}

function tickStar(idx) {
  stars[idx][Star.x] += stars[idx][Star.xVel]
  stars[idx][Star.y] += stars[idx][Star.yVel]

  if (stars[idx][Star.x] >= width || stars[idx][Star.y] >= height) {
    genStar(idx);
  }
}

for (var i = 0; i < 300; ++i) {
  genStar(i);
}

function tickStars() {
  for(var i = 0; i < stars.length; ++i) {
    tickStar(i);
  }
}

function rgbShift(amount:number=1) {
  if (amount <= 0) {
    return;
  }

  amount = Math.floor(amount) + ~~(Math.random() * 2);

  var imgData = ctx.getImageData(0, 0, width, height);

  var shiftAmountR = 10 * amount;
  var shiftAmountG = 5 * amount;
  var shiftAmountB = 5 * amount;
  for(var i = 0; i < imgData.data.length; i += 4) {
    var r = imgData.data[i];
    imgData.data[i] = 0;
    var destIdxR = i - (width * (4 * shiftAmountR)) -shiftAmountR * 4
    if (destIdxR > 0) {
      imgData.data[destIdxR] = r;
    }

    var g = imgData.data[i + 1];
    imgData.data[i + 1] = 0;
    var destIdxG = i - (width * (4 * shiftAmountG)) + 1
    if (destIdxG > 0) {
      imgData.data[destIdxG] = g;
    }

    var b = imgData.data[i + 2];
    var destIdxB = i - (4 * shiftAmountB) + 2;
    imgData.data[i + 2] = 0;
    if (destIdxB > 0 && destIdxB < imgData.data.length) {
      imgData.data[destIdxB] = b;
    }
  }

   ctx.putImageData(imgData, 0, 0);
}

function tick() {
  ctx.globalCompositeOperation = 'source-over';
  ctx.fillStyle = 'rgba(255,255,255,0.9)';
  ctx.fillRect(0, 0, 500, 500);
  ctx.fillStyle = 'rgba(255, 188, 82, 1)';
  ctx.fillRect(200, 0, 300, 500);

  ctx.fillStyle = 'rgba(255, 94, 0, 1)';
  ctx.fillRect(400, 0, 90, 500);

  ctx.fillStyle = 'rgba(238, 30, 255, 1)'
  for(var i = 0; i < stars.length; ++i) {
    ctx.fillRect(
      stars[i][Star.x],
      stars[i][Star.y],
      stars[i][Star.size],
      stars[i][Star.size]);
  }

  tickStars();

  ctx.fillStyle = 'rgba(60,248,255,0.2)';
  ctx.fillRect(0, 0, 10, height);
  ctx.fillRect(0, 490, width, 10);
  ctx.fillStyle = '#000';
  var size = Math.abs(player.vX * .9 * 3 * Math.random() + 40);
  ctx.font = `${size}px Arial`;
  ctx.fillText(String.fromCodePoint(0x1F410), player.x - size / 2, player.y + size / 2)
  rgbShift(shift)//Math.floor(Math.abs(Math.random() * player.vX)));
  ctx.fillText(String.fromCodePoint(0x1F410), player.x - size / 2, player.y + size / 2)
  player.tick();
  window.requestAnimationFrame(tick);
}


var player = new Player(width / 2, height * 0.9);
// Seed star pos
for (var i = 0; i < 50; ++i) {
  tickStars();
}

ctx.fillStyle = 'white';
ctx.fillRect(0, 0, width, height);
tick();
