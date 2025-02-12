/* tslint:disable */
/* eslint-disable */
export function set_panic_hook(): void;
export class Controller {
  free(): void;
  constructor();
  dpad_n: boolean;
  dpad_s: boolean;
  dpad_w: boolean;
  dpad_e: boolean;
  start: boolean;
  select: boolean;
  a: boolean;
  b: boolean;
}
export class Nemu {
  private constructor();
  free(): void;
  static new(bin: Uint8Array): Nemu;
  next_frame(): Uint8Array;
  update_controller(controller: Controller): void;
}

export type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module;

export interface InitOutput {
  readonly memory: WebAssembly.Memory;
  readonly __wbg_nemu_free: (a: number, b: number) => void;
  readonly nemu_new: (a: number, b: number) => [number, number, number];
  readonly nemu_next_frame: (a: number) => [number, number];
  readonly nemu_update_controller: (a: number, b: number) => void;
  readonly __wbg_controller_free: (a: number, b: number) => void;
  readonly __wbg_get_controller_dpad_n: (a: number) => number;
  readonly __wbg_set_controller_dpad_n: (a: number, b: number) => void;
  readonly __wbg_get_controller_dpad_s: (a: number) => number;
  readonly __wbg_set_controller_dpad_s: (a: number, b: number) => void;
  readonly __wbg_get_controller_dpad_w: (a: number) => number;
  readonly __wbg_set_controller_dpad_w: (a: number, b: number) => void;
  readonly __wbg_get_controller_dpad_e: (a: number) => number;
  readonly __wbg_set_controller_dpad_e: (a: number, b: number) => void;
  readonly __wbg_get_controller_start: (a: number) => number;
  readonly __wbg_set_controller_start: (a: number, b: number) => void;
  readonly __wbg_get_controller_select: (a: number) => number;
  readonly __wbg_set_controller_select: (a: number, b: number) => void;
  readonly __wbg_get_controller_a: (a: number) => number;
  readonly __wbg_set_controller_a: (a: number, b: number) => void;
  readonly __wbg_get_controller_b: (a: number) => number;
  readonly __wbg_set_controller_b: (a: number, b: number) => void;
  readonly controller_new: () => number;
  readonly set_panic_hook: () => void;
  readonly __wbindgen_free: (a: number, b: number, c: number) => void;
  readonly __wbindgen_malloc: (a: number, b: number) => number;
  readonly __wbindgen_realloc: (a: number, b: number, c: number, d: number) => number;
  readonly __wbindgen_export_3: WebAssembly.Table;
  readonly __externref_table_dealloc: (a: number) => void;
  readonly __wbindgen_start: () => void;
}

export type SyncInitInput = BufferSource | WebAssembly.Module;
/**
* Instantiates the given `module`, which can either be bytes or
* a precompiled `WebAssembly.Module`.
*
* @param {{ module: SyncInitInput }} module - Passing `SyncInitInput` directly is deprecated.
*
* @returns {InitOutput}
*/
export function initSync(module: { module: SyncInitInput } | SyncInitInput): InitOutput;

/**
* If `module_or_path` is {RequestInfo} or {URL}, makes a request and
* for everything else, calls `WebAssembly.instantiate` directly.
*
* @param {{ module_or_path: InitInput | Promise<InitInput> }} module_or_path - Passing `InitInput` directly is deprecated.
*
* @returns {Promise<InitOutput>}
*/
export default function __wbg_init (module_or_path?: { module_or_path: InitInput | Promise<InitInput> } | InitInput | Promise<InitInput>): Promise<InitOutput>;
