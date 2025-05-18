import { jwtDecode } from "jwt-decode";
import { ROUTES } from "~/constants/routes";

interface TokenPayload {
  id: number,
  fullName: string,
  email: string,
  exp: number;
  roleId: number;
}

const excludedUrls = [
  ROUTES.LOGIN,
  ROUTES.SIGNUP,
  ROUTES.FORGET_PASSWORD,
  ROUTES.VERIFY_OTP,
  ROUTES.OAUTH_SUCCESS,
];

export default defineNuxtRouteMiddleware(async (to) => {
  if (process.server) return;

  const publicPages = [ROUTES.RESET_PASSWORD];
  if (publicPages.includes(to.path)) return;

  const accessToken = localStorage.getItem("accessToken");
  const isExcluded = excludedUrls.includes(to.path);

  if (accessToken) {
    try {
      const decoded = jwtDecode<TokenPayload>(accessToken);
      const { roleId, id, email, fullName } = decoded;

      const userStore = useUserStore();
      if (!userStore.email || !userStore.id) {
        userStore.saveUserInfo({
          id,
          email,
          role_id: roleId,
          full_name: fullName,
        });
      }
      if (to.path.includes("manage")) {
        if (Number(roleId) !== 1) {
          return await navigateTo(ROUTES.HOME);
        }
      }

      if (isExcluded) {
        if (Number(roleId) !== 1) return await navigateTo(ROUTES.HOME);
        else return await navigateTo(ROUTES.MANAGE_ACCOUNT);
      }

      if (!isExcluded && !to.path.includes("manage")) {
        if (Number(roleId) === 1) {
          return await navigateTo(ROUTES.MANAGE_ACCOUNT);
        }
      }

      return;
    } catch (e) {
      console.error(e);
    }
  }

  if (!isExcluded) {
    return await navigateTo(ROUTES.LOGIN);
  }
});
