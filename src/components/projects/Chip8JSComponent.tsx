"use client";

import { Combobox, Transition } from "@headlessui/react";
import { assert } from "chai";
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from "react";
import { Fragment } from "react";
import { HiCheck, HiChevronUpDown } from "react-icons/hi2";

import Button from "@/components/Button";
import * as chip8 from "@/lib/projects/chip8/chip8";
import { Rom, roms } from "@/lib/projects/chip8/rom_list";

export default function Chip8Component() {
  const [canvasRef, setCanvasRef] = useState<HTMLCanvasElement | null>(null);
  const [selectedRom, setSelectedRom] = useState(roms[53]);
  const [rom, setRom] = useState<Uint8Array | undefined>();

  useEffect(() => {
    if (rom !== undefined && canvasRef !== null) {
      const emu = new chip8.Chip8(rom);
      const ctx = canvasRef.getContext("2d");
      assert(ctx !== null);

      const keyDownListener = (ev: KeyboardEvent) => {
        const action = chip8.keymap.get(ev.key);
        if (action !== undefined) {
          ev.preventDefault();
          emu.keyDown(action);
        }
      };

      const keyUpListener = (ev: KeyboardEvent) => {
        const action = chip8.keymap.get(ev.key);
        if (action !== undefined) {
          ev.preventDefault();
          emu.keyUp(action);
        }
      };

      canvasRef.addEventListener("keydown", keyDownListener);
      canvasRef.addEventListener("keyup", keyUpListener);

      const stopEmu = emu.init(ctx);

      return () => {
        stopEmu();
        canvasRef.removeEventListener("keydown", keyDownListener);
        canvasRef.removeEventListener("keyup", keyUpListener);
      };
    }
  }, [rom, canvasRef]);

  const loadRom = useCallback(async (url: string) => {
    const response = await fetch(url);
    const blob = await response.blob();
    const buf = await blob.arrayBuffer();
    const romData = new Uint8Array(buf);
    setRom(romData);
  }, []);

  return (
    <div className="flex flex-col items-center space-y-5">
      <canvas
        ref={setCanvasRef}
        className="bg-black"
        tabIndex={1}
        width={chip8.SCREEN_W * chip8.PIXEL_SIZE}
        height={chip8.SCREEN_H * chip8.PIXEL_SIZE}
      />

      <div className="flex flex-row items-center space-x-3">
        <RomSelector
          roms={roms}
          selected={selectedRom}
          setSelected={setSelectedRom}
        />

        <Button onClick={() => void loadRom(selectedRom.url)}>Load ROM</Button>
      </div>
    </div>
  );
}

function RomSelector({
  roms,
  selected,
  setSelected,
}: {
  roms: Rom[];
  selected: Rom;
  setSelected: Dispatch<SetStateAction<Rom>>;
}) {
  const [query, setQuery] = useState("");

  const filteredRoms =
    query === ""
      ? roms
      : roms.filter(({ name }) =>
          name
            .toLowerCase()
            .replace(/\s+/g, "")
            .includes(query.toLowerCase().replace(/\s+/g, "")),
        );

  return (
    <div className="w-48">
      <Combobox
        value={selected}
        onChange={(value) => {
          assert(value !== null);
          setSelected(value);
        }}
      >
        <div className="relative">
          <div className="relative w-full cursor-default overflow-hidden rounded-lg bg-gray-700 text-left shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75 focus-visible:ring-offset-2 focus-visible:ring-offset-teal-300 sm:text-sm">
            <Combobox.Input
              className="w-full border-none bg-gray-700 py-2 pl-3 pr-10 text-sm leading-5 text-white outline-none focus:ring-0"
              displayValue={(rom: Rom) => rom.name}
              onChange={(event) => {
                setQuery((event.target as HTMLInputElement).value);
              }}
            />
            <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
              <HiChevronUpDown className="h-5 w-5 text-gray-600" />
            </Combobox.Button>
          </div>
          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
            afterLeave={() => setQuery("")}
          >
            <Combobox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-gray-700 py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm">
              {filteredRoms.length === 0 && query !== "" ? (
                <div className="relative cursor-default select-none px-4 py-2 text-gray-400">
                  Nothing found.
                </div>
              ) : (
                filteredRoms.map((rom) => (
                  <Combobox.Option
                    key={rom.name}
                    className={({ active }) =>
                      `relative cursor-default select-none py-2 pl-10 pr-4 text-white ${
                        active && "bg-indigo-400 text-white"
                      }`
                    }
                    value={rom}
                  >
                    {({ selected, active }) => (
                      <>
                        <span
                          className={`block truncate ${
                            selected ? "font-medium" : "font-normal"
                          }`}
                        >
                          {rom.name}
                        </span>
                        {selected ? (
                          <span
                            className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
                              active ? "text-white" : "text-teal-600"
                            }`}
                          >
                            <HiCheck className="h-5 w-5" aria-hidden="true" />
                          </span>
                        ) : null}
                      </>
                    )}
                  </Combobox.Option>
                ))
              )}
            </Combobox.Options>
          </Transition>
        </div>
      </Combobox>
    </div>
  );
}
