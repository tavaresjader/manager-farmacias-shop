const AUTH_TOKEN_KEY = "FarmaciasShopManagerAccessToken";

interface TokenPayload {
  exp?: number;
  mock?: boolean;
}

/** Lê o campo `exp` do JWT (em ms) sem confiar no conteúdo do token. */
function getTokenPayload(token: string): TokenPayload | null {
  try {
    const payload = token.split(".")[1];
    if (!payload) return null;
    return JSON.parse(
      atob(payload.replace(/-/g, "+").replace(/_/g, "/"))
    ) as TokenPayload;
  } catch {
    return null;
  }
}

function getTokenExpiry(token: string): number | null {
  const payload = getTokenPayload(token);
  return typeof payload?.exp === "number" ? payload.exp * 1000 : null;
}

export function isTokenExpired(token: string): boolean {
  const expiry = getTokenExpiry(token);
  if (expiry === null) return false;
  return Date.now() >= expiry;
}

export function isMockToken(token: string): boolean {
  return getTokenPayload(token)?.mock === true;
}

/**
 * Token de acesso é mantido apenas em sessionStorage (limpo ao fechar a aba)
 * e descartado automaticamente quando expirado.
 */
export const authTokenStorage = {
  get(): string | null {
    const token = sessionStorage.getItem(AUTH_TOKEN_KEY);
    if (!token) return null;
    if (isTokenExpired(token) || isMockToken(token)) {
      sessionStorage.removeItem(AUTH_TOKEN_KEY);
      return null;
    }
    return token;
  },
  set(token: string): void {
    sessionStorage.setItem(AUTH_TOKEN_KEY, token);
  },
  clear(): void {
    sessionStorage.removeItem(AUTH_TOKEN_KEY);
  },
};
