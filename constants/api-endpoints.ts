export const API_ENPOINT = {
  LOGIN: "/auth/login",
  REGISTER: "/auth/register",
  VERIFY_OTP: "/auth/verify-otp",
  RESEND_OTP: "/auth/resend-otp",
  FORGET_PASSWORD: "/auth/forget-password",
  CHANGE_PASSWORD: "/auth/change-password",
  RESET_PASSWORD: "/auth/reset-password",
  REFRESH_TOKEN: "/auth/refresh-token",
  MANAGE_ACCOUNT: "/manage-account/get-all-accounts",
  CHANGE_STATUS_ACCOUNT: "/manage-account/change-status-account",
  REGISTER_ACCOUNT: "/manage-account/register-account",
  GET_ALL_MATERIALS: "/material/get-all-materials",
  UPLOAD_MATERIAL: "/material/upload-material",
  DETAIL_MATERIAL: "/material",
  UPDATE_MATERIAL: "/material/update-material",
  CHANGE_STATUS_MATERIAL: "/material/change-status",
  DELETE_MATERIAL: "/material/delete",
  GET_ALL_KNOWLEDGE_STROE: "/knowledge-store/get-all",
  CREATE_KNOWLEDGE_STORE: "/knowledge-store/create",
  ADD_MATERIAL_TO_KNOWLEDGE_STORE: "/knowledge-store/add-materials",
  REMOVE_MATERIAL_FROM_KNOWLEDGE_STORE: "knowledge-store/remove-materials",
  LOGIN_GOOGLE: "/auth/login-with-google",
  CHANGE_STATUS_STORE: "/knowledge-store/change-status",
  DETAIL_KNOWLEDGE_STORE: "/knowledge-store",
  UPDATE_KNOWLEDGE_STORE: "/knowledge-store/update",
  DELETE_USER_MATERIAL: "/material/delete-user-material",
  SYNC_MATERIAL: "/material/sync-user-material",
  GET_ALL_CONVERSATIONS: "/conversation/get-all-conversations",
  GET_DETAIL_CONVERSATION: "/conversation/detail-conversation",
  DELETE_CONVERSATION: "/conversation/delete",
  ADD_NEW_CONVERSATION: "/conversation/create",
  SEND_TEXT_MESSAGE: "conversation/send-message",
  SEND_FILE_MESSAGE: "/conversation/send-file-question",
  GET_CONVERSATIONS_BY_ACCOUNT: '/conversation/get-conversations-by-account',
  SEARCH_CHAT: '/conversation/search-chat',
  DELETE_STORE: '/knowledge-store/delete-store'
};
