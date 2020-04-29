
<template>
    <div>
        <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="120">
            <div class="accountEdit">
                <div class="title">基本信息</div>
            </div>
            <FormItem v-if="!$route.query.id" label="账号" prop="useraccount">
                <Input  v-model="formValidate.useraccount"  placeholder="请输入账号" style="width:250px"></Input>
            </FormItem>
            <FormItem v-if="!$route.query.id" label="登录密码" prop="password">
                <Input type="password" v-model="formValidate.password"  placeholder="请输入密码" style="width:250px"></Input>
            </FormItem>
            <FormItem label="昵称" prop="nickname">
                <Input v-model="formValidate.nickname" :maxlength="10" placeholder="请输入名称，最多可添加10个字" style="width:250px"></Input>
                <span>{{formValidate.nickname.length}}/10</span>
            </FormItem>
            <FormItem label="邮箱" prop="email">
                <Input type="email" v-model="formValidate.email" placeholder="请输入邮箱" style="width:250px"></Input>
            </FormItem>
            <FormItem label="手机号" prop="mobile">
                <Input v-model="formValidate.mobile" placeholder="请输入合法的手机号" style="width:250px"></Input>
            </FormItem>
            <FormItem label="角色">
                <Select v-model="formValidate.role_id"  placeholder="请选择" style="width:250px">
                    <Option :value="item.id" v-for="item in roleList" :key="item.id" >{{item.name}}</Option>
                </Select>
            </FormItem>
        </Form>
        <div style="text-align:center">
            <Button style="width:100px" type="primary" size="large" @click="handleSubmit('formValidate')">保存</Button>
            <Button style="width:100px;margin-left:20px"  size="large" @click="$router.go(-1)">返回</Button>
        </div>
    </div>
</template>

<script>
import { create_account, update_account, get_accountInfo } from '@/api/account'
import { get_roleList } from '@/api/role'
export default {
  name: 'accountEdit',
  data () {
    return {
      roleParams: {
        page: 1,
        limit: 10,
        keyword: '' // 关键字 昵称
      },
      roleList: [],
      formValidate: {
        useraccount: '',
        password: '',
        nickname: '',
        email: '',
        mobile: '',
        role_id: ''
      },
      ruleValidate: {
        useraccount: [
          { required: true, message: '账号不能为空', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '密码不能为空', trigger: 'blur' }
        ],
        nickname: [
          { required: true, message: '昵称不能为空', trigger: 'blur' }
        ],
        role_id: [
          { required: true, message: '角色不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  mounted () {
    this.get_roleList(this.roleParams)
    if (this.$route.query.id) {
      this.get_accountInfo(this.$route.query.id)
    }
  },
  methods: {
    successFile (data) {
      this.formValidate.avatar = data
    },
    handleSubmit (name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          if (this.$route.query.id) {
            // 修改
            this.formValidate.id = this.$route.query.id
            this.update_account(this.formValidate)
          } else { // 新增
            this.create_account(this.formValidate)
          }
        } else {
          this.$Message.error('请完善信息')
        }
      })
    },
    async get_accountInfo (id) {
      const res = await get_accountInfo(id)
      try {
        this.formValidate = res.data.admin_info
      } catch (error) {

      }
    },
    async create_account (params) {
      const res = await create_account(params)
      try {
        if (res.status == 1) {
          this.$Message.success('新增账号成功')
          this.formValidate = {
            useraccount: '',
            password: '',
            role_id: '',
            nickname: '',
            email: '',
            mobile: ''
          }
          this.$router.push({ name: 'account' })
        }
      } catch (error) {

      }
    },
    async update_account (params) {
      const res = await update_account(params)
      try {
        if (res.status == 1) {
          this.$Message.success('更新账户成功')
          this.formValidate = {
            useraccount: '',
            password: '',
            role_id: '',
            nickname: '',
            email: '',
            mobile: ''
          }
          this.$router.push({ name: 'account' })
        }
      } catch (error) {

      }
    },
    async get_roleList (params) {
      const res = await get_roleList(params)
      try {
        this.roleList = res.data.data
      } catch (error) {
      }
    }
  }
}
</script>

<style lang="less" scoped>
.title {
    position: relative;
    margin-bottom: 20px;
    padding: 5px 15px;
    font-size: 16px;
    &:before {
        display: block;
        position: absolute;
        left: 0;
        top: 7px;
        content: "";
        height: 20px;
        background-color: #2d8cf0;
        width: 4px;
    }
}
</style>
