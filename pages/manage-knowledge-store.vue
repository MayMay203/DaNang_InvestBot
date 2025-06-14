<script setup>
import { FilterMatchMode, FilterOperator } from "@primevue/core/api";
import BaseButton from "~/components/base-components/BaseButton.vue";
import { knowledgestoreService } from "~/service-api/knowledstoreService";
import dayjs from "dayjs";
import { materialService } from "~/service-api/materialService";
import BaseIcon from "~/components/base-components/BaseIcon.vue";

definePageMeta({
  layout: "admin",
});

const { t } = useTranslation()
const toast = useToast()
const confirm = useConfirm();
const filters = ref({ value: null });
const loading = ref(false);
const first = ref(0);
const isStoreVisible = ref(false)
const knowledgeStores = ref([])
const newStoreData = reactive({ id: null, name: '', description: '' })
const selectedStoreId = ref()
const addMaterialDialog = ref(false)
const materialList = ref([])
const selectedMaterials = ref([])
const initialMaterialIds = ref([])
const updatedStatus = ref({ status: null, id: null })
const isVisibleDetail = ref(false)
const detailMaterial = ref()
const isEditStoreVisible = ref(false)

const onPage = (event) => {
  first.value = event.first;
};

const initFilters = () => {
  filters.value = {
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    name: {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
    },
    description: {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }],
    },
    materialType: {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
    },
    updatedAt: {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
    },
    access: {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
    },
    active: {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
    },
  };
};

initFilters();

const clearFilter = () => {
  initFilters();
};

const fetchAllMaterialsByStore = async () => {
  try {
    const {data} = await materialService.getAllMaterials(`empty/${selectedStoreId.value}`) || {}
    materialList.value = data?.data
  }
  catch (error) {
    console.error(error)
  }
}

const fetchAllKnowledgeStores = async () => {
  try {
    const { data } = await knowledgestoreService.getAllKnowledgeStore()
    knowledgeStores.value = data.data?.map(item => ({
      ...item,
      updatedAt: dayjs(item.updatedAt).format('HH:mm:ss DD-MM-YYYY')
    }))
  }
  catch (error) {
    console.error(error)
  }
}

const handleSaveActionStore = async() => {
  try {
    if (!isEditStoreVisible.value) {
      await knowledgestoreService.createKnowledgeStore({...newStoreData})
    }
    else {
      const {id, name, description} = newStoreData
      await knowledgestoreService.updateKnowledgeStore(id, { name, description })
    }

    await fetchAllKnowledgeStores()
    newStoreData = {id: null, name: '', description: ''}
    toast.add({ severity: 'success', summary: t("toast.success"), detail: t("toast.message_success"), life: 3000 })
  }
  catch (error) {
    console.error(error)
    toast.add({ severity: 'error', summary: t("toast.error"), detail: error.response?.data?.message || t("toast.message_error"), life: 3000 })
  }
  finally{
    isStoreVisible.value = false
  }
}

const handleAddMaterialsToStore = async (id) => {
  try {
    selectedStoreId.value = id
    await fetchAllMaterialsByStore()
    const res = await materialService.getAllMaterials(id)
    initialMaterialIds.value = res.data.data.map(item => item.id)
    selectedMaterials.value = materialList.value.filter(item => initialMaterialIds.value.includes(item.id))
    addMaterialDialog.value = true
  }
  catch (error) {
    console.error(error)
  }
}

const handleSave = async () => {
  try {
    const selectedMaterialsIds = selectedMaterials.value.map(item => item.id)
    const addedMaterialIds = selectedMaterialsIds
      .filter(id => !initialMaterialIds.value.includes(id))
    const deletedMaterialIds = initialMaterialIds.value.filter(id => !selectedMaterialsIds.includes(id))
    // case add
    if (addedMaterialIds.length) {
      const payload = {knowledgeStoreId: selectedStoreId.value, materialIds: [...addedMaterialIds]}
      await knowledgestoreService.addMaterialsToKnowledgeStore({ ...payload })
    }
    // case delete
    if (deletedMaterialIds.length) {
      const payload = {knowledgeStoreId: selectedStoreId.value, materialIds:[...deletedMaterialIds]}
      await knowledgestoreService.removeMaterialsFromKnowledgeStore({...payload})
    }

    await fetchAllKnowledgeStores()
    toast.add({ severity: 'success', summary: t("toast.success"), detail: t("toast.message_success"), life: 3000 })
  }
  catch (error) {
    console.error(error)
    toast.add({ severity: 'error', summary: t("toast.error"), detail: t("toast.message_error"), life: 3000 })
  }
  finally {
    addMaterialDialog.value = false
  }
}

