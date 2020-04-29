<style lang="less">
  @import './login.less';
</style>
<template>
  <div class="login">
    <div class="login-con">
      <Card icon="log-in" title="欢迎登录网校管理平台" :bordered="false">
        <div class="form-con">
          <Form ref="loginForm" :model="form" :rules="rules" @keydown.enter.native="handleSubmit">
            <FormItem prop="username">
              <Input v-model="form.username" placeholder="请输入用户名">
                <span slot="prepend">
                  <Icon :size="16" type="ios-person"></Icon>
                </span>
              </Input>
            </FormItem>
            <FormItem prop="captcha">
              <Input style="width:50%" prefix="ios-card" v-model="form.captcha" placeholder="请输入验证码"></Input>
              <div class="code-img">
                <img :src="codeImgUrl" alt="">
              </div>
              <Icon class="reset-icon" title="点击重新验证码" :size="18" type="md-refresh" @click="get_captcha"/>
            </FormItem>
            <FormItem prop="password">
              <Input type="password" v-model="form.password" placeholder="请输入密码">
                <span slot="prepend">
                  <Icon :size="14" type="md-lock"></Icon>
                </span>
              </Input>
            </FormItem>
            <FormItem>
              <Button @click="handleSubmit" type="primary" long>登录</Button>
            </FormItem>
          </Form>
          <p class="login-tip">输入注册时的用户名和密码即可</p>
        </div>
      </Card>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import { get_captcha, login } from '@/api/user'
import { setToken, getToken, localSave, localRead } from '@/libs/util'
import { initRouter } from '@/libs/router-util' // ①新增  引入动态菜单渲染

export default {
  data () {
    return {
      codeImgUrl: '',
      form: {
        username: 'qianyong',
        password: '123456',
        captcha: '',
        catKey: ''
      },
      rules: {
        username: [
          { required: true, message: '账号不能为空', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '密码不能为空', trigger: 'blur' }
        ],
        captcha: [
          { required: true, message: '验证码不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  mounted () {
    this.get_captcha()
  },
  methods: {
    handleSubmit () {
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          this.form.username = this.form.username.trim()
          this.login(this.form)
        }
      })
    },
    async login (params) {
      const res = await login(params)
      try {
        if (res.status == 1) {
          let userInfo = res.data.user_info
          setToken(res.data.token)
          localSave('userInfo', JSON.stringify(userInfo))
          this.$store.commit('setAvatar', 'https://wangxiao.baijiayun.com/statics/user/avatar.jpg') // 更新头像
          this.$store.commit('setUsername', userInfo.nickname) // 更新用户名
          this.$store.commit('setUserId', userInfo.id) // 用户Id
          this.$store.commit('setAccess', '') // 权限
          this.$store.commit('setHasGetInfo', true) // 是否以获取信息
          initRouter(this)　　 // 主要修改这里
          this.$router.push({ name: 'home' })
        } else {
          this.get_captcha()
          this.form.captcha = ''
        }
      } catch (error) {
        console.log(error)
      }
    },
    async get_captcha () {
      const res = await get_captcha()
      try {
        this.codeImgUrl = res.data.url
        this.form.catKey = res.data.key
      } catch (error) {
        console.log(error)
      }
    }
  }
}
</script>

<style lang="less" scoped>
.code-img {
  display:inline-block;
  width:30%;
  height:30px;
  margin-left:10px;
  border: 1px solid #ccc;
  vertical-align: middle;
  img {
    display:block;
    width:100%;
    height:100%;
  }
}
.reset-icon {
  margin-left: 10px;
  cursor: pointer;
  &:hover {
    color: #2d8cf0;
  }
}
</style>
