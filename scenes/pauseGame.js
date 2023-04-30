class pauseGame extends Phaser.Scene {
  constructor() {
    super("pauseGame");
  }
  preload() {


  }
  create() {
    this.backBack1 = this.add.image(game.config.width / 2, game.config.height / 2, 'blank').setTint(0x000000);
    this.backBack1.displayWidth = 760;
    this.backBack1.displayHeight = 1110;

    this.backBack2 = this.add.image(game.config.width / 2, game.config.height / 2, 'blank').setTint(0xfafafa);
    this.backBack2.displayWidth = 850;
    this.backBack2.displayHeight = 1400;

    this.backBack3 = this.add.image(game.config.width / 2, game.config.height / 2, 'blank').setTint(0x000000);
    this.backBack3.displayWidth = 810;
    this.backBack3.displayHeight = 1360;


    var test = this.add.image(150, 225, 'tiles', FARM).setScale(gameOptions.scale * 1.5)
    var testText = this.add.text(250, 225, '+1 food per turn', { fontFamily: 'PixelSquare', fontSize: '40px', color: '#AEB6BF', align: 'center' }).setOrigin(0, .5).setTint(0xAEB6BF);



    var exit = this.add.image(game.config.width / 2, game.config.height / 2 + 475, 'icons-game', 3).setScale(.5)


    //var exit = this.add.bitmapText(game.config.width / 2, game.config.height / 2 + 475, 'atari', 'EXIT', 40).setOrigin(.5).setTint(0x3e5e71);
    exit.setInteractive();
    exit.on('pointerdown', function () {

      // localStorage.setItem('ringTotal', JSON.stringify(this.ringTotal));
      this.scene.stop();

      this.scene.resume('playGame');
    }, this);
  }

}
