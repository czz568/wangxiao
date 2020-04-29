
<template>
    <div>

        <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="120">
            <div class="studentEdit">
                <div class="title">基本信息 —— 讲师</div>
            </div>
            <FormItem label="讲师姓名" prop="nickname">
                <Input v-model="formValidate.nickname" :maxlength="15" placeholder="请输入名称，最多可添加15个字" style="width:250px"></Input>
                <span>{{formValidate.nickname.length}}/15</span>
            </FormItem>
            <FormItem label="讲师别名" prop="aliasname">
                <Input v-model="formValidate.aliasname" :maxlength="15" placeholder="请输入别名，最多可添加15个字" style="width:250px"></Input>
                <span>{{formValidate.aliasname.length}}/15</span>
            </FormItem>
            <FormItem label="讲师手机号" prop="mobile">
                <Input v-model="formValidate.mobile" placeholder="请输入合法的手机号" style="width:250px"></Input>
            </FormItem>
            <FormItem label="老师属性" prop="user_attr">
                <Treeselect style="width:300px" :normalizer="normalizer" valueConsistsOf='LEAF_PRIORITY' v-model="formValidate.user_attr" :multiple="true" :options="attributeList" />
            </FormItem>
            <FormItem label="讲师性别" prop="sex">
                <Select v-model="formValidate.sex" placeholder="请选择" style="width:100px">
                    <Option :value="'1'">男</Option>
                    <Option :value="'2'">女</Option>
                    <Option :value="'3'">未知</Option>
                </Select>
            </FormItem>
            <FormItem label="讲师头像" prop="avatar">
                <div class="upload-avatar-box">
                    <div class="avatar-wrap" v-if="formValidate.avatar">
                        <img class="avatar" :src="formValidate.avatar" alt="">
                    </div>
                    <UploadComponents type="image" @successFun="successFun" style="width:100%">
                        <span style="color:#ccc">300*300像素或1:1，支持jpg、jpeg、png,小于5M</span>
                    </UploadComponents>
                </div>
            </FormItem>
            <FormItem label="讲师头像二">
                <div class="upload-avatar-box">
                    <div class="avatar-wrap" v-if="formValidate.avatar2">
                        <img class="avatar" :src="formValidate.avatar2" alt="">
                    </div>
                    <UploadComponents type="image" @successFun="successFun2" style="width:100%">
                        <span style="color:#ccc">300*300像素或1:1，支持jpg、jpeg、png,小于5M</span>
                    </UploadComponents>
                </div>
            </FormItem>
        </Form>
        <!-- 配置额外介绍 -->
        <Form   :label-width="120" style="width: 1000px">
            <FormItem v-for="(item, index) in formValidate.intro" :key="index"  :label="'附加信息 ' + (index + 1)">
                <Row>
                    <Col span="6">
                        <Input type="text" v-model="item.title" placeholder="请输入"></Input>
                    </Col>
                    <Col span="12" offset="1">
                        <div v-for="(ele,idx) in item.child" :key="idx" class="child-input">
                            <Input v-model="ele.content" placeholder="请输入" style="margin-bottom:10px" >
                                <UploadComponents type="image" slot="prepend" @successFun="(url) => {ele.content = url}" style="width:80px;" v-show="ele.type == 'image'"></UploadComponents>
                                <Select slot="append" style="width: 100px" v-model="ele.type">
                                    <Option :value="'text'">文本</Option>
                                    <Option :value="'image'">图片</Option>
                                </Select>
                            </Input>
                            <Icon type="ios-close" class="close-btn" @click="removeChild(item.child,idx)"/>
                        </div>
                        <div style="text-align:center;margin:10px">
                            <Button type="primary" icon="md-add" shape="circle" @click="addChild(item)"></Button>
                            <span style="color:#ccc;margin:0 10px">点击添加新信息</span>
                        </div>
                    </Col>
                    <Col span="4" offset="1">
                        <Button @click="removeItem(index)" icon="ios-trash" type="error" size="small">删除</Button>
                    </Col>
                </Row>
            </FormItem>
            <FormItem>
                <Row>
                    <Col span="12">
                        <Button type="dashed" long @click="handleAdd" icon="md-add">添加信息</Button>
                        <span style="color:#000">讲师介绍 例：教育背景、教育资质、证书等</span>
                    </Col>
                </Row>
            </FormItem>
        </Form>
        <div style="text-align:center">
            <Button style="width:100px" type="primary" size="large" @click="handleSubmit('formValidate')">保存</Button>
            <Button style="width:100px;margin-left:20px" size="large" @click="$router.go(-1)">返回</Button>
        </div>
    </div>
</template>

<script>
import {
    create_teacher,
    get_teacherInfo,
    update_teacher
} from "@/api/teacher_assist";
import UploadComponents from "@/components/upload/upload";
import { get_attributeList } from "@/api/attribute";

