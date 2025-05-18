import axios, { type AxiosInstance, type AxiosResponse } from "axios";
import { ROUTES } from "~/constants/routes";
import { useToast } from "primevue/usetoast";

// axios plugin
export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig();
  const toast = useToast();
  const axiosInstance: AxiosInstance = axios.create({
    baseURL: config.public.apiBaseUrl,
    headers: {
      "Content-Type": "application/json",
    },
  });

  const refreshToken = async (response: AxiosResponse) => {
    const authStore = useAuthStore();
    const originalRequest: any = response.config;

    if (!originalRequest._retry && localStorage.getItem("refreshToken")) {
      originalRequest._retry = true;

      try {
        const reloadState = await authStore.refresh();
        if (reloadState) {
          originalRequest.headers.Authorization = `Bearer ${authStore.accessToken}`;
          return axiosInstance(originalRequest); // gọi lại request
        }
      } catch (e) {
        return Promise.reject(e);
      }
    }

    // toast.add({
    //   severity: "error",
    //   summary: "Expire Session",
    //   detail: "Expired đăng nhập!",
    //   life: 3000,
    // });
    authStore.reset();
    return navigateTo(ROUTES.LOGIN);
  };

  axiosInstance.interceptors.request.use(
    async (config) => {
      const excludedUrls = [
        "/auth/login",
        "/auth/register",
        "/auth/verify-otp",
        "/auth/forget-password",
      ];

      const lang = localStorage.getItem("lang") || "vi";
      config.headers["Accept-Language"] = lang;

      const isExcluded = excludedUrls.some((url) => config.url?.includes(url));
      if (config.url?.includes("/auth/refresh-token")) {
        config.headers.Authorization = `Bearer ${localStorage.getItem(
          "refreshToken"
        )}`;
      } else if (!isExcluded) {
        config.headers.Authorization = `Bearer ${localStorage.getItem(
          "accessToken"
        )}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  axiosInstance.interceptors.response.use(
    (response) => {
      return response;
    },
    async (error) => {
      console.error("error response", error);
      const originalRequest = error.config;

      if (error.response && error.response.status === 401) {
        if (originalRequest.url?.includes("/auth/refresh-token")) {
          const authStore = useAuthStore();
          authStore.reset();
          return await navigateTo(ROUTES.LOGIN);
        } else {
          return await refreshToken(error.response);
        }
      }

      return Promise.reject(error);
    }
  );

  return {
    provide: {
      axiosApi: axiosInstance,
    },
  };
});
