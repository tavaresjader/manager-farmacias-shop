/** Autenticação mock usada apenas quando a feature flag `mockAuth` está ativa. */

function base64Url(value: string): string {
  return btoa(value).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

export interface MockSignInResult {
  accessToken: string;
}

export const mockAuth = {
  signIn(email: string): MockSignInResult {
    const header = base64Url(JSON.stringify({ alg: "none", typ: "JWT" }));
    const payload = base64Url(
      JSON.stringify({
        sub: "mock-user",
        email,
        name: "Usuário Mock",
        exp: Math.floor(Date.now() / 1000) + 8 * 60 * 60,
      })
    );
    return { accessToken: `${header}.${payload}.mock-signature` };
  },
};
