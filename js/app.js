var game = new Phaser.Game(800, 600, Phaser.AUTO, '#game', { preload: preload, create: create, update: update });

var platforms;
var player;
var stars;
var score = 0;
var scoreText;

function preload() {
    game.load.image('ground', 'phaser-pong/assets/ground.jpg');
    game.load.image('star', 'phaser-pong/assets/star.png');
    game.load.image('background', 'phaser-pong/assets/sky.jpg');
    game.load.spritesheet('dude', 'phaser-pong/assets/dude.png', 32, 48);
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

    cursors = game.input.keyboard.createCursorKeys();

    scoreText = game.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#000' });
}

function update () {
//  Проверка на столкновение игрока с полом
    game.physics.arcade.collide(player, platforms);
    game.physics.arcade.collide(stars, platforms);
    game.physics.arcade.overlap(player, stars, collectStar, null, this);

    //  Обнулим скорость перемещения персонажа в пространстве
    player.body.velocity.x = 0;

    if (cursors.left.isDown)
    {
        //  Движение влево
        player.body.velocity.x = -150;

        player.animations.play('left');
    }
    else if (cursors.right.isDown)
    {
        //  Движение вправо
        player.body.velocity.x = 150;

        player.animations.play('right');
    }
    else
    {
        //  Состояние покоя
        player.animations.stop();

        player.frame = 4;
    }

    //  Высота прыжка
    if (cursors.up.isDown && player.body.touching.down)
    {
        player.body.velocity.y = -350;
    }

    function collectStar (player, star) {

        // Removes the star from the screen
        star.kill();
        score += 10;
        scoreText.text = 'Score: ' + score
    }
}