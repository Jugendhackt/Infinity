var air_resisstance = 0.1
var gravity = 0.4

class BoundingBox {
  constructor(positionX, positionY, width, height) {
    this.positionX = positionX
    this.positionY = positionY
    this.width = width
    this.height = height
  }

  cuts(other) {
    // other: BoundingBox
    // returns true if this box cuts other, otherwise returns false

    let l1 = this.positionX - this.width / 2
    let r1 = this.positionX + this.width / 2

    let l2 = other.positionX - other.width / 2
    let r2 = other.positionX + other.width / 2

    let t1 = this.positionY - this.height / 2
    let b1 = this.positionY + this.height / 2

    let t2 = other.positionY - other.height / 2
    let b2 = other.positionY + other.height / 2

    return r1 >= l2 && r2 >= l1 && b1 >= t2 && b2 >= t1
  }

  cutsRay(startX, startY, rayX, rayY) {
    let x1 = this.positionX - this.width / 2;
    let x2 = this.positionX + this.width / 2;

    let y1 = this.positionY - this.height / 2
    let y2 = this.positionY + this.height / 2;

    let intersections = []

    if (rayX != 0) {
      let tx1 = (x1 - startX) / rayX;
      if (0 <= tx1 && y1 <= startY + rayY * tx1 && startY + rayY * tx1 <= y2) intersections.push([tx1, [x1, startY + rayY * tx1], "X"]);

      let tx2 = (x2 - startX) / rayX;
      if (0 <= tx2 && y1 <= startY + rayY * tx2 && startY + rayY * tx2 <= y2) intersections.push([tx2, [x2, startY + rayY * tx2], "X"]);
    }

    if (rayY != 0) {
      let ty1 = (y1 - startY) / rayY;
      if (0 <= ty1 && x1 <= startX + rayX * ty1 && startX + rayX * ty1 <= x2) intersections.push([ty1, [startX + rayX * ty1, y1], "Y"]);

      let ty2 = (y2 - startY) / rayY;
      if (0 <= ty2 && x1 <= startX + rayX * ty2 && startX + rayX * ty2 <= x2) intersections.push([ty2, [startX + rayX * ty2, y2], "Y"]);
    }

    if (intersections.length == 0) return null;
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
  constructor(positionX, positionY, width, height) {
    this.positionX = positionX
    this.positionY = positionY
    this.width = width
    this.height = height

    this.bbox = new BoundingBox(positionX, positionY, width, height)

  }

  draw() {
    let diffX = player.positionX - player.screenX 

    strokeWeight(3)
    stroke("rgb(97,5,8)")
    fill("brown")
    rect(this.positionX - diffX, this.positionY, this.width, this.height)
  }

}
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

    this.ground = false 

    this.width = 50;
    this.height = 50;

