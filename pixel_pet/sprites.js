// Sprite sheets and pixel art data for Antigravity Pet
// Represented as 16x16 grid strings.
// Legend:
// '.' = Transparent
// 'b' = Body color (customizable)
// 's' = Body shadow (customizable dark)
// 'w' = White (#ffffff)
// 'e' = Eye color (dark grey #2d3748)
// 'p' = Pink blush/ears (#ff8a9a)
// 'y' = Accent color (e.g., orange/yellow beak or collar #ff9f43)
// 'r' = Red collar/mouth (#ee5253)
// 'g' = Gold bell (#feca57)
// 'k' = Black outline (#1e272e)

const PALETTES = {
  cat: {
    b: '#ffb03a', // Orange cat
    s: '#d38416',
    w: '#ffffff',
    e: '#2d3748',
    p: '#ff8a9a',
    y: '#ffd700',
    r: '#ee5253',
    g: '#feca57',
    k: '#1e272e'
  },
  blackCat: {
    b: '#3d3d3d', // Dark grey/black cat
    s: '#242424',
    w: '#ffffff',
    e: '#ffd700', // Yellow eyes!
    p: '#ff8a9a',
    y: '#ff9f43',
    r: '#ee5253',
    g: '#feca57',
    k: '#111111'
  },
  slime: {
    b: '#00d2d3', // Cyan slime
    s: '#00a8a8',
    w: '#ffffff',
    e: '#1e272e',
    p: '#ff8a9a',
    y: '#ffd700',
    r: '#ee5253',
    g: '#feca57',
    k: '#0a3d62'
  },
  pinkSlime: {
    b: '#ff9ff3', // Pink slime
    s: '#f368e0',
    w: '#ffffff',
    e: '#1e272e',
    p: '#ff8a9a',
    y: '#ffd700',
    r: '#ff5252',
    g: '#ffd32a',
    k: '#5f27cd'
  },
  shiba: {
    b: '#e67e22', // Shiba brown
    s: '#d35400',
    w: '#f5f6fa',
    e: '#2c3e50',
    p: '#ff8a9a',
    y: '#ffd200',
    r: '#e74c3c',
    g: '#f1c40f',
    k: '#2c3e50'
  },
  ghost: {
    b: '#eceff1', // Ghost white
    s: '#cfd8dc',
    w: '#ffffff',
    e: '#37474f',
    p: '#ff8a9a',
    y: '#b0bec5',
    r: '#ff7675',
    g: '#ffeaa7',
    k: '#2d3436'
  }
};

