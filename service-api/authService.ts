import { API_ENPOINT } from "~/constants/api-endpoints";
import type { IAuth } from "~/models/IAuth";

interface ApiResponse<T> {
  statusCode: number;
  message: string;
  data: T;
}

interface LoginResponse {
  id: number;
  email: string;
  roleId: number;
  fullName: string;
  accessToken: string;
  refreshToken: string;
}

class AuthService {
  login(user: IAuth): Promise<ApiResponse<LoginResponse | null>> {
    const { $axiosApi } = useNuxtApp();
    return $axiosApi.post(API_ENPOINT.LOGIN, { ...user });
  }
}

export const authService = new AuthService();
