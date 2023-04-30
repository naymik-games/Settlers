loadFont("PixelSquare", "assets/fonts/KenneyPixelSquare.ttf");
function loadFont(name, url) {
  var newFont = new FontFace(name, `url(${url})`);
  newFont.load().then(function (loaded) {
    document.fonts.add(loaded);
  }).catch(function (error) {
    return error;
  });
}
let godMode = 0
let conintueGame = false
//tile constants
const POPICON = 50
const FOODICON = 51
const LUMBERICON = 52
const OREICON = 53
const GOLDICON = 54

const BLANK = 7
const FIRE = 10
const OUTPOST = 11
const CASTLE = 12
const GRASS = 13
const MUSHROOM = 14
const FOREST = 15
const ORCHARD = 16
const SHEEP = 17
const MOUNTAIN = 18
const WATER = 19
const FISH = 20
const SWAMP = 21
const GOLD = 22
const FARM = 23
const LUMBER = 24
const MINE = 25
const GOLDMINE = 26
const PASTURE = 27
const HOUSE = 28
const BIGHOUSE = 29
const FISHING = 30
const LIGHTHOUSE = 31
const WHEAT = 32
const WORKSHOP = 33
const LUMBERCAMP = 35
const MARKET = 34
const ENEMY = 36
const ATTACK = 37
const GREENHOUSE = 38
const AQUADUCT = 39