const SPRITE_DATA = {
  cat: {
    idle: [
      [
        "....k......k....",
        "...kbk....kbk...",
        "..kbbk....kbbk..",
        ".kbbbbkkkkbbbbk.",
        ".kbbbbbbbbbbbbk.",
        ".kbewwbbbbwwbek.",
        ".kbbbbbbbbbbbbk.",
        ".kbbppbbbbppbbk.",
        "..kbbbbbbbbbbk..",
        "..kbbbbbbbbbbk..",
        "..kbbbbbbbbbbk..",
        ".kbbbbbbbbbbbbk.",
        "kbbkkbbbbbbkkbbk",
        "kbk..kbbbbk..kbk",
        "kk....kkkk....kk",
        "................"
      ],
      [
        "....k......k....",
        "...kbk....kbk...",
        "..kbbk....kbbk..",
        ".kbbbbkkkkbbbbk.",
        ".kbbbbbbbbbbbbk.",
        ".kbekkbbbbkkbek.", // blink!
        ".kbbbbbbbbbbbbk.",
        ".kbbppbbbbppbbk.",
        "..kbbbbbbbbbbk..",
        "..kbbbbbbbbbbk..",
        "..kbbbbbbbbbbk..",
        ".kbbbbbbbbbbbbk.",
        "kbbkkbbbbbbkkbbk",
        "kbk..kbbbbk..kbk",
        "kk....kkkk....kk",
        "................"
      ]
    ],
    walk: [
      [
        "....k......k....",
        "...kbk....kbk...",
        "..kbbk....kbbk..",
        ".kbbbbkkkkbbbbk.",
        ".kbbbbbbbbbbbbk.",
        ".kbewwbbbbwwbek.",
        ".kbbbbbbbbbbbbk.",
        ".kbbppbbbbppbbk.",
        "..kbbbbbbbbbbk..",
        "..kbbbbbbbbbbk..",
        "..kbbbbbbbbbbk..",
        ".kbbbbbbbbbbbbk.",
        "kbbkkbbbbbbkbbk.",
        ".kk..kbbbbkk.k..",
        "......kkkk......",
        "................"
      ],
      [
        "....k......k....",
        "...kbk....kbk...",
        "..kbbk....kbbk..",
        ".kbbbbkkkkbbbbk.",
        ".kbbbbbbbbbbbbk.",
        ".kbewwbbbbwwbek.",
        ".kbbbbbbbbbbbbk.",
        ".kbbppbbbbppbbk.",
        "..kbbbbbbbbbbk..",
        "..kbbbbbbbbbbk..",
        "..kbbbbbbbbbbk..",
        ".kbbbbbbbbbbbbk.",
        ".kbbkbbbbbbkkbbk",
        "..k.kkbbbbk..kk.",
        "......kkkk......",
        "................"
      ]
    ],
    sleep: [
      [
        "................",
        "................",
        "................",
        "................",
        ".....k......k...",
        "....kbk....kbk..",
        "...kbbkkkkkbbk..",
        "..kbbbbbbbbbbk..",
        "..kbkkbbbbkkbk..", // eyes closed
        "..kbbbbbbbbbbk..",
        "..kbbppbbppbbk..",
        "...kbbbbbbbbk...",
        "....kbbbbbbk....",
        "...kbbbbbbbbk...",
        "..kkkkkkkkkkkk..",
        "................"
      ],
      [
        "................",
        "................",
        "................",
        "................",
        "................",
        ".....k......k...",
        "....kbk....kbk..",
        "...kbbkkkkkbbk..",
        "..kbbbbbbbbbbk..",
        "..kbkkbbbbkkbk..", // breathing slightly squashed
        "..kbbppbbppbbk..",
        "...kbbbbbbbbk...",
        "....kbbbbbbk....",
        "...kkkkkkkkkk...",
        "................",
        "................"
      ]
    ],
    eat: [
      [
        "....k......k....",
        "...kbk....kbk...",
        "..kbbk....kbbk..",
        ".kbbbbkkkkbbbbk.",
        ".kbbbbbbbbbbbbk.",
        ".kbewwbbbbwwbek.",
        ".kbbbbbbbbbbbbk.",
        ".kbbppkrkppbbk..", // mouth open (r)
        "..kbbbbbbbbbbk..",
        "..kbbbbbbbbbbk..",
        "..kbbbbbbbbbbk..",
        ".kbbbbbbbbbbbbk.",
        "kbbkkbbbbbbkkbbk",
        "kbk..kbbbbk..kbk",
        "kk....kkkk....kk",
        "................"
      ],
      [
        "....k......k....",
        "...kbk....kbk...",
        "..kbbk....kbbk..",
        ".kbbbbkkkkbbbbk.",
        ".kbbbbbbbbbbbbk.",
        ".kbewwbbbbwwbek.",
        ".kbbbbbbbbbbbbk.",
        ".kbbppkkkppbbk..", // mouth closed
        "..kbbbbbbbbbbk..",
        "..kbbbbbbbbbbk..",
        "..kbbbbbbbbbbk..",
        ".kbbbbbbbbbbbbk.",
        "kbbkkbbbbbbkkbbk",
        "kbk..kbbbbk..kbk",
        "kk....kkkk....kk",
        "................"
      ]
    ],
    drag: [
      [
        "....k......k....",
        "...kbk....kbk...",
        "..kbbk....kbbk..",
        ".kbbbbkkkkbbbbk.",
        ".kbbbbbbbbbbbbk.",
        ".kbexkbbbbkxebk.", // dizzy eyes (x)
        ".kbbbbbbbbbbbbk.",
        ".kbbppbbbbppbbk.",
        "..kbbbbbbbbbbk..",
        "..kbbbbbbbbbbk..",
        "..kbbbbbbbbbbk..",
        ".kbbbbbbbbbbbbk.",
        ".kbbkbbbbbbkbbk.",
        "kbbk.kkbbkk.kbbk", // flying paws
        "kkk........kkkk."
      ]
    ],
    happy: [
      [
        "....k......k....",
        "...kbk....kbk...",
        "..kbbk....kbbk..",
        ".kbbbbkkkkbbbbk.",
        ".kbbbbbbbbbbbbk.",
        ".kbbwwbbbbwwbbk.", // squinting happy eyes
        ".kbpwbpbbpbpwbk.", // happy face
        ".kbppbbbbppbbk..",
        "..kbbbbbbbbbbk..",
        "..kbbbbbbbbbbk..",
        "..kbbbbbbbbbbk..",
        ".kbbbbbbbbbbbbk.",
        "kbbkkbbbbbbkkbbk",
        "kbk..kbbbbk..kbk",
        "kk....kkkk....kk",
        "................"
      ]
    ]
  },
  slime: {
    idle: [
      [
        "................",
        "................",
        "......kkkk......",
        "....kkbbbbkk....",
        "...kbbbbbbbbk...",
        "..kbbbbbbbbbbk..",
        "..kbbbbbbbbbbk..",
        ".kbbewwbbwwebbk.",
        ".kbbbbbbbbbbbbk.",
        ".kbbppbbbbppbbk.",
        ".kbbbbbbbbbbbbk.",
        ".kbbbbbbbbbbbbk.",
        "..kbbbbbbbbbbk..",
        "..kkbbbbbbbbkk..",
        "...kkkkkkkkkk...",
        "................"
      ],
      [
        "................",
        "................",
        "................",
        "......kkkk......",
        "....kkbbbbkk....",
        "...kbbbbbbbbk...",
        "..kbbbbbbbbbbk..",
        "..kbbewwbbwwebk.", // slightly squashed frame
        "..kbbbbbbbbbbk..",
        "..kbbppbbppbbk..",
        "..kbbbbbbbbbbk..",
        "..kbbbbbbbbbbk..",
        "...kbbbbbbbbk...",
        "...kkbbbbbbkk...",
        "....kkkkkkkk....",
        "................"
      ]
    ],
    walk: [
      [
        "................",
        "................",
        "......kkkk......",
        "....kkbbbbkk....",
        "...kbbbbbbbbk...",
        "..kbbbbbbbbbbk..",
        "..kbbbbbbbbbbk..",
        ".kbbewwbbwwebbk.",
        ".kbbbbbbbbbbbbk.",
        ".kbbppbbbbppbbk.",
        ".kbbbbbbbbbbbbk.",
        "kbbbbbbbbbbbbbbk",
        "kbbbbbbbbbbbbbbk",
        "kkbbbbbbbbbbbbkk",
        ".kkkkkkkkkkkkkk.",
        "................"
      ],
      [
        "................",
        "................",
        "................",
        ".......kkk......",
        ".....kkbbk......",
        "....kbbbbbk.....",
        "...kbbbbbbbk....",
        "..kbbewwbbwwk...", // leaning forward
        "..kbbbbbbbbk....",
        "..kbbppbbppk....",
        "..kbbbbbbbbk....",
        ".kbbbbbbbbbbk...",
        "kbbbbbbbbbbbbk..",
        "kkbbbbbbbbbbkk..",
        ".kkkkkkkkkkkk...",
        "................"
      ]
    ],
    sleep: [
      [
        "................",
        "................",
        "................",
        "................",
        "................",
        "......kkkk......",
        "....kkbbbbkk....",
        "...kbbbbbbbbk...",
        "..kbbbbbbbbbbk..",
        "..kbkkbbbbkkbk..", // closed eyes
        "..kbbppbbppbbk..",
        "..kbbbbbbbbbbk..",
        "...kbbbbbbbbk...",
        "...kkbbbbbbkk...",
        "....kkkkkkkk....",
        "................"
      ],
      [
        "................",
        "................",
        "................",
        "................",
        "................",
        "................",
        "......kkkk......",
        "....kkbbbbkk....",
        "...kbbbbbbbbk...",
        "..kbkkbbbbkkbk..", // flattened sleep
        "..kbbppbbppbbk..",
        "...kbbbbbbbbk...",
        "....kbbbbbbk....",
        "....kkbbbbkk....",
        ".....kkkkkk.....",
        "................"
      ]
    ],
    eat: [
      [
        "................",
        "......kkkk......",
        "....kkbbbbkk....",
        "...kbbbbbbbbk...",
        "..kbbbbbbbbbbk..",
        "..kbbbbbbbbbbk..",
        ".kbbewwbbwwebbk.",
        ".kbbbbbbbbbbbbk.",
        ".kbbppkrkppbk.", // open mouth
        ".kbbbbbbbbbbbbk.",
        ".kbbbbbbbbbbbbk.",
        "..kbbbbbbbbbbk..",
        "..kkbbbbbbbbkk..",
        "...kkkkkkkkkk...",
        "................",
        "................"
      ],
      [
        "................",
        "................",
        "......kkkk......",
        "....kkbbbbkk....",
        "...kbbbbbbbbk...",
        "..kbbbbbbbbbbk..",
        "..kbbewwbbwwebk.",
        "..kbbbbbbbbbbk..",
        "..kbbppkkkppbbk..", // closed mouth
        "..kbbbbbbbbbbk..",
        "..kbbbbbbbbbbk..",
        "...kbbbbbbbbk...",
        "...kkbbbbbbkk...",
        "....kkkkkkkk....",
        "................"
      ]
    ],
    drag: [
      [
        "......kkkk......",
        "....kkbbbbkk....",
        "...kbbbbbbbbk...",
        "..kbbbbbbbbbbk..",
        "..kbbbbbbbbbbk..",
        "..kbbexkbbkxebk.", // dizzy eyes
        "..kbbbbbbbbbbk..",
        "..kbbppbbppbbk..",
        "..kbbbbbbbbbbk..",
        "..kbbbbbbbbbbk..",
        "...kbbbbbbbbk...",
        "...kbbbbbbbbk...",
        "...kbbbbbbbbk...", // elongated drag shape
        "....kbbbbbbk....",
        "....kkbbbbkk....",
        ".....kkkkkk....."
      ]
    ],
    happy: [
      [
        "................",
        "......kkkk......",
        "....kkbbbbkk....",
        "...kbbbbbbbbk...",
        "..kbbbbbbbbbbk..",
        "..kbbwwbbwwbbk..", // happy squint
        "..kbpwbpbpbpwbk.",
        "..kbbppbbppbbk..",
        "..kbbbbbbbbbbk..",
        "..kbbbbbbbbbbk..",
        "..kbbbbbbbbbbk..",
        "..kbbbbbbbbbbk..",
        "...kbbbbbbbbk...",
        "...kkbbbbbbkk...",
        "....kkkkkkkk....",
        "................"
      ]
    ]
  },
  shiba: {
    idle: [
      [
        "...kk......kk...",
        "..kbkk....kkbk..",
        ".kbbbbkkkkbbbbk.",
        ".kbbbbbbbbbbbbk.",
        ".kbewwbbbbwwbek.",
        "kbbwbbbbbbbbwbk.", // white cheeks
        "kbbwppbbbbppwbk.",
        "kbbwwbbbbbbwwbk.",
        ".kbbwwyryywwbk..", // snout and nose
        "..kbbbbbbbbk....",
        "...kbbbbbbk.....",
        "..kbbbbbbbbk....",
        ".kbbkkbbbbkkbk..",
        "kbk..kbbbbk.kbk.",
        "kk....kkkk...kk.",
        "................"
      ],
      [
        "...kk......kk...",
        "..kbkk....kkbk..",
        ".kbbbbkkkkbbbbk.",
        ".kbbbbbbbbbbbbk.",
        ".kbekkbbbbkkbek.", // blink
        "kbbwbbbbbbbbwbk.",
        "kbbwppbbbbppwbk.",
        "kbbwwbbbbbbwwbk.",
        ".kbbwwyryywwbk..",
        "..kbbbbbbbbk....",
        "...kbbbbbbk.....",
        "..kbbbbbbbbk....",
        ".kbbkkbbbbkkbk..",
        "kbk..kbbbbk.kbk.",
        "kk....kkkk...kk.",
        "................"
      ]
    ],
    walk: [
      [
        "...kk......kk...",
        "..kbkk....kkbk..",
        ".kbbbbkkkkbbbbk.",
        ".kbbbbbbbbbbbbk.",
        ".kbewwbbbbwwbek.",
        "kbbwbbbbbbbbwbk.",
        "kbbwppbbbbppwbk.",
        "kbbwwbbbbbbwwbk.",
        ".kbbwwyryywwbk..",
        "..kbbbbbbbbk....",
        "...kbbbbbbk.....",
        "..kbbbbbbbbk....",
        ".kbbkbbbbkbbk...",
        "kbk..kkbkk.kbk..",
        "kk....kkk...kk..",
        "................"
      ],
      [
        "...kk......kk...",
        "..kbkk....kkbk..",
        ".kbbbbkkkkbbbbk.",
        ".kbbbbbbbbbbbbk.",
        ".kbewwbbbbwwbek.",
        "kbbwbbbbbbbbwbk.",
        "kbbwppbbbbppwbk.",
        "kbbwwbbbbbbwwbk.",
        ".kbbwwyryywwbk..",
        "..kbbbbbbbbk....",
        "...kbbbbbbk.....",
        "..kbbbbbbbbk....",
        "...kbbkbbbbkkbk.",
        "...kbk.kkbbk.kbk",
        "....kk...kkk..kk",
        "................"
      ]
    ],
    sleep: [
      [
        "................",
        "................",
        "......kk.....kk.",
        ".....kbkk...kbk.",
        "....kbbbbkkkbbk.",
        "...kbbbbbbbbbbk.",
        "...kbkkbbbbkkbk.", // eyes closed
        "..kbbwbbbbbbwbk.",
        "..kbbwppbbppwbk.",
        "..kbbwwyryywwbk.",
        "...kbbbbbbbbk...",
        "....kbbbbbbk....",
        "....kbbbbbbbk...",
        "...kkkkkkkkkkk..",
        "................",
        "................"
      ],
      [
        "................",
        "................",
        "................",
        "......kk.....kk.",
        ".....kbkk...kbk.",
        "....kbbbbkkkbbk.",
        "...kbbbbbbbbbbk.",
        "...kbkkbbbbkkbk.", // eyes closed & squished
        "..kbbwbbbbbbwbk.",
        "..kbbwppbbppwbk.",
        "..kbbwwyryywwbk.",
        "...kbbbbbbbbk...",
        "....kbbbbbbk....",
        "....kkkkkkkkk...",
        "................",
        "................"
      ]
    ],
    eat: [
      [
        "...kk......kk...",
        "..kbkk....kkbk..",
        ".kbbbbkkkkbbbbk.",
        ".kbbbbbbbbbbbbk.",
        ".kbewwbbbbwwbek.",
        "kbbwbbbbbbbbwbk.",
        "kbbwppbbbbppwbk.",
        "kbbwwbbbbbbwwbk.",
        ".kbbwwyrrywwbk..", // chewing
        "..kbbbbbbbbk....",
        "...kbbbbbbk.....",
        "..kbbbbbbbbk....",
        ".kbbkkbbbbkkbk..",
        "kbk..kbbbbk.kbk.",
        "kk....kkkk...kk.",
        "................"
      ],
      [
        "...kk......kk...",
        "..kbkk....kkbk..",
        ".kbbbbkkkkbbbbk.",
        ".kbbbbbbbbbbbbk.",
        ".kbewwbbbbwwbek.",
        "kbbwbbbbbbbbwbk.",
        "kbbwppbbbbppwbk.",
        "kbbwwbbbbbbwwbk.",
        ".kbbwwykkwwbk..", // chewing frame 2
        "..kbbbbbbbbk....",
        "...kbbbbbbk.....",
        "..kbbbbbbbbk....",
        ".kbbkkbbbbkkbk..",
        "kbk..kbbbbk.kbk.",
        "kk....kkkk...kk.",
        "................"
      ]
    ],
    drag: [
      [
        "...kk......kk...",
        "..kbkk....kkbk..",
        ".kbbbbkkkkbbbbk.",
        ".kbbbbbbbbbbbbk.",
        ".kbexkbbbbkxebk.", // dizzy eyes
        "kbbwbbbbbbbbwbk.",
        "kbbwppbbbbppwbk.",
        "kbbwwbbbbbbwwbk.",
        ".kbbwwyryywwbk..",
        "..kbbbbbbbbk....",
        "...kbbbbbbk.....",
        "..kbbbbbbbbk....",
        "..kbbkbbbbkbbk..",
        "kbk.kkbbbbkk.kbk", // dangling paws
        "kkk..........kkk"
      ]
    ],
    happy: [
      [
        "...kk......kk...",
        "..kbkk....kkbk..",
        ".kbbbbkkkkbbbbk.",
        ".kbbbbbbbbbbbbk.",
        ".kbbwwbbbbwwbbk.", // squinting eyes
        "kbpwbpbbbbpbpwbk.",
        "kbppbbbbbbppwbk.",
        "kbbwwbbbbbbwwbk.",
        ".kbbwwyrrywwbk..", // happy mouth/tongue out
        "..kbbbbbbbbk....",
        "...kbbbbbbk.....",
        "..kbbbbbbbbk....",
        ".kbbkkbbbbkkbk..",
        "kbk..kbbbbk.kbk.",
        "kk....kkkk...kk.",
        "................"
      ]
    ]
  },
  ghost: {
    idle: [
      [
        "......kkkk......",
        "....kkbbbbkk....",
        "...kbbbbbbbbk...",
        "..kbbbbbbbbbbk..",
        "..kbewwbbwwebk..",
        "..kbbbbbbbbbbk..",
        "..kbbppbbppbbk..",
        "..kbbbbbbbbbbk..",
        "..kbbbbbbbbbbk..",
        "..kbbbbbbbbbbk..",
        "..kbbbbbbbbbbk..",
        "..kbbbbbbbbbbk..",
        "...kbbbbbbbbk...",
        "...kbbkbbkbbk...", // wavy bottom tail
        "....kk.kk.kk....",
        "................"
      ],
      [
        "......kkkk......",
        "....kkbbbbkk....",
        "...kbbbbbbbbk...",
        "..kbbbbbbbbbbk..",
        "..kbbkkbbkkbbk..", // blink!
        "..kbbbbbbbbbbk..",
        "..kbbppbbppbbk..",
        "..kbbbbbbbbbbk..",
        "..kbbbbbbbbbbk..",
        "..kbbbbbbbbbbk..",
        "..kbbbbbbbbbbk..",
        "..kbbbbbbbbbbk..",
        "...kbbbbbbbbk...",
        "....kbbbbbbk....", // slightly different bottom
        "....kkbbbbkk....",
        ".....kkkkkk....."
      ]
    ],
    walk: [
      [
        "......kkkk......",
        "....kkbbbbkk....",
        "...kbbbbbbbbk...",
        "..kbbbbbbbbbbk..",
        "..kbewwbbwwebk..",
        "..kbbbbbbbbbbk..",
        "..kbbppbbppbbk..",
        "..kbbbbbbbbbbk..",
        "..kbbbbbbbbbbk..",
        "..kbbbbbbbbbbk..",
        "..kbbbbbbbbbbk..",
        "...kbbbbbbbbk...",
        "....kbbbbbbbk...", // floating tail right
        ".....kkbkkbk....",
        "......kk.kk.....",
        "................"
      ],
      [
        "......kkkk......",
        "....kkbbbbkk....",
        "...kbbbbbbbbk...",
        "..kbbbbbbbbbbk..",
        "..kbewwbbwwebk..",
        "..kbbbbbbbbbbk..",
        "..kbbppbbppbbk..",
        "..kbbbbbbbbbbk..",
        "..kbbbbbbbbbbk..",
        "..kbbbbbbbbbbk..",
        "..kbbbbbbbbbbk..",
        "...kbbbbbbbbk...",
        "...kbbbbbbbk....", // floating tail left
        "....kbkkbkk.....",
        ".....kk.kk......",
        "................"
      ]
    ],
    sleep: [
      [
        "......kkkk......",
        "....kkbbbbkk....",
        "...kbbbbbbbbk...",
        "..kbkkbbbbkkbk..", // closed eyes sleep
        "..kbbbbbbbbbbk..",
        "..kbbppbbppbbk..",
        "..kbbbbbbbbbbk..",
        "..kbbbbbbbbbbk..",
        "..kbbbbbbbbbbk..",
        "..kbbbbbbbbbbk..",
        "...kbbbbbbbbk...",
        "....kbbbbbbk....",
        ".....kkkkkk.....",
        "................",
        "................",
        "................"
      ],
      [
        "......kkkk......",
        "....kkbbbbkk....",
        "...kbkkbbkkbbk..", // squinting sleep
        "..kbbbbbbbbbbk..",
        "..kbbppbbppbbk..",
        "..kbbbbbbbbbbk..",
        "..kbbbbbbbbbbk..",
        "..kbbbbbbbbbbk..",
        "..kbbbbbbbbbbk..",
        "...kbbbbbbbbk...",
        "....kbbbbbbk....",
        ".....kkkkkk.....",
        "................",
        "................",
        "................",
        "................"
      ]
    ],
    eat: [
      [
        "......kkkk......",
        "....kkbbbbkk....",
        "...kbbbbbbbbk...",
        "..kbbbbbbbbbbk..",
        "..kbewwbbwwebk..",
        "..kbbbbbbbbbbk..",
        "..kbbppkrkppbk..", // eating mouth
        "..kbbbbbbbbbbk..",
        "..kbbbbbbbbbbk..",
        "..kbbbbbbbbbbk..",
        "..kbbbbbbbbbbk..",
        "...kbbbbbbbbk...",
        "...kbbkbbkbbk...",
        "....kk.kk.kk....",
        "................",
        "................"
      ],
      [
        "......kkkk......",
        "....kkbbbbkk....",
        "...kbbbbbbbbk...",
        "..kbbbbbbbbbbk..",
        "..kbewwbbwwebk..",
        "..kbbbbbbbbbbk..",
        "..kbbppkkkppbk..", // mouth closed
        "..kbbbbbbbbbbk..",
        "..kbbbbbbbbbbk..",
        "..kbbbbbbbbbbk..",
        "..kbbbbbbbbbbk..",
        "...kbbbbbbbbk...",
        "...kbbkbbkbbk...",
        "....kk.kk.kk....",
        "................",
        "................"
      ]
    ],
    drag: [
      [
        "......kkkk......",
        "....kkbbbbkk....",
        "...kbbbbbbbbk...",
        "..kbbbbbbbbbbk..",
        "..kbexkbbkxebk..", // dizzy
        "..kbbbbbbbbbbk..",
        "..kbbppbbppbbk..",
        "..kbbbbbbbbbbk..",
        "..kbbbbbbbbbbk..",
        "..kbbbbbbbbbbk..",
        "..kbbbbbbbbbbk..",
        "...kbbbbbbbbk...",
        "....kbbbbbbbk...", // stretched floating tail
        "....kbbbbbbbk...",
        ".....kkkkkkk....",
        "................"
      ]
    ],
    happy: [
      [
        "......kkkk......",
        "....kkbbbbkk....",
        "...kbbbbbbbbk...",
        "..kbbbbbbbbbbk..",
        "..kbbwwbbwwbbk..", // happy squint
        "..kbpwbpbpbpwbk..",
        "..kbbppbbppbbk..",
        "..kbbbbbbbbbbk..",
        "..kbbbbbbbbbbk..",
        "..kbbbbbbbbbbk..",
        "..kbbbbbbbbbbk..",
        "...kbbbbbbbbk...",
        "...kbbkbbkbbk...",
        "....kk.kk.kk....",
        "................",
        "................"
      ]
    ]
  }
};

