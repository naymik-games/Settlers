class startGame extends Phaser.Scene {
  constructor() {
    super("startGame");
  }
  preload() {
    //this.load.bitmapFont('atari', 'assets/fonts/atari-smooth.png', 'assets/fonts/atari-smooth.xml');
    // this.load.bitmapFont('atari', 'assets/fonts/Lato_0.png', 'assets/fonts/lato.xml');

  }
  create() {
    var text = 'PLAY'
    gameData = JSON.parse(localStorage.getItem('SettlersData'));
    if (gameData === null || gameData.length <= 0) {
      localStorage.setItem('SettlersData', JSON.stringify(gameDataDefault));
      gameData = gameDataDefault;
      conintueGame = false
      var turn = ''
    } else {
      text = 'CONTINUE'
      conintueGame = true
      var turn = gameData.turn
    }
    map = JSON.parse(localStorage.getItem('SettlersMap'));
    if (map === null || map.length <= 0) {
      localStorage.setItem('SettlersMap', JSON.stringify(mapDefault));
      map = mapDefault;
    }

    this.cameras.main.setBackgroundColor(0x000000);

    // var title = this.add.bitmapText(game.config.width / 2, 100, 'topaz', 'SquareDots', 150).setOrigin(.5).setTint(0xc76210);
    this.title = this.add.text(game.config.width / 2, 100, 'SETTLERS', { fontFamily: 'PixelSquare', fontSize: '100px', color: '#fafafa', align: 'center' }).setOrigin(.5).setTint(0xc76210);

    var startTime = this.add.text(game.config.width / 2, 275, text, { fontFamily: 'PixelSquare', fontSize: '75px', color: '#fafafa', align: 'center' }).setOrigin(.5).setTint(0xfafafa);
    var turnText = this.add.text(game.config.width / 2, 375, turn, { fontFamily: 'PixelSquare', fontSize: '40px', color: '#fa0000', align: 'center' }).setOrigin(.5)
    startTime.setInteractive();
    startTime.on('pointerdown', this.clickHandler, this);

    var fire = this.add.sprite(game.config.width / 2, 550, 'fire', 0).setScale(8)

    var godModeText = this.add.text(game.config.width / 2, 775, 'GOD MODE', { fontFamily: 'PixelSquare', fontSize: '60px', color: '#fafafa', align: 'center' }).setOrigin(.5).setTint(0xfafafa)
    var godSwitch = this.add.image(game.config.width / 2, 875, 'switch', godMode).setScale(4).setInteractive()
    godSwitch.on('pointerdown', function () {
      if (godMode == 0) {
        godMode = 1
        godSwitch.setFrame(godMode)
      } else {
        godMode = 0
        godSwitch.setFrame(godMode)
      }
    }, this)

    this.clearDataText = this.add.text(game.config.width / 2, 1550, 'RESET DATA', { fontFamily: 'PixelSquare', fontSize: '40px', color: '#fa0000', align: 'center' }).setOrigin(.5).setInteractive()
    this.clearDataText.on('pointerdown', function () {

      this.clearDataText.setText('DATA CLEARED')
      turnText.setText(0)

      startTime.setText('PLAY')
      localStorage.removeItem('SettlersData');
      localStorage.removeItem('SettlersMap');
      localStorage.setItem('SettlersData', JSON.stringify(gameDataDefault));
      localStorage.setItem('SettlersMap', JSON.stringify(mapDefault));
      gameData = gameDataDefault;
      map = mapDefault
    }, this)


  }
  clickHandler() {

    this.scene.start('playGame');
    //this.scene.launch('UI');
  }

}