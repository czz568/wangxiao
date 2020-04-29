<template>
  <article>
    <modal-from ref="modlfrom" :title="title"  :label-width='labelWidth'
         :width="width" :from-fileds="datas" :rules="rules"
        @handleSubmit="handleSubmit">
        <template slot="contractName">
          <p class="line">范例所处合约位置</p>  
        </template>
        <template slot="optionBtn">
            <p>
              <a v-if="nodeLength<3" @click="addNode">添加子章节</a>
              <a v-if="nodeLength>0" @click="delNode">删除</a>
            </p>
        </template>
    </modal-from>
  </article>
</template>
 
<script>
import ModalFrom from './modalform'
import {exampleForms, lengthValidator} from './../Modals/termOption'
export default {
  name: 'term-example-page',
 
  components: {
    ModalFrom,
  },
  props: {
    termId: {
      type: String,
      required: true
    }
 
  },
 
  data () {
    return {
      title: '',
      zhWList: {
        1: '一',
        2: '二',
        3: '三',
        4: '四'
      },
      rules: {
        exampleContent: [
          { required: true, message: '请输入范例内容', trigger: 'change' },
          { validator: lengthValidator, trigger: 'change', maxLength: 1000, message: '范例内容不超过1000字' }
        ],
        contractName: [
          { required: true, message: '请输入合约名称', trigger: 'change' },
          { validator: lengthValidator, trigger: 'change', maxLength: 60, message: '合约名称不超过60字' }
        ],
        chapterOneName: [
          { validator: lengthValidator, trigger: 'change', maxLength: 20, message: '一级章节名称不超过20字' }
        ],
        chapterTwoName: [
          { validator: lengthValidator, trigger: 'change', maxLength: 20, message: '二级章节名称不超过20字' }
        ],
        chapterThreeName: [
          { validator: lengthValidator, trigger: 'change', maxLength: 20, message: '三级章节名称不超过20字' }
        ],
        chapterFourName: [
          { validator: lengthValidator, trigger: 'change', maxLength: 20, message: '四级章节名称不超过20字' }
        ]
 
      },
      id: '',
      tipShow: false,
      exampleList: [],
      detailInfo: {},
      labelWidth: 120,
      nodeLength: 2,
      width: 507,
      datas: [],
      popTipShow: {0: false, 1: false, 2: false} // 用数组简单的赋值v-modal绑定失效
    }
  },
  watch: {
    nodeLength (newVal) {
      let i = 0
      this.datas = []
      this.datas = exampleForms().filter(item => {
        if (this.detailInfo) {
          item.value = this.detailInfo[item.model] || ''
        }
        if (item.isShow) {
          i++
          if (i <= newVal) {
            return true
          } else {
            return false
          }
        } else {
          return true
        }
      })
    }
  },
  mounted () {
 
  },
 
  beforeDestroy () {
 
  },
 
  methods: {
    changePopTipshow (index) {
      this.popTipShow[index] = false
    },
    changeExampleList (list) {
      this.exampleList = list
    },
    addNode () {
      if (this.nodeLength < 4) { this.nodeLength++ }
    },
    delNode () {
      if (this.nodeLength > 0) { this.nodeLength-- }
    },
    showFromModal (detailInfo) {
      this.detailInfo = detailInfo
      this.title = '添加范例'
      if (detailInfo) {
        this.title = '编辑范例'
      }
      this.$refs.modlfrom.tipShowChange(true)
      let i = 0
      this.datas = exampleForms().filter(item => {
        if (detailInfo) {
          item.value = detailInfo[item.model] || ''
          this.id = detailInfo.id
        }
        if (item.isShow) {
          i++
          if (i <= this.nodeLength) {
            return true
          } else {
            return false
          }
        } else {
          return true
        }
      })
      if (detailInfo && detailInfo.chapterFourName) {
        this.nodeLength = 3
      } else {
        this.nodeLength = 2
      }
    },
    delExample (detailInfo) { // 删除
      this.detailInfo = detailInfo
      this.tipShow = true
    },
    deleteOption () {
      this.$http.post('/contractTerms/deleteTermExample', {id: this.detailInfo.id}).then(res => {
        if (res.rtnCode === '000') {
          let selecItem = this.exampleList.find((item, index) => {
            item.index = index
            return item.id === this.detailInfo.id
          })
          this.exampleList.splice(selecItem.index, 1)
          this.$Message.success('删除成功')
          this.tipShow = false
        } else {
          this.$Message.error({ content: res.rtnMsg })
        }
      }).catch((err) => {
        this.$debug(err)
      })
    },
    handleSubmit (infoData) {
      // 待后台告知内容字段的名称，暂用content表示条款内容字段，其他参数待填充
      let postData = {termId: this.termId}
 
      Object.assign(postData, infoData)
      let url = '/contractTerms/addTermExample'
      if (this.id) {
        url = '/contractTerms/updateTermExample'
        postData.id = this.id
      }
      this.$http.post(url, postData).then(res => {
        if (res.rtnCode === '000') {
          this.$refs.modlfrom.tipShowChange(false)
          if (this.id) {
            let selecItem = this.exampleList.find((item, index) => {
              item.index = index
              return item.id === this.id
            })
            this.exampleList.splice(selecItem.index, 1, postData)
            this.id = ''
            this.$Message.success('编辑范例成功')
          } else {
            postData.id = res.data
            this.exampleList.push(postData)
            this.$Message.success('添加范例成功')
          }
        } else {
          this.$Message.error({ content: res.rtnMsg })
        }
      }).catch((err) => {
        this.$debug(err)
      })
    }
  }
 
}
</script>
 
<style lang="scss" scoped>
.api {
    min-height: 100px;
    color: #292929;
    white-space: initial;
    max-height: 250px;
}
p.line {
    border-top: 1px solid #e3e3e3;
    display: inline-block;
    position: absolute;
    width: 450px;
    left: -120px;
    margin-top: 22px;
    padding-left: 22px;
    color: #C2C5BC;
    padding-top: 5px
}
.exampleP {
  font-size: 14px; 
  color: #242b39; 
  border-bottom: solid 1px #e3e3e3;
}
.example {
  width: 278px;
  display: inline-block;
  border:1px solid #e1e3e9;
  position: relative;
  min-height:70px;
  margin-top:15px;
  padding: 18px 14px; 
 
  &.on{ 
    border-color:#1e64e5;
  }
  .exampleText {
    overflow:hidden;
    text-overflow:ellipsis;
    white-space:nowrap;
    cursor: pointer
  }
 
  .exampleP {
    font-size: 14px; 
    color: #242b39; 
    border-bottom: solid 1px #e3e3e3;
    padding-left: 24px;
    background: url('../../../assets/images/icon/text.png') no-repeat top left 
  }
  .exampleTitle {
    position: absolute;
    top: -11px;
    background: #E2F2FC;
    width: 45px;
    height: 22px;
    left: 0;
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
 
    .option {
      margin-top: 8px;
      text-align: right;
      
      a {
        background-repeat: no-repeat;
        background-position: center center;
        width: 16px;
        height: 16px;
        float: right;
        margin-right: 8px;
      }
 
      .edit {
         background-image: url('../../../assets/images/icon/edit.png');
 
         &:hover {
           background-image: url('../../../assets/images/icon/editOn.png');
         }
      }
      .del {
         background-image: url('../../../assets/images/icon/del.png');
 
         &:hover {
           background-image: url('../../../assets/images/icon/delOn.png');
         }
      }
    }
 
    p {
      padding-left: 36px;
    }
  }
}
 </style>