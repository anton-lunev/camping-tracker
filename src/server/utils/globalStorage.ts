type GlobalStorage = Global & {
  [key: string]: unknown; // Allow any string key to hold any type of value
};

export function createGlobal<T>(
  storageKey: string,
  defaultValue: T | (() => T),
): T {
  const globalObject = global as unknown as GlobalStorage;
  console.log(storageKey, globalObject[storageKey]);
  if (globalObject[storageKey] === undefined) {
    globalObject[storageKey] =
      defaultValue instanceof Function ? defaultValue() : defaultValue;
  }
  return globalObject[storageKey] as T;
}
