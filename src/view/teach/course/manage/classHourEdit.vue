
<template>
<!-- 新增/编辑课时 -->
<div class="classHourEdit">
    <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="120">
        <div class="courseEdit">
            <div class="title">基本信息</div>
        </div>
        <FormItem label="课时名称" prop="title">
            <Input v-model.trim="formValidate.title" :maxlength="50" placeholder="请输入名称，最多可添加30个字" style="width:250px"></Input>
            <span>{{formValidate.title.length}}/50</span>
        </FormItem>
        <FormItem  label="上课时间"  prop="start_play">
            <DatePicker :value="formValidate.start_play" @on-change="changeDateStar" type="date" format="yyyy-MM-dd" placeholder="请选择"  style="width:280px" ></DatePicker>
        </FormItem>
        <FormItem label="下课时间"  prop="end_play">
            <DatePicker :value="formValidate.end_play"  @on-change="changeDateEnd" type="date" format="yyyy-MM-dd" placeholder="请选择"  style="width:280px"></DatePicker>
        </FormItem>
        <FormItem label="本节课时间"  prop="play_time">
            <Input v-model.trim="formValidate.play_time"  placeholder="请输入本节课时间" style="width:250px"></Input>
            <span>分钟</span>
        </FormItem>
        <FormItem label="主讲老师"  prop="teacher_id">
             <Select v-model="formValidate.teacher_id" placeholder="请选择" style="width:200px">
                <Option :value="item.id" v-for="item in teacherList" :key="item.id">{{item.nickname}}</Option>
            </Select>
        </FormItem>
        <FormItem label="助教讲师" prop="items_teacher">
            <span style="color:#8c8c8c;margin-right: 50px;"><Icon type="ios-information-circle"/>可将平台内的讲师或助教添加为直播间助教讲师，辅助主讲老师授课</span>
            <Button style="height:36px;line-height:32px;margin-right:20px"  icon="ios-add" type="dashed" size="small" @click="teacherModal = true">选择讲师</Button>
            <Button style="height:36px;line-height:32px"  icon="ios-add" type="dashed" size="small"  @click="assistModal = true">选择助教</Button>
            <div v-if="tagTeach_list.length > 0" style="margin-bottom:20px">
                <span style="color:#aaa;margin-right:20px">已选讲师</span>
                <Tag style="height:36px;line-height:32px" type="border" :name="item.id"  closable v-for="item in tagTeach_list" :key="item.id" @on-close="tagClose_teacher">{{item.nickname}}</Tag>
            </div>
            <div v-if="tagAssist_list.length > 0" >
                <span style="color:#aaa;margin-right:20px">已选助教</span>
                <Tag style="height:36px;line-height:32px" type="border" :name="item.id"  closable v-for="item in tagAssist_list" :key="item.id" @on-close="tagClose_assist">{{item.nickname}}</Tag>
            </div>
            <Modal  v-model="teacherModal" width="800" title="选择讲师" @on-ok="teach_onOK">
                <div class="teacher-table-wrap">
                    <span class="label">老师姓名</span>
                    <Input icon="ios-search" v-model="teacherParams.nickname"  placeholder="请输入讲师名称关键字" style="width:220px"></Input>
                    <Table ref="teacher_table" :loading="loading_teacher" class="teacher-table" :columns="columns_teacher" :data="teacherList" @on-selection-change="teacher_table_select"/>
                    <div class="page">
                        <div class="f-left">
                            <Button icon="ios-refresh" type="text" size="small" @click="get_teachList(teacherParams)">刷新</Button>
                        </div>
                        <Page class="f-right" :total="total_teach" show-total show-elevator show-sizer @on-change="teacherPage" @on-page-size-change="teacherPageSize" />
                    </div>
                </div>
            </Modal>
             <Modal  v-model="assistModal" width="800" title="选择助教" @on-ok="assist_onOK">
                <div class="teacher-table-wrap">
                    <span class="label">助教姓名</span>
                    <Input icon="ios-search" v-model="assistParams.nickname"  placeholder="请输入助教名称关键字" style="width:220px"></Input>
                    <Table ref="assist_table" :loading="loading_assist" class="teacher-table" :columns="columns_assist" :data="assistList" @on-selection-change="assist_table_select"/>
                    <div class="page">
                        <div class="f-left">
                            <Button icon="ios-refresh" type="text" size="small" @click="get_teachList(assistParams)">刷新</Button>
                        </div>
                        <Page class="f-right" :total="total_assist" show-total show-elevator show-sizer @on-change="assistPage" @on-page-size-change="assistPageSize" />
                    </div>
                </div>
            </Modal>
        </FormItem>
         <FormItem label="讲义" prop="items_datum">
            <div>
                <div v-if="formValidate.items_datum.length > 0" >
                  <a style="margin-right:20px" :href="item.file_url" v-for="(item,index) in formValidate.items_datum" :key="index">{{item.file_name}}</a>
                </div>
                <UploadComponents type="file" @successFun="successFun" style="width:100%">
                    <span style="color:#aaa"> 支持PDF/DOC/DOCX/PPT/PPTX/XLS/XLSX/TXT格式的文档，可用于课前预习或者课后复习</span>
                </UploadComponents>
            </div>
        </FormItem>
        <!-- <FormItem label="讲义" prop="items_datum">
            <div class="upload-avatar-box">
                <Upload action="//jsonplaceholder.typicode.com/posts/">
                    <Button icon="ios-cloud-upload-outline">选择文件</Button>
                    <span style="color:#ccc">支持PDF/DOC/DOCX/PPT/PPTX/XLS/XLSX/TXT格式的文档，可用于课前预习或者课后复习</span>
                </Upload>
            </div>
        </FormItem> -->
        <FormItem label="所属章节"  prop="course_chapter_id">
            <Select v-model="formValidate.course_chapter_id" placeholder="请选择" style="width:250px">
                <Option :value="`${item.id}`" :key="item.id" v-for="item in chapterList">{{item.name}}</Option>
            </Select>
        </FormItem>
        <FormItem label="是否提前进入教室" prop="advance_time" >
            <RadioGroup v-model="isAdvance_enter">
                <Radio :label="0">任意时间</Radio>
                <Radio :label="1">提前</Radio>
                <span v-if="isAdvance_enter == 1">
                    <InputNumber style="width:150px"  :min="0" v-model="formValidate.advance_time"></InputNumber>
                    <span>分钟才可进入教室</span>
                </span>
            </RadioGroup>
        </FormItem>
        <FormItem label="是否支持查看回放">
            <RadioGroup v-model="formValidate.is_playback">
                <Radio :label="2">否</Radio>
                <Radio :label="1">是</Radio>
            </RadioGroup>
        </FormItem>
        <FormItem label="是否试看">
            <RadioGroup v-model="formValidate.is_try_see">
                <Radio :label="2">否</Radio>
                <Radio :label="1">是</Radio>
            </RadioGroup>
        </FormItem>
        <FormItem style="text-align:center">
            <Button style="width:100px" type="primary" size="large" @click="handleSubmit('formValidate')">保存并返回</Button>
            <Button style="width:100px;margin-left:20px" size="large" @click="$router.go(-1)">返回</Button>
        </FormItem>
    </Form>
