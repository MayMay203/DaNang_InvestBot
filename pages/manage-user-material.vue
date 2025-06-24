<script setup>
import { FilterMatchMode, FilterOperator } from "@primevue/core/api";
import BaseButton from "~/components/base-components/BaseButton.vue";
import { materialService } from "~/service-api/materialService";
import dayjs from "dayjs";

definePageMeta({
  layout: "admin",
});

const { t } = useTranslation();
const toast = useToast();
const filters = ref({ value: null });
const loading = ref(false);
const accessList = ref([
  { id: 1, name: t("management.material.public") },
  { id: 2, name: t("management.material.private") },
  { id: 3, name: t("management.material.internal") },
]);
const first = ref(0);
const visible = ref(false);
const isVisible = ref(false);
const isUploadVisible = ref(false);
const materials = ref([]);
const formData = reactive({
  files: null,
  name: "",
  description: "",
  content: "",
  accessLevel: accessList.value[0],
  materialTypeId: "1",
});
const $primevue = usePrimeVue();
const totalSize = ref(0);
const totalSizePercent = ref(0);
const autoTextarea = ref(null);
const updatedStatus = ref({ status: null, id: null });
const confirm = useConfirm();
const detailMaterial = ref();
const isVisibleDetail = ref(false);
const isLoading = ref(false);

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
    isUploadVisible.value = true;
  } else {
    isVisible.value = true;
  }
};

const resetFormData = () => {
  formData.files = null;
  formData.name = "";
  formData.description = "";
  formData.content = "";
  formData.accessLevel = accessList.value[0];
  formData.materialTypeId = "1";
};

const confirmAddNewMaterial = async () => {
  try {
    if (formData.materialTypeId == "3") {
      const matches = formData.content
        .split(/(?=https?:\/\/)/g)
        .map((str) => str.trim())
        .filter((str) => /^https?:\/\/[^\s]+$/.test(str));
      if (!matches) {
        toast.add({
          severity: "error",
          summary: t("toast.error"),
          detail: t("toast.invalid_url"),
          life: 3000,
        });
        return;
      }
      formData.content = matches.join(",");
    }

    let { name, description, files, content, materialTypeId, accessLevel } =
      formData;
    materialTypeId = Number(materialTypeId);
    const formDataToSend = new FormData();

    formDataToSend.append("name", name);
    formDataToSend.append("description", description);
    formDataToSend.append("materialTypeId", materialTypeId);
    formDataToSend.append("accessLevelId", accessLevel.id);

    if (materialTypeId == 1 && files?.length) {
      files.forEach((file) => {
        formDataToSend.append("files", file);
      });
    } else if (materialTypeId == 2) {
      formDataToSend.append("text", content);
    } else if (materialTypeId == 3) {
      formDataToSend.append("url", content);
    }
    await materialService.uploadMaterial(formDataToSend);
    toast.add({
      severity: "success",
      summary: t("toast.success"),
      detail: t("toast.message_success"),
      life: 3000,
    });

    resetFormData();
    await fetchAllMaterials();

    isVisible.value = false;
    visible.value = false;
    isUploadVisible.value = false;
  } catch (error) {
    console.error(error);
    isVisible.value = false;
    visible.value = false;
    isUploadVisible.value = false;
    toast.add({
      severity: "error",
      summary: t("toast.error"),
      detail: t("toast.message_error"),
      life: 3000,
    });
  }
};

const fetchAllMaterials = async () => {
  try {
    const res = await materialService.getAllMaterials("empty", "user");
    const data = res?.data?.data;
    materials.value = data.map((item) => ({
      ...item,
      updatedAt: dayjs(item.updatedAt).format("HH:mm:ss DD-MM-YYYY"),
      author: item.account?.email || useUserStore().email,
    }));
  } catch (error) {
    console.error(error);
  }
};

const handleCloseDetailModal = (value) => {
  value ? (visible.value = true) : (visible.value = false);
  isVisible.value = false;
  isUploadVisible.value = false;
};

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
  const el = autoTextarea.value?.$el?.querySelector("textarea");
  if (el) {
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  }
};

