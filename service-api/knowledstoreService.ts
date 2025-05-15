import { API_ENPOINT } from "~/constants/api-endpoints";
import type {
  IAddMaterialToKnowledgeStore,
  ICreateKnowledgeStore,
} from "~/models/IKnowledStore";

class KnowledgeStoreService {
  getAllKnowledgeStore() {
    const { $axiosApi } = useNuxtApp();
    return $axiosApi.get(API_ENPOINT.GET_ALL_KNOWLEDGE_STROE);
  }

  createKnowledgeStore(data: ICreateKnowledgeStore) {
    const { $axiosApi } = useNuxtApp();
    return $axiosApi.post(API_ENPOINT.CREATE_KNOWLEDGE_STORE, { ...data });
  }

  addMaterialsToKnowledgeStore(data: IAddMaterialToKnowledgeStore) {
    const { $axiosApi } = useNuxtApp();
    return $axiosApi.post(API_ENPOINT.ADD_MATERIAL_TO_KNOWLEDGE_STORE, {
      ...data,
    });
  }

  asyncKnowledgeStore(id: number) {
    const { $axiosApi } = useNuxtApp();
    return $axiosApi.post(`${API_ENPOINT.ASYNC_KNOWLEDGE_STORE}?id=${id}`);
  }
}

export const knowledgestoreService = new KnowledgeStoreService();
