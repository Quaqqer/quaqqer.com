export function assertNever(value: never): never {
  throw new Error(`Assertion ever, value was not never: ${value}`);
}
