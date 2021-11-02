let cmap;
let gamestate;
let p;

function preload() {

//load assets
  cmap=loadImage('images/protomap.jpg');
}

function setup() {
    createCanvas(800,600);
    
//set gamestate
    gamestate=-100;
    p = new Player(200,200);
}

function draw() { 
    
// switch statement with game state - each corresponds to a different "screen"
  switch(gamestate){
      case 0:
          startScreen();
          break;
      case 1:
          hubScreen();
          break;
      case 2:
          levelOne();
          break;
      case 3:
          levelTwo();
          break;
      case 4:
          miniGame();
          break;
      case 5:
          bossLevel();
          break;
      case -100:
          debug();
          break;
  }
}

function keyPressed(){
    console.log(keyCode);
}

//debug screen
function debug(){
    image(cmap,0,0);
    p.display();
    p.move();
}

//levels screens 
function startScreen(){

}

function hubScreen(){
    
}

function levelOne(){
    
    
}

function levelTwo(){
    
    
}

function miniGame(){
    
    
}

function bossLevel(){
    
    
}

//player class prototype
class Player{
    constructor(initX,initY){
        this.x = initX;
        this.y = initY;
        this.dir;
    }
    display(){
        rectMode(CENTER);
        rect(this.x,this.y,30,30);
        rectMode(CORNER);
    }
    move(){
        if(keyIsDown(65)){
            this.x -= 2;
        }
        if(keyIsDown(68)){
            this.x += 2;
        }
        if(keyIsDown(87)){
            this.y -= 2;
        }
    }
}
