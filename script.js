const startdiv = document.getElementById("start");
const btn = document.querySelector("#start button");
const p = document.querySelector("#start p");
const scorediv = document.getElementById("score");
const killdiv = document.getElementById("kills");
const canvas = document.getElementById("canvas");
const width = window.innerWidth;
const height = window.innerHeight;
canvas.width = width;
canvas.height = height;
const ctx = canvas.getContext("2d");
ctx.clearRect(0, 0, width, height);

canvas.addEventListener("mousemove", (e) => {
    if (playing) {
        var dx = e.pageX - player.x;
        var dy = e.pageY - player.y;
        var tetha = Math.atan2(dy, dx);
        tetha *= 180 / Math.PI;
        angle = tetha;
    }
});

canvas.addEventListener("click", (e) => {
    bullets.push(new Circle(player.x, player.y, e.pageX, e.pageY, 5, 'white', 5));
    console.log(bullets);
});

class Circle {
    constructor(bx, by, tx, ty, r, c, s) {
        this.bx = bx;
        this.by = by;
        this.tx = tx;
        this.ty = ty;
        this.x = bx;
        this.y = by;
        this.r = r;
        this.c = c;
        this.s = s;
    }
    draw() {
        ctx.fillStyle = this.c;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
        ctx.fill();
        ctx.closePath();
    }
    update() {
        var dx = this.tx - this.bx;
        var dy = this.ty - this.by;
        var hp = Math.sqrt(dx * dx + dy * dy);
        this.x += (dx / hp) * this.s;
        this.y += (dy / hp) * this.s;
    }
    remove() {
        if ((this.x < 0 || this.x > width) || (this.y < 0 || this.y > height)) {
            return true;
        }
        return false;
    }
}


class Player {
    constructor(x, y, r, c,) {
        this.x = x;
        this.y = y;
        this.r = r;
        this.c = c;
    }

    draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(angle * Math.PI / 180);
        ctx.fillStyle = this.c;
        ctx.beginPath();
        ctx.arc(0, 0, this.r, 0, Math.PI * 2);
        ctx.fillRect(0, -(this.r * .4), this.r + 15, this.r * .8);
        ctx.fill();
        ctx.closePath();
        ctx.restore();
    }
}


function addEnemy() {
    for (var i = enemies.length; i < maxenemy; i++) {
        var r = Math.random() * 26 + 10;
        var c = 'hsl(' + (Math.random() * 360) + ',70%,50%)';
        var s = .5 + ((40 - ((r / 40) * r)) / 160) / maxenemy;


        var x, y;
        if (Math.random() < .5) {
            x = (Math.random() > .5) ? width : 0;
            y = Math.random() * height;
        }
        else {
            x = Math.random() * width;
            y = (Math.random() < .5) ? height : 0;
        }

        enemies.push(new Circle(x, y, player.x, player.y, r, c, s))

    }
}


function collision(x1, y1, r1, x2, y2, r2) {
    var dx = x1 - x2;
    var dy = y1 - y2;
    var hp = Math.sqrt(dx * dx + dy * dy);
    if (hp < (r1 + r2)) {
        return true;
    }
    return false;
}



function animate() {
    if (playing) {
        requestAnimationFrame(animate);
        // ctx.clearRect(0, 0, width, height);
        ctx.fillStyle = 'rgba(0,0,0,.1';
        ctx.fillRect(0, 0, width, height);
        ctx.fill();
        enemies.forEach((enemy, e) => {
            bullets.forEach((bullet, b) => {
                if (collision(enemy.x, enemy.y, enemy.r, bullet.x, bullet.y, bullet.r)) {
                    if (enemy.r < 15) {
                        enemies.splice(e, 1);
                        score += 25
                        kills++;
                        if (kills % 5 === 0) {
                            maxenemy++;
                        }
                        addEnemy();
                    }
                    else {
                        enemy.r -= 5;
                        score += 5;
                    }
                    bullets.splice(b, 1);
                }
            });


            if (collision(enemy.x, enemy.y, enemy.r, player.x, player.y, player.r)) {
                console.log("oyun bitti");
                startdiv.classList.remove("hidden");
                btn.textContent = "TEKRAR DENE";
                p.innerHTML = "Oyun bitti! <br/> Puanın: " + score;
                playing = false;
            }


            if (enemy.remove()) {
                enemies.splice(e, 1);
                addEnemy();
            }
            enemy.update();
            enemy.draw();
        });


        bullets.forEach((bullet, b) => {
            if (bullet.remove()) {
                bullets.splice(b, 1);
            }
            bullet.update();
            bullet.draw();
        });

        player.draw();
        scorediv.innerHTML = "Puan: " + score;
        killdiv.innerHTML = "Leş : " + kills;

    }
}


function init() {
    playing = true;
    score = 0;
    kills = 0;
    angle = 0;
    bullets = [];
    enemies = [];
    maxenemy = 4;
    startdiv.classList.add("hidden");
    player = new Player(width / 2, height / 2, 20, 'white');
    addEnemy();
    animate();
}

var playing = false;
var player, angle, bullets, enemies, maxenemy, score, kills;
// init();
