const canvas = document.getElementById('gameCanvas');
const context = canvas.getContext('2d');

function setupCanvas() {
    canvas.width = window.innerWidth - 120;
    canvas.height = window.innerHeight;
}
window.addEventListener('resize', setupCanvas);
setupCanvas();

const map = { width: 2000, height: 2000 };

const player = {
    x: 100,
    y: 100,
    width: 50,
    height: 50,
    color: 'red',
    speed: 5,
    lives: 3
};

const enemy = {
    x: 1100,
    y: 300,
    width: 30,
    height: 30,
    color: 'purple',
    speed: 2,
    visionRange: 300,
    patrolPoints: [
        { x: 1100, y: 300 },
        { x: 1100, y: 550 },
        { x: 1300, y: 550 },
        { x: 1300, y: 250 },
        { x: 1500, y: 250 },
        { x: 1500, y: 650 },
        { x: 350, y: 650 },
        { x: 350, y: 1650 },
        { x: 350, y: 650 },
        { x: 1500, y: 650 },
        { x: 1500, y: 250 },
        { x: 1300, y: 250 },
        { x: 1300, y: 550 },
        { x: 1100, y: 550 },
    ],
    currentPatrolIndex: 0,
    chasing: false
};

const boss = {
    x: 1100,
    y: 1800,
    width: 100,
    height: 100,
    color: 'black',
    hp: 500,
    attackCooldown: 0,
    specialAttackCooldown: 0,
    attackRange: 250
};

const camera = { x: 0, y: 0 };

let moveLeft = false;
let moveRight = false;
let moveUp = false;
let moveDown = false;
let grabbing = false;
let hasKey = false;
let hasMasterKey = false;
let hasSword = false;
let startTime;
let endTime;

function startTimer() {
    startTime = new Date().getTime();
}

function stopTimer() {
    endTime = new Date().getTime();
    const timeTaken = (endTime - startTime) / 1000;
    localStorage.setItem('endTime', timeTaken);
    window.location.href = 'leaderboard.html';
}
startTimer();
const platforms = [
    { x: 0, y: 250, width: 270, height: 20, color: 'green' },
    { x: 250, y: 0, width: 20, height: 200, color: 'green' },
    { x: 0, y: 0, width: 20, height: 270, color: 'green' },
    { x: 0, y: 0, width: 250, height: 20, color: 'green' },
    { x: 250, y: 180, width: 1350, height: 20, color: 'green' },
    { x: 1600, y: 0, width: 400, height: 20, color: 'green' },
    { x: 1980, y: 0, width: 20, height: 1000, color: 'green' },
    { x: 1600, y: 0, width: 20, height: 400, color: 'green' },
    { x: 520, y: 200, width: 20, height: 200, color: 'green' },
    { x: 520, y: 380, width: 200, height: 20, color: 'green' },
    { x: 700, y: 250, width: 20, height: 150, color: 'green' },
    { x: 800, y: 250, width: 20, height: 320, color: 'green' },
    { x: 250, y: 570, width: 670, height: 20, color: 'green' },
    { x: 900, y: 400, width: 20, height: 180, color: 'green' },
    { x: 250, y: 250, width: 20, height: 1090, color: 'green'},
    { x: 1700, y: 200, width: 20, height: 400, color: 'green' },
    { x: 1700, y: 600, width: 220, height: 20, color: 'green' },
    { x: 1900, y: 200, width: 20, height: 400, color: 'green' },
    { x: 400, y: 700, width: 20, height: 920, color: 'green' },
    { x: 0, y: 1100, width: 20, height: 300, color: 'green' },
    { x: 0, y: 1100, width: 270, height: 20, color: 'green' },
    { x: 0, y: 1400, width: 300, height: 20, color: 'green' },
    { x: 300, y: 1400, width: 20, height: 20, color: 'green' },
    { x: 1000, y: 200, width: 20, height: 400, color: 'green' },
    { x: 300, y: 1700, width: 600, height: 20, color: 'green' },
    { x: 1000, y: 600, width: 400, height: 20, color: 'green' },
    { x: 400, y: 700, width: 1600, height: 20, color: 'green' },
    { x: 1200, y: 200, width: 20, height: 350, color: 'green' },
    { x: 1400, y: 300, width: 20, height: 320, color: 'green' },
    { x: 900, y: 1600, width: 20, height: 380, color: 'green' },
    { x: 1400, y: 1600, width: 20, height: 500, color: 'green' },
    { x: 1400, y: 1840, width: 20, height: 180, color: 'green' },
    { x: 900, y: 1980, width: 520, height: 20, color: 'green' },
    { x: 900, y: 1600, width: 220, height: 20, color: 'green' },
    { x: 1220, y: 1600, width: 200, height: 20, color: 'green' },
    { x: 1600, y: 1000, width: 400, height: 20, color: 'green' },
    { x: 800, y: 800, width: 820, height: 20, color: 'green' },
    { x: 1600, y: 600, width: 20, height: 220, color: 'green' },
    { x: 900, y: 900, width: 700, height: 20, color: 'green' },
    { x: 1600, y: 900, width: 20, height: 820, color: 'green' },
    { x: 400, y: 1500, width: 1120, height: 20, color: 'green' },
    { x: 300, y: 1400, width: 20, height: 300, color: 'green' },
    { x: 600, y: 700, width: 20, height: 420, color: 'green' },
    { x: 800, y: 700, width: 20, height: 120, color: 'green' },
    { x: 600, y: 1100, width: 920, height: 20, color: 'green' },
    { x: 1500, y: 1100, width: 20, height: 400, color: 'green' },
    { x: 1400, y: 1700, width: 220, height: 20, color: 'green' },
];

