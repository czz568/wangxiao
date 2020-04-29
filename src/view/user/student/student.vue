<template>
 <Card shadow>
    <div class="student">
        <Form ref="formValidate"  :model="formValidate"  :label-width="80" inline>
            <FormItem label="学生状态" prop="status">
                <Select clearable v-model="formValidate.status" style="width:200px">
                  <Option :value="item.id" v-for="item in statusList" :key="item.id">{{item.name}}</Option>
                </Select>
            </FormItem>
            <FormItem label="学生名称" prop="nickname">
                <Input clearable  v-model="formValidate.nickname" placeholder="请输入学生名称"></Input>
            </FormItem>
            <FormItem label="手机号"  prop="mobile">
                <Input clearable  v-model="formValidate.mobile" placeholder="请输入手机号"></Input>
            </FormItem>
            <FormItem class="search-form-btns">
                <Button icon="ios-search" @click="search">搜索</Button>
                <Button style="margin-left: 8px" icon="md-undo" @click="handleReset">重置</Button>
            </FormItem>
        </Form>
        <div>
          <Button type="primary" icon="md-add" class="btn-margin-right" @click="$router.push({name: 'studentEdit'})">新增学员</Button>
        </div>
        <div class="content">
          <Table :loading="loading" stripe  border ref="selection" :columns="columns" :data="studentList">
            <template slot-scope="{ row }" slot="nickname">
              <div class="vmiddle">
                <img class="table-avatar" :src="row.avatar" alt="">
                <span>{{ row.nickname }}</span>
              </div>
            </template>
            <template slot="action" slot-scope="{ row }">
                <!-- <Button type="text" size="small" class="btn-text">详情</Button>
                <span>-</span> -->
                <Button type="text" size="small" class="btn-text" @click="$router.push({name:'studentEdit', query:{id: row.id}})">编辑</Button>
                <span>-</span>
                <Button type="text" v-if="row.status == '启用'" size="small" class="btn-text" @click="disableHandle(row)" >禁用</Button>
                <Button type="text" v-if="row.status == '禁用'" size="small" class="btn-text" @click="enableHandle(row)" >启用</Button>
                <span>-</span>
                <Button type="text" size="small" class="btn-text" @click="resetPwd(row)">重置密码</Button>
                <!-- <span>-</span>
                <Button type="text" size="small" class="btn-text" @click="deletHandle(row)">删除</Button> -->
            </template>
          </Table>
          <div class="page">
            <!-- <div class="f-left">
              <Button type="text" size="small" class="btn-text " >导出所选</Button>
            </div> -->
            <Page class="f-right" :total="total" show-total show-elevator show-sizer @on-change="handlePage" @on-page-size-change="handlePageSize" />
          </div>
        </div>
    </div>
</Card>
</template>
<script>
import { get_studentList, stud_disable, reset_stuPwd, delete_stud } from '@/api/student'
import { get_enum } from '@/api/common'
export default {
  data () {
    return {
      statusList: [], // 学生状态
      loading: true,
      total: 0,
      studentList: [], // 学生列表
      formValidate: {
        page: 1,
        limit: 10,
        status: '', // 默认启用
        nickname: '',
        mobile: ''
      },
      columns: [
        {
          type: 'selection',
          width: 60,
          align: 'center'
        },
        {
          title: '学生名称',
          slot: 'nickname',
          align: 'left'
        },
        {
          title: '手机号',
          key: 'mobile',
          align: 'left'
        },
        {
          title: '状态',
          key: 'status',
          align: 'left'
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
    this.get_enum('student')
    this.get_studentList(this.formValidate)
  },
  methods: {
    deletHandle (row) { // 删除
      this.$Modal.confirm({
        title: '提示',
        content: '<p>删除后，该学员将无法登录学员端，且学员列表将不再展示该学员信息，与之关联的数据也将被清除，是否确认？</p>',
        onOk: () => {
          this.delete_stud({ id: row.id })
        }
      })
    },
    disableHandle (row) { // 禁用
      this.$Modal.confirm({
        title: '提示',
        content: '<p>禁用后此学员将无法登录网站，确定要禁用该学员吗？</p>',
        onOk: () => {
          this.stud_disable({ id: row.id, status: 2 })
        }
      })
    },
    enableHandle (row) { // 启用
      this.stud_disable({ id: row.id, status: 1 })
    },
    resetPwd (row) { // 重置密码
      this.$Modal.confirm({
        title: '提示',
        content: '<p>密码将重置为123456，请提醒用户及时修改密码。</p>',
        onOk: () => {
          this.reset_stuPwd({ id: row.id, password: '123456' })
        }
      })
    },
    handlePage (newIndex) { // 切换页码
      this.formValidate.page = newIndex
      this.get_studentList(this.formValidate)
    },
    handlePageSize (pageSize) { // 切换页数
      this.formValidate.limit = pageSize
      this.get_studentList(this.formValidate)
    },
    search () { // 查询
      if (!this.formValidate.status) { // 优化iview-select-bug
        this.formValidate.status = ''
      }
      this.get_studentList(this.formValidate)
    },
    handleReset () { // 重置
      this.formValidate = {
        page: 1,
        limit: 10,
        status: '',
        nickname: '',
        mobile: ''
      }
    },
    async get_studentList (params) {
      const res = await get_studentList(params)
      try {
        this.studentList = res.data.data
        this.total = res.data.total
        this.loading = false
      } catch (error) {
        this.loading = false
      }
    },
    async stud_disable (params) {
      this.loading = true
      const res = await stud_disable(params)
      try {
        if (res.status == 1) {
          this.get_studentList(this.formValidate)
        }
      } catch (error) {
      }
    },
    async reset_stuPwd (params) {
      const res = await reset_stuPwd(params)
      try {
        if (res.status == 1) {
          this.$Message.success('密码重置成功')
        }
      } catch (error) {
      }
    },
    async delete_stud (params) {
      const res = await delete_stud(params)
      try {
        if (res.status == 1) {
          this.get_studentList(this.formValidate)
          this.$Message.success('删除成功')
        }
      } catch (error) {
      }
    },
    async get_enum (string) {
      const res = await get_enum(string)
      try {
        this.statusList = res.data.data.status.value
      } catch (error) {

      }
    }
  }
}
</script>
