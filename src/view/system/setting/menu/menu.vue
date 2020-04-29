<template>
    <div>
      <div>
        <Button icon="md-add" type="primary"  @click="handleShowCreateWindow" title="新增菜单" >新增菜单</Button>
         <Drawer  :title="formTitle" v-model="formModel.opened"  width="600"  :mask-closable="true" :mask="true" :styles="styles">
          <Form :model="formModel.fields" ref="formMenu" :rules="formModel.rules" label-position="left">
            <FormItem label="菜单标题" prop="meta.title" label-position="left">
              <Input v-model="formModel.fields.meta.title" placeholder="请输入菜单标题"/>
            </FormItem>
            <FormItem label="路由名称" prop="name" label-position="left">
              <Input v-model="formModel.fields.name" placeholder="请输入路由名称"/>
            </FormItem>
            <FormItem label="URL地址" prop="route" label-position="left">
              <Input v-model="formModel.fields.route" placeholder="请输入URL地址"/>
            </FormItem>
            <FormItem label="前端组件(.vue)" prop="component" label-position="left">
              <Input v-model="formModel.fields.component" placeholder="前端组件(以.vue结尾,组件必须位于/view文件夹)"/>
            </FormItem>
            <Row :gutter="8">
              <Col span="12">
                <FormItem prop="icon" label-position="left">
                  <Input v-model="formModel.fields.meta.icon" placeholder="请输入图标名称"/>
                </FormItem>
              </Col>
              <Col span="12">
                <FormItem >
                  <Icon :type="formModel.fields.meta.icon" :size="32"/>
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span="24">
                <FormItem  label="父级节点" label-position="left">
                  <Treeselect style="width:300px" v-model="formModel.fields.pid" :multiple="false" :options="options" />
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span="12">
                <FormItem label="菜单隐藏" label-position="left">
                  <i-switch  size="large"  v-model="formModel.fields.meta.hideInMenu">
                    <span slot="open">是</span>
                    <span slot="close">否</span>
                  </i-switch>
                </FormItem>
              </Col>
              <Col span="12">
                <FormItem label="不缓存页面" label-position="left">
                  <i-switch size="large" v-model="formModel.fields.meta.notCache" >
                    <span slot="open">是</span>
                    <span slot="close">否</span>
                  </i-switch>
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span="12">
                <FormItem label="排序" label-position="left">
                  <InputNumber :min="0" v-model="formModel.fields.sort"></InputNumber>
                </FormItem>
              </Col>
            </Row>
            <FormItem label="备注" label-position="top">
              <Input  type="textarea"  v-model="formModel.fields.remark" :rows="4"  placeholder="菜单备注信息" />
            </FormItem>
          </Form>
          <div class="demo-drawer-footer">
            <Button icon="md-checkmark-circle" type="primary" @click="handleSubmitMenu">保 存</Button>
            <Button style="margin-left: 8px" icon="md-close" @click="formModel.opened = false">取 消</Button>
          </div>
        </Drawer>
      </div>
    <div class="content">
       <Table ref="tables" highlight-row :indent-size="20" row-key="id" stripe border :columns="columns" :data="nodeList">
          <template slot="action" slot-scope="{ row }">
              <Button type="text" size="small" class="btn-text" @click="editHandle(row)">编辑</Button>
              <span>-</span>
              <Button type="text" size="small" class="btn-text" @click="deletHandle(row)">删除</Button>
          </template>
        </Table>
      </div>
</div>
</template>

