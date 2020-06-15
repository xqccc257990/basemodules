<template>
  <div class="app-overview">
    <div class="title">
      <span>{{title}}</span>
    </div>
    <div class="table">
      <div v-for="item in list" :key="item.label">
        <el-row class="col">
          <el-col class="label" :span="12">{{item.label}}</el-col>
          <el-col class="value" v-if="item.on" :span="12">
            <span class="link" @click="item.on(item)">{{item.value}}</span>
          </el-col>
          <el-col class="value" v-else :span="12">{{item.value}}</el-col>
        </el-row>
        <el-row class="col" v-if="item.isRow">
          <el-col class="label" :span="12"></el-col>
          <el-col class="value" :span="12"></el-col>
        </el-row>
      </div>
    </div>
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
    list: {
      type: Array,
      default: function() {
        return [];
      }
    }
  },
  activated() {
    console.log("app-overview activated!", this.$props);
  }
};
</script>
<style scoped lang="scss">
.app-overview {
  margin-bottom: 30px;
  max-width: 1200px;
  word-break: break-all;
  .title {
    margin-bottom: 20px;
    border-bottom: solid 1px #e4e7ed;
    text-align: center;

    span {
      position: relative;
      padding: 0 10px;
      top: 10px;
      font-size: 15px;
      font-weight: bold;
      color: #909399;
      background-color: #ffffff;
    }
  }
  .table {
    font-size: 14px;
    color: #606266;
    border-top: solid 1px #e4e7ed;
    border-left: solid 1px #e4e7ed;
    .col {
      float: left;
      width: 50%;

      .value,
      .label {
        padding: 10px;
        height: 60px;
        border-bottom: solid 1px #e4e7ed;
        border-right: solid 1px #e4e7ed;
        overflow: auto;
      }
      .label {
        text-align: right;
        background-color: #ebeef5;
      }
      .link {
        cursor: pointer;
        color: #409eff;
      }
    }
  }
  .table:after {
    content: "";
    display: block;
    clear: both;
  }
}
</style>
