<template>
  <div class="user-avatar-dropdown">
    <Dropdown @on-click="handleClick">
      <Badge :dot="!!messageUnreadCount">
        <Avatar :src="userAvatar"/>
      </Badge>
      <Icon :size="18" type="md-arrow-dropdown"></Icon>
      <DropdownMenu slot="list">
        <!-- <DropdownItem name="message">
          消息中心<Badge style="margin-left: 10px" :count="messageUnreadCount"></Badge>
        </DropdownItem> -->
        <DropdownItem name="changePwd">修改密码</DropdownItem>
        <DropdownItem name="logout">退出登录</DropdownItem>
      </DropdownMenu>
    </Dropdown>
     <Modal v-model="userPwdModal" width="360" title="修改密码"  @on-ok="changePwd">
        <Form ref="resetPwdForm"  :model="userPwdParams" :rules="userPwdValidate" :label-width="120" inline>
          <FormItem label="原密码" prop="password">
            <Input clearable type="password" v-model="userPwdParams.old_password" placeholder="请输入原密码"></Input>
          </FormItem>
          <FormItem label="新密码密码" prop="password">
            <Input clearable type="password" v-model="userPwdParams.password" placeholder="请输入新密码"></Input>
          </FormItem>
          <FormItem label="确认密码" prop="password_confirmation">
            <Input clearable type="password" v-model="userPwdParams.password_confirmation" placeholder="请输入确认密码"></Input>
          </FormItem>
        </Form>
      </Modal>
  </div>
</template>

<script>
import './user.less'
import { mapActions } from 'vuex'
import { localSave, localRead } from '@/libs/util'

import { updateMyPassword } from '@/api/account'
export default {
  name: 'User',
  props: {
    userAvatar: {
      type: String,
      default: ''
    },
    messageUnreadCount: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      userPwdModal: false,
      userPwdParams: {
        id: '',
        old_password: '',
        password: '',
        password_confirmation: ''
      },
      userPwdValidate: {
        old_password: [
          { required: true, message: '旧密码不能为空', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '新密码不能为空', trigger: 'blur' }
        ],
        password_confirmation: [
          { required: true, message: '确认密码不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    ...mapActions([
      'handleLogOut'
    ]),
    logout () {
      this.handleLogOut().then(() => {
        this.$router.push({
          name: 'login'
        })
      })
    },
    changePwd () {
      let userInfo = JSON.parse(localRead('userInfo'))
      this.userPwdParams.id = userInfo.id
      this.updateMyPassword(this.userPwdParams)
    },
    handleClick (name) {
      switch (name) {
        case 'changePwd':
          this.userPwdModal = true
          break
        case 'logout': this.logout()
          break
      }
    },
    async updateMyPassword (params) {
      const res = await updateMyPassword(params)
      try {
        if (res.status == 1) {
          this.userPwdModal = false
          this.userPwdParams = {
            id: '',
            old_password: '',
            password: '',
            password_confirmation: ''
          }
        }
      } catch (error) {

      }
    }
  }
}
</script>
