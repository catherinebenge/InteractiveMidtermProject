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
let bg_x = 0;
let bushes;
let bushes_x = 0;
let trees;
let trees_x = 0;
let front_leaves;
let front_leaves_x = 0;
let scrolling = false;
let test_hitmap;
let level1_hitmap;

function preload() {

//load assets
  test_hitmap=loadImage('images/level_hitmap_t.png');
  level1_hitmap = loadImage('images/level1hitmap.png');
  level1bg = loadImage('images/spritesheets/parallax_forest2/j1.png');
  bushes = loadImage('images/spritesheets/parallax_forest1/bushes.png');
  trees = loadImage('images/spritesheets/parallax_forest1/trees.png');
  front_leaves = loadImage('images/spritesheets/parallax_forest1/frontleaves.png');
}

function setup() {
    createCanvas(800,600);
    
//set gamestate
    gamestate=2;
    p = new Player(200,200);
    
    setInterval(timer, 1000);
    //for(let i = 0; i < 20; i++){
            //tempCoin = new mgCoin();
           // tempCoin.setPos();
            //coins.push( tempCoin );
    //}

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
    hitmap = test_hitmap;
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
    // moving hitmap for first lvl
    level1_hitmap.resize(4268, 600);
    hitmap = level1_hitmap;
    image(hitmap, bg_x, 0);
    background(100);
    // trees
    for (let i=0; i < 4; i++) {
        tree_random = [50, 100, 0, -50];
        image(trees, trees_x + (i * 512 - tree_random[i]), 200);
    }
    // leaves
    for (let i=0; i < 4; i++) {
        noStroke();
        fill(9, 10, 19);
        rect(0, 0, 800, 200);
        image(front_leaves, front_leaves_x + (i * 500) - 20, 200);
    }
    // bushes
    for (let i=0; i < 7; i++) {
        image(bushes, bushes_x + (i * 512), 200);
    }
    level1bg.resize(4268, 600);
    image(level1bg, bg_x, 0);
    p.display();
    p.moveinlevel();
    
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
        this.findPlayerBounds_level();
        this.locked = false;
        this.fake_x = x;
    }
    display(){
        fill(0,255,0);
        rect(this.x, this.y, this.size, this.size);
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
    findPlayerBounds_level(){
        this.fake_x = this.x + (bg_x * -1);
        this.left = this.fake_x - 3;
        this.right = this.fake_x + this.size + 3;
        this.up = this.y - 3;
        this.down = this.y + this.size + 3;
        this.middleX = this.fake_x + this.size/2;
        this.middleY = this.y + this.size/2;
    }
    death_detection(x, y) {
        let temp = blue(hitmap.get(x,y));
            if (temp == 0) {
            //console.log(temp);
            return true;
            }
            return false;
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
    moveinlevel() {

        this.findPlayerBounds_level();
        this.handleFallJumpMovement();
        this.handleDoorMovement();
        
        // movement right before reaching half the screen
        if ((gamestate == 2 || gamestate == 3) && bg_x <= 0 && (keyIsDown(68) || keyIsDown(39)) && scrolling == false) {
            if (!this.isPixelSolid(this.right, this.middleY)) {
                this.x += 3;
            }
        } // background movement to make the player look like theyre going left
        if ((gamestate == 2 || gamestate == 3) && this.x <= 400 && bg_x < 0 && (keyIsDown(65) || keyIsDown(37))) {
            if (!this.isPixelSolid(this.left, this.middleY)) {
                this.x = 400;
                scrolling = true;
                bg_x += 3;
                bushes_x += 2;
                front_leaves_x += 1;
                trees_x += 1;
            }
        } // movement left after finishing the background scroll
        if ((gamestate == 2 || gamestate == 3) && bg_x >= -3468 && (keyIsDown(65) || keyIsDown(37)) && scrolling == false) {
            if (!this.isPixelSolid(this.left, this.middleY)) {
                this.x -= 3;
            }
        } // background movement to make the player look like theyre going right
        if ((gamestate == 2 || gamestate == 3) && this.x >= 400 && bg_x > -3467 && (keyIsDown(68) || keyIsDown(39))) {
            if (!this.isPixelSolid(this.right, this.middleY)) {
                this.x = 400;
                scrolling = true;
                bg_x -= 3;
                bushes_x -= 2;
                trees_x -= 1;
                front_leaves_x -= 1;
            }
        } // stop background scroll in the beginning and make the player move left
        if ((gamestate == 2 || gamestate == 3) && bg_x >= 0 && (keyIsDown(65) || keyIsDown(37)) && scrolling == true) {
            if (!this.isPixelSolid(this.left, this.middleY)) {
                bg_x = 0;
                this.x -= 3;
                bushes_x = 0;
                front_leaves_x = 0;
                trees_x = 0;
                scrolling = false;
            }
        } // stop background scroll at the end and make the player move right
        if ((gamestate == 2 || gamestate == 3) && bg_x <= -3468 && (keyIsDown(68) || keyIsDown(39)) && scrolling == true) {
            if (!this.isPixelSolid(this.right, this.middleY)) {
                bg_x = -3468;
                bushes_x = -2312;
                trees_x = -1156;
                front_leaves_x = -1156;
                this.x += 3;
                scrolling = false;
            }
        }
        if (keyIsDown(32) && this.isPixelSolid(this.middleX, this.down)) {
          this.ySpeed = -10;
        }
        if (this.death_detection(this.fake_x, this.middleY)) {
            gamestate = 1;
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
            if (temp == 255) {
            //console.log(temp);
            return false;
            }
            return true;
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
