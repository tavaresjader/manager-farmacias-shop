const AUTH_TOKEN_KEY = "FarmaciasShopManagerAccessToken";

/** Lê o campo `exp` do JWT (em ms) sem confiar no conteúdo do token. */
function getTokenExpiry(token: string): number | null {
  try {
    const payload = token.split(".")[1];
    if (!payload) return null;
    const json = JSON.parse(
      atob(payload.replace(/-/g, "+").replace(/_/g, "/"))
    ) as { exp?: number };
    return typeof json.exp === "number" ? json.exp * 1000 : null;
  } catch {
    return null;
  }
}

export function isTokenExpired(token: string): boolean {
  const expiry = getTokenExpiry(token);
  if (expiry === null) return false;
  return Date.now() >= expiry;
}

/**
 * Token de acesso é mantido apenas em sessionStorage (limpo ao fechar a aba)
 * e descartado automaticamente quando expirado.
 */
export const authTokenStorage = {
  get(): string | null {
    const token = sessionStorage.getItem(AUTH_TOKEN_KEY);
    if (!token) return null;
    if (isTokenExpired(token)) {
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