    this.bbox = new BoundingBox(positionX, positionY, 50, 50)
  }

  // Bewege dich nach rechts

  update() {
    var oldX = this.positionX

    this.velocityX += this.accelerationX - this.velocityX * air_resisstance;
    this.velocityY += this.accelerationY + gravity;

    let targetX = this.positionX + this.velocityX;
    let targetY = this.positionY + this.velocityY;

    this.ground = false;

    for (let k = 0; k < 2; k++) {
      let stopX = false;
      let stopY = false;

      let nearest_collision = null

      for (let i = 0; i < all_plattforms.length; i++) {
        let next_plattform = all_plattforms[i]

        for (let j = 0; j < 20; j++) {
          let intersection = next_plattform.bbox.cutsRay(
            this.positionX + (1 - 2 * (j % 10) / 9) * this.width / 2,
            this.positionY + Math.sign(this.velocityY) * this.height / 2,
            this.velocityX,
            this.velocityY
          );

          /*line(this.screenX + (1 - 2 * (j % 10) / 9) * this.width / 2,
          this.positionY + Math.sign(this.velocityY) * this.height / 2,
          this.positionX + (1 - 2 * (j % 10) / 9) * this.width / 2+this.velocityX,
          this.positionY + Math.sign(this.velocityY) * this.height / 2+this.velocityY)*/

          if (j >= 10) {
            intersection = next_plattform.bbox.cutsRay(
            this.positionX + Math.sign(this.velocityX) * this.width / 2,
            this.positionY + (1 - 2 * (j % 10) / 9) * this.height / 2,
            this.velocityX,
            this.velocityY
          );

          /*line(this.screenX + Math.sign(this.velocityX) * this.width / 2,
          this.positionY + (1 - 2 * (j % 10) / 9) * this.height / 2,
          this.positionX + Math.sign(this.velocityX) * this.width / 2+this.velocityX,
          this.positionY + (1 - 2 * (j % 10) / 9) * this.height / 2+this.velocityY)*/
          
        }


          if (!intersection || intersection[0] > 1) continue;

          // Hier haben wir jetzt eine Intersection
          // -> Uns interessiert nur die näheste Intersection
          if (!nearest_collision || nearest_collision[0] > intersection[0]) {
            nearest_collision = intersection;
          }
        }
      }


      if (nearest_collision) {
        // Target Position updaten
        if (nearest_collision[2] == "X"&& this.velocityX < 0) {
          targetX = max(targetX, nearest_collision[1][0] + this.width / 2 + 0.01);
        }
        if (nearest_collision[2] == "X"&& this.velocityX > 0) {
          targetX = min(targetX, nearest_collision[1][0] - this.width / 2 - 0.01);
        }

        if (nearest_collision[2] == "Y"&& this.velocityY < 0) {
          targetY = max(targetY, nearest_collision[1][1] + this.height / 2 + 0.01);
        }
        if (nearest_collision[2] == "Y"&& this.velocityY > 0) {
          targetY = min(targetY, nearest_collision[1][1] - this.height / 2 - 0.01);
        }



        // Note which direction should be stoped
        stopX = nearest_collision[2] == "X";
        stopY = nearest_collision[2] == "Y";
      }

      /*if(nearest_collision) {
        circle(nearest_collision[1][0], nearest_collision[1][1],4)
      }*/


      if (stopX) {
        this.velocityX = 0;
        this.positionX = targetX;
      }
      else if (stopY) {
        this.ground = true
        this.velocityY = 0;
        this.positionY = targetY;
      }
      else{
        this.positionX = targetX;
        this.positionY = targetY;

        this.bbox.reposition(this.positionX, this.positionY)
        break;
      }


      this.bbox.reposition(this.positionX, this.positionY)
    }

    var diffX = this.positionX - oldX
    this.screenX += diffX
    if(this.screenX >= 0.9 * windowWidth) {
      this.screenX = 0.9 * windowWidth
    }
    if(this.screenX <= 0.1 * windowWidth) {
      this.screenX = 0.1 * windowWidth
    }
  }

  /*
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
  */
  draw() {
    rectMode(CENTER);
    fill("rgb(19, 34, 194)")
    stroke("rgb(14,21,115)")
    strokeWeight(3)
    square(this.screenX, this.positionY, 50)
    strokeWeight(1)  
  }

}

function keyPressed() {
  if (keyCode == RIGHT_ARROW) {
    player.accelerationX = 1
  }
  if (keyCode == LEFT_ARROW) {
    player.accelerationX = -1
  }
  if (keyCode == UP_ARROW && player.ground) {
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
    if (player.accelerationX > 0) player.accelerationX = 0
  }
  if (keyCode == LEFT_ARROW) {
    if (player.accelerationX < 0) player.accelerationX = 0

  }
}

var movingClouds = 0
var player = new Player(100, 100)
var ground = new Plattform(0, window.innerHeight - 40, 20000, 90)
var plattform1 = new Plattform(610, window.innerHeight - 130, 90, 90)
var plattform2 = new Plattform(200, window.innerHeight - 220, 90, 90)
var plattform3 = new Plattform(200, window.innerHeight - 260, 90, 90)
var plattform4 = new Plattform(290, window.innerHeight - 130, 90, 90)
var plattform5 = new Plattform(700, window.innerHeight - 130, 90, 90)
var plattform6 = new Plattform(700, window,innerHeight - 310, 90, 90)


var all_plattforms = [ground, plattform1, plattform3, plattform4, plattform5]

function setup() {

  createCanvas(window.innerWidth, window.innerHeight);

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
    circle(windowWidth / 10 * i - diffX, 0.92 * windowHeight, 0.25 * windowHeight)
  }
  strokeWeight(1)

  // Dirt/Floor
  /*fill("brown")
  stroke("brown")
  rectMode(CORNER)
  rect(0, 0.925 * windowHeight, windowWidth, 0.075 * windowHeight)*/

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


function draw() {
  //background("grey");
  drawBackground()
  player.draw()
  for (let i = 0; i < all_plattforms.length; i++) {
    const element = all_plattforms[i];
    element.draw()
  }

  player.update()

}