</div>

</template>

<script>
import { create_class, update_class, get_classInfo } from '@/api/classHour.js'
import { get_chapter_list } from '@/api/chapter'
import { get_teachList } from '@/api/teacher_assist'
import UploadComponents from '@/components/upload/upload'

export default {
  name: 'calssHourEdit',
  components: {
    UploadComponents
  },
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
      tagTeach_list: [], // 待提交的讲师标签
      modalTeacherList: [], // 模态框中选中的讲师
      loading_teacher: false,
      teacherModal: false, // 讲师列表
      total_teach: 0, // 老师总数
      teacherList: [], // 老师列表
      columns_teacher: [
        { type: 'selection', width: 60, align: 'center' },
        { title: '讲师名称', key: 'nickname', align: 'left' }
      ],
      // --------以上为讲师---------//
      assistParams: { // 查询助教列表
        teacher_type: 2,
        page: 1,
        limit: 10,
        status: '',
        mobile: '',
        nickname: ''
      },
      tagAssist_list: [], // 待提交的助教标签
      modalAssistList: [], // 模态框中选中的助教
      loading_assist: false,
      assistModal: false, // 讲师列表
      total_assist: 0, // 助教总数
      assistList: [], // 助教列表
      columns_assist: [
        { type: 'selection', width: 60, align: 'center' },
        { title: '助教名称', key: 'nickname', align: 'left' }
      ],
      // ----------以上为助教列表弹框需要参数------------------//
      chapterList: [], // 章节列表
      isAdvance_enter: 0, // 是否提前进入
      formValidate: { // 课时详情参数
        course_id: '', // 课程主表ID
        course_chapter_id: '', // 章节ID
        title: '', // 课时名称
        start_play: '', // 上课时间
        end_play: '', // 下课时间
        play_time: '', // 本节课时间
        teacher_id: '', // 讲师
        advance_time: 0, // 提前进入教室时间/分钟 0表示任意时间
        is_playback: 1, // 是否支持查看回放 1支持 2不支持
        is_try_see: 2, // 是否可以试看 1支持 2不支持
        items_teacher: [], // 助教  / 讲师
        items_datum: [] // 讲义
      },
      ruleValidate: {
        title: [
          { required: true, message: '课时名称不能为空', trigger: 'blur' }
        ],
        start_play: [
          { required: true, message: '上课时间不能为空', trigger: 'blur' }
        ],
        end_play: [
          { required: true, message: '下课时间不能为空', trigger: 'blur' }
        ],
        teacher_id: [
          { required: true, message: '请选择主讲老师', type: 'number', trigger: 'blur' }
        ],
        course_chapter_id: [
          { required: true, message: '请选择所属章节', trigger: 'change' }
        ]
      }
    }
  },
  mounted () {
    this.get_teachList(this.teacherParams)
    this.get_teachList(this.assistParams)
    this.get_chapter_list(this.$route.query.course_id)

    if (this.$route.query.id) { // 判断是否是修改
      this.get_classInfo(this.$route.query.id)
    }
  },
  methods: {
    successFun (url, name) {
      this.formValidate.items_datum.push({file_url:url, file_name:name})
      // this.$refs.formValidate.validateField('items_datum') // 重新校验
    },
    changeDateStar (time) {
      this.formValidate.start_play = time
    },
    changeDateEnd (time) {
      this.formValidate.end_play = time
    },
    tagClose_teacher (event, name) { // 删除讲师
      this.$Modal.confirm({
        title: '提示',
        content: '<p>是否确认删除该主讲老师？</p>',
        onOk: () => {
          this.tagTeach_list.splice(this.tagTeach_list.findIndex(item => item.id == name), 1)
          this.teacherList.forEach((item, index) => {
            if (item.id == name) {
              this.$refs.teacher_table.objData[index]._isChecked = false
            }
          })
        }
      })
    },
    tagClose_assist (event, name) { // 删除助教
      this.$Modal.confirm({
        title: '提示',
        content: '<p>是否确认删除该助教老师？</p>',
        onOk: () => {
          this.tagAssist_list.splice(this.tagAssist_list.findIndex(item => item.id == name), 1)
          this.assistList.forEach((item, index) => {
            if (item.id == name) {
              this.$refs.assist_table.objData[index]._isChecked = false
            }
          })
        }
      })
    },
    teacher_table_select (selection) { // 表格选择发生改变
      this.modalTeacherList = selection
    },
    assist_table_select (selection) { // 表格选择发生改变
      this.modalAssistList = selection
    },
    teach_onOK () { // 确定
      this.tagTeach_list = this.modalTeacherList
    },
    assist_onOK () { // 确定
      this.tagAssist_list = this.modalAssistList
    },
    teacherPage (newIndex) { // 切换页码 ---teacher
      this.teacherParams.page = newIndex
      this.get_teachList(this.teacherParams)
    },
    teacherPageSize (pageSize) { // 切换页数
      this.teacherParams.limit = pageSize
      this.get_teachList(this.teacherParams)
    },
    assistPage (newIndex) { // 切换页码 ---teacher_helper
      this.assistParams.page = newIndex
      this.get_teachList(this.assistParams)
    },
    assistPageSize (pageSize) { // 切换页数
      this.assistParams.limit = pageSize
      this.get_teachList(this.assistParams)
    },
    handleSubmit (name) { // 保存
      this.$refs[name].validate((valid) => {
        if (valid) {
          this.formValidate.items_teacher = [] // 每次重新获取待上传列表,防止重复
          this.tagTeach_list.map(item => {
            this.formValidate.items_teacher.push({ teacher_id: item.id, teacher_type: 1 })
          })
          this.tagAssist_list.map(item => {
            this.formValidate.items_teacher.push({ teacher_id: item.id, teacher_type: 2 })
          })
          if (this.$route.query.id) {
            // 修改
            this.formValidate.id = this.$route.query.id
            console.log(this.formValidate)
            this.update_class(this.formValidate)
          } else {
            // 新增
            this.formValidate.course_id = this.$route.query.course_id
            this.create_class(this.formValidate)
          }
        } else {
          this.$Message.error('请完善信息')
        }
      })
    },
    async get_teachList (params) {
      try {
        if (params.teacher_type == 1) { // 讲师
          this.loading_teacher = true
          const res = await get_teachList(params)
          if (res.status == 1) {
            this.teacherList = res.data.data
            this.total_teach = res.data.total
            this.loading_teacher = false
            this.teacherList.forEach((item, index) => {
              this.modalTeacherList.forEach(ele => {
                if (item.id == ele.id) {
                  item._checked = true
                }
              })
            })
          }
        } else if (params.teacher_type == 2) {
          this.loading_assist = true
          const res = await get_teachList(params)
          if (res.status == 1) {
            this.assistList = res.data.data
            this.total_assist = res.data.total
            this.loading_assist = false
            this.assistList.forEach((item, index) => {
              this.modalAssistList.forEach(ele => {
                if (item.id == ele.id) {
                  item._checked = true
                }
              })
            })
          }
        }
      } catch (error) {
        this.loading_teacher = false
        this.loading_assist = false
      }
    },
    async create_class (params) { // 创建课时
      const res = await create_class(params)
      try {
        if (res.status == 1) {
          this.$Message.success('保存成功')
          this.$router.go(-1)
        }
      } catch (error) {

      }
    },
    async update_class (params) { // 更新课时
      const res = await update_class(params)
      try {
        if (res.status == 1) {
          this.$Message.success('保存成功')
          this.$router.go(-1)
        }
      } catch (error) {

      }
    },
    async get_chapter_list (params) {
      const res = await get_chapter_list(params)
      try {
        if (res.status == 1) {
          this.chapterList = res.data.list
        }
      } catch (error) {

      }
    },
    async get_classInfo (params) {
      const res = await get_classInfo(params)
      try {
        if (res.status == 1) {
          this.formValidate = res.data.info
          this.formValidate.course_chapter_id = String(this.formValidate.course_chapter_id)
          // 讲师
          this.teacherList.forEach((item, index) => {
            this.formValidate.items_teacher.forEach(ele => {
              if (item.id == ele.teacher_id) {
                if (ele.teacher_type == 1) {
                  this.$refs.teacher_table.objData[index]._isChecked = true
                  this.tagTeach_list.push(item)
                }
              }
            })
          })
          // 助教
          this.assistList.forEach((item, index) => {
            this.formValidate.items_teacher.forEach(ele => {
              if (item.id == ele.teacher_id && ele.teacher_type == 2) {
                this.$refs.assist_table.objData[index]._isChecked = true
                this.tagAssist_list.push(item)
              }
            })
          })
        }
      } catch (error) {

      }
    }

  }
}
</script>

<style >
/* common.css */
.menu-style .ivu-tooltip-inner{
    max-width: 400px;
}

</style>

<style lang="less" scoped>
.teacher-table-wrap {
    overflow-y: auto;
    .label {
        margin-right: 20px;
    }
    .teacher-table {
        margin-top: 20px;
    }
    .page {
        .f-left {
            margin-left:20px
        }
    }
}
</style>