let gameSettings;
var defaultValues = {
  mostDotsMoves: 0,
  mostDotsTime: 0,
  levelStatus: [0, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
  totalSquares: 0,
  group: 0,
  currentLevel: 0
}

let neighbor4Coords = [[0, 1], [0, -1], [-1, 0], [1, 0]]
let neighbor8Coords = [[0, 1], [0, -1], [-1, 0], [1, 0], [-1, -1], [-1, 1], [1, 1], [1, -1]]
let newTiles = [BLANK, GRASS, FOREST, ORCHARD, MUSHROOM, SHEEP, MOUNTAIN, WATER, SWAMP, GOLD]
let newTilesWeight = [10, 9, 11, 9, 9, 9, 8, 5, 6, 4]
let bonusTiles = [GRASS, FOREST, ORCHARD, MUSHROOM, SHEEP, SWAMP, GOLD]
let bonusTilesWeight = [10, 10, 9, 9, 9, 6, 4]


var buildInfo = {
  CLEAR: { cost: { population: -1, food: -5, lumber: 0, ore: 0, gold: 0 }, gain: { population: 0, food: 0, lumber: 0, ore: 0, gold: 0 }, restriction: null },
  EXPLORE: { cost: { population: -1, food: -5, lumber: 0, ore: 0, gold: 0 }, gain: { population: 0, food: 0, lumber: 0, ore: 0, gold: 0 }, restriction: null },
  CHOP: { cost: { population: -1, food: 0, lumber: 0, ore: 0, gold: 0 }, gain: { population: 0, food: 0, lumber: 25, ore: 0, gold: 0 }, restriction: null },
  MINE: { cost: { population: -25, food: -75, lumber: -100, ore: 0, gold: 0 }, gain: { population: 0, food: 0, lumber: 0, ore: 5, gold: 0 }, restriction: null },
  COLLECT: { cost: { population: -1, food: 0, lumber: 0, ore: 0, gold: 0 }, gain: { population: 0, food: 5, lumber: 0, ore: 0, gold: 0 }, restriction: null },
  LM: { cost: { population: -10, food: -50, lumber: -25, ore: 0, gold: 0 }, gain: { population: 0, food: 0, lumber: 0, ore: 0, gold: 0 }, restriction: null },
  GM: { cost: { population: -10, food: 0, lumber: -50, ore: -25, gold: 0 }, gain: { population: 0, food: 0, lumber: 0, ore: 0, gold: 0 }, restriction: null },
  FARM: { cost: { population: -10, food: -25, lumber: -75, ore: 0, gold: 0 }, gain: { population: 0, food: 0, lumber: 0, ore: 0, gold: 0 }, restriction: null },
  PASTURE: { cost: { population: -5, food: 0, lumber: -50, ore: 0, gold: 0 }, gain: { population: 0, food: 0, lumber: 0, ore: 0, gold: 0 }, restriction: null },


  HOUSE: { cost: { population: -10, food: -25, lumber: -50, ore: 0, gold: 0 }, gain: { population: 0, food: 0, lumber: 0, ore: 0, gold: 0 }, restriction: null },
  UPGRADEHOUSE: { cost: { population: -10, food: -100, lumber: -50, ore: -10, gold: -10 }, gain: { population: 0, food: 0, lumber: 0, ore: 0, gold: 0 }, restriction: null },
  OUTPOST: { cost: { population: -10, food: -100, lumber: -150, ore: -10, gold: -25 }, gain: { population: 0, food: 0, lumber: 0, ore: 0, gold: 0 }, restriction: null },
  CASTLE: { cost: { population: -20, food: -200, lumber: -200, ore: -50, gold: -75 }, gain: { population: 0, food: 0, lumber: 0, ore: 0, gold: 0 }, restriction: null },

  PICK: { cost: { population: -1, food: 0, lumber: 0, ore: 0, gold: 0 }, gain: { population: 0, food: 10, lumber: 0, ore: 0, gold: 0 }, restriction: null },
  FISHINGHUT: { cost: { population: -5, food: -25, lumber: -50, ore: 0, gold: 0 }, gain: { population: 0, food: 0, lumber: 0, ore: 0, gold: 0 }, restriction: 'nearwater' },
  DRAIN: { cost: { population: -5, food: -50, lumber: 0, ore: 0, gold: 0 }, gain: { population: 0, food: 0, lumber: 0, ore: 0, gold: 0 }, restriction: null },
  LIGHTHOUSE: { cost: { population: -25, food: -100, lumber: -75, ore: -50, gold: -50 }, gain: { population: 0, food: 0, lumber: 0, ore: 0, gold: 0 }, restriction: 'nearwater' },
  WORKSHOP: { cost: { population: -25, food: -75, lumber: -100, ore: -25, gold: -25 }, gain: { population: 0, food: 0, lumber: 0, ore: 0, gold: 0 }, restriction: null },
  LUMBERCAMP: { cost: { population: -25, food: -100, lumber: -25, ore: -75, gold: -10 }, gain: { population: 0, food: 0, lumber: 0, ore: 0, gold: 0 }, restriction: null },
  MARKET: { cost: { population: -25, food: -75, lumber: -50, ore: -25, gold: -25 }, gain: { population: 0, food: 0, lumber: 0, ore: 0, gold: 0 }, restriction: null },
  ATTACK: { cost: { population: -1, food: -5, lumber: -5, ore: -25, gold: 0 }, gain: { population: 0, food: 0, lumber: 0, ore: 0, gold: 0 }, restriction: null },
  GREENHOUSE: { cost: { population: -25, food: -100, lumber: -50, ore: -25, gold: -25 }, gain: { population: 0, food: 0, lumber: 0, ore: 0, gold: 0 }, restriction: null },
  AQUADUCT: { cost: { population: -75, food: -50, lumber: -100, ore: -50, gold: -25 }, gain: { population: 0, food: 0, lumber: 0, ore: 0, gold: 0 }, restriction: 'nearwater' },

}

let gameData
let gameDataDefault = {
  turn: 0,
  enemy: { active: false, position: { row: 0, column: 0 }, hp: 2 },
  population: 75,
  food: 250,
  lumber: 0,
  ore: 0,
  gold: 0,
  time: { turn: 1, population: 1, food: 1, lumber: 1, ore: 1, gold: 1 }

}
var map
var mapDefault = [
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 15, 7, 13, 0, 0],
  [0, 0, 0, 0, 0, 13, 10, 7, 0, 0],
  [0, 0, 0, 0, 0, 16, 7, 17, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
]

function checkCost(index) {
  if (index == 'BUILD') {
    return true
  }
  var cost = buildInfo[index].cost
  if (gameData.population < Math.abs(cost.population)) {
    return false
  }
  if (gameData.food < Math.abs(cost.food)) {
    return false
  }
  if (gameData.lumber < Math.abs(cost.lumber)) {
    return false
  }
  if (gameData.ore < Math.abs(cost.ore)) {
    return false
  }
  if (gameData.gold < Math.abs(cost.gold)) {
    return false
  }
  return true
}
function countType(tile) {
  var count = 0
  for (let i = 0; i < gameOptions.rows; i++) {
    for (let j = 0; j < gameOptions.columns; j++) {
      if (map[i][j] == tile) {
        count++
      }

    }
  }
  return count
}
function weighted_random(items, weights) {
  let randomArray = [];
  items.forEach((item, index) => {
    var clone = Array(weights[index]).fill(item);
    randomArray.push(...clone);
  });

  return randomArray[~~(Math.random() * randomArray.length)]
}




var tileInfo = {
  0: {
    name: '????',
    menu: [
      {
        name: 'EXPLORE',
        index: 'EXPLORE',
        submenu: null
      }
    ],
    icome: {
      population: 0,
      food: 0,
      lumber: 0,
      ore: 0,
      gold: 0,
    }
  },
  7: {
    name: 'EMPTY',
    menu: [
      {
        name: 'BUILD',
        index: 'BUILD',
        submenu: [
          {
            name: 'HOUSE',
            index: 'HOUSE'
          },
          {
            name: 'FARM',
            index: 'FARM'
          },
          {
            name: 'LUMBER MILL',
            index: 'LM'
          },
          {
            name: 'FISHING HUT',
            index: 'FISHINGHUT'
          },
          {
            name: 'MARKET',
            index: 'MARKET'
          }
        ]
      }
    ],
    icome: {
      population: 0,
      food: 0,
      lumber: 0,
      ore: 0,
      gold: 0,
    }
  },
  10: {
    name: 'BONFIRE',
    menu: [
      {
        name: 'OUTPOST',
        index: 'OUTPOST',
        submenu: null
      }
    ],
    icome: {
      population: 0,
      food: 0,
      lumber: 0,
      ore: 0,
      gold: 0,
    }
  },
  13: {
    name: 'GRASS',
    menu: [
      {
        name: 'BUILD',
        index: 'BUILD',
        submenu: [
          {
            name: 'HOUSE',
            index: 'HOUSE'
          },
          {
            name: 'FARM',
            index: 'FARM'
          },
          {
            name: 'LUMBER MILL',
            index: 'LM'
          },
          {
            name: 'MARKET',
            index: 'MARKET'
          },
          {
            name: 'AQUADUCT',
            index: 'AQUADUCT'
          }
        ],
        icome: {
          population: 0,
          food: 0,
          lumber: 0,
          ore: 0,
          gold: 0,
        }
      },
      {
        name: 'CLEAR',
        index: 'CLEAR',
        submenu: null
      }
    ]
  },
  15: {
    name: 'FOREST',
    menu: [
      {
        name: 'CHOP',
        index: 'CHOP',
        submenu: null
      },
      {
        name: 'LUMBER CAMP',
        index: 'LUMBERCAMP',
        submenu: null
      }
    ],
    icome: {
      population: 0,
      food: 0,
      lumber: 0,
      ore: 0,
      gold: 0,
    }
  },
  16: {
    name: 'ORCHARD',
    menu: [
      {
        name: 'PICK',
        index: 'PICK',
        submenu: null
      },
      {
        name: 'CHOP',
        index: 'CHOP',
        submenu: null
      }
    ],
    icome: {
      population: 0,
      food: 0,
      lumber: 0,
      ore: 0,
      gold: 0,
    }
  },
  17: {
    name: 'SHEEP',
    menu: [
      {
        name: 'BUILD',
        index: 'BUILD',
        submenu: [
          {
            name: 'PASTURE',
            index: 'PASTURE'
          }
        ]
      }
    ],
    icome: {
      population: 0,
      food: 0,
      lumber: 0,
      ore: 0,
      gold: 0,
    }
  },
  18: {
    name: 'MOUNTAIN',
    menu: [
      {
        name: 'BUILD',
        index: 'BUILD',
        submenu: [
          {
            name: 'MINE',
            index: 'MINE'
          }
        ]
      }
    ],
    icome: {
      population: 0,
      food: 0,
      lumber: 0,
      ore: 0,
      gold: 0,
    }
  },
  19: {
    name: 'WATER',
    menu: null,
    icome: {
      population: 0,
      food: 0,
      lumber: 0,
      ore: 0,
      gold: 0,
    }
  },
  20: {
    name: 'FISH',
    menu: null,
    icome: {
      population: 0,
      food: 0,
      lumber: 0,
      ore: 0,
      gold: 0,
    }
  },
  21: {
    name: 'SWAMP',
    menu: [
      {
        name: 'DRAIN',
        index: 'DRAIN',
        submenu: null
      }
    ],
    icome: {
      population: 0,
      food: 0,
      lumber: 0,
      ore: 0,
      gold: 0,
    }
  },
  14: {
    name: 'MUSHROOMS',
    menu: [
      {
        name: 'COLLECT',
        index: 'COLLECT',
        submenu: null
      },
      {
        name: 'CLEAR',
        index: 'CLEAR',
        submenu: null
      }
    ],
    icome: {
      population: 0,
      food: 0,
      lumber: 0,
      ore: 0,
      gold: 0,
    }
  },
  22: {
    name: 'GOLD DEPOSIT',
    menu: [
      {
        name: 'BUILD',
        index: 'BUILD',
        submenu: [
          {
            name: 'GOLD MINE',
            index: 'GM'
          }
        ]
      }
    ],
    icome: {
      population: 0,
      food: 0,
      lumber: 0,
      ore: 0,
      gold: 0,
    }
  },
  26: {
    name: 'GOLD MINE',
    menu: [
      {
        name: 'CLEAR',
        index: 'CLEAR',
        submenu: null
      }
    ],
    icome: {
      population: 0,
      food: 0,
      lumber: 0,
      ore: 0,
      gold: 1,
    }
  },
  25: {
    name: 'MINE',
    menu: [
      {
        name: 'CLEAR',
        index: 'CLEAR',
        submenu: null
      },
      {
        name: 'WORKSHOP',
        index: 'WORKSHOP',
        submenu: null
      }
    ],
    icome: {
      population: 0,
      food: 0,
      lumber: 0,
      ore: 1,
      gold: 0,
    }
  },
  23: {
    name: 'FARM',
    menu: [
      {
        name: 'CLEAR',
        index: 'CLEAR',
        submenu: null
      },
      {
        name: 'GREEN HOUSE',
        index: 'GREENHOUSE',
        submenu: null
      }
    ],
    icome: {
      population: 0,
      food: 1,
      lumber: 0,
      ore: 0,
      gold: 0,
    }
  },
  27: {
    name: 'PASTURE',
    menu: [
      {
        name: 'CLEAR',
        index: 'CLEAR',
        submenu: null
      }
    ],
    icome: {
      population: 0,
      food: 1,
      lumber: 0,
      ore: 0,
      gold: 0,
    }
  },
  24: {
    name: 'LUMBER MILL',
    menu: [
      {
        name: 'CLEAR',
        index: 'CLEAR',
        submenu: null
      }
    ],
    icome: {
      population: 0,
      food: 0,
      lumber: 1,
      ore: 0,
      gold: 0,
    }
  },
  28: {
    name: 'HOUSE',
    menu: [
      {
        name: 'CLEAR',
        index: 'CLEAR',
        submenu: null
      },
      {
        name: 'UPGRADE HOUSE',
        index: 'UPGRADEHOUSE',
        submenu: null
      }
    ],
    icome: {
      population: 0,
      food: 0,
      lumber: 1,
      ore: 0,
      gold: 0,
    }
  },
  29: {
    name: 'VILLA',
    menu: [
      {
        name: 'CLEAR',
        index: 'CLEAR',
        submenu: null
      }
    ],
    icome: {
      population: 0,
      food: 0,
      lumber: 1,
      ore: 0,
      gold: 0,
    }
  },
  11: {
    name: 'OUTPOST',
    menu: [
      {
        name: 'CASTLE',
        index: 'CASTLE',
        submenu: null
      }
    ],
    icome: {
      population: 0,
      food: 0,
      lumber: 1,
      ore: 0,
      gold: 0,
    }
  },
  30: {
    name: 'FISHING HUT',
    menu: [
      {
        name: 'CLEAR',
        index: 'CLEAR',
        submenu: null
      }
    ],
    icome: {
      population: 0,
      food: 0,
      lumber: 1,
      ore: 0,
      gold: 0,
    }
  },
  35: {
    name: 'LUMBER CAMP',
    menu: [
      {
        name: 'CLEAR',
        index: 'CLEAR',
        submenu: null
      }
    ],
    icome: {
      population: 0,
      food: 0,
      lumber: 1,
      ore: 0,
      gold: 0,
    }
  },
  33: {
    name: 'WORKSHOP',
    menu: [
      {
        name: 'CLEAR',
        index: 'CLEAR',
        submenu: null
      }
    ],
    icome: {
      population: 0,
      food: 0,
      lumber: 1,
      ore: 0,
      gold: 0,
    }
  },
  36: {
    name: 'ENEMY',
    menu: [
      {
        name: 'ATTACK',
        index: 'ATTACK',
        submenu: null
      }
    ],
    icome: {
      population: 0,
      food: 0,
      lumber: 1,
      ore: 0,
      gold: 0,
    }
  },
  34: {
    name: 'MARKET',
    menu: [
      {
        name: 'CLEAR',
        index: 'CLEAR',
        submenu: null
      }
    ],
    icome: {
      population: 0,
      food: 0,
      lumber: 1,
      ore: 0,
      gold: 0,
    }
  },
  12: {
    name: 'CASTLE',
    menu: [
      {
        name: 'CLEAR',
        index: 'CLEAR',
        submenu: null
      }
    ],
    icome: {
      population: 0,
      food: 0,
      lumber: 1,
      ore: 0,
      gold: 0,
    }
  },
  38: {
    name: 'GREEN HOUSE',
    menu: [
      {
        name: 'CLEAR',
        index: 'CLEAR',
        submenu: null
      }
    ],
    icome: {
      population: 0,
      food: 0,
      lumber: 1,
      ore: 0,
      gold: 0,
    }
  },
  39: {
    name: 'AQUADUCT',
    menu: [
      {
        name: 'CLEAR',
        index: 'CLEAR',
        submenu: null
      }
    ],
    icome: {
      population: 0,
      food: 0,
      lumber: 1,
      ore: 0,
      gold: 0,
    }
  }
}

//greenhouse increase food speed
//aquaduct increase pop speed


