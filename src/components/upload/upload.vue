<template>
    <div>
        <Upload
            multiple
            :accept="accept"
            :action="action"
            :data="uploadParams"
            :show-upload-list="type == 'video'"
            :default-file-list="[]"
            :on-success="handleSuccess"
            :before-upload="beforeUpload"
        >
            <Button icon="ios-cloud-upload-outline">点击上传</Button>
            <!-- 默认插槽 -->
            <slot></slot>
        </Upload>
    </div>
</template>

<script>
import { get_qiniuToken } from "@/api/common";

export default {
    props: {
        type: {
            type: String,
            required: true
        }
    },
    data() {
        return {
            action: "https://upload.qiniup.com",
            uploadParams: {
                token: "",
                key: ""
            },
            domain: "", // cdn加速域名 用来访问七牛上传后的地址
            uploadUrl: "" // 上传成功后的完整地址
        };
    },
    computed: {
        accept() {
            if (this.type == "image") {
                return "image/*";
            } else if (this.type == "video") {
                return "video/*";
            } else {
                return "file/*";
            }
        }
    },
    methods: {
        async beforeUpload(request) {
            await get_qiniuToken(this.type).then(res => {
                if (res.status == 1) {
                    // **注意这里的参数必须通过属性赋值，如果直接修改整个uploadParams是无效的。**
                    this.uploadParams.token = res.data.data.uptoken;
                    this.uploadParams.key = request.name;
                    this.domain = `http://${res.data.data.url}/`;
                }
            });
            // 七牛response hash key的值自定义，后面如果需要浏览或者下载都需要这个地址，如果key不定义，那么七牛生成的key === hash的值
            // 整个上传肯定是一个组件，所以需要将值反馈给父界面
            // this.$emit('completeFun', [request])
        },
        handleSuccess(request, file, list) {
            // 这里就能拿到七牛返回的response信息 hash, key然后拼接服务器地址，就可以访问了
            this.uploadUrl = this.domain + request.key;
            console.log(this.uploadUrl, "获取图片地址");
            //   this.$emit('successFun', this.uploadUrl [file, list, this.uploadUrl])
            this.$emit("successFun", this.uploadUrl, this.uploadParams.key);
        },
    }
};
</script>
