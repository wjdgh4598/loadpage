/**
 * 공통기능 Function
 */

var $_key = "Led Zeppelin- Stairway to Heaven";
var obj = new Object();

/**
 * 공통코드검색 후 Callback 호출
 */
obj.cmmcodeSet = function() {
    this.searchParam = {}
    this.fv_ajaxCallback = null;
};
obj.cmmcodeSet.prototype = {
    setCallback: function (callBack) {
        this.fv_ajaxCallback = callBack;
    },
    addParam: function(value) {
        this.searchParam = value;
    },
    ajax: function () {
        var that = this;

        $.ajax({
            type : "POST",
            contentType: "application/json; charset=utf-8",
            url : "/api/setbasecode",
            data : JSON.stringify(that.searchParam),
            dataType: 'json',
            cache: false,
            timeout: 600000,
            async : true,
            beforeSend : function(xmlHttpRequest) {
                $("body").css("cursor", "wait");
                xmlHttpRequest.setRequestHeader("GSAJAX", "true");
            },
            success : function(data, status, jqXHR) {
                if(typeof(that.fv_ajaxCallback) == "function"){
                    that.fv_ajaxCallback(data);
                }
                else {
                    eval(that.fv_ajaxCallback + "(data);");
                }
            },
            complete:function(){
                $("body").css("cursor", "auto");
            }
        }).fail(function (jqXHR, textStatus, errorThrown){
            if (jqXHR.status === 401) {
                console.log(jqXHR.status);
                switch (jqXHR.responseJSON.message) {
                    case "ko":
                        alert("요청한 내용은 로그인 후 사용할 수 있는 기능입니다.");
                        break;
                    case "en":
                        alert("The requested content is a function that can be used only after login.");
                        break;
                    default :
                        alert("요청한 내용은 로그인 후 사용할 수 있는 기능입니다.\nThe requested content is a function that can be used only after login.");
                        break;
                }
                return false;
            } else {
                alert(jqXHR.responseJSON.message);
                console.log(jqXHR.status);
                return false;
            }
        });
    }
};

// 페이지 보여주기 애니메이션
$(document).ready(showPage);
// 페이지 이동시 로딩바 표시(링크)
$(window).on('beforeunload', showPageLoading);

function showPage() {
    hidePageLoading();
    document.body.style.display = 'block';
}

function showPageLoading() {
    $('#app').css({ overflowY: 'hidden', 'height': '900rem'  });
    $('#page-loading').show();
}

function hidePageLoading() {
    $('#page-loading').hide();
}

/**
 * @desc      : select tag의 option을 추가해준다.
 * @comment   :
 * @param     : options  - selectedVal : 초기 select의 선택값
 *                       - callback    : select를 생성후 처리할 callback funtion명
 *                       - value       : select의 option의 value
 *                       - text        : select의 option의 text  <option value="1">text</option>
 *                       - dataList    : 조회된 data
 */