const objects = [
    { x: 110, y: 180, width: 30, height: 30, color: 'yellow', type: 'key' },
    { x: 700, y: 900, width: 30, height: 30, color: 'yellow', type: 'key' },
    { x: 250, y: 200, width: 20, height: 50, color: 'brown', type: 'door' },
    { x: 1100, y: 1600, width: 120, height: 20, color: 'brown', type: 'door' },
    { x: 1960, y: 800, width: 20, height: 80, color: 'purple', type: 'masterDoor' },
    { x: 1100, y: 1800, width: 30, height: 30, color: 'orange', type: 'masterKey' },
    { x: 20, y: 1300, width: 30, height: 30, color: '#7AE1FF', type: 'sword' } // Espada
];

const boxes = [
    { x: 20, y: 1300, width: 50, height: 50, color: 'blue', grabRange: 20 }
];

const projectiles = [];

function drawEntity(entity) {
    context.fillStyle = entity.color;
    context.fillRect(entity.x - camera.x, entity.y - camera.y, entity.width, entity.height);
}

function drawPlayer() {
    context.fillStyle = player.color;
    context.fillRect(player.x - camera.x, player.y - camera.y, player.width, player.height);
}

function drawEnemy() {
    drawEntity(enemy);
}

function drawBoss() {
    context.fillStyle = boss.color;
    context.fillRect(boss.x - camera.x, boss.y - camera.y, boss.width, boss.height);
}

function drawPlatforms() {
    platforms.forEach(platform => {
        context.fillStyle = platform.color;
        context.fillRect(platform.x - camera.x, platform.y - camera.y, platform.width, platform.height);
    });
}
function drawProjectiles() {
    projectiles.forEach(projectile => {
        context.fillStyle = projectile.color;
        context.fillRect(projectile.x - camera.x, projectile.y - camera.y, projectile.width, projectile.height);
    });
}

function attackWithSword() {
    if (hasSword && isNear(player, boss, 100)) {
        boss.hp -= 100;
        if (boss.hp <= 0) {
            boss.hp = 0;
            boss.x = -9999;
            boss.y = -9999;
            boss.attackCooldown = Infinity;
            boss.specialAttackCooldown = Infinity;
            document.getElementById('bossHpBar').style.display = 'none';
        }
    }
}

function drawLives() {
    const livesContainer = document.getElementById('playerLives');
    livesContainer.innerHTML = '';
    for (let i = 0; i < player.lives; i++) {
        const life = document.createElement('div');
        life.classList.add('life');
        livesContainer.appendChild(life);
    }
}

function drawObjects() {
    objects.forEach(object => {
        if (object.type !== 'door' || (object.type === 'door' && !object.opened)) {
            drawEntity(object);
        }
    });
}

function drawBoxes() {
    boxes.forEach(box => {
        drawEntity(box);
    });
}

