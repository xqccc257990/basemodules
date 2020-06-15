export default {
    install: function (Vue) {

        //内存缓存
        let _cache = {};

        /**
         * 本地缓存方法
         */
        Vue.prototype.cache = {
            set(key, data) {
                if (typeof data == "object") {
                    sessionStorage.setItem(key, JSON.stringify(data));
                } else {
                    sessionStorage.setItem(key, data);
                }
                return data;
            },
            get(key, defaultValue) {
                let _value = sessionStorage.getItem(key);
                if (_value) {
                    let data = null;
                    if (['{', '['].indexOf(_value.charAt(0)) != -1 && ['}', ']'].indexOf(_value.charAt(_value.length - 1)) != -1) {
                        data = JSON.parse(_value);
                    } else {
                        data = _value
                    }
                    return data;
                } else if (typeof defaultValue != 'undefined') {
                    this.set(key, defaultValue);
                    return defaultValue;
                } else {
                    return null;
                }
            },
            del(key) {
                let data = this.get(key);
                sessionStorage.removeItem(key);
                return data;
            },
            setLS(key, data) {
                if (typeof data == "object") {
                    localStorage.setItem(key, JSON.stringify(data));
                } else {
                    localStorage.setItem(key, data);
                }
                return data;
            },
            getLS(key, defaultValue) {
                let _value = localStorage.getItem(key);
                if (_value) {
                    let data = null;
                    if (['{', '['].indexOf(_value.charAt(0)) != -1 && ['}', ']'].indexOf(_value.charAt(_value.length - 1)) != -1) {
                        data = JSON.parse(_value);
                    } else {
                        data = _value
                    }
                    return data;
                } else if (typeof defaultValue != 'undefined') {
                    this.setLS(key, defaultValue);
                    return defaultValue;
                } else {
                    return null;
                }
            },
            delLS(key) {
                let data = this.getLS(key);
                localStorage.removeItem(key)
                return data;
            },
            setR(key, data) {
                _cache[key] = data;
            },
            getR(key, defaultValue) {
                let _value = _cache[key];
                if (_value) {
                    return _value;
                } else if (typeof defaultValue != 'undefined') {
                    this.setR(key, defaultValue);
                    return defaultValue;
                } else {
                    return null;
                }
            },
            delR(key) {
                if (_cache.hasOwnProperty(key)) {
                    delete _cache[key];
                }
            }
        }
    }
}