$.fn.addOptions = function(options) {
    $(this).find("option").remove();

    if (!options) {
        alert("parameter가 없습니다.");
        return false;
    }

    var placeholder = $(this).data("placeholder");
    let startOptIdx = 0;
    if (placeholder) {
        $(this).append($("<option>", {value: "", text: placeholder}));
        startOptIdx = 1;
    }

    if (options.placeholder) {
        $(this).append($("<option>", {value: "", text: options.placeholder}));
        startOptIdx = 1;
    }

    for (var index = 0; index < options.dataList.length; index++) {
        $(this).append($("<option>", {value: options.dataList[index][options.value], text: options.dataList[index][options.text], data: options.dataList[index]} ));
    }
    
  	if (options.dataAttr) {
		for (var index = 0; index < options.dataList.length; index++) {
			$(this).find("option:eq("+ (index+startOptIdx)+")").attr('data-'+options.dataAttr.key,options.dataList[index][options.dataAttr.value]);
		}
	}
    
  	if (options.dataAttrList) {
		for (var index = 0; index < options.dataList.length; index++) {
		    for (var attrIdx = 0; attrIdx < options.dataAttrList.length; attrIdx++) {
				$(this).find("option:eq("+ (index+startOptIdx)+")").attr('data-'+options.dataAttrList[attrIdx].key,options.dataList[index][options.dataAttrList[attrIdx].value]);
		    }
		}
	}
	
    if (options.selectedVal) {
        $(this).val(options.selectedVal);
        if ($(this).val() == null && options.placeholder) {
            $(this).val("");
        }
    } else {
        $(this).trigger("chosen:updated");
    }

    if($(this).is('[multiple="multiple"]') && typeof $.fn.multipleSelect == 'function') {
        if($(this).data().hasOwnProperty('multipleSelect')) {
            $(this).multipleSelect('refresh');
        }
        else {
            var opt = {};
            Array.from($(this)[0].attributes).filter(function(item) {
                return item.nodeName.startsWith('multiple-');
            }).forEach(function(item) {
                opt[item.nodeName.substr(9)] = item.value;
            });
            $(this).multipleSelect(opt);
        }
    }

    if (typeof(options.onChange) == "function") {
        $(this).off('change').on('change', function(event){
            options.onChange.call(this, event);
        });
    }

    if (options.callback) {
        if(typeof(options.callback) == "function"){
            options.callback();
        }
        else {
            eval(options.callback);
        }
    }
};

/**
 * @desc      : radio태그를 생성한다.
 * @comment   :
 * @param     : options  - selectedVal : 초기 select의 선택값
 *                       - value       : 라디오 value
 *                       - text        : 라디오 label
 *                       - name        : 라디오 name 값
 *                       - dataList    : 조회된 data
 *                       - callback    : 라디오를 생성후 처리할 callback funtion명
 *                       - onChange    : 라디오 값을 변경할 때 호출할 funtion
 */
$.fn.addRadio = function(options) {
    $(this).empty();

    if (!options) {
        alert("parameter가 없습니다.");
        return false;
    }

    var dataList = options.dataList;
    var labelKey = options.text;
    var valueKey = options.value;
    var name = options.name;
    var TEMPLATE = '<label for="{{id}}">{{text}}</lable>'
                 + '<input type="radio" id="{{id}}" name="{{name}}" value="{{value}}">';

    /*
     * ITSM 퍼블리싱에 맞는 Radio Template 추가
     * 2020-10-19 juhyeon
     */
    var TEMPLATE = '<label class="radio">'
                 + '<input type="radio" id="{{id}}" name="{{name}}" class="{{name}}" value="{{value}}">'
                 + '<div class="input_button"></div>'
                 + '<span>{{text}}</span>'
                 + '</label>';

    for (var index = 0; index < dataList.length; index++) {
        var data = dataList[index];
        $(this).append(
            TEMPLATE.replace(/{{id}}/g, (name+index))
                    .replace(/{{name}}/g, name)
                    .replace(/{{text}}/g, data[labelKey])
                    .replace(/{{value}}/g, data[valueKey])
        );
    }

    if (options.selectedVal) {
        $('input:radio[name="' + name + '"][value="' + options.selectedVal + '"]').prop('checked', true);
    } else { // 없으면 첫번째
        $('input:radio[name="' + name + '"]:first').prop('checked', true);
    }

    if (typeof(options.onChange) == "function") {
        $(this).on('change', function(event){
            options.onChange.call(this, event);
        });
    }

    if (options.callback) {
        if(typeof(options.callback) == "function"){
            options.callback();
        }
        else {
            eval(options.callback);
        }
    }
};

$.fn.addCheck = function(options) {
    $(this).empty();

    if (!options) {
        alert("parameter가 없습니다.");
        return false;
    }

    var dataList = options.dataList;
    var labelKey = options.text;
    var valueKey = options.value;
    var name = options.name;

    var TEMPLATE = ''
		+ '<label class="checkbox">'
		+ '  <input type="checkbox" id="{{id}}" name="{{name}}" class="{{name}} check-input" value="{{value}}" checked data-unchecked="">'
		+ '  <div class="input_button"></div>'
		+ '  <span>{{text}}</span>'
		+ '</label>';

    for (var index = 0; index < dataList.length; index++) {
        var data = dataList[index];
        $(this).append(
            TEMPLATE.replace(/{{id}}/g, (name+index))
                    .replace(/{{name}}/g, name)
                    .replace(/{{text}}/g, data[labelKey])
                    .replace(/{{value}}/g, data[valueKey])
        );
    }

    if (options.callback) {
        if(typeof(options.callback) == "function"){
            options.callback();
        }
        else {
            eval(options.callback);
        }
    }
};

