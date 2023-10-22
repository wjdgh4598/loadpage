var Ustra = Ustra || {};

_.templateSettings.interpolate = /{{([\S]+?)}}/g;
Ustra = (function() {

    function _browserCheck(options) {
        options = options || {
            denyIE: false,
            allowIE11: false
        };
        var type = _getBrowserType();
        if(options.denyIE === true) {
            if(type === "ie" || (type === "ie11" && (options.allowIE11 === false))) {
                alert('Microsoft IE는 보안 서비스 지원이 곧 종료되므로 안전한 브라우저로의 전환을 권장합니다.');
                if(self != top) {
                    window.parent.location.replace('about:blank');
                }
                else {
                    window.location.replace('about:blank');
                }
                var url = new URL(window.location, window.location);
                window.open("microsoft-edge:" + url.toString());
            }
        }
    }

    function _getBrowserType() {
        // Opera 8.0+
        var isOpera = (!!window.opr && !!opr.addons) || !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0;
        // Firefox 1.0+
        var isFirefox = typeof InstallTrigger !== 'undefined';
        // Safari 3.0+ "[object HTMLElementConstructor]"
        var isSafari = /constructor/i.test(window.HTMLElement) || (function (p) { return p.toString() === "[object SafariRemoteNotification]"; })(!window['safari'] || (typeof safari !== 'undefined' && window['safari'].pushNotification));
        // Internet Explorer 6-11
        var isIE = /*@cc_on!@*/false || !!document.documentMode;
        // Internet Explorer 11
        var isIE11 = isIE && (navigator.userAgent.toLowerCase().indexOf("rv:11.0") !== -1);
        // Edge 20+
        var isEdge = !isIE && !!window.StyleMedia;
        // Chrome 1 - 79
        var isChrome = !!window.chrome && (!!window.chrome.webstore || !!window.chrome.runtime);
        // Edge (based on chromium) detection
        var isEdgeChromium = isChrome && (navigator.userAgent.indexOf("Edg") != -1);

        if(isEdge || isEdgeChromium) return "edge";
        if(isOpera) return "opera";
        if(isFirefox) return "firefox";
        if(isSafari) return "safari";
        if(isIE11) return "ie11";
        if(isIE) return "ie";
        if(isChrome) return "chrome";
        return "unknown";
    }

    function _versionCheck() {
        // 1. MD5 Hash Version 가져오기.
        fetch("/api/messages-version")
            .then(function(response) {
                return response.text();
            })
            .then(function(serverHash) {
                // 2. DB의 HASH와 다르면 전체 데이터 갖고온 후 DB 업데이트
                var dbHash = sessionStorage.getItem("VERSION_HASH") || "";
                if(dbHash !== serverHash) {
                    _updateMessageDB(serverHash);
                }
            });
    }

    function _updateMessageDB(serverHash) {
        // 1. 전체 데이터 가져오기.
        fetch("/api/messages")
            .then(function(response) {
                return response.json();
            })
            .then(function(messages) {
                if(!_.isEmpty(messages)) {
                    messages = messages.map(function(message) {
                        return {
                            code: message.messageCode,
                            message: message.messageName
                        };
                    });

                    sessionStorage.setItem("VERSION_HASH", serverHash);
                    sessionStorage.setItem("MESSAGES", JSON.stringify(messages));
                }
            });
    }

    function _getMessage(messageCode) {
        var messages = JSON.parse(sessionStorage.getItem("MESSAGES") || "{}");
        return (_.find(messages, { code: messageCode }) || {}).message;
    }

    function Ustra() {
        _versionCheck();
        return this;
    };
    Ustra.prototype = Object.create(this);
    Ustra.prototype.constructor = Ustra;
    Ustra.prototype._browserCheck = _browserCheck;
    Ustra.prototype._getChildNodes = function(element) {
        return Array.from((element.content && element.content.childNodes) || element.childNodes || []);
    };
    Ustra.prototype.ajax = function(method, url, data, callback) {
        var formData = undefined;
        if(!_.isEmpty(data)) {
            formData = new FormData();
            for(var key in data) {
                formData.append(key, data[key]);
            }
        }

        fetch(url, { method: method, body: formData })
            .then(function(response) {
                return response.json();
            })
            .then(function(json) {
                if(callback) {
                    callback(json);
                }
            })
            .catch(function(error) {
            });
    };
    Ustra.prototype.get = function(url, data, callback) {
        url = new URL(url, window.location);
        url.search = new URLSearchParams(data).toString();
        this.ajax("GET", url, undefined, callback);
    };
    Ustra.prototype.post = function(url, data, callback) {
        this.ajax("POST", url, data, callback);
    };
    Ustra.prototype.put = function(url, data, callback) {
        this.ajax("PUT", url, data, callback);
    };
    Ustra.prototype.delete = function(url, data, callback) {
        this.ajax("DELETE", url, data, callback);
    };
    Ustra.prototype.getMessage = function(defaultMessage, messageCode) {
        if(_.isEmpty(messageCode)) {
            return defaultMessage;
        }

        var message = _getMessage(messageCode);
        if(_.isEmpty(message)) {
            return defaultMessage;
        }

        return message;
    };
    Ustra.prototype.create_ID = function() {
        return '_' + Math.random().toString(36).substr(2, 10);
    };
    Ustra.prototype.create_UUID = function() {
        var dt = new Date().getTime(),
            uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                var r = (dt + Math.random() * 16) % 16 | 0;
                dt = Math.floor(dt / 16);
                return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
            });
        return uuid;
    };
    const _ustraObj = new Ustra();

    (function(funcName, baseObj) {
        "use strict";
        // The public function name defaults to window.docReady
        // but you can modify the last line of this function to pass in a different object or method name
        // if you want to put them in a different namespace and those will be used instead of
        // window.docReady(...)
        funcName = funcName || "docReady";
        baseObj = baseObj || window;
        var readyList = [];
        var readyFired = false;
        var readyEventHandlersInstalled = false;

        // call this when the document is ready
        // this function protects itself against being called more than once
        function ready() {
            if (!readyFired) {
                // this must be set to true before we start calling callbacks
                readyFired = true;
                for (var i = 0; i < readyList.length; i++) {
                    // if a callback here happens to add new ready handlers,
                    // the docReady() function will see that it already fired
                    // and will schedule the callback to run right after
                    // this event loop finishes so all handlers will still execute
                    // in order and no new ones will be added to the readyList
                    // while we are processing the list
                    readyList[i].fn.call(window, readyList[i].ctx);
                }
                // allow any closures held by these functions to free
                readyList = [];
            }
        }

        function readyStateChange() {
            if ( document.readyState === "complete" ) {
                ready();
            }
        }

        // This is the one public interface
        // docReady(fn, context);
        // the context argument is optional - if present, it will be passed
        // as an argument to the callback
        baseObj[funcName] = function(callback, context) {
            if (typeof callback !== "function") {
                throw new TypeError("callback for docReady(fn) must be a function");
            }
            // if ready has already fired, then just schedule the callback
            // to fire asynchronously, but right away
            if (readyFired) {
                setTimeout(function() {callback(context);}, 1);
                return;
            } else {
                // add the function and context to the list
                readyList.push({fn: callback, ctx: context});
            }
            // if document already ready to go, schedule the ready function to run
            // IE only safe when readyState is "complete", others safe when readyState is "interactive"
            if (document.readyState === "complete" || (!document.attachEvent && document.readyState === "interactive")) {
                setTimeout(ready, 1);
            } else if (!readyEventHandlersInstalled) {
                // otherwise if we don't have event handlers installed, install them
                if (document.addEventListener) {
                    // first choice is DOMContentLoaded event
                    document.addEventListener("DOMContentLoaded", ready, false);
                    // backup is window load event
                    window.addEventListener("load", ready, false);
                } else {
                    // must be IE
                    document.attachEvent("onreadystatechange", readyStateChange);
                    window.attachEvent("onload", ready);
                }
                readyEventHandlersInstalled = true;
            }
        }
    })("docReady", _ustraObj);
    // modify this previous line to pass in your own method name
    // and object for the method to be attached to
    return _ustraObj;
}.call(Ustra));