const handleToggleMaterial = async () => {
  try {
    const material = materials.value.find(
      (material) => material.id == updatedStatus.value.id
    );

    if (material) {
      material.isActive = updatedStatus.value.status;
    }

    await materialService.changeStatusMaterial(updatedStatus.value);

    toast.add({
      severity: "success",
      summary: t("toast.success"),
      detail: t("toast.message_success"),
      life: 3000,
    });
  } catch (error) {
    handleCancel();
    toast.add({
      severity: "error",
      summary: t("toast.error"),
      detail: t("toast.message_error"),
      life: 3000,
    });
  }
};

const toggleActive = (value, materialData) => {
  updatedStatus.value = {
    status: value,
    id: materialData.id,
  };

  const material = materials.value.find(
    (item) => item.id === updatedStatus.value.id
  );
  if (material) {
    material.isActive = value;
  }

  confirm.require({
    message: t("toast.message_toggle_material"),
    header: t("toast.confirm"),
    icon: "pi pi-exclamation-triangle",
    rejectProps: {
      label: t("action.cancel"),
      severity: "secondary",
      outlined: true,
    },
    acceptProps: {
      label: t("action.toggle_status"),
    },
    accept: async () => {
      await handleToggleMaterial();
    },
    reject: () => {
      handleCancel();
    },
  });
};

const handleCancel = () => {
  const material = materials.value.find(
    (item) => item.id === updatedStatus.value.id
  );
  if (material) {
    material.isActive = !updatedStatus.value.status;
  }
};

const handleDeleteMaterial = async (id) => {
  confirm.require({
    message: t("management.material.delete_material"),
    header: t("toast.confirm"),
    icon: "pi pi-exclamation-triangle",
    rejectProps: {
      label: t("action.cancel"),
      severity: "secondary",
      outlined: true,
    },
    acceptProps: {
      label: t("action.delete"),
    },
    accept: async () => {
      try {
        const res = await materialService.deleteUserMaterial(id);
        await fetchAllMaterials();

        toast.add({
          severity: "success",
          summary: t("toast.success"),
          detail: res.data.message,
          life: 3000,
        });
      } catch (error) {
        toast.add({
          severity: "error",
          summary: t("toast.error"),
          detail: t("toast.message_error"),
          life: 3000,
        });
      }
    },
    reject: () => {},
  });
};

const handleViewDetailMaterial = async (id) => {
  try {
    const res = await materialService.getDetailMaterial(id);
    detailMaterial.value = res.data.data;
    isVisibleDetail.value = true;
  } catch (error) {
    console.error(error);
  }
};

watch(
  () => formData.materialTypeId,
  (newValue) => {
    if (newValue == 1) {
      formData.name = "";
      formData.description = "";
    }
  }
);

const handleSyncMaterial = async (id) => {
  confirm.require({
    message: t("management.material.sync_material"),
    header: t("toast.confirm"),
    icon: "pi pi-exclamation-triangle",
    rejectProps: {
      label: t("action.cancel"),
      severity: "secondary",
      outlined: true,
    },
    acceptProps: {
      label: t("action.sync"),
    },
    accept: async () => {
      try {
        isLoading.value = true;
        await materialService.syncMaterial(id);
        await fetchAllMaterials();
        isLoading.value = false;

        toast.add({
          severity: "success",
          summary: t("toast.success"),
          detail: t("toast.message_success"),
          life: 3000,
        });
      } catch (error) {
        isLoading.value = false;
        toast.add({
          severity: "error",
          summary: t("toast.error"),
          detail: t("toast.message_error"),
          life: 3000,
        });
      }
    },
    reject: () => {},
  });
};

onMounted(async () => {
  await fetchAllMaterials();
});
</script>

