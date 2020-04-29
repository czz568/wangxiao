<template>
 <Card shadow>
    <div class="student">
        <div>
            <Button type="primary"  icon="md-add"  class="btn-margin-right" @click="$router.push({name:'contentEditor', query:{columnId:$route.query.columnId}})">新增内容</Button>
        </div>
        <div class="content">
          <Table :loading="loading" stripe  border ref="selection" :columns="columns" :data="contentList">
            <template slot-scope="{ row }" slot="img">
              <div class="vmiddle">
                <img class="banner" :src="row.img" alt="">
              </div>
            </template>
            <template slot-scope="{ row }" slot="img2">
              <div class="vmiddle">
                <img class="banner" :src="row.img2" alt="">
              </div>
            </template>
            <template slot="action" slot-scope="{ row }">
                <Button type="text" size="small" class="btn-text" @click="$router.push({name:'contentEditor', query:{id:row.id,columnId:$route.query.columnId}})">编辑</Button>
                <span>-</span>
                <Button type="text" size="small" class="btn-text" v-if="row.index_status === 2"  @click="showHandle(row)">上架</Button>
                <Button type="text" size="small" class="btn-text" v-if="row.index_status === 1" @click="hideHandle(row)">下架</Button>
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
import { get_contentList, change_contentStatus,delete_content } from '@/api/contentList'
export default {
  data () {
    return {
        columnRule: {
            name: [
                { required: true, message: '栏目名称必须填写', trigger: 'blur' }
            ],
            key: [
                { required: true, message: '栏目类型必须填写', trigger: 'blur' }
            ],
            sort: [
                { required: true, message: '请输入排序', trigger: 'blur' }
            ]
        },
      // ------------创建栏目弹框-----------//
      loading: true,
      total: 0,
      contentList: [], // 栏目内容列表
      formValidate: {
        page: 1,
        limit: 10,
        client_type: '',
        recommend_channel_id: '',
      },
      columns: [
        {
          title: '序号',
          key: 'sort',
          width: 80,
        },
        {
          title:'预览图一',
          slot:'img',
          align:'center'
        },
        {
          title:'预览图二',
          slot:'img2',
          align:'center'
        },
        {
          title: '广告名称',
          key: 'name',
          align: 'left'
        },
        {
          title: '发布平台',
          key: 'link',
          align: 'left'
        },
        {
          title: '上架状态',
          width: 100,
          render: (h, params) => {
            return h('span', [
              h('span', params.row.index_status == 1? '已上架' : '已下架')
            ])
          }
        },
        {
          title: '创建时间',
          key: 'created_time',
          width: 180,
          render: (h, params) => {
            return h('span', [
              h('span', this.getDate(params.row.created_time))
            ])
          }

        },
        {
          title: '操作',
          slot: 'action',
          align: 'center',
        }
      ]
    }
  },
  mounted () {
    this.formValidate.recommend_channel_id = this.$route.query.columnId
    this.get_contentList(this.formValidate)
  },
  methods: {
    showHandle(row) { // 上架
        this.change_contentStatus({id:row.id,index_status: 1})
    },
    hideHandle(row) {// 下架
        this.change_contentStatus({id:row.id,index_status: 2})
    },
    handlePage (newIndex) { // 切换页码
      this.formValidate.page = newIndex
      this.get_contentList(this.formValidate)
    },
    handlePageSize (pageSize) { // 切换页数
      this.formValidate.limit = pageSize
      this.get_contentList(this.formValidate)
    },
    deletHandle (row) { // 删除
      this.$Modal.confirm({
        title: '提示',
        content: '<p>确认删除该内容？</p>',
        onOk: () => {
          this.delete_content({ id: row.id })
        }
      })
    },
    async get_contentList (params) {
        this.loading = true
        const res = await get_contentList(params)
        try {
            this.contentList = res.data.data.data
            this.contentList.forEach(item => {
              let link = (Object.keys(JSON.parse(item.link))).join()
              item.link = link.replace('1', 'PC端').replace('2', '安卓').replace('4', 'IOS').replace('8', 'H5').replace('16', '小程序')
            })
            this.total = res.data.data.total
            this.loading = false
        } catch (error) {
            this.loading = false
        }
    },
    async change_contentStatus(params) { // 上下架
        const res = await change_contentStatus(params)
        try {
          if(res.status == 1) {
            this.get_contentList(this.formValidate)
          }
        } catch (error) {
            console.log(error)
        }

    },
    async delete_content (params) {
      const res = await delete_content(params)
      try {
        if (res.status == 1) {
          this.get_contentList(this.formValidate)
          this.$Message.success('删除成功')
        }
      } catch (error) {
      }
    },
    getDate(timeStamp, startType) {
      const d = new Date(timeStamp * 1000)
      const year = d.getFullYear()
      const month = this.getHandledValue(d.getMonth() + 1)
      const date = this.getHandledValue(d.getDate())
      const hours = this.getHandledValue(d.getHours())
      const minutes = this.getHandledValue(d.getMinutes())
      const second = this.getHandledValue(d.getSeconds())
      let resStr = ''
      resStr = year + '-' + month + '-' + date + ' ' + hours + ':' + minutes + ':' + second
      return resStr
    },
    getHandledValue(num){
      return num < 10 ? '0' + num : num
    }
  }
}
</script>
