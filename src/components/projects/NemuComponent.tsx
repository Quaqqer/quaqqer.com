"use client";

// import { Controller, Nemu } from "nemu";
import { useEffect, useMemo, useState } from "react";

const keyMap = {
  z: "b",
  x: "a",
  ArrowUp: "dpad_n",
  ArrowDown: "dpad_s",
  ArrowLeft: "dpad_w",
  ArrowRight: "dpad_e",
  Enter: "start",
  ShiftRight: "select",
} as const;

export default function NemuComponent() {
  const [canvasRef, setCanvasRef] = useState<HTMLCanvasElement | null>(null);
  const [rom, setRom] = useState<Uint8Array | undefined>();

  const [nemu, setNemu] = useState<typeof import("nemu") | undefined>();

  useEffect(() => {
    const f = async () => {
      const nemu = await import("nemu");
      nemu.set_panic_hook();
      setNemu(nemu);
    };
    f();
  });

  const emulator = useMemo(
    () => (rom ? nemu?.Nemu.new(rom) : undefined),
    [nemu, rom],
  );

  useEffect(() => {
    if (!emulator || !canvasRef || !nemu) return;

    const controller = new nemu.Controller();

    const keyDown = (ev: KeyboardEvent) => {
      const btn = keyMap[ev.key as keyof typeof keyMap];

      if (btn !== undefined) {
        ev.preventDefault();
        controller[btn] = true;
      }
    };
    const keyUp = (ev: KeyboardEvent) => {
      const btn = keyMap[ev.key as keyof typeof keyMap];

      if (btn !== undefined) {
        ev.preventDefault();
        controller[btn] = false;
      }
    };

    canvasRef.addEventListener("keydown", keyDown);
    canvasRef.addEventListener("keyup", keyUp);

    const update = () => {
      emulator.update_controller(controller);

      const imageBuf = emulator.next_frame();
      const imageData = new ImageData(
        new Uint8ClampedArray(imageBuf.buffer),
        256,
        240,
      );
      canvasRef.getContext("2d")?.putImageData(imageData, 0, 0);
    };

    const interval = setInterval(update, 1000 / 60);

    return () => {
      canvasRef.removeEventListener("keydown", keyDown);
      canvasRef.removeEventListener("keyup", keyUp);
      clearInterval(interval);
    };
  }, [canvasRef, emulator, nemu]);

  return (
    <div>
      <input
        type="file"
        onChange={async (ev) => {
          const file = ev.target.files?.[0];
          if (file !== undefined) {
            setRom(new Uint8Array(await file.arrayBuffer()));
          }
        }}
      />
      <canvas
        tabIndex={0}
        width={256}
        height={240}
        ref={setCanvasRef}
        style={{ imageRendering: "pixelated", width: 512, height: 480 }}
      />
    </div>
  );
}