const handleDeleteMaterial = async (materialId) => {
  selectedMaterials.value = selectedMaterials.value.filter(item => item.id !== materialId)
}

const handleCancel = () => {
  const material = knowledgeStores.value.find(item => item.id === updatedStatus.value.id);
  if (material) {
    material.isActive = !updatedStatus.value.status;
  }
}

const handleToggleKnowledgeStore = async () => {
  try {
    const store = knowledgeStores.value.find(store => store.id == updatedStatus.value.id);

    if (store) {
      store.isActive = updatedStatus.value.status;
    }

    await knowledgestoreService.changeStatusStore(updatedStatus.value)

    toast.add({
      severity: "success",
      summary: t("toast.success"),
      detail: t("toast.message_success"),
      life: 3000,
    });
  }
  catch (error) {
    console.log(error)
    handleCancel()
    toast.add({
      severity: "error",
      summary: t("toast.error"),
      detail: t("toast.message_error"),
      life: 3000,
    });
  }
}

const toggleActive = (value, materialData) => {
  updatedStatus.value = {
        status: value,
        id: materialData.id,
  };

  const store = knowledgeStores.value.find(item => item.id === updatedStatus.value.id);
  if (store) {
    store.isActive = value;
  }
      
  confirm.require({
    message: t('toast.message_toggle_material'),
    header: t('toast.confirm'),
    icon: 'pi pi-exclamation-triangle',
    rejectProps: {
      label: t('action.cancel'),
      severity: 'secondary',
      outlined: true
    },
    acceptProps: {
      label: t('action.toggle_status')
    },
    accept: async () => {
      await handleToggleKnowledgeStore()
    },
    reject: () => {
      handleCancel()
    }
  });
}

const handleShowDetailMaterial = async (id) => {
  try {
    const res = await materialService.getDetailMaterial(id)
    detailMaterial.value = res.data.data
    isVisibleDetail.value = true
  }
  catch(error){
    console.error(error)
  }
}

const handleEditKnowledgeStore = async (id) => {
  try {
    const { data } = await knowledgestoreService.getDetailKnowledgeStore(id)
    newStoreData.value = data.data
    isEditStoreVisible.value = true
    isStoreVisible.value = true
  }
  catch (error) {
    console.error(error)
  }
}

const handleCloseStore = () => {
  isStoreVisible.value = false
  isEditStoreVisible.value = false
}

onMounted(async () => {
  await fetchAllKnowledgeStores()
})
</script>

