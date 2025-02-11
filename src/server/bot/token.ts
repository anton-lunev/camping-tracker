import { randomBytes } from "crypto";
import { createGlobal } from "@/server/utils/globalStorage";

export const tokensMap = createGlobal(
  "tokensMap",
  new Map<string, { id: number; username: string; createdAt: number }>(),
);
export const userTokenCache = createGlobal(
  "userTokenCache",
  new Map<number, string>(),
);

// TODO: remove by expirationTime
// TODO: move tokens to DB/redis
export function createTokenForUser(userData: { id: number; username: string }) {
  const token = userTokenCache.get(userData.id) || generateToken();
  tokensMap.set(token, {
    id: userData.id,
    username: userData.username,
    createdAt: Date.now(),
  });
  console.log("createTokenForUser", tokensMap);
  return token;
}

export function getUserDataByToken(token: string) {
  console.log("getUserDataByToken", tokensMap);
  return tokensMap.get(token);
}

export function generateToken(length = 32): string {
  return randomBytes(length).toString("hex");
}
