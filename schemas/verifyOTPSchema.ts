import { z } from "zod";

export const getVerifySchema = (t: (key: string) => string) => {
  return z.object({
    OTP: z
      .string()
      .length(6, { message: t("auth.invalid_OTP") })
      .regex(/^\d{6}$/, { message: t("auth.invalid_OTP") }),
  });
};
