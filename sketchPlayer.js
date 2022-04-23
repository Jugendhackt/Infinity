var air_resisstance = 0.1


class Player{
  // Wird beim Erstellen der Klasse aufgerufen
  constructor(positionX, positionY) {
    // this.VARIABLE -> Variable die zur Klasse gehört
    this.positionX = positionX;
    this.positionY = positionY;
  
    this.velocityX= 0;
    this.velocityY = 0;
   this.accelerationX = 0
   this.accelerationY = 0

  }

  // Bewege dich nach rechts
  
  
  
    update(){

  
   this.velocityX += this.accelerationX - this.velocityX * air_resisstance
   this.velocityY += this.accelerationY
    this.positionY += this.velocityY
    this.positionX += this.velocityX
  }

  draw(){
    rectMode(CENTER);
    fill("green")
    square(this.positionX, this.positionY,50)
  }



} 

function keyPressed () {
  if (keyCode == RIGHT_ARROW) {
    player.accelerationX = 1
  }
  if (keyCode == LEFT_ARROW) {
    player.accelerationX= -1
  }


}

function keyReleased () {

  if (keyCode == RIGHT_ARROW) {
    player.accelerationX = 0
  }
  if (keyCode == LEFT_ARROW) {
    player.accelerationX = 0
  
  }
}


var player =new Player(100,100)
function setup () {

createCanvas(window.innerWidth,window.innerHeight);
}

function draw () {
  player.update()
  background("grey");
  player.draw()

}