let hitmap;
let gamestate;
let p;
let time;
let begin;
let playing = false;
let firstgame = true;
let coins = [];
let tempCoin;
let mgpoints;
let overlapping;


let playersprites;
let spritedata;
let testsprite;
let walkL, walkR;

let action = 'idle';
let animation = [];


function preload() {

//load assets
  hitmap=loadImage('images/level_hitmap_t.png');

  //player spritesheet assets and info
  spritedata = loadJSON('spriteframes.json');
  playersprites = loadImage('images/spritesheets/playersprites.png');

}

function setup() {
    createCanvas(800,600);
    
//set gamestate
    gamestate=4;
    p = new Player(200,200);
    
    setInterval(timer, 1000);
    //for(let i = 0; i < 20; i++){
            //tempCoin = new mgCoin();
           // tempCoin.setPos();
            //coins.push( tempCoin );
    //}


    //for player sprite testing purposes
    let frames = spritedata.frames;
    for (let i = 0; i < frames.length; i++){
      let pos = frames[i].position;
      let img = playersprites.get(pos.x,pos.y,pos.w,pos.h);
      animation.push(img);
    }

    testsprite = createImg('images/spritesheets/test.gif');
    walkL = createImg('images/spritesheets/walkL.gif');
    walkR = createImg('images/spritesheets/walkR.gif');
    walkR.position(-100,0);
    walkL.position(-100,0);
    console.log(animation);
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
    // timer that controls game inspired by sample code: https://editor.p5js.org/denaplesk2/sketches/ryIBFP_lG
    //click to begin
    if(mouseIsPressed && !playing){
        playing = true;
        mgpoints=0;
        setTimer();
    }
    background(100);
    fill(0);
    
    //game is being played
    if(playing){
        text(mgpoints+' points', 20, 25);
        if (time >= 10) {
        text("0:" + time, width / 2, height / 2);
      }
        if (time < 10 && time > 0) {
        text('0:0' + time, width / 2, height / 2);
      }
        if (time == 0) {
        playing = false;
        firstgame = false;
        }
        p.display();
        p.moveInMinigame();
        //if(!overlapping){
            
        //}
        while(coins.length < 20){
            tempCoin = new mgCoin();
            tempCoin.setPos();
            coins.push( tempCoin );
        }
        for(let i = 0; i < coins.length; i++){
            coins[i].display();
        }
        for(let i = 0; i < coins.length; i++){
        if(coins[i].col()){
            mgpoints +=1;
            coins.splice(i, 1);
        }
        }
        console.log(coins.length);
    }
    //game is over
    else if(firstgame){
        text("Press Mouse to Start Game", width / 2, height / 2 + 15);
    }
    else{
        text('Game Over. Click Again to Play', width / 2, height / 2 + 15);
    }
    
}

function timer() {
  if (time > 0) {
    time--;
  }
}
function setTimer(){
   time = 30; 
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
        //rect(this.x, this.y, this.size, this.size);
        testsprite.position(this.x,this.y);
        // draw sensors
        fill(0,0,255);
        if(gamestate != 4){
        ellipse(this.left, this.middleY, 5, 5);
        ellipse(this.right, this.middleY, 5, 5);
        ellipse(this.middleX, this.up, 5, 5);
        ellipse(this.middleX, this.down, 5, 5);
        }
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
    moveInMinigame(){
        if(keyIsDown(65) || keyIsDown(37)){
            this.x -= 4;
        }
        if(keyIsDown(68) || keyIsDown(39)){
           this.x += 4;
        }
        if(keyIsDown(87) || keyIsDown(38)){
           this.y -= 4;
        }
        if(keyIsDown(83) || keyIsDown(40)){
           this.y += 4;
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

class mgCoin{
    constructor(){
        this.x;
        this.y;
    }
    setPos(){
//        overlapping = false;
//        for(let i = 0; i < coins.length; i++){
//            let other = coins[i];
//            let d = (this.x, this.y, other.x, other.y);
//            if(d < 100){
//                overlapping = true;
//                break;
//            }
//        }
//        if(!overlapping){
                this.x = floor(random(30,width-30));
                this.y = floor(random(30,height-30)); 
       // }

    }
    display(){
        fill(255,0,0);
        circle(this.x,this.y,30,30);
    }
    col(){
        for(let i=0; i < coins.length; i++){
        if(dist(this.x+30, this.y+30, this.x+15 + this.y+15)){
            console.log(i+" is too close")
        }
        if (dist(this.x+15, this.y+15, p.x+15, p.y+15) < 30) {
             return true;
         }
            return false;
    }
}
}
