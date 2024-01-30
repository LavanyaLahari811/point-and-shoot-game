const canvas = document.querySelector("#canvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const collisionCanvas = document.querySelector("#collisionCanvas");
const collisionCtx = collisionCanvas.getContext("2d");
collisionCanvas.width = window.innerWidth;
collisionCanvas.height = window.innerHeight;

let timeToNextRaven = 0;
let lastTime = 0;
let ravenInterval = 500;
let score = 0;
let gameOver=false;

ctx.font = "50px Impact";

let ravens = [];

class Raven {
  constructor() {
    this.speedX = Math.random() * 5 + 3;
    this.speedY = Math.random() * 5 - 2.5;
    this.markedForDelection = false;
    this.image = new Image();
    this.image.src = "./raven.png";
    this.spriteWidth = 271;
    this.spriteHeight = 194;
    this.sizeModifier = Math.random() * 0.6 + 0.4;
    this.width = this.spriteWidth * this.sizeModifier;
    this.height = this.spriteHeight * this.sizeModifier;
    this.x = canvas.width;
    this.y = Math.random() * (canvas.height - this.height);
    this.frame = 0;
    this.maxFrame = 4;
    this.flapTime = 0;
    this.flapInterval = Math.random() * 50 + 50;
    this.randomColors = [
      Math.floor(Math.random() * 255),
      Math.floor(Math.random() * 255),
      Math.floor(Math.random() * 255),
    ];
    this.color =
      "rgb(" +
      this.randomColors[0] +
      "," +
      this.randomColors[1] +
      "," +
      this.randomColors[2] +
      ")";
  }
  update(deltaTime) {
    if (this.y < 0 || this.y > canvas.height - this.height) {
      this.speedY = this.speedY * -1;
    }
    this.x -= this.speedX;
    this.y += this.speedY;
    if (this.x < -this.width) {
      this.markedForDelection = true;
    }
    this.flapTime += deltaTime;
    if (this.flapTime > this.flapInterval) {
      this.flapTime = 0;
      if (this.frame > this.maxFrame) {
        this.frame = 0;
      } else {
        this.frame++;
      }
    }
    if(this.x<-this.width){
        gameOver=true;
    }
  }
  draw() {
    collisionCtx.fillStyle = this.color;
    collisionCtx.fillRect(this.x, this.y, this.width, this.height);
    ctx.drawImage(
      this.image,
      this.frame * this.spriteWidth,
      0,
      this.spriteWidth,
      this.spriteHeight,
      this.x,
      this.y,
      this.width,
      this.height
    );
  }
}

let explosions = [];
class Explosion {
  constructor(x, y, size) {
    this.image = new Image();
    this.image.src = "./boom.png";
    this.spriteWidth = 200;
    this.spriteHeight = 179;
    this.size=size;
    this.x = x;
    this.y = y;
    this.frame = 0;
    this.sound = new Audio();
    this.sound.src = "./boom.wav";
    this.timeSinceLastFrame = 0;
    this.frameInterval = 100;
    this.markedForDelection=false;
  }
  update(deltaTime) {
    this.timeSinceLastFrame += deltaTime;
    if (this.frame == 0) {
      this.sound.play();
    }
    if (this.timeSinceLastFrame > this.frameInterval) {
      this.frame++;
      if(this.frame>5){
        this.markedForDelection=true;
      }
      this.timeSinceLastFrame=0;
    }
  }
  draw(){
    ctx.drawImage(this.image,this.frame*this.spriteWidth,0,this.spriteWidth,this.spriteHeight,this.x,this.y-this.size*0.25,this.size,this.size);
  }
}

const drawScore = () => {
  ctx.fillStyle = "black";
  ctx.fillText("Score:" + score, 50, 75);
  ctx.fillStyle = "white";
  ctx.fillText("Score:" + score, 55, 80);
};

const drawGameOver=()=>{
    ctx.textAlign="center";
    ctx.fillStyle="black";
    ctx.fillText("GAME OVER,your score is"+score,canvas.width*0.5,canvas.height*0.5);
    ctx.fillStyle="white";
    ctx.fillText("GAME OVER,your score is"+score,canvas.width*0.5+5,canvas.height*0.5+5);
}

window.addEventListener("click", (event) => {
  const detectPixelColor = collisionCtx.getImageData(event.x, event.y, 1, 1);
  const clr = detectPixelColor.data;
  ravens.forEach((obj) => {
    if (
      obj.randomColors[0] == clr[0] &&
      obj.randomColors[1] == clr[1] &&
      obj.randomColors[2] == clr[2]
    ) {
      obj.markedForDelection = true;
      score++;
      explosions.push(new Explosion(obj.x,obj.y,obj.width));
      console.log(explosions);
    }
  });
});

const animate = (timeStamp) => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  collisionCtx.clearRect(0, 0, canvas.width, canvas.height);
  let deltaTime = timeStamp - lastTime;
  lastTime = timeStamp;
  timeToNextRaven += deltaTime;
  if (timeToNextRaven > ravenInterval) {
    ravens.push(new Raven());
    timeToNextRaven = 0;
    ravens.sort((a, b) => {
      return a.width - b.width;
    });
  }
  drawScore();
  [...ravens,...explosions].forEach((obj) => {
    obj.draw();
  });
  [...ravens,...explosions].forEach((obj) => {
    obj.update(deltaTime);
  });
  ravens = ravens.filter((obj) => !obj.markedForDelection);
  explosions=explosions.filter((obj)=>!obj.markedForDelection);
  if(!gameOver){
    requestAnimationFrame(animate);
  }
  else{
    drawGameOver();
  }
  
};
animate(0);
