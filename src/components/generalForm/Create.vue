<template>
  <article>
    <insert-modal v-model="isInsertModalShow" @choiceElem="insertElem"></insert-modal>
    <modal-from ref="modlfrom" title="提交条款" 
    :label-width='labelWidth' 
    :width="width"
    :from-fileds="datas"
    :rules ="rules"
    @handleSubmit="handleSubmit" @autoSearch="autoSearch" @changeList="changeList"></modal-from>
    <section class="panel-heading">
      <Button type="ghost" @click="goBackList">返回</Button>
      <span class="panel-title" :title="title">
        {{ this.title }}
      </span>
      <span class="right-panel">
        <Button type="primary" @click="showFromModal">提交</Button>
      </span>
    </section>
    <div :class="{maxDiv:id, minDiv:!id}"  class="reality">
      <tinymce id="tinymce-area" ref="tinymceArea" v-model="content" :width="942" style="width: 950px;margin: 0 auto;float: left;" @onChoose="isInsertModalShow=true"></tinymce>
      <div class="demo-panel" v-if='id'>
        <p class="exampleP">条款范例
          <span style="padding-left:5px; font-size:12px;color:#999999">(条款的应用举例)</span></p>
          <example-list ref="exampleList" :term-id="id" />
      </div>
    </div>
    <!-- <div>{{ content }}</div> -->
  </article>
</template>
 
<script>
import Tinymce from '@comp/widgets/TinymceVue'
import InsertModal from '../Contract/Modals/Insert'
import ModalFrom from './Modals/ModalForm'
import exampleList from './component/exampleList'
import { defaultStyles } from '@util/tinymceConfig'
import { toFreeMaker, toEditor, pickElems } from '@util/templateFormat'
import {addProjectForms} from './Modals/termOption'
 
