import { API_ENPOINT } from "~/constants/api-endpoints";
import type { IChangeStatus, IRegisterAccount } from "~/models/IAccount";

class AccountService {
  getAllAccounts() {
    const { $axiosApi } = useNuxtApp();
    return $axiosApi.get(API_ENPOINT.MANAGE_ACCOUNT);
  }

  changeStatusAccount(data: IChangeStatus) {
    const { $axiosApi } = useNuxtApp();
    return $axiosApi.post(API_ENPOINT.CHANGE_STATUS_ACCOUNT, { ...data });
  }

  registerAccount(accountInfo: IRegisterAccount) {
    const { $axiosApi } = useNuxtApp();
    return $axiosApi.post(API_ENPOINT.REGISTER_ACCOUNT, { ...accountInfo });
  }
}

export const accountService = new AccountService();
