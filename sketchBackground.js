var air_resisstance = 0.1


class Player {
  // Wird beim Erstellen der Klasse aufgerufen
  constructor(positionX, positionY) {
    // this.VARIABLE -> Variable die zur Klasse gehört
    this.positionX = positionX;
    this.positionY = positionY;
    this.screenX = 0.2 * window.innerWidth;

    this.velocityX = 0;
    this.velocityY = 0;
    this.accelerationX = 0
    this.accelerationY = 0

  }

  // Bewege dich nach rechts



  update() {
    this.velocityX += this.accelerationX - this.velocityX * air_resisstance
    this.velocityY += this.accelerationY
    this.positionY += this.velocityY
    this.positionX += this.velocityX

    this.screenX += this.velocityX
    if(this.screenX >= 0.9 * windowWidth) {
      this.screenX = 0.9 * windowWidth
    }
    if(this.screenX <= 0.1 * windowWidth) {
      this.screenX = 0.1 * windowWidth
    }
  }

  draw() {
    rectMode(CENTER);
    fill("green")
    square(this.screenX, this.positionY, 50)
  }



}

function drawBackground() {
  let diffX = player.positionX - player.screenX 

  // 2. Zeichne den nächsten Frame
  // Sky
  background("rgb(7,228,232)");

  // Grass
  fill("rgb(12,94,3)")
  stroke("rgb(9,66,3)")
  strokeWeight(5)
  for (let i = -100; i < 100; i++) {
    circle(windowWidth / 10 * i - diffX, 0.95 * windowHeight, 0.25 * windowHeight)
  }
  strokeWeight(1)

  // Dirt/Floor
  fill("brown")
  stroke("brown")
  rectMode(CORNER)
  rect(0, 0.925 * windowHeight, windowWidth, 0.075 * windowHeight)

  // Clouds
  fill("white")
  stroke("white")
  strokeWeight(1)

  function noise(c) {
    return windowHeight * 0.05 * Math.sin(3 + c);
  }


  movingClouds += 1
  for (let c = -100; c < 100; c++){
    circle(windowWidth / 1.5 * c - diffX / 10 + noise(1*c) + movingClouds / 5, 0.1 * windowWidth + noise(11*c), 0.25 * windowHeight + noise(2*c))
    circle(windowWidth / 1.5 * (c+0.05) - diffX / 10 + noise(3*c) + movingClouds / 5, 0.15 * windowWidth + noise(12*c), 0.25 * windowHeight + noise(4*c))
    circle(windowWidth / 1.5 * (c+0.1) - diffX / 10 + noise(5*c) + movingClouds / 5, 0.1 * windowWidth + noise(13*c), 0.25 * windowHeight + noise(6*c))
  }
   

}


function keyPressed() {
  if (keyCode == RIGHT_ARROW) {
    player.accelerationX = 1
  }
  if (keyCode == LEFT_ARROW) {
    player.accelerationX = -1
  }


}

function keyReleased() {

  if (keyCode == RIGHT_ARROW) {
    player.accelerationX = 0
  }
  if (keyCode == LEFT_ARROW) {
    player.accelerationX = 0

  }
}

var movingClouds = 0
var player = new Player(100, 100)


function setup() {
  createCanvas(window.innerWidth, window.innerHeight);
}

function draw() {
  player.update()
  drawBackground();
  player.draw()

}