/**
 * @desc      : 파일 드래그 & 드롭
 */
$.fn.fileDrop = function(options) {
    if (!options) {
        alert('parameter가 없습니다.');
        return false;
    }

    var defaultOptions = {
        fileEl: 'files',
        uploadLimit: 1024 * 1024 * 20, // 20M
        extentions: [ 'hwp', 'doc', 'docx', 'ppt', 'pptx', 'xls', 'xlsx', 'jpg', 'jpeg', 'gif', 'png', 'txt', 'zip', 'pdf', 'egg', 'tif', 'tiff' ]

    };

    var that = this;
    var $dropZone = $(this);
    //$dropZone.empty();

    var settings = $.extend({}, defaultOptions, options);
    var fileDropHtml = ''
        + '<colgroup>'
        + '<col>'
        + '<col>'
        + '<col>'
        + '<col>'
        + '<col>'
        + '<col>'
        + '<col>'
        + '<col>'
        + '</colgroup>'
        + '<thead id="fileTableThead" style="display:none;">'
        + '    <tr>'
        + '      <th>'
        + '        <label class="checkbox">'
        + '          <input id="fileCheckAll" type="checkbox" />'
        + '          <div tabindex="0" class="input_button"></div>'
        + '          <span></span>'
        + '        </label>'
        + '      </th>'
        + '      <th colspan="5">파일명</th>'
        + '      <th>파일크기</th>'
        + '      <th></th>'
        + '    </tr>'
        + '</thead>'
        + '<tbody id="fileTableTbody">'
        + '</tbody>'
    /*    + '<tfoot id="fileDragDesc" class="table has-bg-color file-drop-help is-active">'  */
        + '<tfoot id="fileDragDesc" >'
        + '  <td colspan="6" style="height:40rem;text-align:center;color:#999">여기에 파일 끌어서 놓기</td>'
        + '</tfoot>';
    /*
        + '<div id="fileDragDesc"> 파일을 드래그 해주세요. </div>'
        + '<table id="fileListTable">'
        + '    <tbody id="fileTableTbody">'
        + '    </tbody>'
        + '</table>';
    */
    $(this).append(fileDropHtml);

    var fileKey = 0;
    var _info = {
        totalFileSize: 0,
        fileKeys: [],
        files: {}
    };

    // 파일 드롭 다운
    // Drag기능
    $dropZone.on('dragenter', function(e) {
        e.stopPropagation();
        e.preventDefault();
        // 드롭다운 영역 css
        $dropZone.css('background-color', '#E3F2FC');
    });
    $dropZone.on('dragleave', function(e) {
        e.stopPropagation();
        e.preventDefault();
        // 드롭다운 영역 css
        $dropZone.css('background-color', '#FFFFFF');
    });
    $dropZone.on('dragover', function(e) {
        e.stopPropagation();
        e.preventDefault();
        // 드롭다운 영역 css
        $dropZone.css('background-color', '#E3F2FC');
    });
    $dropZone.on('drop', function(e) {
        e.preventDefault();
        // 드롭다운 영역 css
        $dropZone.css('background-color', '#FFFFFF');

        var files = e.originalEvent.dataTransfer.files;
        if (files == null || files.length === 0) {
            return
        }

        that.addFiles(files)
    });

    var $tbody = $dropZone.find('#fileTableTbody');
    // 전체선택
    $dropZone.find('#fileCheckAll').on('change', function(){
        var checked = $(this).prop('checked');
        $tbody.find('input[type="checkbox"]').prop('checked', checked);
    });

    // 개별선택
    $($tbody).on('change', 'input[type="checkbox"]', function(){
        var checked = $(this).prop('checked');
        if (checked === false) {
            $dropZone.find('#fileCheckAll').prop('checked', false);
        } else {
            var allCheckbox = $tbody.find('input[type="checkbox"]');
            if (allCheckbox.length === allCheckbox.filter(':checked').length) {
                $dropZone.find('#fileCheckAll').prop('checked', true);
            }
        }
    });

    // 업로드 파일 목록 생성
    function addFileToList(fileKey, fileName, fileSizeStr) {
        var html = '';
        html += '<tr id="fileTr_' + fileKey + '">';
        html += '  <th>'
        html += '    <label class="checkbox">'
        html += '      <input name="fileItemCheck' + fileKey + '" type="checkbox" value="' + fileKey + '" checked/>'
        html += '      <div tabindex="' + fileKey + '" class="input_button"></div>'
        html += '      <span></span>'
        html += '    </label>'
        html += '  </th>'
        html += '  <td colspan="5">' + fileName + '</td>'
        html += '  <td>' + fileSizeStr + '</td>'
        html += '  <td class="buttons is-centered"><button type="button" class="fileDrop_deleteFile button is-primary is-medium" data-file-key="' + fileKey + '">삭제</button></td>'
        html += '</tr>'

        $tbody.prepend(html);
    }

    // 업로드 파일 삭제
    function deleteFile(fileKey) {
        console.log('deleteFile', fileKey);
        // 전체 파일 사이즈 수정
        _info.totalFileSize -= _info.files[fileKey].fileSize;

        // 파일 정보 삭제
        _info.fileKeys.splice(_info.fileKeys.indexOf(fileKey), 1);
        //delete _info.files[fileKey];
        delete _info.files.fileKey;
        
        // 업로드 파일 테이블 목록에서 삭제
        $dropZone.find('#fileTr_' + fileKey).remove();

        console.log('totalFileSize', _info.totalFileSize);

        if (_info.fileKeys.length > 0) {
            $dropZone.find('#fileDragDesc').hide();
            $dropZone.find('#fileTableThead').show();
            $dropZone.find('#fileTableTbody').show();
            $dropZone.find('#fileCheckAll').prop('checked', false);
        } else {
            $dropZone.find('#fileDragDesc').show();
            $dropZone.find('#fileTableThead').hide();
            $dropZone.find('#fileTableTbody').hide();
        }
    }

    $dropZone.on('click', '.fileDrop_deleteFile', function() {
        var fileKey = $(this).data('fileKey');
        deleteFile(fileKey);
    });

    this.addFiles = function(files) {
        if (files == null && files.length === 0) {
            return
        }

        var fileName;
        var fileNameArr;
        var ext;
        var fileSize;

        // 파일 검사
        for (var i = 0; i < files.length; i++) {
            // 파일 이름
            fileName = files[i].name;
            fileNameArr = fileName.split('\.');
            // 확장자
            ext = fileNameArr[fileNameArr.length - 1];
            ext = ext.toLowerCase();

            fileSize = files[i].size; // 파일 사이즈(단위 :byte)

            if ($.inArray(ext, settings.extentions) < 0) {
                // 확장자 체크
                $.alert('등록이 불가능한 파일 입니다.('+fileName+')');
                return;
            } else if (fileSizeMb > settings.uploadLimit) {
                // 파일 사이즈 체크
                $.alert('용량 초과\n업로드 가능 용량 : ' + (settings.uploadLimit / 1024 / 1024) + ' MB');
                return;
            }
        }


        for (var i = 0; i < files.length; i++) {
            // 파일 이름
            fileName = files[i].name;
            fileNameArr = fileName.split('\.');
            // 확장자
            ext = fileNameArr[fileNameArr.length - 1];

            fileSize = files[i].size; // 파일 사이즈(단위 :byte)
            if (fileSize <= 0) {
                console.log(fileName + ' :: 0kb file return');
                continue;
            }

            var fileSizeKb = fileSize / 1024;   // 파일 사이즈(단위 :kb)
            var fileSizeMb = fileSizeKb / 1024; // 파일 사이즈(단위 :Mb)
            var fileSizeStr = '';
            if ((1024*1024) <= fileSize) {  // 파일 용량이 1메가 이상인 경우
                console.log('fileSizeMb', fileSizeMb.toFixed(2));
                fileSizeStr = fileSizeMb.toFixed(2) + ' Mb';
            } else if ((1024) <= fileSize) {
                console.log('fileSizeKb', parseInt(fileSizeKb));
                fileSizeStr = parseInt(fileSizeKb) + ' kb';
            } else {
                console.log('fileSize', parseInt(fileSize));
                fileSizeStr = parseInt(fileSize) + ' byte';
            }

            // 전체 파일 사이즈
            _info.totalFileSize += fileSizeMb;

            // 파일정보
            _info.fileKeys.push(fileKey);
            _info.files[fileKey] = files[i];
            _info.files[fileKey].fileSize = fileSizeMb;

            // 업로드 파일 목록 생성
            addFileToList(fileKey, fileName, fileSizeStr);

            // 파일 키 증가
            fileKey++;
        }

        $dropZone.find('#fileDragDesc').hide();
        $dropZone.find('#fileTableThead').show();
        $dropZone.find('#fileTableTbody').show();
        $dropZone.find('#fileCheckAll').prop('checked', false);
    };

    this.getCheckedFiles = function () {
        var checkedFiles = [];
        $dropZone.find("input:checkbox[name^='fileItemCheck']:checked").each(function(input){
            var fileKey = parseInt($(this).val());
            checkedFiles.push(_info.files[fileKey]);
        });

        return checkedFiles;
    }

    this.getInfo = function() {
        return _info;
    };

    this.clear = function () {
        fileKey = 0;
        _info = {
            totalFileSize: 0,
            fileKeys: [],
            files: {}
        };
        $tbody.empty();

        $dropZone.find('#fileDragDesc').show();
        $dropZone.find('#fileTableThead').hide();
        $dropZone.find('#fileTableTbody').hide();
    }

    $(that).data('fileDrop', this);

    return this;
};

