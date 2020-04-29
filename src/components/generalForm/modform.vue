
<template>
    <Form ref="formTemp" v-if='tipShow'  :inline="true" :show-message="true" :model="infoData" :rules="rules" :label-width="labelWidth" style="text-align:left;">
        <cus-form :datas="fromFileds" :formModel="infoData" @inputFocus="inputFocus" @autoSearch='autoSearch' >
            <template v-for="(item) in fromFileds" :slot="item.slot" >
                <slot v-if="item.slot" :name="item.slot" :params="item.params" />
            </template>
        </cus-form>
    </Form>
</template>
 
<script>
import CusForm from '@comp/widgets/CusForm'
import { setTimeout } from 'timers'
const arrayModelType = ['checkbox']
export default {
  name: 'crate-modal',
 
  components: {
    CusForm,
  },
  props: {
    labelWidth: {
      default: 262,
      type: Number
    },
    width: {
      default: 420,
      type: Number
    },
    fromFileds: {
      type: Array,
      default: () => {
        return []
      }
    },
    rules: {
      type: Object,
      default: () => {
        return {}
      }
    },
    title: String
  },
  watch: {
    tipShow () {
      this.infoData = this.setupForm()
    },
    'infoData.industry' (newVal, oldVal) {
      if (oldVal) {
        this.$set(this.infoData, 'l1Class', null)
      }
      this.changeList('industry', newVal)
    },
    'infoData.l1Class' (newVal, oldVal) {
      if (oldVal) {
        this.$set(this.infoData, 'l2Class', null)
      }
      this.changeList('l1Class', newVal)
    },
    'infoData.l2Class' (newVal, oldVal) {
      if (oldVal) {
        this.$set(this.infoData, 'l3Class', null)
      }
      this.changeList('l2Class', newVal)
    },
    'infoData.mainTag' (newVal, oldVal) {
      if (oldVal) {
        this.infoData.secTag = ''
      }
      this.autoSearch('secTagEvent')
    }
 
  },
  mounted () {
 
  },
  data () {
    return {
      fileds: [],
      tipShow: false,
      infoData: {}
    }
  },
  methods: {
    // AutoComplete 的事件联动
    autoSearch (eventName) {
      this.$emit('autoSearch', eventName)
    },
 
    //
    changeList (listName, value) {
      this.$emit('changeList', listName, value)
    },
    tipShowChange (value) {
      this.tipShow = value
    },
    resetFields () {
      this.$refs['formTemp'].resetFields()
    },
    inputFocus (name) { // 数字框的特殊处理
      // eslint-disable-next-line no-useless-escape
      this.signInfoData[name] = this.signInfoData[name].replace(/\,/g, '')
    },
    setupForm () { // 表单默认值处理
      let forms = {}
      this._forEach(this.fromFileds, item => {
        let arr = []
        if (item.type === 'checkbox') {
          this._forEach(item.children, o => {
            o.value && arr.push(o.value)
          })
        }
        if (!this._isNil(item.model) && item.type !== 'text') {
          // 取默认值
          forms[item.model] = !this._isNil(item.value) ? item.value : arrayModelType.includes(item.type) ? arr : ''
        }
        if (['number', 'number2'].includes(item.type) && this._isNil(item.value)) {
          item.value = 0
        }
      })
      return forms
    },
    submit () {
      this.$refs['formTemp'].validate((valid) => {
        if (valid) {
          this.$emit('handleSubmit', this.getData())
        }
      })
    },
    formatData (data) {
      // 表单要素的数据格式化处理。
      let obj = {}
      this._forEach(this.fromFileds, (item) => {
        obj[item.model] = data[item.model]
        if (item.formateValue) {
          obj[item.model] = item.formateValue(data[item.model])
        }
      })
      return obj
    },
    setData (detailInfo) {
      detailInfo = this.formatData(detailInfo)
      Object.assign(this.infoData, detailInfo)
      setTimeout(() => {
        this.$refs['formTemp'].validate()
      }, 700)
    },
    getData () {
      return this.formatData(this.infoData)
    }
  }
}
</script>
 
 
