/*
@title: Top-Down Monsters
@author: Aditi Ranjan
*/

const player = "p";
const wall = "w";
const enemy = "e";
const bullet = "b";
const goal = "g";

setLegend(
  [player, bitmap`
................
................
......00000.....
......88888.....
.....0000000....
......0...0.00..
....0003.30.0...
....0.0...000...
...00.08880.....
.....00...0.....
.....0....0.....
.....02...0.....
.....000000.....
......0.0.......
.....CC.CC......
................`],
  [wall, bitmap`
0000000000000000
CC0CCCCCCC0CCCCC
CC0CCCCCCC0CCCCC
CC0CCCCCCC0CCCCC
CC0CCCCCCC0CCCCC
0000000000000000
CCCC0CCCCCCCC0CC
CCCC0CCCCCCCC0CC
CCCC0CCCCCCCC0CC
CCCC0CCCCCCCC0CC
CCCC0CCCCCCCC0CC
0000000000000000
CC0CCCCCCC0CCCCC
CC0CCCCCCC0CCCCC
CC0CCCCCCC0CCCCC
CC0CCCCCCC0CCCCC`],
  [enemy, bitmap`
................
................
................
................
........333.....
.......33333....
.......3C3C3....
.......33333....
......C3...3C...
.....C.33333.C..
.......33333....
.......33333....
......CCC.CCC...
................
................
................`],
  [bullet, bitmap`
................
................
................
................
.......3333.....
.......3333.....
.......3333.....
.......3333.....
.......3333.....
.......3333.....
.......3333.....
.......3333.....
................
................
................
................`],
  [goal, bitmap`
................
......00000.....
.....0060600....
....000000000...
....060606060...
....000000000...
....060606060...
....000000000...
....060606060...
....000000000...
....060606060...
....000000000...
.....0060600....
......00000.....
................`]
);

setSolids([player, wall]);

let level = 0;
const levels = [
  map`
pww..w..wwwe..ww
.w..w...........
...w...w....www.
.w..............
.w..w..e.www....
...ww......w....
ww.w.w..w....w..
.w......www.....
.w.e.w..w....e..
.........w......
..www...ww......
w.......w.ww.w..
w.w...w.w...ww.g`,
  map`
p....w...e......
....w...........
...w...w........
.w..............
.w..w.....w.....
....w......w....
.w...w..w....w..
.w..............
.....w..........
.........w......
..w.....w.......
w.........w..w..
..w...w.....w..g`
];

setMap(levels[level]);

const directions = ["left", "right", "up", "down"];

const moveEnemy = (enemy) => {
  let dir = directions[Math.floor(Math.random() * directions.length)];
  if (dir === "left") enemy.x -= 1;
  if (dir === "right") enemy.x += 1;
  if (dir === "up") enemy.y -= 1;
  if (dir === "down") enemy.y += 1;
};

const animateEnemy = () => {
  const enemies = getAll(enemy);
  enemies.forEach(moveEnemy);
};

setInterval(animateEnemy, 1000);

const shootBullet = (x, y, dx, dy) => {
  const b = addSprite(x, y, bullet);
  b.dx = dx;
  b.dy = dy;
  setTimeout(() => b.remove(), 2000);
};

const moveBullets = () => {
  getAll(bullet).forEach((b) => {
    b.x += b.dx;
    b.y += b.dy;
  });
};

setInterval(moveBullets, 100);

onInput("w", () => {
  getFirst(player).y -= 1;
});

onInput("a", () => {
  getFirst(player).x -= 1;
});

onInput("s", () => {
  getFirst(player).y += 1;
});

onInput("d", () => {
  getFirst(player).x += 1;
});

onInput("i", () => {
  const p = getFirst(player);
  shootBullet(p.x, p.y - 1, 0, -1);
});

onInput("j", () => {
  const p = getFirst(player);
  shootBullet(p.x - 1, p.y, -1, 0);
});

onInput("k", () => {
  const p = getFirst(player);
  shootBullet(p.x, p.y + 1, 0, 1);
});

onInput("l", () => {
  const p = getFirst(player);
  shootBullet(p.x + 1, p.y, 1, 0);
});

afterInput(() => {
  const playerPos = getFirst(player);
  const goalPos = getFirst(goal);
  const enemies = getAll(enemy);
  const bullets = getAll(bullet);

  bullets.forEach((b) => {
    enemies.forEach((e) => {
      if (b.x === e.x && b.y === e.y) {
        e.remove();
        b.remove();
      }
    });
  });

  enemies.forEach((e) => {
    if (playerPos.x === e.x && playerPos.y === e.y) {
      addText("Game Over!", { x: 4, y: 4, color: color`3` });
      setTimeout(() => {
        level = 0;
        setMap(levels[level]);
      }, 1000);
    }
  });

  if (playerPos.x === goalPos.x && playerPos.y === goalPos.y) {
    level++;
    if (level < levels.length) {
      setMap(levels[level]);
    } else {
      addText("You Win!", { x: 4, y: 4, color: color`3` });
    }
  }
});
