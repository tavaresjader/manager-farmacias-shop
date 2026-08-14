/**
 * Autenticação mock (usada apenas quando a feature flag `mockAuth` está ativa).
 * Gera um JWT falso (não assinado) com expiração de 8 horas para que o app
 * funcione normalmente sem depender do backend.
 */

const base64Url = (value: string) =>
  btoa(value).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");

const createMockJwt = (email: string): string => {
  const header = base64Url(JSON.stringify({ alg: "none", typ: "JWT" }));
  const now = Math.floor(Date.now() / 1000);
  const payload = base64Url(
    JSON.stringify({
      sub: "mock-user",
      email,
      name: "Usuário Mock",
      iat: now,
      exp: now + 60 * 60 * 8,
      mock: true,
    })
  );
  return `${header}.${payload}.mock-signature`;
};

export interface MockSignInResult {
  accessToken: string;
}

export const mockAuth = {
  async signIn({ email }: { email: string; password: string }): Promise<MockSignInResult> {
    // pequeno atraso para simular chamada de rede
    await new Promise((resolve) => setTimeout(resolve, 400));
    return { accessToken: createMockJwt(email) };
  },
};
