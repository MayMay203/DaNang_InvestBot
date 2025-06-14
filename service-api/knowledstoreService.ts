import { API_ENPOINT } from "~/constants/api-endpoints";
import type {
  IAddMaterialToKnowledgeStore,
  ICreateKnowledgeStore,
  IUpdate,
} from "~/models/IKnowledStore";
import type { IChangeStatus } from "~/models/IMaterial";

class KnowledgeStoreService {
  getDetailKnowledgeStore(id: number) {
    const { $axiosApi } = useNuxtApp();
    return $axiosApi.get(`${API_ENPOINT.DETAIL_KNOWLEDGE_STORE}/${id}`);
  }

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

  removeMaterialsFromKnowledgeStore(data: IAddMaterialToKnowledgeStore) {
    const { $axiosApi } = useNuxtApp();
    return $axiosApi.post(API_ENPOINT.REMOVE_MATERIAL_FROM_KNOWLEDGE_STORE, {
      ...data,
    });
  }

  changeStatusStore(data: IChangeStatus) {
    const { $axiosApi } = useNuxtApp();
    return $axiosApi.patch(API_ENPOINT.CHANGE_STATUS_STORE, { ...data });
  }

  updateKnowledgeStore(id: number, data: IUpdate) {
    const { $axiosApi } = useNuxtApp();
    return $axiosApi.patch(`${API_ENPOINT.UPDATE_KNOWLEDGE_STORE}/${id}`, { ...data });
  }

  deleteStore(id: number){
    const {$axiosApi} = useNuxtApp()
    return $axiosApi.delete(`${API_ENPOINT.DELETE_STORE}/${id}`)
  }
}

export const knowledgestoreService = new KnowledgeStoreService();
