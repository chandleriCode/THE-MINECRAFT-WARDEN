const character = document.getElementById('character');
let positionX = 50;
let positionY = 0;
let speed = 4; // Smaller for smoother movement

let gameOver = false;
let animationFrameId;
let enemyIntervalId;

const areaHeight = 700;
const areaWidth = 1200;
const charWidth = 100;
const charHeight = 200;

const enemy = document.getElementById('enemy');
let enemyX = 1000;
let enemyY = 0;
enemy.style.position = 'absolute';
enemy.style.left = enemyX + 'px';
enemy.style.bottom = enemyY + 'px';
const enemySpeed = 2;

const chest = document.getElementById('chest');
const chestX = 600;
const chestY = 0;
const chestWidth = 80;
const chestHeight = 80;

const keys = {};

// Track which keys are held down
document.addEventListener('keydown', (e) => {
  keys[e.key.toLowerCase()] = true;
});

document.addEventListener('keyup', (e) => {
  keys[e.key.toLowerCase()] = false;
});

// Smooth movement loop
function gameLoop() {
  if (gameOver) return;

  if (keys['arrowright']) positionX += speed;
  if (keys['arrowleft']) positionX -= speed;
  if (keys['arrowup']) positionY += speed;
  if (keys['arrowdown']) positionY -= speed;

  positionX = Math.max(0, Math.min(positionX, areaWidth - charWidth));
  positionY = Math.max(0, Math.min(positionY, areaHeight - charHeight));

  character.style.left = positionX + 'px';
  character.style.bottom = positionY + 'px';

  if (keys['e']) checkChestInteraction();

  animationFrameId = requestAnimationFrame(gameLoop);
}
animationFrameId = requestAnimationFrame(gameLoop);

// Enemy follows player
enemyIntervalId = setInterval(() => {
  if (!gameOver) moveEnemyTowardCharacter();
}, 30);

function moveEnemyTowardCharacter() {
  const dx = positionX - enemyX;
  const dy = positionY - enemyY;
  const distance = Math.sqrt(dx * dx + dy * dy);

  if (distance > 1) {
    const moveX = (dx / distance) * enemySpeed;
    const moveY = (dy / distance) * enemySpeed;
    enemyX += moveX;
    enemyY += moveY;

    enemy.style.left = enemyX + 'px';
    enemy.style.bottom = enemyY + 'px';
  }

  // Check for collision with player
  const touchingPlayer =
    enemyX < positionX + charWidth &&
    enemyX + charWidth > positionX &&
    enemyY < positionY + charHeight &&
    enemyY + charHeight > positionY;

  if (touchingPlayer) {
    handleDeath();
  }
}

function endGame() {
  gameOver = true;
  cancelAnimationFrame(animationFrameId);
  clearInterval(enemyIntervalId);
}

function handleDeath() {
  if (gameOver) return;

  // Replace Steve's image
  character.src = 'media/skeletonDying.gif'; // Replace with your path

  // Show "You died" message
  const deathMessage = document.getElementById('death-message');
  deathMessage.style.display = 'block';

  endGame();
}

function checkChestInteraction() {
  const touching =
    positionX < chestX + chestWidth &&
    positionX + charWidth > chestX &&
    positionY < chestY + chestHeight &&
    positionY + charHeight > chestY;

  if (touching) {
    // Replace chest image
    chest.src = 'media/openChest.png'; // Replace with your path

    // Change Warden texture
    enemy.src = 'media/explosion.gif'; // Replace with your new texture path

    // Show "You win" text
    const message = document.getElementById('message');
    message.style.display = 'block';

    // Prevent repeated triggers
    checkChestInteraction = () => {};

    endGame();
  }
}