const ACCESSORIES = {
  crown: [
    "................",
    "....gyg.gyg.....", // gold & yellow points
    "....ggggggg.....",
    "....ggggggg.....",
    ".....kkkkk......",
    "................",
    "................",
    "................",
    "................",
    "................",
    "................",
    "................",
    "................",
    "................",
    "................",
    "................"
  ],
  wizardHat: [
    ".......kk.......",
    "......kbbk......", // purple hat
    ".....kbbbbk.....",
    ".....kbggbk.....", // yellow stars/stripes
    "....kbbbbbbk....",
    "....kbbbbbbk....",
    "...kbbbbbbbbk...",
    "..kkkkkkkkkkkk..",
    "................",
    "................",
    "................",
    "................",
    "................",
    "................",
    "................",
    "................"
  ],
  chefHat: [
    "......wwww......",
    "....wwwwwwww....",
    "....wwwwwwww....",
    ".....wwwwww.....",
    ".....kkkkkk.....",
    "................",
    "................",
    "................",
    "................",
    "................",
    "................",
    "................",
    "................",
    "................",
    "................",
    "................"
  ],
  bow: [
    "................",
    "....rr...rr.....", // Red bow
    "....rrrrrrr.....",
    ".....rrrrr......",
    "......rrr.......",
    "................",
    "................",
    "................",
    "................",
    "................",
    "................",
    "................",
    "................",
    "................",
    "................",
    "................"
  ],
  glasses: [
    "................",
    "................",
    "................",
    "................",
    "....kkkk.kkkk...", // black glasses
    "....k..k.k..k...",
    "....kkkkkkkkk...",
    "................",
    "................",
    "................",
    "................",
    "................",
    "................",
    "................",
    "................",
    "................"
  ]
};