export default {
  name: 'term-create-page',
 
  components: {
    Tinymce,
    InsertModal,
    ModalFrom,
    exampleList
  },
 
  data () {
    return {
      title: '',
      id: '',
      detailInfo: '',
      labelWidth: 120,
      width: 888,
      datas: [],
      list: {
        industry: [],
        l1Class: [],
        l2Class: [],
        l3Class: [],
        mainTag: [],
        secTag: []
      },
      rules: {
        mainTag: [
          { required: true, message: '请输入主标签', trigger: 'change' },
          { validator: this.mainTagValid, trigger: 'blur' }
        ],
        secTag: [
          { required: true, message: '请输入次标签', trigger: 'change' },
          { validator: this.secTagValid, trigger: 'blur' }
        ]
 
      },
      isInsertModalShow: false,
      content: 'content'
    }
  },
 
  computed: {
  },
 
  mounted () {
    this.datas = addProjectForms()
    this.$refs.tinymceArea.init(defaultStyles)
    this.id = this.$route.query.id
    if (this.id) { // 编辑赋值处理。
      this.showTermContent()
    } else {
      this.title = '新增条款'
    }
  },
 
  beforeDestroy () {
 
  },
 
  methods: {
    mainTagValid (rule, val, cb) {
      if (val && this.list.mainTag.length > 0) {
        let item = this._find(this.list.mainTag, item => {
          return item.dictName === val
        })
        if (item) {
          cb()
        } else {
          cb(new Error('请输入主标签'))
        }
      } else {
        cb(new Error('请输入主标签'))
      }
    },
    secTagValid (rule, val, cb) {
      if (val && this.list.secTag.length > 0) {
        let item = this._find(this.list.secTag, item => {
          return item.dictName === val
        })
        if (item) {
          cb()
        } else {
          cb(new Error('请输入次标签'))
        }
      } else {
        cb(new Error('请输入次标签'))
      }
    },
    autoSearch (eventName) {
      switch (eventName) {
        case 'mainTagEvent':
          this.mainTagSearch()
          break
        case 'secTagEvent':
          this.secTagSearch()
          break
      }
    },
    changeList (listName, value) {
      switch (listName) {
        case 'industry':
          this.getL1Class(value)
          this.changeDatas('l1Class')
          break
        case 'l1Class':
          this.getL2Class(value)
          this.changeDatas('l2Class')
          break
        case 'l2Class':
          this.list.l3Class = []
          this.getL3Class(value)
          this.changeDatas('l3Class')
          break
      }
    },
    changeDatas (listName) {
      let index = -1
      this.datas.map((item, i) => {
        if (item.model === listName) {
          index = i
        }
      })
      if (index !== -1) {
        let item = this.datas[index]
 
        // 此步骤是核心关键格式化 接口返回数据，因包含了
        // industry："行业"
        // l1Class："业务类型"
        // l2Class：产品类型
        // l3Class："产品细分"
        // mainTag："主标签"
        // secTag："次标签"
        // 可能会出现 接口返回字段名称不一致 因接口统一无问题，如果接口不统一或者字段名称不一样请根据listName 做判断取不同的值进行格式化
        item.children = this.list[listName].map((item) => {
          let obj = {}
          obj.label = item.dictCode
          obj.text = item.dictName
          return obj
        })
        this.datas.splice(index, 1, item)
      }
    },
    queryDictList (reqData, listName) {
      let params = this._merge({escapeLoading: true}, reqData)
      this.$http.post('dict/queryDictList', params).then(res => {
        if (res.rtnCode === '000') {
          this.list[listName] = res.data || [] // 一定要先赋值， 因为在调用 changeDatas 需要用到赋值的对象
          this.changeDatas(listName)
        } else {
          this.$Message.error({content: res.rtnMsg, closable: true})
        }
      }).catch(err => {
        this.$debug(err)
      })
    },
    simplifyDictTreeList (treeNode) {
      if (this._isNil(treeNode) || treeNode.length === 0) {
        return []
      }
      return this._map(treeNode, (o) => {
        return {'dictCode': o.dictCode, 'dictName': o.dictName, 'childrenList': this.simplifyDictTreeList(o.childrenList)}
      })
    },
    getTreeListNode (parentNode, parentNodeValue) {
      let list = this._find(parentNode, {dictCode: parentNodeValue})
      return this._isNil(list) ? [] : list.childrenList
    },
    getL1Class (value) {
      this.list.l1Class = this.getTreeListNode(this.list.industry, value)
    },
    getL2Class (value) {
      this.list.l2Class = this.getTreeListNode(this.list.l1Class, value)
    },
    getL3Class (value) {
      this.list.l3Class = this.getTreeListNode(this.list.l2Class, value)
    },
    mainTagSearch (value) {
      let reqData = {
        dictCategoryCode: 'CONTRACT_TERM_LV1'
      }
 
      let infoData = this.$refs.modlfrom.getData()
      console.log(infoData, '------------mainTag---------')
      if (infoData.mainTag) {
        reqData.dictName = infoData.mainTag
      }
      this.queryDictList(reqData, 'mainTag')
    },
    secTagSearch () {
      let reqData = {
        dictCategoryCode: 'CONTRACT_TERM_LV2'
      }
      let infoData = this.$refs.modlfrom.getData()
      if (infoData.secTag) {
        reqData.dictName = infoData.secTag
      }
      if (infoData.mainTag && this.list.mainTag.length > 0) {
        let itemDict = this._find(this.list.mainTag, (item) => {
          return infoData.mainTag === item.dictName
        })
        if (itemDict) {
          reqData.pDictCode = itemDict.dictCode
        }
      }
      this.queryDictList(reqData, 'secTag')
    },
    goBackList () {
      this.$router.push('/term/list')
    },
    // 插入要素事件
    insertElem (elem) {
      this.$refs.tinymceArea.insertElem(elem)
    },
    showFromModal () {
      this.$refs.tinymceArea.saveRecentContent()
      if (!this.content) {
        this.$Message.warning('请输入条款内容')
        return
      }
      this.$refs.modlfrom.tipShowChange(true)
      let reqData = {
        dictCategoryCode: 'CONTRACT_BUSINESS_TYPE',
        dictCode: '0'
      }
      this.$http.post('/dict/queryDictTreeList', reqData).then(res => {
        if (res.rtnCode === '000') {
          this.list.industry = this._isNil(res.data) ? [] : this.simplifyDictTreeList(res.data[0].childrenList)
          this.changeDatas('industry')
          if (this.id) { // 编辑赋值
            this.detailInfo.mainTag = this.detailInfo.mainTagName
            this.detailInfo.secTag = this.detailInfo.secTagName
            this.$refs.modlfrom.setData(this.detailInfo)
          }
        } else {
          this.$Message.error({content: res.rtnMsg, closable: true})
        }
        this.loading = false
      }).catch(err => {
        this.loading = false
        this.$debug(err)
      })
    },
    handleSubmit (infoData) {
      // 待后台告知内容字段的名称，暂用content表示条款内容字段，其他参数待填充
      let postData = {htmlContent: toFreeMaker(this.content, '', false)}
      let mainTagItem = this._find(this.list.mainTag, (item) => {
        return infoData.mainTag === item.dictName
      })
      let secTagItem = this._find(this.list.secTag, item => {
        return item.dictName === infoData.secTag
      })
      Object.assign(postData, infoData)
      postData.mainTag = mainTagItem.dictCode
      postData.secTag = secTagItem.dictCode
      let url = '/contractTerms/addContractTerm'
      if (this.id) {
        url = '/contractTerms/updateContractTerm'
        postData.id = this.id
      }
      this.$http.post(url, postData).then(res => {
        if (res.rtnCode === '000') {
          this.$router.push({name: 'TermList'})
        } else {
          this.$Message.error({ content: res.rtnMsg })
        }
      }).catch((err) => {
        this.$debug(err)
      })
    },
 
    // 编辑处理如下
 
    // 获取信息并展示
    showTermContent () {
      this.loading = true
      // 待后台告知接口名称，暂用todo
      this.$http.post('/contractTerms/getContractTermDetail', {id: this.id}).then(contentRes => {
        this.loading = false
        let content = this.getTermDetail(contentRes)
        // 初始化编辑器
        this.$refs.tinymceArea.init(defaultStyles)
        if (content) {
          // 获取内容中的要素
          let elems = pickElems(content)
          if (elems.length > 0) {
            this.loading = true
            // 若内容中有要素通过接口获取要素详情，此为已有接口
            this.$http.post('/contractElement/selectListByPage', {'idList': elems, 'noPage': '1'}).then(elemsRes => {
              this.loading = false
              this.reSetElems(elemsRes, content)
            }).catch(err => {
              this.loading = false
              this.$debug(err)
            })
          } else {
            this.content = content
          }
        }
      }).catch(err => {
        this.loading = false
        this.$debug(err)
      })
    },
    // 对接口获取到的条款详情进行赋值
    getTermDetail (res) {
      if (res.rtnCode === '000') {
        const resData = res.data || {}
        this.detailInfo = resData.contractTerms
        this.title = this.detailInfo.termName
        // resData.contractExamples
        this.$refs.exampleList.changeExampleList(resData.contractExamples)
        return resData.contractTerms.htmlContent || ''
      } else {
        this.$Message.error({content: res.rtnMsg, closable: true})
        return ''
      }
    },
    // 接口获取到的要素信息，替换当前内容里的要素变成编辑器要求展示的样子
    reSetElems (res, content) {
      if (res.rtnCode === '000') {
        const resData = res.data || []
        if (this._isNil(resData.rows) || resData.rows.length <= 0) {
          this.content = content
        } else {
          this.content = toEditor(resData.rows, content)
        }
      } else {
        this.$Message.error({content: res.rtnMsg})
      }
    }
  }
}
</script>
 
