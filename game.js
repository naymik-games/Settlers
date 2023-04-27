let game;

let gameOptions = {
  tileSize: 64,
  scale: 4,
  fallSpeed: 100,
  destroySpeed: 200,
  offsetX: 50,
  offsetY: 150,
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

      },
      onRepeatScope: this,
    })
    this.populationTween.setTimeScale(gameData.time.population)
    this.foodTween.setTimeScale(gameData.time.food)
    this.lumberTween.setTimeScale(gameData.time.lumber)
    this.oreTween.setTimeScale(gameData.time.ore)
    this.goldTween.setTimeScale(gameData.time.gold)


    gameOptions.offsetX = (game.config.width - gameOptions.columns * gameOptions.tileSize) / 2
    gameOptions.offsetY = 400


    var mapBack = this.add.image(gameOptions.offsetX - 5, gameOptions.offsetY - 5, 'blank').setOrigin(0).setTint(0xAEB6BF)
    mapBack.displayWidth = (gameOptions.columns * gameOptions.tileSize) + 10
    mapBack.displayHeight = (gameOptions.rows * gameOptions.tileSize) + 10








    if (!conintueGame) {
      this.gameArray = [];
      this.backArray = [];
      for (let i = 0; i < gameOptions.rows; i++) {
        this.gameArray[i] = [];
        this.backArray[i] = [];
        for (let j = 0; j < gameOptions.columns; j++) {
          this.gameArray[i][j] = { row: i, column: j, player: false, card: null, cardIndex: map[i][j], explored: false }
          let posX = gameOptions.offsetX + gameOptions.tileSize * j + gameOptions.tileSize / 2;
          let posY = gameOptions.offsetY + gameOptions.tileSize * i + gameOptions.tileSize / 2
          var back = this.add.sprite(posX, posY, 'tiles', Phaser.Math.Between(1, 6)).setScale(gameOptions.scale)
          this.gameArray[i][j].card = back
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
      this.gameArray = [];
      this.backArray = [];
      for (let i = 0; i < gameOptions.rows; i++) {
        this.gameArray[i] = [];
        this.backArray[i] = [];
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
            }

          }
        }
      }
    }






    var pos = this.getPosition(5, 5)
    this.cursor = this.add.image(pos.x, pos.y, 'cursor').setScale(gameOptions.scale)

    let iconPosX = gameOptions.offsetX + gameOptions.tileSize * 0 + gameOptions.tileSize / 2;
    let iconPosY = 75
    let iconYSpace = 85
    //current amount text
    this.popIcon = this.add.image(150, iconPosY + 0 * iconYSpace, 'tiles', POPICON).setScale(gameOptions.scale)
    // this.popText = this.add.bitmapText(150, iconPosY + iconYSpace, 'topaz', gameData.population, 45).setOrigin(.5, .5).setTint(0xAEB6BF);
    this.popText = this.add.text(150, iconPosY + iconYSpace, gameData.population, { fontFamily: 'PixelSquare', fontSize: '45px', color: '#AEB6BF', align: 'center' }).setOrigin(.5).setTint(0xAEB6BF);
    this.foodIcon = this.add.image(300, iconPosY, 'tiles', FOODICON).setScale(gameOptions.scale)
    //this.foodText = this.add.bitmapText(300, iconPosY + iconYSpace, 'topaz', gameData.food, 45).setOrigin(.5, .5).setTint(0xAEB6BF);
    this.foodText = this.add.text(300, iconPosY + iconYSpace, gameData.food, { fontFamily: 'PixelSquare', fontSize: '45px', color: '#AEB6BF', align: 'center' }).setOrigin(.5).setTint(0xAEB6BF);
    this.lumberIcon = this.add.image(450, iconPosY, 'tiles', LUMBERICON).setScale(gameOptions.scale)
    this.lumberText = this.add.bitmapText(459, iconPosY + iconYSpace, 'topaz', gameData.lumber, 45).setOrigin(.5, .5).setTint(0xAEB6BF);
    this.oreIcon = this.add.image(600, iconPosY, 'tiles', OREICON).setScale(gameOptions.scale)
    this.oreText = this.add.bitmapText(600, iconPosY + iconYSpace, 'topaz', gameData.ore, 45).setOrigin(.5, .5).setTint(0xAEB6BF);
    this.goldIcon = this.add.image(750, iconPosY, 'tiles', GOLDICON).setScale(gameOptions.scale)
    this.goldText = this.add.bitmapText(750, iconPosY + iconYSpace, 'topaz', gameData.gold, 45).setOrigin(0, .5).setTint(0xAEB6BF);
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

    this.input.on("pointerdown", this.tileSelect, this)

    console.log(map)

  }
  update() {

  }
  newDay() {
    gameData.turn++

    if (Phaser.Math.Between(1, 100) > 50) {
      var empty = this.getRandomEmpty()
      console.log(empty)
      if (empty != null) {
        if (empty.row != this.currentTile.row && empty.column != this.currentTile.column) {
          this.explode(empty.row, empty.column)
          var num = weighted_random(bonusTiles, bonusTilesWeight)
          this.gameArray[empty.row][empty.column].cardIndex = num
          this.gameArray[empty.row][empty.column].card.setFrame(num)
          map[empty.row][empty.column] = num
        }

      }
    }
    localStorage.setItem('SettlersData', JSON.stringify(gameData));
    localStorage.setItem('SettlersMap', JSON.stringify(map));
    this.updateText()
  }
  newPopulation() {
    var houses = countType(HOUSE)
    gameData.population += 1 + houses
    this.updateText()
  }
  newFood() {
    var pastures = countType(PASTURE)
    var farms = countType(FARM)
    gameData.food += 1 + farms + pastures
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
      } else if (this.action == 'UPGRADE') {
        this.upgrade(this.currentTile.row, this.currentTile.column)
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
  upgrade(row, column) {
    this.explode(row, column)
    this.gameArray[row][column].cardIndex = OUTPOST
    this.gameArray[row][column].card.setFrame(OUTPOST)
    map[row][column] = OUTPOST
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
  tileSelect(pointer) {
    let row = Math.floor((pointer.y - gameOptions.offsetY) / gameOptions.tileSize);
    let col = Math.floor((pointer.x - gameOptions.offsetX) / gameOptions.tileSize);
    console.log(row + ', ' + col)
    if (this.validPick(row, col)) {
      this.buildContainer.setAlpha(0)
      this.selector.y = 1800
      if (this.menu1) {
        this.menu1.destroy()
      }
      this.currentTile = { row: row, column: col }
      var pos = this.getPosition(row, col)
      this.cursor.setPosition(pos.x, pos.y)
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
        var item = this.add.bitmapText(game.config.width / 2, menuOffsetY + i * 75, 'topaz', menuItem.name, 50).setOrigin(.5).setTint(0xfafafa).setInteractive();
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

        var item = this.add.bitmapText(game.config.width / 2, menuOffsetY + i * 75, 'topaz', menuIt.name, 50).setOrigin(.5).setTint(0xfafafa).setInteractive();
        item.menuItem = menuIt.index

        if (buildInfo[menuIt.index].restriction != null) {
          console.log('CANT BUILD')
          item.setTint(0xAF335C)
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
  }
}
