<script setup>
import { FilterMatchMode, FilterOperator } from '@primevue/core/api';

definePageMeta({
  layout: "admin",
});

const {t} = useTranslation()
const filters = ref({value: null});
const loading = ref(false);
const customers = [
  {
    fullName: 'John Doe',
    email: 'johndoe@example.com',
    role: 'Admin',
    active: true
  },
  {
    fullName: 'Maria Garcia',
    email: 'mariagarcia@example.com',
    role: 'User',
    active: false
  },
  {
    fullName: 'Ahmed Ali',
    email: 'ahmedali@example.com',
    role: 'Manager',
    active: true
  },
  {
    fullName: 'Liu Wei',
    email: 'liuwei@example.com',
    role: 'Admin',
    active: true
  },
  {
    fullName: 'Samantha Lee',
    email: 'samanthalee@example.com',
    role: 'User',
    active: false
  },
   {
    fullName: 'Liu Wei',
    email: 'liuwei@example.com',
    role: 'Admin',
    active: true
  },
  {
    fullName: 'Samantha Lee',
    email: 'samanthalee@example.com',
    role: 'User',
    active: false
  },
   {
    fullName: 'Liu Wei',
    email: 'liuwei@example.com',
    role: 'Admin',
    active: true
  },
  {
    fullName: 'Samantha Lee',
    email: 'samanthalee@example.com',
    role: 'User',
    active: false
  },
   {
    fullName: 'Liu Wei',
    email: 'liuwei@example.com',
    role: 'Admin',
    active: true
  },
  {
    fullName: 'Samantha Lee',
    email: 'samanthalee@example.com',
    role: 'User',
    active: false
  }
]
const first = ref(0);

const onPage = (event) => {
  first.value = event.first;
};
const initFilters = () => {
  filters.value = {
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        fullName: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
        email: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
        role: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
        active: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] }
    };
};
initFilters();
const clearFilter = () => {
    initFilters();
};
</script>

<template>
   <div>
      <DataTable v-model:filters="filters" showGridlines :value="customers" paginator :rows="8" :first="first" @page="onPage" :rowsPerPageOptions="[5, 10, 20, 50]" tableStyle="min-width: 50rem"
      filterDisplay="menu" :loading="loading" :globalFilterFields="['fullName', 'email', 'role', 'active']"
      >
        <template #header>
            <div class="flex justify-between">
                <Button type="button" icon="pi pi-filter-slash" label="Clear" outlined @click="clearFilter()" />
                <IconField>
                    <InputIcon>
                        <i class="pi pi-search" />
                    </InputIcon>
                    <InputText v-model="filters['global'].value" placeholder="Keyword Search" />
                </IconField>
            </div>
        </template>
        <Column :header="t('management.order')" style="width: 10%">
         <template #body="{ index}">
          {{ first + index + 1 }}
        </template>
        </Column>
        <Column field="fullName" :header="t('management.account.fullName')"  style="width: 25%" search>
         <template #filter="{ filterModel }">
            <InputText v-model="filterModel.value" type="text" placeholder="Search by name" />
          </template>
        </Column>
        <Column field="email" :header="t('management.account.email')" style="width: 25%">
          <template #filter="{ filterModel }">
            <InputText v-model="filterModel.value" type="text" placeholder="Search by email" />
          </template>
        </Column>
        <Column field="role" :header="t('management.account.role')" style="width: 25%"></Column>
        <Column field="active" :header="t('management.account.active')" style="width: 15%">
         <template #body="slotProps">
          <ToggleSwitch v-model="slotProps.data.active" />
        </template>
      </Column>
    </DataTable>
    </div>
</template>
