<template>
  <div class="app-form">
    <el-form
      ref="form"
      :model="form"
      :rules="rules"
      :validate-on-rule-change="false"
      v-loading="isShowLoading"
      :disabled="isDisabled"
      :data-value="entry"
    >
      <div
        v-for="item in filterShow(set)"
        :class="{'item-box-50': item.isCol50, 'item-box-33': item.isCol33, 'item-box-def': !item.isCol50&&item.isCol33, 'item-hidden': item.isHidden}"
        :key="item.key"
      >
        <el-form-item :label="item.label" :prop="item.type != 'table' ? item.key : null">
          <el-input
            v-if="!item.type"
            :disabled="item.disabled?true:false"
            v-model="form[item.key]"
            clearable
            :placeholder="type!='show'?(item.placeholder?item.placeholder:'请填写'+item.label):''"
            :maxlength="item.maxlength?item.maxlength:50"
          ></el-input>
          <div v-else-if="item.type == 'subTitle'" class="form-item_subTitle">{{item.subLabel}}</div>
          <el-input
            type="textarea"
            v-else-if="item.type=='textarea'"
            v-model="form[item.key]"
            :disabled="item.disabled?true:false"
            :rows="4"
            :maxlength="item.maxlength?item.maxlength:1000"
            :placeholder="type!='show'?(item.placeholder?item.placeholder:'请填写'+item.label):''"
            show-word-limit
            clearable
          ></el-input>
          <el-input-number
            v-else-if="item.type=='number'"
            type="number"
            v-model.number="form[item.key]"
            :min="item.min != null ? item.min : 1"
            :max="item.max != null ? item.max : 9999"
            :label="item.label ? item.label : '描述文字'"
            :placeholder="type!='show'?(item.placeholder?item.placeholder:'请填写'+item.label):''"
            clearable
          ></el-input-number>
          <div
            v-else-if="item.type=='link'"
            @click="item.opt.callback(form)"
            :class="type == 'show' ? 'input-link' : ''"
          >
            <el-input
              :disabled="item.disabled?true:false"
              type="text"
              v-model="form[item.key]"
              :placeholder="type!='show'?(item.placeholder?item.placeholder:'请填写'+item.label):''"
            ></el-input>
          </div>

          <el-input
            v-else-if="item.type=='password'"
            :disabled="item.disabled?true:false"
            type="password"
            v-model="form[item.key]"
            clearable
            :placeholder="type!='show'?(item.placeholder?item.placeholder:'请填写'+item.label):''"
          ></el-input>
          <el-select
            v-else-if="item.type=='select-filterable'"
            v-model="form[item.key]"
            :multiple="item.opt.multiple==false?false:true"
            filterable
            reserve-keyword
            :filter-method="selectRemoteFilterMethod(item)"
            :placeholder="type!='show'?'请输入关键词搜索':''"
            :remote-method="onSelectRemoteMethod"
            :loading="item.opt.isLoading"
            :disabled="item.disabled"
            @change="onChangeSelect(item)"
            @focus="onSelectRemotefocus(item)"
          >
            <el-option
              v-for="it in item.opt.list"
              :key="it.value"
              :label="it.label"
              :value="it.value"
            ></el-option>
          </el-select>
          <el-select
            v-else-if="item.type=='select-remote'"
            v-model="form[item.key]"
            :multiple="item.opt.multiple==false?false:true"
            filterable
            remote
            reserve-keyword
            :placeholder="type!='show'?'请输入关键词搜索':''"
            :remote-method="onSelectRemoteMethod"
            :loading="item.opt.isLoading"
            :disabled="item.disabled"
            @change="onChangeSelect(item)"
            @focus="onSelectRemotefocus(item)"
          >
            <el-option
              v-for="it in item.opt.list"
              :key="it.value"
              :label="it.label"
              :value="it.value"
            ></el-option>
          </el-select>
          <!--
            select-remote-filterable
            例子：opt: {
              multiple: false,
              list: [],
              on(keyword, cb) {
                //获取焦点并且list是空数组以及会输入关键字自动调用
                _this.getCompanyList(keyword, cb);//具体获取下拉选项的ajax
              }
            }
            getCompanyList(keyword, cb) {
              cb([{label: '选项名称', value: '值'}]);
            }
          -->
          <el-select
            v-else-if="item.type=='select-remote-filterable'"
            v-model="form[item.key]"
            :multiple="item.opt.multiple==false?false:true"
            filterable
            :filter-method="handleSelectRemoteFilterable(item)"
            :placeholder="type!='show'?'请输入关键词搜索':''"
            :loading="item.opt.isLoading"
            :disabled="item.disabled"
            @change="handleSelectRemoteFilterableChange(item)"
            @focus="handleSelectRemoteFilterableFocus(item)"
          >
            <el-option
              v-for="it in item.opt.list"
              :key="it.value"
              :label="it.label"
              :value="it.value"
            >
              <span class="select-label">{{ it.label }}</span>
              <span class="select-subLabel">{{ it.subLabel || '' }}</span>
            </el-option>
          </el-select>
          <el-select
            v-else-if="item.type=='select-filter'"
            v-model="form[item.key]"
            filterable
            :multiple="item.opt.multiple==false?false:true"
            :placeholder="type!='show'?'请输入关键词搜索':''"
            @change="handleSelectRemoteFilterableChange(item)"
          >
            <el-option
              v-for="it in item.opt.list"
              :key="it.value"
              :label="it.label"
              :value="it.value"
            ></el-option>
          </el-select>
          <el-switch
            v-else-if="item.type=='switch'"
            v-model="form[item.key]"
            :disabled="item.disabled"
            active-color="#67C23A"
            @change="onChangeSelect(item)"
            inactive-color="#F56C6C"
            :active-text="item.opt && item.opt.activeText ? item.opt.activeText : '启用'"
            :inactive-text="item.opt && item.opt.inactiveText ? item.opt.inactiveText : '禁用'"
          ></el-switch>
          <el-checkbox-group
            v-else-if="item.type=='checkbox'"
            v-model="form[item.key]"
            size="small"
          >
            <el-checkbox v-for="it in item.opt.list" :key="it.id" :label="it.id" border>{{it.name}}</el-checkbox>
          </el-checkbox-group>
          <el-select
            v-else-if="item.type=='select'"
            v-model="form[item.key]"
            :placeholder="type!='show'?'请选择'+item.label:''"
            :disabled="item.disabled"
            @change="onChangeSelect(item)"
          >
            <el-option
              v-for="it in item.opt.list"
              :key="it.value"
              :label="it.label"
              :value="it.value"
            ></el-option>
          </el-select>
          <div v-else-if="item.type=='upload-img'">
            <el-upload
              :action="item.opt.url"
              accept="image/*"
              list-type="picture-card"
              :auto-upload="false"
              :limit="item.opt.limit?item.opt.limit:6"
              :file-list="form[item.key]"
              :http-request="item.opt.upload"
              :before-upload="onBeforeUpload(item)"
              :before-remove="onBeforeRemoveByUploadImg(item)"
              :on-success="onSuccessByUploadImg(item)"
              :on-preview="onPreviewByUploadImg"
              :on-exceed="onExceed"
              :disabled="isDisabled"
              :class="{'upload-disabled': isDisabled}"
            >
              <i class="el-icon-plus"></i>
            </el-upload>
          </div>
          <div v-else-if="item.type=='upload-img-form'">
            <el-upload
              accept="image/*"
              list-type="picture-card"
              :action="item.opt.url"
              :file-list="form[item.key]"
              :limit="item.opt.limit?item.opt.limit:6"
              :on-preview="onPreviewByUploadImg"
              :before-upload="onBeforeUpload(item)"
              :name="item.opt.name ? item.opt.name: 'file'"
              :before-remove="onBeforeRemoveByUploadImg(item)"
              :on-success="onSuccessByFormUploadImg(item)"
              :on-remove="onHandleRemove(item)"
              :on-exceed="onExceed"
              :disabled="isDisabled"
              :class="{'upload-disabled': isDisabled}"
            >
              <i class="el-icon-plus"></i>
            </el-upload>
            <div class="img-upload-alt">{{item.opt.alt}}</div>
          </div>
          <div v-else-if="item.type=='upload-img-only'">
            <div class="disabled-box" v-if="isDisabled"></div>
            <el-upload
              class="avatar-uploader"
              accept="image/*"
              list-type="picture-card"
              :action="item.opt.url"
              :file-list="form[item.key]"
              :show-file-list="false"
              :on-preview="onPreviewByUploadImg"
              :before-upload="onBeforeUpload(item)"
              :before-remove="onBeforeRemoveByUploadImg(item)"
              :on-success="onSuccessByUploadImgOnly(item)"
              :on-remove="onHandleRemove(item)"
              :on-exceed="onExceed"
            >
              <img
                v-if="form[item.key] && form[item.key].length"
                :src="item.opt.src?item.opt.src+form[item.key][0].url:form[item.key][0].url"
                class="avatar"
              />
              <i v-else class="el-icon-plus"></i>
            </el-upload>
          </div>
          <el-cascader
            v-else-if="item.type=='cascader'"
            :options="item.opt.list"
            :props="item.opt.props"
            :separator="'/'"
            v-model="form[item.key]"
          ></el-cascader>
          <el-date-picker
            v-else-if="item.type=='date-time'"
            v-model="form[item.key]"
            type="datetime"
            :disabled="item.disabled"
            :placeholder="type!='show'?'请选择'+item.label:''"
          ></el-date-picker>
          <el-time-picker
            v-model="form[item.key]"
            v-else-if="item.type=='time'"
            :disabled="item.disabled"
            :value-format="item.opt && item.opt.format ? item.opt.format  : 'HH:mm:ss'"
            :format="item.opt && item.opt.format ? item.opt.format  : 'HH:mm:ss'"
            @change="onChangeTime(item, form[item.key])"
            :picker-options="{
              selectableRange:  item.opt && item.opt.min && item.opt.max ? `${item.opt.min} - ${item.opt.max}` : ''
            }"
          ></el-time-picker>
          <el-time-picker
            v-model="form[item.key]"
            v-else-if="item.type=='range-time'"
            range-separator="至"
            is-range
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            placeholder="选择时间范围"
            @change="item.opt && item.opt.change ? item.opt.change(form[item.key]) : null"
            :value-format="item.opt && item.opt.format ? item.opt.format : 'HH:mm:ss'"
            :format="item.opt && item.opt.format ? item.opt.format : 'HH:mm:ss'"
          ></el-time-picker>
          <el-date-picker
            v-else-if="item.type=='range-date'"
            v-model="form[item.key]"
            type="daterange"
            unlink-panels
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
          <el-date-picker
            v-else-if="item.type=='datetimerange'"
            v-model="form[item.key]"
            type="datetimerange"
            unlink-panels
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :picker-options='{disabledDate: onDatetimerangeDisabledDate(item)}'>
          </el-date-picker>
          <el-upload
            v-else-if="item.type=='upload-file'"
            :action="item.opt && item.opt.url ? item.opt.url : '#'"
            :limit="item.opt.limit?item.opt.limit:6"
            :file-list="form[item.key]"
            :accept="item.opt && item.opt.accept ?  item.opt.accept : ''"
            :multiple="item.opt.multiple?multiple:false"
            :on-change="onChangeFile(item)"
            :before-upload="item.opt.beforeUploadFile || (() => true)"
            :on-success="onSuccessByFormUploadFile(item)"
            :on-exceed="onExceed"
            :on-remove="onHandleRemove(item)"
            :before-remove="item.opt.remove"
            :on-progress="item.opt.onProgress"
          >
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">{{item.opt.tip}}</div>
          </el-upload>
          <div class="img-list" v-else-if="item.type == 'img-list'">
            <img v-for="it in form[item.key]" :key="it.src" :src="it.src" @click="showBig(it.src)" />
          </div>
          <div class="img" v-else-if="item.type == 'img'">
            <img :src="form[item.key]" @click="showBig(form[item.key])" />
          </div>
          <div class="table" v-else-if="item.type == 'table'">
            <el-row class="table__row table__header">
              <el-col v-for="it in item.opt.columns" :key="it.key">{{it.label}}</el-col>
            </el-row>
            <i
              class="not_table__action el-icon-circle-plus"
              v-if="type!='show' && !item.opt.isDisabled && !form[item.key].length"
              @click="form[item.key].push(JSON.parse(JSON.stringify(item.opt.temp)))"
            ></i>
            <el-form
              :model="form[item.key][index]"
              :rules="item.rules"
              ref="table_form"
              :key="index"
              v-for="(it, index) in form[item.key]"
            >
              <el-row class="table__row">
                <el-col v-for="(i,k) in item.opt.columns" :key="k">
                  <el-form-item :prop="i.key">
                    <input
                      v-if="!i.type"
                      type="text"
                      :readonly="item.opt && item.opt.isDisabled"
                      :disabled="type!='show'?false:true"
                      v-model="form[item.key][index][i.key]"
                      clearable
                    />
                    <input
                      v-else-if="i.type == 'number'"
                      type="number"
                      :max='i.max'
                      :readonly="item.opt && item.opt.isDisabled"
                      :disabled="type!='show'?false:true"
                      v-model.number="form[item.key][index][i.key]"
                      clearable
                    />
                    <el-input-number
                      v-else-if="i.type == 'number-pro'"
                      v-model="form[item.key][index][i.key]"
                      :max="i.max?i.max:'Infinity'"
                      :min="i.min!=undefined?i.min:'-Infinity'"
                      :controls='false'
                      size="mini">
                    </el-input-number>
                  </el-form-item>
                </el-col>
                <i
                  class="table__action el-icon-remove"
                  v-if="type!='show' && !item.opt.isDisabled"
                  @click="form[item.key].splice(index, 1)"
                ></i>
                <i
                  class="table__action el-icon-circle-plus"
                  v-if="type!='show' && !item.opt.isDisabled && index == form[item.key].length -1"
                  @click="form[item.key].push(JSON.parse(JSON.stringify(item.opt.temp)))"
                ></i>
              </el-row>
            </el-form>
          </div>
          <div class v-else-if="item.type == 'slot'">
            <slot :name="item.opt.slotName"></slot>
          </div>
          <div class v-else-if="item.type == 'radio'">
            <el-radio-group v-model="form[item.key]">
              <el-radio
                v-for="(items,indexs) in item.opt.list"
                :label="items.id"
                :key="indexs"
              >{{items.label}}</el-radio>
            </el-radio-group>
          </div>
          <div class="map" v-else-if="item.type == 'map'">
            <div class="map-container" :ref="item.key"></div>
          </div>
          <div class="map-util" v-else-if="item.type == 'mapUtil'">
            <div class="map-container" :ref="item.key"></div>
            <el-input
              :disabled="item.disabled?true:false"
              v-model="form[item.key]"
              clearable
              :placeholder="type!='show'?(item.placeholder?item.placeholder:'请选择'+item.label):''"
              :maxlength="item.maxlength?item.maxlength:50"
            ></el-input>
          </div>
          <el-input
            v-else-if="item.type == 'tel'"
            :disabled="item.disabled?true:false"
            v-model="form[item.key]"
            clearable
            :placeholder="type!='show'?(item.placeholder?item.placeholder:'请填写'+item.label):''"
          ></el-input>
        </el-form-item>
      </div>
    </el-form>
    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt />
    </el-dialog>
  </div>
