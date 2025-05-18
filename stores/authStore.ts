import { ROUTES } from "~/constants/routes";
import type { IUser, ILogin } from "~/models/IAuth";
import { authService } from "~/service-api/authService";

interface AuthState {
  is_athenticated: boolean;
  access_token: string | null;
  refresh_token: string | null;
}

interface TokenizationSate {
  accessToken: string | null;
  refreshToken: string | null;
}

export const useAuthStore = defineStore("authStore", {
  state: (): AuthState => {
    return {
      is_athenticated: false,
      access_token: null,
      refresh_token: null,
    };
  },
  getters: {
    isAuthenticated: (state: AuthState) => {
      return !!state.is_athenticated;
    },
    accessToken: (state: AuthState) => {
      return state.access_token;
    },
    refreshToken: (state: AuthState) => {
      return state.refresh_token;
    },
  },
  actions: {
    reset() {
      this.$reset();
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
    },
    setToken(dataToken: TokenizationSate) {
      this.access_token = dataToken.accessToken;
      this.refresh_token = dataToken.refreshToken;
      localStorage.setItem("accessToken", dataToken.accessToken || "");
      localStorage.setItem("refreshToken", dataToken.refreshToken || "");
    },
    setIsAthenticated(status: boolean) {
      this.is_athenticated = status;
    },
    async refresh() {
      try {
        const res = await authService.refreshToken();
        const {data, status} = res || {}
        if (status == 200) {
          this.setToken(data.data);
          this.setIsAthenticated(true);
          return true;
        }
      } catch (error) {
        console.error("error to refreshToken", error)
        this.reset();
        return Promise.reject(error);
      }
    },
    async login(user: ILogin) {
      try {
        const { data, status } = await authService.login({ ...user });
        if (status == 200) {
          const responseData = data.data;
          if (responseData) {
            this.setToken({
              accessToken: responseData.accessToken,
              refreshToken: responseData.refreshToken,
            });
            const userStore = useUserStore();
            userStore.saveUserInfo({
              id: responseData.id,
              email: responseData.email,
              role_id: responseData.roleId,
              full_name: responseData.fullName,
            });
            this.setIsAthenticated(true);
            if (responseData.roleId === 1) {
              navigateTo(ROUTES.MANAGE_ACCOUNT);
            } else {
              navigateTo(ROUTES.HOME);
            }
          }
        }
      } catch (error) {
        return Promise.reject(error);
      }
    },

    async register(user: IUser) {
      try {
        const { status, data } = await authService.register(user);
        if (status === 201) {
          useUserStore().saveEmail(user.email);
          return data.message;
        }
      } catch (error) {
        return Promise.reject(error);
      }
    },
  },
});
