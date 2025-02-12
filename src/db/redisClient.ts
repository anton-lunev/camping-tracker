import { createClient } from "redis";
import { Logger } from "@/server/utils/logger";

export function createRedisClient() {
  return createClient({ url: process.env.REDIS_URL });
}

export const redis = await createRedisClient().connect();

redis.on("error", (error) => Logger.error("Redis", error));

/**
 * Generic function to store any JavaScript object in Redis as a JSON string with an expiration time.
 *
 * @param key The Redis key to store the object under.
 * @param objectToStore The JavaScript object of type T to store.
 * @param expirationInSeconds The expiration time in seconds after which the key will be deleted.
 * @returns void (or a Promise that resolves when the operation is complete).
 */
export async function setObject<T extends object>(
  key: string,
  objectToStore: T,
  expirationInSeconds?: number,
): Promise<void> {
  try {
    const jsonString = JSON.stringify(objectToStore);
    await redis.set(
      key,
      jsonString,
      expirationInSeconds ? { EX: expirationInSeconds } : undefined,
    ); // Store JSON string with expiration
  } catch (error) {
    console.error("Error storing object in Redis:", error);
  }
}

/**
 * Generic function to retrieve a JavaScript object from Redis that was stored as a JSON string.
 *
 * @param key The Redis key to retrieve the object from.
 * @returns A Promise that resolves to the retrieved JavaScript object of type T, or null if the key doesn't exist or retrieval fails.
 */
export async function getObject<T extends object>(
  key: string,
): Promise<T | null> {
  try {
    const jsonString = await redis.get(key);
    if (jsonString) {
      return JSON.parse(jsonString) as T;
    } else {
      return null; // Key doesn't exist or has no value
    }
  } catch (error) {
    console.error("Error retrieving object from Redis:", error);
    return null;
  }
}