obj.link = function() {

    var searchParam = {}
    var url;

    this.setCallback = function setCallback(callBack){
        fv_ajaxCallback = callBack;
    };
    this.addParam = function addParam(value){
        searchParam = value;
    };
    this.addUrl = function addUrl(value){
        url = value;
    };

    this.ajax = function ajax(){
        var location = url;

        $.ajax({
            url: url,
            type: "GET",
            data : searchParam,
            async: false,
            beforeSend: null,
            success:
                function (result, textStatus, xhr) {
                    //if (xhr.getResponseHeader('REQUIRES_AUTH') === '1') {
                    //XMLHttpRequest.abort(); // terminate further ajax execution
                        window.location = location;
                    //}
                }
        });
    };
};

function getCalendarRanges(from, to) {
    return [
        parseDate(from),
        parseDate(to)
    ];
}

/**
 * 문자형 날짜를 Date 타입으로 변환
 */
var parseDate = (function() {
  var isoExp = /^\s*(\d{4})(\d{2})(\d{2})(\d{2})?(\d{2})?(\d{2})?\s*$/;
  return function (dateStringInRange) {
    var date, month, parts;

    if (dateStringInRange instanceof Date){
      return dateStringInRange;
    }

    dateStringInRange = dateStringInRange.replace(/[^\d]+/g, '');
    date = new Date(dateStringInRange);
    if (!isNaN(date)) {
      return date;
    }

    date = new Date(NaN);
    parts = isoExp.exec(dateStringInRange);

    if(parts) {
      month = +parts[2];
      date.setFullYear(parts[1]|0, month - 1, parts[3]|0);
      date.setHours(parts[4]|0);
      date.setMinutes(parts[5]|0);
      date.setSeconds(parts[6]|0);
      if(month != date.getMonth() + 1) {
        date.setTime(NaN);
      }
    }
    return date;
  };
})();

