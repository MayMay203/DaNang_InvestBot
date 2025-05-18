import { API_ENPOINT } from "~/constants/api-endpoints";
import type {
  ILogin,
  IUser,
  IOTP,
  IChangePass,
  IResetPass,
} from "~/models/IAuth";

class AuthService {
  login(user: ILogin) {
    const { $axiosApi } = useNuxtApp();
    return $axiosApi.post(API_ENPOINT.LOGIN, { ...user });
  }

  register(user: IUser) {
    const { $axiosApi } = useNuxtApp();
    return $axiosApi.post(API_ENPOINT.REGISTER, { ...user });
  }

  verifyOTP(data: IOTP) {
    const { $axiosApi } = useNuxtApp();
    return $axiosApi.post(API_ENPOINT.VERIFY_OTP, { ...data });
  }

  resendOTP(email: string) {
    const { $axiosApi } = useNuxtApp();
    return $axiosApi.post(`${API_ENPOINT.RESEND_OTP}?email=${email}`);
  }

  forgetPassword(email: string) {
    const { $axiosApi } = useNuxtApp();
    return $axiosApi.post(`${API_ENPOINT.FORGET_PASSWORD}?email=${email}`);
  }

  changePassword(data: IChangePass) {
    const { $axiosApi } = useNuxtApp();
    return $axiosApi.post(API_ENPOINT.CHANGE_PASSWORD, { ...data });
  }

  resetPassword(data: IResetPass) {
    const { $axiosApi } = useNuxtApp();
    return $axiosApi.post(API_ENPOINT.RESET_PASSWORD, { ...data });
  }

  refreshToken() {
    const { $axiosApi } = useNuxtApp();
    return $axiosApi.post(API_ENPOINT.REFRESH_TOKEN);
  }
}

export const authService = new AuthService();
