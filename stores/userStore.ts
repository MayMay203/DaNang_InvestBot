interface UserState {
  id: number | null;
  email: string | null;
  role_id: number | null;
  full_name: string | null;
}

export const useUserStore = defineStore("userStore", {
  state: (): UserState => {
    return {
      id: null,
      email: null,
      role_id: null,
      full_name: null,
    };
  },
  getters: {
    id: (state: UserState) => {
      return state.id;
    },
    email: (state: UserState) => {
      return state.email;
    },
    roleId: (state: UserState) => {
      return state.role_id;
    },
    fullName: (state: UserState) => {
      return state.full_name;
    },
  },
  actions: {
    reset() {
      this.$reset();
    },
    saveUserInfo(userInfo: UserState) {
      this.id = userInfo.id;
      this.email = userInfo.email;
      this.role_id = userInfo.role_id;
      this.full_name = userInfo.full_name;
    },
  },
});
