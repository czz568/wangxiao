<template>
<!-- 视频列表 -->
 <Card shadow>
    <div class="videoList">
        <Form ref="formValidate"  :model="formValidate"  :label-width="80" inline>
            <FormItem label="视频名称" prop="keywords">
                <Input clearable  v-model="formValidate.keywords" placeholder="请输入视频名称关键字" style="width: 200px"></Input>
            </FormItem>
            <FormItem class="search-form-btns">
                <Button icon="ios-search" @click="search">搜索</Button>
                <Button style="margin-left: 8px" icon="md-undo" @click="handleReset">重置</Button>
            </FormItem>
        </Form>
        <div>
          <Button type="primary"  icon="md-add"  class="btn-margin-right" @click="$router.push({name:'videoEdit'})">新增视频</Button>
        </div>
        <div class="content">
          <Table  border :loading="loading" stripe   ref="selection" :columns="columns" :data="videoList">
            <template slot-scope="{ row }" slot="title">
              <div class="vmiddle">
                <img v-if="row.cover_img" class="table-avatar" :src="row.cover_img" alt="">
                <span>{{ row.title }}</span>
              </div>
            </template>
            <template slot-scope="{ row }" slot="difficult_level">
                <Rate disabled v-model="row.difficult_level" />
            </template>
            <template slot="action" slot-scope="{ row }">
                <Button type="text" v-if="row.status == 2" size="small" class="btn-text" @click="showHandle(row)" >上架</Button>
                <Button type="text" v-if="row.status == 1" size="small" class="btn-text" @click="hideHandle(row)" >下架</Button>
                <span>-</span>
                <Button type="text" size="small" class="btn-text" @click="$router.push({name:'videoEdit', query:{id: row.id}})">编辑</Button>
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
import { get_videoList, delete_video, video_disable } from '@/api/videoList'
export default {
  data () {
    return {
      loading: true,
      total: 0,
      videoList: [], // 视频列表
      formValidate: {
        page: 1,
        limit: 10,
        status:"",
        keywords: ''
      },
      columns: [
        {
          title: '视频ID',
          key: 'id',
          width: 100
        },
        {
          title: '视频名称',
          slot: 'title',
          align: 'left'
        },
        {
          title: '上架状态',
          key: 'status',
          align: 'center',
            render: (h, params) => {
                return h('span', [
                    h('span', params.row.status == 1 ? '已上架' : '已下架')
            ])
          }
        },
        {
            title: '视频时长',
            key: 'duration',
            align: 'left'
        },
        {
          title: '难度级别',
          slot: 'difficult_level',
          align: 'center'
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
    this.get_videoList(this.formValidate)
  },
  methods: {
    deletHandle (row) { // 删除
      this.$Modal.confirm({
        title: '提示',
        content: '<p>删除后，该视频将不再展示，与之关联的数据也将被清除，是否确认？</p>',
        onOk: () => {
          this.delete_video({ id: row.id })
        }
      })
    },
    showHandle (row) { // 上架
      this.$Modal.confirm({
        title: '提示',
        content: '<p>确定要上架该视频吗？</p>',
        onOk: () => {
          this.video_disable({ id: row.id, status: 1 })
        }
      })
    },
    hideHandle (row) { // 下架
      this.$Modal.confirm({
        title: '提示',
        content: '<p>确定要下架该视频吗？</p>',
        onOk: () => {
          this.video_disable({ id: row.id, status: 2 })
        }
      })
    },
    handlePage (newIndex) { // 切换页码
      this.formValidate.page = newIndex
      this.get_videoList(this.formValidate)
    },
    handlePageSize (pageSize) { // 切换页数
      this.formValidate.limit = pageSize
      this.get_videoList(this.formValidate)
    },
    search () { // 查询
      this.get_videoList(this.formValidate)
    },
    handleReset () { // 重置
      this.formValidate = {
        page: 1,
        limit: 10,
        status:"",
        keywords: ''
      }
    },
    async get_videoList (params) {
      const res = await get_videoList(params)
      try {
        if (res.status == 1) {
          this.videoList = res.data.data.data
          this.total = res.data.data.total
          this.loading = false
        }
      } catch (error) {
        console.log(error)
        this.loading = false
      }
    },
    async video_disable (params) {
      this.loading = true
      const res = await video_disable(params)
      try {
        if (res.status == 1) {
          this.get_videoList(this.formValidate)
        }
      } catch (error) {
        console.log(error)
      }
    },
    async delete_video (params) {
      const res = await delete_video(params)
      try {
        if (res.status == 1) {
          this.get_videoList(this.formValidate)
          this.$Message.success('删除成功')
        }
      } catch (error) {
        console.log(error)
      }
    },
  }
}
</script>
<style lang="less" scoped>
.video-select {
  overflow: hidden;
  .video-select-item {
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
    .video-select-title {
      color: #000;
      font-size: 16px;
      text-align: center;
      position: relative;
      margin-bottom: 30px;
      .video-select-type {
        position: absolute;
        color: red;
        font-size: 12px;
        top: -5px;
      }
    }
  }
}
</style>
