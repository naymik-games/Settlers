let game;

let gameOptions = {
  tileSize: 80,
  scale: 5,
  fallSpeed: 100,
  destroySpeed: 200,
  offsetX: 50,
  offsetY: 125,
  rows: 10,//6 max
  columns: 10, //7 max
  gameMode: 'time', //moves, challenge
  defaultTime: 60,
  difficulty: 'easy'


}

window.onload = function () {
  let gameConfig = {
    type: Phaser.AUTO,
    scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH,
      parent: "thegame",
      width: 900,
      height: 1640
    },
    pixelArt: true,
    scene: [preloadGame, startGame, playGame, UI]
  }
  game = new Phaser.Game(gameConfig);
  window.focus();
}
/////////////////////////////////////////////////////////////////////////////////////////

/////////////////////////////////////////////////////////////////////////////////////////

/////////////////////////////////////////////
class playGame extends Phaser.Scene {
  constructor() {
    super("playGame");
  }
  preload() {


  }
  create() {
    this.action = null
    this.currentTile = null
    this.setupAnimaiton()


    this.selector = this.add.image(game.config.width / 2, 1800, 'blank').setTint(0x31316C)
    this.selector.displayWidth = 200
    this.selector.displayHeight = 75

    this.cameras.main.setBackgroundColor(0x000000);
    //this.cameras.main.setBackgroundColor(0x333333);
    //gameData = gameDataDefault
    this.baseBar = this.add.image(0, 0, 'blank').setOrigin(0).setTint(0x1A1A3E).setAlpha(0)
    this.baseBar.displayWidth = 0
    this.baseBar.displayHeight = 5
    this.baseTween = this.tweens.add({
      targets: this.baseBar,
      displayWidth: game.config.width,
      duration: 10000,
      repeat: -1,
      onRepeat: function (tween, target, key, current, previous, param) {
        console.log('new day')
        this.newDay()

      },
      onRepeatScope: this,
    })
    this.populationBar = this.add.image(0, 5, 'blank').setOrigin(0).setTint(0xdcdac9).setAlpha(1)
    this.populationBar.displayWidth = 0
    this.populationBar.displayHeight = 5
    this.populationTween = this.tweens.add({
      targets: this.populationBar,
      displayWidth: game.config.width,
      duration: 10000,
      repeat: -1,
      onRepeat: function (tween, target, key, current, previous, param) {
        console.log('new day')
        this.newPopulation()

      },
      onRepeatScope: this,
    })
    this.foodBar = this.add.image(0, 10, 'blank').setOrigin(0).setTint(0x80b878).setAlpha(0)
    this.foodBar.displayWidth = 0
    this.foodBar.displayHeight = 5
    this.foodTween = this.tweens.add({
      targets: this.foodBar,
      displayWidth: game.config.width,
      duration: 10000,
      repeat: -1,
      onRepeat: function (tween, target, key, current, previous, param) {
        //console.log('new day')
        this.newFood()

      },
      onRepeatScope: this,
    })
    this.lumberBar = this.add.image(0, 15, 'blank').setOrigin(0).setTint(0xa14d55).setAlpha(0)
    this.lumberBar.displayWidth = 0
    this.lumberBar.displayHeight = 5
    this.lumberTween = this.tweens.add({
      targets: this.lumberBar,
      displayWidth: game.config.width,
      duration: 10000,
      repeat: -1,
      onRepeat: function (tween, target, key, current, previous, param) {
        //console.log('new day')
        this.newLumber()

      },
      onRepeatScope: this,
    })
    this.oreBar = this.add.image(0, 20, 'blank').setOrigin(0).setTint(0x464969).setAlpha(0)
    this.oreBar.displayWidth = 0
    this.oreBar.displayHeight = 5
    this.oreTween = this.tweens.add({
      targets: this.oreBar,
      displayWidth: game.config.width,
      duration: 10000,
      repeat: -1,
      onRepeat: function (tween, target, key, current, previous, param) {
        //console.log('new day')
        this.newOre()

      },
      onRepeatScope: this,
    })
    this.goldBar = this.add.image(0, 25, 'blank').setOrigin(0).setTint(0xe06b51).setAlpha(0)
    this.goldBar.displayWidth = 0
    this.goldBar.displayHeight = 5
    this.goldTween = this.tweens.add({
      targets: this.goldBar,
      displayWidth: game.config.width,
      duration: 10000,
      repeat: -1,
      onRepeat: function (tween, target, key, current, previous, param) {
        //console.log('new day')
        //this.newDay()
        this.newGold()
      },
      onRepeatScope: this,
    })
    this.baseTween.setTimeScale(gameData.time.turn)
    this.populationTween.setTimeScale(gameData.time.population)
    this.foodTween.setTimeScale(gameData.time.food)
    this.lumberTween.setTimeScale(gameData.time.lumber)
    this.oreTween.setTimeScale(gameData.time.ore)
    this.goldTween.setTimeScale(gameData.time.gold)


    gameOptions.offsetX = (game.config.width - gameOptions.columns * gameOptions.tileSize) / 2
    gameOptions.offsetY = 350


    var mapBack = this.add.image(gameOptions.offsetX - 5, gameOptions.offsetY - 5, 'blank').setOrigin(0).setTint(0xAEB6BF)
    mapBack.displayWidth = (gameOptions.columns * gameOptions.tileSize) + 10
    mapBack.displayHeight = (gameOptions.rows * gameOptions.tileSize) + 10





    this.enemy = this.add.sprite(0, 0, 'tiles', ENEMY).setScale(gameOptions.scale).setDepth(5)

    this.enemy.play('enemy_anim')
    this.enemy.setAlpha(0)

    if (!conintueGame) {
      //new game
      this.gameArray = [];
      this.backArray = [];
      this.enemyArray = []
      for (let i = 0; i < gameOptions.rows; i++) {
        this.gameArray[i] = [];
        this.backArray[i] = [];
        this.enemyArray[i] = [];
        for (let j = 0; j < gameOptions.columns; j++) {
          this.gameArray[i][j] = { row: i, column: j, player: false, card: null, cardIndex: map[i][j], explored: false }
          let posX = gameOptions.offsetX + gameOptions.tileSize * j + gameOptions.tileSize / 2;
          let posY = gameOptions.offsetY + gameOptions.tileSize * i + gameOptions.tileSize / 2
          var back = this.add.sprite(posX, posY, 'tiles', Phaser.Math.Between(1, 6)).setScale(gameOptions.scale)
          this.gameArray[i][j].card = back
          this.enemyArray[i][j] = null
        }
      }
      for (let i = 0; i < gameOptions.rows; i++) {
        for (let j = 0; j < gameOptions.columns; j++) {
          if (this.gameArray[i][j].cardIndex == FIRE) {
            this.gameArray[i][j].card.setFrame(this.gameArray[i][j].cardIndex)
            this.gameArray[i][j].explored = true
            this.home = { row: i, column: j }
            this.gameArray[i][j].card.play('fire')
          }
        }
      }
      var start = this.getValid8Neighbors(this.home.row, this.home.column)
      for (let i = 0; i < start.length; i++) {
        const tile = start[i];
        this.gameArray[tile.row][tile.column].card.setFrame(this.gameArray[tile.row][tile.column].cardIndex)
        this.gameArray[tile.row][tile.column].explored = true
      }
    } else {
      //old game
      this.gameArray = [];
      this.backArray = [];
      this.enemyArray = []
      for (let i = 0; i < gameOptions.rows; i++) {
        this.gameArray[i] = [];
        this.backArray[i] = [];
        this.enemyArray[i] = [];
        for (let j = 0; j < gameOptions.columns; j++) {
          var exp = false
          if (map[i][j] > 0) {
            exp = true
          }
          this.gameArray[i][j] = { row: i, column: j, player: false, card: null, cardIndex: map[i][j], explored: exp }
          let posX = gameOptions.offsetX + gameOptions.tileSize * j + gameOptions.tileSize / 2;
          let posY = gameOptions.offsetY + gameOptions.tileSize * i + gameOptions.tileSize / 2
          var back = this.add.sprite(posX, posY, 'tiles', Phaser.Math.Between(1, 6)).setScale(gameOptions.scale)
          this.gameArray[i][j].card = back

        }
      }

      for (let i = 0; i < gameOptions.rows; i++) {
        for (let j = 0; j < gameOptions.columns; j++) {
          if (this.gameArray[i][j].explored) {
            this.gameArray[i][j].card.setFrame(this.gameArray[i][j].cardIndex)
            if (this.gameArray[i][j].cardIndex == FIRE) {
              this.home = { row: i, column: j }
              this.gameArray[i][j].card.play('fire')
            } else if (this.gameArray[i][j].cardIndex == FARM) {
              this.gameArray[i][j].card.play('farm_anim')
            } else if (this.gameArray[i][j].cardIndex == LUMBER) {
              this.gameArray[i][j].card.play('lumber_anim')
            } else if (this.gameArray[i][j].cardIndex == ENEMY) {
              this.gameArray[i][j].card.setFrame(this.gameArray[i][j].cardIndex)
              this.gameArray[i][j].explored = true

              this.gameArray[i][j].card.play('enemy_anim')
            }

          }

        }
      }
      if (gameData.enemy.active) {
        console.log('enemy added')
        this.addSavedEnemy()
      }
    }






    var pos = this.getPosition(5, 5)
    this.cursor = this.add.image(pos.x, pos.y, 'cursor').setScale(gameOptions.scale)

    let iconPosX = gameOptions.offsetX + gameOptions.tileSize * 0 + gameOptions.tileSize / 2;
    let iconPosY = 75
    let iconYSpace = 65
    //current amount text
    this.popIcon = this.add.image(150, iconPosY + 0 * iconYSpace, 'tiles', POPICON).setScale(gameOptions.scale)
    // this.popText = this.add.bitmapText(150, iconPosY + iconYSpace, 'topaz', gameData.population, 45).setOrigin(.5, .5).setTint(0xAEB6BF);
    this.popText = this.add.text(150, iconPosY + iconYSpace, gameData.population, { fontFamily: 'PixelSquare', fontSize: '45px', color: '#AEB6BF', align: 'center' }).setOrigin(.5).setTint(0xAEB6BF);
    this.foodIcon = this.add.image(300, iconPosY, 'tiles', FOODICON).setScale(gameOptions.scale)
    //this.foodText = this.add.bitmapText(300, iconPosY + iconYSpace, 'topaz', gameData.food, 45).setOrigin(.5, .5).setTint(0xAEB6BF);
    this.foodText = this.add.text(300, iconPosY + iconYSpace, gameData.food, { fontFamily: 'PixelSquare', fontSize: '45px', color: '#AEB6BF', align: 'center' }).setOrigin(.5).setTint(0xAEB6BF);
    this.lumberIcon = this.add.image(450, iconPosY, 'tiles', LUMBERICON).setScale(gameOptions.scale)
    //this.lumberText = this.add.bitmapText(450, iconPosY + iconYSpace, 'topaz', gameData.lumber, 45).setOrigin(.5, .5).setTint(0xAEB6BF);
    this.lumberText = this.add.text(450, iconPosY + iconYSpace, gameData.lumber, { fontFamily: 'PixelSquare', fontSize: '45px', color: '#AEB6BF', align: 'center' }).setOrigin(.5).setTint(0xAEB6BF);
    this.oreIcon = this.add.image(600, iconPosY, 'tiles', OREICON).setScale(gameOptions.scale)
    //this.oreText = this.add.bitmapText(600, iconPosY + iconYSpace, 'topaz', gameData.ore, 45).setOrigin(.5, .5).setTint(0xAEB6BF);
    this.oreText = this.add.text(600, iconPosY + iconYSpace, gameData.ore, { fontFamily: 'PixelSquare', fontSize: '45px', color: '#AEB6BF', align: 'center' }).setOrigin(.5).setTint(0xAEB6BF);
    this.goldIcon = this.add.image(750, iconPosY, 'tiles', GOLDICON).setScale(gameOptions.scale)
    // this.goldText = this.add.bitmapText(750, iconPosY + iconYSpace, 'topaz', gameData.gold, 45).setOrigin(.5).setTint(0xAEB6BF);
    this.goldText = this.add.text(750, iconPosY + iconYSpace, gameData.gold, { fontFamily: 'PixelSquare', fontSize: '45px', color: '#AEB6BF', align: 'center' }).setOrigin(.5).setTint(0xAEB6BF);
    //cost text
    this.costContainer = this.add.container()
    this.popCostText = this.add.bitmapText(150, iconPosY + 2 * iconYSpace, 'topaz', '', 45).setOrigin(.5, .5).setTint(0xAF335C);
    this.costContainer.add(this.popCostText)
    this.foodCostText = this.add.bitmapText(300, iconPosY + 2 * iconYSpace, 'topaz', '', 45).setOrigin(.5, .5).setTint(0xAF335C);
    this.costContainer.add(this.foodCostText)
    this.lumberCostText = this.add.bitmapText(450, iconPosY + 2 * iconYSpace, 'topaz', '', 45).setOrigin(.5, .5).setTint(0xAF335C);
    this.costContainer.add(this.lumberCostText)
    this.oreCostText = this.add.bitmapText(600, iconPosY + 2 * iconYSpace, 'topaz', '', 45).setOrigin(.5, .5).setTint(0xAF335C);
    this.costContainer.add(this.oreCostText)
    this.goldCostText = this.add.bitmapText(750, iconPosY + 2 * iconYSpace, 'topaz', '', 45).setOrigin(.5, .5).setTint(0xAF335C);
    this.costContainer.add(this.goldCostText)
    this.costContainer.setAlpha(0)
    //gain text
    this.gainContainer = this.add.container()
    this.popGainText = this.add.bitmapText(150, iconPosY + 3 * iconYSpace, 'topaz', '', 45).setOrigin(.5, .5).setTint(0x3EA270);
    this.gainContainer.add(this.popGainText)
    this.foodGainText = this.add.bitmapText(300, iconPosY + 3 * iconYSpace, 'topaz', '', 45).setOrigin(.5, .5).setTint(0x3EA270);
    this.gainContainer.add(this.foodGainText)
    this.lumberGainText = this.add.bitmapText(450, iconPosY + 3 * iconYSpace, 'topaz', '', 45).setOrigin(.5, .5).setTint(0x3EA270);
    this.gainContainer.add(this.lumberGainText)
    this.oreGainText = this.add.bitmapText(600, iconPosY + 3 * iconYSpace, 'topaz', '', 45).setOrigin(.5, .5).setTint(0x3EA270);
    this.gainContainer.add(this.oreGainText)
    this.goldGainText = this.add.bitmapText(750, iconPosY + 3 * iconYSpace, 'topaz', '', 45).setOrigin(.5, .5).setTint(0x3EA270);
    this.gainContainer.add(this.goldGainText)
    this.gainContainer.setAlpha(0)

    //this.infoText = this.add.bitmapText(game.config.width / 2, (gameOptions.offsetY + gameOptions.rows * gameOptions.tileSize) + 75, 'topaz', 'Info', 40).setOrigin(.5).setTint(0xAEB6BF);
    this.infoText = this.add.text(game.config.width / 2, (gameOptions.offsetY + gameOptions.rows * gameOptions.tileSize) + 75, 'INFO', { fontFamily: 'PixelSquare', fontSize: '45px', color: '#fafafa', align: 'center' }).setOrigin(.5).setTint(0xAEB6BF);

    this.buildContainer = this.add.container()
    this.okIcon = this.add.image(gameOptions.offsetX + gameOptions.tileSize * 8 + gameOptions.tileSize / 2, (gameOptions.offsetY + gameOptions.rows * gameOptions.tileSize) + 75, 'icons', 0).setScale(gameOptions.scale).setInteractive()
    this.buildContainer.add(this.okIcon)
    this.cancelIcon = this.add.image(gameOptions.offsetX + gameOptions.tileSize * 9 + gameOptions.tileSize / 2, (gameOptions.offsetY + gameOptions.rows * gameOptions.tileSize) + 75, 'icons', 1).setScale(gameOptions.scale).setInteractive()
    this.buildContainer.add(this.cancelIcon)
    this.buildContainer.setAlpha(0)

    this.okIcon.on('pointerdown', function () {
      this.buildContainer.setAlpha(0)
      this.costContainer.setAlpha(0)
      this.gainContainer.setAlpha(0)
      this.selector.y = 1800
      this.menu1.destroy()
      console.log('Build ' + this.action)
      this.build()
    }, this)
    this.cancelIcon.on('pointerdown', function () {
      this.buildContainer.setAlpha(0)
      this.costContainer.setAlpha(0)
      this.gainContainer.setAlpha(0)
      this.selector.y = 1800
      this.menu1.destroy()
      console.log('Do Not Build ' + this.action)
    }, this)

    this.attackIcon = this.add.image(50, (gameOptions.offsetY + gameOptions.rows * gameOptions.tileSize) + 75, 'tiles', ATTACK).setScale(gameOptions.scale).setInteractive().setAlpha(0)
    this.attackIcon.on('pointerdown', function () {
      console.log(this.enemyArray[gameData.enemy.position.row][gameData.enemy.position.column])
      //this.enemyArray[gameData.enemy.position.row][gameData.enemy.position.column].destory()
      this.enemy.setPosition(0, 0)
      this.enemy.setAlpha(0)
      gameData.enemy.active = false
      this.attackIcon.setAlpha(0)
    }, this)

    this.input.on("pointerdown", this.tileSelect, this)


    console.log(map)

  }
  update() {

  }
  addSavedEnemy() {
    let posX = gameOptions.offsetX + gameOptions.tileSize * gameData.enemy.position.column + gameOptions.tileSize / 2;
    let posY = gameOptions.offsetY + gameOptions.tileSize * gameData.enemy.position.row + gameOptions.tileSize / 2
    this.enemy.setPosition(posX, posY)
    this.enemy.setAlpha(1)
    //this.enemyArray[gameData.enemy.position.row][gameData.enemy.position.column] = en
  }
  newDay() {
    gameData.turn++
    //add random tile to empty one
    if (Phaser.Math.Between(1, 100) > 50) {
      var empty = this.getRandomEmpty()
      console.log(empty)
      if (empty != null && this.currentTile != null) {
        if (empty.row != this.currentTile.row && empty.column != this.currentTile.column) {
          this.explode(empty.row, empty.column)
          var num = weighted_random(bonusTiles, bonusTilesWeight)
          this.gameArray[empty.row][empty.column].cardIndex = num
          this.gameArray[empty.row][empty.column].card.setFrame(num)
          map[empty.row][empty.column] = num
        }

      }
    }
    //if enemy is active, move it,else spawn enemy 
    if (gameData.enemy.active) {
      var oldRow = gameData.enemy.position.row
      var oldColumn = gameData.enemy.position.column
      var neighbor = this.getRandomNeighbor(gameData.enemy.position.row, gameData.enemy.position.column)
      console.log('move enemy to')
      var newPos = this.getPosition(neighbor.row, neighbor.column)
      var tween = this.tweens.add({
        targets: this.enemy,
        x: newPos.x,
        y: newPos.y,
        duration: 100,
        callbackScope: this,
        onComplete: function () {

          gameData.enemy.position.row = neighbor.row
          gameData.enemy.position.column = neighbor.column
          this.destoryTile(oldRow, oldColumn)
          localStorage.setItem('SettlersData', JSON.stringify(gameData));
          localStorage.setItem('SettlersMap', JSON.stringify(map));
          this.updateText()
        }
      })

    } else {
      if (Phaser.Math.Between(1, 100) > 74) {
        var placed = false
        while (!placed) {
          var randRow = Phaser.Math.Between(0, gameOptions.rows - 1)
          var randColumn = Phaser.Math.Between(0, gameOptions.columns - 1)

          if ((randRow != this.currentTile.row && randColumn != this.currentTile.column) && (randRow != this.home.row && randColumn != this.home.column)) {
            this.explode(randRow, randColumn)
            this.spawnEnemy(randRow, randColumn)
            /*    this.gameArray[empty.row][empty.column].cardIndex = num
               this.gameArray[empty.row][empty.column].card.setFrame(num)
               map[empty.row][empty.column] = num */
            placed = true
          }
        }

      }
    }

    localStorage.setItem('SettlersData', JSON.stringify(gameData));
    localStorage.setItem('SettlersMap', JSON.stringify(map));
    this.updateText()
  }
  spawnEnemy(row, column) {
    gameData.enemy.position.row = row
    gameData.enemy.position.column = column
    gameData.enemy.active = true
    let posX = gameOptions.offsetX + gameOptions.tileSize * gameData.enemy.position.column + gameOptions.tileSize / 2;
    let posY = gameOptions.offsetY + gameOptions.tileSize * gameData.enemy.position.row + gameOptions.tileSize / 2
    this.enemy.setPosition(posX, posY)
    this.enemy.setAlpha(1)
    //en.play('enemy_anim')

  }
  newPopulation() {
    var houses = countType(HOUSE)
    var bighouses = countType(BIGHOUSE)
    gameData.population += 1 + houses + (bighouses * 2)
    this.updateText()
  }
  newFood() {
    var pastures = countType(PASTURE)
    var farms = countType(FARM)
    var fishes = countType(FISHING)
    gameData.food += 1 + (farms * 2) + pastures + fishes
    this.updateText()
  }
  newLumber() {
    var lMills = countType(LUMBER)
    gameData.lumber += lMills * 2
    this.updateText()
  }
  newOre() {
    var mines = countType(MINE)
    gameData.ore += mines
    this.updateText()
  }
  newGold() {
    var fishes = countType(FISHING)
    var gmines = countType(GOLDMINE)
    gameData.gold += fishes + gmines
    this.updateText()
  }
  build() {
    if (this.action != null) {
      if (this.action == 'EXPLORE') {
        this.explore(this.currentTile.row, this.currentTile.column)
      } else if (this.action == 'CHOP') {
        this.chop(this.currentTile.row, this.currentTile.column)
      } else if (this.action == 'FARM') {
        this.farm(this.currentTile.row, this.currentTile.column)
      } else if (this.action == 'MINE') {
        this.mine(this.currentTile.row, this.currentTile.column)
      } else if (this.action == 'PASTURE') {
        this.pasture(this.currentTile.row, this.currentTile.column)
      } else if (this.action == 'LM') {
        this.lumber(this.currentTile.row, this.currentTile.column)
      } else if (this.action == 'COLLECT') {
        this.collect(this.currentTile.row, this.currentTile.column)
      } else if (this.action == 'PICK') {
        this.pick(this.currentTile.row, this.currentTile.column)
      } else if (this.action == 'CLEAR') {
        this.clear(this.currentTile.row, this.currentTile.column)
      } else if (this.action == 'HOUSE') {
        this.house(this.currentTile.row, this.currentTile.column)
      } else if (this.action == 'UPGRADEHOUSE') {
        this.bigHouse(this.currentTile.row, this.currentTile.column)
      } else if (this.action == 'GM') {
        this.goldMine(this.currentTile.row, this.currentTile.column)
      } else if (this.action == 'PICK') {
        this.pick(this.currentTile.row, this.currentTile.column)
      } else if (this.action == 'OUTPOST') {
        this.upgrade(this.currentTile.row, this.currentTile.column)
      } else if (this.action == 'DRAIN') {
        this.drain(this.currentTile.row, this.currentTile.column)
      } else if (this.action == 'FISHINGHUT') {
        this.fishing(this.currentTile.row, this.currentTile.column)
      } else if (this.action == 'LUMBERCAMP') {
        this.lumbercamp(this.currentTile.row, this.currentTile.column)
      } else if (this.action == 'WORKSHOP') {
        this.workshop(this.currentTile.row, this.currentTile.column)
      } else if (this.action == 'MARKET') {
        this.market(this.currentTile.row, this.currentTile.column)
      } else if (this.action == 'CASTLE') {
        this.castle(this.currentTile.row, this.currentTile.column)
      } else if (this.action == 'GREENHOUSE') {
        this.green(this.currentTile.row, this.currentTile.column)
      } else if (this.action == 'AQUADUCT') {
        this.aquaduct(this.currentTile.row, this.currentTile.column)
      }
      gameData.population += buildInfo[this.action].cost.population
      gameData.food += buildInfo[this.action].cost.food
      gameData.lumber += buildInfo[this.action].cost.lumber
      gameData.ore += buildInfo[this.action].cost.ore
      gameData.gold += buildInfo[this.action].cost.gold

      gameData.population += buildInfo[this.action].gain.population
      gameData.food += buildInfo[this.action].gain.food
      gameData.lumber += buildInfo[this.action].gain.lumber
      gameData.ore += buildInfo[this.action].gain.ore
      gameData.gold += buildInfo[this.action].gain.gold
      console.log(map)
      this.updateText()
    }
  }
  explore(row, column) {
    this.explode(row, column)
    // var num = Phaser.Math.Between(0, newTiles.length - 1)
    var num = weighted_random(newTiles, newTilesWeight)
    map[row][column] = num
    console.log(num)
    console.log(tileInfo[num].name)
    this.gameArray[row][column].cardIndex = num
    this.gameArray[row][column].card.setFrame(num)

    this.gameArray[row][column].explored = true
  }
  chop(row, column) {
    this.explode(row, column)
    this.gameArray[row][column].cardIndex = GRASS
    this.gameArray[row][column].card.setFrame(GRASS)
    map[row][column] = GRASS
  }
  farm(row, column) {
    this.explode(row, column)
    this.gameArray[row][column].cardIndex = FARM
    this.gameArray[row][column].card.setFrame(FARM)
    this.gameArray[row][column].card.play('farm_anim')
    map[row][column] = FARM
  }
  mine(row, column) {
    this.explode(row, column)
    this.gameArray[row][column].cardIndex = MINE
    this.gameArray[row][column].card.setFrame(MINE)
    map[row][column] = MINE
  }
  pasture(row, column) {
    this.explode(row, column)
    this.gameArray[row][column].cardIndex = PASTURE
    this.gameArray[row][column].card.setFrame(PASTURE)
    map[row][column] = PASTURE
  }
  lumber(row, column) {
    this.explode(row, column)
    this.gameArray[row][column].cardIndex = LUMBER
    this.gameArray[row][column].card.setFrame(LUMBER)
    this.gameArray[row][column].card.play('lumber_anim')
    map[row][column] = LUMBER
  }
  collect(row, column) {
    this.explode(row, column)
    this.gameArray[row][column].cardIndex = BLANK
    this.gameArray[row][column].card.setFrame(BLANK)
    map[row][column] = BLANK
  }
  pick(row, column) {
    this.explode(row, column)
    this.gameArray[row][column].cardIndex = FOREST
    this.gameArray[row][column].card.setFrame(FOREST)
    map[row][column] = FOREST
  }
  clear(row, column) {
    this.explode(row, column)
    if (this.gameArray[row][column].cardIndex == LUMBERCAMP) {
      gameData.time.lumber -= .25
      this.lumberTween.setTimeScale(gameData.time.lumber)
    }
    if (this.gameArray[row][column].cardIndex == WORKSHOP) {
      gameData.time.ore -= .25
      this.oreTween.setTimeScale(gameData.time.ore)
    }
    if (this.gameArray[row][column].cardIndex == MARKET) {
      gameData.time.gold -= .25
      this.goldTween.setTimeScale(gameData.time.gold)
    }
    this.gameArray[row][column].cardIndex = BLANK
    this.gameArray[row][column].card.setFrame(BLANK)
    map[row][column] = BLANK

  }
  destoryTile(row, column) {
    if (this.gameArray[row][column].explored) {
      this.explode(row, column)
      if (this.gameArray[row][column].cardIndex == LUMBERCAMP) {
        gameData.time.lumber -= .25
        this.lumberTween.setTimeScale(gameData.time.lumber)
      }
      if (this.gameArray[row][column].cardIndex == WORKSHOP) {
        gameData.time.ore -= .25
        this.oreTween.setTimeScale(gameData.time.ore)
      }
      if (this.gameArray[row][column].cardIndex == MARKET) {
        gameData.time.gold -= .25
        this.goldTween.setTimeScale(gameData.time.gold)
      }
      this.gameArray[row][column].cardIndex = BLANK
      this.gameArray[row][column].card.setFrame(BLANK)
      map[row][column] = BLANK
    }
  }
  drain(row, column) {
    this.explode(row, column)
    this.gameArray[row][column].cardIndex = BLANK
    this.gameArray[row][column].card.setFrame(BLANK)
    map[row][column] = BLANK
  }
  house(row, column) {
    this.explode(row, column)
    this.gameArray[row][column].cardIndex = HOUSE
    this.gameArray[row][column].card.setFrame(HOUSE)
    map[row][column] = HOUSE
  }
  bigHouse(row, column) {
    this.explode(row, column)
    this.gameArray[row][column].cardIndex = BIGHOUSE
    this.gameArray[row][column].card.setFrame(BIGHOUSE)
    map[row][column] = BIGHOUSE
  }
  goldMine(row, column) {
    this.explode(row, column)
    this.gameArray[row][column].cardIndex = GOLDMINE
    this.gameArray[row][column].card.setFrame(GOLDMINE)
    map[row][column] = GOLDMINE
  }
  pick(row, column) {
    this.explode(row, column)
    this.gameArray[row][column].cardIndex = FOREST
    this.gameArray[row][column].card.setFrame(FOREST)
    map[row][column] = FOREST
  }
  fishing(row, column) {
    this.explode(row, column)
    this.gameArray[row][column].cardIndex = FISHING
    this.gameArray[row][column].card.setFrame(FISHING)
    map[row][column] = FISHING
  }
  lumbercamp(row, column) {
    this.explode(row, column)
    this.gameArray[row][column].cardIndex = LUMBERCAMP
    this.gameArray[row][column].card.setFrame(LUMBERCAMP)
    map[row][column] = LUMBERCAMP
    gameData.time.lumber += .25
    this.lumberTween.setTimeScale(gameData.time.lumber)
  }
  workshop(row, column) {
    this.explode(row, column)
    this.gameArray[row][column].cardIndex = WORKSHOP
    this.gameArray[row][column].card.setFrame(WORKSHOP)
    map[row][column] = WORKSHOP
    gameData.time.ore += .25
    this.oreTween.setTimeScale(gameData.time.ore)
  }
  market(row, column) {
    this.explode(row, column)
    this.gameArray[row][column].cardIndex = MARKET
    this.gameArray[row][column].card.setFrame(MARKET)
    map[row][column] = MARKET
    gameData.time.gold += .25
    this.goldTween.setTimeScale(gameData.time.gold)
  }
  upgrade(row, column) {
    this.explode(row, column)
    this.gameArray[row][column].card.stop('fire_anim')
    this.gameArray[row][column].card.setTexture('tiles')
    this.gameArray[row][column].cardIndex = OUTPOST
    this.gameArray[row][column].card.setFrame(OUTPOST)
    map[row][column] = OUTPOST
    gameData.time.turn += .25
    this.goldTween.setTimeScale(gameData.time.turn)
    // console.log(this.gameArray[row][column].cardIndex)
    /* if (this.gameArray[row][column].cardIndex == FIRE) {
      this.gameArray[row][column].cardIndex = OUTPOST
      this.gameArray[row][column].card.setFrame(OUTPOST)
      map[row][column] = OUTPOST
    } else if (this.gameArray[row][column].cardIndex == OUTPOST) {
      this.gameArray[row][column].cardIndex = CASTLE
      this.gameArray[row][column].card.setFrame(CASTLE)
      map[row][column] = CASTLE
    } */

  }
  castle(row, column) {
    this.explode(row, column)
    this.gameArray[row][column].cardIndex = CASTLE
    this.gameArray[row][column].card.setFrame(CASTLE)
    map[row][column] = CASTLE
    gameData.time.turn += .5
    this.goldTween.setTimeScale(gameData.time.turn)

  }
  green(row, column) {
    this.explode(row, column)
    this.gameArray[row][column].card.stop('farm_anim')
    this.gameArray[row][column].card.setTexture('tiles')
    this.gameArray[row][column].cardIndex = GREENHOUSE
    this.gameArray[row][column].card.setFrame(GREENHOUSE)
    map[row][column] = GREENHOUSE
    gameData.time.food += .25
    this.goldTween.setTimeScale(gameData.time.food)

  }
  aquaduct(row, column) {
    this.explode(row, column)
    this.gameArray[row][column].cardIndex = AQUADUCT
    this.gameArray[row][column].card.setFrame(AQUADUCT)
    map[row][column] = AQUADUCT
    gameData.time.population += .25
    this.goldTween.setTimeScale(gameData.time.population)

  }
  tileSelect(pointer) {
    let row = Math.floor((pointer.y - gameOptions.offsetY) / gameOptions.tileSize);
    let col = Math.floor((pointer.x - gameOptions.offsetX) / gameOptions.tileSize);
    console.log(row + ', ' + col)
    if (this.validPick(row, col)) {
      this.buildContainer.setAlpha(0)
      this.attackIcon.setAlpha(0)
      this.selector.y = 1800
      if (this.menu1) {
        this.menu1.destroy()
      }
      this.currentTile = { row: row, column: col }
      var pos = this.getPosition(row, col)
      this.cursor.setPosition(pos.x, pos.y)

      if (gameData.enemy.active) {
        if (gameData.enemy.position.row == row && gameData.enemy.position.column == col) {
          this.attackIcon.setAlpha(1)
        }
      }


      console.log(tileInfo[this.gameArray[row][col].cardIndex].name)
      if (this.gameArray[row][col].explored) {
        this.infoText.setText(tileInfo[this.gameArray[row][col].cardIndex].name)
        this.displayMenu(this.gameArray[row][col].cardIndex)
      } else {
        this.infoText.setText('???')
        if (this.isConnected(row, col)) {
          this.displayMenu(0)
        }
      }

    }
  }
  displayMenu(cardIndex) {
    var menuOffsetY = (gameOptions.offsetY + gameOptions.rows * gameOptions.tileSize) + 175
    this.menu1 = this.add.container()
    console.log(tileInfo[cardIndex])
    if (tileInfo[cardIndex].menu != null) {
      for (let i = 0; i < tileInfo[cardIndex].menu.length; i++) {
        const menuItem = tileInfo[cardIndex].menu[i];
        var item = this.add.bitmapText(game.config.width / 2, menuOffsetY + i * 65, 'topaz', menuItem.name, 50).setOrigin(.5).setTint(0xfafafa).setInteractive();
        item.menuItem = menuItem
        console.log(item.menuItem.index)
        if (checkCost(item.menuItem.index)) {
          item.setTint(0xfafafa)
        } else {
          item.setTint(0xAF335C)
        }
        item.on('pointerdown', this.menuPress.bind(this, item))
        this.menu1.add(item)

      }
    }

  }
  displaySubmenu(menuItem) {
    var menuOffsetY = (gameOptions.offsetY + gameOptions.rows * gameOptions.tileSize) + 175
    this.menu1 = this.add.container()
    if (menuItem.submenu != null) {
      for (let i = 0; i < menuItem.submenu.length; i++) {

        const menuIt = menuItem.submenu[i];

        var item = this.add.bitmapText(game.config.width / 2, menuOffsetY + i * 65, 'topaz', menuIt.name, 50).setOrigin(.5).setTint(0xfafafa).setInteractive();
        item.menuItem = menuIt.index

        if (buildInfo[menuIt.index].restriction != null) {
          console.log('CANT BUILD')
          item.setTint(0xAF335C)
          if (buildInfo[menuIt.index].restriction == 'nearwater') {
            if (this.isNearWater(this.currentTile.row, this.currentTile.column)) {
              item.setTint(0xfafafa)
            }
          }
        } else {
          if (checkCost(item.menuItem)) {
            item.setTint(0xfafafa)
          } else {
            item.setTint(0xAF335C)
          }


        }
        item.on('pointerdown', this.submenPress.bind(this, item))

        this.menu1.add(item)

      }
    }
  }
  menuPress(item) {
    console.log(item.menuItem)
    if (item.menuItem.submenu != null) {
      this.menu1.destroy()
      //display submen
      this.displaySubmenu(item.menuItem)
    } else {
      //do action
      // console.log('Do ' + item.menuItem.name)
      if (checkCost(item.menuItem.index) || godMode == 1) {
        this.buildContainer.setAlpha(1)
      } else {
        this.buildContainer.setAlpha(0)
      }

      this.action = item.menuItem.index

      this.updateCostText()
      this.costContainer.setAlpha(1)
      this.updateGainText()
      this.gainContainer.setAlpha(1)

    }
  }
  submenPress(item) {
    if (buildInfo[item.menuItem].restriction != null) {
      this.buildContainer.setAlpha(0)
      if (buildInfo[item.menuItem].restriction == 'nearwater') {
        if (this.isNearWater(this.currentTile.row, this.currentTile.column)) {
          this.buildContainer.setAlpha(1)
        }
      }
    } else {
      if (checkCost(item.menuItem) || godMode == 1) {
        this.buildContainer.setAlpha(1)
      } else {
        this.buildContainer.setAlpha(0)
      }


    }
    this.action = item.menuItem
    var textData = item.getTextBounds()
    var tween = this.tweens.add({
      targets: this.selector,
      y: item.y + 3,
      displayWidth: textData.global.width + 50,
      duration: 75
    })
    console.log(item.getTextBounds())
    //this.selector.y = item.y + 3
    this.updateCostText()
    this.costContainer.setAlpha(1)
    this.updateGainText()
    this.gainContainer.setAlpha(1)
    //console.log('Do ' + item.menuItem)
  }
  addScore() {
    this.events.emit('score');
  }
  getRandomEmpty() {
    var tiles = []
    for (let i = 0; i < gameOptions.rows; i++) {
      for (let j = 0; j < gameOptions.columns; j++) {
        if (this.gameArray[i][j].explored && this.gameArray[i][j].cardIndex == BLANK) {
          tiles.push({ row: i, column: j })
        }
      }
    }
    return tiles[Phaser.Math.Between(0, tiles.length - 1)]
  }