</template>
<script>
import Vue from "vue";

export default {
  props: {
    opt: {
      type: Object,
      default() {
        return {};
      }
    },
    entry: {
      type: String,
      default() {
        return "";
      }
    },
    isFor: {
      type: Boolean,
      default() {
        return false;
      }
    }
  },
  data() {
    let _this = this;
    return {
      form: {},
      rules: {},
      set: [],
      type: "",
      isDisabled: false,
      dialogVisible: false,
      dialogImageUrl: "",
      isShowLoading: true
    };
  },
  created() {
    //console.log("app-form created!", this.$props);
    if (this.isFor) {
      this.init();
    }
  },
  activated() {
    //console.log("app-form activated!", this.$props);
    if (!this.isFor) {
      this.init();
    }
  },
  deactivated() {
    this.rules = {};
    this.form = {};
    this.set = [];
  },
  watch: {
    opt: {
      deep: true,
      handler: function(news, olds) {
        if (this.type == "show") {
          return;
        }
        for (let i = 0; i < this.$props.opt.form.length; i++) {
          let item = this.$props.opt.form[i];
          if (
            item.rules &&
            item.filterRule &&
            this.form[item.filterRule.key] == item.filterRule.value
          ) {
            this.rules[item.key] = item.filterRule.rules;
          } else if (
            item.rules &&
            item.filterRule &&
            this.form[item.filterRule.key] != item.filterRule.value
          ) {
            this.rules[item.key] = item.rules;
          }
        }
      }
    }
  },
  methods: {
    //初始化
    init() {
      this.type = this.$route.params.type;
      let _rules = {};
      let _form = {};
      let _this = this;
      for (let i = 0; i < this.$props.opt.form.length; i++) {
        let item = this.$props.opt.form[i];
        if (item.rules) {
          for (let j = 0; j < item.rules.length; j++) {
            const it = item.rules[j];
            if (it.required) {
              item.isRequired = true;
            }
            if (it.required != undefined && !it.validator) {
              it.message = "必须填写" + item.label;
            }
            if (it.regexp) {
              it.validator = (rule, value, callback) => {
                if (value.match(it.regexp)) {
                  callback(new Error(it.message));
                } else {
                  callback();
                }
              };
            }
            if(it._validator){
              it.validator = (rule, value, callback) => {
                it._validator(this.form, rule, value, callback);
              };
            }
          }
          _rules[item.key] = item.rules;
        }
        if (item.type == 'tel') {
          if (!_rules[item.key]) {
            _rules[item.key] = [];
          }
          _rules[item.key].push({
            validator: (rule, value, callback) => {
              let reg = /^1[23456789]\d{9}$/;
              if (!value) {
                callback();
              } else if (!reg.test(value)) {
                callback(new Error("手机号码格式不对"));
              } else {
                callback();
              }
            }
          })
        }
        if (item.opt && item.opt.parent) {
          item.disabled = true;
        }
        if (
          !item.only ||
          item.only == this.type ||
          item.only.indexOf(this.type) != -1
        ) {
          if (item.defaultValue && this.type == "add") {
            _form[item.key] = item.defaultValue;
          } else {
            switch (item.type) {
              case "select-remote":
                _form[item.key] = item.opt.multiple == false ? "" : [];
                break;
              // case "cascader":
              case "switch":
                _form[item.key] = false;
                break;
              case "upload-img":
              case "img-list":
              case "upload-img-only":
              case "upload-img-form":
              case "upload-file":
              case "checkbox":
              case "radio":
                _form[item.key] = [];
                break;
              case "table":
                item.opt.temp = {};
                for (let i = 0; i < item.opt.columns.length; i++) {
                  const it = item.opt.columns[i];
                  item.opt.temp[it.key] = "";
                }
                if (item.opt && item.opt.default) {
                  _form[item.key] = JSON.parse(
                    JSON.stringify(item.opt.default)
                  );
                } else {
                  _form[item.key] = [JSON.parse(JSON.stringify(item.opt.temp))];
                }
                break;
              case "select":
                if (item.opt && item.value) {
                  _form[item.key] = JSON.parse(JSON.stringify(item.value));
                } else {
                  _form[item.key] = "";
                }
                break;
              default:
                _form[item.key] = "";
            }
          }
          if (item.init) {
            item.init(_form[item.key]);
          }
        }
      }

      if (this.type != "show") {
        this.rules = _rules;
      }

      if (typeof this.$props.opt.init == "function") {
        _form = this.$props.opt.init(_form);
      }

      this.form = _form;
      this.set = this.$props.opt.form;
      this.$props.opt._form = _form;
      this.isDisabled = false;

      if (this.type == "show" || this.type == "edit") {
        if (this.type == "show") {
          this.isDisabled = true;
        }
        var id = this.$route.params.id;

        if (typeof this.$props.opt.get == "function") {
          this.$props.opt.get({
            id: id,
            cb(data) {
              _this.form = data;
              // 父级有值，解除disabled
              _this.$props.opt.form.forEach(item => {
                if (
                  item.opt &&
                  item.opt.parent &&
                  _this.form[item.opt.parent]
                ) {
                  item.disabled = false;
                }
                if (item.opt && item.opt.change) {
                  item.opt.change(_this.form[item.key], data => {
                    item.opt.list = data;
                  });
                }
                if (_this.type == "show" && item.type == "map") {
                  let ele = _this.$refs[item.key][0];
                  let it = data[item.key];
                  let center = new qq.maps.LatLng(it.latitude, it.longitude);
                  let map = new qq.maps.Map(ele, {
                    center: center,
                    zoom: 16
                  });
                  let marker = new qq.maps.Marker({
                    position: center,
                    map: map
                  });
                }
                if (_this.type == "edit" && item.type == "mapUtil") {
                  _this.setMapUtil(item, data[item.mapData]);
                }
              });
              _this.isShowLoading = false;
            }
          });
        }
      }
      if (this.type == "add" || this.type == "edit") {
        this.$tel.wait(this.$props.entry, cb => {
          let valid = true;
          if (_this.$refs.table_form) {
            _this.$refs.table_form.forEach(item => {
              item.validate((resulte, obj) => {
                if (!resulte) {
                  valid = false;
                }
              });
            });
          }
          if (valid) {
            cb(_this.$refs.form, _this.form);
          }
        });
      }
      if (this.type == "add") {
        this.isShowLoading = false;
        let mapList = [];
        for (let i = 0; i < this.$props.opt.form.length; i++) {
          let item = this.$props.opt.form[i];
          if (item.type == "mapUtil") {
            mapList.push(item);
          }
        }
        this.$nextTick(() => {
          for (let i = 0; i < mapList.length; i++) {
            let item = mapList[i];
            this.setMapUtil(item);
          }
        });
      }
    },
    //辅助显示隐藏
    filterShow(list) {
      let _this = this;
      let showList = [];
      list.forEach((item, index) => {
        // 配置过滤显示
        if (item.filters) {
          if (
            Object.prototype.toString.call(item.filters) === "[object Array]"
          ) {
            let is = true;
            for (let i = 0; i < item.filters.length; i++) {
              const element = item.filters[i];
              if (
                Object.prototype.toString.call(element.value) ==
                "[object Array]"
                  ? element.value.indexOf(_this.form[element.key]) == -1
                  : element.value != _this.form[element.key]
              ) {
                is = false;
                break;
              }
            }
            if (is) {
              showList.push(item);
            }
          } else if (typeof item.filters == 'function') {
            let is = item.filters();
            if (is) {
              showList.push(item);
            }
          } else if (
            item.filters &&
            item.filters.key &&
            item.filters.value &&
            item.filters.value == _this.form[item.filters.key]
          ) {
            showList.push(item);
          }
        }

        // 配置编辑和详情模式的过滤显示
        if (
          !item.filters &&
          (!item.only ||
            item.only == this.type ||
            item.only.indexOf(this.type) != -1)
        ) {
          showList.push(item);
        }
      });
      return showList;
    },
    onChangeSelect(item) {
      let _this = this;
      this.$props.opt.form.forEach(data => {
        if (data.opt && data.opt.parent && data.opt.parent == item.key) {
          _this.form[data.key] = "";
          data.disabled = false;
          if (data.type == "switch") {
            _this.form[data.key] = false;
          }
        }
      });
      if (item.opt && item.opt.change) {
        item.opt.change(
          _this.form[item.key],
          data => {
            item.opt.list = data;
          },
          _this.form
        );
      }
    },
    //配合远程搜索多选下拉框回调确认item
    onSelectRemotefocus(item) {
      let list = this.cache.getR("selectFilterable" + item.key);
      if (!list) {
        let data = JSON.parse(JSON.stringify(item.opt.list));
        this.cache.setR("selectFilterable" + item.key, data);
      } else {
        item.opt.list = list;
      }
      this.cache.setR("selectRemoteItem", item);
    },
    //远程搜索多选下拉框回调
    onSelectRemoteMethod(query) {
      let item = this.cache.getR("selectRemoteItem");
      if (item && item.opt && item.opt.on) {
        item.opt.on(query);
      }
    },
    //放大图片
    showBig(src) {
      this.dialogImageUrl = src;
      this.dialogVisible = true;
    },
    //配合图片上传确认item
    onPreviewByUploadImg(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    //图片上传回调
    onSuccessByUploadImg(item) {
      return (response, file, fileList) => {
        this.form[item.key] = fileList;
      };
    },
    //表单类型图片上传回调
    onSuccessByFormUploadImg(item) {
      return (response, file, fileList) => {
        if(response.code != 0){
          fileList.pop();
          return this.$message({
            message: "图片上传失败",
            type: "warning"
          });
        }
        if (item.opt.isUseFileList) {
          this.form[item.key] = fileList;
          return;
        }
        if (item.urlKey) {
          this.form[item.key].push({
            url: response.data[item.urlKey]
          });
        } else {
          this.form[item.key].push({
            url: response.data.picPath
          });
        }
      };
    },
    //表单图片单张上传
    onSuccessByUploadImgOnly(item) {
      return (response, file, fileList) => {
        let keyName = item.opt.urlKey ? item.opt.urlKey : "picPath";
        this.form[item.key] = [
          {
            url: response.data[keyName]
          }
        ];
      };
    },
    // 图片删除
    onHandleRemove(item) {
      return (file, fileList) => {
        this.form[item.key] = fileList;
      };
    },
    //图片上传的图片删除
    onBeforeRemoveByUploadImg(item) {
      return (file, fileList) => {
        return new Promise((resolve, reject) => {
          let is = true;
          if (file.raw) {
            is = ["image/png", "image/jpeg"].indexOf(file.raw.type) != -1;
          }
          if (is) {
            this.$confirm("确认删除此图片吗？", "提示", {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              type: "warning"
            })
              .then(() => {
                item.opt.remove(file, fileList);
                resolve();
              })
              .catch(function() {
                reject();
              });
          } else {
            resolve();
          }
        });
      };
    },

    // 改变时间选择
    onChangeTime(item, val) {
      this.$props.opt.form.forEach(data => {
        if (
          data.opt &&
          data.opt.parent &&
          data.opt.parent == item.key &&
          this.form[data.opt.parent]
        ) {
          this.form[data.key] = "";
          data.disabled = false;
          this.$forceUpdate();
        }
        if (data.opt && data.opt.parent && !this.form[data.opt.parent]) {
          data.disabled = true;
          this.form[data.key] = "";
        }
      });
      if (item.opt && item.opt.change) {
        item.opt.change(val);
      }
    },
    // 文件本地上传执行的回调函数
    onChangeFile(item) {
      return (response, file, fileList) => {
        if (item.opt || !item.opt.url) {
          this.form[item.key].push(file[0]["raw"]);
        }
      };
    },

    // 文件上传执行的回调函数
    onSuccessByFormUploadFile(item) {
      return (response, file, fileList) => {
        this.form[item.key].push(file["raw"]);
      };
    },
    //文件上传数量超过限制
    onExceed() {
      this.$message({
        message: "文件上传数量超过限制，请删除后重新上传",
        type: "warning"
      });
    },
    //自定义搜索
    selectRemoteFilterMethod(item) {
      return label => {
        console.log(item, label);
        let list = this.cache.getR("selectFilterable" + item.key);
        let _list = [];
        for (let i = 0; i < list.length; i++) {
          if (list[i].label.indexOf(label) != -1) {
            _list.push(list[i]);
          }
        }
        item.opt.list = _list;
      };
    },
    //远程搜索选择框
    handleSelectRemoteFilterable(item) {
      return keyword => {
        if (item.opt.on) {
          item.opt.on(keyword, data => {
            this.handleSelectRemoteFilterableUtil(data, item);
          });
        }
      };
    },
    //远程搜索选择框获取焦点
    handleSelectRemoteFilterableFocus(item) {
      if (item.opt.list.length == 0 && item.opt.on) {
        item.opt.on("", data => {
          item.opt.list = data;
        });
      }
      if (item.opt.focus) {
        item.opt.focus(item.opt.list, data => {
          item.opt.list = data;
        });
      }
    },
    //远程搜索选择框值改变
    handleSelectRemoteFilterableChange(item) {
      if (item.opt && item.opt.change) {
        item.opt.change(
          this.form[item.key],
          data => {
            this.handleSelectRemoteFilterableUtil(data, item);
          },
          this.form
        );
      }
    },

    /**
     * handleSelectRemoteFilterable辅助方法
     */
    handleSelectRemoteFilterableUtil(data, item) {
      if (item.opt.multiple != false) {
        let mustList = [];
        for (let i = 0; i < this.form[item.key].length; i++) {
          const val = this.form[item.key][i];
          for (let j = 0; j < item.opt.list.length; j++) {
            const tag = item.opt.list[j];
            if (tag.value == val) {
              let is = true;
              for (let k = 0; k < data.length; k++) {
                const ele = data[k];
                if (ele.value == val) {
                  is = false;
                  break;
                }
              }
              if (is) {
                mustList.push(tag);
              }
              break;
            }
          }
        }
        item.opt.list = data.concat(mustList);
      } else {
        item.opt.list = data;
      }
    },

    /**
     * 地图选择组件辅助
     */
    setMapUtil(item, latLng) {
      if (!item.opt) {
        item.opt = {};
      }

      let _this = this;
      let _key = item.key + "MapUtil";
      let _center = null;

      if (latLng && latLng.address) {
        _this.form[item.key] = latLng.address;
      }

      if (latLng && latLng.latitude && latLng.longitude) {
        _center = new qq.maps.LatLng(latLng.latitude, latLng.longitude);
        _this.form[_key] = {
          lat: latLng.latitude,
          lng: latLng.longitude
        };
      } else {
        _center = new qq.maps.LatLng(39.91485, 116.403765);
      }

      // item.opt.ele = this.$refs[item.key][0];
      // item.opt.map = new qq.maps.Map(item.opt.ele, {
      let _map = new qq.maps.Map(this.$refs[item.key][0], {
        center: _center,
        zoom: 16
      });

      if (latLng && latLng.latitude && latLng.longitude) {
        setMarker(_center);
      } else {
        //获取城市列表接口设置中心点
        let citylocation = new qq.maps.CityService({
          complete: function(result) {
            _map.setCenter(result.detail.latLng);
            _this.form[_key] = result.detail.latLng;
          }
        });
        //调用searchLocalCity();方法    根据用户IP查询城市信息。
        citylocation.searchLocalCity();
      }

      qq.maps.event.addListener(_map, "click", function(event) {
        let latitude = event.latLng.getLat();
        let longitude = event.latLng.getLng();
        let center = new qq.maps.LatLng(latitude, longitude);
        setMarker(center);
        let geocoder = new qq.maps.Geocoder({
          complete: function(result) {
            console.log("腾讯地图选择：" + result.detail.address);
            _this.form[item.key] = result.detail.address;
            _this.form[_key] = result.detail.location;
          }
        });
        let coord = new qq.maps.LatLng(latitude, longitude);
        geocoder.getAddress(coord);
      });

      function setMarker(center) {
        let _marker = _this.cache.getR("appFormMarker");
        if (_marker) {
          _marker.setMap(null);
        }
        let marker = new qq.maps.Marker({
          position: center,
          map: _map
        });
        _this.cache.setR("appFormMarker", marker);
      }
    },

    /**
     * 上传文件之前的钩子
     */
    onBeforeUpload(item) {
      return file => {
        let is = ["image/png", "image/jpeg"].indexOf(file.type) != -1;
        if (!is) {
          console.log("上传文件之前的钩子", item, file, is);
          this.$message.error("只能上传图片");
        }
        return is;
      };
    },

    onDatetimerangeDisabledDate(item) {
      return date => {
        if (item.opt) {
          if(item.opt.start && item.opt.limit){
            let start = moment(item.opt.start).subtract(1, 'days');
            let end = moment().add(item.opt.limit[0], item.opt.limit[1]);
            if(moment(date).isBetween(start, end)){
              return false;
            } else {
              return true;
            }
          }
        } else {
          return false;
        }
      }
    }
  }
};
</script>
<style lang="scss">
.app-form {
  .el-form {
    margin: 0 auto;
    max-width: 1100px;
    .el-form-item {
      display: flex;
      justify-content: flex-start;
    }
    .el-form-item::before,
    .el-form-item::after {
      display: none !important;
    }
    .el-form-item__label {
      flex: 0.13;
    }
    .el-form-item__content {
      margin: 0;
      flex: 1;
    }
    .item-box-50 {
      display: inline-block;
      width: 50%;
      .el-form-item__label {
        flex: 0.3;
      }
    }

    .item-box-33 {
      display: inline-block;
      width: 33%;

      .el-form-item__label {
        flex: none;
        width: 100px;
      }
    }

    .item-box {
      width: 100%;
    }
    .input-link input {
      color: #409eff !important;
      cursor: pointer !important;
    }

    .item-hidden {
      visibility: hidden;
      width: 0;
      height: 0;
      overflow: hidden;
    }

    .img-list {
      white-space: nowrap;
      overflow-x: auto;

      img {
        margin-right: 10px;
        height: 160px;
        cursor: pointer;
      }
    }

    .img {
      img {
        max-width: 500px;
        cursor: pointer;
      }
    }

    .table {

      .el-form {
        border-bottom: solid 1px #ddd;
        border-left: solid 1px #ddd;
        .el-col {
          border-right: solid 1px #ddd;

          .el-form-item__error {
            display: none;
          }
        }
      }
    }

    .table__header {
      background-color: #eeeeee;
      .el-col {
        padding: 0 10px;
      }
    }

    .table__row {
      display: -webkit-box;

      .el-form {
        display: -webkit-box;
      }
      .el-col {
        float: initial;
        -webkit-box-flex: 1;
        color: #606266;
        font-size: 14px;
        text-align: center;

        .el-form-item__content {
          line-height: initial;
        }
        
        input {
          vertical-align: middle;
          padding: 0 10px;
          width: 90%;
          height: 30px;
          box-sizing: border-box;
          border: none;
          border-right: none;
          text-align: center;
          border-bottom: none;
        }
        .el-input-number--mini {
          position: relative;
          left: -1px;
          width: 100%;
          border: none;
          height: 28px;
          border-bottom: none;
        }
        .el-input--mini {
          input {
            border: none;
            height: 27px;
          }
        }
      }
      // .el-col:nth-last-child(2) {
      //   input {
      //     border-right: solid 1px #ccc !important;
      //   }
      // }
      .table__action {
        position: absolute;
        top: 5px;
        right: -35px;
        font-size: 30px;
        cursor: pointer;
      }
      .el-icon-circle-plus {
        color: #67c23a;
        right: -70px;
      }
      .el-icon-remove {
        color: #f56c6c;
      }
    }

    .not_table__action {
      position: absolute;
      top: 5px;
      right: -35px;
      font-size: 30px;
      cursor: pointer;
      color: #67c23a;
      right: -70px;
    }

    .el-upload {
      border: 1px dashed #d9d9d9;
      border-radius: 6px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
    }

    .el-upload:hover {
      border-color: #409eff;
    }

    .avatar-uploader-icon {
      font-size: 28px;
      color: #8c939d;
      width: 178px;
      height: 178px;
      line-height: 178px;
      text-align: center;
    }

    .avatar {
      width: 178px;
      height: 178px;
      display: block;
    }

    .disabled-box {
      position: absolute;
      z-index: 99;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
    }

    .map-container {
      height: 300px;
    }

    .map-util {
      input {
        margin-top: 22px;
      }
    }

    .img-upload-alt {
      font-size: 12px;
      color: #999;
    }
  }
  .form-item_subTitle {
    position: relative;
    top: 30px;
    margin-bottom: 10px;
    left: -30px;
    font-size: 12px;
    color: #999;
    margin-left: 0;
  }
  .el-range-input {
    color: #333 !important;
    cursor: default !important;
  }
  .el-range-editor {
    cursor: default !important;
  }
}
.select-subLabel {
  float: right;
  font-size: 12px;
  color: #999;
}
</style>