<style lang="scss" scoped>
.exampleP {
  font-size: 14px; 
  color: #242b39; 
  border-bottom: solid 1px #e3e3e3;
}
.example {
  width: 100%;
  border:1px solid #e1e3e9;
  min-height:70px;
  margin-top:15px;
  padding: 18px 14px; 
 
  &.on{ 
    border-color:#1e64e5;
  }
  .exampleP {
    font-size: 14px; 
    color: #242b39; 
    border-bottom: solid 1px #e3e3e3;
    overflow:hidden;
    text-overflow:ellipsis;
    white-space:nowrap;
    padding-left: 24px;
    background: url('../../assets/images/icon/text.png') no-repeat top left;
    cursor: pointer;
  }
  .exampleTitle {
    background: #e2f2fC;
    width: 45px;
    height: 22px;
    margin: -30px 0 10px -14px;
    text-align: center;
    line-height: 22px;
  }
 
  .exampleNode {
    padding:8px 0px;
    font-size: 12px;
    color: #292929;
    
    &::before {
      content: '章节';
      color: #999;
      position:absolute;
    }
    p {
      padding-left: 36px;
    }
  }
}
.panel-heading {
  margin: 0;
  padding: 17px 25px 17px 15px;
 
  .panel-title {
    display:inline-block;
    margin-left: 27px;
    vertical-align: middle;
    font-size: 14px;
    width: 800px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}
.demo-panel {
  display: inline-block;
  height: calc(100vh - 150px);
  width: calc(100% - 960px);
  overflow-y: auto;
  text-align: left;
  padding: 25px;
  margin-left: 10px;
  background: #fff;
}
.maxDiv {
  margin: 0 auto;
  width: 1280px;
}
.minDiv {
  margin: 0 auto;
  width: 960px;
}

</style>