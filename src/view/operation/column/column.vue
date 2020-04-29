<template>
 <Card shadow>
    <div class="student">
        <div>
            <Button type="primary"  icon="md-add"  class="btn-margin-right"  @click="addClick">新增栏目</Button>
            <Modal v-model="columnModal"  :title="modalType == 'add' ? '新增栏目': '修改栏目'" @on-ok="handleSubmit('columnForm')">
                <Form  ref="columnForm" :model="columnForm" :rules="columnRule" :label-width="120">
                <FormItem prop="name" label="栏目名称">
                    <Input style="width:300px" type="text" v-model="columnForm.name" placeholder="请输入栏目名称"/>
                </FormItem>
                <FormItem prop="key" label="栏目类型">
                    <Input style="width:300px" type="text" v-model="columnForm.key" placeholder="请输入栏目类型"/>
                </FormItem>
                <FormItem prop="sort" label="排序">
                    <Input style="width:300px" type="number"  v-model="columnForm.sort" placeholder="请输入"/>
                </FormItem>
                </Form>
            </Modal>
        </div>
        <div class="content">
          <Table :loading="loading" stripe  border ref="selection" :columns="columns" :data="columnList">
            <template slot="action" slot-scope="{ row }">
                <Button type="text" size="small" class="btn-text" @click="editClick(row)">编辑栏目</Button>
                <span>-</span>
                <Button type="text" size="small" class="btn-text" @click="$router.push({name:'contentList', query:{columnId:row.id}})">查看内容</Button>
                <span>-</span>
                <Button type="text" size="small" class="btn-text" v-if="row.index_status === 2"  @click="showHandle(row)">上架</Button>
                <Button type="text" size="small" class="btn-text" v-if="row.index_status === 1" @click="hideHandle(row)">下架</Button>
                <span>-</span>
                <Button type="text" size="small" class="btn-text" @click="deletHandle(row)">删除</Button>
            </template>
          </Table>
          <!-- <div class="page">
            <Page class="f-right" :total="total" show-total show-elevator show-sizer @on-change="handlePage" @on-page-size-change="handlePageSize" />
          </div> -->
        </div>
    </div>
</Card>
</template>
<script>
import { get_columnList,delete_column,update_column,create_column, get_columnInfo, change_columnStatus } from '@/api/column'

export default {
  data () {
    return {
        modalType: '', // 默认 add新增 update 修改
        columnModal: false,
        columnForm: {
            id:'',
            name: '',
            key:'',
            sort: '',
        },
        columnRule: {
            name: [
                { required: true, message: '栏目名称必须填写', trigger: 'blur' }
            ],
            key: [
                { required: true, message: '栏目类型必须填写', trigger: 'blur' }
            ],
            sort: [
                { required: true, message: '请输入排序', trigger: 'blur' }
            ]
        },
      // ------------创建栏目弹框-----------//
      loading: true,
      total: 0,
      columnList: [], // 栏目列表
      formValidate: {
        page: 1,
        limit: 10,
      },
      columns: [
        {
            title: '序号',
            key: 'sort',
            align: 'left'
        },
        {
          title: '栏目名称',
          key: 'name',
          align: 'left'
        },
        {
          title: '栏目Key',
          key: 'key',
          align: 'left'
        },
        {
          title: '上架状态',
          width: 100,
          render: (h, params) => {
            return h('span', [
              h('span', params.row.index_status == 1? '已上架' : '已下架')
            ])
          }
        },
        {
            title: '创建人',
            key: 'op_admin_name'
        },
        {
          title: '创建时间',
          key: 'created_time'
        },
        {
          title: '操作',
          slot: 'action',
          align: 'center',
          fixed: 'right',
          width: 300
        }
      ]
    }
  },
  mounted () {
    this.get_columnList(this.formValidate)
  },
  methods: {
    showHandle(row) {
        
    },
    addClick () { // 新增
      this.resetModal()
      this.columnModal = true
      this.modalType = 'add'
    },
    editClick (row) { // 编辑
      this.columnModal = true
      this.modalType = 'update'
      this.get_columnInfo(row.id)
    },
    resetModal () {
        this.columnForm = {
            id:'',
            name: '',
            key:'',
            sort: '',
        }
    },
    handleSubmit (name) { // 提交
      this.$refs[name].validate((valid) => {
        if (valid) {
          if (this.modalType == 'add') {
            this.create_column(this.columnForm)
          } else if (this.modalType == 'update') {
            this.update_column(this.columnForm)
          }
        } else {
          this.$Message.error('请完善信息')
        }
      })
    },
    showHandle(row) {
        this.change_columnStatus({id:row.id,index_status: 1})
    },
    hideHandle(row) {
        this.change_columnStatus({id:row.id,index_status: 2})
    },
    handlePage (newIndex) { // 切换页码
      this.formValidate.page = newIndex
      this.get_columnList(this.formValidate)
    },
    handlePageSize (pageSize) { // 切换页数
      this.formValidate.limit = pageSize
      this.get_columnList(this.formValidate)
    },
    async change_columnStatus(params) { // 上下架
      const res = await change_columnStatus(params)
      try {
          if(res.status == 1) {
              this.get_columnList(this.formValidate)
          }
      } catch (error) {
          console.log(error)
      }
    },
    async create_column (params) {
      const res = await create_column(params)
      try {
        if (res.status == 1) {
          this.$Message.success('保存成功')
          this.resetModal()
          this.get_columnList(this.formValidate)
        }
      } catch (error) {
        console.log(error)
      }
    },
    async update_column (params) {
      const res = await update_column(params)
      try {
        if (res.status == 1) {
          this.$Message.success('保存成功')
          this.resetModal()
          this.get_columnList(this.formValidate)
        }
      } catch (error) {
        console.log(error)
      }
    },
    async get_columnInfo (params) {
      const res = await get_columnInfo(params)
      try {
        this.columnForm = res.data.info
        this.columnForm.sort = String(this.columnForm.sort)
      } catch (error) {
        console.log(error)
      }
    },
    deletHandle (row) { // 删除
      this.$Modal.confirm({
        title: '提示',
        content: '<p>确认删除该栏目？</p>',
        onOk: () => {
          this.delete_column({ id: row.id })
        }
      })
    },
    async get_columnList (params) {
        this.loading = true
        const res = await get_columnList(params)
        try {
            this.columnList = res.data.data
            this.total = res.data.total
            this.loading = false
        } catch (error) {
            this.loading = false
        }
    },
    async delete_column (params) {
      const res = await delete_column(params)
      try {
        if (res.status == 1) {
          this.get_columnList(this.formValidate)
          this.$Message.success('删除成功')
        }
      } catch (error) {
      }
    }
  }
}
</script>
