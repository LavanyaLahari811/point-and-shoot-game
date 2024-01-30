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
    this.randomColors=[Math.floor(Math.random()*255),Math.floor(Math.random()*255),Math.floor(Math.random()*255)];
    this.color="rgb("+this.randomColors[0]+","+this.randomColors[1]+","+this.randomColors[2]+")"
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
  }
  draw() {
    collisionCtx.fillStyle=this.color;
    collisionCtx.fillRect(this.x,this.y,this.width,this.height);
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

const drawScore = () => {
  ctx.fillStyle = "black";
  ctx.fillText("Score:" + score, 50, 75);
  ctx.fillStyle = "white";
  ctx.fillText("Score:" + score, 55, 80);
};

window.addEventListener("click",(event)=>{
   const detectPixelColor=collisionCtx.getImageData(event.x,event.y,1,1);
   const clr=detectPixelColor.data;
   ravens.forEach(obj=>{
    if(obj.randomColors[0]==clr[0] && obj.randomColors[1]==clr[1] && obj.randomColors[2]==clr[2]){
        obj.markedForDelection=true;
        score++;
    }
   })
})

const animate = (timeStamp) => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  collisionCtx.clearRect(0, 0, canvas.width, canvas.height);
  let deltaTime = timeStamp - lastTime;
  lastTime = timeStamp;
  timeToNextRaven += deltaTime;
  if (timeToNextRaven > ravenInterval) {
    ravens.push(new Raven());
    timeToNextRaven = 0;
    ravens.sort((a,b)=>{
        return a.width-b.width;
    })
  }
  drawScore();
  [...ravens].forEach((obj) => {
    obj.draw();
  });
  [...ravens].forEach((obj) => {
    obj.update(deltaTime);
  });
  ravens = ravens.filter((obj) => !obj.markedForDelection);
  requestAnimationFrame(animate);
};
animate(0);
