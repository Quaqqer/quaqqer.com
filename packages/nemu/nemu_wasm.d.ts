/* tslint:disable */
/* eslint-disable */
/**
*/
export function set_panic_hook(): void;
/**
*/
export class Controller {
  free(): void;
/**
*/
  constructor();
/**
*/
  a: boolean;
/**
*/
  b: boolean;
/**
*/
  dpad_e: boolean;
/**
*/
  dpad_n: boolean;
/**
*/
  dpad_s: boolean;
/**
*/
  dpad_w: boolean;
/**
*/
  select: boolean;
/**
*/
  start: boolean;
}
/**
*/
export class Nemu {
  free(): void;
/**
* @param {Uint8Array} bin
* @returns {Nemu | undefined}
*/
  static new(bin: Uint8Array): Nemu | undefined;
/**
* @returns {Uint8Array}
*/
  next_frame(): Uint8Array;
/**
* @param {Controller} controller
*/
  update_controller(controller: Controller): void;
}