// Fixed accessory palettes
const ACCESSORY_PALETTES = {
  crown: {
    g: '#ffd32a', // Gold
    y: '#ffc048', // Darker gold
    k: '#1e272e'
  },
  wizardHat: {
    b: '#5f27cd', // Dark purple
    g: '#ffd32a', // Star gold
    k: '#1e272e'
  },
  chefHat: {
    w: '#f5f6fa', // White puff
    k: '#7f8c8d'  // Grey band
  },
  bow: {
    r: '#ee5253', // Red bow
    k: '#1e272e'
  },
  glasses: {
    k: '#1e272e'  // Black frames
  }
};

/**
 * Draws a 16x16 pixel art sprite onto a canvas context.
 */
function drawPixelSprite(ctx, spriteMatrix, x, y, scale = 4, flipX = false, paletteOverride = {}, accessory = null, accessoryOffset = {x: 0, y: 0}) {
  const size = 16;
  ctx.save();

  // If flipped, mirror the context at the target center
  if (flipX) {
    ctx.translate(x + (size * scale) / 2, y + (size * scale) / 2);
    ctx.scale(-1, 1);
    ctx.translate(-(x + (size * scale) / 2), -(y + (size * scale) / 2));
  }

  // Draw main pet sprite
  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      const char = spriteMatrix[row][col];
      if (char === '.') continue; // transparent

      const color = paletteOverride[char] || '#000000';
      ctx.fillStyle = color;
      ctx.fillRect(x + col * scale, y + row * scale, scale, scale);
    }
  }

  // Draw accessory on top if provided
  if (accessory && ACCESSORIES[accessory]) {
    const accMatrix = ACCESSORIES[accessory];
    const accPalette = ACCESSORY_PALETTES[accessory];
    const dx = x + accessoryOffset.x * scale;
    const dy = y + accessoryOffset.y * scale;

    for (let row = 0; row < size; row++) {
      for (let col = 0; col < size; col++) {
        const char = accMatrix[row][col];
        if (char === '.') continue;

        const color = accPalette[char] || '#000000';
        ctx.fillStyle = color;
        ctx.fillRect(dx + col * scale, dy + row * scale, scale, scale);
      }
    }
  }

  ctx.restore();
}

/**
 * Get sprite matrix for a pet type, action, and animation frame
 */
function getPetSprite(type, action, frame) {
  const pet = SPRITE_DATA[type] || SPRITE_DATA['cat'];
  const anim = pet[action] || pet['idle'];
  const index = frame % anim.length;
  return anim[index];
}
