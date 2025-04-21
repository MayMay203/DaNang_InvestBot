import { z } from "zod";

export const getResetPassSchema = (t: (key: string) => string) => {
  return z
    .object({
      password: z
        .string()
        .min(8, { message: t("auth.password_message.min") })
        .regex(/[A-Z]/, { message: t("auth.password_message.uppercase") })
        .regex(/[a-z]/, { message: t("auth.password_message.lowercase") })
        .regex(/[0-9]/, { message: t("auth.password_message.number") })
        .regex(/[^A-Za-z0-9]/, { message: t("auth.password_message.special") }),
      confirmPassword: z
        .string()
        .min(8, { message: t("auth.password_message.min") })
        .regex(/[A-Z]/, { message: t("auth.password_message.uppercase") })
        .regex(/[a-z]/, { message: t("auth.password_message.lowercase") })
        .regex(/[0-9]/, { message: t("auth.password_message.number") })
        .regex(/[^A-Za-z0-9]/, { message: t("auth.password_message.special") }),
    })
    .refine((data) => data.password === data.confirmPassword, {
      path: ["confirmPassword"],
      message: t("auth.confirm_password_message"),
    });
};