function convertToListItemData(listItemList) {
    return listItemList.map(function(item){
        item.text  = convertNull(item.text) || convertNull(item.cmmCodNm) || convertNull(item.codeNameHan) || convertNull(item.coNm);
        item.label = convertNull(item.text);
        item.value = convertNull(item.value) || convertNull(item.cmmCodCl) || convertNull(item.baseCode) || convertNull(item.coId);
        return item;
    });
};

function convertNull(value){

    return (value === undefined || value == null) ? "" : value;

}


/**
 *  문법에 맞는 조사를 추가 [은, 는, 이, 가, 을, 를, 와, 과]
 *  ex) addProperJosa("생년월일", "를") >> "생년월일을"
 */
function addProperJosa(word, josa) {
    var code = word.charCodeAt(word.length - 1) - 44032;

    // existJong: 받침있음(true), 받침없음(false)
    var existJong = code % 28 !== 0;

    return word + getJosa(josa, existJong);
};

function getJosa(josa, existJong) {
    if (josa == "을" || josa == "를") return existJong ? "을" : "를";
    if (josa == "이" || josa == "가") return existJong ? "이" : "가";
    if (josa == "은" || josa == "는") return existJong ? "은" : "는";
    if (josa == "와" || josa == "과") return existJong ? "와" : "과";

    return "";
};

