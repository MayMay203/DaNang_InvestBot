import { z } from "zod";

export const getLoginSchema = (t: (key: string) => string) =>
  z.object({
    email: z.string().email({ message: t("auth.email_message") }),
    password: z
      .string()
      .min(8, { message: t("auth.password_message.min") })
      .regex(/[A-Z]/, { message: t("auth.password_message.uppercase") })
      .regex(/[a-z]/, { message: t("auth.password_message.lowercase") })
      .regex(/[0-9]/, { message: t("auth.password_message.number") })
      .regex(/[^A-Za-z0-9]/, { message: t("auth.password_message.special") }),
  });
