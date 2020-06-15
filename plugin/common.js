export default {
    install: function (Vue, router) {

        //公用返回方法
        Vue.prototype.$back = function () {
            router.go(-1)
        }

        //时间格式化显示
        Vue.prototype.format = function (time, type) {
            if (type) {
                let ret = '';
                switch (type) {
                    case 1:
                        ret = moment(time).format("YYYY-MM-DD");
                        break;
                    default:
                        ret = moment(time).format("YYYY-MM-DD hh:mm:ss");
                        break;
                }
                return ret;
            } else {
                return moment(time).format("YYYY-MM-DD HH:mm:ss");
            }
        }

        let telCatalog = {};

        //调用机制
        Vue.prototype.$tel = {
            call(mark, cb) {
                if (mark && typeof mark == 'string' && telCatalog.hasOwnProperty(mark) && typeof cb == 'function') {
                    telCatalog[mark](cb);
                }
            },
            wait(mark, cb) {
                if (mark && typeof mark == 'string' && typeof cb == 'function') {
                    telCatalog[mark] = cb;
                }
            }
        }

        let map = {};

        //伪事件调用
        Vue.prototype.$evt = {
            on(name, cb) {
                if (name && typeof name == 'string' && typeof cb == 'function') {
                    map[name] = cb;
                }
            },
            fire(name, data) {
                if (name && typeof name == 'string' && map.hasOwnProperty(name)) {
                    map[mark](data);
                }
            },
            listen(name, cb) {
                if (name && typeof name == 'string' && typeof cb == 'function') {
                    if (!map[name]) {
                        map[name] = [cb];
                    } else {
                        map[name].push(cb);
                    }
                }
            },
            dispatch(name, data) {
                if (name && typeof name == 'string' && map.hasOwnProperty(name)) {
                    for (let i = 0; i < map[name].length; i++) {
                        map[name][i](data);
                    }
                }
            }
        }

        //常用正则表达式
        Vue.prototype.$pattern = {
            Az09: {
                val: /[^A-z0-9]/g,
                label: '只能包含大小写字母与数字'
            },
            zhAz09: {
                val: /[^\u4E00-\u9FA5A-z0-9]/g,
                label: '只能包含大小写字母与数字、中文'
            },
            _09: {
                val: /[^0-9]/g,
                label: '只能包含数字'
            },
            point09: {
                val: /[^0-9|.]/g,
                label: '只能包含数字与小数点'
            },
        }

        //列转树方法
        Vue.prototype.listToTree = function (list, opt) {
            for (let i = 0; i < list.length; i++) {
                let item = list[i];
                if (item.parentId) {
                    for (let j = 0; j < list.length; j++) {
                        let it = list[j];
                        if (it.id == item.parentId) {
                            if (it.children) {
                                it.children.push(item)
                            } else {
                                it.children = [item];
                            }
                            break;
                        }
                    }
                }
            }
            let topList = [];
            for (let i = 0; i < list.length; i++) {
                let item = list[i];
                if (!item.parentId) {
                    topList.push(item);
                }
            }
            return topList;
        }
    }
}