function update() {
    const prevX = player.x;
    const prevY = player.y;

    if (moveLeft) player.x -= player.speed;
    if (moveRight) player.x += player.speed;
    if (moveUp) player.y -= player.speed;
    if (moveDown) player.y += player.speed;

    player.x = Math.max(0, Math.min(map.width - player.width, player.x));
    player.y = Math.max(0, Math.min(map.height - player.height, player.y));

    platforms.forEach(platform => {
        if (checkCollision(player, platform)) {
            player.x = prevX;
            player.y = prevY;
        }
    });

    objects.forEach(object => {
        if ((object.type === 'door' || object.type === 'masterDoor') && checkCollision(player, object)) {
            if ((object.type === 'door' && !hasKey) || (object.type === 'masterDoor' && !hasMasterKey)) {
                player.x = prevX;
                player.y = prevY;
            }
        }
    });

    if (grabbing) {
        boxes.forEach(box => {
            const prevBoxX = box.x;
            const prevBoxY = box.y;

            if (isNear(player, box)) {
                if (moveLeft) box.x = Math.max(0, box.x - player.speed);
                if (moveRight) box.x = Math.min(map.width - box.width, box.x + player.speed);
                if (moveUp) box.y = Math.max(0, box.y - player.speed);
                if (moveDown) box.y = Math.min(map.height - box.height, box.y + player.speed);

                platforms.forEach(platform => {
                    if (checkCollision(box, platform)) {
                        box.x = prevBoxX;
                        box.y = prevBoxY;
                    }
                });

                boxes.forEach(otherBox => {
                    if (box !== otherBox && checkCollision(box, otherBox)) {
                        box.x = prevBoxX;
                        box.y = prevBoxY;
                    }
                });

                if (checkCollision(box, player)) {
                    box.x = prevBoxX;
                    box.y = prevBoxY;
                }
            }
        });
    }

    boxes.forEach(box => {
        if (checkCollision(player, box)) {
            player.x = prevX;
            player.y = prevY;
        }
    });

    updateEnemy();
    checkObjectCollisions();
    updateCamera();
    updateBoss();
    updateProjectiles();

    // Mostrar mensaje si el jugador está cerca de la masterDoor
const masterDoor = objects.find(o => o.type === 'masterDoor');
const nearMasterDoor = masterDoor && isNear(player, masterDoor);

const warningMessage = document.getElementById('warningMessage');
warningMessage.style.display = nearMasterDoor ? 'block' : 'none';

    const box = boxes.find(b => isNear(player, b));
    const warningMessage2 = document.getElementById('warningMessage2');
    warningMessage2.style.display = box ? 'block' : 'none';
}
function checkCollision(rect1, rect2) {
    return (
        rect1.x < rect2.x + rect2.width &&
        rect1.x + rect1.width > rect2.x &&
        rect1.y < rect2.y + rect2.height &&
        rect1.y + rect1.height > rect2.y
    );
}

function checkObjectCollisions() {
    objects.forEach(object => {
        if (checkCollision(player, object)) {
            if (object.type === 'key') {
                hasKey = true;
                document.getElementById('inventoryKey').style.opacity = 1;
                objects.splice(objects.indexOf(object), 1);
            } else if (object.type === 'masterKey') {
                hasMasterKey = true;
                document.getElementById('inventoryMasterKey').style.opacity = 1;
                objects.splice(objects.indexOf(object), 1);
            } else if (object.type === 'door' && hasKey) {
                object.opened = true;
                hasKey = false;
                document.getElementById('inventoryKey').style.opacity = 0;
                objects.splice(objects.indexOf(object), 1);
            } else if (object.type === 'masterDoor' && hasMasterKey) {
                stopTimer();
            } else if (object.type === 'sword') {
                hasSword = true;
                document.getElementById('attackButton').style.display = 'block';
                objects.splice(objects.indexOf(object), 1);
            }
        }
    });
}

function updateEnemy() {
    const prevX = enemy.x;
    const prevY = enemy.y;
    const distX = player.x - enemy.x;
    const distY = player.y - enemy.y;
    const distance = Math.sqrt(distX * distX + distY * distY);

    if (distance < enemy.visionRange && canSeePlayer()) {
        enemy.chasing = true;
    } else {
        enemy.chasing = false;
    }

    if (enemy.chasing) {
        moveTowardsPlayer();
    } else {
        patrol();
    }

    boxes.forEach(box => {
        if (checkCollision(enemy, box)) {
            enemy.x = prevX;
            enemy.y = prevY;
        }
    });

    if (checkCollision(enemy, player)) {
        resetGame();
    }
}

