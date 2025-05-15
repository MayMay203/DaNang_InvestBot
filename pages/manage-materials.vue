<script setup>
import { FilterMatchMode, FilterOperator } from "@primevue/core/api";
import BaseButton from "~/components/base-components/BaseButton.vue";
import { materialService } from "~/service-api/materialService";
import dayjs from 'dayjs'

definePageMeta({
  layout: "admin",
});

const { t } = useTranslation()
const toast = useToast()
const filters = ref({ value: null });
const loading = ref(false);
const accessList = ref([{ id: 1, name: t('management.material.public')}, { id: 2, name: t('management.material.private')}, {id: 3, name: t('management.material.internal')}])
const first = ref(0);
const visible = ref(false)
const isVisible = ref(false)
const isUploadVisible = ref(false)
const materials = ref([])
const formData = reactive({
  files: null,
  name: '',
  description: '',
  content: '',
  accessLevel: null,
  materialTypeId: '',
})
const $primevue = usePrimeVue();
const totalSize = ref(0);
const totalSizePercent = ref(0);
const autoTextarea = ref(null);



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

const addNewMaterial = () => {
  visible.value = false;
  if (formData.materialTypeId == 1) {
    isUploadVisible.value = true
  }
  else {
    isVisible.value = true
  }
}

const confirmAddNewMaterial = async () => {
  try {
    let { name, description, files, content, materialTypeId, accessLevel } = formData;
    materialTypeId = Number(materialTypeId)
    const formDataToSend = new FormData();

    formDataToSend.append('name', name);
    formDataToSend.append('description', description);
    formDataToSend.append('materialTypeId', materialTypeId);
    formDataToSend.append('accessLevelId', accessLevel.id);

    if (materialTypeId == 1 && files?.length) {
      files.forEach(file => {
        formDataToSend.append('files', file); 
      });
    } else if (materialTypeId == 2) {
      formDataToSend.append('text', content);
    } else if (materialTypeId == 3) {
      formDataToSend.append('url', content);
    }
    await materialService.uploadMaterial(formDataToSend);
    toast.add({ 
      severity: 'success', 
      summary: t("toast.success"), 
      detail: t("toast.message_success"), 
      life: 3000 
    });
    await fetchAllMaterials();
  } catch (error) {
    console.error(error)
    toast.add({ 
      severity: 'error', 
      summary: t("toast.error"), 
      detail: t("toast.message_error"), 
      life: 3000 
    });
  } finally {
    isVisible.value = false;
    visible.value = false;
    isUploadVisible.value = false;
  }
};


const fetchAllMaterials = async () => {
  try {
    const { data } = await materialService.getAllMaterials()
    materials.value = data.data.map(item => ({
      ...item,
      updatedAt: dayjs(item.updatedAt).format('HH:mm:ss DD-MM-YYYY')
    }))
  } catch (error) {
    console.error(error)
  }
}

const handleCloseDetailModal = () => {
  isVisible.value = false;
  isUploadVisible.value = false;
  visible.value = true
}

const onRemoveTemplatingFile = (file, removeFileCallback, index) => {
    removeFileCallback(index);
    totalSize.value -= parseInt(formatSize(file.size));
    totalSizePercent.value = totalSize.value / 10;
};

const onSelectedFiles = (event) => {
  formData.files = event.files;
};

const formatSize = (bytes) => {
    const k = 1024;
    const dm = 3;
    const sizes = $primevue.config.locale.fileSizeTypes;

    if (bytes === 0) {
        return `0 ${sizes[0]}`;
    }

    const i = Math.floor(Math.log(bytes) / Math.log(k));
    const formattedSize = parseFloat((bytes / Math.pow(k, i)).toFixed(dm));

    return `${formattedSize} ${sizes[i]}`;
};

const autoResize = () => {
  const el = autoTextarea.value?.$el?.querySelector('textarea');
  if (el) {
    el.style.height = 'auto'; 
    el.style.height = `${el.scrollHeight}px`;
  }
};

onMounted(async() => {
  await fetchAllMaterials()
})
</script>

