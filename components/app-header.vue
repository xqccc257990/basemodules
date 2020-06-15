<template>
  <div class="app-header">
    <el-row>
      <el-col class="title-bar" :span="24">
        <el-button class="back" v-if="isShowBack" icon="el-icon-back" circle @click="$back();"></el-button>
        <span class="title">{{title}}</span>
        <el-button
          class="refresh"
          v-if="isShowRefresh"
          icon="el-icon-refresh"
          circle
          @click="onRefresh"
        ></el-button>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: function() {
        return "";
      }
    },
    isShowRefresh: {
      type: Boolean,
      default: function() {
        return false;
      }
    },
    isShowBack: {
      type: Boolean,
      default: function() {
        return false;
      }
    }
  },
  activated() {
    //console.log("app-header activated!", this.$props);
  },
  methods: {
    onRefresh() {
      this.$emit("refresh");
    }
  }
};
</script>
<style scoped lang="scss">
.app-header {
  .el-row {
    margin-bottom: 10px;
    line-height: 30px;
  }
  .title-bar {
    margin-bottom: 20px;
    height: 40px;
    line-height: 40px;
    .back {
      margin-right: 6px;
    }
    .title {
      font-size: 18px;
      color: #303133;
    }
    .refresh {
      float: right;
    }
  }
}
</style>
