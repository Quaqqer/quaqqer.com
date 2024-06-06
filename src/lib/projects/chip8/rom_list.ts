export type Rom = { name: string; url: string };

const ENABLE_TEST_ROMS = true;

const TEST_ROMS: Rom[] = [
  {
    url: "https://raw.githubusercontent.com/Timendus/chip8-test-suite/main/bin/1-chip8-logo.ch8",
    name: "Test 1 - Chip8 Logo",
  },
  {
    url: "https://raw.githubusercontent.com/Timendus/chip8-test-suite/main/bin/2-ibm-logo.ch8",
    name: "Test 2 - IBM Logo",
  },
  {
    url: "https://raw.githubusercontent.com/Timendus/chip8-test-suite/main/bin/3-corax+.ch8",
    name: "Test 3 - Corax+",
  },
  {
    url: "https://raw.githubusercontent.com/Timendus/chip8-test-suite/main/bin/4-flags.ch8",
    name: "Test 4 - Flags",
  },
  {
    url: "https://raw.githubusercontent.com/Timendus/chip8-test-suite/main/bin/5-quirks.ch8",
    name: "Test 5 - Quirks",
  },
  {
    url: "https://raw.githubusercontent.com/Timendus/chip8-test-suite/main/bin/6-keypad.ch8",
    name: "Test 6 - Keypad",
  },
  {
    url: "https://raw.githubusercontent.com/Timendus/chip8-test-suite/main/bin/7-beep.ch8",
    name: "Test 7 - Beep",
  },
  {
    url: "https://raw.githubusercontent.com/Timendus/chip8-test-suite/main/bin/8-scrolling.ch8",
    name: "Test 8 - Scrolling",
  },
];

