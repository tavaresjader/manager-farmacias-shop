import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().trim().email("E-mail inválido").max(255, "E-mail muito longo"),
  senha: z.string().min(1, "Por favor, preencha a senha"),
});

export const forgotPasswordSchema = z.object({
  email: z.string().trim().email("E-mail inválido").max(255, "E-mail muito longo"),
});

function validateCNPJ(cnpj: string): boolean {
  const digits = cnpj.replace(/[^\d]/g, "");
  if (digits.length !== 14) return false;
  if (/^(\d)\1+$/.test(digits)) return false;

  const calcDigit = (base: string, weights: number[]) => {
    const sum = weights.reduce((acc, w, i) => acc + parseInt(base[i]) * w, 0);
    const rest = sum % 11;
    return rest < 2 ? 0 : 11 - rest;
  };

  const w1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  const w2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];

  const d1 = calcDigit(digits, w1);
  if (parseInt(digits[12]) !== d1) return false;

  const d2 = calcDigit(digits, w2);
  if (parseInt(digits[13]) !== d2) return false;

  return true;
}

export const registrationSchema = z
  .object({
    nomeFarmacia: z
      .string()
      .trim()
      .min(3, "Nome deve ter no mínimo 3 caracteres")
      .max(100, "Nome muito longo")
      .regex(/^[a-zA-ZÀ-ÿ0-9\s\-]+$/, "Caracteres inválidos no nome"),
    cnpj: z
      .string()
      .regex(
        /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/,
        "CNPJ deve estar no formato XX.XXX.XXX/XXXX-XX"
      )
      .refine(validateCNPJ, "CNPJ inválido"),
    nomeResponsavel: z
      .string()
      .trim()
      .min(3, "Nome deve ter no mínimo 3 caracteres")
      .max(100, "Nome muito longo"),
    emailResponsavel: z
      .string()
      .trim()
      .email("E-mail inválido")
      .max(255, "E-mail muito longo"),
    telefoneResponsavel: z
      .string()
      .regex(
        /^\(\d{2}\)\s?\d{4,5}-\d{4}$/,
        "Telefone deve estar no formato (XX) XXXXX-XXXX"
      ),
    senha: z
      .string()
      .min(8, "Mínimo 8 caracteres")
      .regex(/[A-Z]/, "Inclua pelo menos uma letra maiúscula")
      .regex(/[a-z]/, "Inclua pelo menos uma letra minúscula")
      .regex(/[0-9]/, "Inclua pelo menos um número"),
    confirmarSenha: z.string(),
  })
  .refine((data) => data.senha === data.confirmarSenha, {
    message: "As senhas não coincidem",
    path: ["confirmarSenha"],
  });

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegistrationFormData = z.infer<typeof registrationSchema>;