/**
 * validate funtions
 */
var PATTERN_PHONE = /01[016789]-[1-9]{1}[0-9]{2,3}-[0-9]{4}$/;
var PATTERN_PHONE_NUM = /01[016789][1-9]{1}[0-9]{2,3}[0-9]{4}$/;
var PATTERN_EMAIL = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

function isNumber(value) {
    return typeof value === 'number' && isFinite(value);
}

function isEmail(value) {
    return PATTERN_EMAIL.test(String(value).toLowerCase());
}

function checkPhone(value) {
    value += '';

    if (value.indexOf('-') > -1) {
        return PATTERN_PHONE.test(value);
    } else {
       return PATTERN_PHONE_NUM.test(value);
    }
}

/**
 * 전화번호 포맷팅
 */
function formatPhoneNum(value) {
    if (isEmpty(value)) {
        return '';
    }

    function _format (index1, index2) {
        return value.substring(0, index1) + '-' + value.substring(index1, index2) + '-' + value.substring(index2, value.length);
    }

    // 휴대폰번호
    if (checkPhone(value) === true) {
        if (value.length == 10) {
            return _format(3, 6);
        } else if (value.length == 11){
            return _format(3, 7);
        }
    } else {
        // 일반전화
        if (value.startsWith('02')) {
            if (value.length == 9) {
                return _format(2, 5);
            } else if (value.length == 10) {
                return _format(2, 6);
            }
        }
    }
    return value;
}

