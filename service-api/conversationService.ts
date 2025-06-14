import { API_ENPOINT } from "~/constants/api-endpoints";
import type { ITextQuery } from "~/models/IConversation";

class ConversationService {
  getAllConversations() {
    const { $axiosApi } = useNuxtApp();
    return $axiosApi.get(API_ENPOINT.GET_ALL_CONVERSATIONS);
  }

  getDetailConversation(id: number) {
    const { $axiosApi } = useNuxtApp();
    return $axiosApi.get(`${API_ENPOINT.GET_DETAIL_CONVERSATION}/${id}`);
  }

  addNewConversation(accountId: number) {
    const { $axiosApi } = useNuxtApp();
    return $axiosApi.post(
      `${API_ENPOINT.ADD_NEW_CONVERSATION}?accountId=${accountId}`
    );
  }

  deleteConversation(id: number) {
    const { $axiosApi } = useNuxtApp();
    return $axiosApi.delete(`${API_ENPOINT.DELETE_CONVERSATION}/${id}`);
  }

  sendMessage(data: ITextQuery) {
    const { $axiosApi } = useNuxtApp();
    return $axiosApi.post(API_ENPOINT.SEND_TEXT_MESSAGE, data);
  }

  sendFileMessage(formData: any) {
    const { $axiosApi } = useNuxtApp();
    return $axiosApi.post(API_ENPOINT.SEND_FILE_MESSAGE, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      }
    });
  }

  getConversationByAccount(id: number) {
    const { $axiosApi } = useNuxtApp();
    return $axiosApi.get(`${API_ENPOINT.GET_CONVERSATIONS_BY_ACCOUNT}/${id}`);
  }

  searchChat(searchText: string, accountId: number) {
    const { $axiosApi } = useNuxtApp();
    const body = { searchText, accountId }
    return $axiosApi.post(`${API_ENPOINT.SEARCH_CHAT}`, body);
  }
}
export const conversationService = new ConversationService();
