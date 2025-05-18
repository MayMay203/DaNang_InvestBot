<script setup>
import { ROUTES } from "~/constants/routes";
import { jwtDecode } from "jwt-decode";

// Lấy token từ query string
const route = useRoute();
const authStore = useAuthStore();
const toast = useToast();

const handleGetToken = () => {
  const accessToken = route.query.accessToken;
  const refreshToken = route.query.refreshToken;
  if (accessToken && refreshToken) {
    try {
      const decoded = jwtDecode(accessToken);
      const { id, fullName, email, roleId } = decoded || {};
      authStore.setToken({
        accessToken,
        refreshToken,
      });
      const userStore = useUserStore();
      console.log(email);
      userStore.saveUserInfo({
        id,
        email,
        role_id: roleId,
        full_name: fullName,
      });
      authStore.setIsAthenticated(true);
      navigateTo(ROUTES.HOME);
    } catch (error) {
      console.error("error", error);
      toast.add({
        severity: "error",
        summary: t("toast.error"),
        detail: error.message,
        life: 3000,
      });
    }
  }
};

onMounted(() => {
  handleGetToken();
});
</script>

<template>
  <div
    class="flex justify-center items-center h-screen bg-[rgba(74,144,226,0.1)]"
  >
    <ProgressSpinner />
  </div>
</template>