/**
 * url 파라미터 json으로 추출
 */
var __params = null; // 캐쉬
function getAllUrlParameters() {

    if (__params != null) {
        return __params;
    }

    __params = {};

    var queryStr = location.search;
    queryStr.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(str, key, value){
        __params[key] = decodeURIComponent(value.replace(/[+]/g, " "));
    });

    return __params;
}

/**
 * 그리드에서 추가한 속성 값 제거
 */
function clearGridAttr(row) {
    delete row._attributes;
    delete row.uniqueKey;
    delete row.sortKey;
    delete row.chk;

    return row;
}

/**
 * 문자열 포맷팅
 * ex) '${pgmUrlAd}?srId=${srId}&actiId=${actiId}'.format({ pgmUrlAd: '/test', srId: 124312312, actiId: 'SMPL_20' })
 *  -> /test?srId=124312312&actiId=SMPL_20
 */
String.prototype.format = function(params) {
    return this.replace(/\${([a-zA-Z0-9]+)}/g, function (m, key) {
        return params[key] || '';
    });
}

// 데이터변환(차트용)
function transposeData(arr) {
    var result = {};
    if (arr == null || arr.length == 0) {
        return result;
    }

    arr.forEach(function(item, index){
        Object.keys(item).forEach(function(key){
            result[key] = result[key] || [];
            result[key].push(item[key]);
        });
    });

    return result;
}

function showProgress() {
    $('#spin-progress').data('enabled', Ajax.defaults.enabledProgressBar);
    Ajax.defaults.enabledProgressBar = false;
    $('#spin-progress').show();
}

function hideProgress() {
    $('#spin-progress').hide();
    Ajax.defaults.enabledProgressBar = $('#spin-progress').data('enabled');
}

function redirect(url, params) {
    if(typeof url == 'undefined') return;
    if(Object.prototype.toString.call(params) == '[object Object]') {
        var method = params.method;
        delete params.method;

        method = String(method || 'GET').toUpperCase();
        if(self != top) {
            params.frame = 'true';
        }
        if(method == 'GET') {
            // params
            redirect(url + '?' + new URLSearchParams(params).toString());
        }
        else if(method == 'POST') {
            // params
            var form = document.createElement('form');
            for(key in params) {
                var inputEl = document.createElement('input');
                inputEl.setAttribute('type', 'hidden')
                inputEl.setAttribute('name', key);
                inputEl.setAttribute('value', params[key]);
                form.appendChild(inputEl);
            }

            form.setAttribute('method', method);
            form.setAttribute('action', url);
            document.body.appendChild(form);
            form.submit();
        }
        else {
            return;
        }
    }
    else {
        if(self != top) {
            if(url.indexOf('frame=true') == -1) {
                window.parent.location.href = url;
            }
            else {
                location.href = url;
            }
        }
        else {
            location.href = url;
        }
    }
}

function linkClick(linkObj) {
    redirect(linkObj.href);
    return false;
}

