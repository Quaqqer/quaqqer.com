"use client";

// import { Controller, Nemu } from "nemu";
import { useEffect, useMemo, useState } from "react";
import { MdFullscreen } from "react-icons/md";

import Button from "../Button";

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
  const [romInputRef, setRomInputRef] = useState<HTMLInputElement | null>(null);
  const [canvasRef, setCanvasRef] = useState<HTMLCanvasElement | null>(null);
  const [rom, setRom] = useState<Uint8Array | undefined>();

  const [nemu, setNemu] = useState<typeof import("nemu") | undefined>();

  const [size, setSize] = useState<1 | 2 | 3>(2);
  const [fullscreen, setFullscreen] = useState(false);

  useEffect(() => {
    const f = async () => {
      const nemu = await import("nemu");
      nemu.set_panic_hook();
      setNemu(nemu);
    };
    f();
  });

  // React to fullscreen events
  useEffect(() => {
    if (!canvasRef) return;

    const listener = () => {
      if (!document.fullscreenElement) setFullscreen(false);
    };

    canvasRef.addEventListener("fullscreenchange", listener);
    canvasRef.addEventListener("fullscreenerror", listener);

    return () => {
      canvasRef.removeEventListener("fullscreenchange", listener);
      canvasRef.removeEventListener("fullscreenerror", listener);
    };
  }, [canvasRef]);

  const emulator = useMemo(() => {
    const emu = rom ? nemu?.Nemu.new(rom) : undefined;
    if (rom && !emu)
      alert(
        "Failed to load rom, probably because it is using an unsupported mapper.",
      );

    return emu;
  }, [nemu, rom]);

  useEffect(() => {
    if (canvasRef && fullscreen) canvasRef.requestFullscreen();
  }, [canvasRef, fullscreen]);

  useEffect(() => {
    if (!emulator || !canvasRef || !nemu) return;

    const controller = new nemu.Controller();

    const keyDown = (ev: KeyboardEvent) => {
      const btn = keyMap[ev.key as keyof typeof keyMap];

      if (btn !== undefined) {
        ev.preventDefault();
        controller[btn] = true;
      }

      if (ev.key === "f") {
        setFullscreen((f) => !f);
        ev.preventDefault();
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
    <div className="flex flex-col items-stretch gap-3 rounded-xl bg-gray-900 p-5">
      <input
        ref={setRomInputRef}
        hidden
        type="file"
        accept=".nes"
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
        style={{
          imageRendering: "pixelated",
          width: 256 * size,
          height: 240 * size,
        }}
        className="bg-black"
      />

      <div className="flex flex-row justify-between gap-5 px-5">
        <Button
          onClick={() => {
            romInputRef?.click();
          }}
        >
          Load ROM
        </Button>

        <div className="flex flex-row items-center gap-1">
          {new Array(3).fill(0).map((_, i) => (
            <button key={i} onClick={() => setSize((1 + size) as 1 | 2 | 3)}>
              {i + 1}x
            </button>
          ))}
          <button onClick={() => void setFullscreen(true)}>
            {<MdFullscreen size={20} />}
          </button>
        </div>
      </div>
    </div>
  );
}