function convertTreeData(dataList, id, parent, rootValue, child) {
    var dataMap = {};
    var treeList = [];
    rootValue = rootValue || "";
    child     = child || "_children";

    for (var idx in dataList) {
        var item = dataList[idx];
        var key = item[id];
        dataMap[key] = item;
    }

    for (var idx in dataList) {
        var item = dataList[idx];
        var key = item[id];

        var data = dataMap[key];
        var parentKey = data[parent];
        if(_.isEmpty(parentKey) || parentKey == rootValue) {
            treeList.push(data);
            continue;
        }
        var parentData = dataMap[parentKey];
        if (parentData && !parentData[child]) {
            parentData[child] = []
        }
        if (parentData) {
            parentData[child].push(data);
        }
    }

    for (var key in dataMap) {
        var data = dataMap[key];
        var parentKey = data[parent];

        var parentData = dataMap[parentKey];
        if (typeof parentData == 'undefined') {
            var exists = treeList.filter(function(item) {
                return item[id] == data[id];
            }).length > 0;
            if(!exists) {
                treeList.push(data);
            }
        }
    }
    var obj = {};
    obj[child] = treeList;
    return obj;
};

if(typeof Number.prototype.format === "undefined") {
    /**
     * 숫자용 format 함수
     * 12345.0002 -> "12,345.0002"
     */
    Number.prototype.format = function (scale) {
        var reg = /(^[+-]?\d+)(\d{3})/,
            n = this;

        if(typeof scale === 'number') {
            var pow = Math.abs(scale);
            if(scale > 0) {
                n = Number(Math.round(n+'e'+pow)+'e-'+pow);
            }
            else {
                n = Number(Math.round(n+'e-'+pow)+'e'+pow);
            }
        }

        n = (n + '');
        while (reg.test(n)) n = n.replace(reg, '$1' + ',' + '$2');

        if(typeof scale === 'number') {
            if(scale > 0) {
                n += (n.includes('.') ? '' : '.');
                n += _.padEnd('',scale-n.split('.')[1].length,'0');
            }
        }

        return n;
    };
}

// 문자열 타입에서 쓸 수 있도록 format() 함수 추가
if(typeof String.prototype.format === "undefined") {
    String.prototype.format = function(){
        var num = parseFloat(this);
        if( isNaN(num) ) return "0";

        return num.format();
    };
}



