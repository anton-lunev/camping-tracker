import { randomBytes } from "crypto";
import { getObject, redis, setObject } from "@/db/redisClient";

type TelegramUserData = {
  id: number;
  username: string;
};

const EXPIRATION_SEC = 5 * 60; // 5 minutes

function key(token: string) {
  return `tg_link_${token}`;
}

export async function createTokenForUser(userData: {
  id: number;
  username: string;
}) {
  const token = generateToken();
  await setObject<TelegramUserData>(key(token), {
    id: userData.id,
    username: userData.username,
  });
  await redis.expire(key(token), EXPIRATION_SEC);
  return token;
}

export function getUserDataByToken(token: string) {
  return getObject<TelegramUserData>(key(token));
}

export function removeToken(token: string) {
  return redis.del(key(token));
}

export function generateToken(length = 32): string {
  return randomBytes(length).toString("hex");
}
