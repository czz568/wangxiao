
<template>
<!-- 新增/编辑课程 -->
    <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="180">
        <div class="courseEdit">
            <div class="title">基本信息 —— 课程</div>
        </div>
        <FormItem label="课程名称" prop="title">
            <Input v-model="formValidate.title" :maxlength="30" placeholder="请输入名称，最多可添加30个字" style="width:250px"></Input>
            <span>{{formValidate.title.length}}/30</span>
        </FormItem>
        <FormItem label="课程属性" prop="course_attr">
          <Treeselect style="width:300px" :normalizer="normalizer"  valueConsistsOf='LEAF_PRIORITY' v-model="formValidate.course_attr" :multiple="false" :options="attributeList" />
        </FormItem>
         <FormItem label="课程封面" prop="cover_img">
            <div class="upload-avatar-box">
                <div class="avatar-wrap" v-if="formValidate.cover_img" >
                    <img class="avatar" :src="formValidate.cover_img" alt="">
                </div>
                <UploadComponents type="image" @successFun="successFun_cover" style="width:100%">
                    <span style="color:#ccc">*尺寸为416 * 244或1.7:1, 请上传jpg, png格式的图片, 建议图片大小不超过2MB。</span>
                </UploadComponents>
            </div>
        </FormItem>
        <FormItem label="开课展示时间" prop="start_play_friendly">
            <Input v-model="formValidate.start_play_friendly" :maxlength="30" placeholder="例：每周六 6:00-8：00" style="width:250px"></Input>
        </FormItem>
        <FormItem  label="上课时间"  prop="start_play_time">
            <DatePicker :value="formValidate.start_play_time" type="date" format="yyyy-MM-dd" placeholder="请选择"  style="width:280px" @on-change="changeDateStar"></DatePicker>
        </FormItem>
        <FormItem  label="下课时间"  prop="end_play_time">
            <DatePicker :value="formValidate.end_play_time" type="date" format="yyyy-MM-dd" placeholder="请选择"  style="width:280px" @on-change="changeDateEnd"></DatePicker>
        </FormItem>
        <FormItem label="主讲老师" prop="teacher">
            <Tag style="height:36px;line-height:32px" type="border" :name="item.id"  closable v-for="item in tagTeach_list" :key="item.id" @on-close="tagClose_teacher">{{item.nickname}}</Tag>
            <Button style="height:36px;line-height:32px"  icon="ios-add" type="dashed" size="small" @click="teacherModal = true">选择讲师</Button>
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
        </FormItem>
        <FormItem label="助教老师" prop="teacher_helper">
            <Tag style="height:36px;line-height:32px" type="border" :name="item.id"  closable v-for="item in tagAssist_list" :key="item.id" @on-close="tagClose_assist">{{item.nickname}}</Tag>
            <Button style="height:36px;line-height:32px"  icon="ios-add" type="dashed" size="small"  @click="assistModal = true">选择助教</Button>
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
         <FormItem label="课程详情" prop="info">
            <div class="upload-avatar-box">
                <div class="avatar-wrap" v-if="formValidate.info" >
                    <img class="avatar" :src="formValidate.info" alt="">
                </div>
                <UploadComponents type="image" @successFun="successFun_info" style="width:100%">
                    <span style="color:#ccc"> *尺寸为416 * 244或1.7:1, 请上传jpg, png格式的图片, 建议图片大小不超过2MB。</span>
                </UploadComponents>
            </div>
         </FormItem>
        <FormItem label="提前进入教室时间">
            <RadioGroup v-model="isAdvance_enter">
                <Radio label="anyTime">任意时间</Radio>
                <Radio label="advance">提前
                    <span v-if="isAdvance_enter == 'advance'">
                        <InputNumber style="width:150px"  :min="0" v-model="formValidate.advance_time"></InputNumber>
                        <span>分钟才可进入教室</span>
                    </span>
                </Radio>
            </RadioGroup>
        </FormItem>
        <FormItem label="课程开始后多长时间禁止进入">
            <RadioGroup v-model="isAfter_enter">
                <Radio label="anyTime">任意时间</Radio>
                <Radio label="after">开课后
                    <span v-if="isAfter_enter == 'after'">
                        <InputNumber style="width:150px" :min="0" v-model="formValidate.enter_end_time"></InputNumber>
                        <span>分钟后禁止进入教室</span>
                    </span>
                </Radio>
            </RadioGroup>
        </FormItem>
        <FormItem label="是否含有课程实体教材">
            <RadioGroup v-model="formValidate.have_materials">
                <Radio :label="2">否</Radio>
                <Radio :label="1">是
                    <span style="color:#ccc">如课程含有实体教材，学员购买课程时需填写收货地址，卖家需要及时给学员发货，设置后，再次编辑时不支持修改</span>
                </Radio>
            </RadioGroup>
        </FormItem>
        <FormItem label="是否是打包销售课程">
            <RadioGroup v-model="formValidate.is_course_pack">
                <Radio :label="2">否</Radio>
                <Radio :label="1">是</Radio>
                <div>
                    <Tag style="height:36px;line-height:32px" type="border" :name="item.id"  closable v-for="item in tagCoursePack_list" :key="item.id" @on-close="tagClose_coursePack">{{item.title}}</Tag>
                    <Button v-if="formValidate.is_course_pack === 1" style="height:36px;line-height:32px"  icon="ios-add" type="dashed" size="small" @click="coursePackModal = true">选择打包课程</Button>
                    <Modal  v-model="coursePackModal" width="800" title="选择课程" @on-ok="coursePack_onOK">
                        <div class="teacher-table-wrap">
                            <span class="label">课程名称</span>
                            <Input icon="ios-search" v-model="coursePackParams.title"  placeholder="请输入课程名称关键字" style="width:220px"></Input>
                            <Table ref="coursePack_table" :loading="coursePackloading" class="teacher-table" :columns="columns_course" :data="coursePackList" @on-selection-change="coursePack_table_select"/>
                            <div class="page">
                                <div class="f-left">
                                    <Button icon="ios-refresh" type="text" size="small" @click="get_course_packList(coursePackParams)">刷新</Button>
                                </div>
                                <Page class="f-right" :total="coursePack_total" show-total show-elevator show-sizer @on-change="coursePackPage" @on-page-size-change="coursePackPageSize" />
                            </div>
                        </div>
                    </Modal>
                </div>
            </RadioGroup>
        </FormItem>
        <div class="courseEdit">
            <div class="title">上架信息</div>
        </div>
         <FormItem label="课程库存">
            <InputNumber style="width:150px" :min="0" v-model="formValidate.stock"></InputNumber>
            <span style="color:#ccc">输入0表示不限制</span>
         </FormItem>
        <FormItem label="售卖设置">
            <RadioGroup v-model="isPay">
                <Radio :label="1">付费</Radio>
                <Radio :label="0" :disabled="formValidate.is_course_pack === 1">
                    免费
                    <span v-if="formValidate.is_course_pack === 1" style="color:red">注意：免费课程不在打包销售课程范围内</span>
                </Radio>
            </RadioGroup>
            <div style="margin-left:-110px" v-if="isPay == 1">
                <FormItem label="课程价格"  style="margin-bottom:10px">
                    <InputNumber style="width:150px" :min="0" v-model="formValidate.price"></InputNumber>
                    <span>元</span>
                </FormItem>
                <FormItem label="划线价格">
                    <InputNumber style="width:150px" :min="0" v-model="formValidate.underlined_price"></InputNumber>
                    <span>元</span>
                    <span style="color:#ccc"> 划线价格（选填）</span>
                </FormItem>
            </div>
        </FormItem>
         <FormItem label="目录样式" >
            <RadioGroup v-model="formValidate.display_style">
                <Radio :label="1" style="display:block" class="menu-style">课时列表
                    <Tooltip placement="right" content="样式为一级目录，即仅显示课时列表，不显示章节信息">
                        <Icon type="md-help-circle"/>
                    </Tooltip>
                </Radio>
                <Radio :label="2" style="display:block" class="menu-style" >章节列表
                    <Tooltip placement="right" content="样式为二级目录，即点击章节，可查看该章节下的课时列表">
                        <Icon type="md-help-circle"/>
                    </Tooltip>
                </Radio>
            </RadioGroup>
         </FormItem>
         <FormItem label="销售基数" >
            <InputNumber style="width:150px"  :min="0" v-model="formValidate.sales_num_base"></InputNumber>
            <span style="color:#ccc">学员端销量显示为: 销售基数+实际销售数量</span>
         </FormItem>
        <FormItem style="text-align:center">
            <Button style="width:100px" type="primary" size="large" @click="handleSubmit('formValidate')">保存并返回</Button>
            <Button style="width:100px;margin-left:20px" size="large" @click="$router.go(-1)">返回</Button>
        </FormItem>
    </Form>