export default {
    name: "teacherEdit",
    components: {
        UploadComponents
    },
    data() {
        return {
            normalizer(node) {
                return {
                    id: node.id,
                    label: node.name,
                    children: node.children
                };
            },
            attributeList: [], // 属性列表
            formValidate: {
                teacher_type: 1,
                nickname: "",
                mobile: "",
                avatar: "", //
                aliasname:"",
                avatar2:"",
                sex: "",
                intro: [{title:'', child:[{type:'',content:""}] }],
                user_attr: null
            },
            ruleValidate: {
                nickname: [
                    { required: true, message: "姓名不能为空", trigger: "blur" }
                ],
                mobile: [
                    {
                        required: true,
                        message: "手机号不能为空",
                        trigger: "blur"
                    }
                ],
                sex: [
                    {
                        required: true,
                        message: "性别不能为空",
                        trigger: "change"
                    }
                ],
                avatar: [
                    {
                        required: true,
                        type: "object",
                        message: "请上传图像！",
                        trigger: "change",
                        validator: (rule, value, callback) => {
                            if (!this.formValidate.avatar) {
                                callback(new Error("请上传图像！"));
                            } else {
                                callback();
                            }
                        }
                    }
                ],
            },
        };
    },
    mounted() {
        this.get_attributeList();
        if (this.$route.query.id) {
            this.get_teacherInfo(this.$route.query.id);
        }
    },
    methods: {
        handleAdd() {
            // 添加附加信息
            this.formValidate.intro.push({
                title:'',
                child:[{type:'text',content:''}]
            })
        },
        addChild(item) {
            // 添加子内容
            item.child.push({
                type:'text',
                content:'',
            })
        },
        removeItem(index) {
            // 删除附加信息
            if(index== 0) {
                return
            }
            this.formValidate.intro.forEach((item,idx) => {
                if(idx === index) {
                    this.formValidate.intro.splice(index, 1)
                }
            })
        },
        removeChild(list, idx) { // 删除子内容
            if(list.length == 1) {
                return
            }
            list.forEach((ele,index) => {
                if(index == idx) {
                    list.splice(idx,1)
                }
            })
        },
        successFun(url) {
            // 上传
            this.formValidate.avatar = url;
            this.$refs.formValidate.validateField("avatar");
        },
        successFun2(url) {
            // 上传
            this.formValidate.avatar2 = url;
        },
        handleSubmit(name) {
            this.$refs[name].validate(valid => {
                if (valid) {
                    if(this.formValidate.user_attr && this.formValidate.user_attr.length == 0) {
                        this.$Message.warning('请输入讲师属性')
                        return
                    } else {
                        this.formValidate.user_attr = this.formValidate.user_attr.map(
                            item => {
                                var obj = {};
                                obj["attr_id"] = item;
                                return obj;
                            }
                        );
                    }
                    if (this.$route.query.id) {
                        // 修改
                        this.update_teacher(this.formValidate);
                    } else {
                        // 新增
                        this.create_teacher(this.formValidate);
                    }
                } else {
                    this.$Message.error("请完善信息");
                }
            });
        },
        async get_teacherInfo(id) {
            const res = await get_teacherInfo(id);
            try {
                this.formValidate = res.data.info;
                this.formValidate.teacher_type = 1;
                if(!this.formValidate.intro) {
                    this.formValidate.intro = []
                }
                this.formValidate.sex = this.formValidate.sex + "";
                this.formValidate.user_attr = this.formValidate.attr.map(
                    item => item.attr_id
                );
            } catch (error) {}
        },
        async create_teacher(params) {
            const res = await create_teacher(params);
            try {
                if (res.status == 1) {
                    this.$Message.success("新增讲师成功");
                    this.formValidate = {
                        teacher_type: 1,
                        nickname: "",
                        mobile: "",
                        avatar: "",
                        sex: "",
                        intro: "",
                        user_attr: null
                    };
                    this.$router.push({ name: "teacher" });
                }
            } catch (error) {}
        },
        async get_attributeList() {
            const res = await get_attributeList();
            try {
                if (res.status == 1) {
                    let arr = res.data.date;
                    this.attributeList.push(arr[0]);
                }
            } catch (error) {}
        },
        async update_teacher(params) {
            const res = await update_teacher(params);
            try {
                if (res.status == 1) {
                    this.$Message.success("更新讲师信息成功");
                    this.formValidate = {
                        teacher_type: 1,
                        nickname: "",
                        mobile: "",
                        avatar: "",
                        sex: "",
                        intro: "",
                        user_attr: null
                    };
                    this.$router.push({ name: "teacher" });
                }
            } catch (error) {}
        }
    }
};
</script>


<style lang="less" scoped>
.child-input {
    display:flex;
    justify-content:space-between;
    align-items:center;
    height: auto;
    cursor: pointer;
    .close-btn {
        display: block;
        color: #333;
        font-size: 24px;
    }
}
.child-input:hover {
    .close-btn {
        display: block;
        color: red;
    }
}
</style>