<template>
  <div>
    <DataTable
      v-model:filters="filters"
      showGridlines
      :value="knowledgeStores"
      resizableColumns columnResizeMode="fit"
      paginator
      :rows="8"
      :first="first"
      @page="onPage"
      :rowsPerPageOptions="[5, 10, 20, 50]"
      tableStyle="min-width: 50rem"
      filterDisplay="menu"
      :loading="loading"
      :globalFilterFields="['name', 'description', 'createdBy', 'updatedAt', 'status', 'active']"
    >
      <template #header>
        <div class="flex justify-between">
          <div class="flex flex-1 gap-[20px] items-center">
            <Button
              type="button"
              icon="pi pi-filter-slash"
              label="Clear"
              outlined
              @click="clearFilter()"
            />
            <IconField>
              <InputIcon>
                <i class="pi pi-search" />
              </InputIcon>
              <InputText
                v-model="filters['global'].value"
                placeholder="Keyword Search"
              />
            </IconField>
          </div>
         <BaseButton
            left-icon="add_circle"
            :text="t('management.create')"
            width="140px"
            height="42px"
            sizeIcon="22px"
            @click="isStoreVisible = true"
          ></BaseButton>
        </div>
      </template>
      <Column :header="t('management.order')" style="width: 5%">
        <template #body="{ index }">
          {{ first + index + 1 }}
        </template>
      </Column>
      <Column field="name" :header="t('management.store.name')" style="width: 15%" search>
        <template #filter="{ filterModel }">
          <InputText
            v-model="filterModel.value"
            type="text"
            placeholder="Search by name"
          />
        </template>
      </Column>
      <Column field="description" :header="t('management.store.description')" style="width: 25%">
        <template #filter="{ filterModel }">
          <InputText
            v-model="filterModel.value"
            type="text"
            placeholder="Search by email"
          />
        </template>
      </Column>
      <Column field="updatedAt" :header="t('management.store.updatedAt')" style="width: 20%"></Column>
      <Column field="isActive" :header="t('management.store.active')" style="width: 10%">
        <template #body="slotProps">
          <ToggleSwitch 
            :modelValue="slotProps.data.isActive" 
            @update:modelValue="(value) => toggleActive(value, slotProps.data)"  />
        </template>
      </Column>
      <Column
        field="numberMaterials"
        :header="t('management.store.number_materials')"
        style="width: 10%"
        headerClass="text-center"
      >
        <template #body="slotProps">
          <div class="text-center w-full">
            {{ slotProps.data.numberMaterials }}
          </div>
        </template>
      </Column>
      <Column style="width: 20%">
        <template #body="slotProps">
          <div class="flex gap-[4px]">
            <BaseButton
              left-icon="add"
              :text="t('management.store.material')"
              variant="outline"
              color="#065076"
              width="110px"
              height="30px"
              sizeIcon="12px"
              border-color="#065076"
              @click="handleAddMaterialsToStore(slotProps.data.id)"
            ></BaseButton>
            <BaseButton
              left-icon="edit"
              :text="t('management.edit')"
              variant="outline"
              color="red"
              width="80px"
              height="30px"
              sizeIcon="18px"
              border-color="red"
              @click="handleEditKnowledgeStore(slotProps.data.id)"
            ></BaseButton>
          </div>
        </template>
      </Column>
    </DataTable>
    <!-- Modal add new knowledge store -->
      <Dialog v-model:visible="isStoreVisible" modal :header="t('management.store.create_new_knowledge_store')" :style="{ width: '35rem' }">
    <div class="flex flex-col gap-4 mb-4">
        <label for="name" class="font-medium w-24 text-[15px]">{{ t('management.store.name') }}</label>
        <InputText v-model="newStoreData.name" id="name" class="flex-auto" autocomplete="off" />
    </div>
     <div class="flex flex-col gap-4 mb-4">
        <label for="content" class="font-medium w-24 text-[15px]">{{ t('management.store.description') }}</label>
        <Textarea v-model="newStoreData.description" rows="3" class="w-[100%]" required/>
    </div>
    <div class="flex justify-end gap-4">
        <Button type="button" :label="t('action.cancel')" severity="secondary" @click="handleCloseStore"></Button>
        <Button type="button" :label="t('action.save')" @click="handleSaveActionStore" :disabled="!newStoreData.name || !newStoreData.description"></Button>
    </div>
    </Dialog>
    <!-- Modal add material for knowledge store -->
    <Dialog 
      v-model:visible="addMaterialDialog"   
      modal
      :draggable="false"
      :closable="true"
      :header="t('management.store.add_materials_to_store')"
      :style="{ width: '80vw', height: '100vh' }"
      contentStyle="height: calc(100vh - 3rem); overflow: auto">
      <div class="flex flex-col lg:flex-row gap-4">
        <div class="flex flex-1 flex-col gap-4 mb-4 w-full">
          <label for="name" class="font-medium w-50 text-[15px]">{{ t('management.store.materials') }}</label>
          <MultiSelect v-model="selectedMaterials" showClear :options="materialList" optionLabel="name" filter :placeholder="t('management.store.materials')" :maxSelectedLabels="3" class="w-full" />
        </div>
        <div class="flex flex-1 flex-col gap-4 mb-2">
          <label for="list" class="font-medium w-50 text-[15px]">
            {{ t('management.store.selected_list') }}
          </label>

          <div class="flex flex-col gap-3 bg-white border border-[#cbd5e1] p-5 rounded-xl min-h-[40vh] max-h-[52vh] relative overflow-auto shadow-sm">
            <div
              v-if="selectedMaterials.length === 0"
              class="absolute inset-0 flex items-center justify-center text-gray-500 text-sm"
            >
              {{ t('management.store.no_material_selected') }}
            </div>
            <TransitionGroup name="fade-list" tag="div">
              <div
                v-for="material in selectedMaterials"
                :key="material.id"
                class="flex justify-between items-center gap-3 p-3 border border-gray-300 rounded-lg bg-gray-50 hover:bg-gray-100 transition-all duration-200 my-2 cursor-pointer"
                @click="handleShowDetailMaterial(material.id)"
              >
                <div class="flex gap-3 items-center">
                  <BaseIcon
                    :name="material.materialType.id === 1 ? 'file' : material.materialType.id === 2 ? 'text' : 'url'"
                    size-icon="20px"
                  />
                  <div class="flex flex-col">
                    <span class="text-sm font-medium text-gray-800 truncate max-w-[240px]">
                      {{ material.name }}
                    </span>
                    <span
                      class="text-xs font-medium"
                      :class="{
                        'text-green-600': material.accessLevel.name === 'Public',
                        'text-blue-600': material.accessLevel.name === 'Internal',
                        'text-red-500': material.accessLevel.name === 'Private',
                      }"
                    >
                      {{ material.accessLevel.name }}
                    </span>
                  </div>
                </div>

                <BaseIcon
                  name="delete"
                  size-icon="20px"
                  class="text-gray-600 hover:text-red-500 cursor-pointer"
                  @click="handleDeleteMaterial(material.id)"
                />
              </div>
            </TransitionGroup>
          </div>
        </div>
      </div>
      <div class="flex justify-end items-center gap-4 mt-[30px]">
          <Button type="button" :label="t('action.cancel')" severity="secondary" @click="addMaterialDialog = false"></Button>
          <Button type="button" :label="t('action.save')" @click="handleSave" :disabled="!selectedMaterials?.length"></Button>
      </div>
    </Dialog>
    <!-- dialog show detail material -->
    <Dialog
      v-model:visible="isVisibleDetail"
      :header="t('management.material.detail_material')"
      :modal="true"
      :maximizable="true"
      :maximized="true"
      :closable="true"
      :dismissableMask="true"
      @hide="isVisibleDetail = false"
    >
      <div class="p-3 lg:p-6 space-y-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="space-y-2">
            <div>
              <span class="font-semibold">{{ t('management.material.name') }}: </span>
              <span class="text-gray-700">{{ detailMaterial.name }}</span>
            </div>
            <div>
              <span class="font-semibold">{{ t('management.material.description') }}: </span>
              <span class="text-gray-700">{{ detailMaterial.description }}</span>
            </div>
            <div>
              <span class="font-semibold">{{ t('management.material.active') }}: </span>
              <span :class="detailMaterial.isActive ? 'text-green-600' : 'text-red-600'">
                {{ detailMaterial.isActive ? t('management.material.active_status') : t('management.material.deactive_status') }}
              </span>
            </div>
          </div>
          <div class="space-y-2">
            <div>
              <span class="font-semibold">
                {{ t('management.material.access') }}:
              </span>
              <span
                class="px-2 py-0.5 rounded-md text-sm font-medium"
                :class="{
                  'text-green-700 bg-green-100': detailMaterial.accessLevel.name === 'public',
                  'text-blue-700 bg-blue-100': detailMaterial.accessLevel.name === 'internal',
                  'text-red-700 bg-red-100': detailMaterial.accessLevel.name === 'private'
                }"
              >
                {{ detailMaterial.accessLevel.name }}
              </span>
            </div>
            <div>
              <span class="font-semibold">{{ t('management.material.knowledge_store') }}: </span>
              <span class="text-gray-700">
                {{ detailMaterial.knowledgeStore ? detailMaterial.knowledgeStore.name : t('management.material.none') }}
              </span>
            </div>
            <div>
              <span class="font-semibold">{{ t("management.material.updatedAt") }}: </span>
              <span class="text-gray-700">{{ dayjs(detailMaterial.updatedAt).format("HH:mm:ss DD-MM-YYYY") }}</span>
            </div>
          </div>
        </div>

        <div>
          <p class="font-semibold mb-2">{{ t('management.material.view_material') }}:</p>
          <iframe
          v-if="detailMaterial.materialType.id !== 2 && detailMaterial.materialType.id !== 3"
          :src="`${detailMaterial.url.split('/view')[0]}/preview`"
          class="w-full h-[500px] border rounded-md shadow"
        />

        <div
          v-else-if="detailMaterial.materialType.id === 2"
          class="w-full min-h-[500px] border rounded-md shadow px-3 py-3 lg:px-6 lg:py-4"
        >
          {{ detailMaterial.text }}
        </div>

        <div
          v-else-if="detailMaterial.materialType.id === 3"
          class="w-full min-h-[150px] border rounded-xl shadow px-3 py-3 lg:px-6 lg:py-4 bg-gray-50 hover:bg-gray-100 transition-all duration-200"
        >
          <a
            :href="detailMaterial.url"
            target="_blank"
            rel="noopener noreferrer"
            class="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 text-blue-600 hover:text-blue-800 w-full break-words"
          >
            <div class="text-2xl">🌐</div>
            <div class="flex-1 w-full">
              <p class="font-semibold text-lg mb-1">Mở liên kết:</p>
              <p class="text-sm text-gray-700 w-full break-words">{{ detailMaterial.url }}</p>
            </div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              class="w-5 h-5"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M14 3h7v7m0 0L10 21l-7-7 11-11z"
              />
            </svg>
          </a>
        </div>
      </div>
    </div>
  </Dialog>
  </div>
</template>
