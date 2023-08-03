<template>
  <div class="container">
    <a-layout style="padding: 0 18px">
      <Breadcrumb :items="[$t('menu.serp'), $t('menu.serp.serpTask')]" />
      <a-card :title="$t('menu.serp.serpTask')" class="general-card">
        <a-row>
          <a-col :flex="62">
            <a-form
              :auto-label-width="true"
              :model="formModel"
              label-align="right"
            >
              <a-row :gutter="16">
                <a-col :span="6">
                  <a-form-item
                    :label="$t('serp.task.form.keyword')"
                    field="keyword"
                  >
                    <a-input
                      v-model="formModel.keyword"
                      :placeholder="$t('serp.task.form.keyword.placeholder')"
                    />
                  </a-form-item>
                </a-col>
                <a-col :span="6">
                  <a-form-item :label="$t('serp.task.form.num')" field="num">
                    <a-input
                      v-model="formModel.num"
                      :placeholder="$t('serp.task.form.num.placeholder')"
                    />
                  </a-form-item>
                </a-col>
                <a-col :span="6">
                  <a-form-item :label="$t('serp.task.form.area')" field="area">
                    <a-input
                      v-model="formModel.area"
                      :placeholder="$t('serp.task.form.area.placeholder')"
                    />
                  </a-form-item>
                </a-col>
                <a-col :span="6">
                  <a-form-item
                    :label="$t('serp.task.form.state')"
                    field="state"
                  >
                    <a-select
                      v-model="formModel.state"
                      allow-clear
                      :placeholder="$t('serp.task.form.state.placeholder')"
                    >
                      <a-option
                        v-for="item in stateOptions"
                        :key="item.value"
                        :value="item.value"
                      >
                        {{ item.label }}
                      </a-option>
                    </a-select>
                  </a-form-item>
                </a-col>
                <a-col :span="6">
                  <a-form-item
                    :label="$t('serp.task.form.expire_time')"
                    field="expire_time"
                  >
                    <a-date-picker
                      v-model="formModel.expire_time"
                      :placeholder="
                        $t('serp.task.form.expire_time.placeholder')
                      "
                      style="width: 100%"
                    />
                  </a-form-item>
                </a-col>
                <a-col :span="6">
                  <a-form-item
                    :label="$t('serp.task.form.update_time')"
                    field="update_time"
                  >
                    <a-date-picker
                      v-model="formModel.update_time"
                      :placeholder="
                        $t('serp.task.form.update_time.placeholder')
                      "
                      style="width: 100%"
                    />
                  </a-form-item>
                </a-col>
              </a-row>
            </a-form>
          </a-col>
          <a-divider direction="vertical" style="height: 30px" />
          <a-col :span="6">
            <a-space :size="'medium'" direction="horizontal">
              <a-button type="primary" @click="search">
                <template #icon>
                  <icon-search />
                </template>
                {{ $t('serp.task.form.search') }}
              </a-button>
              <a-button @click="resetSelect">
                <template #icon>
                  <icon-refresh />
                </template>
                {{ $t('serp.task.form.reset') }}
              </a-button>
            </a-space>
          </a-col>
        </a-row>
        <a-divider />
        <a-space :size="'medium'">
          <a-button type="primary" @click="NewSerpTask()">
            <template #icon>
              <icon-plus />
            </template>
            {{ $t('serp.task.button.create') }}
          </a-button>
          <a-button
            :disabled="deleteButtonStatus()"
            status="danger"
            @click="DeleteSerpTask"
          >
            <template #icon>
              <icon-minus />
            </template>
            {{ $t('serp.task.button.delete') }}
          </a-button>
        </a-space>
        <div class="content">
          <a-table
            v-model:selected-keys="rowSelectKeys"
            :bordered="false"
            :columns="(cloneColumns as TableColumnData[])"
            :data="renderData"
            :loading="loading"
            :pagination="pagination"
            :row-selection="rowSelection"
            :size="size"
            row-key="id"
            @page-change="onPageChange"
            @page-size-change="onPageSizeChange"
          >
            <template #index="{ rowIndex }">
              {{ rowIndex + 1 }}
            </template>
            <template #state="{ record }">
              <a-tag v-if="record.state === -1" :color="`red`" bordered>
                {{ $t(`serp.task.form.state.${record.state}`) }}
              </a-tag>
              <a-tag v-else-if="record.state === 0" :color="`blue`" bordered>
                {{ $t(`serp.task.form.state.${record.state}`) }}
              </a-tag>
              <a-tag v-else-if="record.state === 1" :color="`green`" bordered>
                {{ $t(`serp.task.form.state.${record.state}`) }}
              </a-tag>
              <a-tag v-else :color="`gold`" bordered>
                {{ $t(`serp.task.form.state.${record.state}`) }}
              </a-tag>
            </template>
            <template #operate="{ record }">
              <a-space>
                <a-link @click="EditSerpTask(record.id)">
                  {{ $t(`serp.task.columns.edit`) }}
                </a-link>
                <a-link @click="QueryData(record.id)">
                  {{ $t(`serp.task.columns.query`) }}
                </a-link>
              </a-space>
            </template>
          </a-table>
        </div>
        <div class="content-modal">
          <a-modal
            :closable="false"
            :on-before-ok="beforeSubmit"
            :title="drawerTitle"
            :visible="openNewOrEdit"
            :width="550"
            @cancel="cancelReq"
            @ok="submitNewOrEdit"
          >
            <a-form ref="formRef" :model="form">
              <a-form-item
                :feedback="true"
                :label="$t('serp.task.columns.keyword')"
                :rules="[
                  {
                    required: true,
                    message: $t('serp.task.form.keyword.help'),
                  },
                ]"
                field="keyword"
              >
                <a-input
                  v-model="form.keyword"
                  :placeholder="$t('serp.task.form.keyword.placeholder')"
                ></a-input>
              </a-form-item>
              <a-form-item
                :feedback="true"
                :label="$t('serp.task.columns.num')"
                :rules="[
                  {
                    required: true,
                    message: $t('serp.task.form.num.help'),
                  },
                ]"
                field="num"
              >
                <a-input
                  v-model="form.num"
                  :placeholder="$t('serp.task.form.num.placeholder')"
                ></a-input>
              </a-form-item>
              <a-form-item
                :feedback="true"
                :label="$t('serp.task.columns.area')"
                :rules="[
                  {
                    required: false,
                    message: $t('serp.task.form.area.help'),
                  },
                ]"
                field="area"
              >
                <a-input
                  v-model="form.area"
                  :placeholder="$t('serp.task.form.area.placeholder')"
                ></a-input>
              </a-form-item>
              <a-form-item
                :feedback="true"
                :label="$t('serp.task.columns.expire_time')"
                :rules="[
                  {
                    required: false,
                    message: $t('serp.task.form.expire_time.help'),
                  },
                ]"
                field="expire_time"
              >
                <a-date-picker
                  v-model="form.expire_time"
                  show-time
                  format="YYYY-MM-DD HH:mm:ss"
                  :placeholder="$t('serp.task.form.expire_time.placeholder')"
                />
              </a-form-item>
              <a-form-item
                :feedback="true"
                :label="$t('serp.task.columns.update_time')"
                :rules="[
                  {
                    required: false,
                    message: $t('serp.task.form.update_time.help'),
                  },
                ]"
                field="update_time"
              >
                <a-date-picker
                  v-model="form.update_time"
                  show-time
                  format="YYYY-MM-DD HH:mm:ss"
                  :placeholder="$t('serp.task.form.update_time.placeholder')"
                />
              </a-form-item>
              <a-form-item
                :feedback="true"
                :label="$t('serp.task.columns.state')"
                :rules="[
                  {
                    required: true,
                    message: $t('serp.task.form.state.help'),
                  },
                ]"
                field="state"
              >
                <a-select
                  v-model="form.state"
                  :placeholder="$t('serp.task.form.state.placeholder')"
                >
                  <a-option
                    v-for="item in stateOptions"
                    :key="item.value"
                    :value="item.value"
                  >
                    {{ item.label }}
                  </a-option>
                </a-select>
              </a-form-item>
            </a-form>
          </a-modal>
          <a-modal
            :closable="false"
            :title="`${$t('modal.title.tips')}`"
            :visible="openDelete"
            :width="360"
            @cancel="cancelReq"
            @ok="submitDelete"
          >
            <a-space>
              <icon-exclamation-circle-fill size="24" style="color: #e6a23c" />
              {{ $t('modal.title.tips.delete') }}
            </a-space>
          </a-modal>
          <a-drawer
            :title="drawerTitle"
            :visible="openSearchRecent"
            :width="550"
            @cancel="cancelReq"
          >
            <a-list>
              <a-list-item>
                <a-list-item-meta
                  :title="`${$t('serp.task.columns.keyword')}: ${
                    renderQueryData.keyword
                  }`"
                />
              </a-list-item>
              <a-list-item>
                <a-list-item-meta
                  :title="`${$t('serp.task.columns.area')}: ${
                    renderQueryData.area
                  }`"
                />
              </a-list-item>
              <a-list-item>
                <a-list-item-meta
                  :title="`${$t('serp.task.columns.create_time')}: ${
                    renderQueryData.create_time
                  }`"
                />
              </a-list-item>
            </a-list>
            <a-list
              :data="renderQueryData.urls"
              :pagination-props="paginationProps"
            >
              <template #item="{ item, index }">
                <a-list-item>
                  <a-list-item-meta
                    :title="`${$t('serp.task.columns.index')}: ${index + 1}`"
                  />
                  <a-link :href="item" target="_blank">
                    {{ item }}
                  </a-link>
                </a-list-item>
              </template>
            </a-list>
            <a-divider />
            <!--            <div v-html="renderQueryData.html"></div>-->
          </a-drawer>
        </div>
      </a-card>
    </a-layout>
  </div>
  <div class="footer">
    <Footer />
  </div>
</template>

<script lang="ts" setup>
  import Footer from '@/components/footer/index.vue';
  import { computed, reactive, ref, watch } from 'vue';
  import { Message, TableColumnData } from '@arco-design/web-vue';
  import { useI18n } from 'vue-i18n';
  import useLoading from '@/hooks/loading';
  import { Pagination } from '@/types/global';
  import {
    createSerpTask,
    deleteSerpTask,
    querySerpDataRecent,
    querySerpTaskDetail,
    querySerpTaskList,
    SerpDataReq,
    SerpTaskParams,
    SerpTaskReq,
    SerpTaskRes,
    updateSerpTask,
  } from '@/api/serp';
  import { cloneDeep } from 'lodash';

  type Column = TableColumnData & { checked?: true };
  type SizeProps = 'mini' | 'small' | 'medium' | 'large';
  const { t } = useI18n();
  const { loading, setLoading } = useLoading(true);

  // 表单
  const generateFormModel = () => {
    return {
      keyword: undefined,
      num: undefined,
      area: undefined,
      expire_time: undefined,
      update_time: undefined,
      state: undefined,
    };
  };
  const formModel = ref(generateFormModel());
  // 表格
  const cloneColumns = ref<Column[]>([]);
  const showColumns = ref<Column[]>([]);
  const renderData = ref<SerpTaskRes[]>([]);
  const size = ref<SizeProps>('medium');
  const operateRow = ref<number>(0);
  const rowSelectKeys = ref<number[]>([]);
  const rowSelection = reactive({
    showCheckedAll: true,
    selectedRowKeys: rowSelectKeys.value,
  });
  const basePagination: Pagination = {
    current: 1,
    defaultPageSize: 20,
    showTotal: true,
    showPageSize: true,
    bufferSize: 3,
  };
  const pagination: Pagination = reactive({
    ...basePagination,
  });
  const NewSerpTask = () => {
    buttonStatus.value = 'new';
    drawerTitle.value = t('serp.task.columns.new.drawer');
    resetForm(formDefaultValues);
    openNewOrEdit.value = true;
  };
  const EditSerpTask = async (pk: number) => {
    buttonStatus.value = 'edit';
    operateRow.value = pk;
    drawerTitle.value = t('serp.task.columns.edit.drawer');
    await fetchSerpTaskDetail(pk);
    openNewOrEdit.value = true;
  };
  const DeleteSerpTask = () => {
    drawerTitle.value = t('serp.task.columns.delete.drawer');
    openDelete.value = true;
  };
  const QueryData = async (taskId: number) => {
    drawerTitle.value = t('serp.task.columns.query.drawer');
    await fetchSerpDataDetail(taskId);
    openSearchRecent.value = true;
  };
  const columns = computed<TableColumnData[]>(() => [
    {
      title: 'ID',
      dataIndex: 'index',
      slotName: 'index',
      ellipsis: true,
      tooltip: true,
      width: 100,
    },
    {
      title: t('serp.task.columns.keyword'),
      dataIndex: 'keyword',
      slotName: 'keyword',
    },
    {
      title: t('serp.task.columns.num'),
      dataIndex: 'num',
      slotName: 'num',
    },
    {
      title: t('serp.task.columns.area'),
      dataIndex: 'area',
      slotName: 'area',
    },
    {
      title: t('serp.task.columns.expire_time'),
      dataIndex: 'expire_time',
      slotName: 'expire_time',
    },
    {
      title: t('serp.task.columns.update_time'),
      dataIndex: 'update_time',
      slotName: 'update_time',
    },
    {
      title: t('serp.task.columns.state'),
      dataIndex: 'state',
      slotName: 'state',
    },
    {
      title: t('serp.task.columns.operate'),
      dataIndex: 'operate',
      slotName: 'operate',
      align: 'center',
    },
  ]);

  // 对话框
  const openNewOrEdit = ref<boolean>(false);
  const openDelete = ref<boolean>(false);
  const openSearchRecent = ref<boolean>(false);
  const drawerTitle = ref<string>('');
  const stateOptions = computed(() => [
    {
      label: t('serp.task.form.state.-1'),
      value: -1,
    },
    {
      label: t('serp.task.form.state.0'),
      value: 0,
    },
    {
      label: t('serp.task.form.state.1'),
      value: 1,
    },
    {
      label: t('serp.task.form.state.2'),
      value: 2,
    },
  ]);
  const renderQueryData = ref<SerpDataReq>({
    keyword: '',
    area: undefined,
    urls: [],
    create_time: undefined,
    html: undefined,
  });
  const paginationProps = reactive({
    defaultPageSize: 10,
    total: 0,
  });
  const cancelReq = () => {
    openNewOrEdit.value = false;
    openDelete.value = false;
    openSearchRecent.value = false;
  };
  const formDefaultValues: SerpTaskReq = {
    keyword: '',
    num: 10,
    area: undefined,
    expire_time: undefined,
    update_time: undefined,
    state: 0,
  };
  const form = reactive<SerpTaskReq>({ ...formDefaultValues });
  const buttonStatus = ref<string>();
  const formRef = ref();

  // 表单校验
  const beforeSubmit = async (done: any) => {
    const res = await formRef.value?.validate();
    if (!res) {
      // 关闭对话框
      done(true);
    }
    done(false);
  };

  // 提交按钮
  const submitNewOrEdit = async () => {
    setLoading(true);
    try {
      if (buttonStatus.value === 'new') {
        await createSerpTask(form);
        cancelReq();
        Message.success(t('submit.create.success'));
        await fetchSerpTaskList();
      } else {
        await updateSerpTask(operateRow.value, form);
        cancelReq();
        Message.success(t('submit.update.success'));
        await fetchSerpTaskList();
      }
    } catch (error) {
      // console.log(error);
    } finally {
      setLoading(false);
    }
  };

  // 删除按钮
  const submitDelete = async () => {
    setLoading(true);
    try {
      await deleteSerpTask({ pk: rowSelectKeys.value });
      cancelReq();
      Message.success(t('submit.delete.success'));
      await fetchSerpTaskList();
      rowSelectKeys.value = [];
    } catch (error) {
      openDelete.value = false;
      // console.log(error);
    } finally {
      openDelete.value = false;
      setLoading(false);
    }
  };

  // 删除按钮状态
  const deleteButtonStatus = () => {
    return rowSelectKeys.value?.length === 0;
  };

  // 请求API列表
  const fetchSerpTaskList = async (params: SerpTaskParams = {}) => {
    setLoading(true);
    try {
      const res = await querySerpTaskList(params);
      renderData.value = res.items;
      pagination.total = res.total;
      pagination.current = params.page;
    } catch (error) {
      // console.log(error);
    } finally {
      setLoading(false);
    }
  };
  fetchSerpTaskList();

  // 请求详情
  const fetchSerpTaskDetail = async (pk: number) => {
    setLoading(true);
    try {
      const res = await querySerpTaskDetail(pk);
      resetForm(res);
    } catch (error) {
      // console.log(error);
    } finally {
      setLoading(false);
    }
  };

  // 请求数据详情
  const fetchSerpDataDetail = async (taskId: number) => {
    setLoading(true);
    try {
      const res = await querySerpDataRecent(taskId);
      renderQueryData.value = res;
      paginationProps.total = res.urls?.length ?? 0;
    } catch (error) {
      // console.log(error);
    } finally {
      setLoading(false);
    }
  };

  // 事件: 分页
  const onPageChange = async (current: number) => {
    await fetchSerpTaskList({ page: current, size: pagination.pageSize });
  };

  // 事件: 分页大小
  const onPageSizeChange = async (pageSize: number) => {
    pagination.pageSize = pageSize;
    await fetchSerpTaskList({ page: 1, size: pageSize });
  };

  // 搜索
  const search = async () => {
    await fetchSerpTaskList({
      ...formModel.value,
    } as unknown as SerpTaskParams);
  };

  // 重置
  const resetSelect = () => {
    formModel.value = generateFormModel();
  };

  // 重置表单
  const resetForm = (data: Record<any, any>) => {
    Object.keys(data).forEach((key) => {
      // @ts-ignore
      form[key] = data[key];
    });
  };

  // 监听columns变化
  watch(
    () => columns.value,
    (val) => {
      cloneColumns.value = cloneDeep(val);
      cloneColumns.value.forEach((item, index) => {
        item.checked = true;
      });
      showColumns.value = cloneDeep(cloneColumns.value);
    },
    { deep: true, immediate: true }
  );
</script>

<script lang="ts">
  export default {
    name: 'SerpTask',
  };
</script>

<style lang="less" scoped>
  .content {
    padding-top: 20px;
  }
</style>
