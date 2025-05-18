import { useI18n } from "vue-i18n";

export const useTranslation = () => {
  const { t, locale } = useI18n();
  return { t, locale };
};
