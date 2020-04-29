
<template>
    <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="120">
        <div class="contentEditor">
            <div class="title">基本信息</div>
        </div>
        <FormItem label="名称" prop="name">
            <Input v-model="formValidate.name" :maxlength="15" placeholder="请输入名称，最多可添加15个字" style="width:250px"></Input>
            <span>{{formValidate.name.length}}/15</span>
        </FormItem>
        <FormItem label="序号" prop="sort">
            <Input v-model="formValidate.sort" type="number" placeholder="请输入序号" style="width:250px"></Input>
        </FormItem>
        <FormItem label="图1" prop="img">
            <div class="upload-avatar-box">
              <div class="avatar-wrap" v-if="formValidate.img" >
                <img class="avatar" :src="formValidate.img" alt="">
              </div>
              <UploadComponents type="image" @successFun="successFun_first" style="width:100%">
                <span style="color:#ccc">PC端1920*575像素或4:1，移动端750*422像素或16:9；支持PNG、JPG，小于5M</span>
              </UploadComponents>
            </div>
        </FormItem>
        <FormItem label="图2" prop="img2">
            <div class="upload-avatar-box">
              <div class="avatar-wrap" v-if="formValidate.img2" >
                  <img class="avatar" :src="formValidate.img2" alt="">
              </div>
              <UploadComponents type="image" @successFun="successFun_second" style="width:100%">
                  <span style="color:#ccc">PC端1920*575像素或4:1，移动端750*422像素或16:9；支持PNG、JPG，小于5M</span>
              </UploadComponents>
            </div>
        </FormItem>
        <FormItem label="发布平台"  prop="client_link">
            <CheckboxGroup v-model="formValidate.client_link">
              <Checkbox  class="checkBox" v-for="item in platformList" :key="item.client_type" :label="item.client_type"> 
                <span>{{item.name}}</span>
              </Checkbox>
            </CheckboxGroup>
            <div class="link-wrap" v-if="formValidate.client_link.includes(1)">
              <span>PC链接</span>
              <Input  placeholder="请输入链接" class="chek-input" v-model="PC_link"></Input>
            </div>
            <div class="link-wrap" v-if="formValidate.client_link.includes(2)">
              <span>安卓链接</span>
              <Input  placeholder="请输入链接" class="chek-input" v-model="android_link"></Input>
            </div>
            <div class="link-wrap" v-if="formValidate.client_link.includes(4)">
              <span>IOS链接</span>
              <Input  placeholder="请输入链接" class="chek-input" v-model="ios_link"></Input>
            </div>
            <div class="link-wrap" v-if="formValidate.client_link.includes(8)">
              <span>H5链接</span>
              <Input  placeholder="请输入链接" class="chek-input" v-model="H5_link"></Input>
            </div>
            <div class="link-wrap" v-if="formValidate.client_link.includes(16)">
              <span>小程序链接</span>
              <Input  placeholder="请输入链接" class="chek-input" v-model="mini_link"></Input>
            </div>
        </FormItem>
        <FormItem label="描述" prop="intro">
            <Input v-model="formValidate.intro" type="textarea" placeholder="请输入描述" style="width:400px"></Input>
        </FormItem>
        <FormItem>
            <Button style="width:100px" type="primary" size="large" @click="handleSubmit('formValidate')">保存</Button>
            <Button style="width:100px;margin-left:20px"  size="large" @click="$router.go(-1)">返回</Button>
        </FormItem>
    </Form>
</template>

