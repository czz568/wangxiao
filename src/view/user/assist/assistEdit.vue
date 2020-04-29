
<template>
    <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="120">
        <div class="studentEdit">
            <div class="title">基本信息 —— 助教</div>
        </div>
        <FormItem label="助教姓名" prop="nickname">
            <Input v-model="formValidate.nickname" :maxlength="15" placeholder="请输入名称，最多可添加15个字" style="width:250px"></Input>
            <span>{{formValidate.nickname.length}}/15</span>
        </FormItem>
        <FormItem label="助教手机号" prop="mobile">
            <Input v-model="formValidate.mobile" placeholder="请输入合法的手机号" style="width:250px"></Input>
        </FormItem>
        <FormItem label="助教属性" prop="user_attr">
            <Treeselect style="width:300px" :normalizer="normalizer" valueConsistsOf='LEAF_PRIORITY' v-model="formValidate.user_attr" :multiple="true" :options="attributeList" />
        </FormItem>
        <FormItem label="助教性别" prop="sex">
            <Select v-model="formValidate.sex" placeholder="请选择" style="width:100px">
                <Option :value="'1'">男</Option>
                <Option :value="'2'">女</Option>
                <Option :value="'3'">未知</Option>
            </Select>
        </FormItem>
        <FormItem label="助教头像" prop="avatar">
            <div class="upload-avatar-box">
                <div class="avatar-wrap" v-if="formValidate.avatar">
                    <img class="avatar" :src="formValidate.avatar" alt="">
                </div>
                <UploadComponents type="image" @successFun="successFun" style="width:100%">
                    <span style="color:#ccc">300*300像素或1:1，支持jpg、jpeg、png,小于5M</span>
                </UploadComponents>
            </div>
        </FormItem>
        <FormItem label="助教介绍" prop="intro">
            <Input style="width:500px" v-model="formValidate.intro" type="textarea" :maxlength="200" :autosize="{minRows: 2,maxRows: 5}" placeholder="请输入助教介绍，最多可添加200个字"></Input>
            <span>{{formValidate.intro.length}}/200</span>
        </FormItem>
        <FormItem>
            <Button style="width:100px" type="primary" size="large" @click="handleSubmit('formValidate')">保存</Button>
            <Button style="width:100px;margin-left:20px"  size="large" @click="$router.go(-1)">返回</Button>
        </FormItem>
    </Form>
</template>

<script>
import {
    create_teacher,
    get_teacherInfo,
    update_teacher
} from "@/api/teacher_assist";
import { get_attributeList } from "@/api/attribute";
import UploadComponents from "@/components/upload/upload";

export default {
    name: "assistEdit",
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
                teacher_type: 2,
                nickname: "",
                mobile: "",
                avatar: "", //
                sex: "",
                intro: "",
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
                sex: [
                    {
                        required: true,
                        message: "性别不能为空",
                        trigger: "change"
                    }
                ],
                intro: [
                    { required: true, message: "请输入简介", trigger: "blur" }
                ]
            }
        };
    },
    mounted() {
        this.get_attributeList();
        if (this.$route.query.id) {
            this.get_teacherInfo(this.$route.query.id);
        }
    },
    methods: {
        successFun(url) {
            this.formValidate.avatar = url;
            this.$refs.formValidate.validateField("avatar");
        },
        handleSubmit(name) {
            this.$refs[name].validate(valid => {
                if (valid) {
                    this.formValidate.user_attr = this.formValidate.user_attr.map(
                        item => {
                            var obj = {};
                            obj["attr_id"] = item;
                            return obj;
                        }
                    );
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
        async get_attributeList() {
            const res = await get_attributeList();
            try {
                if (res.status == 1) {
                    let arr = res.data.date;
                    this.attributeList.push(arr[0]);
                }
            } catch (error) {}
        },
        async get_teacherInfo(id) {
            const res = await get_teacherInfo(id);
            try {
                this.formValidate = res.data.info;
                this.formValidate.teacher_type = 2;
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
                    this.$Message.success("新增助教成功");
                    this.formValidate = {
                        teacher_type: 2,
                        nickname: "",
                        mobile: "",
                        avatar: "",
                        sex: "",
                        intro: ""
                    };
                    this.$router.push({ name: "assist" });
                }
            } catch (error) {}
        },
        async update_teacher(params) {
            const res = await update_teacher(params);
            try {
                if (res.status == 1) {
                    this.$Message.success("更新助教信息成功");
                    this.formValidate = {
                        teacher_type: 2,
                        nickname: "",
                        mobile: "",
                        avatar: "",
                        sex: "",
                        intro: ""
                    };
                    this.$router.push({ name: "assist" });
                }
            } catch (error) {}
        }
    }
};
</script>
