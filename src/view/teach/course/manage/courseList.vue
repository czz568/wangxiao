<template>
<!-- 课程列表 -->
 <Card shadow>
    <div class="courseList">
        <Form ref="formValidate"  :model="formValidate"  :label-width="80" inline>
            <FormItem label="课程类型" prop="status">
                <Select clearable v-model="formValidate.course_type" style="width:200px" placeholder="请选择">
                  <Option :value="item.id" v-for="item in typeList" :key="item.id">{{item.name}}</Option>
                </Select>
            </FormItem>
            <FormItem  label="课程状态" prop="status">
                <Select clearable v-model="formValidate.status" style="width:200px" placeholder="请选择">
                  <Option :value="item.id" v-for="item in statusList" :key="item.id">{{item.name}}</Option>
                </Select>
            </FormItem>
            <FormItem label="讲师名称" prop="teacher_Id">
                <Select clearable  v-model="formValidate.teacher_Id" style="width:200px" placeholder="请选择">
                  <Option :value="item.id" v-for="item in teacherList" :key="item.id">{{item.nickname}}</Option>
                </Select>
            </FormItem>
            <FormItem label="课程名称" prop="title">
                <Input clearable  v-model="formValidate.title" placeholder="请输入课程名称关键字" style="width: 200px"></Input>
            </FormItem>
            <FormItem class="search-form-btns">
                <Button icon="ios-search" @click="search">搜索</Button>
                <Button style="margin-left: 8px" icon="md-undo" @click="handleReset">重置</Button>
            </FormItem>
        </Form>
        <div>
          <Button type="primary"  icon="md-add"  class="btn-margin-right" @click="modalShow = true">新增课程</Button>
           <Modal footer-hide v-model="modalShow" width="800" title="新增课程">
             <ul class="course-select">
               <li :title="`点击新增${item.title}`" class="course-select-item" v-for="item in modalTypeList" :key="item.type" @click="$router.push({name: 'courseEdit',query:{type: item.type}})">
                 <div class="course-select-title">
                   {{item.title}}
                   <span class="course-select-type" v-if="item.isLive">直播</span>
                 </div>
                 <div>{{item.desc}}</div>
               </li>
             </ul>
          </Modal>
        </div>
        <div class="content">
          <Table  border :loading="loading" stripe   ref="selection" :columns="columns" :data="courseList">
            <template slot-scope="{ row }" slot="title">
              <div class="vmiddle">
                <img v-if="row.cover_img" class="table-avatar" :src="row.cover_img" alt="">
                <span>{{ row.title }}</span>
              </div>
            </template>
            <template slot="action" slot-scope="{ row }">
                <Button type="text" v-if="row.status == '待上架' || row.status == '已下架'" size="small" class="btn-text" @click="showHandle(row)" >上架</Button>
                <Button type="text" v-if="row.status == '已上架'" size="small" class="btn-text" @click="hideHandle(row)" >下架</Button>
                <span>-</span>
                <Button type="text" size="small" class="btn-text" @click="$router.push({name:'courseEdit', query:{id: row.id}})">编辑</Button>
                <span>-</span>
                <Button type="text" size="small" class="btn-text" @click="$router.push({name:'coursePlan', query:{course_id: row.id}})">课程大纲</Button>
                <span>-</span>
                <Button type="text" size="small" class="btn-text" @click="deletHandle(row)">删除</Button>
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
import { get_courseList, delete_course, course_disable } from '@/api/course'
import { get_teachList } from '@/api/teacher_assist'
import { get_enum } from '@/api/common'
export default {
  data () {
    return {
      teacherParams: { // 查询讲师列表
        teacher_type: 1,
        page: 1,
        limit: 10,
        status: '',
        mobile: '',
        nickname: ''
      },
      teacherList: [], // 讲师列表
      modalTypeList: [
        { type: 1, title: '大班课', isLive: true, desc: '主要适用于单向宣讲为主的课程，一对多，不需要或者很少需要互动。' },
        { type: 2, title: '点播课', isLive: true, desc: '无需实时互动的视频课程，需上传对应的视频，可反复观看。' },
        { type: 3, title: '小班课', isLive: true, desc: '每班最多容纳312个学生，学生提前15分钟进入教室，老师提前30分钟进入教室，适用于互动较多的课程，属于精品课。' },
        { type: 4, title: '公开课', isLive: true, desc: '无需付费，用户机构进行调研或获取学员相关信息。' }
      ],
      modalShow: false,
      statusList: [], // 课程状态
      typeList: [], // 课程类型
      loading: true,
      total: 0,
      courseList: [], // 课程列表
      formValidate: {
        course_type: '',
        teacher_Id: '',
        page: 1,
        limit: 10,
        status: '',
        title: ''
      },
      columns: [
        {
          title: '课程ID',
          key: 'id',
          width: 100
        },
        {
          title: '课程名称',
          slot: 'title',
          align: 'left'
        },
        {
          title: '上架状态',
          key: 'status',
          align: 'center'
        },
        {
          title: '创建人',
          key: 'op_admin_name',
          align: 'center'
        },
        {
          title: '更新时间',
          key: 'updated_time'
        },
        {
          title: '操作',
          slot: 'action',
          align: 'center',
          fixed: 'right',
          width: 260
        }
      ]
    }
  },
  mounted () {
    this.get_enum('course')
    this.get_teachList(this.teacherParams)
    this.get_courseList(this.formValidate)
  },
  methods: {
    deletHandle (row) { // 删除
      this.$Modal.confirm({
        title: '提示',
        content: '<p>删除后，该课程将不再展示，与之关联的数据也将被清除，是否确认？</p>',
        onOk: () => {
          this.delete_course({ id: row.id })
        }
      })
    },
    showHandle (row) { // 上架
      this.$Modal.confirm({
        title: '提示',
        content: '<p>确定要上架该课程吗？</p>',
        onOk: () => {
          this.course_disable({ id: row.id, status: 1 })
        }
      })
    },
    hideHandle (row) { // 下架
      this.$Modal.confirm({
        title: '提示',
        content: '<p>确定要下架该课程吗？</p>',
        onOk: () => {
          this.course_disable({ id: row.id, status: 2 })
        }
      })
    },
    handlePage (newIndex) { // 切换页码
      this.formValidate.page = newIndex
      this.get_courseList(this.formValidate)
    },
    handlePageSize (pageSize) { // 切换页数
      this.formValidate.limit = pageSize
      this.get_courseList(this.formValidate)
    },
    search () { // 查询
      if (!this.formValidate.status) {
        this.formValidate.status = ''
      }
      if (!this.formValidate.teacher_Id) {
        this.formValidate.teacher_Id = ''
      }
      if (!this.formValidate.course_type) {
        this.formValidate.course_type = ''
      }
      this.get_courseList(this.formValidate)
    },
    handleReset () { // 重置
      this.formValidate = {
        page: 1,
        limit: 10,
        course_type: '',
        teacher_Id: '',
        status: '',
        title: ''
      }
    },
    async get_courseList (params) {
      const res = await get_courseList(params)
      try {
        if (res.status == 1) {
          this.courseList = res.data.data
          this.total = res.data.total
          this.loading = false
        }
      } catch (error) {
        console.log(error)
        this.loading = false
      }
    },
    async course_disable (params) {
      this.loading = true
      const res = await course_disable(params)
      try {
        if (res.status == 1) {
          this.get_courseList(this.formValidate)
        }
      } catch (error) {
        console.log(error)
      }
    },
    async delete_course (params) {
      const res = await delete_course(params)
      try {
        if (res.status == 1) {
          this.get_courseList(this.formValidate)
          this.$Message.success('删除成功')
        }
      } catch (error) {
        console.log(error)
      }
    },
    async get_teachList (params) {
      const res = await get_teachList(params)
      try {
        if (res.status == 1) {
          this.teacherList = res.data.data
        }
      } catch (error) {
        console.log(error)
      }
    },
    async get_enum (string) {
      const res = await get_enum(string)
      try {
        this.typeList = res.data.data.teacher_type.value
        this.statusList = res.data.data.status.value
      } catch (error) {
        console.log(error)
      }
    }
  }
}
</script>
<style lang="less" scoped>
.course-select {
  overflow: hidden;
  .course-select-item {
    float: left;
    width: 176px;
    border: 1px solid #ccc;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    height: 240px;
    color: #7f6697;
    margin: 8px;
    cursor: pointer;
    padding: 43px 28px;
    text-align: justify;
    &:hover {
      border-color:red;
    }
    .course-select-title {
      color: #000;
      font-size: 16px;
      text-align: center;
      position: relative;
      margin-bottom: 30px;
      .course-select-type {
        position: absolute;
        color: red;
        font-size: 12px;
        top: -5px;
      }
    }
  }
}
</style>
