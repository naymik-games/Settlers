class preloadGame extends Phaser.Scene {
  constructor() {
    super("PreloadGame");
  }
  preload() {


    var progressBar = this.add.graphics();
    var progressBox = this.add.graphics();
    progressBox.fillStyle(0x222222, 0.8);
    progressBox.fillRect(240, 270, 320, 50);

    var width = this.cameras.main.width;
    var height = this.cameras.main.height;
    var loadingText = this.make.text({
      x: width / 2,
      y: height / 2 - 50,
      text: 'Loading...',
      style: {
        font: '20px monospace',
        fill: '#ffffff'
      }
    });
    loadingText.setOrigin(0.5, 0.5);

    var percentText = this.make.text({
      x: width / 2,
      y: height / 2 - 5,
      text: '0%',
      style: {
        font: '18px monospace',
        fill: '#ffffff'
      }
    });
    percentText.setOrigin(0.5, 0.5);

    var assetText = this.make.text({
      x: width / 2,
      y: height / 2 + 50,
      text: '',
      style: {
        font: '18px monospace',
        fill: '#ffffff'
      }
    });

    assetText.setOrigin(0.5, 0.5);

    this.load.on('progress', function (value) {
      percentText.setText(parseInt(value * 100) + '%');
      progressBar.clear();
      progressBar.fillStyle(0xffffff, 1);
      progressBar.fillRect(250, 280, 300 * value, 30);
    });

    this.load.on('fileprogress', function (file) {
      assetText.setText('Loading asset: ' + file.key);
    });

    this.load.on('complete', function () {
      progressBar.destroy();
      progressBox.destroy();
      loadingText.destroy();
      percentText.destroy();
      assetText.destroy();
    });

    this.load.image("particle", "assets/particle.png");
    for (var i = 0; i < 125; i++) {
      this.load.image("particle", "assets/particle.png");
    }




    //this.load.image("particle", "assets/sprites/particle.png");
    this.load.bitmapFont('topaz', 'assets/fonts/topaz.png', 'assets/fonts/topaz.xml');
    this.load.spritesheet("menu_icons", "assets/sprites/icons.png", {
      frameWidth: 96,
      frameHeight: 96
    });
    this.load.spritesheet("gems", "assets/sprites/gems.png", {
      frameWidth: 100,
      frameHeight: 100
    });

    this.load.spritesheet("particle_color", "assets/particles.png", {
      frameWidth: 6,
      frameHeight: 6
    });
    this.load.spritesheet("rover", "assets/sprites/rover.png", {
      frameWidth: 100,
      frameHeight: 100
    });
    this.load.spritesheet("icons", "assets/sprites/game_icons2_.png", {
      frameWidth: 16,
      frameHeight: 16
    });
    this.load.spritesheet("icons-game", "assets/sprites/game_icons.png", {
      frameWidth: 128,
      frameHeight: 128
    });
    this.load.spritesheet("puff", "assets/sprites/puff.png", {
      frameWidth: 16,
      frameHeight: 16
    });
    this.load.spritesheet("switch", "assets/sprites/switch.png", {
      frameWidth: 32,
      frameHeight: 16
    });
    this.load.spritesheet("tiles", "assets/sprites/tiles.png", {
      frameWidth: 16,
      frameHeight: 16,
      spacing: 1,
      margin: 1
    });
    this.load.spritesheet("enemy", "assets/sprites/enemy.png", {
      frameWidth: 18,
      frameHeight: 18,
      spacing: 1,
      margin: 1
    });
    this.load.spritesheet("fire", "assets/sprites/fire.png", {
      frameWidth: 16,
      frameHeight: 16,
      spacing: 1,
      margin: 1
    });

    this.load.image('blank', 'assets/sprites/blank.png');
    this.load.image('cursor', 'assets/sprites/cursor.png');

  }
  create() {
    this.scene.start("startGame");
    //this.scene.start("PlayGame");

  }
}








