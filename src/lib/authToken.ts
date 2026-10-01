const AUTH_TOKEN_KEY = "FarmaciasShopManagerAccessToken";
const AUTH_SESSION_KEY = "FarmaciasShopManagerSession";
// Key that marks the "Ative sua conta" bar as dismissed; cleared on every
// sign-in so the bar shows again after each login.
export const ACTIVATION_BAR_DISMISS_KEY = "FarmaciasShopActivationBarDismissed";

interface TokenPayload {
  exp?: number;
  mock?: boolean;
}

export interface AuthSessionData {
  accessToken?: string;
  token?: string;
  expiresIn?: number;
  domain?: string;
  user?: {
    id: string;
    email: string;
    name?: string;
  };
  employee?: {
    id: string;
    name?: string;
    email?: string;
    master?: boolean;
  };
  merchants?: Array<{
    id: string;
    name?: string;
  }>;
}

function readBooleanClaim(value: unknown): boolean {
  return value === true || value === "true" || value === "True" || value === "1" || value === 1;
}

function getTokenFromSession(session: AuthSessionData | null): string | undefined {
  return session?.accessToken || session?.token;
}

export function isMasterSession(session: AuthSessionData | null): boolean {
  if (!session) return false;

  if (session.employee?.master === true) return true;

  const token = getTokenFromSession(session);
  if (!token) return false;

  const payload = getTokenPayload(token);
  if (!payload) return false;

  const claims = payload as Record<string, unknown>;
  return [
    claims.master,
    claims.Master,
    claims.isMaster,
    claims.IsMaster,
    claims.employee_master,
    claims.EmployeeMaster,
  ].some(readBooleanClaim);
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
    sessionStorage.removeItem(AUTH_SESSION_KEY);
  },
  getSession(): AuthSessionData | null {
    try {
      const session = sessionStorage.getItem(AUTH_SESSION_KEY);
      return session ? JSON.parse(session) as AuthSessionData : null;
    } catch {
      sessionStorage.removeItem(AUTH_SESSION_KEY);
      return null;
    }
  },
  setSession(session: AuthSessionData): void {
    sessionStorage.setItem(AUTH_SESSION_KEY, JSON.stringify(session));
  },
};
