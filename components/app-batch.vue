<template>
  <div class="app-batch">
    <app-header :title="title" :isShowBack="true"></app-header>

    <div class="row-title">{{opt.baseTitle?opt.baseTitle:'基础信息'}}</div>

    <app-form :opt="{form:opt.baseForm}" entry="appDatchBaseForm"></app-form>

    <div class="row-title">{{opt.batchTitle?opt.batchTitle:'批量信息'}}</div>

    <div class="list">
      <div class="item" v-for="(item, index) in list" :key="item.entry">
        <div class="list_item-number" v-if="opt.showNumber">{{index + 1}}.</div>
        <app-form
          :opt="item.opt"
          :entry="item.entry"
          :isFor="true"
          ref="appForm"
          class="list_app-form"
        ></app-form>
        <div class="buts">
          <el-button type="primary" icon="el-icon-plus" @click="addItem(index)" circle></el-button>
          <el-button type="danger" icon="el-icon-minus" @click="delItem(index)" circle></el-button>
        </div>
      </div>
    </div>

    <footer class="action-but">
      <div v-for="item in buttons" :key="item.name">
        <el-button
          :type="item.type?item.type:'primary'"
          :icon="item.icon"
          @click="onAction(item.cb, item.isNotValidate)"
        >{{item.name}}</el-button>
      </div>
    </footer>
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
  data: function() {
    return {
      title: "",
      buttons: [],
      list: []
    };
  },
  activated: function() {
    console.log("app-batch activated!", this.$props);
    this.title = this.$props.opt.title;
    this.buttons = this.$props.opt.buttons;
    this.type = this.$route.params.type;
    this.init();
  },
  watch: {
    opt: {
      handler(newName, oldName) {
        if (oldName) {
          this.init();
        }
      },
      immediate: true,
      deep: true
    }
  },
  methods: {
    init() {
      let _list = [];
      for (let i = 0; i < 5; i++) {
        _list.push({
          entry: Math.random().toString(),
          opt: {
            form: this.$props.opt.batchForm
          }
        });
      }
      this.list = _list;
    },
    //底部操作按钮监听
    onAction(cb, isNotValidate) {
      let _this = this;
      let cbData = []; //总返回数据
      let buildingData = {}; //楼栋信息数据
      let task = 0;
      this.$tel.call("appDatchBaseForm", (refForm, formData) => {
        refForm.validate(valid => {
          if (valid) {
            task++;
            buildingData = formData;
            for (let i = 0; i < this.list.length; i++) {
              const item = this.list[i];
              this.$tel.call(item.entry, (refForm, formData) => {
                refForm.validate(valid => {
                  if (valid) {
                    task++;
                    // 完成深浅拷贝，解决数据串通。
                    var concatObeject = JSON.parse(
                      JSON.stringify([Object.assign(buildingData, formData)])
                    )[0];
                    cbData.push(concatObeject);
                    if (task == this.list.length + 1) {
                      cb(cbData);
                    }
                  }
                });
              });
            }
          }
        });
      });
    },
    addItem(idx) {
      console.log(idx);
      if (this.list.length == 20) {
        this.$message({
          showClose: true,
          message: "最多添加至20项",
          type: "warning"
        });
      } else {
        this.list.splice(idx + 1, 0, {
          entry: Math.random().toString(),
          opt: {
            form: this.$props.opt.batchForm
          }
        });
        this.$nextTick(() => {
          this.$refs.appForm[idx + 1]["form"] = JSON.parse(
            JSON.stringify(this.$refs.appForm[idx]["form"])
          );
        });
      }
    },
    delItem(idx) {
      console.log(idx);
      if (this.list.length == 1) {
        this.$message({
          showClose: true,
          message: "至少保留1项",
          type: "warning"
        });
      } else {
        this.list.splice(idx, 1);
      }
    }
  }
};
</script>
<style lang="scss">
.app-batch {
  .row-title {
    margin: 0 auto;
    padding-bottom: 6px;
    margin-top: 10px;
    margin-bottom: 15px;
    max-width: 1200px;
    color: #606266;
    font-size: 16px;
    border-bottom: solid 1px #e4e7ed;
  }
  .el-form {
    max-width: 1200px !important;
  }
  .list_app-form .el-form {
    position: relative;
    left: -50px;
    display: flex;
    justify-content: left;
    flex-direction: row;
    flex-wrap: wrap;
  }

  .el-form:after {
    content: "";
    display: block;
    clear: both;
  }

  .list .item-box-def {
    float: left;
    width: 23%;
  }

  .item {
    position: relative;
    margin: 0 auto;
    max-width: 60% !important;
    .buts {
      position: absolute;
      top: 20px;
      right: -50px;
    }
  }
  .action-but {
    padding: 0;
  }
  .list_item-number {
    position: relative;
    top: 30px;
    color: #666;
  }
}
</style>