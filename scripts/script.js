
var HeroX = 20,
    HeroY = 120,
    HeroW = 30,
    HeroH = 30,
    EnemyH = 30,
    EnemyW = 30,
    BoardW = 600,
    BoardH = 600,
    speedBullet = 2,
    scores,
    level = 2; //Чем больше число тем проще (минимум 1)
var hero,
    enemy,
    boom,
    badaboom,
    bullet,
    ctx,
    canvas,
    boomflag = false,
    badaboomflag = false,
    EnemyArr,
    Bullets,
    BonusArr,
    boomcoords = [],
    badaboomcoords = [],
    gameLoop,
    enemiesLoop,
    bonusLoop,
    killsound,
    bonussound,
    shotsound;


function Init() {
    //находим canvas и заливаем
    canvas = document.getElementById("game");
    canvas.height = BoardH;
    canvas.width = BoardW;
    ctx = canvas.getContext("2d");

    //создаем ГГ и противников
    hero = new Image();
    hero.src = "img/hero.png";

    back = new Image();
    back.src = "img/fon.jpg";

    enemy = new Image();
    enemy.src = "img/enemy.png";

    bullet = new Image();
    bullet.src = "img/bullet.png";

    boom = new Image();
    boom.src = "img/boom.png";

    badaboom = new Image();
    badaboom.src = "img/bada-boom.png";

    bonus = new Image();
    bonus.src = "img/bonus.png";

    //звуки

    killsound = new Audio();
    killsound.src = "sounds/kill.mp3";
    killsound.load();

    bonussound = new Audio();
    bonussound.src = "sounds/bonus.mp3";
    bonussound.load();

    shotsound = new Audio();
    shotsound.src = "sounds/Laser.mp3";
    shotsound.load();
    shotsound.volume = .1;

    EnemyArr = [];
    Bullets = [];
    BonusArr = [];
    scores = 0;
};

//проверка условия проигрыша (захождение певого врага в зону героя)
function GameOver() {
    if (EnemyArr.length > 0 && EnemyArr[0].EnemyX < HeroX + HeroW) {
        return true;
    }
    else {
        return false;
    };
};

function drawAll() {

    if (!GameOver()) {
        //рисуем фон
        ctx.drawImage(back, 0, 0);
        ctx.drawImage(hero, HeroX, HeroY);

        // рисуем врагов и пули
        for (var i = 0; i < EnemyArr.length; i++) {
            ctx.drawImage(enemy, EnemyArr[i].EnemyX, EnemyArr[i].EnemyY);
        };

        for (var i = 0; i < Bullets.length; i++) {
            ctx.drawImage(bullet, Bullets[i].X, Bullets[i].Y)
        };


        //рисуем бонусы
        if (BonusArr.length > 0) {
            ctx.drawImage(bonus, BonusArr[0], BonusArr[1])
        }

        //взрывы
        if (badaboomflag) {
            ctx.drawImage(badaboom, badaboomcoords[0], badaboomcoords[1])
            badaboomflag = false;
        };
        if (boomflag) {
            ctx.drawImage(boom, boomcoords[0], boomcoords[1])
            boomflag = false;
            badaboomflag = true;
        };

        ctx.fillStyle = "red";
        ctx.fillText("SCORES: " + scores, 500, 10);
        //перемещение врагов и пуль, удаление
        ChangeEnemies();
        ChangeBullets();
        DeleteEnemy();
        DeleteBullets();
        if (BonusArr.length > 0) {
            ChangeBonus();
            DeleteBonus();
        };
    }
    else {
        ctx.fillStyle = "red";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "black";
        ctx.fillText("GAME OVER!", 250, 250);
        ctx.fillText("YOUR SCORE: " + scores, 250, 300);
    };
};

//генерация врагов
function GenerateEnemies() {
    var obj = {};
    obj.EnemyY = parseInt((Math.random() * (575 - 0 + 1)), 10);
    obj.EnemyX = 570;
    EnemyArr.push(obj);
};

//перемещение врагов
function ChangeEnemies() {
    for (var i = 0; i < EnemyArr.length; i++) {
        EnemyArr[i].EnemyX -= 1;
    };
};

//генерация бонусов
function GenerateBonus() {
    var BonusY = parseInt((Math.random() * (575 - 0 + 1)), 10);
    var BonusX = 570;
    BonusArr = [BonusX,BonusY];
};

//перемещение бонусов
function ChangeBonus() {
    BonusArr[0] -= 2;
};

//генерация выстрелов
function GenerateBullet(posY){
    var obj = {};
    obj.X = HeroX+HeroW;
    obj.Y = posY+HeroH/2;
    Bullets.push(obj);
};

//перемещение пуль
function ChangeBullets() {
    for (var i = 0; i < Bullets.length; i++) {
        Bullets[i].X += speedBullet;
    };
};

//вычисление попаданий
function DeadCollision(bullet, enemy) {
    if (bullet.X >= enemy.EnemyX && bullet.X <= enemy.EnemyX + EnemyW) {
        if (bullet.Y >= enemy.EnemyY && bullet.Y <= enemy.EnemyY + EnemyH) {
            badaboomcoords = [enemy.EnemyX, enemy.EnemyY];
            boomcoords = [enemy.EnemyX, enemy.EnemyY];
            boomflag = true;
            return true;
        };
    };
};

//удаление умерших противников
function DeleteEnemy() {
    for (var i = 0; i < EnemyArr.length; i++) {
        for (var j = 0; j < Bullets.length; j++) {
            if (DeadCollision(Bullets[j], EnemyArr[i])) {
                EnemyArr.splice(i, 1);
                Bullets.splice(j, 1);
                scores += 10;
                killsound.play();
            };
        };
    };
};

//удаление пуль из массива, вышедших за границу
function DeleteBullets() {
    for (var i = 0; i < Bullets.length; i++) {
        if (Bullets[i].X > BoardW) {
            Bullets.splice(i, 1);
        }
    };
    console.log(Bullets.length);
};

//получение очков при поимке бонуса
function DeleteBonus() {
    if(BonusArr[0] <= HeroX+ HeroW){
        if (BonusArr[1] + 40 >= HeroY && BonusArr[1] <= HeroY + HeroH)
        {
            BonusArr.splice(0,2);
            scores += 100;
            bonussound.play();
        }
    }
}
// Чтение клавы
function keyHandler(evt) {
    switch (evt.keyCode) {
        // Down arrow.
        case 38:
            HeroY = HeroY - HeroH / 2;
            if (HeroY < 0) {
                HeroY = 0;
            }
            break;
            // Up arrow.
        case 40:
            HeroY = HeroY + HeroH/2;
            if (HeroY > BoardH - HeroH) {
                HeroY = BoardH - HeroH;
            }
            break;
        case 32:
            GenerateBullet(HeroY - 10);
            shotsound.play();
    };
};


function drawGameCanvas() {
    // Play the game until the ball stops.
    gameLoop = setInterval(drawAll, 16);
    //Генерим координаты врагов
    enemiesLoop = setInterval(GenerateEnemies, level * 1000);
    //Генерим бонусы
    bonusLoop = setInterval(GenerateBonus, level*6000)
    // Слушаем клаву
    window.addEventListener('keydown', keyHandler, true);
};

//стартуем, я сказал стартуем
function Start() {
    clearInterval(gameLoop);
    clearInterval(enemiesLoop);
    clearInterval(bonusLoop);
    Init();
    drawGameCanvas();
};

document.onload = Start();
document.getElementById("restart").onclick = Start;
