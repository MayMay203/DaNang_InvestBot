import type { IAuth } from "~/models/IAuth";
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
    },
    setToken(dataToken: TokenizationSate) {
      this.access_token = dataToken.accessToken;
      this.refresh_token = dataToken.refreshToken;
      localStorage.setItem('accessToken', dataToken.accessToken || '')
      localStorage.setItem('refreshToken', dataToken.refreshToken || '');
    },
    setIsAthenticated(status: boolean) {
      this.is_athenticated = status;
    },
    async login(user: IAuth) {
      try {
        const { data, statusCode } = await authService.login({ ...user });
        if (statusCode == 200) {
          if (data) {
            this.setToken({
              accessToken: data.accessToken,
              refreshToken: data.refreshToken,
            });
            const userStore = useUserStore();
            userStore.saveUserInfo({
              id: data.id,
              email: data.email,
              role_id: data.roleId,
              full_name: data.fullName,
            });
            this.setIsAthenticated(true);
          }
        }
      } catch (error) {
        return Promise.reject(error);
      }
    },
  },
});
