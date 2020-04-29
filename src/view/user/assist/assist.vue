<template>
 <Card shadow>
    <div class="assist">
        <Form ref="formValidate"  :model="formValidate"  :label-width="80" inline>
            <FormItem label="助教名称" prop="nickname">
                <Input clearable  v-model="formValidate.nickname" placeholder="请输入助教关键字"></Input>
            </FormItem>
            <FormItem label="手机号"  prop="mobile">
                <Input clearable  v-model="formValidate.mobile" placeholder="请输入手机号"></Input>
            </FormItem>
            <FormItem label="显示状态" prop="status">
                <Select clearable v-model="formValidate.status" style="width:200px">
                    <Option :value="1">显示</Option>
                    <Option :value="2">隐藏</Option>
                </Select>
            </FormItem>
            <FormItem class="search-form-btns">
                <Button icon="ios-search" @click="search">搜索</Button>
                <Button style="margin-left: 8px" icon="md-undo" @click="handleReset">重置</Button>
            </FormItem>
        </Form>
        <div>
          <Button type="primary"  icon="md-add"  class="btn-margin-right" @click="$router.push({name: 'assistEdit'})">新增助教</Button>
        </div>
        <div class="content">
          <Table :loading="loading" stripe  border ref="selection" :columns="columns" :data="teacherList">
            <template slot-scope="{ row }" slot="nickname">
              <div class="vmiddle">
                <img class="table-avatar" :src="row.avatar" alt="">
                <span>{{ row.nickname }}</span>
              </div>
            </template>
            <template slot="action" slot-scope="{ row }">
                <Button type="text" size="small" class="btn-text" @click="$router.push({name:'assistEdit', query:{id: row.id}})">编辑</Button>
                <span>-</span>
                <Button type="text" v-if="row.status == '显示'" size="small" class="btn-text" @click="hideHandle(row)" >隐藏</Button>
                <Button type="text" v-if="row.status == '隐藏'" size="small" class="btn-text" @click="showHandle(row)" >显示</Button>
                <span>-</span>
                <Button type="text" size="small" class="btn-text" @click="resetPwd(row)">重置密码</Button>
                <!-- <span>-</span>
                <Button type="text" size="small" class="btn-text" @click="deletHandle(row)">删除</Button> -->
            </template>
          </Table>
          <div class="page">
            <Page class="f-right" :total="total" show-total show-elevator show-sizer @on-change="handlePage" @on-page-size-change="handlePageSize" />
          </div>
        </div>
    </div>
</Card>
</template>
<script>
import { get_teachList, delete_teacher, reset_teachPwd, teacher_display } from '@/api/teacher_assist'
export default {
  data () {
    return {
      loading: true,
      total: 0,
      teacherList: [], // 学生列表
      formValidate: {
        teacher_type: 2,
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
          title: '助教名称',
          slot: 'nickname',
          align: 'left'
        },
        {
          title: '手机号',
          key: 'mobile',
          align: 'left'
        },
        {
          title: '显示状态',
          key: 'status',
          align: 'left'
        },
        {
          title: '更新时间',
          key: 'update_time'
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
    this.get_teachList(this.formValidate)
  },
  methods: {
    deletHandle (row) { // 删除
      this.$Modal.confirm({
        title: '提示',
        content: '<p>删除后，该助教将无法登录相应网站，且助教列表将不再展示该助教信息，与之关联的数据也将被清除，是否确认？</p>',
        onOk: () => {
          this.delete_teacher({ id: row.id })
        }
      })
    },
    hideHandle (row) { // 隐藏
      this.teacher_display({ id: row.id, status: 2 })
    },
    showHandle (row) { // 显示
      this.teacher_display({ id: row.id, status: 1 })
    },
    resetPwd (row) { // 重置密码
      this.$Modal.confirm({
        title: '提示',
        content: '<p>密码将重置为123456，请提醒用户及时修改密码。</p>',
        onOk: () => {
          this.reset_teachPwd({ id: row.id, password: '123456' })
        }
      })
    },
    handlePage (newIndex) { // 切换页码
      this.formValidate.page = newIndex
      this.get_teachList(this.formValidate)
    },
    handlePageSize (pageSize) { // 切换页数
      this.formValidate.limit = pageSize
      this.get_teachList(this.formValidate)
    },
    search () { // 查询
      if (!this.formValidate.status) { // 优化iview-select-bug
        this.formValidate.status = ''
      }
      this.get_teachList(this.formValidate)
    },
    handleReset () { // 重置
      this.formValidate = {
        teacher_type: 2,
        page: 1,
        limit: 10,
        status: '',
        nickname: '',
        mobile: ''
      }
    },
    async get_teachList (params) {
      const res = await get_teachList(params)
      try {
        this.teacherList = res.data.data
        this.total = res.data.total
        this.loading = false
      } catch (error) {
        this.loading = false
      }
    },
    async teacher_display (params) {
      this.loading = true
      const res = await teacher_display(params)
      try {
        if (res.status == 1) {
          this.get_teachList(this.formValidate)
        }
      } catch (error) {
      }
    },
    async reset_teachPwd (params) {
      const res = await reset_teachPwd(params)
      try {
        if (res.status == 1) {
          this.$Message.success('密码重置成功')
        }
      } catch (error) {
      }
    },
    async delete_teacher (params) {
      const res = await delete_teacher(params)
      try {
        if (res.status == 1) {
          this.get_teachList(this.formValidate)
          this.$Message.success('删除成功')
        }
      } catch (error) {
      }
    }
  }
}
</script>
