<script setup>
import { FilterMatchMode, FilterOperator } from '@primevue/core/api';
import BaseButton from '~/components/base-components/BaseButton.vue';
import { accountService } from '~/service-api/accountService';

definePageMeta({
  layout: "admin",
});

const toast = useToast()
const {t} = useTranslation()
const filters = ref({value: null});
const loading = ref(false);
const customers = ref([])
const first = ref(0);
const title = ref()
const isVisible = ref(false)
const reason = ref()
const updatedStatus = ref({ status: null, id: null, userRef: null })
const createDialog = ref(false)
const roles = ref([
    { name: t('management.account.admin'), id: 1 },
    { name: t('management.account.employee'), id: 3 },
]);
const formData = reactive({
  email: '',
  fullName: '',
  password: '',
  confirmPassword: '',
  role: null
})


const fetchAllAccounts = async () => {
  try {
    const {data} = await accountService.getAllAccounts()
    customers.value = data.data
  }
  catch (error) {
    console.error(error)
  }
}
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
initFilters()
const clearFilter = () => {
    initFilters();
};
const toggleActive = (value, userData) => {
  updatedStatus.value = {
    status: value,
    id: userData.id,
    userRef: userData 
  }
  title.value = value ? t('management.account.active_title') : t('management.account.deactive_title')
  isVisible.value = true
}

const handleToggleAccount = async () => {
  const { status, id, userRef } = updatedStatus.value
  try {
    await accountService.changeStatusAccount({ status, id, reason: reason.value })
    await fetchAllAccounts()
    userRef.isActive = status 
    toast.add({ severity: 'success', summary: t("toast.success"), detail: t("toast.message_success"), life: 3000 })
  } catch (error) {
    userRef.isActive = !status 
    toast.add({ severity: 'error', summary: t("toast.error"), detail: t("toast.message_error"), life: 3000 })
  } finally {
    isVisible.value = false
  }
}

const handleCancel = () => {
  const { status, userRef } = updatedStatus.value
  userRef.isActive = !status
  isVisible.value = false
}

const handleAddNewAccount = async () => {
  try {
    const {email, fullName, password, confirmPassword, role} = formData
    await accountService.registerAccount({ email, fullName, password, confirmPassword, roleId: role.id })
    await fetchAllAccounts()
    toast.add({ severity: 'success', summary: t("toast.success"), detail: t("toast.message_success"), life: 3000 })
  }
  catch (error) {
    toast.add({ severity: 'error', summary: t("toast.error"), detail: t("toast.message_error"), life: 3000 })
  }
  finally{
    createDialog.value = false
  }
}

onMounted(async () => {
   await fetchAllAccounts()
})
</script>

<template>
   <div>
    <!-- Data for account management -->
      <DataTable v-model:filters="filters" scrollable resizableColumns columnResizeMode="fit" showGridlines :value="customers" paginator :rows="8" :first="first" @page="onPage" :rowsPerPageOptions="[5, 10, 20, 50]"
      filterDisplay="menu" :loading="loading" :globalFilterFields="['fullName', 'email', 'role', 'active']"
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
            @click="createDialog = true"
          ></BaseButton>
        </div>
      </template>
        <Column :header="t('management.order')" style="width: 10%">
         <template #body="{ index}">
          {{ first + index + 1 }}
        </template>
        </Column>
        <Column field="fullName" :header="t('management.account.fullName')"  style="width: 15%" search>
         <template #filter="{ filterModel }">
            <InputText v-model="filterModel.value" type="text" placeholder="Search by name" />
          </template>
        </Column>
        <Column field="email" :header="t('management.account.email')" style="width: 25%">
          <template #filter="{ filterModel }">
            <InputText v-model="filterModel.value" type="text" placeholder="Search by email" />
          </template>
        </Column>
        <Column field="role.name" :header="t('management.account.role')" style="width: 15%"></Column>
        <Column field="isActive" :header="t('management.account.active')" style="width: 15%">
         <template #body="slotProps">
          <ToggleSwitch 
            :key="slotProps.data.id + '-' + slotProps.data.isActive"
            :modelValue="slotProps.data.isActive" 
            @update:modelValue="(value) => toggleActive(value, slotProps.data)" 
          />
        </template>
      </Column>
      <Column field="reason" :header="t('management.account.reason')" style="width: 15%"></Column>
    </DataTable>
    <!-- Dialog active account -->
     <Dialog v-model:visible="isVisible" modal :header="title" :style="{ width: '25rem' }">
    <span class="text-surface-500 dark:text-surface-400 block mb-5">{{ t('management.account.active_message') }}</span>
    <Textarea v-model="reason" rows="2" class="w-[100%]" required/>
    <div class="flex items-center justify-end gap-2 mt-3">
        <Button type="button" :label="t('action.cancel')" severity="secondary" @click="handleCancel"></Button>
        <Button type="button" :label="t('action.save')" @click="handleToggleAccount" :disabled="!reason"></Button>
    </div>
</Dialog>
  <!-- Modal add account -->
    <Dialog v-model:visible="createDialog" modal :header="t('management.account.create_new_account')" :style="{ width: '35rem', height: 'fit-content' }">
      <div class="flex flex-col gap-1 mb-2">
          <label for="email" class="font-medium w-24 text-[15px]">{{ t('management.account.email') }}</label>
          <InputText v-model="formData.email" id="email" class="flex-auto" autocomplete="off" />
      </div>
      <div class="flex flex-col gap-1 mb-2">
          <label for="fullName" class="font-medium w-24 text-[15px]">{{ t('management.account.fullName') }}</label>
          <InputText v-model="formData.fullName" id="fullName" class="flex-auto" autocomplete="off" />
      </div>
      <div class="flex flex-col gap-1 mb-2">
        <label for="password" class="font-medium w-24 text-[15px]">{{ t('management.account.password') }}</label>
        <Password v-model="formData.password" toggleMask class="flex-1 w-full"/>
      </div>
      <div class="flex flex-col gap-1 mb-2">
        <label for="content" class="font-medium w-60 text-[15px]">{{ t('management.account.confirm_password') }}</label>
        <Password v-model="formData.confirmPassword" toggleMask class="w-full block" />
      </div>
      <div class="flex flex-col gap-1 mb-3">
        <label for="content" class="font-medium w-24 text-[15px]">{{ t('management.account.role') }}</label>
        <Select v-model="formData.role" :options="roles" optionLabel="name" :placeholder="t('action.select_a_role')" class="w-full md:w-56" />
      </div>
      <div class="flex justify-end gap-4">
          <Button type="button" :label="t('action.cancel')" severity="secondary" @click="createDialog = false"></Button>
          <Button type="button" :label="t('action.save')" @click="handleAddNewAccount"></Button>
      </div>
      </Dialog>
    </div>
</template>
