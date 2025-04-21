import axios, { type AxiosInstance } from "axios";

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig();
  const axiosInstance: AxiosInstance = axios.create({
    baseURL: config.public.apiBaseUrl,
    headers: {
      "Content-Type": "application/json",
    },
  });

  axiosInstance.interceptors.request.use(
    async (config) => {
      const authStore = useAuthStore();

      const excludedUrls = [
        "/auth/login",
        "/auth/register",
        "/auth/refresh-token",
        "/auth/verify-otp",
        "/auth/forget-password",
      ];

      const isExcluded = excludedUrls.some((url) => config.url?.includes(url));
      if (!isExcluded && authStore.accessToken) {
        config.headers.Authorization = `Bearer ${authStore.accessToken}`;
      }

      return config;
    },
    (error) => Promise.reject(error)
  );

  axiosInstance.interceptors.response.use(
    function (response) {
      return response.data;
    },
    function (error) {
      return Promise.reject(error);
    }
  );

  return {
    provide: {
      axiosApi: axiosInstance,
    },
  };
});
