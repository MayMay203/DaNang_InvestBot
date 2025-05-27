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
const filters = ref({ value: null });
const loading = ref(false);
const first = ref(0);
const isStoreVisible = ref(false)
const knowledgeStores = ref([])
const newStoreData = reactive({ name: '', description: '' })
const selectedStoreId = ref()
const addMaterialDialog = ref(false)
const materialList = ref([])
const selectedMaterials = ref([])

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
    const {data} = await materialService.getAllMaterials("empty") || {}
    materialList.value = data?.data
  }
  catch (error) {
    console.error(error)
  }
}

const fetchAllKnowledgeStores = async () => {
  try {
    const { data } = await knowledgestoreService.getAllKnowledgeStore()
    knowledgeStores.value = data.data.map(item => ({
      ...item,
      updatedAt: dayjs(item.updatedAt).format('HH:mm:ss DD-MM-YYYY')
    }))
  }
  catch (error) {
    console.error(error)
  }
}

const handleAddNewStore = async() => {
  try {
    await knowledgestoreService.createKnowledgeStore({...newStoreData})
    await fetchAllKnowledgeStores()
    toast.add({ severity: 'success', summary: t("toast.success"), detail: t("toast.message_success"), life: 3000 })
  }
  catch (error) {
    console.error(error)
    toast.add({ severity: 'error', summary: t("toast.error"), detail: t("toast.message_error"), life: 3000 })
  }
  finally{
    isStoreVisible.value = false
  }
}

const handleAddMaterialsToStore = async (id) => {
  try {
    selectedStoreId.value = id
    addMaterialDialog.value = true
  }
  catch (error) {
    console.error(error)
  }
}

const handleAddMaterialToStore = async () => {
  try {
    const materialData = {knowledgeStoreId: selectedStoreId.value, materialIds: [...selectedMaterials.value.map(item => item.id)]}
    await knowledgestoreService.addMaterialsToKnowledgeStore({ ...materialData })
    await fetchAllMaterialsByStore()
    selectedMaterials.value = []
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

onMounted(async () => {
  await fetchAllKnowledgeStores()
  await fetchAllMaterialsByStore()
})
</script>

<template>
  <div>
    <DataTable
      v-model:filters="filters"
      showGridlines
      :value="knowledgeStores"
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
      <Column field="status" :header="t('management.store.status')" style="width: 10%"></Column>
      <Column field="isActive" :header="t('management.store.active')" style="width: 10%">
        <template #body="slotProps">
          <ToggleSwitch v-model="slotProps.data.isActive" />
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
        <Button type="button" :label="t('action.cancel')" severity="secondary" @click="isStoreVisible = false"></Button>
        <Button type="button" :label="t('action.save')" @click="handleAddNewStore" :disabled="!newStoreData.name || !newStoreData.description"></Button>
    </div>
    </Dialog>
    <!-- Modal add material for knowledge store -->
    <Dialog v-model:visible="addMaterialDialog" modal :header="t('management.store.add_materials_to_store')" :style="{ width: '35rem' }">
     <div class="flex flex-col gap-4 mb-4">
        <label for="name" class="font-medium w-50 text-[15px]">{{ t('management.store.materials') }}</label>
        <MultiSelect v-model="selectedMaterials" showClear :options="materialList" optionLabel="name" filter :placeholder="t('management.store.materials')" :maxSelectedLabels="3" class="w-full md:w-80" />
    </div>
    <div class="flex flex-col gap-4 mb-2" v-if="selectedMaterials?.length > 0">
      <label for="list" class="font-medium w-50 text-[15px]">{{ t('management.store.selected_list') }}</label>
      <div class="flex flex-col gap-3 bg-[white] border-[1px] border-[#cbd5e1] px-[40px] py-[30px] rounded-[10px]">
        <div v-for="material in selectedMaterials"  class="flex justify-between gap-1 border-[1px] border-[rgba(0,0,0,0.2)] px-3 py-2 rounded-[8px] items-center" :key="material.id">
          <div class="flex gap-2">
            <BaseIcon :name="material.materialType.id === 1 ? 'file' : material.materialType.id === 2 ? 'text' : 'url'" size-icon="20px"></BaseIcon>
            <div class="flex flex-col gap-[4px]">
              <span class="text-[13px]">{{ material.name }}</span>
              <span class="text-[13px] text-[rgba(0,0,0,0.5)]">{{ material.accessLevel.name}}</span>
            </div>
          </div>
          <BaseIcon name="delete" size-icon="20px" cursor="pointer" @click="handleDeleteMaterial(material.id)"></BaseIcon>
        </div>
      </div>
    </div>
    <div class="flex justify-end gap-4">
        <Button type="button" :label="t('action.cancel')" severity="secondary" @click="addMaterialDialog = false"></Button>
        <Button type="button" :label="t('action.save')" @click="handleAddMaterialToStore" :disabled="!selectedMaterials?.length"></Button>
    </div>
    </Dialog>
  </div>
</template>
