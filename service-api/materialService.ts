import { API_ENPOINT } from "~/constants/api-endpoints"
import type { IChangeStatus, Material } from "~/models/IMaterial";

class MaterialService {
  getAllMaterials(store = "empty", role?: string) {
    const { $axiosApi } = useNuxtApp();

    const queryParams = new URLSearchParams();
    queryParams.append("store", store);

    if (role) {
      queryParams.append("role", role);
    }

    const url = `${API_ENPOINT.GET_ALL_MATERIALS}?${queryParams.toString()}`;
    return $axiosApi.get(url);
  }

  async uploadMaterial(formData: any) {
    const { $axiosApi } = useNuxtApp();
    return $axiosApi.post(API_ENPOINT.UPLOAD_MATERIAL, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  }

  getDetailMaterial(id: number) {
    const { $axiosApi } = useNuxtApp();
    return $axiosApi.get(`${API_ENPOINT.DETAIL_MATERIAL}/${id}`);
  }

  updateMaterial(materialData: Material) {
    const { id, name, description, text, url } = materialData;
    const { $axiosApi } = useNuxtApp();
    return $axiosApi.post(`${API_ENPOINT.UPDATE_MATERIAL}/${id}`, {
      name,
      description,
      text,
      url,
    });
  }

  changeStatusMaterial(data: IChangeStatus) {
    const { $axiosApi } = useNuxtApp();
    return $axiosApi.patch(API_ENPOINT.CHANGE_STATUS_MATERIAL, { ...data });
  }

  deleteMaterial(id: number) {
    const { $axiosApi } = useNuxtApp();
    return $axiosApi.delete(`${API_ENPOINT.DELETE_MATERIAL}/${id}`);
  }

  deleteUserMaterial(id: number) {
    const { $axiosApi } = useNuxtApp();
    return $axiosApi.delete(`${API_ENPOINT.DELETE_USER_MATERIAL}/${id}`);
  }

  syncMaterial(id: number) {
    const { $axiosApi } = useNuxtApp();
    return $axiosApi.post(`${API_ENPOINT.SYNC_MATERIAL}/${id}`);
  }
}

export const materialService = new MaterialService()