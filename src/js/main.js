//setInterval -> clearInterval // setTimeout.
//-- CONSTENTES

//-- DATA
const canvas = document.getElementById('gameScreen');
const ctx = canvas.getContext('2d');
const lifeCount = document.getElementById('life');
let frameCount = 0;
let lastTime = performance.now();

//-- PLAYER
let player = {
  x: 200,
  y: 200,
  size: 20,
  hitbox: 10,
  speed: 180,
  hp: 20,
  maxhp: 20,
  iFrame: false,
  color: "red",
};
const gap = (player.size - player.hitbox) / 2;

//-- BULLETS
const bullets = [];
function createBullet(startX, startY, speedX, speedY, size, color) {
  const newBullet = {
    x: startX,
    y: startY,
    sX: speedX,
    sY: speedY,
    size: size,
    color: color,
  };
  bullets.push(newBullet);
}

//-- MOVES
const touches = {
  ArrowUp: false,
  ArrowDown: false,
  ArrowLeft: false,
  ArrowRight: false,
}
window.addEventListener('keydown', (evenement) => {
  if (evenement.code === 'ArrowUp') touches.ArrowUp = true;
  if (evenement.code === 'ArrowDown') touches.ArrowDown = true;
  if (evenement.code === 'ArrowLeft') touches.ArrowLeft = true;
  if (evenement.code === 'ArrowRight') touches.ArrowRight = true;
});
window.addEventListener('keyup', (evenement) => {
  if (evenement.code === 'ArrowUp') touches.ArrowUp = false;
  if (evenement.code === 'ArrowDown') touches.ArrowDown = false;
  if (evenement.code === 'ArrowLeft') touches.ArrowLeft = false;
  if (evenement.code === 'ArrowRight') touches.ArrowRight = false;
});

//-- GAME
function iFrameColorSwap() {
  if (player.color === "red") {
    player.color = "black";
    console.log(player.color);
  } else {
    player.color = "red";
  }
}
function movePlayer(dt){
  if (touches.ArrowUp) {
  player.y -= player.speed * dt;
  }
  if (touches.ArrowDown) {
    player.y += player.speed * dt;
  }
  if (touches.ArrowLeft) {
    player.x -= player.speed * dt;
  }
  if (touches.ArrowRight) {
    player.x += player.speed * dt;
  }
}
function drawPlayer(){
  if (player.iFrame) {
    if (frameCount % 8 === 0) {
      iFrameColorSwap();
    }
  } else {
    player.color = "red";
  }
  ctx.fillStyle = player.color;
  ctx.fillRect(player.x, player.y, player.size, player.size); // x,y,width,height
  lifeCount.textContent = player.hp + "/" + player.maxhp;
}
function manageBullet(dt){
  for (let i = 0; i < bullets.length; i++) {
    let b = bullets[i];
    b.x += b.sX * dt;
    b.y += b.sY * dt;
    ctx.fillStyle = b.color;
    ctx.fillRect(b.x, b.y, b.size, b.size);
    const playerLeft = player.x + gap;
    const playerRight = player.x + gap + player.hitbox;
    const playerUp = player.y + gap;
    const playerDown = player.y + gap + player.hitbox;
    if (
      playerLeft < b.x + b.size &&
      playerRight > b.x &&
      playerUp < b.y + b.size &&
      playerDown > b.y &&
      !player.iFrame
    ) {
      player.hp -= 1;
      player.iFrame = true;
      console.log("touché");
      setTimeout(() => {
        player.iFrame = false;
      }, 1000);
    }
    if (b.x > canvas.width || b.x < 0 || b.y > canvas.height || b.y < 0) {
      bullets.splice(i, 1);
      i--;
    }
  }
}
//-- LOOP
function gameLoop() {
  frameCount++;
  const currentTime = performance.now();
  const dt = (currentTime - lastTime) /1000;
  lastTime = currentTime;

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  movePlayer(dt);
  drawPlayer();
  manageBullet(dt);
  //callback
  requestAnimationFrame(gameLoop);
}

//-- BULLET_GEN
const bulletGen = setInterval(() => {
  createBullet(200, 0, 0, 120, 15, "white");
  createBullet(0, 200, 120, 0, 15, "pink");
}, 1500);

gameLoop();
