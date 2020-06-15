<template>
  <div class="app-tree">
    <app-header :title="title" :isShowRefresh="false" :isShowBack="false"></app-header>

    <el-row :gutter="20">
      <el-col :span="12">
        <el-container class="tree-box">
          <el-header class="box-header" v-show="treeData.length && buttons.length">
            <el-button
              v-for="item in buttons"
              :key="item.id"
              @click="onButton(item)"
              size="medium"
              :icon="item.icon?item.icon:item.type!=undefined?'el-icon-'+['plus', 'edit', 'delete'][item.type]:'question'"
              :type="item.style?item.style:item.type!=undefined?['primary', 'success', 'danger'][item.type]:'primary'"
            >
              {{item.name?item.name:item.type!=undefined?['添加',
              '编辑',
              '删除'][item.type]:'未命名'}}
            </el-button>
            <el-button class="refresh" icon="el-icon-refresh" circle></el-button>
          </el-header>
          <el-main style="height: 500px;overflow: auto;">
            <el-tree
              :data="treeData"
              v-if="treeData.length"
              highlight-current
              node-key="id"
              @current-change="onCurrentChange"
              default-expand-all
              :props="{
                children: 'children',
                label: 'label'
              }"
            ></el-tree>
            <app-list :opt="opt.table" v-if="opt.table" ref="appList"></app-list>
          </el-main>
        </el-container>
      </el-col>
      <el-col :span="12">
        <slot name="info"></slot>
      </el-col>
    </el-row>
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
      buttons: [],
      multipleSelection: [],
      treeData: [],
      tableData: []
    };
  },
  activated() {
    console.log("app-tree activated!", this.$props);
    var _this = this;
    if (typeof this.$props.opt.get == "function") {
      this.$props.opt.get({
        cb(data) {
          _this.treeData = data;
        }
      });
    }
  },
  deactivated() {
    this.multipleSelection = [];
  },
  mounted() {
    this.title = this.$props.opt.title;
    if (this.$props.opt.buttons) {
      for (let i = 0; i < this.$props.opt.buttons.length; i++) {
        let item = this.$props.opt.buttons[i];
        item.id = Math.random().toString();
      }
      this.buttons = this.$props.opt.buttons;
    }

    if (this.$props.opt.table) {
      for (let i = 0; i < this.$props.opt.table.length; i++) {
        let item = this.$props.opt.tableData[i];
        item.id = Math.random().toString();
      }
      this.tableData = this.$props.opt.tableData;
    }

  },
  methods: {
    onCurrentChange(data, node) {
      console.log(data, node);
      this.multipleSelection = [data];
      if (typeof this.$props.opt.on == "function") {
        this.$props.opt.on(data, node);
      }
    },
    onButton(item) {
      switch (item.type) {
        case 0:
          item.on();
          break;
        case 1:
          if (this.multipleSelection.length > 1) {
            this.$message({
              showClose: true,
              message: "此操作不支持多选",
              type: "warning"
            });
          } else if (this.multipleSelection.length == 0) {
            this.$message({
              showClose: true,
              message: "请选择一项",
              type: "warning"
            });
          } else {
            item.on({
              id: this.multipleSelection[0].id,
              data: this.multipleSelection[0],
              refresh() {
                _this.onRefresh();
              }
            });
          }
          break;
        case 2:
          if (this.multipleSelection.length > 0) {
            this.$confirm("此操作将删除选择项, 是否继续?", "提示", {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              type: "warning"
            })
              .then(() => {
                var ids = [];
                for (let i = 0; i < this.multipleSelection.length; i++) {
                  ids.push(this.multipleSelection[i].id);
                }
                let _this = this;
                item.on({
                  ids: ids,
                  refresh() {
                    _this.onRefresh();
                  }
                });
              })
              .catch(function() {});
          } else {
            this.$message({
              showClose: true,
              message: "最少请选择一项",
              type: "warning"
            });
          }
          break;
        default:
          break;
      }
    },
    initList () {
      this.$refs.appList.get()
    }
  }
};
</script>
<style lang="scss">
.app-tree {
  .box-header {
    position: relative;
    line-height: 60px;
    background-color: #eeeeee;

    .refresh {
      position: absolute;
      top: 10px;
      right: 10px;
    }
  }

  .tree-box,
  .info-box {
    border: solid 1px #dcdfe6;
  }

  .el-tabs__item {
    height: 60px !important;
    line-height: 60px !important;
  }

  .el-tabs__nav-scroll {
    padding: 0 10px;
  }
  .el-tree--highlight-current
    .el-tree-node.is-current
    > .el-tree-node__content {
    background-color: #b3d8ff;
  }

  .el-tabs__content {
    padding: 10px;
    min-height: 360px;
  }
}
</style>
