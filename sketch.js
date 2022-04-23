/*
Eine Klasse repräsentiert irgendein Objekt (Bspw. Boden, Spielfigur haben, ...)
Eine Klasse hat zwei große Bestandteile
- Die Attribute (Eigentschaften) des Objekts (Bspw. Position, Geschwindigkeit, Leben bei der Spielfigur, ...) 
  -> Hierfür verwenden wir Variablen, jedes Attribut ist eine Variable
- Funktionen, aka. was kann das Objekt? (Bspw. beim Quadrat Funktionen wie moveLeft, moveRight, ...)
  -> Bei uns haben so gut wie alle Klassen eine update und eine draw Funktion (siehe Game-Loop)
*/

class Quadrat{
  // Wird beim Erstellen der Klasse aufgerufen
  constructor(positionX, positionY, sideLength, color) {
    // this.VARIABLE -> Variable die zur Klasse gehört
    this.positionX = positionX;
    this.positionY = positionY;
    this.sideLength = sideLength;
    this.color = color;
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
    fill(this.color)
    square(this.positionX, this.positionY, this.sideLength)
  }
}
// Das ist der Bauplan, jetzt kann man eine konkrete Instanz der Klasse mittels "new"  bauen
var quadrat1 = new Quadrat(375, 375, 100, "green");
var quadrat2 = new Quadrat(100, 375, 20, "red");
var quadrat3 = new Quadrat(100, 100, 20, "blue");


// Globale Variablen
// -> Variablen: Schublade wo irgendwas drinnen liegt

// var squareX = 200;


/* 
Wird einmal beim Laden der Webseite ausgeführt
-> Hier wird das eigentliche Programm vorbereitet (bspw. Bilder werden geladen, ein Canvas wird erstellt, ...)
*/
function setup() {
  // put setup code here
  createCanvas(750, 750);
  background("grey");
}

/*
Wird nach der Setup Funktion in einer Schleife ausgeführt
-> Hier wird auf dem Bildschirm gezeichnet
*/
function draw() {
  /*
  Für das Spiel brauchen Game-Loop. 2 Sachen passieren hier
  1. Update die Spielphysik (bewege Figuren, Kollisionsdetektion, ...)
  2. Zeichne den nächsten Frame
  */

  /*
  Bsp.
  // 1. Update der Spielphysik
  if (keyIsDown(RIGHT_ARROW)) {
    squareX = squareX+1;
  }

  // 2. Zeichne den nächsten Frame
  // Zeichne ein Quadrat
  background("grey");

  rectMode(CENTER);
  fill("green")
  square(squareX, 375, 100)

  fill("red")
  square(100, 375, 20)
  */

  // Hilfreiches Konzept: Klassen
  // 1. Update der Spielphysik
  quadrat1.update()
  quadrat2.update()
  quadrat3.update()

  // 2. Zeichne den nächsten Frame
  background("grey");
  quadrat1.draw()
  quadrat2.draw()
  quadrat3.draw()

}

// Wird ausgeführt, wenn eine Taste nach unten gedrückt wurde 
function keyPressed(){
  // keyCode: Welche Taste wurde betätigt?
  // -> https://keycode.info
  if (keyCode === LEFT_ARROW) {
    squareX = squareX-1;
  }

}

// Wird ausgeführt, wenn eine Taste nach losgelassen wurde 
function keyReleased(){
  //squareX = squareX-1;
}
