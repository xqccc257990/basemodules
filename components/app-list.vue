<template>
  <div class="app-list">
    <slot name="top"></slot>

    <app-header
      :title="title"
      :isShowRefresh="isShowHeaderRefresh"
      :isShowBack="isShowBack"
      @refresh="onRefresh"
      v-if="title"
    ></app-header>

    <slot name="header"></slot>

    <el-row v-if="searchInps.length != 0">
      <el-col :span="24">
        <el-form :inline="true">
          <el-form-item v-for="item in searchInps" :key="item.key" :label="item.label">
            <el-input
              v-if="!item.type"
              v-model="searchForm[item.key]"
              :disabled="item.disabled"
              :placeholder="'根据'+item.label+'搜索'"
              @keyup.enter.native="onSearch"
              clearable
              @clear="handleClear(item)"
            ></el-input>
            <el-input
              v-else-if="item.type=='number'"
              type="number"
              :disabled="item.disabled"
              v-model="searchForm[item.key]"
              @keyup.enter.native="onSearch"
              :placeholder="'根据'+item.label+'搜索'"
              clearable
            ></el-input>
            <el-select
              v-else-if="item.type=='select'"
              filterable
              v-model="searchForm[item.key]"
              :disabled="item.disabled"
              :placeholder="'根据'+item.label+'搜索'"
              @change="onChangeSelect(item)"
              @clear="handleClear(item)"
              clearable
            >
              <el-option
                v-for="it in item.opt.list"
                :key="it.value"
                :label="it.label"
                :value="it.value"
              ></el-option>
            </el-select>
            <el-date-picker
              v-else-if="item.type=='time-range'"
              v-model="searchForm[item.key]"
              type="datetimerange"
              range-separator="至"
              :disabled="item.disabled"
              :value-format="item.timeType ? item.timeType : 'yyyy-MM-dd HH:mm:ss'"
              :format="item.format ? item.format : item.timeType ? item.timeType : 'yyyy-MM-dd HH:mm:ss'"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            ></el-date-picker>
            <el-date-picker
              v-else-if="item.type=='daterange'"
              v-model="searchForm[item.key]"
              type="daterange"
              :disabled="item.disabled"
              :value-format="item.timeType ? item.timeType : 'yyyy-MM-dd HH:mm:ss'"
              :format="item.format ? item.format : item.timeType ? item.timeType : 'yyyy-MM-dd HH:mm:ss'"
              range-separator="至"
            ></el-date-picker>
            <el-date-picker
              v-else-if="item.type=='datetime'"
              v-model="searchForm[item.key]"
              type="datetime"
              :disabled="item.disabled"
              :value-format="item.timeType ? item.timeType : 'yyyy-MM-dd HH:mm:ss'"
              :format="item.format ? item.format : item.timeType ? item.timeType : 'yyyy-MM-dd HH:mm:ss'"
            ></el-date-picker>
            <el-date-picker
              v-else-if="item.type=='timer-month'"
              v-model="searchForm[item.key]"
              type="monthrange"
              range-separator="至"
              :value-format="item.timeType ? item.timeType : 'yyyy-MM-dd HH:mm:ss'"
              :format="item.timeType ? item.timeType : 'yyyy-MM-dd HH:mm:ss'"
              start-placeholder="开始月份"
              end-placeholder="结束月份"
            ></el-date-picker>
            <el-date-picker
              v-else-if="item.type=='date'"
              v-model="searchForm[item.key]"
              :disabled="item.disabled"
              :value-format="item.timeType ? item.timeType : 'yyyy-MM-dd HH:mm:ss'"
              :format="item.timeType ? item.timeType : 'yyyy-MM-dd HH:mm:ss'"
              type="date"
              :placeholder="'根据'+item.label+'搜索'"
            ></el-date-picker>
            <el-button-group v-else-if="item.type=='btnGroup'">
              <el-button
                v-for="it in item.buts"
                :key="it.label"
                :type="it.type"
                :disabled="item.disabled"
                @click="onSelect(it.timeType)"
              >{{it.label}}</el-button>
            </el-button-group>
            <el-select
              v-else-if="item.type=='select-remote-filterable'"
              v-model="searchForm[item.key]"
              :multiple="item.opt.multiple==false?false:true"
              filterable
              :filter-method="handleSelectRemoteFilterable(item)"
              :placeholder="'请输入'+item.label+'关键词搜索'"
              :loading="item.opt.isLoading"
              clearable
              @change="handleSearchSelectRemoteFilterableChange(item)"
              @focus="handleSelectRemoteFilterableFocus(item)"
              @clear="handleClear(item)"
            >
              <el-option
                v-for="it in item.opt.list"
                :key="it.value"
                :label="it.label"
                :value="it.value"
              ></el-option>
            </el-select>
            <el-select
              v-else-if="item.type=='select'"
              v-model="searchForm[item.key]"
              :placeholder="type!='show'?'请选择'+item.label:''"
              clearable
            >
              <el-option
                v-for="it in item.opt.list"
                :key="it.value"
                :label="it.label"
                :value="it.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button icon="el-icon-search" type="primary" round @click="onSearch">查询</el-button>
          </el-form-item>
          <el-form-item>
            <el-button plain round @click="onSearchReset">重置</el-button>
          </el-form-item>

          <el-button
            class="refresh search-refresh"
            icon="el-icon-refresh"
            v-if="buttons.length == 0"
            circle
            @click="onRefresh"
          ></el-button>
          <div class="custom_button">
            <el-button
              class="custom_button-item"
              v-for="(items,indexs) in opt.custom"
              :key="indexs"
              @click="items.on()"
              size="medium"
            >{{items.label}}</el-button>
          </div>
        </el-form>
      </el-col>
    </el-row>

    <el-row class="buts-bar" v-if="buttons.length != 0">
      <el-col :span="24">
        <el-button
          v-for="item in buttons"
          :key="item.id"
          @click="onButton(item)"
          size="medium"
          :icon="item.icon?item.icon:item.type!=undefined?'el-icon-'+['plus', 'edit', 'delete'][item.type]:'question'"
          :type="item.color?item.color:item.type!=undefined?['primary', 'success', 'danger'][item.type]:'primary'"
        >
          {{item.name?item.name:item.type!=undefined?['添加',
          '编辑',
          '删除'][item.type]:'未命名'}}
        </el-button>
        <el-button class="refresh" icon="el-icon-refresh" circle @click="onRefresh"></el-button>
      </el-col>
    </el-row>

    <div class="table-box">
      <el-table
        class="table-body"
        ref="multipleTable"
        :data="list"
        :empty-text="emptyText"
        @selection-change="handleSelectionChange"
        @row-click="handleRowClick"
        @current-change="clickCurrentChange"
        v-loading="isLoading"
        :highlight-current-row="opt.isShowHighliht"
        :row-class-name="tableRowClassName"
      >
        <el-table-column v-if="!isNotShowSelection" type="selection" width="55"></el-table-column>

        <el-table-column
          v-for="(item, index) in columns"
          :key="item.id"
          :prop="item.key"
          :label="item.label"
          :width="item.width"
          :fixed="item.fixed"
          :align="item.align ? item.align: 'left'"
          :sortable="item.sortable ? item.sortable : false"
        >
          <template slot-scope="scope">
            <a
              class="row-nav"
              v-if="item.on&&index==0&&item.type != 'img'"
              @click="item.on(scope.row)"
            >{{scope.row[item.key]}}</a>
            <a
              class="row-nav-vice"
              v-else-if="item.on&&index!=0&&item.type != 'img'"
              @click="item.on(scope.row)"
            >{{scope.row[item.key]}}</a>
            <el-popover
              trigger="hover"
              placement="top"
              v-else-if="item.opt && item.opt.isUserPopover"
              style="white-space: nowrap;"
            >
              <p>{{scope.row[item.key]}}</p>
              <div
                slot="reference"
                style="text-overflow: ellipsis;overflow: hidden;"
              >{{scope.row[item.key]}}</div>
            </el-popover>
            <div class="row-switch-box" v-else-if="item.type=='switch'">
              <div class="row-switch-but" @click="onSwitch(item, scope.row)"></div>
              <el-switch
                v-model="scope.row[item.key]"
                :active-text="item.opt && item.opt.activeText ? item.opt.activeText : '启用'"
                :inactive-text="item.opt && item.opt.inactiveText ? item.opt.inactiveText : '禁用'"
                active-color="#67C23A"
                inactive-color="#F56C6C"
              ></el-switch>
            </div>
            <div class="row-action-box" v-else-if="item.type=='action' && scope.row[item.key]">
              <span
                class="row-action-but"
                v-for="(action, indexs) in item.opt.list"
                :key="indexs"
                @click="action.on(scope.row)"
                v-show="scope.row[item.key][indexs]"
              >{{action.label}}</span>
            </div>
            <div class="row-action-box" v-else-if="item.type=='action-but'">
              <span
                class="row-action-but"
                v-for="(action, indexs) in item.opt.list"
                :key="indexs"
                @click="action.on(scope.row)"
              >{{action.label}}</span>
            </div>
            <div class="row-img" v-else-if="item.type=='img'">
              <img :src="scope.row[item.key]" @click="item.on(scope.row)" class="table-row-img" />
            </div>
            <div class="row-list" v-else-if="item.type=='list'">
              <span
                v-for="(items,indexs) in scope.row[item.key]"
                :key="indexs"
                :style="items.style ? items.style: ''"
                @click="item.opt.on(items)"
              >{{items.label}}</span>
            </div>
            <div class="row-list-group" v-else-if="item.type=='list-group'">
              <div
                v-for="(items,indexs) in scope.row[item.key]"
                :key="indexs"
                class="row-list-group_item"
              >
                <div
                  v-for="(itmess,indexss) in items"
                  :key="indexss"
                  :style="items[indexss].style ? items[indexss].style: ''"
                  @click="item.opt.on(items[indexss])"
                >{{items[indexss].label}}</div>
              </div>
            </div>
            <div class="row-action-alt" v-else-if="item.type=='action-alt'">
              <span class="active" v-if="!!scope.row[item.key]">{{item.opt.activeText}}</span>
              <span
                class="inactive"
                v-if="!!!scope.row[item.key]"
                @click="item.opt.on(scope.row, item)"
              >{{item.opt.inactiveText}}</span>
            </div>
            <span v-else>{{scope.row[item.key]}}</span>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <el-pagination
      background
      layout="total, sizes, prev, pager, next, jumper"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-sizes="[10, 20, 30, 50, 100]"
      :page-size="limit"
      :total="total"
    ></el-pagination>
  </div>
