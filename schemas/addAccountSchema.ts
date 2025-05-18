import { z } from "zod";

export const getAddAccountSchema = (t: (key: string) => string) =>
  z
    .object({
      email: z.string().email({ message: t("auth.email_message") }),
      fullName: z
        .string()
        .min(2, { message: t("auth.fullname_message.min") })
        .max(50, { message: t("auth.fullname_message.max") }),
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