function canSeePlayer() {
    for (let i = 0; i < platforms.length; i++) {
        if (lineIntersects(player, enemy, platforms[i])) {
            return false;
        }
    }
    return true;
}

function lineIntersects(player, enemy, platform) {
    const left = platform.x;
    const right = platform.x + platform.width;
    const top = platform.y;
    const bottom = platform.y + platform.height;

    const x1 = enemy.x + enemy.width / 2;
    const y1 = enemy.y + enemy.height / 2;
    const x2 = player.x + player.width / 2;
    const y2 = player.y + player.height / 2;

    if ((x1 < left && x2 < left) || (x1 > right && x2 > right) || (y1 < top && y2 < top) || (y1 > bottom && y2 > bottom)) {
        return false;
    }

    const m = (y2 - y1) / (x2 - x1);
    const yIntercept = y1 - m * x1;

    const intersectionY1 = m * left + yIntercept;
    const intersectionY2 = m * right + yIntercept;
    const intersectionX1 = (top - yIntercept) / m;
    const intersectionX2 = (bottom - yIntercept) / m;

    return (intersectionY1 > top && intersectionY1 < bottom) || (intersectionY2 > top && intersectionY2 < bottom) ||
           (intersectionX1 > left && intersectionX1 < right) || (intersectionX2 > left && intersectionX2 < right);
}

function moveTowardsPlayer() {
    const angle = Math.atan2(player.y - enemy.y, player.x - enemy.x);
    enemy.x += Math.cos(angle) * enemy.speed;
    enemy.y += Math.sin(angle) * enemy.speed;
}

function patrol() {
    const target = enemy.patrolPoints[enemy.currentPatrolIndex];
    const angle = Math.atan2(target.y - enemy.y, target.x - enemy.x);
    enemy.x += Math.cos(angle) * enemy.speed;
    enemy.y += Math.sin(angle) * enemy.speed;

    if (Math.abs(enemy.x - target.x) < 5 && Math.abs(enemy.y - target.y) < 5) {
        enemy.currentPatrolIndex = (enemy.currentPatrolIndex + 1) % enemy.patrolPoints.length;
    }
}
function updateBoss() {
    const bossHpBar = document.getElementById('bossHpBar');
    const bossHpBarInner = document.getElementById('bossHpBarInner');

    const distX = player.x - boss.x;
    const distY = player.y - boss.y;
    const distance = Math.sqrt(distX * distX + distY * distY);

    let playerInSight = true;

    platforms.forEach(platform => {
        const intersectX = player.x > platform.x && player.x < platform.x + platform.width;
        const intersectY = player.y > platform.y && player.y < platform.y + platform.height;
        if (intersectX && intersectY) {
            playerInSight = false;
        }
    });

    if (distance <= boss.attackRange && playerInSight) {
        bossHpBar.style.display = 'block';
        bossHpBarInner.style.width = (boss.hp / 500) * 100 + '%';

        if (boss.attackCooldown <= 0) {
            performBossAttack();
            boss.attackCooldown = 2000;
        } else {
            boss.attackCooldown -= 16;
        }

        if (boss.hp <= 2500 && boss.specialAttackCooldown <= 0) {
            performSpecialAttack();
            boss.specialAttackCooldown = 5000;
        } else if (boss.hp <= 2500) {
            boss.specialAttackCooldown -= 16;
        }

    } else {
        bossHpBar.style.display = 'none';
    }
}

function performBossAttack() {
    const angle = Math.atan2(player.y - boss.y, player.x - boss.x);
    projectiles.push({
        x: boss.x + boss.width / 2,
        y: boss.y + boss.height / 2,
        width: 10,
        height: 10,
        color: 'purple',
        speedX: Math.cos(angle) * 7,
        speedY: Math.sin(angle) * 7
    });

    for (let i = -1; i <= 1; i++) {
        const spreadAngle = angle + i * 0.5;
        projectiles.push({
            x: boss.x + boss.width / 2,
            y: boss.y + boss.height / 2,
            width: 10,
            height: 10,
            color: 'orange',
            speedX: Math.cos(spreadAngle) * 5,
            speedY: Math.sin(spreadAngle) * 5
        });
    }
}

