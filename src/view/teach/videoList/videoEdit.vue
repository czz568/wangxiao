
<template>
    <!-- 新增/编辑视频 -->
    <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="180">
        <div class="videoEdit">
            <div class="title">基本信息 —— 视频</div>
        </div>
        <FormItem label="视频名称" prop="title">
            <Input v-model="formValidate.title" :maxlength="30" placeholder="请输入名称，最多可添加30个字" style="width:250px"></Input>
            <span>{{formValidate.title.length}}/30</span>
        </FormItem>
        <FormItem label="难度级别" prop="difficult_level">
            <Rate v-model="formValidate.difficult_level" />
        </FormItem>
        <FormItem label="视频属性" prop="course_attr">
            <Treeselect style="width:300px" :normalizer="normalizer" valueConsistsOf='LEAF_PRIORITY' v-model="formValidate.course_attr" :multiple="true" :options="attributeList" />
        </FormItem>
        <FormItem label="视频介绍">
            <Input v-model="formValidate.intro" type="textarea" placeholder="请输入视频介绍" style="width:300px"></Input>
        </FormItem>
        <FormItem label="视频封面" prop="cover_img">
            <div class="upload-avatar-box">
                <div class="avatar-wrap" v-if="formValidate.cover_img">
                    <img class="avatar" :src="formValidate.cover_img" alt="">
                </div>
                <UploadComponents type="image" @successFun="successFun_img" style="width:100%">
                    <span style="color:#ccc">*尺寸为416 * 244或1.7:1, 请上传jpg, png格式的图片, 建议图片大小不超过2MB。</span>
                </UploadComponents>
            </div>
        </FormItem>
        <FormItem label="视频文件" prop="file_url">
            <div class="upload-avatar-box">
                <div class="avatar-wrap" style="width:400px" v-if="formValidate.file_url" @click="view_videoClick">
                    <video class="avatar" :src="formValidate.file_url"></video>
                </div>
                <UploadComponents type="video" @successFun="successFun_video" style="width:100%">
                    <span style="color:#ccc">请上传视频, 建议视频大小不超过100MB。</span>
                </UploadComponents>
                <Modal v-model="video_view" width="800" title="视频预览">
                    <div style="text-align:center">
                        <video v-if="viewUrl" :src="viewUrl" controls height="300"></video>
                    </div>
                </Modal>
            </div>
        </FormItem>
        <FormItem style="text-align:center">
            <Button style="width:100px" type="primary" size="large" @click="handleSubmit('formValidate')">保存并返回</Button>
            <Button style="width:100px;margin-left:20px" size="large" @click="$router.go(-1)">返回</Button>
        </FormItem>
    </Form>
</template>

<script>
import {
    create_video,
    get_videoInfo,
    update_video,
    get_video_packList
} from "@/api/videoList";
import { get_attributeList } from "@/api/attribute";
import UploadComponents from "@/components/upload/upload";

export default {
    name: "videoEdit",
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
            video_view: false,
            viewUrl: "",
            attributeList: [], // 视频属性列表
            formValidate: {
                title: "", // 视频名称
                file_url: "",
                difficult_level: 0, // 难度等级
                cover_img: "", // 封面
                cover_icon: "",
                intro: "", // 视频详情
                course_attr: null // 视频属性
            },
            ruleValidate: {
                title: [
                    {
                        required: true,
                        message: "视频名称不能为空",
                        trigger: "blur"
                    }
                ],
                difficult_level: [
                    {
                        required: true,
                        trigger: "change",
                        validator: (rule, value, callback) => {
                            if (this.formValidate.difficult_level == 0) {
                                callback(new Error("请选择难度级别"));
                            } else {
                                callback();
                            }
                        }
                    }
                ],
                course_attr: [
                    {
                        required: true,
                        type: "array",
                        trigger: "change",
                        validator: (rule, value, callback) => {
                            if (this.formValidate.course_attr.length == 0) {
                                callback(new Error("请选择视频属性"));
                            } else {
                                callback();
                            }
                        }
                    }
                ],
                cover_img: [
                    {
                        required: true,
                        type: "object",
                        trigger: "change",
                        validator: (rule, value, callback) => {
                            if (!this.formValidate.cover_img) {
                                callback(new Error("请上传封面！"));
                            } else {
                                callback();
                            }
                        }
                    }
                ],
                file_url: [
                    {
                        required: true,
                        trigger: "change",
                        validator: (rule, value, callback) => {
                            if (!this.formValidate.file_url) {
                                callback(new Error("请上传视频！"));
                            } else {
                                callback();
                            }
                        }
                    }
                ]
            }
        };
    },
    mounted() {
        this.get_attributeList();
        if (this.$route.query.id) {
            this.get_videoInfo(this.$route.query.id);
        }
    },
    methods: {
        successFun_img(url) {
            this.formValidate.cover_img = url;
            this.$refs.formValidate.validateField("cover_img"); // 重新校验
        },
        successFun_video(url) {
            this.formValidate.file_url = url;
            this.$refs.formValidate.validateField("file_url"); // 重新校验
        },
        view_videoClick() {
            // 预览
            this.video_view = true;
            this.viewUrl = this.formValidate.file_url;
        },
        handleSubmit(name) {
            // 保存
            this.$refs[name].validate(valid => {
                if (valid) {
                    if (
                        this.formValidate.course_attr &&
                        this.formValidate.course_attr.length == 0
                    ) {
                        this.$Message.warning("请选择视频属性");
                        return;
                    } else {
                        this.formValidate.course_attr = this.formValidate.course_attr.map(
                            item => {
                                var obj = {};
                                obj["attr_id"] = item;
                                return obj;
                            }
                        );
                    }
                    if (this.$route.query.id) {
                        // 修改
                        this.update_video(this.formValidate);
                    } else {
                        // 新增
                        this.create_video(this.formValidate);
                    }
                } else {
                    this.$Message.error("请完善信息");
                }
            });
        },
        async get_videoInfo(id) {
            const res = await get_videoInfo(id);
            try {
                if (res.status == 1) {
                    this.formValidate = res.data.info;
                    this.formValidate.course_attr = this.formValidate.attr.map(
                        item => item.attr_id
                    );
                }
            } catch (error) {}
        },
        async create_video(params) {
            const res = await create_video(params);
            try {
                if (res.status == 1) {
                    this.$Message.success("新增视频成功");
                    this.$router.push({ name: "videoList" });
                }
            } catch (error) {}
        },
        async update_video(params) {
            const res = await update_video(params);
            try {
                if (res.status == 1) {
                    this.$Message.success("更新视频成功");
                    this.$router.push({ name: "videoList" });
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
        }
    }
};
</script>
<style >
/* common.css */
.menu-style .ivu-tooltip-inner {
    max-width: 400px;
}
</style>

<style lang="less" scoped>
.teacher-table-wrap {
    overflow-y: auto;
    .label {
        margin-right: 20px;
    }
    .teacher-table {
        margin-top: 20px;
    }
    .page {
        .f-left {
            margin-left: 20px;
        }
    }
}
</style>
