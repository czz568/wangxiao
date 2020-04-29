<template>
 <Card shadow>
    <div class="attribute">
        <!-- <Form ref="formValidate"  :model="formValidate"  :label-width="80" inline>
            <FormItem label="属性类型" prop="type">
                <Select clearable v-model="formValidate.type" style="width:200px">
                  <Option :value="1" >单选</Option>
                  <Option :value="2" >多选</Option>
                </Select>
            </FormItem>
            <FormItem class="search-form-btns">
                <Button icon="ios-search" @click="search">搜索</Button>
                <Button style="margin-left: 8px" icon="md-undo" @click="handleReset">重置</Button>
            </FormItem>
        </Form> -->
        <div>
          <Button type="primary" class="btn-margin-right" @click="addClick">添加属性</Button>
          <Modal v-model="attributeModal"  :title="modalType == 'add' ? '新增属性': '修改属性'" @on-ok="handleSubmit('attributeForm')">
            <Form  ref="attributeForm" :model="attributeForm" :rules="attributeRule" :label-width="120">
              <FormItem prop="name" label="属性名称">
                <Input style="width:300px" type="text" v-model="attributeForm.name" placeholder="请输入属性名称"/>
              </FormItem>
              <FormItem prop="sort" label="排序">
                <Input style="width:300px" type="number"  v-model="attributeForm.sort" placeholder="请输入"/>
              </FormItem>
              <FormItem prop="pid" label="父级属性">
                 <Treeselect style="width:300px" :normalizer="normalizer" v-model="attributeForm.pid" :multiple="false" :options="parentAttribute" />
              </FormItem>
            </Form>
          </Modal>
        </div>
        <div class="content">
          <Table  :indent-size="20" style="width:100%"  row-key="id" :loading="loading" strip  border ref="selection" :columns="columns" :data="attributeList">
            <template slot="action" slot-scope="{ row }">
                <Button type="text" size="small" class="btn-text" @click="editClick(row)">编辑</Button>
                <span>-</span>
                <Button type="text" size="small" class="btn-text" @click="deletHandle(row)">删除</Button>
            </template>
          </Table>
        </div>
    </div>
</Card>
</template>
<script>
import { get_attributeList, create_attribute, get_attributeInfo, update_attribute, delete_attribute } from '@/api/attribute'
export default {
  data () {
    return {
      normalizer (node) {
        return {
          id: node.id,
          label: node.name,
          children: node.children
        }
      },
      modalType: '', // 默认 add新增 update 修改
      attributeModal: false,
      attributeForm: {
        name: '',
        sort: '',
        pid: null,
        is_required: '',
        module: [],
        is_show_front: ''
      },
      attributeRule: {
        name: [
          { required: true, message: '属性名称必须填写', trigger: 'blur' }
        ],
        sort: [
          { required: true, message: '请输入排序', trigger: 'blur' }
        ]
      },
      loading: true,
      attributeList: [], // 属性列表
      formValidate: {
        type: 0
      },
      columns: [
        {
          title: '属性名称',
          key: 'name',
          tree: true
        },
        {
          title: 'ID',
          key: 'id',
          width: 100,
          align: 'center'
        },
        {
          title: '序号',
          key: 'sort',
          align: 'center'
        },
        {
          title: '操作',
          slot: 'action',
          align: 'center',
          width: 300
        }
      ]
    }
  },
  computed: {
    parentAttribute () { // 顶级类目
      let finalTree = []
      let first = { id: 0, name: '顶级属性', pid: -1, children: [] }
      first.children = this.attributeList
      finalTree.push(first)
      return finalTree
    }
  },
  mounted () {
    this.get_attributeList()
  },
  methods: {
    addClick () { // 新增
      this.resetModal()
      this.attributeModal = true
      this.modalType = 'add'
    },
    editClick (row) { // 编辑
      this.attributeForm.pid = null
      this.attributeModal = true
      this.modalType = 'update'
      this.get_attributeInfo(row.id)
    },
    handleSubmit (name) { // 提交
      this.$refs[name].validate((valid) => {
        if (valid) {
          if (this.modalType == 'add') {
            this.create_attribute(this.attributeForm)
          } else if (this.modalType == 'update') {
            this.update_attribute(this.attributeForm)
          }
        } else {
          this.$Message.error('请完善信息')
        }
      })
    },
    deletHandle (row) { // 删除
      this.$Modal.confirm({
        title: '提示',
        content: '<p>是否确认删除该属性？</p>',
        onOk: () => {
          this.delete_attribute({ id: row.id })
        }
      })
    },
    search () { // 查询
      if (!this.formValidate.type) { // 优化iview-select-bug
        this.formValidate.type = 0
      }
      this.get_attributeList(this.formValidate)
    },
    handleReset () { // 重置
      this.formValidate.type = 0
    },
    resetModal () {
      this.attributeForm = {
        name: '',
        sort: '',
        pid: null,
        is_required: '',
        module: [],
        is_show_front: ''
      }
    },
    async get_attributeList (params) {
      const res = await get_attributeList(params)
      try {
        this.attributeList = res.data.date
        this.loading = false
      } catch (error) {
        this.loading = false
      }
    },
    async get_attributeInfo (params) {
      const res = await get_attributeInfo(params)
      try {
        this.attributeForm = res.data.info
        this.attributeForm.sort = String(this.attributeForm.sort)
      } catch (error) {
        console.log(error)
      }
    },
    async create_attribute (params) {
      const res = await create_attribute(params)
      try {
        if (res.status == 1) {
          this.$Message.success('保存成功')
          this.resetModal()
          this.get_attributeList()
        }
      } catch (error) {
        console.log(error)
      }
    },
    async update_attribute (params) {
      const res = await update_attribute(params)
      try {
        if (res.status == 1) {
          this.$Message.success('保存成功')
          this.resetModal()
          this.get_attributeList()
        }
      } catch (error) {
        console.log(error)
      }
    },
    async delete_attribute (params) {
      const res = await delete_attribute(params)
      try {
        if (res.status == 1) {
          this.get_attributeList()
          this.$Message.success('删除成功')
        }
      } catch (error) {
      }
    }
  }
}
</script>
