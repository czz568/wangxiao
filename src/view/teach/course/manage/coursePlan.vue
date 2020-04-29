<template>
<!-- 课程大纲 -->
  <div id="courseInfo">
    <div class="top-title">
      <img :src="courseInfo.cover_img" :alt="courseInfo.cover_img" />
      <div>
        <p class="course-title">{{courseInfo.title}}</p>
        <p class="course-info">
          {{courseInfo.course_type_name}}
          <Divider type="vertical" />{{courseInfo.chapter_count}}章节 | {{courseInfo.item_count}}课时
        </p>
      </div>
    </div>
    <Tabs>
      <TabPane label="课程大纲" name="chapter">
        <Table  row-key="id" :columns="columns_chapter" :data="chapterList">
          <template slot="name" slot-scope="{ row }">
            <span>{{row.name}}</span><em style="color:#ccc">（含{{row.count}}个课时）</em>
          </template>
          <template slot="action" slot-scope="{ row }">
            <Button type="text" size="small" class="btn-text"
              @click="$router.push({name: 'classHourEdit', query: {course_id:$route.query.course_id}})" >新增课时</Button>
            <span>-</span>
            <Button type="text" size="small" class="btn-text" @click="sortChapter(row)">章节排序</Button>
            <span>-</span>
            <Button type="text" size="small" class="btn-text" @click="editChapter(row)">编辑</Button>
            <span>-</span>
            <Button type="text" size="small" class="btn-text" @click="deletHandle(row)">删除</Button>
          </template>
        </Table>
      </TabPane>
    </Tabs>
    <div class="new-chapter">
      <Button style="width:300px"  icon="md-add"  long @click="addChapter">新增章节</Button>
    </div>
    <Modal v-model="chapterModal" :title="modalType == 'add' ? '新增章节': '修改章节'" @on-ok="handleSubmit('chapterForm')">
      <Form  ref="chapterForm" :model="chapterForm" :rules="chapterRule" :label-width="80">
        <FormItem prop="name" label="章节名称">
          <Input style="width:300px" type="text" :maxlength="20" v-model="chapterForm.name" placeholder="请输入名称，最多输入20个字"/>
          <span>{{chapterForm.name.length}}/20</span>
        </FormItem>
      </Form>
    </Modal>
    <Modal  v-model="sortModal" title="章节排序" footer-hide>
      <Form  :model="sortParams" :label-width="120" inline>
        <FormItem prop="sort" label="将章节移动到第">
          <InputNumber :min="1" v-model="sortParams.sort"></InputNumber>
          <span>位</span>
        </FormItem>
        <FormItem>
          <Button type="primary" @click="saveSort">保存</Button>
        </FormItem>
      </Form>
    </Modal>
  </div>
</template>

