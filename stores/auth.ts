interface AuthState {
  is_athenticated: boolean;
  access_token: string | null;
  refresh_token: string | null;
}

interface TokenizationSate {
  token: string | null;
  refreshToken: string | null;
}

export const useAuthStore = defineStore("websiteStore", {
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
      return state.access_token;
    },
  },
  actions: {
    reset() {
      this.$reset();
    },
    setToken(dataToken: TokenizationSate) {
      this.access_token = dataToken.token;
      this.refresh_token = dataToken.refreshToken;
    },
  },
});
