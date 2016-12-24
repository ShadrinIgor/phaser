var game = new Phaser.Game(800, 600, Phaser.AUTO, '#game', { preload: preload, create: create, update: update });

var platforms;
var player;
var stars;
var gun;
var score = 0;
var scoreText;
var gunStatus = 0;
var nap = -1;

function preload() {
    game.load.image('ground', 'phaser-pong/assets/ground.jpg');
    game.load.image('star', 'phaser-pong/assets/star.png');
    game.load.image('background', 'phaser-pong/assets/sky.jpg');
    game.load.spritesheet('dude', 'phaser-pong/assets/dude.png', 32, 48);
    game.load.spritesheet('gun', 'phaser-pong/assets/gun.png', 21, 20);
    game.load.spritesheet('explosion', 'phaser-pong/assets/explosion.png', 20, 20);
}
function create() {
    game.physics.startSystem(Phaser.Physics.ARCADE);
    game.add.sprite(0, 0, 'background');

    platforms = game.add.group();
    platforms.enableBody = true;

    var ground = platforms.create(0, game.world.height - 40, 'ground');
    ground.scale.setTo(2, 2);
    ground.body.immovable = true;

    var ledge = platforms.create(500, 400, 'ground');

    ledge.body.immovable = true;

    ledge = platforms.create(-500, 250, 'ground');

    ledge.body.immovable = true;

    stars = game.add.group();
    stars.enableBody = true;

    //  Создаем 12 звезд с отступами между ними
    for (var i = 0; i < 12; i++)
    {
        //  Создаем звезду и добавляем его в группу "stars"
        var star = stars.create(i * 70, 0, 'star');

        //  Добавляем гравитацию
        star.body.gravity.y = 9;

        // Для каждой звезды указываем свою амплитуду отскока
        star.body.bounce.y = 0.7 + Math.random() * 0.2;
    }

    /////////////////////////////////////////-----

    // Персонаж и настройки для него
    player = game.add.sprite(32, game.world.height - 150, 'dude');

    // Добавляем физику для персонажа
    game.physics.arcade.enable(player);

    //  Настройки. Добавим небольшой отскок при приземлении.
    player.body.bounce.y = 0.2;
    player.body.gravity.y = 300;
    player.body.collideWorldBounds = true;

    //  Добавим две анимации для движения влево и вправо
    player.animations.add('left', [0, 1, 2, 3], 10, true);
    player.animations.add('right', [5, 6, 7, 8], 10, true);

    guns = game.add.group();
    guns.setAll('body.allowGravity', false);

    cursors = game.input.keyboard.createCursorKeys();

    scoreText = game.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#000' });
}

function update () {
//  Проверка на столкновение игрока с полом
    game.physics.arcade.collide(player, platforms);
    game.physics.arcade.collide(stars, platforms);
    game.physics.arcade.overlap(player, stars, collectStar, null, this);
    game.physics.arcade.overlap(guns, stars, collectStar, null, this);

    //  Обнулим скорость перемещения персонажа в пространстве
    player.body.velocity.x = 0;

    if (cursors.left.isDown)
    {
        //  Движение влево
        player.body.velocity.x = -150;

        player.animations.play('left');
        nap = 1;
    }
    else if (cursors.right.isDown)
    {
        //  Движение вправо
        player.body.velocity.x = 150;

        player.animations.play('right');
        nap = -1;
    }
    else
    {
        //nap = -1;
        //  Состояние покоя
        player.animations.stop();

        //player.frame = 5;
    }

    //  Высота прыжка
    if (cursors.up.isDown && player.body.touching.down)
    {
        player.body.velocity.y = -350;
    }

    if (cursors.down.isDown) {
        fire();
    }

    if (cursors.down.isUp) {
        gunStatus = 0;
    }
}

function fire() {
    if( gunStatus == 0 ){

        var p = new Phaser.Point(this.player.x+5, this.player.y+25);

        var item = guns.create(p.x, p.y, 'gun');
        item.anchor.setTo(0.5, 0.5);
        game.physics.arcade.enable(item);
        item.animations.add('run', [0, 1, 2, 3], 10, true);
        item.animations.play('run');

        if( nap == 1 )item.body.velocity.x = -350;
            else item.body.velocity.x = 350;
        gunStatus = 1;
    }
}

function collectStar (player, star) {

    var explosion = game.add.sprite( star.x, star.y, "explosion" );
    explosion.animations.add('run', [0, 1, 2, 3], 5, false);
    game.physics.arcade.enable(explosion);
    explosion.animations.play('run');
    explosion.animations.currentAnim.onComplete.add(function () {	explosion.kill()}, this);

    // Removes the star from the screen
    star.kill();
    score += 10;
    scoreText.text = 'Score: ' + score
}