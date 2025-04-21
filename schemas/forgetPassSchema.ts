import { z } from "zod";

export const getForgetPassSchema = (t: (key: string) => string) =>
  z.object({
    email: z.string().email({ message: t("auth.email_message") }),
  });
