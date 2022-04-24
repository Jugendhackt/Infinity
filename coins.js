function setup() {
  createCanvas(750, 750);
  background("grey");
}
class Coin {
  // Wird beim Erstellen der Klasse aufgerufen
  constructor(positionX, positionY, sideLength, color) {
    // this.VARIABLE -> Variable die zur Klasse gehört
    this.positionX = positionX;
    this.positionY = positionY;
    this.sideLength = sideLength;
    this.color = color;
  }

  draw() {
    fill(this.color)
    circle(this.positionX, this.positionY, this.sideLength)
  }
}

function draw() {
  //cirlce.draw()
  //fill("orange");
  rectMode(CENTER);

  var coins = []
  for (var i = 0; i < 10; i++) {
    coins.push(new Coin(10+20*i, 100, 100,"yellow"));
  }

  coins.forEach(coin => {
    coin.draw()
  });
}