<script>
import ClassHour from './classHour'
import {
  get_chapter_outline, create_chapter,
  get_chapter_info, update_chapter,
  sort_chapter, delete_chapter
} from '@/api/chapter'
import { get_courseInfo } from '@/api/course'
import { get_enum } from '@/api/common'
export default {
  components: {
    ClassHour
  },
  data () {
    return {
      courseInfo: {},
      typeList: [], // 课程类型
      // ----课程详情------//
      modalType: '', // 默认 add新增 update 修改
      chapterModal: false,
      chapterForm: {
        name: '',
        course_id: this.$route.query.course_id
      },
      chapterRule: {
        name: [
          { required: true, message: '章节名称必须填写', trigger: 'blur' }
        ]
      },
      /// -----新增修改章节参数---------//
      sortModal: false,
      sortParams: {
        id: '',
        sort: null
      },
      // ------------排序章节 ----------//
      chapterList: [], // 章节列表
      columns_chapter: [
        {
          type: 'expand',
          width: 50,
          render: (h, params) => {
            return (
              <ClassHour row={params.row} oncustomHandle={this.customHandle}/>
            )
          }
        },
        {
          title: '章节名称',
          slot: 'name'
        },
        {
          title: '序号',
          key: 'sort'
        },
        {
          title: '开课时间',
          width: 300
        },
        {
          title: '操作',
          slot: 'action',
          align: 'center',
          width: 300
        }
      ]
    }
  },
  mounted () {
    this.get_enum('course')
    this.get_chapter_outline(this.$route.query.course_id)
    this.get_courseInfo(this.$route.query.course_id)
  },
  methods: {
    customHandle () { // jsx 自定义事件重新更新课时排序
      this.get_chapter_outline(this.$route.query.course_id)
    },
    saveSort () { // 排序
      this.sort_chapter(this.sortParams)
    },
    addChapter () { // 新增
      this.modalType = 'add'
      this.chapterForm = {
        name: '',
        course_id: this.$route.query.course_id
      }
      this.chapterModal = true
    },
    editChapter (row) { // 编辑
      this.modalType = 'update'
      this.get_chapter_info(row.id)
    },
    sortChapter (row) {
      this.sortParams.id = row.id
      this.sortParams.sort = row.sort
      this.sortModal = true
    },
    handleSubmit (name) { // 提交
      this.$refs[name].validate((valid) => {
        if (valid) {
          if (this.modalType == 'add') {
            this.create_chapter(this.chapterForm)
          } else if (this.modalType == 'update') {
            this.update_chapter(this.chapterForm)
          }
        } else {
          this.$Message.error('请完善信息')
        }
      })
    },
    deletHandle (row) { // 删除章节
      this.$Modal.confirm({
        title: '提示',
        content: '<p>确认要删除该章节吗？</p>',
        onOk: () => {
          this.delete_chapter({ id: row.id })
        }
      })
    },
    async get_chapter_outline (params) {
      const res = await get_chapter_outline(params)
      try {
        if (res.status == 1) {
          this.chapterList = res.data.data
          // 设置默认第一行展开
          if (this.chapterList.length > 0) {
            this.chapterList.forEach(item => {
              item._expanded = true
            })
          }
        }
      } catch (error) {
        console.log(error)
      }
    },
    async get_chapter_info (params) {
      const res = await get_chapter_info(params)
      try {
        if (res.status == 1) {
          this.chapterForm = res.data.info
          this.chapterModal = true
        }
      } catch (error) {
        console.log(error)
      }
    },
    async get_courseInfo (params) {
      const res = await get_courseInfo(params)
      try {
        if (res.status == 1) {
          this.courseInfo = res.data.info
        }
      } catch (error) {

      }
    },
    async create_chapter (params) {
      const res = await create_chapter(params)
      try {
        if (res.status == 1) {
          this.$Message.success('新增成功')
          this.get_chapter_outline(this.$route.query.course_id)
        }
      } catch (error) {
        console.log(error)
      }
    },
    async sort_chapter (params) {
      const res = await sort_chapter(params)
      try {
        if (res.status == 1) {
          this.$Message.success('保存成功')
          this.sortModal = false
          this.get_chapter_outline(this.$route.query.course_id)
        }
      } catch (error) {
        console.log(error)
      }
    },
    async update_chapter (params) {
      const res = await update_chapter(params)
      try {
        if (res.status == 1) {
          this.$Message.success('修改成功')
          this.get_chapter_outline(this.$route.query.course_id)
        }
      } catch (error) {
        console.log(error)
      }
    },
    async get_enum (string) {
      const res = await get_enum(string)
      try {
        this.typeList = res.data.data.teacher_type.value
      } catch (error) {
        console.log(error)
      }
    },
    async delete_chapter (params) {
      const res = await delete_chapter(params)
      try {
        if (res.status == 1) {
          this.get_chapter_outline(this.$route.query.course_id)
          this.$Message.success('删除成功')
        }
      } catch (error) {
        console.log(error)
      }
    }
  }
}
</script>

<style lang="less" scoped>
#courseInfo {
  .top-title {
    padding: 15px;
    border: 1px solid #eee;
    display: flex;
    align-items: center;
    img {
      width: 208px;
      height: 122px;
      margin-right: 20px;
    }
    .course-title {
      font-size: 16px;
      color: #333;
      margin-bottom: 30px;
    }
    .course-info {
      font-size: 13px;
      margin-bottom: 10px;
    }
  }
  .tabs {
    margin-top: 10px;
  }
}
.new-chapter {
  margin: 20px 0;
  text-align: center;
}
</style>>
