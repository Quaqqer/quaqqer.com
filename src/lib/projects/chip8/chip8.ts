import { assert } from "chai";

export const PIXEL_SIZE = 10;
export const SCREEN_W = 64;
export const SCREEN_H = 32;

export const keymap = new Map<string, number>();
keymap.set("1", 0x1);
keymap.set("2", 0x2);
keymap.set("3", 0x3);
keymap.set("4", 0xc);
keymap.set("q", 0x4);
keymap.set("w", 0x5);
keymap.set("e", 0x6);
keymap.set("r", 0xd);
keymap.set("a", 0x7);
keymap.set("s", 0x8);
keymap.set("d", 0x9);
keymap.set("f", 0xe);
keymap.set("z", 0xa);
keymap.set("x", 0x0);
keymap.set("c", 0xb);
keymap.set("v", 0xf);

// prettier-ignore
const font = [
  0xF0, 0x90, 0x90, 0x90, 0xF0, // 0
  0x20, 0x60, 0x20, 0x20, 0x70, // 1
  0xF0, 0x10, 0xF0, 0x80, 0xF0, // 2
  0xF0, 0x10, 0xF0, 0x10, 0xF0, // 3
  0x90, 0x90, 0xF0, 0x10, 0x10, // 4
  0xF0, 0x80, 0xF0, 0x10, 0xF0, // 5
  0xF0, 0x80, 0xF0, 0x90, 0xF0, // 6
  0xF0, 0x10, 0x20, 0x40, 0x40, // 7
  0xF0, 0x90, 0xF0, 0x90, 0xF0, // 8
  0xF0, 0x90, 0xF0, 0x10, 0xF0, // 9
  0xF0, 0x90, 0xF0, 0x90, 0x90, // A
  0xE0, 0x90, 0xE0, 0x90, 0xE0, // B
  0xF0, 0x80, 0x80, 0x80, 0xF0, // C
  0xE0, 0x90, 0x90, 0x90, 0xE0, // D
  0xF0, 0x80, 0xF0, 0x80, 0xF0, // E
  0xF0, 0x80, 0xF0, 0x80, 0x80  // F
]

export class Chip8 {
  // 4096 kb ram
  private ram = new Uint8Array(4096);
  // 64x32 monochrome display
  private display = new Array(64 * 32).fill(false);
  // Call stack
  private stack: number[] = [];

  // Program counter, 12 bits, 0..4096
  private pc = 0x200;

  // Timers for delay and sound
  private timer_delay = 0;
  private timer_sound = 0;

  // Memory pointer
  private i = 0; // 16 bits
  // 16 8-bit registers
  private registers = new Uint8Array(16);

  private key_downs = new Array(16).fill(false);

  constructor(rom: Uint8Array) {
    for (let i = 0; i < font.length; i++) {
      this.ram[i] = font[i];
    }

    for (let i = 0; i < rom.length; i++) {
      this.ram[0x200 + i] = rom[i];
    }
  }

  public init(ctx: CanvasRenderingContext2D): () => void {
    const HZ = 500;
    const TIMER_HZ = 60;

    let running = true;

    let tickT = 0;
    let timerT = 0;

    let start = Date.now();

    const audioCtx = new globalThis.AudioContext();
    const oscillator = audioCtx.createOscillator();
    oscillator.frequency.value = 500;
    oscillator.type = "sine";
    oscillator.start();
    let soundPlaying = false;

    const update = () => {
      if (running) {
        const end = Date.now();

        tickT += end - start;
        timerT += end - start;

        start = end;

        while (tickT > 1000 / HZ) {
          tickT -= 1000 / HZ;
          this.tick();
        }

        while (timerT > 1000 / TIMER_HZ) {
          timerT -= 1000 / TIMER_HZ;
          this.decrementTimers();
        }

        if (this.timer_sound > 0 && !soundPlaying) {
          soundPlaying = true;
          oscillator.connect(audioCtx.destination);
        } else if (this.timer_sound == 0 && soundPlaying) {
          soundPlaying = false;
          oscillator.disconnect(audioCtx.destination);
        }

        this.render(ctx);

        requestAnimationFrame(update);
      }
    };
    requestAnimationFrame(update);

    return () => {
      if (soundPlaying) oscillator.disconnect(audioCtx.destination);

      running = false;
    };
  }