export const roms: Rom[] = new Array<Rom>().concat(
  [
    {
      url: "https://raw.githubusercontent.com/kripod/chip8-roms/master/games/15 Puzzle [Roger Ivie].ch8",
      name: "15 Puzzle",
    },
    {
      url: "https://raw.githubusercontent.com/kripod/chip8-roms/master/games/Addition Problems [Paul C. Moews].ch8",
      name: "Addition Problems",
    },
    {
      url: "https://raw.githubusercontent.com/kripod/chip8-roms/master/games/Airplane.ch8",
      name: "Airplane",
    },
    {
      url: "https://raw.githubusercontent.com/kripod/chip8-roms/master/games/Animal Race [Brian Astle].ch8",
      name: "Animal Race",
    },
    {
      url: "https://raw.githubusercontent.com/kripod/chip8-roms/master/games/Astro Dodge [Revival Studios, 2008].ch8",
      name: "Astro Dodge",
    },
    {
      url: "https://raw.githubusercontent.com/kripod/chip8-roms/master/games/Biorhythm [Jef Winsor].ch8",
      name: "Biorhythm",
    },
    {
      url: "https://raw.githubusercontent.com/kripod/chip8-roms/master/games/Blinky [Hans Christian Egeberg, 1991].ch8",
      name: "Blinky",
    },
    {
      url: "https://raw.githubusercontent.com/kripod/chip8-roms/master/games/Blitz [David Winter].ch8",
      name: "Blitz",
    },
    {
      url: "https://raw.githubusercontent.com/kripod/chip8-roms/master/games/Bowling [Gooitzen van der Wal].ch8",
      name: "Bowling",
    },
    {
      url: "https://raw.githubusercontent.com/kripod/chip8-roms/master/games/Breakout [Carmelo Cortez, 1979].ch8",
      name: "Breakout",
    },
    {
      url: "https://raw.githubusercontent.com/kripod/chip8-roms/master/games/Brick (Brix hack, 1990).ch8",
      name: "Brick",
    },
    {
      url: "https://raw.githubusercontent.com/kripod/chip8-roms/master/games/Brix [Andreas Gustafsson, 1990].ch8",
      name: "Brix",
    },
    {
      url: "https://raw.githubusercontent.com/kripod/chip8-roms/master/games/Cave.ch8",
      name: "Cave",
    },
    {
      url: "https://raw.githubusercontent.com/kripod/chip8-roms/master/games/Coin Flipping [Carmelo Cortez, 1978].ch8",
      name: "Coin Flipping",
    },
    {
      url: "https://raw.githubusercontent.com/kripod/chip8-roms/master/games/Connect 4 [David Winter].ch8",
      name: "Connect 4",
    },
    {
      url: "https://raw.githubusercontent.com/kripod/chip8-roms/master/games/Craps [Camerlo Cortez, 1978].ch8",
      name: "Craps",
    },
    {
      url: "https://raw.githubusercontent.com/kripod/chip8-roms/master/games/Deflection [John Fort].ch8",
      name: "Deflection",
    },
    {
      url: "https://raw.githubusercontent.com/kripod/chip8-roms/master/games/Figures.ch8",
      name: "Figures",
    },
    {
      url: "https://raw.githubusercontent.com/kripod/chip8-roms/master/games/Filter.ch8",
      name: "Filter",
    },
    {
      url: "https://raw.githubusercontent.com/kripod/chip8-roms/master/games/Guess [David Winter].ch8",
      name: "Guess",
    },
    {
      url: "https://raw.githubusercontent.com/kripod/chip8-roms/master/games/Hidden [David Winter, 1996].ch8",
      name: "Hidden",
    },
    {
      url: "https://raw.githubusercontent.com/kripod/chip8-roms/master/games/Hi-Lo [Jef Winsor, 1978].ch8",
      name: "Hi-Lo",
    },
    {
      url: "https://raw.githubusercontent.com/kripod/chip8-roms/master/games/Kaleidoscope [Joseph Weisbecker, 1978].ch8",
      name: "Kaleidoscope",
    },
    {
      url: "https://raw.githubusercontent.com/kripod/chip8-roms/master/games/Landing.ch8",
      name: "Landing",
    },
    {
      url: "https://raw.githubusercontent.com/kripod/chip8-roms/master/games/Lunar Lander (Udo Pernisz, 1979).ch8",
      name: "Lunar Lander",
    },
    {
      url: "https://raw.githubusercontent.com/kripod/chip8-roms/master/games/Mastermind FourRow (Robert Lindley, 1978).ch8",
      name: "Mastermind FourRow",
    },
    {
      url: "https://raw.githubusercontent.com/kripod/chip8-roms/master/games/Merlin [David Winter].ch8",
      name: "Merlin",
    },
    {
      url: "https://raw.githubusercontent.com/kripod/chip8-roms/master/games/Missile [David Winter].ch8",
      name: "Missile",
    },
    {
      url: "https://raw.githubusercontent.com/kripod/chip8-roms/master/games/Most Dangerous Game [Peter Maruhnic].ch8",
      name: "Most Dangerous Game",
    },
    {
      url: "https://raw.githubusercontent.com/kripod/chip8-roms/master/games/Nim [Carmelo Cortez, 1978].ch8",
      name: "Nim",
    },
    {
      url: "https://raw.githubusercontent.com/kripod/chip8-roms/master/games/Paddles.ch8",
      name: "Paddles",
    },
    {
      url: "https://raw.githubusercontent.com/kripod/chip8-roms/master/games/Pong (1 player).ch8",
      name: "Pong",
    },
    {
      url: "https://raw.githubusercontent.com/kripod/chip8-roms/master/games/Pong [Paul Vervalin, 1990].ch8",
      name: "Pong (Paul)",
    },
    {
      url: "https://raw.githubusercontent.com/kripod/chip8-roms/master/games/Programmable Spacefighters [Jef Winsor].ch8",
      name: "Programmable Spacefighters",
    },
    {
      url: "https://raw.githubusercontent.com/kripod/chip8-roms/master/games/Puzzle.ch8",
      name: "Puzzle",
    },
    {
      url: "https://raw.githubusercontent.com/kripod/chip8-roms/master/games/Rocket [Joseph Weisbecker, 1978].ch8",
      name: "Rocket",
    },
    {
      url: "https://raw.githubusercontent.com/kripod/chip8-roms/master/games/Rocket Launcher.ch8",
      name: "Rocket Launcher",
    },
    {
      url: "https://raw.githubusercontent.com/kripod/chip8-roms/master/games/Rocket Launch [Jonas Lindstedt].ch8",
      name: "Rocket Launch",
    },
    {
      url: "https://raw.githubusercontent.com/kripod/chip8-roms/master/games/Rush Hour [Hap, 2006].ch8",
      name: "Rush Hour",
    },
    {
      url: "https://raw.githubusercontent.com/kripod/chip8-roms/master/games/Russian Roulette [Carmelo Cortez, 1978].ch8",
      name: "Russian Roulette",
    },
    {
      url: "https://raw.githubusercontent.com/kripod/chip8-roms/master/games/Sequence Shoot [Joyce Weisbecker].ch8",
      name: "Sequence Shoot",
    },
    {
      url: "https://raw.githubusercontent.com/kripod/chip8-roms/master/games/Slide [Joyce Weisbecker].ch8",
      name: "Slide",
    },
    {
      url: "https://raw.githubusercontent.com/kripod/chip8-roms/master/games/Soccer.ch8",
      name: "Soccer",
    },
    {
      url: "https://raw.githubusercontent.com/kripod/chip8-roms/master/games/Space Flight.ch8",
      name: "Space Flight",
    },
    {
      url: "https://raw.githubusercontent.com/kripod/chip8-roms/master/games/Space Intercept [Joseph Weisbecker, 1978].ch8",
      name: "Space Intercept",
    },
    {
      url: "https://raw.githubusercontent.com/kripod/chip8-roms/master/games/Space Invaders [David Winter].ch8",
      name: "Space Invaders",
    },
    {
      url: "https://raw.githubusercontent.com/kripod/chip8-roms/master/games/Spooky Spot [Joseph Weisbecker, 1978].ch8",
      name: "Spooky Spot",
    },
    {
      url: "https://raw.githubusercontent.com/kripod/chip8-roms/master/games/Squash [David Winter].ch8",
      name: "Squash",
    },
    {
      url: "https://raw.githubusercontent.com/kripod/chip8-roms/master/games/Submarine [Carmelo Cortez, 1978].ch8",
      name: "Submarine",
    },
    {
      url: "https://raw.githubusercontent.com/kripod/chip8-roms/master/games/Sum Fun [Joyce Weisbecker].ch8",
      name: "Sum Fun",
    },
    {
      url: "https://raw.githubusercontent.com/kripod/chip8-roms/master/games/Syzygy [Roy Trevino, 1990].ch8",
      name: "Syzygy",
    },
    {
      url: "https://raw.githubusercontent.com/kripod/chip8-roms/master/games/Tank.ch8",
      name: "Tank",
    },
    {
      url: "https://raw.githubusercontent.com/kripod/chip8-roms/master/games/Tapeworm [JDR, 1999].ch8",
      name: "Tapeworm",
    },
    {
      url: "https://raw.githubusercontent.com/kripod/chip8-roms/master/games/Tetris [Fran Dachille, 1991].ch8",
      name: "Tetris",
    },
    {
      url: "https://raw.githubusercontent.com/kripod/chip8-roms/master/games/Tic-Tac-Toe [David Winter].ch8",
      name: "Tic-Tac-Toe",
    },
    {
      url: "https://raw.githubusercontent.com/kripod/chip8-roms/master/games/Timebomb.ch8",
      name: "Timebomb",
    },
    {
      url: "https://raw.githubusercontent.com/kripod/chip8-roms/master/games/Tron.ch8",
      name: "Tron",
    },
    {
      url: "https://raw.githubusercontent.com/kripod/chip8-roms/master/games/UFO [Lutz V, 1992].ch8",
      name: "UFO",
    },
    {
      url: "https://raw.githubusercontent.com/kripod/chip8-roms/master/games/Vers [JMN, 1991].ch8",
      name: "Vers",
    },
    {
      url: "https://raw.githubusercontent.com/kripod/chip8-roms/master/games/Vertical Brix [Paul Robson, 1996].ch8",
      name: "Vertical Brix",
    },
    {
      url: "https://raw.githubusercontent.com/kripod/chip8-roms/master/games/Wall [David Winter].ch8",
      name: "Wall",
    },
    {
      url: "https://raw.githubusercontent.com/kripod/chip8-roms/master/games/Wipe Off [Joseph Weisbecker].ch8",
      name: "Wipe Off",
    },
    {
      url: "https://raw.githubusercontent.com/kripod/chip8-roms/master/games/Worm V4 [RB-Revival Studios, 2007].ch8",
      name: "Worm V4",
    },
    {
      url: "https://raw.githubusercontent.com/kripod/chip8-roms/master/games/X-Mirror.ch8",
      name: "X-Mirror",
    },
    {
      url: "https://raw.githubusercontent.com/kripod/chip8-roms/master/games/ZeroPong [zeroZshadow, 2007].ch8",
      name: "ZeroPong",
    },
  ],
  ENABLE_TEST_ROMS ? TEST_ROMS : [],
);
