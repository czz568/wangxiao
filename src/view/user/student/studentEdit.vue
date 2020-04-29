
<template>
    <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="120">
        <div class="studentEdit">
            <div class="title">基本信息 —— 学员</div>
        </div>
        <FormItem label="学生姓名" prop="nickname">
            <Input v-model="formValidate.nickname" :maxlength="15" placeholder="请输入名称，最多可添加15个字" style="width:250px"></Input>
            <span>{{formValidate.nickname.length}}/15</span>
        </FormItem>
        <FormItem label="学生手机号" prop="mobile">
            <Input v-model="formValidate.mobile" placeholder="请输入合法的手机号" style="width:250px"></Input>
        </FormItem>
        <FormItem label="学生属性" prop="user_attr">
            <Treeselect style="width:300px" :normalizer="normalizer" valueConsistsOf='LEAF_PRIORITY' v-model="formValidate.user_attr" :multiple="false" :options="attributeList" />
        </FormItem>
        <FormItem label="学员头像" prop="avatar">
            <div class="upload-avatar-box">
                <div class="avatar-wrap" v-if="formValidate.avatar">
                    <img class="avatar" :src="formValidate.avatar" alt="">
                </div>
                <UploadComponents type="image" @successFun="successFun" style="width:100%">
                    <span style="color:#ccc">300*300像素或1:1，支持jpg、jpeg、png,小于5M</span>
                </UploadComponents>
            </div>
        </FormItem>
        <FormItem label="学员性别" prop="sex">
            <Select v-model="formValidate.sex" placeholder="请选择" style="width:100px">
                <Option :value="1">男</Option>
                <Option :value="2">女</Option>
                <Option :value="3">未知</Option>
            </Select>
        </FormItem>
        <FormItem label="出生日期" prop="birthday">
            <DatePicker :value="formValidate.birthday" type="date" format="yyyy-MM-dd" placeholder="请选择" style="width:280px" @on-change="changeDate"></DatePicker>
        </FormItem>
        <FormItem label="所在城市">
            <Select v-model="formValidate.province_id" placeholder="请选择省" style="width:100px" @on-change="selectProvince">
                <Option :value="item.id" v-for="item in provinceList" :key="item.id">{{item.name}}</Option>
            </Select>
            <Select v-model="formValidate.city_id" placeholder="请选择市" style="width:100px;margin:0 20px" @on-change="selectCity">
                <Option :value="item.id" v-for="item in cityList" :key="item.id">{{item.name}}</Option>
            </Select>
            <Select v-model="formValidate.district_id" placeholder="请选择区" style="width:100px" @on-change="selectDistrict">
                <Option :value="item.id" v-for="item in districtList" :key="item.id">{{item.name}}</Option>
            </Select>
        </FormItem>
        <FormItem>
            <Button style="width:100px" type="primary" size="large" @click="handleSubmit('formValidate')">保存</Button>
            <Button style="width:100px;margin-left:20px" size="large" @click="$router.go(-1)">返回</Button>
        </FormItem>
    </Form>
</template>

<script>
import { create_stud, get_studInfo, update_stud } from "@/api/student";
import { get_area, get_qiniuToken } from "@/api/common";
import { get_attributeList } from "@/api/attribute";
import UploadComponents from "@/components/upload/upload";
export default {
    name: "studentEdit",
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
            uploadParams: {
                url: "",
                uptoken: ""
            },
            provinceList: [], // 省列表
            cityList: [], // 省列表
            districtList: [], // 区列表
            formValidate: {
                nickname: "",
                mobile: "",
                avatar: "", //
                sex: "",
                birthday: "",
                province_id: "",
                city_id: "",
                district_id: "",
                desc: "",
                user_attr: null
            },
            ruleValidate: {
                nickname: [
                    {
                        required: true,
                        message: "学生姓名不能为空",
                        trigger: "blur"
                    }
                ],
                mobile: [
                    {
                        required: true,
                        message: "学生手机号不能为空",
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
                ]
            }
        };
    },
    mounted() {
        this.get_attributeList();
        this.get_area(0, "provinceList"); // 0 获取省列表
        if (this.$route.query.id) {
            this.get_studInfo(this.$route.query.id);
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
                    let obj = {};
                    obj["attr_id"] = this.formValidate.user_attr;
                    this.formValidate.user_attr = [obj];
                    if (this.$route.query.id) {
                        // 修改
                        this.formValidate.id = this.$route.query.id;
                        this.update_stud(this.formValidate);
                    } else {
                        // 新增
                        this.formValidate.password = "123456";
                        this.create_stud(this.formValidate);
                    }
                } else {
                    this.$Message.error("请完善信息");
                }
            });
        },
        selectProvince(provinceId) {
            this.formValidate.province_id = provinceId;
            this.districtList = []; // 省改变时重置区数据
            this.get_area(provinceId, "cityList");
        },
        selectCity(cityId) {
            this.formValidate.city_id = cityId;
            this.get_area(cityId, "districtList");
        },
        selectDistrict(districtId) {
            this.formValidate.district_id = districtId;
        },
        changeDate(time) {
            this.formValidate.birthday = time;
        },
        async get_studInfo(id) {
            const res = await get_studInfo(id);
            try {
                this.formValidate = res.data.info
                this.formValidate.attr.forEach(item => (this.formValidate.user_attr = item.attr_id));
                this.get_area(this.formValidate.province_id, "cityList");
                this.get_area(this.formValidate.city_id, "districtList");
            } catch (error) {}
        },
        async create_stud(params) {
            const res = await create_stud(params);
            try {
                if (res.status == 1) {
                    this.$Message.success("新增学员成功");
                    this.formValidate = {
                        nickname: "",
                        mobile: "",
                        avatar: "",
                        sex: "",
                        birthday: "",
                        province_id: "",
                        city_id: "",
                        district_id: "",
                        desc: "",
                        user_attr: null
                    };
                    this.$router.push({ name: "student" });
                }
            } catch (error) {}
        },
        async update_stud(params) {
            const res = await update_stud(params);
            try {
                if (res.status == 1) {
                    this.$Message.success("更新学生信息成功");
                    this.formValidate = {
                        nickname: "",
                        mobile: "",
                        avatar: "",
                        sex: "",
                        birthday: "",
                        province_id: "",
                        city_id: "",
                        district_id: "",
                        desc: "",
                        password: "",
                        user_attr: []
                    };
                    this.$router.push({ name: "student" });
                }
            } catch (error) {}
        },
        async get_attributeList() {
            const res = await get_attributeList();
            try {
                if (res.status == 1) {
                    let arr = res.data.date;
                    this.attributeList = []
                    this.attributeList.push(arr[0]);
                }
            } catch (error) {}
        },
        async get_area(id, type) {
            const res = await get_area(id);
            try {
                if (type === "provinceList") {
                    this.provinceList = res.data.area;
                } else if (type === "cityList") {
                    this.cityList = res.data.area;
                    console.log(id)
                    // console.log(this.formValidate.city_id)
                } else if (type === "districtList") {
                    this.districtList = res.data.area;
                }
            } catch (error) {
                console.log(error);
            }
        }
    }
};
</script>