  isNearWater(row, column) {
    var neighbors = this.getValid8Neighbors(row, column)
    for (let i = 0; i < neighbors.length; i++) {
      const neighbor = neighbors[i];
      if (this.gameArray[neighbor.row][neighbor.column].cardIndex == WATER) {
        return true
      }
    }
    return false
  }
  isConnected(row, column) {
    var neighbors = this.getValid8Neighbors(row, column)
    for (let i = 0; i < neighbors.length; i++) {
      const neighbor = neighbors[i];
      if (this.gameArray[neighbor.row][neighbor.column].explored) {
        return true
      }
    }
    return false
  }
  getRandomNeighbor(row, column) {
    var neighbors = this.getValid4Neighbors(row, column)
    return neighbors[Phaser.Math.Between(0, neighbors.length - 1)]
  }
  getValid4Neighbors(row, column) {
    var temp = []
    for (let i = 0; i < neighbor4Coords.length; i++) {
      const nTile = neighbor4Coords[i];
      if (this.validPick(row + nTile[0], column + nTile[1])) {
        temp.push({ row: row + nTile[0], column: column + nTile[1] })
      }
    }
    return temp
  }
  getValid8Neighbors(row, column) {
    var temp = []
    for (let i = 0; i < neighbor8Coords.length; i++) {
      const nTile = neighbor8Coords[i];
      if (this.validPick(row + nTile[0], column + nTile[1])) {
        temp.push({ row: row + nTile[0], column: column + nTile[1] })
      }
    }
    return temp
  }
  getPosition(row, column) {
    let posX = gameOptions.offsetX + gameOptions.tileSize * column + gameOptions.tileSize / 2;
    let posY = gameOptions.offsetY + gameOptions.tileSize * row + gameOptions.tileSize / 2
    return { x: posX, y: posY }
  }
  validPick(row, column) {
    return row >= 0 && row < gameOptions.rows && column >= 0 && column < gameOptions.columns && this.gameArray[row] != undefined && this.gameArray[row][column] != undefined;
  }
  explode(row, column) {
    // let posX = this.xOffset + this.dotSize * x + this.dotSize / 2;
    // let posY = this.yOffset + this.dotSize * y + this.dotSize / 2
    var explosion = this.bursts.get().setActive(true);

    // Place the explosion on the screen, and play the animation.
    explosion.setOrigin(0.5, 0.5).setScale(gameOptions.scale + 1).setDepth(3);
    var pos = this.getPosition(row, column)
    explosion.setPosition(pos.x, pos.y)
    explosion.play('puff');
    explosion.on('animationcomplete', function () {
      explosion.setActive(false);
      explosion.setPosition(-64, -64)
    }, this);
  }
  updateText() {
    this.popText.setText(gameData.population)
    this.foodText.setText(gameData.food)
    this.lumberText.setText(gameData.lumber)
    this.oreText.setText(gameData.ore)
    this.goldText.setText(gameData.gold)

  }
  updateCostText() {
    var cost = buildInfo[this.action].cost
    if (cost.population == 0) {
      this.popCostText.setText('')
    } else {
      this.popCostText.setText(cost.population)
    }
    if (cost.food == 0) {
      this.foodCostText.setText('')
    } else {
      this.foodCostText.setText(cost.food)
    }
    if (cost.lumber == 0) {
      this.lumberCostText.setText('')
    } else {
      this.lumberCostText.setText(cost.lumber)
    }
    if (cost.ore == 0) {
      this.oreCostText.setText('')
    } else {
      this.oreCostText.setText(cost.ore)
    }
    if (cost.gold == 0) {
      this.goldCostText.setText('')
    } else {
      this.goldCostText.setText(cost.gold)
    }


  }
  updateGainText() {
    var gain = buildInfo[this.action].gain
    if (gain.population == 0) {
      this.popGainText.setText('')
    } else {
      this.popGainText.setText('+' + gain.population)
    }
    if (gain.food == 0) {
      this.foodGainText.setText('')
    } else {
      this.foodGainText.setText('+' + gain.food)
    }
    if (gain.lumber == 0) {
      this.lumberGainText.setText('')
    } else {
      this.lumberGainText.setText('+' + gain.lumber)
    }
    if (gain.ore == 0) {
      this.oreGainText.setText('')
    } else {
      this.oreGainText.setText('+' + gain.ore)
    }
    if (gain.gold == 0) {
      this.goldGainText.setText('')
    } else {
      this.goldGainText.setText('+' + gain.gold)
    }


  }
  setupAnimaiton() {
    this.anims.create({
      key: 'fire',
      frames: 'fire',
      frameRate: 6,
      repeat: -1
    });

    this.anims.create({
      key: 'puff',
      frames: 'puff',
      frameRate: 8,
      repeat: 0
    });
    this.bursts = this.add.group({
      defaultKey: 'puff',
      maxSize: 30
    });
    this.anims.create({
      key: 'farm_anim',
      frames: this.anims.generateFrameNumbers('tiles', { frames: [23, 56] }),
      frameRate: 6,
      repeat: -1
    });
    this.anims.create({
      key: 'lumber_anim',
      frames: this.anims.generateFrameNumbers('tiles', { frames: [24, 55] }),
      frameRate: 6,
      repeat: -1
    });
    this.anims.create({
      key: 'enemy_anim',
      frames: this.anims.generateFrameNumbers('enemy', { frames: [0, 1, 2, 3, 0, 1, 2, 3] }),
      frameRate: 8,
      repeat: -1
    });
  }
}
