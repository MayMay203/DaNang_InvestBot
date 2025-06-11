<script setup>
import { FilterMatchMode, FilterOperator } from '@primevue/core/api';
import BaseButton from '~/components/base-components/BaseButton.vue';
import BaseInput from '~/components/base-components/BaseInput.vue';
import { getAddAccountSchema } from '~/schemas/addAccountSchema';
import { accountService } from '~/service-api/accountService';
import ChatBotDialog from '~/components/components/ChatBotDialog.vue';

definePageMeta({
  layout: "admin",
});

const toast = useToast()
const {t} = useTranslation()
const filters = ref({value: null});
const loading = ref(false);
const accounts = ref([])
const first = ref(0);
const title = ref()
const isVisible = ref(false)
const isVisibleChatbot = ref(false)
const selectedAccountId = ref()
const reason = ref()
const updatedStatus = ref({ status: null, id: null })
const createDialog = ref(false)
const roles = ref([
    { name: t('management.account.admin'), id: 1 },
    { name: t('management.account.employee'), id: 3 },
]);
const addAccountSchema = getAddAccountSchema(t)
const formData = reactive({
  email: '',
  fullName: '',
  password: '',
  confirmPassword: '',
  role: roles.value[0]
})

const formErrors = ref({
  email: '',
  fullName: '',
  password: '',
  confirmPassword: '',
})

const isDisabled = computed(() => {
  return !formData.email || !formData.fullName || !formData.password || !formData.confirmPassword || !!formErrors.value.email ||
    !!formErrors.value.password || !!formErrors.value.fullName || !!formErrors.value.confirmPassword
})

const fetchAllAccounts = async () => {
  try {
    const {data} = await accountService.getAllAccounts() || {}
    accounts.value = data?.data
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
  }
  const account = accounts.value.find(acc => acc.id === updatedStatus.value.id);
  if (account) {
    account.isActive = value;
  }
  title.value = value ? t('management.account.active_title') : t('management.account.deactive_title')
  isVisible.value = true
}

const handleToggleAccount = async () => {
  const { status, id } = updatedStatus.value
  try {
    await accountService.changeStatusAccount({ status, id, reason: reason.value })
    await fetchAllAccounts()
    toast.add({ severity: 'success', summary: t("toast.success"), detail: t("toast.message_success"), life: 3000 })
  } catch (error) {
    toast.add({ severity: 'error', summary: t("toast.error"), detail: t("toast.message_error"), life: 3000 })
  } finally {
    isVisible.value = false
  }
}

const handleCancel = async () => {
  const account = accounts.value.find(acc => acc.id === updatedStatus.value.id);
  if (account) {
    account.isActive = !updatedStatus.value.status;
  }
  isVisible.value = false;
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

const handleBlurInput = (field) => {
  const result = addAccountSchema.safeParse(formData)
  if (!result.success) {
    const error = result.error.errors.find(err => err.path[0] === field)
    if (error) {
      formErrors.value[field] = error.message
    } else {
      formErrors.value[field] = ''
    }
  } else {
    formErrors.value[field] = ''
  }
}

const handleShowHistoryChat = (id) => {
  console.log('id: ', id)
  selectedAccountId.value = id
  isVisibleChatbot.value = true
}


onMounted(async () => {
   await fetchAllAccounts()
})
</script>

<template>
   <div class="overflow-x: auto">
    <!-- Data for account management -->
      <DataTable v-model:filters="filters" scrollable resizableColumns columnResizeMode="fit" showGridlines :value="accounts" paginator :rows="8" :first="first" @page="onPage" :rowsPerPageOptions="[5, 10, 20, 50]"
      filterDisplay="'menu'" :loading="loading" :globalFilterFields="['fullName', 'email', 'role', 'active']"
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
            :modelValue="slotProps.data.isActive" 
            @update:modelValue="(value) => toggleActive(value, slotProps.data)" 
          />
        </template>
      </Column>
      <Column field="reason" :header="t('management.account.reason')" style="width: 15%"></Column>
      <Column style="width: 25%">
        <template #body="slotProps">
          <div class="flex gap-[6px]">
            <BaseButton
              left-icon="item"
              :text="t('chatbot.view_detail_chat')"
              variant="outline"
              color="#065076"
              width="230px"
              height="40px"
              sizeIcon="20px"
              border-color="#065076"
              @click="handleShowHistoryChat(slotProps.data.id)"
            ></BaseButton>
          </div>
        </template>
      </Column>
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
          <BaseInput v-model="formData.email" :label="t('management.account.email')" :placeholder="t('auth.email_placeholder')" :error="formErrors.email" @blur="handleBlurInput('email')"/>
      </div>
      <div class="flex flex-col gap-1 mb-2">
        <BaseInput v-model="formData.fullName" :label="t('management.account.fullName')" :placeholder="t('auth.full_name_placeholder')" :error="formErrors.fullName" @blur="handleBlurInput('fullName')"/>
      </div>
      <div class="flex flex-col gap-1 mb-2">
        <BaseInput v-model="formData.password" :label="t('management.account.password')" cursorIcon="pointer" :placeholder="t('auth.password_placeholder')" typeTag="password" :error="formErrors.password" @blur="handleBlurInput('password')"/>
      </div>
      <div class="flex flex-col gap-1 mb-2">
        <BaseInput v-model="formData.confirmPassword" :label="t('management.account.confirm_password')" cursorIcon="pointer" :placeholder="t('auth.confirm_password_placeholder')" typeTag="password" :error="formErrors.confirmPassword" @blur="handleBlurInput('confirmPassword')"/>
      </div>
      <div class="flex flex-col gap-1 mb-5">
        <label for="content" class="font-medium w-24 text-[15px]">{{ t('management.account.role') }}</label>
        <Select v-model="formData.role" :options="roles" optionLabel="name" :placeholder="t('action.select_a_role')" class="w-full md:w-56" />
      </div>
      <div class="flex justify-end gap-4">
          <Button type="button" :label="t('action.cancel')" severity="secondary" @click="createDialog = false"></Button>
          <Button type="button" :label="t('action.save')" @click="handleAddNewAccount" :disabled="isDisabled"></Button>
      </div>
    </Dialog>
    <!-- Modal chatbot -->
    <ChatBotDialog :accountId="selectedAccountId" v-model:visible="isVisibleChatbot" @on-close="isVisibleChatbot = false" />
    </div>
</template>
