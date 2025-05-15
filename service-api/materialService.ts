import { API_ENPOINT } from "~/constants/api-endpoints"
import type { IChangeStatus, Material } from "~/models/IMaterial";

class MaterialService{
    getAllMaterials(store="empty") {
        const { $axiosApi } = useNuxtApp()
        const url = store ? `${API_ENPOINT.GET_ALL_MATERIALS}?store=${store}` : API_ENPOINT.GET_ALL_MATERIALS
        return $axiosApi.get(url)
    }

    async uploadMaterial(formData:any) {
        const { $axiosApi } = useNuxtApp();
        $axiosApi.post(API_ENPOINT.UPLOAD_MATERIAL, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
    }

    getDetailMaterial(id:number) {
        const { $axiosApi } = useNuxtApp()
        return $axiosApi.get(`${API_ENPOINT.DETAIL_MATERIAL}/${id}`);
    }

    updateMaterial(materialData:Material) {
        const {id, name, description, text, url} = materialData
        const { $axiosApi } = useNuxtApp();
        return $axiosApi.post(`${API_ENPOINT.UPDATE_MATERIAL}/${id}`, {name, description, text, url});
    }

    changeStatusMaterial(data: IChangeStatus) {
        const { $axiosApi } = useNuxtApp();
        return $axiosApi.post(API_ENPOINT.CHANGE_STATUS_MATERIAL, { ...data });
    }
}

export const materialService = new MaterialService()