function toDataJson(fieldName, data) {
    var dataSet = {};
    for (var idx in data) {
        var row = data[idx];
        for (var cidx in row) {
            var col = row[cidx];
            if(Object.prototype.toString.call(col) != '[object Undefined]'
                && Object.prototype.toString.call(col) != '[object Null]'
                && (typeof col != 'string' || (col.length > 0 && cidx.indexOf('_') < 0))) {
                dataSet[fieldName + '[' + idx + '].' + cidx] = col;
            }
        }
    }
    if(Object.keys(dataSet).length == 0){
        dataSet = null;
    }
    return dataSet;
};

function openReport(projectName, formName, options, datasetList, paramList) {

    var reportUrl;
    if (options.rptProfile == "local") {
        reportUrl = "http://52.79.202.99:8080";
    } else if (options.rptProfile == "dev1") {
        reportUrl = "http://52.79.202.99:8080";
    } else if (options.rptProfile == "dev2") {
        reportUrl = "http://52.79.202.99:8080";
    } else if (options.rptProfile == "develop") {
        reportUrl = "http://192.168.28.171";
    } else if (options.rptProfile == "prod") {
        reportUrl = "https://rpt.busanpa.com";
    } else {
        reportUrl = "http://52.79.202.99:8080";
    }

    var _params = {"projectName":projectName,   //프로젝트명
                   "formName":formName          //서식명
                  };

    for (var datasetValue in datasetList) {
      _params[datasetValue] = encodeURIComponent(datasetList[datasetValue]);
    }

    for (var paramValue in paramList) {
      _params[paramValue] = paramList[paramValue];
    }

    for (var optionValue in options) {
      _params[optionValue] = options[optionValue];
    }

    console.log(_params)

    var contextPath='/';
    var _url = reportUrl + "/UView5/index.jsp"; //UBIFORM Viewer URL
    var d = new Date();
    var n = d.getTime();

    var name = "UBF_" + n;

    // 팝업을 가운데 위치시키기 위해 아래와 같이 값 구하기
    var w  = 1280;
    var h = 650;

    // Fixes dual-screen position, Most browsers, Firefox
    var dualScreenLeft = window.screenLeft != undefined ? window.screenLeft : screen.left;
    var dualScreenTop = window.screenTop != undefined ? window.screenTop : screen.top;

    var width = window.innerWidth ? window.innerWidth : document.documentElement.clientWidth ? document.documentElement.clientWidth : screen.width;
    var height = window.innerHeight ? window.innerHeight : document.documentElement.clientHeight ? document.documentElement.clientHeight : screen.height;

    var left = ((width / 2) - (w / 2)) + dualScreenLeft;
    var top = ((height / 2) - (h / 2)) + dualScreenTop;
    //팝업 오픈 Option 해당 설정은 window.open 설정을 참조
    var windowoption = 'location=0, directories=0,resizable=0,status=0,toolbar=0,menubar=0, width=' + w + ', height=' + h + ', top=' + top + ', left=' + left, scrollbars=0;
    var form = document.createElement("form");

    form.setAttribute("method", "post");
    form.setAttribute("action", _url);

    for (var i in _params)
    {
        if (_params.hasOwnProperty(i))
        {
          var aesUtil = new AesUtil(128);
          var _ascStr = encodeURIComponent( aesUtil.encode( JSON.stringify(_params)  ) );

          var param = document.createElement('input');
          param.type = 'hidden';
          //param.name = i;
          //param.value = encodeURI( _params[i] );
          param.name = "UB_ENC_PARAM";
          param.value = encodeURI( _ascStr );
          form.appendChild(param);
        }
    }

    document.body.appendChild(form);
    form.setAttribute("target", name);
    window.open("", name, windowoption);
    form.submit();
    document.body.removeChild(form);
}

