
class Sprite {
    constructor(animation,x,y,speed){
        this.x = x;
        this.y = y;
        this.action = action;
        this.animation = animation;
        //this.w = this.animation[0].width;
        //this.len = this.animation.length;
        this.speed = speed;
        this.index = 0;
    }

    display(){
        let index = floor(this.index) % this.len;
        image(this.animation[index],this.x,this.y);

        /*
        if (this.action == 'idle'){
            image(animation[0],this.x,this.y);
        }
        */
    }

    animate(){
        this.index = this.index + this.speed;
    }
}