<template>
  <div class="overflow-x: auto">
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
      resizableColumns
      columnResizeMode="fit"
      style="min-height: 500px"
    >
      <template #header>
        <div class="flex justify-between">
          <div class="flex flex-1 gap-[20px] items-center">
            <Button
              type="button"
              icon="pi pi-filter-slash"
              :label="t('common.clear')"
              outlined
              @click="clearFilter()"
            />
            <IconField>
              <InputIcon>
                <i class="pi pi-search" />
              </InputIcon>
              <InputText
                v-model="filters['global'].value"
                :placeholder="t('common.keyword_search')"
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
      <Column
        field="name"
        :header="t('management.material.name')"
        style="width: 15%"
        search
      >
        <template #filter="{ filterModel }">
          <InputText
            v-model="filterModel.value"
            type="text"
            placeholder="Search by name"
          />
        </template>
      </Column>
      <Column
        field="description"
        :header="t('management.material.description')"
        style="width: 20%"
      >
        <template #body="{ data }">
          <div>
            {{ data.description }}
          </div>
        </template>
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
      >
        <template #body="slotProps">
          <span
            class="flex items-center m-auto gap-2 px-2 py-0.5 rounded-md text-sm font-medium w-fit"
            :class="{
              'bg-blue-100 text-blue-700':
                slotProps.data.materialType.name === 'file',
              'bg-green-100 text-green-700':
                slotProps.data.materialType.name === 'url',
              'bg-yellow-100 text-yellow-700':
                slotProps.data.materialType.name === 'content',
            }"
          >
            <i
              :class="{
                'pi pi-file': slotProps.data.materialType.name === 'file',
                'pi pi-link': slotProps.data.materialType.name === 'url',
                'pi pi-align-left':
                  slotProps.data.materialType.name === 'content',
              }"
            ></i>
            <span>{{ slotProps.data.materialType.name }}</span>
          </span>
        </template>
      </Column>
      <Column
        field="updatedAt"
        :header="t('management.material.updatedAt')"
        style="width: 20%"
      ></Column>
      <Column
        field="author"
        :header="t('management.material.author')"
        style="width: 10%"
      >
      </Column>
      <Column style="width: 15%">
        <template #body="slotProps">
          <div class="flex gap-[6px]">
            <BaseButton
              left-icon="item"
              :text="t('management.material.item')"
              variant="outline"
              color="#065076"
              width="100px"
              height="30px"
              sizeIcon="18px"
              border-color="#065076"
              @click="handleViewDetailMaterial(slotProps.data.id)"
            ></BaseButton>
            <BaseButton
              left-icon="sync"
              :text="t('management.sync')"
              variant="outline"
              color="#4A9F59"
              width="100px"
              height="30px"
              sizeIcon="20px"
              border-color="#4A9F59"
              @click="handleSyncMaterial(slotProps.data.id)"
            ></BaseButton>
            <BaseButton
              left-icon="delete"
              :text="t('management.delete')"
              variant="outline"
              color="red"
              width="90px"
              height="30px"
              sizeIcon="20px"
              border-color="red"
              @click="handleDeleteMaterial(slotProps.data.id)"
            ></BaseButton>
          </div>
        </template>
      </Column>
    </DataTable>
  </div>
  <!-- modal add new material -->
  <Dialog
    v-model:visible="visible"
    modal
    :header="t('management.material.create_new_material')"
    :style="{ width: '35rem' }"
  >
    <div class="flex flex-col gap-4 mb-4">
      <span class="font-medium w-24 text-[15px]">{{
        t("management.material.materialType")
      }}</span>
      <div class="flex justify-center gap-5">
        <div class="flex items-center gap-2 px-[16px]">
          <RadioButton
            v-model="formData.materialTypeId"
            inputId="materialType1"
            name="materialType"
            value="1"
          />
          <label for="materialType1">{{
            t("management.material.file_upload")
          }}</label>
        </div>
        <div class="flex items-center gap-2">
          <RadioButton
            v-model="formData.materialTypeId"
            inputId="materialType2"
            name="materialType"
            value="2"
          />
          <label for="materialType2">{{
            t("management.material.text_content")
          }}</label>
        </div>
        <div class="flex items-center gap-2">
          <RadioButton
            v-model="formData.materialTypeId"
            inputId="materialType3"
            name="materialType"
            value="3"
          />
          <label for="materialType3">URL</label>
        </div>
      </div>
    </div>
    <div class="flex flex-col gap-4 mb-4">
      <label for="name" class="font-medium w-24 text-[15px]">{{
        t("management.material.name")
      }}</label>
      <InputText
        v-model="formData.name"
        id="name"
        class="flex-auto"
        autocomplete="off"
        :disabled="formData.materialTypeId == 1"
      />
    </div>
    <div class="flex flex-col gap-4 mb-4">
      <label for="description" class="font-medium w-24 text-[15px]">{{
        t("management.material.description")
      }}</label>
      <InputText
        v-model="formData.description"
        id="description"
        class="flex-auto"
        autocomplete="off"
        :disabled="formData.materialTypeId == 1"
      />
    </div>
    <div class="flex flex-col gap-4 mb-7">
      <label for="name" class="font-medium w-30 text-[15px]">{{
        t("management.material.access")
      }}</label>
      <Select
        v-model="formData.accessLevel"
        name="access.name"
        :options="accessList"
        optionLabel="name"
        :placeholder="t('management.material.select_access_message')"
        fluid
      />
    </div>
    <div class="flex justify-end gap-4">
      <Button
        type="button"
        :label="t('action.cancel')"
        severity="secondary"
        @click="visible = false"
      ></Button>
      <Button
        type="button"
        :label="t('action.save')"
        @click="addNewMaterial"
        :disabled="
          (formData.materialTypeId != 1 && !formData.name) ||
          (formData.materialTypeId != 1 && !formData.description)
        "
      ></Button>
    </div>
  </Dialog>
  <!-- Modal add content -->
  <Dialog
    v-model:visible="isVisible"
    modal
    :header="t('management.material.create_new_material')"
    :style="{ width: '35rem' }"
    @hide="handleCloseDetailModal"
  >
    <div class="flex flex-col gap-4 mb-4">
      <label for="content" class="font-medium w-24 text-[15px]">{{
        t("management.material.content")
      }}</label>
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
      <Button
        type="button"
        :label="t('action.cancel')"
        severity="secondary"
        @click="handleCloseDetailModal('closeHalf')"
      ></Button>
      <Button
        type="button"
        :label="t('action.save')"
        @click="confirmAddNewMaterial"
        :disabled="!formData.content"
      ></Button>
    </div>
  </Dialog>
  <!-- Modal upload file -->
  <Dialog
    v-model:visible="isUploadVisible"
    modal
    :header="t('management.material.create_new_material')"
    :style="{ width: '35rem' }"
    @hide="handleCloseDetailModal"
  >
    <FileUpload
      name="demo[]"
      :multiple="true"
      accept=".jpg,.jpeg,.png,.gif,.bmp,.pdf,.doc,.docx,.xls,.xlsx"
      :maxFileSize="1000000"
      @select="onSelectedFiles"
    >
      <template #header="{ chooseCallback, clearCallback, files }">
        <div class="flex flex-wrap justify-between items-center flex-1 gap-4">
          <div class="flex gap-2">
            <Button
              @click="chooseCallback()"
              icon="pi pi-images"
              rounded
              outlined
              severity="secondary"
            ></Button>
            <Button
              @click="confirmAddNewMaterial"
              icon="pi pi-cloud-upload"
              rounded
              outlined
              severity="success"
              :disabled="!files || files.length === 0"
            ></Button>
            <Button
              @click="clearCallback()"
              icon="pi pi-times"
              rounded
              outlined
              severity="danger"
              :disabled="!files || files.length === 0"
            ></Button>
          </div>
          <ProgressBar
            :value="totalSizePercent"
            :showValue="false"
            class="md:w-20rem h-1 w-full md:ml-auto"
          >
            <span class="whitespace-nowrap">{{ totalSize }}B / 1Mb</span>
          </ProgressBar>
        </div>
      </template>
      <template
        #content="{
          files,
          uploadedFiles,
          removeUploadedFileCallback,
          removeFileCallback,
          messages,
        }"
      >
        <div class="flex flex-col gap-8 pt-4">
          <Message
            v-for="message of messages"
            :key="message"
            :class="{ 'mb-8': !files.length && !uploadedFiles.length }"
            severity="error"
          >
            {{ message }}
          </Message>

          <div v-if="files.length > 0">
            <h5>Pending</h5>
            <div class="flex flex-wrap gap-4">
              <div
                v-for="(file, index) of files"
                :key="file.name + file.type + file.size"
                class="p-8 rounded-border flex flex-col border border-surface items-center gap-4"
              >
                <div>
                  <img
                    role="presentation"
                    :alt="file.name"
                    :src="file.objectURL"
                    width="100"
                    height="50"
                  />
                </div>
                <span
                  class="font-semibold text-ellipsis max-w-60 whitespace-nowrap overflow-hidden"
                  >{{ file.name }}</span
                >
                <div>{{ formatSize(file.size) }}</div>
                <Badge value="Pending" severity="warn" />
                <Button
                  icon="pi pi-times"
                  @click="
                    onRemoveTemplatingFile(file, removeFileCallback, index)
                  "
                  outlined
                  rounded
                  severity="danger"
                />
              </div>
            </div>
          </div>

          <div v-if="uploadedFiles.length > 0">
            <h5>Completed</h5>
            <div class="flex flex-wrap gap-4">
              <div
                v-for="(file, index) of uploadedFiles"
                :key="file.name + file.type + file.size"
                class="p-8 rounded-border flex flex-col border border-surface items-center gap-4"
              >
                <div>
                  <img
                    role="presentation"
                    :alt="file.name"
                    :src="file.objectURL"
                    width="100"
                    height="50"
                  />
                </div>
                <span
                  class="font-semibold text-ellipsis max-w-60 whitespace-nowrap overflow-hidden"
                  >{{ file.name }}</span
                >
                <div>{{ formatSize(file.size) }}</div>
                <Badge value="Completed" class="mt-4" severity="success" />
                <Button
                  icon="pi pi-times"
                  @click="removeUploadedFileCallback(index)"
                  outlined
                  rounded
                  severity="danger"
                />
              </div>
            </div>
          </div>
        </div>
      </template>
      <template #empty>
        <div class="flex items-center justify-center flex-col">
          <i
            class="pi pi-cloud-upload !border-2 !rounded-full !p-8 !text-4xl !text-muted-color"
          />
          <p class="mt-6 mb-0">
            {{ t("management.material.upload_message") }}
          </p>
        </div>
      </template>
    </FileUpload>
  </Dialog>
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
            <span class="font-semibold"
              >{{ t("management.material.name") }}:
            </span>
            <span class="text-gray-700">{{ detailMaterial.name }}</span>
          </div>
          <div>
            <span class="font-semibold"
              >{{ t("management.material.description") }}:
            </span>
            <span class="text-gray-700">{{ detailMaterial.description }}</span>
          </div>
          <div>
            <span class="font-semibold"
              >{{ t("management.material.active") }}:
            </span>
            <span
              :class="
                detailMaterial.isActive ? 'text-green-600' : 'text-red-600'
              "
            >
              {{
                detailMaterial.isActive
                  ? t("management.material.active_status")
                  : t("management.material.deactive_status")
              }}
            </span>
          </div>
        </div>
        <div class="space-y-2">
          <div>
            <span class="font-semibold">
              {{ t("management.material.access") }}:
            </span>
            <span
              class="px-2 py-0.5 rounded-md text-sm font-medium"
              :class="{
                'text-green-700 bg-green-100':
                  detailMaterial.accessLevel.name === 'public',
                'text-blue-700 bg-blue-100':
                  detailMaterial.accessLevel.name === 'internal',
                'text-red-700 bg-red-100':
                  detailMaterial.accessLevel.name === 'private',
              }"
            >
              {{ detailMaterial.accessLevel.name }}
            </span>
          </div>
          <div>
            <span class="font-semibold"
              >{{ t("management.material.knowledge_store") }}:
            </span>
            <span class="text-gray-700">
              {{
                detailMaterial.knowledgeStore
                  ? detailMaterial.knowledgeStore.name
                  : t("management.material.none")
              }}
            </span>
          </div>
          <div>
            <span class="font-semibold"
              >{{ t("management.material.updatedAt") }}:
            </span>
            <span class="text-gray-700">{{
              dayjs(detailMaterial.updatedAt).format("HH:mm:ss DD-MM-YYYY")
            }}</span>
          </div>
        </div>
      </div>

      <div>
        <p class="font-semibold mb-2">
          {{ t("management.material.view_material") }}:
        </p>
        <iframe
          v-if="
            detailMaterial.materialType.id !== 2 &&
            detailMaterial.materialType.id !== 3
          "
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
              <p class="text-sm text-gray-700 w-full break-words">
                {{ detailMaterial.url }}
              </p>
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
  <div
    v-if="isLoading"
    className="fixed inset-0 z-100 flex justify-center items-center bg-[rgba(0,0,0,0.1)]"
  >
    <ProgressSpinner />
  </div>
</template>

<style>
.p-datatable-table-container{
  min-height: 500px;
}
</style>
