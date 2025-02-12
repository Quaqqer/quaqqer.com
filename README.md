# [quaqqer.com](https://quaqqer.com)

This is my personal website where I have some projects that are running in the browser.

## Interactive projects

- NEMU - a NES emulator
- Tetris - a simple Tetris game without scoring
- CHIP-8 - a CHIP-8 emulator written in TypeScript
- CineMraft - a little procedural voxel world rendered using three.js
- Game of Life - a simple game of life simulation
- Snake - a simple snake game

## Nemu

The deployment of Nemu is a bit cursed. The current version of webpack is
incompatible with wasm generated with wasm pack. My current solution is to
generate wasm for the esmodules and fetch the wasm file from the public
directory. Therefore, I need a copy of the .wasm-file in the public directory.
Note to self: Update both wasm-files when updating nemu. The wasm is generated
with `wasm-pack build --target web`.
