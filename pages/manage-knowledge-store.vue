<script setup>
import { FilterMatchMode, FilterOperator } from "@primevue/core/api";
import BaseButton from "~/components/base-components/BaseButton.vue";

definePageMeta({
  layout: "admin",
});

const {t} = useTranslation()
const filters = ref({ value: null });
const loading = ref(false);
const customers = [
  {
    name: "Policy",
    description: "johndoe@example.com",
    createdBy: "Admin 01",
    updatedAt: "12/12/2025",
    status: "Changed",
    active: false,
  },
  {
    name: "Policy",
    description: "johndoe@example.com",
    createdBy: "Admin 01",
    updatedAt: "12/12/2025",
    status: "Changed",
    active: false,
  },
  {
    name: "Policy",
    description: "johndoe@example.com",
    createdBy: "Admin 01",
    updatedAt: "12/12/2025",
    status: "Changed",
    active: false,
  },
  {
    name: "Policy",
    description: "johndoe@example.com",
    createdBy: "Admin 01",
    updatedAt: "12/12/2025",
    status: "Changed",
    active: false,
  },
  {
    name: "Policy",
    description: "johndoe@example.com",
    createdBy: "Admin 01",
    updatedAt: "12/12/2025",
    status: "Changed",
    active: true,
  },
  {
    name: "Policy",
    description: "johndoe@example.com",
    createdBy: "Admin 01",
    updatedAt: "12/12/2025",
    status: "Changed",
    active: true,
  },
  {
    name: "Policy",
    description: "johndoe@example.com",
    createdBy: "Admin 01",
    updatedAt: "12/12/2025",
    status: "Changed",
    active: true,
  },
  {
    name: "Policy",
    description: "johndoe@example.com",
    createdBy: "Admin 01",
    updatedAt: "12/12/2025",
    status: "Changed",
    active: false,
  },
  {
    name: "Policy",
    description: "johndoe@example.com",
    createdBy: "PDF File",
    updatedAt: "12/12/2025",
    status: "Changed",
    active: false,
  },
];
const first = ref(0);
const isStoreVisible = ref(false)

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

const handleAddNewStore = () => {
  isStoreVisible.value = false
}
</script>

<template>
  <div>
    <DataTable
      v-model:filters="filters"
      showGridlines
      :value="customers"
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
      <Column field="description" :header="t('management.store.description')" style="width: 15%">
        <template #filter="{ filterModel }">
          <InputText
            v-model="filterModel.value"
            type="text"
            placeholder="Search by email"
          />
        </template>
      </Column>
      <Column field="createdBy" :header="t('management.store.createdBy')" style="width: 15%"></Column>
      <Column field="updatedAt" :header="t('management.store.updatedAt')" style="width: 10%"></Column>
      <Column field="status" :header="t('management.store.status')" style="width: 10%"></Column>
      <Column field="active" :header="t('management.store.active')" style="width: 10%">
        <template #body="slotProps">
          <ToggleSwitch v-model="slotProps.data.active" />
        </template>
      </Column>
      <Column style="width: 20%">
        <template #body>
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
            <BaseButton
              left-icon="sync"
              :text="t('management.sync')"
              variant="outline"
              color="#4A9F59"
              width="110px"
              height="30px"
              sizeIcon="18px"
              border-color="#4A9F59"
            ></BaseButton>
          </div>
        </template>
      </Column>
    </DataTable>
    <!-- Modal add new knowledge store -->
      <Dialog v-model:visible="isStoreVisible" modal :header="t('management.store.create_new_knowledge_store')" :style="{ width: '35rem' }">
    <div class="flex flex-col gap-4 mb-4">
        <label for="name" class="font-medium w-24 text-[15px]">{{ t('management.store.name') }}</label>
        <InputText id="name" class="flex-auto" autocomplete="off" />
    </div>
     <div class="flex flex-col gap-4 mb-4">
        <label for="content" class="font-medium w-24 text-[15px]">{{ t('management.store.description') }}</label>
        <Textarea v-model="content" rows="2" class="w-[100%]" required/>
    </div>
    <div class="flex justify-end gap-4">
        <Button type="button" :label="t('action.cancel')" severity="secondary" @click="isStoreVisible = false"></Button>
        <Button type="button" :label="t('action.save')" @click="handleAddNewStore"></Button>
    </div>
    </Dialog>
    <!-- Modal add material for knowledge store -->

  </div>
</template>
