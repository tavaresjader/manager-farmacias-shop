/**
 * Feature flags da aplicação.
 * mockAuth: quando ativo, o login não chama o backend real e gera uma sessão mock.
 */
export const featureFlags = {
  mockAuth: false,
} as const;
