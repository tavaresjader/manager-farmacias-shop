/**
 * Feature flags da aplicação.
 * Ative/desative recursos alterando os valores abaixo.
 */
export const featureFlags = {
  /**
   * Quando ativa, o login não chama o backend: usa autenticação mock local.
   * Manter ativa até que a desativação seja solicitada.
   */
  mockAuth: true,
} as const;

export type FeatureFlag = keyof typeof featureFlags;

export const isFeatureEnabled = (flag: FeatureFlag): boolean => featureFlags[flag];
