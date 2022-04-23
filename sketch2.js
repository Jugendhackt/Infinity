var air_resisstance = 0.1
var gravity = 0.4

class BoundingBox {
  constructor (positionX,positionY,width,height) {
    this.positionX = positionX
    this.positionY = positionY
    this.width = width
    this.height = height
  }

  cuts(other){
    // other: BoundingBox
    // returns true if this box cuts other, otherwise returns false

    let l1 = this.positionX - this.width/2
    let r1 = this.positionX + this.width/2

    let l2 = other.positionX - other.width/2
    let r2 = other.positionX + other.width/2

    let t1 = this.positionY - this.height/2
    let b1 = this.positionY + this.height/2

    let t2 = other.positionY - other.height/2
    let b2 = other.positionY + other.height/2
    
    return r1 >= l2 && r2 >= l1 && b1 >= t2 && b2 >= t1
  }

  cutsRay(startX, startY, rayX, rayY){
    let x1 = this.positionX - this.width/2;
    let x2 = this.positionX + this.width/2;

    let y1 = this.positionY - this.height/2
    let y2 = this.positionY + this.height/2;

    let intersections = []

    if(rayX != 0){
      let tx1 = (x1 - startX)/rayX;
      if(0 <= tx1 && y1 <= startY+rayY*tx1 && startY+rayY*tx1 <= y2) intersections.push([tx1, [x1, startY+rayY*tx1], "X"]);

      let tx2 = (x2 - startX)/rayX;
      if(0 <= tx2 && y1 <= startY+rayY*tx2 && startY+rayY*tx2 <= y2) intersections.push([tx2, [x2, startY+rayY*tx2], "X"]);
    }

    if(rayY != 0){
      let ty1 = (y1 - startY)/rayY;
      if(0 <= ty1 && x1 <= startX+rayX*ty1 && startX+rayX*ty1 <= x2) intersections.push([ty1, [startX+rayX*ty1, y1], "Y"]);

      let ty2 = (y2 - startY)/rayY;
      if(0 <= ty2 && x1 <= startX+rayX*ty2 && startX+rayX*ty2 <= x2) intersections.push([ty2, [startX+rayX*ty2, y2], "Y"]);
    }

    if(intersections.length == 0) return null;
    intersections.sort()

    return intersections[0];
  }

  reposition(new_x, new_y) {
    this.positionX = new_x
    this.positionY = new_y
  }

  resize(new_width, new_height) {
    this.width = new_width
    this.height = new_height
  }
}

class Plattform {
constructor (positionX,positionY,width,height) {
  this.positionX = positionX
  this.positionY = positionY
  this.width = width
  this.height = height

  this.bbox = new BoundingBox(positionX,positionY,width,height)
  
}

draw () {
  fill ("brown")
  rect (this.positionX,this.positionY,this.width,this.height)
}

}
class Player {
  // Wird beim Erstellen der Klasse aufgerufen
  constructor(positionX, positionY) {
    // this.VARIABLE -> Variable die zur Klasse gehört
    this.positionX = positionX;
    this.positionY = positionY;

    this.velocityX = 0;
    this.velocityY = 0;
    this.accelerationX = 0
    this.accelerationY = 0

    this.width = 50;
    this.height = 50;

    this.bbox = new BoundingBox(positionX,positionY,50,50)
  }

  // Bewege dich nach rechts



  
  update() {
    this.velocityX += this.accelerationX - this.velocityX * air_resisstance;
    this.velocityY += this.accelerationY + gravity;

    let targetX = this.positionX + this.velocityX; 
    let targetY = this.positionY + this.velocityY; 

    let stopX = false;
    let stopY = false;



    for(let i=0; i < all_plattforms.length; i++){
      let next_plattform = all_plattforms[i]
      let nearest_collision = null


      for(let j=0; j < 20; j++){
        let intersection = next_plattform.bbox.cutsRay(
          this.positionX+(1-2*Math.floor(j%2))*this.width/2,
          this.positionY+(1-2*Math.floor(j/2))*this.height/2,
          this.velocityX,
          this.velocityY
        );
        
        if(j > 3) intersection = next_plattform.bbox.cutsRay(
          this.positionX+Math.sign(this.velocityX)*this.width/2,
          this.positionY+(1-2*j/20)*this.height/2,
          this.velocityX,
          this.velocityY
        );
        

        if(!intersection || intersection[0] > 1) continue;
        
        // Hier haben wir jetzt eine Intersection
        // -> Uns interessiert nur die näheste Intersection
        if(!nearest_collision || nearest_collision[0] > intersection[0]){
          nearest_collision = intersection;
        }
      }


      if(!nearest_collision) continue;

      // Target Position updaten
      if(nearest_collision[2] == "X" && this.velocityX < 0){
        targetX = max(targetX, nearest_collision[1][0]+this.width/2+0.01);
      } 
      if(nearest_collision[2] == "X" && this.velocityX > 0){
        targetX = min(targetX, nearest_collision[1][0]-this.width/2-0.01);
      } 

      if(nearest_collision[2] == "Y" && this.velocityY < 0){
        targetY = max(targetY, nearest_collision[1][1]+this.height/2+0.01);
      } 
      if(nearest_collision[2] == "Y" && this.velocityY > 0){
        targetY = min(targetY, nearest_collision[1][1]-this.height/2-0.01);
      } 
      


      // Note which direction should be stoped
      if(nearest_collision[2] == "X") stopX = true;
      stopY ||= nearest_collision[2] == "Y";
    }

    this.positionX = targetX;
    this.positionY = targetY;


    if(stopX){
      this.velocityX = 0;
    } 

    if(stopY){
      this.velocityY = 0;
    } 

    this.bbox.reposition(this.positionX,this.positionY)


  }

  draw() {
    rectMode(CENTER);
    fill("green")
    square(this.positionX, this.positionY, 50)
  }



}

function keyPressed() {
  if (keyCode == RIGHT_ARROW) {
    player.accelerationX = 1
  }
  if (keyCode == LEFT_ARROW) {
    player.accelerationX = -1
  }
  if (keyCode == UP_ARROW) {
    player.velocityY = -10
    player.positionY -= 0.001
  }

  // 32 is KeyCode for SpaceBar
  /*
  if (keyCode == 32) {
    player.accelerationY = 5
  }
  */

}

function keyReleased() {

  if (keyCode == RIGHT_ARROW) {
    if(player.accelerationX > 0) player.accelerationX = 0
  }
  if (keyCode == LEFT_ARROW) {
    if(player.accelerationX < 0) player.accelerationX = 0

  }
}

var player = new Player(100, 100) 
var ground = new Plattform (0,window.innerHeight-40,20000,90)
var plattform1 = new Plattform (610,window.innerHeight-130,90,90)
var plattform2 = new Plattform (200,window.innerHeight-220,90,90)
var plattform3 = new Plattform (200,window.innerHeight-310,90,90)


var all_plattforms = [ground, plattform1,plattform2, plattform3]

function setup() {

  createCanvas(window.innerWidth, window.innerHeight);
  
}

function draw() {
  player.update()
  background("grey");
  player.draw() 
  for (let i = 0; i < all_plattforms.length; i++) {
    const element = all_plattforms[i];
    element.draw()
  }
}