<script>
import { create_content, get_contentInfo, update_content} from '@/api/contentList'
import UploadComponents from '@/components/upload/upload'
export default {
  components: {
    UploadComponents
  },
  data () {
    return {
      PC_link: '',
      android_link:'',
      ios_link:'',
      H5_link:'',
      mini_link:'',
      platformList: [
        {client_type:1,name:'PC'},
        {client_type:2,name:'安卓'},
        {client_type:4,name:'IOS'},
        {client_type:8,name:'H5'},
        {client_type:16,name:'小程序'},
      ],
      formValidate: {
        recommend_channel_id:'',
        name: '',
        client_link: [],
        img: '', 
        img2: '',
        sort: '',
        intro: '',
      },
      ruleValidate: {
        name: [
          { required: true, message: '名称不能为空', trigger: 'blur' }
        ],
        sort: [
          { required: true, trigger: 'blur', 
            validator: (rule, value, callback) => {
              if (!this.formValidate.sort) {
                callback(new Error('请输入序号'))
              } else {
                callback()
              }
            }
          }
        ],
        client_link: [
          { required: true, trigger: 'change',
            validator: (rule, value, callback) => {
              if (this.formValidate.client_link.length == 0) {
                callback(new Error('请选择发布平台！'))
              } else {
                callback()
              }
            }
          }
        ],
      }
    }
  },
  mounted () {
    if(this.$route.query.id) {
      this.get_contentInfo(this.$route.query.id)
    }
  },
  methods: {
    successFun_first (url) {
      this.formValidate.img = url
    },
    successFun_second (url) {
      this.formValidate.img2 = url
    },
    handleSubmit (name) { // 提交
      let client = []
      this.formValidate.client_link.forEach(item => {
        var obj = {}
        obj.client_type = item
        if(item === 1) {
          obj.client_link = this.PC_link
        } else if(item === 2){
          obj.client_link = this.android_link
        } else if(item === 4){
          obj.client_link = this.ios_link
        } else if(item === 8){
          obj.client_link = this.H5_link
        } else if(item === 16){
          obj.client_link = this.mini_link
        }
        client.push(obj)
      })
      this.formValidate.client_link = client
      this.$refs[name].validate((valid) => {
        if (valid) {
          if (this.$route.query.id) {
            // 修改
            this.formValidate.id = this.$route.query.id
            this.update_content(this.formValidate)
          } else { // 新增
            this.formValidate.recommend_channel_id = this.$route.query.columnId
            this.create_content(this.formValidate)
          }
        } else {
          this.$Message.error('请完善信息')
        }
      })
    },
    async get_contentInfo (id) {
      const res = await get_contentInfo(id)
      try {
        this.formValidate.id = res.data.info.id
        this.formValidate.recommend_channel_id = res.data.info.recommend_channel_id
        this.formValidate.name = res.data.info.name
        this.formValidate.img = res.data.info.img
        this.formValidate.img2 = res.data.info.img2
        this.formValidate.sort = res.data.info.sort
        this.formValidate.intro = res.data.info.intro
        this.formValidate.client_link = res.data.info.client_type
        this.formValidate.client_link.forEach(item => {
          if(item.client_type == 1) {
            this.PC_link = item.link
          } else if(item.client_type == 2) {
            this.android_link = item.link
          } else if(item.client_type == 4) {
            this.ios_link = item.link
          } else if(item.client_type == 8) {
            this.H5_link = item.link
          } else if(item.client_type == 16) {
            this.mini_link = item.link
          }
        })
        this.formValidate.client_link =  this.formValidate.client_link.map(item => item.client_type)
        console.log(this.formValidate.client_link)
      } catch (error) {
      }
    },
    async create_content (params) {
      const res = await create_content(params)
      try {
        if (res.status == 1) {
          this.$Message.success('保存成功')
          this.formValidate = {
            name: '',
            client_link: [],
            img: '', //
            img2: '',
            sort: '',
            intro: '',
          }
          this.$router.go(-1)
        }
      } catch (error) {
        
      }
    },
    async update_content (params) {
      const res = await update_content(params)
      try {
        if (res.status == 1) {
          this.$Message.success('保存成功')
          this.formValidate = {
            name: '',
            client_link: [],
            img: '', //
            img2: '',
            sort: '',
            intro: '',
          },
          this.$router.go(-1)
        }
      } catch (error) {

      }
    },
  }
}
</script>

<style lang="less" scoped>
.checkBox {
  margin-bottom: 20px;
}
.link-wrap {
  width: 100%;
  margin-bottom: 10px;
  .chek-input {
    width: 300px;
    margin-left: 20px;
  }
}
</style>