function performSpecialAttack() {
    const AoE = {
        x: player.x - 50,
        y: player.y - 50,
        width: 100,
        height: 100,
        color: 'blue',
        duration: 1000
    };
    projectiles.push(AoE);

    setTimeout(() => {
        const index = projectiles.indexOf(AoE);
        if (index > -1) {
            projectiles.splice(index, 1);
        }
    }, AoE.duration);
}

function updateProjectiles() {
    projectiles.forEach((projectile, index) => {
        projectile.x += projectile.speedX || 0;
        projectile.y += projectile.speedY || 0;

        if (projectile.x < player.x + player.width &&
            projectile.x + projectile.width > player.x &&
            projectile.y < player.y + player.height &&
            projectile.y + projectile.height > player.y) {
            projectiles.splice(index, 1);
            player.lives -= 1;
            drawLives();

            if (player.lives <= 0) {
                resetGame();
            }
        }

        if (projectile.x < 0 || projectile.x > map.width || projectile.y < 0 || projectile.y > map.height) {
            projectiles.splice(index, 1);
        }
    });
}

function resetGame() {
    player.x = 100;
    player.y = 100;
    player.lives = 3;
    enemy.awake = false;
    boss.hp = 500;
    projectiles.length = 0;
    drawLives();

    boxes.forEach(box => {
        box.x = 20;
        box.y = 1300;
    });

    if (hasKey) {
        hasKey = false;
        document.getElementById('inventoryKey').style.opacity = 0;
        objects.push({ x: 700, y: 900, width: 30, height: 30, color: 'yellow', type: 'key' },
                     { x: 110, y: 180, width: 30, height: 30, color: 'yellow', type: 'key' });
    }

    if (hasMasterKey) {
        hasMasterKey = false;
        document.getElementById('inventoryMasterKey').style.opacity = 0;
        objects.push({ x: 20, y: 1300, width: 30, height: 30, color: 'orange', type: 'masterKey' });
        objects.push({ x: 1900, y: 800, width: 20, height: 80, color: 'purple', type: 'masterDoor' });
    }
}

function clearCanvas() {
    context.clearRect(0, 0, canvas.width, canvas.height);
}

function updateCamera() {
    camera.x = player.x - canvas.width / 2 + player.width / 2;
    camera.y = player.y - canvas.height / 2 + player.height / 2;
    camera.x = Math.max(0, Math.min(map.width - canvas.width, camera.x));
    camera.y = Math.max(0, Math.min(map.height - canvas.height, camera.y));
}

function isNear(a, b) {
    return Math.abs(a.x - b.x) < b.grabRange && Math.abs(a.y - b.y) < b.grabRange;
}

function isNear(rect1, box) {
    const grabRange = box.grabRange;
    const extendedBox = {
        x: box.x - grabRange,
        y: box.y - grabRange,
        width: box.width + grabRange * 2,
        height: box.height + grabRange * 2
    };
    return checkCollision(rect1, extendedBox);
}
function isNear(entity1, entity2, range = 150) {
    const dx = entity1.x + entity1.width / 2 - (entity2.x + entity2.width / 2);
    const dy = entity1.y + entity1.height / 2 - (entity2.y + entity2.height / 2);
    const distance = Math.sqrt(dx * dx + dy * dy);
    return distance < range;
}

function gameLoop() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    drawPlatforms();
    drawObjects();
    drawBoxes();
    drawPlayer();
    drawEnemy();
    drawBoss();
    drawProjectiles();
    update();
    requestAnimationFrame(gameLoop);
}
gameLoop();

document.getElementById('upButton').addEventListener('touchstart', () => moveUp = true);
document.getElementById('upButton').addEventListener('touchend', () => moveUp = false);
document.getElementById('downButton').addEventListener('touchstart', () => moveDown = true);
document.getElementById('downButton').addEventListener('touchend', () => moveDown = false);
document.getElementById('leftButton').addEventListener('touchstart', () => moveLeft = true);
document.getElementById('leftButton').addEventListener('touchend', () => moveLeft = false);
document.getElementById('rightButton').addEventListener('touchstart', () => moveRight = true);
document.getElementById('rightButton').addEventListener('touchend', () => moveRight = false);
document.getElementById('grabButton').addEventListener('touchstart', () => grabbing = true);
document.getElementById('grabButton').addEventListener('touchend', () => grabbing = false);
document.getElementById('attackButton').addEventListener('touchstart', () => {
    attackWithSword();
});
