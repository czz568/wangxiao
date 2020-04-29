
<template>
    <div>
        <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="120">
            <div class="roleEdit">
                <div class="title">基本信息 —— 角色</div>
            </div>
            <FormItem label="角色名称" prop="name">
                <Input v-model="formValidate.name"  placeholder="请输入名称" style="width:250px"></Input>
            </FormItem>
            <FormItem label="角色描述" prop="remark">
                <Input type="textarea" v-model="formValidate.remark" placeholder="请输入角色描述" style="width:250px"></Input>
            </FormItem>
        </Form>
        <div style="text-align:center">
            <Button style="width:100px" type="primary" size="large" @click="handleSubmit('formValidate')">保存</Button>
            <Button style="width:100px;margin-left: 20px" size="large" @click="$router.go(-1)">返回</Button>
        </div>
    </div>
</template>

<script>
import { create_role, update_role, get_roleInfo } from '@/api/role'
export default {
  name: 'roleEdit',
  data () {
    return {
      formValidate: {
        id: '',
        name: '',
        remark: ''
      },
      ruleValidate: {
        name: [
          { required: true, message: '角色名称不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  mounted () {
    if (this.$route.query.id) {
      this.get_roleInfo(this.$route.query.id)
    }
  },
  methods: {
    handleSubmit (name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          if (this.$route.query.id) {
            // 修改
            this.formValidate.id = this.$route.query.id
            this.update_role(this.formValidate)
          } else { // 新增
            this.create_role(this.formValidate)
          }
        } else {
          this.$Message.error('请完善信息')
        }
      })
    },
    async get_roleInfo (id) {
      const res = await get_roleInfo(id)
      try {
        this.formValidate = res.data.role_info
      } catch (error) {

      }
    },
    async create_role (params) {
      const res = await create_role(params)
      try {
        if (res.status == 1) {
          this.$Message.success('新增角色成功')
          this.formValidate = {
            name: '',
            remark: ''
          }
          this.$router.push({ name: 'role' })
        }
      } catch (error) {

      }
    },
    async update_role (params) {
      const res = await update_role(params)
      try {
        if (res.status == 1) {
          this.$Message.success('更新角色成功')
          this.formValidate = {
            name: '',
            remark: ''
          }
          this.$router.push({ name: 'role' })
        }
      } catch (error) {

      }
    }
  }
}
</script>
