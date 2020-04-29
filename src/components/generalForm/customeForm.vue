
<template>
  <div class="formPanel">
    <FormItem v-for="(item) in datas" :key="item.prop" :label="item.label" :rules="item.rules" :prop="item.prop" :class="item.class">
      <i-input v-if="item.type === 'input'" v-model.trim="formModel[item.model]"  :type="item.inputType" :disabled="item.disabled" :placeholder="item.placeholder" :size="item.size" />
      <RadioGroup v-if="item.type === 'radio'" v-model="formModel[item.model]">
        <Radio v-for="(e, i) in item.children" :key="i" :label="e.label">
          {{ e.text }}
        </Radio>
        <slot v-if="item.slot" :name="item.slot" />
      </RadioGroup>
      <CheckboxGroup v-if="item.type === 'checkbox'" v-model="formModel[item.model]" class="mycheck-group">
        <Checkbox v-for="e in item.children" :key="e.label" :label="e.label" :disabled="e.disabled">
          {{ e.text }}
        </Checkbox>
      </CheckboxGroup>
      <Checkbox v-if="item.type === 'check'" v-model="formModel[item.model]" :label="item.checklabel" :disabled="e.disabled">
        {{ e.text }}
        <slot v-if="item.slot" :name="item.slot" />
      </Checkbox>
      <DatePicker v-if="item.type === 'datePicker'" v-model="formModel[item.model]" style="width:100%;" :value="formModel[item.model]" :type="item.pickertype ? item.pickertype : 'date'" :options="item.options" :transfer="item.transfer" :format ="item.format" :size="item.size" :placeholder="item.placeholder" />
      <i-input v-if="item.type === 'textarea'" v-model="formModel[item.model]" :autosize="item.autosize"  :placeholder="item.placeholder"  type="textarea" :size="item.size" />
      <Select v-if="item.type === 'select'" v-model="formModel[item.model]" :disabled="item.disabled" :filterable="item.filterable" :size="item.size" :placeholder="item.placeholder">
        <Option v-for="e in item.children" :key="e.label" :value="e.label">
          {{ e.text }}
        </Option>
      </Select>
      <label v-if="item.type === 'text'" :size="item.size">
        {{ item.text }} <slot v-if="item.slot" :name="item.slot" :params="item.params" />
      </label>
      <InputNumber
        v-if="item.type==='number'"
        v-model="formModel[item.model]"
        style="width:100%;"
        :formatter="value => `${value}`.replace(/(?=(?!\b)(\d{3})+\.)/g,',')"
        :parser="value => value.replace(/$s?|(,*)/g, '')" :precision="item.precision" :min="item.min"
        :max="item.max"
        :disabled="item.disabled"
        :placeholder="item.placeholder"
        :size="item.size" />
      <Input v-if="item.type==='number2'" v-model="formModel[item.model]" :maxlength="16" placeholder="" type="text" @on-focus="inputFocus(item.model)" />
      
      <div v-if="item.type === 'inputSlot'" style="postion:relative;">
        <i-input v-model="formModel[item.model]" :type="item.inputType" :disabled="item.disabled" :placeholder="item.placeholder" :size="item.size" />
        <slot v-if="item.slot" :name="item.slot" :params="item.params" />
      </div>
    </FormItem>
  </div>
</template>
<script>
export default {
  name: 'CusForm',
  props: {
    datas: {
      type: Array,
      required: true
    },
    formModel: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      left: ''
    }
  },
  computed: {
  },
  watch: {
  },
  mounted () {
    // this.left = this.toLeft !== '1' ? this.toLeft : (this.inline ? '0' : '200')
  },
  methods: {
    inputFocus (name) {
      this.$emit('inputFocus', name)
    }
  }
}
</script>
<style lang="less">
.formPanel {
 
   .ui-form-item {
     margin-bottom: 24px;
 
     .ui-form-item-content {
       width: 264px;
     }
 
    &.optionBtn {
      margin: -15px 0 0 0;
    }
 
    &.contractName{
      height: 82px;
      margin-bottom: 15px;
    }
 
     &.middleSize {
 
       .ui-form-item-content {
         width: 429px;
 
         textarea {
           height: 66px;
         }
       }
     }
 
     &.lineMiddleSize {
       .ui-form-item-content {
         width: 300px;
 
         textarea {
           height: 145px;
         }
       }
     }
   }
   .ui-select {
     width:264px;
   }
}
.form-wrap {
 
  .ivu-cascader-rel {
    width: 18.75rem;
  }
 
  .phone-wrap {
 
    .phone-zone {
      width: 3.75rem;
 
      .ivu-input {
        width: 3.75rem !important;
      }
    }
 
    .phone-num {
      width: 14.062rem;
 
      .ivu-input {
        width: 14.062rem !important;
      }
    }
  }
}
 
.mycheck-group {
  overflow: hidden;
 
  .ivu-checkbox-wrapper {
    display: flex;
    float: left;
    align-items: center;
    margin-right: 0;
    min-width: 20%;
    font-size: 14px;
 
    > span {
      margin-right: 9px;
    }
  }
}
</style>
<style lang="less" scoped>
.form-wrap {
 
  &.formvertical {
 
    .btn-wrap {
      margin-left: 8.125rem;
    }
  }
  margin-top: 12px;
 
  .btn-wrap {
    display: inline-block;
    margin-top: 4px;
  }
 
  .btncenter {
    display: flex;
    justify-content: center;
    margin-top: 1.875rem;
  }
}
</style>