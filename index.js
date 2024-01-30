const canvas = document.querySelector("#canvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

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
   const detectPixelColor=ctx.getImageData(event.x,event.y,1,1);
   console.log(detectPixelColor);
})

const animate = (timeStamp) => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  let deltaTime = timeStamp - lastTime;
  lastTime = timeStamp;
  timeToNextRaven += deltaTime;
  if (timeToNextRaven > ravenInterval) {
    ravens.push(new Raven());
    timeToNextRaven = 0;
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
