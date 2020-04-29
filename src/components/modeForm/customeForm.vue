<template>
  <div class="general-form">
    <FormItem  :label="item.name" v-for="item in formItemList"  :key="item.id" :prop="item.key">
        <!-- 文本框 -->
        <Input v-if="item.value_type === 'text'"  v-model="submitParams[item.key]"  style="width:400px"  placeholder="请输入" /></Input>
        <!-- 密码框 -->
        <Input v-if="item.value_type === 'password'" type="password" password  v-model="submitParams[item.key]" style="width:400px"  placeholder="请输入" />
        <!-- 文本域 -->
        <Input v-if="item.value_type === 'textarea'" type="textarea" v-model="submitParams[item.key]" :rows="4" style="width:400px"  placeholder="请输入"  />
          <!-- 单选框 -->
        <RadioGroup  v-if="item.value_type === 'radio'" v-model="submitParams[item.key]">
            <Radio :label="ele.id"  v-for="ele in item.info" :key="ele.id" :true-value="1" :false-value="2">{{ele.name}}</Radio>
        </RadioGroup>
        <!-- 复选框 -->
        <CheckboxGroup v-if="item.value_type === 'checkbox'" v-model="submitParams[item.key]" @on-change="onChange">
            <Checkbox :label="ele.id"  v-for="ele in item.info" :key="ele.id">{{ele.name}}</Checkbox>
        </CheckboxGroup>
         <!-- 下拉选择框 -->
        <Select  v-if="item.value_type === 'select'" style="width:300px" v-model="submitParams[item.key]">
            <Option v-for="ele in item.info" :value="ele.id" :key="ele.id">{{ ele.name }}</Option>
        </Select>
         <!-- 时间选择器 -->
        <DatePicker v-if="item.value_type === 'timeselect'" format="yyyy-MM-dd" v-model="submitParams[item.key]" type="date" placeholder="请选择" style="width: 300px"></DatePicker>
        <!-- 文件上传 -->
        <div  v-if="item.value_type === 'file'">
            <div>
                <a class="file-name" target="_blank" :href="submitParams[item.key]">{{submitParams[item.key]}}</a>
            </div> 
             <!-- @successFun="(datetime) =>{ changeDateTime(datetime, formContent)}" -->
            <UploadComponents type="file" @successFun="(url) => { submitParams[item.key] = url }" style="width:100%"></UploadComponents>
        </div>
        <!-- 图片上传 -->
        <div  v-if="item.value_type === 'image'">
            <div class="upload-avatar-box">
                <div class="avatar-wrap">
                    <img class="avatar" alt="" :src="submitParams[item.key]" v-if="submitParams[item.key] !== ''">
                </div>
                <UploadComponents type="image" @successFun="(url) => { submitParams[item.key] = url }" style="width:100%" ></UploadComponents>
            </div>
        </div>
        <!-- 视频上传 -->
        <div  v-if="item.value_type === 'video'">
            <div class="upload-avatar-box">
                <div class="video-wrap">
                    <a target="_blank" :href="submitParams[item.key]" v-if="submitParams[item.key] !== ''">
                        点击预览
                        <video class="video" alt="" :src="submitParams[item.key]" ></video>
                    </a>
                </div>
                <UploadComponents type="video" @successFun="(url) => { submitParams[item.key] = url }" style="width:100%"></UploadComponents>
            </div>
        </div>
        <!-- 富文本 -->
        <div class="ueditor" v-if="item.value_type === 'fulltext'">
            <vue-ueditor-wrap style="width:900px;"  v-model="submitParams[item.key]"  :config="$config.ueditorConfig"></vue-ueditor-wrap>
        </div>
        <!-- 后缀提示信息 -->
        <span style="color:#aaa" v-if="item.tip_msg">{{item.tip_msg}}</span>
    </FormItem>
  </div>
</template>

<script>
import UploadComponents from '@/components/upload/upload'
export default {
    components: {
        UploadComponents
    },
    props:{
        formItemList:{
            type: Array,
            default:[]
        },
        submitParams:{
            type: Object,
            default:{}
        }
    },
    data() {
        return {
        }
    },
    beforeUpdate() {
        // console.log(this.submitParams, 'submitParams')
        // console.log(this.formItemList, 'formItemList')
    },
    methods: {
        dateChange(datetime,formContent) {
            // formContent = datetime
            console.log(formContent)
        },
        onChange(array) {// checkbox
            console.log(array)
        }
    }
}
</script>
<style lang="less" scoped>
.general-form {
    .file-name {
        width:400px;
        height:30px;
        display: inline-block;
        line-height:30px;
        white-space:nowrap;
        overflow:hidden;
        margin-right: 20px;
        text-overflow:ellipsis;
    }
}
</style>