if(typeof Date.prototype.format === "undefined") {
    Date.prototype.format = function(f) {
        if (!this.valueOf()) return " ";

        var weekName = ["일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일"],
            d = this;

        return f.replace(/(yyyy|yy|MM|dd|E|hh|mm|ss|a\/p)/gi, function($1) {
            switch ($1) {
                case "yyyy": return d.getFullYear();
                case "yy": return _.padStart(d.getFullYear() % 1000, 2, '0');
                case "MM": return _.padStart(d.getMonth() + 1, 2, '0');
                case "dd": return _.padStart(d.getDate(), 2, '0');
                case "E": return weekName[d.getDay()];
                case "HH": return _.padStart(d.getHours(), 2, '0');
                case "hh": return _.padStart(((h = d.getHours() % 12) ? h : 12), 2, '0');
                case "mm": return _.padStart(d.getMinutes(), 2, '0');
                case "ss": return _.padStart(d.getSeconds(), 2, '0');
                case "a/p": return d.getHours() < 12 ? "오전" : "오후";
                default: return $1;
            }
        });
    };
}
if(typeof Date.prototype.setDatetime === "undefined") {
    Date.prototype.setDatetime = function(s) {
        if (!this.valueOf()) return this;

        if(Object.prototype.toString.call(s) === "[object String]") {
            s = s.trim();
            if(s.length == 14) {
                //20200420160000
                this.setFullYear(s.substr(0, 4), s.substr(4, 2) - 1, s.substr(6, 2));
                this.setHours(s.substr(8, 2), s.substr(10, 2), s.substr(12, 2));
            }
            else if(s.length == 19) {
                //2020-04-20 16:00:00
                this.setFullYear(s.substr(0, 4), s.substr(5, 2) - 1, s.substr(8, 2));
                this.setHours(s.substr(11, 2), s.substr(14, 2), s.substr(17, 2));
            }
            else if(s.length == 16) {
                //2020-04-20 16:00
                this.setFullYear(s.substr(0, 4), s.substr(5, 2) - 1, s.substr(8, 2));
                this.setHours(s.substr(11, 2), s.substr(14, 2), 0);
            }
            else if(s.length == 8) {
                //20200420
                this.setFullYear(s.substr(0, 4), s.substr(4, 2) - 1, s.substr(6, 2));
                this.setHours(0, 0, 0);
            }
            else if(s.length == 10) {
                //2020-04-20
                this.setFullYear(s.substr(0, 4), s.substr(5, 2) - 1, s.substr(8, 2));
                this.setHours(0, 0, 0);
            }
            else if(s.length == 6) {
                //202004
                this.setFullYear(s.substr(0, 4), s.substr(4, 2) - 1, 1);
                this.setHours(0, 0, 0);
            }
            else if(s.length == 7) {
                //2020-04
                this.setFullYear(s.substr(0, 4), s.substr(5, 2) - 1, 1);
                this.setHours(0, 0, 0);
            }
            else if(s.length == 4) {
                //2020
                this.setFullYear(s.substr(0, 4), 0, 1);
                this.setHours(0, 0, 0);
            }
        }
        else if(Object.prototype.toString.call(s) === "[object Date]") {
            this.setTime(s.getTime());
        }

        return this;
    }
}

function openPop(url, options) {
    if(self != top) {
        window.parent.openPop(url, options);
        return;
    }
    var container = document.getElementById("popup-container");
    if(container instanceof HTMLDivElement === false) {
        container = document.createElement("div");
        container.id = "popup-container";
        container.className = "popup-container";
        container.style.opacity = "0";
        container.style.display = "none";
        document.body.appendChild(container);
    }
    container.innerHTML = "";

    var popId = _.camelCase(_.nth(_.split(url, "/"), -2));

    if(!_.isEmpty(window[popId])) {
        window[popId].open(options);
    }
    else {
        fetch(url)
            .then(function(response) {
                return response.text();
            })
            .then(function(text) {
                container.innerHTML = text;
                Ustra.docReady(function() {
                    Array.from(container.querySelectorAll("script")).forEach(function(item) {
                        eval.apply(this, [item.textContent]);
                    });
                    if(!_.isEmpty(window[popId])) {
                        window[popId].open(options);
                    }
                }, container);
            });
    }
}
