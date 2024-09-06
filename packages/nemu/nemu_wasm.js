
import * as wasm from "./nemu_wasm_bg.wasm";
import { __wbg_set_wasm } from "./nemu_wasm_bg.js";
__wbg_set_wasm(wasm);
export * from "./nemu_wasm_bg.js";
