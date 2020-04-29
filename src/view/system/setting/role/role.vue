<template>
    <div class="role">
      <Form ref="formValidate"  :model="formValidate"  :label-width="80" inline>
          <FormItem label="角色名称" prop="keyword">
            <Input clearable  v-model="formValidate.keyword" placeholder="请输入角色名称关键字"></Input>
          </FormItem>
          <FormItem class="search-form-btns">
            <Button icon="ios-search" @click="search">搜索</Button>
            <Button style="margin-left: 8px" icon="md-undo" @click="handleReset">重置</Button>
          </FormItem>
      </Form>
      <div>
        <Button type="primary"  icon="md-add"  class="btn-margin-right" @click="$router.push({name: 'roleEdit'})">新增角色</Button>
      </div>
      <div class="content">
        <Row>
            <Col span="6">
              <Table highlight-row  @on-current-change="clickRow" :loading="loading" stripe style="width:300px"  border ref="selection" :columns="columns" :data="roleList">
                <template slot="action" slot-scope="{ row }">
                    <Button :disabled="row.id == 1 && row.name == '超级管理员'" type="text" size="small" class="btn-text" @click="$router.push({name:'roleEdit', query:{id: row.id}})">编辑</Button>
                    <span>-</span>
                    <Button :disabled="row.id == 1 && row.name == '超级管理员'" type="text" size="small" class="btn-text" @click="deletHandle(row)">删除</Button>
                </template>
              </Table>
            </Col>
            <Col span="18">
              <div style="margin-bottom:10px;">
                <h3 style="background-color:#f3f3f3;margin-bottom:0;padding:5px 5px 5px 10px;">权限列表</h3>
              </div>
              <div>
                <div class="f-right">
                  <Button style="margin-bottom:20px" type="info" class="btn-margin-right" @click="savePermission">保存</Button>
                </div>
                <Tree ref="tree" :data="permissionList" :render="renderContent" show-checkbox multiple></Tree>
              </div>
            </Col>
        </Row>
      </div>
  </div>
</template>
<script>
import { get_roleList, delete_role, get_rolePermission,distribut_permission} from '@/api/role'
export default {
  data () {
    return {
      loading: true,
      total: 0,
      roleList: [], // 角色列表
      permissionList:[],
      rolePermission:{
        node_id: [],
        role_id:'',
      },
      formValidate: {
        page: 1,
        limit: 10,
        keyword: '' // 关键字
      },
      columns: [
        {
          title: '角色名称',
          key: 'name'
        },
        {
          title: '操作',
          slot: 'action',
          align: 'center',
          width: 120
        }
      ]
    }
  },
  mounted () {
    this.get_roleList(this.formValidate)
  },
  methods: {
    savePermission() { // 更新权限
      let list = this.$refs.tree.getCheckedNodes();//获取勾选的
      if(list.length > 0) {
        this.rolePermission.node_id = list.map(item => item.id)
      } else {
        this.rolePermission.node_id = []
      }
      this.distribut_permission(this.rolePermission)
    },
    clickRow (row) { // 点击一行
      this.rolePermission.role_id = row.id
      this.get_rolePermission(row.id)
    },
    search () { // 查询
      this.get_roleList(this.formValidate)
    },
    handleReset () { // 重置
      this.formValidate = {
        page: 1,
        limit: 10,
        keyword: ''
      }
    },
    deletHandle (row) { // 删除
      this.$Modal.confirm({
        title: '提示',
        content: '<p>确认删除该角色？</p>',
        onOk: () => {
          this.delete_role({ id: row.id })
        }
      })
    },
    async get_roleList (params) {
      const res = await get_roleList(params)
      try {
        this.roleList = res.data.data
        this.total = res.data.total
        this.loading = false
      } catch (error) {
        this.loading = false
      }
    },
    async get_rolePermission (id) {
      const res = await get_rolePermission(id)
      try {
        // this.permissionList = arr// 权限列表
        this.permissionList = res.data.result // 权限列表
      } catch (error) {

      }
    },
    async delete_role (params) {
      const res = await delete_role(params)
      try {
        if (res.status == 1) {
          this.get_roleList(this.formValidate)
          this.$Message.success('删除成功')
        }
      } catch (error) {
      }
    },
    async distribut_permission (params) {
      const res = await distribut_permission(params)
      try {
        if (res.status == 1) {
          this.get_rolePermission(this.rolePermission.role_id)
          this.$Message.success('保存成功')
        }
      } catch (error) {
      }
    },
    renderContent(h, { root, node, data }) {
        return h('span', {
            style: {
                display: 'inline-block',
                width: '100%'
            }
        }, [
            h('span', [
                h('Icon', {
                    props: {
                        type: 'ios-paper-outline'
                    },
                    style: {
                        marginRight: '8px'
                    }
                }),
                h('span', data.remark)
            ]),
            h('span', {
                style: {
                    display: 'inline-block',
                    float: 'right',
                    marginRight: '32px'
                }
            })
        ]);
    },
  }
}
</script>
