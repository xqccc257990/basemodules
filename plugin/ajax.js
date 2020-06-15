import axios from 'axios';
import {
    Message,
    Loading
} from 'element-ui';
import qs from 'qs'; // 根据需求是否导入qs模块

export default {
    install: function (Vue, router) {

        let instance = axios.create({
            timeout: 15000, //超时限制
            baseURL: Vue.config.BASE_URL
        });

        let reqMark = {}; //记录正在等待响应的请求，限制重复

        /**
         * opt 
         * isUseResponse 返回整个响应给具体调用
         * isUnToken 是否不传tokken
         * isLoading 是否显示加载动画
         * token 使用指定token
         */
        Vue.prototype.post = function (url, dto, opt) {

            return new Promise(function (resolve, reject) {

                let dtoStr = '';
                if (dto) {
                    dtoStr = JSON.stringify(dto).replace(/[^a-z|A-Z|0-9]/g, "");
                }

                let _url = url.replace(/[^a-z|A-Z|0-9]/g, "")
                let vailStr = _url + dtoStr;

                if (reqMark[vailStr]) {
                    return console.warn('重复的请求，已阻止请求。', url);
                } else {
                    reqMark[vailStr] = 1;
                }

                let config = {}

                if (opt && opt.token) {
                    config[Vue.config.TOKEN_NAME] = opt.token;
                } else {
                    config[Vue.config.TOKEN_NAME] = localStorage.getItem('token') || sessionStorage.getItem('token');
                }

                if (opt && opt.isUnToken) {
                    delete config[Vue.config.TOKEN_NAME]
                }

                if (opt && opt.contentType) {
                    config['Content-Type'] = opt.contentType
                    switch (opt.contentType) {
                        case 'application/x-www-form-urlencoded':
                            var form = new FormData();
                            for (var key in dto) {
                                form.append(key, dto[key])
                            }
                            dto = form;
                            break;
                        default:
                            break;
                    }
                }

                if (opt && opt.isMultipart) {
                    let formData = new FormData();
                    for (let i in dto) {
                        formData.append(i, dto[i]);
                    }
                    dto = formData;
                }

                let loadingInstance = null;
                if (opt && opt.isLoading) {
                    loadingInstance = Loading.service({
                        customClass: 'ajax__loading'
                    });
                }
                instance({
                    method: "post",
                    url: url,
                    data: dto,
                    headers: config,
                    responseType: opt && opt.responseType ? opt.responseType : 'json'
                }).then((res) => {
                    delete reqMark[vailStr];
                    if (loadingInstance) {
                        loadingInstance.close();
                    }
                    if (Vue.config.interceptors.response(res)) {
                        if (opt && opt.isUseResponse) {
                            resolve(res);
                        } else {
                            resolve(res.data.data);
                        }
                    } else {
                        if (!opt || !opt.isNotShowError) {
                            Message({
                                message: res.data.msg,
                                type: "warning"
                            });
                            reject(res);
                        } else {
                            reject(res);
                        }
                    }
                }).catch(function (error) {
                    delete reqMark[vailStr];
                    console.error('post fail !', error)
                    Message({
                        message: '服务器繁忙',
                        type: "error"
                    });
                    reject(error);
                });
            })
        }
        Vue.prototype.get = function (url, dto, opt) {
            return new Promise(function (resolve, reject) {

                let dtoStr = '';
                if (dto) {
                    dtoStr = JSON.stringify(dto).replace(/[^a-z|A-Z|0-9]/g, "");
                }

                let _url = url.replace(/[^a-z|A-Z|0-9]/g, "")
                let vailStr = _url + dtoStr;

                if (reqMark[vailStr]) {
                    return console.warn('重复的请求，已阻止请求。', url);
                } else {
                    reqMark[vailStr] = 1;
                }

                let config = {}

                if (opt && opt.token) {
                    config[Vue.config.TOKEN_NAME] = opt.token;
                } else {
                    config[Vue.config.TOKEN_NAME] = localStorage.getItem('token') || sessionStorage.getItem('token');
                }

                if (opt && opt.isUnToken) {
                    delete config[Vue.config.TOKEN_NAME]
                }

                if (opt && opt.contentType) {
                    config['Content-Type'] = opt.contentType
                    switch (opt.contentType) {
                        case 'application/x-www-form-urlencoded':
                            var form = new FormData();
                            for (var key in dto) {
                                form.append(key, dto[key])
                            }
                            dto = form;
                            break;
                        default:
                            break;
                    }
                }

                if (opt && opt.isMultipart) {
                    let formData = new FormData();
                    for (let i in dto) {
                        formData.append(i, dto[i]);
                    }
                    dto = formData;
                }

                let loadingInstance = null;
                if (opt && opt.isLoading) {
                    loadingInstance = Loading.service({
                        customClass: 'ajax__loading'
                    });
                }

                instance({
                    method: "get",
                    url: url,
                    data: dto,
                    headers: config
                }).then((res) => {
                    delete reqMark[vailStr];
                    if (loadingInstance) {
                        loadingInstance.close();
                    }
                    if (Vue.config.interceptors.response(res)) {
                        if (opt && opt.isUseResponse) {
                            resolve(res);
                        } else {
                            resolve(res.data.data);
                        }
                    } else {
                        if (!opt || !opt.isNotShowError) {
                            Message({
                                message: res.data.msg,
                                type: "warning"
                            });
                            reject(res);
                        } else {
                            reject(res);
                        }
                    }
                }).catch(function (error) {
                    delete reqMark[vailStr];
                    console.error('post fail !', error)
                    Message({
                        message: '服务器繁忙',
                        type: "error"
                    });
                    reject(error);
                });
            })
        }
    }
}