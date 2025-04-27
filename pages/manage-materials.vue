<script setup>
import { FilterMatchMode, FilterOperator } from "@primevue/core/api";
import BaseButton from "~/components/base-components/BaseButton.vue";

definePageMeta({
  layout: "admin",
});

const filters = ref({ value: null });
const loading = ref(false);
const customers = [
  {
    name: "John Doe",
    description: "johndoe@example.com",
    materialType: "PDF File",
    updatedAt: "12/12/2025",
    access: "public",
    active: false,
  },
  {
    name: "John Doe",
    description: "johndoe@example.com",
    materialType: "PDF File",
    updatedAt: "12/12/2025",
    access: "public",
    active: true,
  },
  {
    name: "John Doe",
    description: "johndoe@example.com",
    materialType: "PDF File",
    updatedAt: "12/12/2025",
    access: "public",
    active: true,
  },
  {
    name: "John Doe",
    description: "johndoe@example.com",
    materialType: "PDF File",
    updatedAt: "12/12/2025",
    access: "public",
    active: true,
  },
  {
    name: "John Doe",
    description: "johndoe@example.com",
    materialType: "PDF File",
    updatedAt: "12/12/2025",
    access: "public",
    active: true,
  },
  {
    name: "John Doe",
    description: "johndoe@example.com",
    materialType: "PDF File",
    updatedAt: "12/12/2025",
    access: "public",
    active: true,
  },
  {
    name: "John Doe",
    description: "johndoe@example.com",
    materialType: "PDF File",
    updatedAt: "12/12/2025",
    access: "public",
    active: true,
  },
  {
    name: "John Doe",
    description: "johndoe@example.com",
    materialType: "PDF File",
    updatedAt: "12/12/2025",
    access: "public",
    active: false,
  },
];
const first = ref(0);

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
      :globalFilterFields="['fullName', 'email', 'role', 'active']"
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
            text="Create"
            width="120px"
            height="42px"
            sizeIcon="22px"
          ></BaseButton>
        </div>
      </template>
      <Column header="STT" style="width: 5%">
        <template #body="{ index }">
          {{ first + index + 1 }}
        </template>
      </Column>
      <Column field="name" header="Name" style="width: 15%" search>
        <template #filter="{ filterModel }">
          <InputText
            v-model="filterModel.value"
            type="text"
            placeholder="Search by name"
          />
        </template>
      </Column>
      <Column field="description" header="Description" style="width: 15%">
        <template #filter="{ filterModel }">
          <InputText
            v-model="filterModel.value"
            type="text"
            placeholder="Search by email"
          />
        </template>
      </Column>
      <Column
        field="materialType"
        header="Material Type"
        style="width: 15%"
      ></Column>
      <Column field="updatedAt" header="Updated At" style="width: 10%"></Column>
      <Column field="access" header="Access" style="width: 10%"></Column>
      <Column field="active" header="Active" style="width: 10%">
        <template #body="slotProps">
          <ToggleSwitch v-model="slotProps.data.active" />
        </template>
      </Column>
       <Column style="width: 20%">
         <template #body>
          <div class="flex gap-[6px]">
            <BaseButton left-icon="item" text="Item" variant="outline" color="#065076" width="80px" height="30px" sizeIcon="18px" border-color="#065076"></BaseButton>
            <BaseButton left-icon="edit" text="Edit" variant="outline" color="red" width="80px" height="30px" sizeIcon="18px" border-color="red"></BaseButton>
        </div>
        </template>
      </Column>
    </DataTable>
  </div>
</template>
