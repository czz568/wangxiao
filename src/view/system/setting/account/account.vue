<template>
 <Card shadow>
    <div class="student">
        <Form ref="formValidate"  :model="formValidate"  :label-width="80" inline>
            <FormItem label="账号昵称" prop="keyword">
              <Input clearable  v-model="formValidate.keyword" placeholder="请输入昵称关键字"></Input>
            </FormItem>
            <FormItem class="search-form-btns">
              <Button icon="ios-search" @click="search">搜索</Button>
              <Button style="margin-left: 8px" icon="md-undo" @click="handleReset">重置</Button>
            </FormItem>
        </Form>
        <div>
          <Button type="primary"  icon="md-add"  class="btn-margin-right" @click="$router.push({name: 'accountEdit'})">新增账号</Button>
        </div>
        <div class="content">
          <Table :loading="loading" stripe  border ref="selection" :columns="columns" :data="accountList">
            <template slot="action" slot-scope="{ row }">
                <Button type="text" size="small" class="btn-text" @click="$router.push({name:'accountEdit', query:{id: row.id}})">编辑</Button>
                <span>-</span>
                <Button type="text" size="small" class="btn-text" @click="changePwd(row)">修改密码</Button>
                <span>-</span>
                <Button type="text" size="small" class="btn-text" @click="deletHandle(row)">删除</Button>
            </template>
          </Table>
          <Modal v-model="adminPwdModal" width="360" title="修改管理员密码"  @on-ok="confirmReset">
            <Form ref="resetPwdForm"  :model="adminPwdParams" :rules="adminPwdValidate" :label-width="80" inline>
              <FormItem label="密码" prop="password">
                <Input clearable type="password" v-model="adminPwdParams.password" placeholder="请输入密码"></Input>
              </FormItem>
              <FormItem label="确认密码" prop="password_confirmation">
                <Input clearable type="password" v-model="adminPwdParams.password_confirmation" placeholder="请输入确认密码"></Input>
              </FormItem>
            </Form>
          </Modal>
          <div class="page">
            <Page class="f-right" :total="total" show-total show-elevator show-sizer @on-change="handlePage" @on-page-size-change="handlePageSize" />
          </div>
        </div>
    </div>
</Card>
</template>
<script>
import { get_accountList, delete_account, reset_accountPwd } from '@/api/account'
export default {
  data () {
    return {
      adminPwdModal: false,
      adminPwdParams: {
        id: '',
        password: '',
        password_confirmation: ''
      },
      adminPwdValidate: {
        password: [
          { required: true, message: '密码不能为空', trigger: 'blur' }
        ],
        password_confirmation: [
          { required: true, message: '确认密码不能为空', trigger: 'blur' }
        ]
      },
      // ------------密码弹框-----------//
      loading: true,
      total: 0,
      accountList: [], // 学生列表
      formValidate: {
        page: 1,
        limit: 10,
        keyword: '' // 关键字 昵称
      },
      columns: [
        {
          type: 'selection',
          width: 60,
          align: 'center'
        },
        {
          title: '昵称',
          key: 'nickname',
          align: 'left'
        },
        {
          title: '手机号',
          key: 'mobile',
          align: 'left'
        },
        {
          title: '角色',
          key: 'role_id',
          align: 'left'
        },
        {
          title: '更新时间',
          key: 'login_time'
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
    this.get_accountList(this.formValidate)
  },
  methods: {
    changePwd (row) {
      this.adminPwdModal = true
      this.adminPwdParams.id = row.id
    },
    confirmReset () {
      if (this.adminPwdParams.password !== this.adminPwdParams.password_confirmation) {
        this.$Message.warning('两次密码不一致')
        return
      }
      this.reset_accountPwd(this.adminPwdParams)
    },
    handlePage (newIndex) { // 切换页码
      this.formValidate.page = newIndex
      this.get_accountList(this.formValidate)
    },
    handlePageSize (pageSize) { // 切换页数
      this.formValidate.limit = pageSize
      this.get_accountList(this.formValidate)
    },
    search () { // 查询
      this.get_accountList(this.formValidate)
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
        content: '<p>确认删除该账号？</p>',
        onOk: () => {
          this.delete_account({ id: row.id })
        }
      })
    },
    async get_accountList (params) {
      const res = await get_accountList(params)
      try {
        this.accountList = res.data.data
        this.total = res.data.total
        this.loading = false
      } catch (error) {
        this.loading = false
      }
    },
    async reset_accountPwd (params) {
      const res = await reset_accountPwd(params)
      try {
        if (res.status == 1) {
          this.$Message.success('密码修改成功')
        }
      } catch (error) {
      }
    },
    async delete_account (params) {
      const res = await delete_account(params)
      try {
        if (res.status == 1) {
          this.get_accountList(this.formValidate)
          this.$Message.success('删除成功')
        }
      } catch (error) {
      }
    }
  }
}
</script>