<template>
  <div class="overflow-auto w-full">
    <DataTable
      v-model:filters="filters"
      showGridlines
      :value="materials"
      paginator
      :rows="8"
      :first="first"
      @page="onPage"
      :rowsPerPageOptions="[5, 10, 20, 50]"
      filterDisplay="menu"
      :loading="loading"
      :globalFilterFields="['fullName', 'email', 'role', 'active']"
      scrollable
      resizableColumns columnResizeMode="fit"
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
            @click="visible = true"
          ></BaseButton>
        </div>
      </template>
      <Column :header="t('management.order')" style="width: 5%">
        <template #body="{ index }">
          {{ first + index + 1 }}
        </template>
      </Column>
      <Column field="name" :header="t('management.material.name')" style="width: 15%" search>
        <template #filter="{ filterModel }">
          <InputText
            v-model="filterModel.value"
            type="text"
            placeholder="Search by name"
          />
        </template>
      </Column>
      <Column field="description" :header="t('management.material.description')" style="width: 15%">
        <template #filter="{ filterModel }">
          <InputText
            v-model="filterModel.value"
            type="text"
            placeholder="Search by email"
          />
        </template>
      </Column>
      <Column
        field="materialType.name"
        :header="t('management.material.materialType')"
        style="width: 10%"
      ></Column>
      <Column field="updatedAt" :header="t('management.material.updatedAt')" style="width: 20%"></Column>
      <Column field="accessLevel.name" :header="t('management.material.access')" style="width: 10%"></Column>
      <Column field="isActive" :header="t('management.material.active')" style="width: 10%">
        <template #body="slotProps">
          <ToggleSwitch v-model="slotProps.data.isActive" />
        </template>
      </Column>
       <Column style="width: 15%">
         <template #body>
          <div class="flex gap-[6px]">
            <BaseButton left-icon="item" :text="t('management.material.item')" variant="outline" color="#065076" width="100px" height="30px" sizeIcon="18px" border-color="#065076"></BaseButton>
            <BaseButton left-icon="edit" :text="t('management.edit')" variant="outline" color="red" width="80px" height="30px" sizeIcon="18px" border-color="red"></BaseButton>
        </div>
        </template>
      </Column>
    </DataTable>
    <!-- modal add new material -->
    <Dialog v-model:visible="visible" modal :header="t('management.material.create_new_material')" :style="{ width: '35rem' }">
    <div class="flex flex-col gap-4 mb-4">
        <label for="name" class="font-medium w-24 text-[15px]">{{ t('management.material.name') }}</label>
        <InputText v-model="formData.name" id="name" class="flex-auto" autocomplete="off" />
    </div>
     <div class="flex flex-col gap-4 mb-4">
        <label for="description" class="font-medium w-24 text-[15px]">{{ t('management.material.description') }}</label>
        <InputText v-model="formData.description" id="description" class="flex-auto" autocomplete="off" />
    </div>
     <div class="flex flex-col gap-4 mb-4">
        <label for="name" class="font-medium w-30 text-[15px]">{{ t('management.material.access') }}</label>
        <Select v-model="formData.accessLevel" name="access.name" :options="accessList" optionLabel="name" :placeholder="t('management.material.select_access_message')" fluid />
    </div>
    <div class="flex flex-col gap-4 mb-7">
      <span class="font-medium w-24 text-[15px]">{{ t('management.material.materialType') }}</span>
      <div class="flex justify-center gap-5">
    <div class="flex items-center gap-2 px-[16px]">
        <RadioButton v-model="formData.materialTypeId" inputId="materialType1" name="materialType" value="1" />
        <label for="materialType1">{{ t('management.material.file_upload') }}</label>
    </div>
    <div class="flex items-center gap-2">
        <RadioButton v-model="formData.materialTypeId" inputId="materialType2" name="materialType" value="2" />
        <label for="materialType2">{{ t('management.material.text_content') }}</label>
    </div>
    <div class="flex items-center gap-2">
        <RadioButton v-model="formData.materialTypeId" inputId="materialType3" name="materialType" value="3" />
        <label for="materialType3">URL</label>
    </div>
    </div>
    </div>
    <div class="flex justify-end gap-4">
        <Button type="button" :label="t('action.cancel')" severity="secondary" @click="visible = false"></Button>
        <Button type="button" :label="t('action.save')" @click="addNewMaterial"></Button>
    </div>
    </Dialog>
    <!-- Modal add content -->
     <Dialog v-model:visible="isVisible" modal :header="t('management.material.create_new_material')" :style="{ width: '35rem' }">
     <div class="flex flex-col gap-4 mb-4">
        <label for="content" class="font-medium w-24 text-[15px]">{{ t('management.material.content') }}</label>
        <Textarea
          v-model="formData.content"
          rows="5"
          class="w-full resize-none overflow-y"
          required
          ref="autoTextarea"
          @input="autoResize"
        />
    </div>
    <div class="flex justify-end gap-4">
        <Button type="button" :label="t('action.cancel')" severity="secondary" @click="handleCloseDetailModal"></Button>
        <Button type="button" :label="t('action.save')" @click="confirmAddNewMaterial"></Button>
    </div>
    </Dialog>
    <!-- Modal upload file -->
    <Dialog v-model:visible="isUploadVisible" modal :header="t('management.material.create_new_material')" :style="{ width: '35rem' }">
      <FileUpload name="demo[]" :multiple="true" accept=".jpg,.jpeg,.png,.gif,.bmp,.pdf,.doc,.docx,.xls,.xlsx" :maxFileSize="1000000" @select="onSelectedFiles">
        <template #header="{ chooseCallback, clearCallback, files }">
            <div class="flex flex-wrap justify-between items-center flex-1 gap-4">
                <div class="flex gap-2">
                    <Button @click="chooseCallback()" icon="pi pi-images" rounded outlined severity="secondary"></Button>
                    <Button  @click="confirmAddNewMaterial" icon="pi pi-cloud-upload" rounded outlined severity="success" :disabled="!files || files.length === 0"></Button>
                    <Button @click="clearCallback()" icon="pi pi-times" rounded outlined severity="danger" :disabled="!files || files.length === 0"></Button>
                </div>
                <ProgressBar :value="totalSizePercent" :showValue="false" class="md:w-20rem h-1 w-full md:ml-auto">
                    <span class="whitespace-nowrap">{{ totalSize }}B / 1Mb</span>
                </ProgressBar>
            </div>
        </template>
        <template #content="{ files, uploadedFiles, removeUploadedFileCallback, removeFileCallback, messages }">
            <div class="flex flex-col gap-8 pt-4">
                <Message v-for="message of messages" :key="message" :class="{ 'mb-8': !files.length && !uploadedFiles.length}" severity="error">
                    {{ message }}
                </Message>

                <div v-if="files.length > 0">
                    <h5>Pending</h5>
                    <div class="flex flex-wrap gap-4">
                        <div v-for="(file, index) of files" :key="file.name + file.type + file.size" class="p-8 rounded-border flex flex-col border border-surface items-center gap-4">
                            <div>
                                <img role="presentation" :alt="file.name" :src="file.objectURL" width="100" height="50" />
                            </div>
                            <span class="font-semibold text-ellipsis max-w-60 whitespace-nowrap overflow-hidden">{{ file.name }}</span>
                            <div>{{ formatSize(file.size) }}</div>
                            <Badge value="Pending" severity="warn" />
                            <Button icon="pi pi-times" @click="onRemoveTemplatingFile(file, removeFileCallback, index)" outlined rounded severity="danger" />
                        </div>
                    </div>
                </div>

                <div v-if="uploadedFiles.length > 0">
                    <h5>Completed</h5>
                    <div class="flex flex-wrap gap-4">
                        <div v-for="(file, index) of uploadedFiles" :key="file.name + file.type + file.size" class="p-8 rounded-border flex flex-col border border-surface items-center gap-4">
                            <div>
                                <img role="presentation" :alt="file.name" :src="file.objectURL" width="100" height="50" />
                            </div>
                            <span class="font-semibold text-ellipsis max-w-60 whitespace-nowrap overflow-hidden">{{ file.name }}</span>
                            <div>{{ formatSize(file.size) }}</div>
                            <Badge value="Completed" class="mt-4" severity="success" />
                            <Button icon="pi pi-times" @click="removeUploadedFileCallback(index)" outlined rounded severity="danger" />
                        </div>
                    </div>
                </div>
            </div>
        </template>
        <template #empty>
            <div class="flex items-center justify-center flex-col">
                <i class="pi pi-cloud-upload !border-2 !rounded-full !p-8 !text-4xl !text-muted-color" />
                <p class="mt-6 mb-0">{{ t('management.material.upload_message') }}</p>
            </div>
        </template>
      </FileUpload>
    </Dialog>
  </div>
</template>
