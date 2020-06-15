<template>
  <div class="app-detail">
    <app-header v-if="title" :title="title" :isShowBack="true"></app-header>

    <div class="app-detail__subTitle" v-if="subTitle">{{subTitle}}</div>

    <app-form :opt="opt" :entry="entryName">
      <template v-for="(item) in slotArray" :slot="item">
        <slot :name="item"></slot>
      </template>
    </app-form>

    <footer class="action-but clearfix">
      <div v-for="item in buttons" :key="item.name" class="action-but-item">
        <el-button
          v-if="item.show.indexOf(type) != -1"
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
      subTitle: "",
      buttons: [],
      type: "",
      slotArray: [], // 插槽类型数据
      entryName: "appDetailForm" + new Date().getTime()
    };
  },
  activated: function() {
    //console.log("app-detail activated", this.$props);
    if (this.$props.opt.tit) {
      this.title = [
        "添加" + this.$props.opt.tit,
        "编辑" + this.$props.opt.tit,
        this.$props.opt.tit + "详情"
      ][
        {
          add: 0,
          edit: 1,
          show: 2
        }[this.$route.params.type]
      ];
    } else if (this.$props.opt.title) {
      this.title = this.$props.opt.title;
    }
    if (this.$props.opt.subTitle) {
      this.subTitle = this.$props.opt.subTitle;
    }
    this.slotArray = [];
    this.$props.opt.form.forEach(item => {
      if (item.type == "slot") {
        this.slotArray.push(item.opt.slotName);
      }
    });
    this.buttons = this.$props.opt.buttons;
    this.type = this.$route.params.type;
  },
  methods: {
    //底部操作按钮监听
    onAction(cb, isNotValidate) {
      this.$tel.call(this.entryName, (refForm, formData) => {
        if (isNotValidate) {
          cb(formData);
        } else {
          refForm.validate(valid => {
            if (valid) {
              cb(formData);
            }
          });
        }
      });
    }
  }
};
</script>
<style lang="scss">
.app-detail {
  .title {
    margin-left: 6px;
    font-size: 18px;
    color: #303133;
  }

  .action-but {
    padding-left: 0;
    margin: auto;
    overflow: hidden;
    text-align: center;
  }

  .action-but-item {
    margin-right: 20px;
    display: inline-block;
  }
}

.app-detail__subTitle {
  padding: 5px;
  margin-bottom: 20px;
  font-size: 15px;
  background-color: #ecf5ff;
  color: #666;
}
</style>