</template>

<script>
import VueUeditorWrap from 'vue-ueditor-wrap'
import { get_teachList } from '@/api/teacher_assist'
import { create_course, get_courseInfo, update_course, get_course_packList } from '@/api/course'
import {get_attributeList } from '@/api/attribute'
import UploadComponents from '@/components/upload/upload'

export default {
  name: 'courseEdit',
  components: {
    VueUeditorWrap,
    UploadComponents
  },
  data () {
    return {
      normalizer (node) {
        return {
          id: node.id,
          label: node.name,
          children: node.children
        }
      },
      attributeList: [], // 课程属性列表
      coursePackParams: { // 能打包课程列表查询参数
        page: 1,
        limit: 10,
        type: 1, // 大班课
        status: 1, // 已上架
        course_type: '',
        teacher_Id: '',
        title: ''
      },
      tagCoursePack_list: [], // 待上传的打包课程id列表
      coursePackList: [], // 能打包列表
      modalCoursePackList: [],
      coursePack_total: 0,
      coursePackloading: false,
      coursePackModal: false, // 打包课程列表弹框
      columns_course: [
        { type: 'selection', width: 60, align: 'center' },
        { title: '课程名称', key: 'title', align: 'left' }
      ],
      // ----------------以上为打包课程列表---------//
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
      // ----------以上为讲师列表弹框需要参数------------------//
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
      // ---------UEditor 默认的配置项----------//
      isAdvance_enter: 'anyTime', // 是否提前进入教室 ——默认 任意时间
      isAfter_enter: 'anyTime', // 课程开始后是否禁止进入 ——默认 任意时间
      isPay: 1, // 是否需要付费
      formValidate: {
        title: '', // 课程名称
        course_type: '', // 课程类型
        cover_img: '', // 封面
        start_play_friendly: '', // 开课展示时间(友好)
        start_play_time: '', // 上课时间
        end_play_time: '', // 上课时间
        info: '', // 课程详情
        advance_time: 0, // 提前进入教室时间/分钟 0表示任意时间
        enter_end_time: 0, // 课程开始后多长时间禁止进入/分钟 0表示不限制
        have_materials: 2, // 是否含有课程实体教材 1:有 2:无
        is_course_pack: 2, // 是否是打包销售课程 1:是 2:否
        // --------上架信息---------//
        stock: 0, // 课程库存 0表示不限制
        price: 0, // 课程价格
        underlined_price: 0, // 划线价格
        display_style: 1, // 目录样式 1:课时列表 2:章节列表
        sales_num_base: 0, // 销售基数
        teacher: [], // 主讲教师
        teacher_helper: [], // 助教老师
        course_pack: [], // 打包课程
        course_attr: null // 课程属性
      },
      ruleValidate: {
        title: [
          { required: true, message: '课程名称不能为空', trigger: 'blur' }
        ],
        course_attr: [
          { required: true,
            type: 'array',
            message: '请选择课程属性',
            trigger: 'change',
            validator: (rule, value, callback) => {
              if (this.formValidate.course_attr.length == 0) {
                callback(new Error('请选择课程属性'))
              } else {
                callback()
              }
            }
          },
        ],
        cover_img: [
          { required: true,
            type: 'object',
            message: '请上传封面！',
            trigger: 'change',
            validator: (rule, value, callback) => {
              if (!this.formValidate.cover_img) {
                callback(new Error('请上传封面！'))
              } else {
                callback()
              }
            }
          }
        ]
      }
    }
  },
  mounted () {
    this.get_attributeList()
    this.get_teachList(this.teacherParams)
    this.get_teachList(this.assistParams)
    this.get_course_packList(this.coursePackParams)
    if (this.$route.query.id) {
      this.get_courseInfo(this.$route.query.id)
    }
  },
  methods: {
    successFun_info (url) {
      this.formValidate.info = url
      this.$refs.formValidate.validateField('info') // 重新校验
    },
    successFun_cover (url) {
      this.formValidate.cover_img = url
      this.$refs.formValidate.validateField('cover_img') // 重新校验
    },
    changeDateStar (time) {
      this.formValidate.start_play_time = time
    },
    changeDateEnd (time) {
      this.formValidate.end_play_time = time
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
              // console.log(this.tagTeach_list, 'tagTeach_list')
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
    tagClose_coursePack (event, name) { // 删除打包课程
      this.$Modal.confirm({
        title: '提示',
        content: '<p>是否确认删除该打包课程？</p>',
        onOk: () => {
          this.tagCoursePack_list.splice(this.tagCoursePack_list.findIndex(item => item.id == name), 1)
          this.coursePackList.forEach((item, index) => {
            if (item.id == name) {
              this.$refs.coursePack_table.objData[index]._isChecked = false
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
    coursePack_table_select (selection) { // 表格选择发生改变
      this.modalCoursePackList = selection
    },
    teach_onOK () { // 确定
      this.tagTeach_list = this.modalTeacherList
    },
    assist_onOK () { // 确定
      this.tagAssist_list = this.modalAssistList
    },
    coursePack_onOK () { // 确定
      this.tagCoursePack_list = this.modalCoursePackList
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
    coursePackPage (newIndex) { // 切换页码 ---course
      this.coursePackParams.page = newIndex
      this.get_course_packList(this.coursePackParams)
    },
    coursePackPageSize (pageSize) { // 切换页数
      this.coursePackParams.limit = pageSize
      this.get_course_packList(this.coursePackParams)
    },
    handleSubmit (name) { // 保存
      this.$refs[name].validate((valid) => {
        if (valid) {
          this.formValidate.teacher = this.tagTeach_list.map(item => item.id)
          this.formValidate.teacher_helper = this.tagAssist_list.map(item => item.id)
          this.formValidate.course_pack = this.tagCoursePack_list.map(item => item.id)
          let obj = {}
          obj['attr_id'] =  this.formValidate.course_attr;
          this.formValidate.course_attr = [obj]
          if (this.$route.query.id) {
            // 修改
            this.formValidate.id = this.$route.query.id
            this.update_course(this.formValidate)
          } else {
            // 新增
            this.formValidate.course_type = this.$route.query.type
            this.create_course(this.formValidate)
          }
        } else {
          this.$Message.error('请完善信息')
        }
      })
    },
    async get_courseInfo (id) {
      const res = await get_courseInfo(id)
      try {
        if (res.status == 1) {
          this.formValidate = res.data.info
          this.formValidate.course_attr_info.forEach(item => 
            this.formValidate.course_attr = item.attr_id
          )
          if(this.formValidate.advance_time > 0) {
            this.isAdvance_enter = 'advance' // 提前
          } else {
            this.isAdvance_enter = 'anyTime' //任意时间
          }
          if(this.formValidate.enter_end_time > 0) {
            this.isAfter_enter = 'after' // 之后
          } else {
            this.isAfter_enter = 'anyTime' // 任意时间
          }
          this.formValidate.price = Number(this.formValidate.price)
          this.formValidate.underlined_price = Number(this.formValidate.underlined_price)
          this.formValidate.sales_num_base = Number(this.formValidate.sales_num_base)
          // 讲师
          this.tagTeach_list = this.formValidate.teacher
          this.teacherList.forEach((item, index) => {
            this.tagTeach_list.forEach(ele => {
              if (item.id == ele.id) {
                this.$refs.teacher_table.objData[index]._isChecked = true
              }
            })
          })
          // 助教
          this.tagAssist_list = this.formValidate.teacher_helper
          this.assistList.forEach((item, index) => {
            this.tagAssist_list.forEach(ele => {
              if (item.id == ele.id) {
                this.$refs.assist_table.objData[index]._isChecked = true
              }
            })
          })
          // 打包课程
          this.tagCoursePack_list = this.formValidate.course_pack
          this.coursePackList.forEach((item, index) => {
            this.tagCoursePack_list.forEach(ele => {
              if (item.id == ele.id) {
                this.$refs.coursePack_table.objData[index]._isChecked = true
              }
            })
          })
        }
      } catch (error) {

      }
    },
    async create_course (params) {
      const res = await create_course(params)
      try {
        if (res.status == 1) {
          this.$Message.success('新增课程成功')
          this.$router.push({ name: 'courseList' })
        }
      } catch (error) {

      }
    },
    async update_course (params) {
      const res = await update_course(params)
      try {
        if (res.status == 1) {
          this.$Message.success('更新课程成功')
          this.$router.push({ name: 'courseList' })
        }
      } catch (error) {

      }
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
    async get_course_packList (params) {
      this.coursePackloading = true
      const res = await get_course_packList(params)
      try {
        if (res.status == 1) {
          this.coursePackList = res.data.data
          this.coursePack_total = res.data.total
          this.coursePackloading = false
          this.coursePackList.forEach((item, index) => {
            this.modalCoursePackList.forEach(ele => {
              if (item.id == ele.id) {
                item._checked = true
              }
            })
          })
        }
      } catch (error) {
        this.coursePackloading = false
      }
    },
    async get_attributeList () {
      const res = await get_attributeList()
      try {
        if(res.status == 1) {
          let arr = res.data.date
          this.attributeList.push(arr[0])
        }
      } catch (error) {
      }
    },
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