</template>

<script>
/**
 * 通用表格列表组件
 *
 * 派发回调事件get参数Object:
 * total:列表总数
 * data:列表数据
 *
 * 组件参数opt(Object)：
 * title:标题
 * columns:表头
 * buttons:表格操作
 * search:表格搜索栏
 * isNotShowSelection:是否不显示表格列表多选框，默认false
 * isShowBack:是否显示返回按钮，默认不显示
 *
 * 组件参数opt{表头参数columns(Array)
 * label:表头名称
 * key:字段名称
 * width: 宽度(number)
 * on: 单击回调且高亮显示
 * type: 显示类型
 * opt: 针对不同类型的扩展配置
 *
 * 组件参数opt{表头参数columns{显示类型type(string)
 * switch:开关,默认单击延时限制3秒
 * opt{
 *  on: 单击回调
 *  isNotDelay: 是否不采用延时限制
 *  delayTime: 延时时间，默认3秒
 * }
 *
 */
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
      emptyText: "请等待...",
      columns: [],
      list: [],
      buttons: [],
      searchInps: [],
      searchForm: {},
      multipleSelection: [],
      currentPage: 1,
      skip: 1,
      limit: 10,
      total: 0,
      isShowHeaderRefresh: false,
      isShowBack: false,
      isLoading: true,
      isNotShowSelection: false //是否显示表格列表多选框
    };
  },
  activated() {
    console.log("app-list activated!");
    let appListPath = this.cache.get("appListPath");
    if (appListPath && appListPath == this.$route.path) {
      this.get();
    } else {
      this.cache.set("appListPath", this.$route.path);
      this.cache.del("appListSearchFlag");
      this.onSearchReset();
    }
    // 判断按钮权限
    // if (jurisdictionBtn && this.$props.opt.buttons) {
    //   this.buttons = jurisdictionBtn(this.$route, this.$props.opt.buttons);
    //   if (
    //     this.$props.opt.isNotShowSelection ||
    //     (this.$props.opt.isNotShowSelection == undefined &&
    //       (!this.$props.opt.buttons || this.$props.opt.buttons.length == 0))
    //   ) {
    //     this.isNotShowSelection = true;
    //   }
    // }
  },
  mounted() {
    console.log("app-list mounted!", this.$props);
    let _this = this;
    this.title = this.$props.opt.title;
    this.emptyText = "请等待...";
    this.isShowHeaderRefresh = this.$props.opt.isShowHeaderRefresh;
    !this.$props.opt.buttons || this.$props.opt.buttons.length == 0;

    if (this.$props.opt.isShowBack) {
      this.isShowBack = true;
    }
    if (this.$props.opt.buttons) {
      for (let i = 0; i < this.$props.opt.buttons.length; i++) {
        let item = this.$props.opt.buttons[i];
        item.id = Math.random().toString();
      }

      if (typeof jurisdictionBtn !== "undefined") {
        // 判断按钮权限
        this.buttons = jurisdictionBtn(this.$route, this.$props.opt.buttons);
      } else {
        this.buttons = this.$props.opt.buttons;
      }
    } else if (
      this.$props.opt.isNotShowSelection ||
      (this.$props.opt.isNotShowSelection == undefined &&
        (!this.$props.opt.buttons || this.$props.opt.buttons.length == 0))
    ) {
      this.isNotShowSelection = true;
    }
    if (this.$props.opt.search) {
      this.$props.opt.search.forEach(item => {
        if (item.opt && item.opt.parent) {
          item.disabled = true;
        }
      });
      this.searchInps = this.$props.opt.search;
    }

    if (
      this.$props.opt.isNotShowSelection ||
      (this.$props.opt.isNotShowSelection == undefined &&
        (!this.buttons || this.buttons.length == 0))
    ) {
      this.isNotShowSelection = true;
    }
    this.columns = this.$props.opt.columns;
  },
  methods: {
    //获取表格数据并填充
    get() {
      let _this = this;
      _this.isLoading = true;

      // 有bug提出需要保留输入框输入的空格，故注释了本块代码
      // for (var i in this.searchForm) {
      //   if (
      //     typeof this.searchForm[i] != "object" &&
      //     typeof this.searchForm[i] == "string"
      //   ) {
      //     this.searchForm[i] = this.searchForm[i].replace(/ /g, "");
      //   }
      // }

      let searchFlag = this.cache.get("appListSearchFlag");
      let isNotSearch = !searchFlag || searchFlag != this.$route.path;

      this.$emit("get", {
        searchForm: isNotSearch ? {} : this.searchForm,
        skip: this.skip.toString(),
        limit: this.limit.toString(),
        cb(data) {
          _this.isLoading = false;

          // 赋值搜索默认值
          if (_this.$props.opt.search) {
            _this.$props.opt.search.forEach(item => {
              if (item.value && !_this.searchForm[item.key]) {
                _this.searchForm[item.key] = item.value;
              }
            });
          }
          _this.list = [];
          if (data && data.data) {
            if (data.total == 0) {
              _this.emptyText = "暂无数据";
            }
            _this.total = data.total;
            _this.list = data.data.length ? data.data : [];
            _this.title = _this.$props.opt.title;
          } else {
            _this.emptyText = "数据维护中";
          }
        }
      });

      if (typeof this.$props.opt.get == "function") {
        this.$props.opt.get({
          searchForm: isNotSearch ? {} : this.searchForm,
          skip: this.skip.toString(),
          limit: this.limit.toString(),
          cb(data) {
            _this.list = data.data.length ? data.data : [];
            _this.total = data.total ? data.total : data.data.length;
            _this.isLoading = false;
          }
        });
      }
    },
    onSearch() {
      this.cache.set("appListSearchFlag", this.$route.path);
      if (this.$props.opt.beforeSearch) {
        if (
          this.$props.opt.beforeSearch({
            searchForm: this.searchForm,
            skip: this.skip.toString(),
            limit: this.limit.toString()
          })
        ) {
          this.onRefresh();
        }
      } else {
        this.onRefresh();
      }
    },
    onSearchReset() {
      this.cache.del("appListSearchFlag");
      this.searchForm = {};
      this.onRefresh();
    },
    //刷新列表
    onRefresh() {
      this.list = [];
      let _this = this;
      setTimeout(() => {
        _this.isLoading = true;
        _this.skip = 1;
        _this.currentPage = 1;
        _this.limit = 10;
        _this.total = 0;
        _this.get();
      }, 0);
    },
    // 勾选单选框
    clickCurrentChange(val) {
      if (this.$props.opt.isShowHighliht) {
        this.multipleSelection = [val];
      }
    },
    //勾选列表复选框
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    // 点击了列表行
    handleRowClick(val) {
      if (typeof this.$props.opt.onRow == "function") {
        this.$props.opt.onRow(val);
      }
    },
    //改变表格展示条数
    handleSizeChange(val) {
      this.skip = 1;
      this.limit = val;
      this.get();
    },
    //表格翻页
    handleCurrentChange(val) {
      this.skip = val;
      this.get();
    },
    //表格按钮
    onButton(item) {
      let _this = this;
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
            if (!this.multipleSelection[0]) {
              this.$message({
                showClose: true,
                message: "请选择一项",
                type: "warning"
              });
              return;
            }
            if (item.confirm) {
              this.$confirm(item.confirm[0], "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
              })
                .then(() => {
                  item.on({
                    id: this.multipleSelection[0].id,
                    data: this.multipleSelection[0],
                    refresh() {
                      _this.onRefresh();
                    }
                  });
                })
                .catch(action => {
                  console.log(action);
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
          }
          break;
        case 2:
          if (this.multipleSelection.length > 0) {
            if (!this.multipleSelection[0]) {
              this.$message({
                showClose: true,
                message: "请选择一项",
                type: "warning"
              });
              return;
            }
            var ids = [];
            for (let i = 0; i < this.multipleSelection.length; i++) {
              ids.push(this.multipleSelection[i].id);
            }
            item.on({
              ids: ids,
              list: this.multipleSelection,
              refresh() {
                _this.onRefresh();
              }
            });
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
    //表格中开关
    onSwitch(item, row) {
      let _this = this;
      if (item.opt && item.opt.on && !item.opt.isNotDelay) {
        let lock = false;
        let ids = this.cache.getR("tableSwitch", []);
        for (let i = 0; i < ids.length; i++) {
          const id = ids[i];
          if (row.id == id) {
            lock = true;
            break;
          }
        }
        if (lock) {
          return this.$message({
            message: "操作频繁，请稍后再试",
            type: "warning"
          });
        } else {
          ids.push(row.id);
          this.cache.setR("tableSwitch", ids);
          let _delayTime =
            typeof item.opt.delayTime != "undefined"
              ? item.opt.delayTime
              : 3000;

          setTimeout(() => {
            let ids = this.cache.getR("tableSwitch");
            ids.splice(ids.indexOf(row.id), 1);
            this.cache.setR("tableSwitch", ids);
          }, 3000);
          _this.isLoading = true;
          item.opt.on(row).then(data => {
            _this.isLoading = false;
            if (data.state) {
              _this.$message({
                showClose: true,
                message: data.msg ? data.msg : "修改成功!",
                type: "success"
              });
              row[item.key] = !row[item.key];
            } else {
              _this.$message({
                showClose: true,
                message: data.msg ? data.msg : "修改失败!",
                type: "error"
              });
            }
          });
        }
      }
    },
    tableRowClassName({ row, rowIndex }) {
      if (row && row.bk) {
        let className = "";
        switch (row.bk) {
          case 1:
            className = "success-row";
            break;
          case 2:
            className = "warning-row";
            break;
          case 3:
            className = "danger-row";
            break;
          case 4:
            className = "danger-rows";
            break;
          default:
            break;
        }
        return className;
      } else {
        return "";
      }
    },
    // 点击搜索时间筛选按钮触发
    onSelect(timeType) {
      this.searchInps.forEach((item, idx) => {
        if (item.type == "btnGroup") {
          var now = new Date(); //当前日期
          if (timeType === "day") {
            this.searchForm.date = [
              new Date(this.format(now).slice(0, 11) + "00:00:00"),
              new Date(this.format(now).slice(0, 11) + "23:59:59")
            ];
          } else if (timeType === "week") {
            var date = new Date();
            var weekday = date.getDay() || 7;
            date.setDate(date.getDate() - weekday + 1);
            this.searchForm.date = [
              new Date(this.format(date).slice(0, 11) + "00:00:00"),
              new Date(this.format(now))
            ];
          } else if (timeType === "month") {
            var Nowdate = new Date();
            var MonthFirstDay = new Date(
              Nowdate.getFullYear(),
              Nowdate.getMonth(),
              1
            );
            var M = Number(MonthFirstDay.getMonth()) + 1;
            var monthFirstDay =
              MonthFirstDay.getFullYear() +
              "-" +
              M +
              "-" +
              MonthFirstDay.getDate();
            this.searchForm.date = [
              new Date(this.format(monthFirstDay).slice(0, 11) + "00:00:00"),
              new Date(this.format(now))
            ];
          }

          // 改变按钮组点击颜色
          for (let i = 0; i < item.buts.length; i++) {
            let butsItem = item.buts[i];
            if (butsItem.timeType == timeType) {
              butsItem.type = "success";
            } else if (item.buts[i].type == "success") {
              butsItem.type = "primary";
            }
          }
          this.get();
        }
      });
    },
    // 变更搜索下拉框
    onChangeSelect(item) {
      let _this = this;
      this.$forceUpdate(); // 强制刷新dom
      this.$props.opt.search.forEach(data => {
        if (data.opt && data.opt.parent && data.opt.parent == item.key) {
          data.disabled = false;
          if (_this.searchForm[data.key]) {
            _this.searchForm[data.key] = "";
          }
        }
      });
      if (item && item.opt && item.opt.change) {
        item.opt.change(this.searchForm[item.key]);
      }
    },
    /**
     * 输入框清除按钮
     */
    handleClear(item) {
      if (item.opt && item.opt.clear) {
        item.opt.clear(this.searchForm);
      }
    },
    //远程搜索选择框
    handleSelectRemoteFilterable(item) {
      return keyword => {
        item.opt.on(keyword, data => {
          item.opt.list = data;
        });
      };
    },
    //远程搜索选择框获取焦点
    handleSelectRemoteFilterableFocus(item) {
      if (item.opt.list.length == 0) {
        item.opt.on("", data => {
          item.opt.list = data;
        });
      }
    },
    //远程搜索选择框值改变
    handleSelectRemoteFilterableChange(item) {
      if (item.opt && item.opt.change) {
        item.opt.change(this.form[item.key], data => {
          item.opt.list = data;
        });
      }
    },
    //搜索栏远程搜索选择框值改变
    handleSearchSelectRemoteFilterableChange(item) {
      if (item.opt && item.opt.change) {
        item.opt.change(
          this.searchForm[item.key],
          data => {
            item.opt.list = data;
          },
          this.searchForm
        );
      }
    }
  }
};
</script>
<style lang="scss">
.table-body {
  .el-table__header-wrapper {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;

    .cell {
      white-space: inherit;
    }
  }

  .el-table__body-wrapper {
    height: 100%;
    overflow-y: auto;
  }
}
</style>
<style scoped lang="scss">
.app-list {
  display: flex;
  flex-direction: column;
  height: 100%;

  .table-box {
    position: relative;
    flex: 1;
    overflow-y: auto;
  }

  .table-body {
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    padding-top: 48px;
    width: 100%;
  }

  .custom_button {
    float: right;
    margin-right: 20px;
  }
  .title-bar {
    margin-bottom: 20px;
    height: 40px;
    line-height: 40px;
    .title {
      font-size: 18px;
      color: #303133;
    }
    .refresh {
      float: right;
    }
  }
  .buts-bar {
    padding: 6px 0;
    .refresh {
      position: absolute;
      top: 0;
      right: 0;
    }
  }

  .row-nav {
    cursor: pointer;
    color: #409eff;
  }

  .row-switch-box {
    position: relative;
    display: inline-block;
  }

  .row-switch-but {
    position: absolute;
    z-index: 999;
    width: 100%;
    height: 100%;
    cursor: pointer;
  }

  .el-pagination {
    margin-top: 20px;
  }

  .el-form--inline {
    .el-form-item {
      margin-right: 14px;
    }
  }

  .row-nav-vice {
    border-bottom: solid 1px #cccccc;
    cursor: pointer;
  }

  .danger {
    color: #f56c6c;
  }

  .el-checkbox {
    padding: 3px 0;
    width: 22px;
  }

  .search-refresh {
    float: right;
  }
  .row-action-but {
    color: #409eff;
    cursor: pointer;
    margin-right: 10px;
  }
  .nowrap {
    white-space: nowrap !important;
  }

  .row-img {
    img {
      position: absolute;
      top: 4px;
      left: initial;
      width: 60px;
      height: 80%;
      cursor: pointer;
    }
  }
  .row-list {
    display: flex;
    justify-content: space-around;
    flex-direction: row;
    flex-wrap: wrap;
  }
  .row-list-group {
    display: flex;
    justify-content: space-around;
    flex-direction: row;
    .row-list-group_item {
      text-align: center;
    }
  }

  .row-action-alt {
    .active {
      color: #666;
    }
    .inactive {
      color: #409eff;
      cursor: pointer;
    }
  }
}
</style>
