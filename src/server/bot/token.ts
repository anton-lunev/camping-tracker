import { randomBytes } from "crypto";

function getGlobal() {
  return global as unknown as Global & {
    tokensMap: Map<string, { id: number; username: string; createdAt: number }>;
    userTokenCache: Map<number, string>;
  };
}

function getTokensMap() {
  if (!getGlobal().tokensMap) {
    getGlobal().tokensMap = new Map<
      string,
      { id: number; username: string; createdAt: number }
    >();
  }
  return getGlobal().tokensMap;
}

function getUserTokenCache() {
  if (!getGlobal().userTokenCache) {
    getGlobal().userTokenCache = new Map<number, string>();
  }
  return getGlobal().userTokenCache;
}

// TODO: remove by expirationTime
// TODO: move tokens to DB/redis
export function createTokenForUser(userData: { id: number; username: string }) {
  const token = getUserTokenCache().get(userData.id) || generateToken();
  getTokensMap().set(token, {
    id: userData.id,
    username: userData.username,
    createdAt: Date.now(),
  });
  console.log("createTokenForUser", getTokensMap());
  return token;
}

export function getUserDataByToken(token: string) {
  console.log("getUserDataByToken", getTokensMap());
  return getTokensMap().get(token);
}

export function generateToken(length = 32): string {
  return randomBytes(length).toString("hex");
}