<script>
import { delete_node, create_node,get_nodeInfo, update_node } from '@/api/node'
import { get_nodeList } from '@/api/common'
// import { findIconDataSourceByKeyword } from "@/api/rbac/icon";
export default {
  name: "Menu",
  data() {
    return {
      options: [],
      nodeList: [],
      columns: [
        {
          title: '节点ID',
          key: 'id',
          align: 'left',
          width: 100
        },
        {
          title: '节点名称',
          tree: true,
          render: (h, params) => {
            return h('span', [
              h('span', params.row.meta.title)
            ])
          }
        },
        {
          title: '序号',
          key: 'sort',
          align: 'left',
          width: 100
        },
        {
          title: '路由地址',
          key: 'route',
          align: 'left',
          width: 200
        },
        {
          title: '组件路径',
          key: 'component',
          align: 'left',
          width: 300
        },
        {
          title: '是否可见',
          width: 100,
          render: (h, params) => {
            return h('span', [
              h('span', params.row.meta.hideInMenu ? '隐藏' : '显示')
            ])
          }
        },
        {
          title: '操作',
          slot: 'action',
          align: 'center',
          width: 120
        }
      ],
      formModel: {
        opened: false,
        title: "创建菜单",
        mode: "create",
        fields: {
          id: "",
          name: '',
          route: '',
          remark: '',
          pid: null,
          sort: 3,
          component: '',
          is_menu: '1',
          meta: {
            title: '',
            icon: '',
            hideInMenu: false,
            hideInBread: false,
            showAlways:false,
            notCache:false,
          },
        },
        rules: {
          'meta.title': [
            {
              type: "string",
              required: true,
              message: "请输入菜单标题",
            }
          ],
          name: [
            {
              type: "string",
              required: true,
              message: "请输入路由英文名",
            }
          ],
          route: [
            {
              type: "string",
              required: true,
              message: "请输入路由地址",
            }
          ],
          component: [
            {
              type: "string",
              required: true,
              message: "请输入前端组件的目录地址",
            }
          ],
        }
      },
      styles: {
        height: "calc(100% - 55px)",
        overflow: "auto",
        paddingBottom: "53px",
        position: "static"
      }
    };
  },
  computed: {
    formTitle() {
      if (this.formModel.mode === "create") {
        return "创建菜单";
      }
      if (this.formModel.mode === "edit") {
        return "编辑菜单";
      }
      return "";
    },
  },
  mounted() {
    this.get_nodeList()
  },
  methods: {
    handleShowCreateWindow() { // 新增
      this.formModel.mode = "create";
      this.handleOpenFormWindow()
    },
    editHandle(row) {
      this.formModel.mode = "edit";
      this.get_nodeInfo(row.id)
    },
    deletHandle (row) { // 删除
      this.$Modal.confirm({
        title: '提示',
        content: '<p>确认删除该节点？</p>',
        onOk: () => {
          this.delete_node({ id: row.id })
        }
      })
    },
    handleOpenFormWindow() {
      this.formModel.opened = true;
    },
    handleCloseFormWindow() {
      this.formModel.opened = false;
    },
    handleRefresh() {
      this.get_nodeList();
    },
    handleSubmitMenu() {
      let valid = this.validateMenuForm();
      if (valid) {
        if (this.formModel.mode === "create") {
          this.create_node(this.formModel.fields)
        }
        if (this.formModel.mode === "edit") {
            this.update_node(this.formModel.fields)
        }
      }
    },
    async create_node (params) {
      const res = await create_node(params)
      try {
        if (res.status == 1) {
          this.get_nodeList()
          this.handleCloseFormWindow();
          this.$Message.success('保存成功')
        }
      } catch (error) {
      }
    },
    async get_nodeInfo (id) {
      const res = await get_nodeInfo(id)
      try {
        if (res.status == 1) {
          this.formModel.fields = res.data.node_info
         this.handleOpenFormWindow()
        }
      } catch (error) {
      }
    },
    async update_node (params) {
      const res = await update_node(params)
      try {
        if (res.status == 1) {
          this.get_nodeList()
          this.$Message.success('保存成功')
          this.handleCloseFormWindow();
        }
      } catch (error) {
      }
    },
    async delete_node (params) {
      const res = await delete_node(params)
      try {
        if (res.status == 1) {
          this.get_nodeList()
          this.$Message.success('删除成功')
        }
      } catch (error) {
      }
    },
    validateMenuForm() {
      let _valid = false;
      this.$refs["formMenu"].validate(valid => {
        if (!valid) {
          this.$Message.error("请完善表单信息");
          _valid = false;
        } else {
          _valid = true;
        }
      });
      return _valid;
    },
    async get_nodeList () {
      const res = await get_nodeList()
      try {
        this.nodeList = res.data.node
        let array = res.data.node
        this.callBackTree(array)
        this.options = []
        let finalObj = { id: 0, label: '顶级类目', children: [] }
        finalObj.children =  array
        this.options.push(finalObj)
      } catch (error) {
      }
    },
    callBackTree (data) {
      data.forEach(item => {
        item.label = item.meta.title // 把title属性赋值给name属性
        item.children && this.callBackTree(item.children) // 如果有children，递归调用
      })
    },
  },
};
</script>
