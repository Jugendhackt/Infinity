class Player{
    // Wird beim Erstellen der Klasse aufgerufen
    constructor(positionX, positionY) {
      // this.VARIABLE -> Variable die zur Klasse gehört
      this.positionX = positionX;
      this.positionY = positionY;
    
      
    }
  
    // Bewege dich nach rechts
    moveRight(){
      this.positionX = this.positionX + 1;
    }
  
    update(){
      if (keyIsDown(RIGHT_ARROW)) {
        this.moveRight();
      }
    }
  
    draw(){
      rectMode(CENTER);
      fill("green")
      square(this.positionX, this.positionY,50)
    }
  }