<template>
  <div class="app-tree-list">
    <app-header :title="title" :isShowRefresh="false" :isShowBack="false"></app-header>

    <el-tree
      :data="treeListData"
      v-if="treeListData.length"
      highlight-current
      node-key="id"
      default-expand-all
      :props="treeProps"
    >
      <div class="app-tree-list__node" slot-scope="{ node, data }">
        <span>{{ node.label }}</span>
        <div class="app-tree-list__action">
          <el-button type="text" size="mini" @click="() => append(data)">添加子集</el-button>
          <el-button type="text" size="mini" @click="() => remove(node, data)">删除元素</el-button>
        </div>
      </div>
    </el-tree>
  </div>
</template>

<script>
export default {
  props: {
    opt: {
      type: Object,
      default: function() {
        return {};
      }
    }
  },
  data() {
    return {
      title: "",
      treeListData: [],
      treeProps: {
        children: "children",
        label: "label"
      }
    };
  },
  activated() {
    console.log("app-tree-list activated!", this.$props);
    let _this = this;
    if (typeof this.$props.opt.get == "function") {
      this.$props.opt.get({
        cb(data) {
          _this.treeListData = data.data;
        }
      });
    }
  },
  mounted() {
    this.title = this.$props.opt.title;
  },
  methods: {}
};
</script>
<style lang="scss">
.app-tree-list {

    .app-tree-list__node {
        width: 100%;
    }

    .app-tree-list__action {
        float: right;
    }
}
</style>
