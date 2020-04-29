<template>
  <div >
    <Tabs :animated="false" @on-click="tabsClick">
        <TabPane :name="`${item.id}`" :label="item.name" v-for="(item) in tabList" :key="item.id">
            <div  class="spin-container" >
                <div class="title">{{item.name}}</div>
                <Form  :ref="item.key" :model="submitParams[item.key]"  :rules="submitParamsRules[item.key]" :label-width="200">
                    <customeForm  :formItemList="formItemList[item.key]" :submitParams="submitParams[item.key]"></customeForm>
                </Form>
                <div style="text-align:center">
                    <Button type="primary" size="large" @click="handleSubmit(item.key,item.id)">保存</Button>
                </div>
                <Spin style="z-index:999" fix v-if="spinShow"></Spin>
            </div>
        </TabPane>
    </Tabs>
  </div>
</template>

<script>
import {getConfigGroup, getConfigForm, updateConfigForm} from '@/api/website'
import customeForm from '@/components/modeForm/customeForm'

 export default {
    components: {
        customeForm
    },
    data () {
        return {
            spinShow: false,
            tabList:[], // 标签列表
            groupId: '', // 当前点=展示的标签页ID
            formItemList:{
                // 'common_setting':[],
                // 'website_setting':[],
                // 'protocol_setting':[],
                // 'aboutus_setting':[],
            }, // 表单渲染列表
            submitParamsRules: {
                // 'common_setting':{},
                // 'website_setting':{},
                // 'protocol_setting':{},
                // 'aboutus_setting':{},
            }, // 校验规则
            
            submitParams: {
                // 'common_setting':{},
                // 'website_setting':{},
                // 'protocol_setting':{},
                // 'aboutus_setting':{},
            }, // 参数
        }
    },
    mounted() {
        this.getConfigGroup()
    },
    methods: {
        tabsClick(groupId) {
            this.groupId = groupId
            this.getConfigForm(groupId)
        },
        handleSubmit(key,groupId) { // 提交
            let params = {
                config_group_id:groupId,
                config: []
            }
            this.$refs[key][0].validate(valid => {
                if (valid) {
                    this.formItemList[key].forEach(item => {
                        item.value = this.submitParams[key][item.key]
                    })
                    params.config = this.formItemList[key].map(item => 
                        {
                            return {id: item.id, value: item.value}
                        }
                    )
                    // console.log(params)
                    this.updateConfigForm(params)
                }
            })
        },
        async getConfigGroup() {
            const res = await getConfigGroup()
            try {
                if(res.status == 1) {
                    this.tabList = res.data.data
                    this.tabList.forEach((item) => { 
                        this.$set(this.submitParams, item.key, {}) // 分模块设置相应值
                        this.$set(this.submitParamsRules, item.key, {}) // 分模块设置相应值
                        this.$set(this.formItemList, item.key, [])
                    })
                    this.groupId = this.tabList[0].id
                    this.getConfigForm(this.tabList[0].id) // 默认展示第一个标签页
                }
            } catch (error) {
                
            }
        },
        async updateConfigForm(params) {
            const res = await updateConfigForm(params)
            try {
                if(res.status == 1) {
                    this.getConfigForm(this.groupId)
                    this.$Message.success('保存成功')
                }
            } catch (error) {
                
            }
        },
        async getConfigForm(groupId) {
            this.spinShow = true
            const res = await getConfigForm(groupId)
            try {
                if(res.status == 1) { 
                    this.tabList.forEach(item => {
                        this.$set(this.submitParams, item.key, {}) // 分模块设置相应值
                        this.$set(this.submitParamsRules, item.key, {}) // 分模块设置相应值
                        this.$set(this.formItemList, item.key, [])
                        if(item.id == groupId) {
                            this.formItemList[item.key] =  res.data.data
                        }
                        this.formItemList[item.key].forEach(ele => { // 遍历表单并格式化表单中的值以防数据校验错误
                            this.formatParams(ele)
                            if(item.id == groupId) { // 设置表单的参数，处理响应式问题
                                this.$set(this.submitParams[item.key], ele.key, ele.value) // 为单一模块添加属性解决响应式问题
                                if(ele.is_require == 1) { // 添加必填项的校验
                                    let rules = this.formatRules(ele)
                                    this.$set(this.submitParamsRules[item.key], ele.key, rules)
                                }
                            }
                        })
                    })
                    this.spinShow = false
                    // console.log(this.submitParams, 'submitParams')
                    // console.log(this.formItemList, 'formItemList')
                }
            } catch (error) {
                setTimeout(() => {
                    this.spinShow = false
                }, 3000);
            }
        },
        formatRules(item) {
            switch (item.value_type) {
                case 'select':
                    const validatorSelect =  (rule, val, callback) => {
                        if (!val) {
                            callback(new Error('请选择'))
                        }
                        callback()
                    }
                    return [{required: true, validator:validatorSelect, trigger: 'change'}]
                case 'checkbox':
                    let validatorCheckbox =  (rule, val, callback) => {
                        if (val.length == 0) {
                            callback(new Error('请选择'))
                        }
                        callback()
                    }
                    return [{required: true, validator:validatorCheckbox, trigger: 'change'}]
                case 'timeselect':
                    let validatorTimeselect =  (rule, val, callback) => {
                        if (!val) {
                            callback(new Error('请选择日期'))
                        }
                        callback()
                    }
                    return [{required: true, validator:validatorTimeselect, trigger: 'change'}]
                case 'radio':
                    let validatorRadio =  (rule, val, callback) => {
                        if (!val) {
                            callback(new Error('请选择'))
                        }
                        callback()
                    }
                    return [{required: true,validator: validatorRadio, trigger: 'change'}]
                default:
                    return [{required: true, message: item.name + '为必填项', trigger: 'blur'}]
            }
        },
        formatParams(item) { // 格式化各种类型表单组件的传值
            switch (item.value_type) {
                case 'checkbox':
                    item.value = JSON.parse(item.value)
                    break;
                case 'select':
                    item.value = Number(item.value)
                    break;
                case 'radio':
                    item.value = Number(item.value)
                    break;
            }
        },
    }
}
</script>


<style lang="less">
    .spin-container{
        display: inline-block;
        width: 100%;
        height:100%;
        position: relative;
        border: 1px solid #eee;
    }
</style>