  public tick() {
    const abcd = (this.ram[this.pc] << 8) | this.ram[this.pc + 1];
    this.pc = (this.pc + 2) & 0xffffff;

    const a = (abcd >> 12) & 0xf;
    const b = (abcd >> 8) & 0xf;
    const c = (abcd >> 4) & 0xf;
    const d = (abcd >> 0) & 0xf;

    const cd = (c << 4) | d;
    const bcd = (b << 8) | cd;

    switch (true) {
      // 00e0 - Clear
      case abcd == 0x00e0:
        for (let i = 0; i < this.display.length; i++) {
          this.display[i] = 0;
        }
        break;

      // 00ee - Pop subroutine
      case abcd == 0x00ee:
        {
          const pc = this.stack.pop();
          assert(pc !== undefined);
          this.pc = pc;
        }
        break;

      // 1NNN - Jump
      case a == 0x1:
        this.pc = bcd;
        break;

      // 2NNN - Enter subroutine
      case a == 0x2:
        this.stack.push(this.pc);
        this.pc = bcd;
        break;

      // 3XNN - Skip if VX == NN
      case a == 0x3:
        if (this.registers[b] === cd) this.pc = (this.pc + 2) & 0xffffff;
        break;

      // 4XNN - Skip if VX != NN
      case a == 0x4:
        if (this.registers[b] !== cd) this.pc = (this.pc + 2) & 0xffffff;
        break;

      // 5XY0
      case a == 0x5 && d == 0x0:
        if (this.registers[b] === this.registers[c]) {
          this.pc = (this.pc + 2) & 0xffffff;
        }
        break;

      // 6XNN - Set VX to NN
      case a == 0x6:
        this.registers[b] = cd;
        break;

      // 7XNN - Add NN to VX
      case a == 0x7:
        this.registers[b] = (this.registers[b] + cd) & 0xff;
        break;

      // 8XY0 - Set VX to VY
      case a == 0x8 && d == 0x0:
        this.registers[b] = this.registers[c];
        break;

      // 8XY1 - Set VX to VX | VY
      case a == 0x8 && d == 0x1:
        this.registers[b] = this.registers[b] | this.registers[c];
        this.registers[0xf] = 0x0; // Chip-8 quirk
        break;

      // 8XY2 - Set VX to VX & VY
      case a == 0x8 && d == 0x2:
        this.registers[b] = this.registers[b] & this.registers[c];
        this.registers[0xf] = 0x0; // Chip-8 quirk
        break;

      // 8XY3 - Set VX to VX ^ VY
      case a == 0x8 && d == 0x3:
        this.registers[b] = this.registers[b] ^ this.registers[c];
        this.registers[0xf] = 0x0; // Chip-8 quirk
        break;

      // 8XY4 - Set VX to VX + VY, carry to VF
      case a == 0x8 && d == 0x4:
        {
          const res = this.registers[b] + this.registers[c];
          const of = res > 255;
          this.registers[b] = res & 0xff;
          this.registers[0xf] = of ? 1 : 0;
        }
        break;

      // 8XY5 - Set VX to VX - VY, carry minuend to VF
      case a == 0x8 && d == 0x5:
        {
          const unborrowed = this.registers[b] >= this.registers[c];
          this.registers[b] -= this.registers[c];
          this.registers[0xf] = unborrowed ? 1 : 0;
        }
        break;

      // 8XY6 - Shift VY to right and store in VX, save shifted bit in VF
      case a == 0x8 && d == 0x6:
        {
          this.registers[b] = this.registers[c]; // Chip-8 quirk
          const read = this.registers[b];
          this.registers[b] = read >> 1;
          this.registers[0xf] = read & 0x1;
        }
        break;

      // 8XY7 - Set VX to VY - VX, carry minuend to VF
      case a == 0x8 && d == 0x7:
        {
          const unborrowed = this.registers[c] >= this.registers[b];
          this.registers[b] = this.registers[c] - this.registers[b];
          this.registers[0xf] = unborrowed ? 1 : 0;
        }
        break;

      // 8XYE - Shift VY to the left and store in VY, save shifted bit in VF
      case a == 0x8 && d == 0xe:
        {
          this.registers[b] = this.registers[c]; // Chip-8 quirk
          const read = this.registers[b];
          this.registers[b] = read << 1;
          this.registers[0xf] = (read & 0x80) >> 7;
        }
        break;

      // 9XY0
      case a == 0x9:
        if (this.registers[b] !== this.registers[c]) {
          this.pc = (this.pc + 2) & 0xffffff;
        }
        break;

      // aNNN - Set index
      case a == 0xa:
        this.i = bcd;
        break;

      // BNNN - Jump with offset
      case a == 0xb:
        this.pc = (this.registers[0] + bcd) & 0xffffff;
        break;

      // CXNN - Random
      case a == 0xc:
        this.registers[b] = Math.floor(Math.random() * 255) & cd;
        break;

      // dXYN - Draw
      case a == 0xd:
        this.draw(this.registers[b], this.registers[c], d);
        break;

      // EX9E - Skip if key
      case a == 0xe && cd == 0x9e:
        if (this.key_downs[this.registers[b]]) this.pc += 2;
        break;

      // EX9E - Skip if key
      case a == 0xe && cd == 0xa1:
        if (!this.key_downs[this.registers[b]]) this.pc += 2;
        break;

      // FX07 - Get delay timer
      case a == 0xf && cd == 0x07:
        this.registers[b] = this.timer_delay;
        break;

      // FX15 - Set delay timer
      case a == 0xf && cd == 0x15:
        this.timer_delay = this.registers[b];
        break;

      // FX18 - Set sound timer
      case a == 0xf && cd == 0x18:
        this.timer_sound = this.registers[b];
        break;

      // FX0A - Get key
      case a == 0xf && cd == 0x0a:
        {
          for (let i = 0; i < 0x10; i++) {
            if (this.key_downs[i]) {
              this.registers[b] = i;
              break;
            }
          }
          // If no key was pressed, execute this instruction again next cycle
          this.pc = (this.pc - 2) & 0xffffff;
        }
        break;

      // FX1E - Add to index
      case a == 0xf && cd == 0x1e:
        this.i = (this.i + this.registers[b]) & 0xffffff;
        break;

      // FX29 - Font character
      case a == 0xf && cd == 0x29:
        this.i = 5 * b;
        break;

      // FX33 - Binary-coded decimal conversion
      case a == 0xf && cd == 0x33:
        {
          let curr = this.registers[b];

          for (let i = 0; i < 3; i++) {
            this.ram[this.i + 2 - i] = curr % 10;
            curr = Math.floor(curr / 10);
          }
        }
        break;

      // 0xFX55 - Store to memory
      case a == 0xf && cd == 0x55:
        for (let i = 0; i <= b; i++) {
          this.ram[this.i + i] = this.registers[i];
        }
        this.i += 1; // Chip-8 quirk
        break;

      // 0xFX65 - Load to memory
      case a == 0xf && cd == 0x65:
        for (let i = 0; i <= b; i++) {
          this.registers[i] = this.ram[this.i + i];
        }
        this.i += 1; // Chip-8 quirk
        break;

      default:
        throw new Error(
          `Unimplemented op 0x${abcd.toString(16).padStart(4, "0")}`,
        );
    }
  }

