import { useEffect, useState, useCallback } from "react";

declare global {
  interface Window {
    grecaptcha?: {
      enterprise: {
        ready: (cb: () => void) => void;
        execute: (siteKey: string, options: { action: string }) => Promise<string>;
      };
    };
  }
}

const SITE_KEY = import.meta.env.VITE_RECAPTCHA_SITE_KEY as string | undefined;
const SCRIPT_ID = "recaptcha-enterprise-script";

/**
 * Carrega o script do reCAPTCHA Enterprise e expõe uma função para
 * gerar tokens de forma invisível (baseada em pontuação).
 */
export const useRecaptchaEnterprise = () => {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (!SITE_KEY) return;

    const onReady = () => {
      window.grecaptcha?.enterprise.ready(() => setIsReady(true));
    };

    const existing = document.getElementById(SCRIPT_ID) as HTMLScriptElement | null;
    if (existing) {
      if (window.grecaptcha?.enterprise) {
        onReady();
      } else {
        existing.addEventListener("load", onReady);
      }
      return;
    }

    const script = document.createElement("script");
    script.id = SCRIPT_ID;
    script.src = `https://www.google.com/recaptcha/enterprise.js?render=${SITE_KEY}`;
    script.async = true;
    script.defer = true;
    script.addEventListener("load", onReady);
    document.head.appendChild(script);
  }, []);

  const executeRecaptcha = useCallback(
    async (action: string): Promise<string | null> => {
      if (!SITE_KEY || !window.grecaptcha?.enterprise) return null;
      try {
        return await window.grecaptcha.enterprise.execute(SITE_KEY, { action });
      } catch {
        return null;
      }
    },
    []
  );

  return { isReady: Boolean(SITE_KEY) && isReady, isConfigured: Boolean(SITE_KEY), executeRecaptcha };
};
