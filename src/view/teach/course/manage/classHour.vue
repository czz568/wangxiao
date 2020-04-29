<template>
<!-- 课时列表 -->
<div class="classHour">
    <div class="tree-item">
        <div class="tree-item-content" v-show="row.children.length > 0" span="8" v-for="item in row.children" :key="item.course_item_id">
            <div class="name">{{ item.name }}</div>
            <div class="sort">{{ item.sort }}</div>
            <div class="class-time">{{ item.start_play }} - {{item.end_play}}</div>
            <div class="action">
                <Button type="text" size="small" class="btn-text" @click="sortClass(item)">课时排序</Button>
                <span>-</span>
                <Button type="text" size="small" class="btn-text" @click="editClass(row,item)">编辑</Button>
                <span>-</span>
                <Button type="text" size="small" class="btn-text" @click="deletClass(item)">删除</Button>
            </div>
        </div>
    </div>
     <Modal  v-model="sortModal" title="课时排序" footer-hide>
        <Form  :model="sortParams" :label-width="120" inline>
            <FormItem prop="sort" label="将课时移动到第">
                <InputNumber :min="1" v-model="sortParams.sort"></InputNumber>
                <span>位</span>
            </FormItem>
            <FormItem>
                <Button type="primary" @click="saveSort">保存</Button>
            </FormItem>
        </Form>
    </Modal>
</div>
</template>
<script>
import { sort_class, delete_class } from '@/api/classHour'
export default {
  props: ['row', 'customHandle'],
  data () {
    return {
      sortModal: false,
      sortParams: {
        id: '',
        sort: null
      }
    }
  },
  methods: {
    sortClass (item) { // 排序
      this.sortModal = true
      this.sortParams.id = item.course_item_id
      this.sortParams.sort = item.sort
    },
    deletClass (item) {
      this.$Modal.confirm({
        title: '提示',
        content: '<p>删除该课时后，学员将无法学习此课时，是否确认？</p>',
        onOk: () => {
          this.delete_class({ id: item.course_item_id })
        }
      })
    },
    editClass (row, item) {
      this.$router.push({ name: 'classHourEdit', query: { course_id: row.course_id, id: item.course_item_id } })
    },
    saveSort () { // 保存
      this.sort_class(this.sortParams)
    },
    async sort_class (params) {
      const res = await sort_class(params)
      try {
        if (res.status == 1) {
          this.$Message.success('保存成功')
          this.sortModal = false
          this.$emit('customHandle')
        }
      } catch (error) {
        console.log(error)
      }
    },
    async delete_class (params) {
      const res = await delete_class(params)
      try {
        if (res.status == 1) {
          this.$Message.success('删除成功')
          this.$emit('customHandle')
        }
      } catch (error) {
        console.log(error)
      }
    }
  }

}
</script>
<style lang="less" scoped>
.tree-item-content {
    padding-left: 35px;
    height: 40px;
    display: flex;
    align-items: center;
    padding: 0 15px;
    background-color: transparent;
    transition: all .25s;
    display: flex;
    .name {
        flex: 2;
    }
    .class-time {
        flex:2;
        text-align: center;
    }
    .sort {
        flex: 1;
    }
    .action {
        flex: 2;
        text-align: right;
    }
}
</style>