function openReportFrame(projectName, formName, options, datasetList, paramList) {

    var reportUrl;
    if (options.rptProfile == "local") {
        reportUrl = "http://52.79.202.99:8080";
    } else if (options.rptProfile == "dev1") {
        reportUrl = "http://52.79.202.99:8080";
    } else if (options.rptProfile == "dev2") {
        reportUrl = "http://52.79.202.99:8080";
    } else if (options.rptProfile == "develop") {
        reportUrl = "http://192.168.28.171";
    } else if (options.rptProfile == "prod") {
        reportUrl = "https://rpt.busanpa.com";
    } else {
        reportUrl = "http://52.79.202.99:8080";
    }

    var _params = {"projectName":projectName,   //프로젝트명
                   "formName":formName          //서식명
                  };

    for (var datasetValue in datasetList) {
      _params[datasetValue] = encodeURIComponent(datasetList[datasetValue]);
    }

    for (var paramValue in paramList) {
      _params[paramValue] = paramList[paramValue];
    }

    for (var optionValue in options) {
      _params[optionValue] = options[optionValue];
    }

    console.log(_params)

    var contextPath='/';
    var _url = reportUrl + "/UView5/index.jsp"; //UBIFORM Viewer URL
    var d = new Date();
    var n = d.getTime();

    //var name = "UBF_" + n;

    //팝업 오픈 Option 해당 설정은 window.open 설정을 참조
    var windowoption = 'location=100, directories=0,resizable=0,status=0,toolbar=0,menubar=0, width=1280rem,height=650rem,left=0, top=0,scrollbars=0';  //팝업사이즈 window.open참고
    var form = document.createElement("form");

    form.setAttribute("method", "post");
    form.setAttribute("action", _url);

    for (var i in _params)
    {
        if (_params.hasOwnProperty(i))
        {
            var aesUtil = new AesUtil(128);
            var _ascStr = encodeURIComponent( aesUtil.encode( JSON.stringify(_params)  ) );

            var param = document.createElement('input');
            param.type = 'hidden';
            //param.name = i;
            //param.value = encodeURI( _params[i] );
            param.name = "UB_ENC_PARAM";
            param.value = encodeURI( _ascStr );
            form.appendChild(param);
        }
    }

    document.body.appendChild(form);
    form.setAttribute("target", "viwer_iFrame");

    if(document.getElementById("pdfIframe") == null){
      var vframe = document.createElement("iframe");
      vframe.setAttribute('id', "pdfIframe");
      vframe.setAttribute("name","viwer_iFrame");
      vframe.setAttribute("method", "post");
      vframe.style.width = "1024rem";
      vframe.style.height = "1024rem";
      document.body.appendChild(vframe);
    }
    else{
      vframe = document.getElementById("pdfIframe");
    }

    // IFRAME Focus
    vframe.focus();
    // FORM 전송
    form.submit();
}

function _isNull(obj) {
    return (typeof obj != "undefined" && obj != null && obj != "") ? false : true;
} 


//인터페이스 데이터 생성 별도의 javascript web thread 실행
function infGenData(jsPath, paramObj){
	
	if($("#toast").hasClass('show')){
		closeToastMsg();
	}
	
	if(window.Worker){
 		const workerT = new Worker(jsPath);
 		workerT.postMessage(paramObj);
 		
 		workerT.onmessage = function(e){
			
			let jsonObj = JSON.parse(e.data);
	
 			if("S" == jsonObj.isSuccess){
 				showToastMsg(jsonObj.message);	
 			}
 			else if("H" == jsonObj.isSuccess){
                $.alert("데이터 생성 중 입니다.<br>잠시 후 다시 시도해 주세요.");
            }
 			else if("F" == jsonObj.isSuccess){      /*myfi_BUG_605(DataError)*/
                $.alert("데이터 생성 중 오류가 발생했습니다.");
                showToastMsg(jsonObj.message);
 			}
             else if("N" == jsonObj.isSuccess){     /*myfi_BUG_605(DataError)*/
                showToastMsg(jsonObj.message);
            }
 		};
 		
 		workerT.onerror = function(error){
 			console.log("error",error);
 			// $.alert("지원하지 않는 브라우저 입니다.");
            $.alert(error);
        };
	}
}

function showToastMsg(str){
    $("#toast span").text(str);
    $("#toast").addClass('show');
} 

function closeToastMsg(){
	$("#toast").removeClass('show');
}    