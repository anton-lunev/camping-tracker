type GlobalStorage = Global & {
  [key: string]: unknown; // Allow any string key to hold any type of value
};

export function createGlobal<T>(storageKey: string, defaultValue: T): T {
  const globalObject = global as unknown as GlobalStorage;
  if (globalObject[storageKey] === undefined) {
    globalObject[storageKey] = defaultValue;
  }
  return globalObject[storageKey] as T;
}
