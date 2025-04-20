import { API_ENPOINT } from "~/constants/api-endpoints";
import type { IAuth } from "~/models/IAuth";

class AuthService {
  login(user: IAuth) {
    const { $axiosApi } = useNuxtApp();
    return $axiosApi.post(API_ENPOINT.LOGIN, { ...user }).then(
      (res) => Promise.resolve(res),
      (err) => Promise.reject(err)
    );
  }
}

export const authService = new AuthService();