  public decrementTimers() {
    if (this.timer_delay > 0) this.timer_delay--;
    if (this.timer_sound > 0) this.timer_sound--;
  }

  private draw(xOffset: number, yOffset: number, height: number) {
    this.registers[0xf] = 0;

    xOffset %= 64;
    yOffset %= 32;

    for (let dy = 0; dy < height; dy++) {
      const y = yOffset + dy;

      for (let dx = 0; dx < 8; dx++) {
        const x = xOffset + dx;

        if (64 <= x || 32 <= y) {
          continue;
        }

        const tile = this.ram[this.i + dy];
        const pixel = ((tile << dx) & (1 << 7)) != 0;

        if (pixel) {
          const i = y * 64 + x;

          if (this.display[i]) {
            this.registers[0xf] = 1;
          }

          this.display[i] = !this.display[i];
        }
      }
    }
  }

  public render(ctx: CanvasRenderingContext2D) {
    const on = "#ffffff";
    const off = "#000000";

    for (let x = 0; x < 64; x++) {
      for (let y = 0; y < 32; y++) {
        if (this.display[y * 64 + x]) {
          ctx.fillStyle = on;
        } else {
          ctx.fillStyle = off;
        }

        ctx.fillRect(x * 10, y * 10, 10, 10);
      }
    }
  }

  public keyDown(key: number) {
    this.key_downs[key] = true;
  }

  public keyUp(key: number) {
    this.key_downs[key] = false;
  }
}
