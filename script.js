let hitmap;
let gamestate;
let p;

function preload() {

//load assets
  hitmap=loadImage('images/level_hitmap_t.png');
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
    //console.log(keyCode);
}

//debug screen
function debug(){
    image(hitmap,0,0);
    p.display();
    p.move();
    //p.keyTyped();
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
    constructor(x,y){
        this.x = x;
        this.y = y;
        this.size = 25;
        this.ySpeed = 0;
        this.gravity = 0.3;
        this.findPlayerBounds();
        this.locked = false;
    }
    display(){
        fill(0,255,0);
        rect(this.x, this.y, this.size, this.size);
        // draw sensors
        fill(0,0,255);
        ellipse(this.left, this.middleY, 5, 5);
        ellipse(this.right, this.middleY, 5, 5);
        ellipse(this.middleX, this.up, 5, 5);
        ellipse(this.middleX, this.down, 5, 5);
    }
    findPlayerBounds(){
        this.left = this.x - 3;
        this.right = this.x + this.size + 3;
        this.up = this.y - 3;
        this.down = this.y + this.size + 3;
        this.middleX = this.x + this.size/2;
        this.middleY = this.y + this.size/2;
    }
    move(){
        //compute our current sensor position
        this.findPlayerBounds();

        // handle fall / jump movement
        this.handleFallJumpMovement();
        this.handleDoorMovement();
        
        if(keyIsDown(65) || keyIsDown(37)){
            if (!this.isPixelSolid(this.left, this.middleY)) {
                this.x -= 3;
              }
        }
        if(keyIsDown(68) || keyIsDown(39)){
           // only all movement if the next pixel is not solid
            if (!this.isPixelSolid(this.right, this.middleY)) {
                this.x += 3;
            }
        }
        if (keyIsDown(32) && this.isPixelSolid(this.middleX, this.down)) {
          this.ySpeed = -10;
        }
    }
    handleFallJumpMovement() {
        // apply gravity to our y Speed
        this.ySpeed += this.gravity;

        // adjust our y position based on our y Speed
        this.y += this.ySpeed;

        // speed limit!
        this.ySpeed = constrain(this.ySpeed, -10, 10);

        // moving down?
        if (this.ySpeed > 0) {
          // check the pixel below us. if it's solid, we need to stop!
          if (this.isPixelSolid(this.middleX, this.down)) {
            this.ySpeed = 0;

            // move us up to the pixel right above the thing we landed on that
            // isn't solid
            for (let i = this.down; i > 0; i--) {
              // test this color
              let testColor = this.isPixelSolid(this.middleX, i);

              // if it's not solid we can stop here!
              if (testColor == false) {
                this.y = i - this.size;
                break;
              }
            }
          }
        }
        // moving up?
        if (this.ySpeed < 0) {
          // check the pixel above us. if it's solid, we need to stop!
          if (this.isPixelSolid(this.middleX, this.up)) {
            this.ySpeed = 0;

            // move us up to the pixel right below the thing we hit that
            // isn't solid
            for (let i = this.up; i < height; i++) {
              // test this color
              let testColor = this.isPixelSolid(this.middleX, i);

              // if it's not solid we can stop here!
              if (testColor == false) {
                this.y = i;
                break;
              }
            }
          }
        } 
  }
    handleDoorMovement(){
        //check if a door was entered
        if(this.isDoor(this.middleX, this.up) && keyIsDown(13) && !this.locked){
            console.log('entered a door')
        }
        else if(this.isDoor(this.middleX, this.up) && keyIsDown(13) && this.locked){
            console.log('door is locked')
        }
        //check which door was entered - put in pixels
    }
    isPixelSolid(x,y){
        let temp = red(hitmap.get(x,y));
        if (temp == 0) {
          //console.log(temp);
          return true;
        }
          return false;
    }
    isDoor(x,y){
        let temp = red(hitmap.get(x,y));
        //console.log(temp);
        if (temp == 113) {
          return true;
        }  
          return false;  
    }
}
