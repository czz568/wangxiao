<template>
    <div>
        <Form
            ref="submitParams"
            :model="submitParams"
            :rules="submitParamsRules"
            :label-width="labelWidth"
            style="text-align:left;"
        >
            <customeForm :formItemList="formItemList" :submitParams="submitParams"></customeForm>
        </Form>
    </div>
</template>

<script>
import customeForm from "./customeForm";
export default {
    components: {
        customeForm
    },
    props: {
        labelWidth: {
            default: 200,
            type: Number
        },
        formItemList: {
            type: Array,
            default: () => {
                return [];
            }
        },
        submitParams: {
            type: Object,
            default: () => {
                return {};
            }
        },
        submitParamsRules: {
            type: Object,
            default: () => {
                return {};
            }
        }
    },
    data() {
        return {};
    }
};
</script>

<style>
</style>