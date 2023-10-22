/*!
 * 공통 스크립트
 */
$(document).ready(function() {

    /* TOGGLE */
    $('.toggle .bt').click(function() {
        $(this).toggleClass('on');
    });

    /* FILE X */
    $('.file.x').click(function() {
        $(this).remove();
    });

    /* MYNAV */
    $('.myNav').click(function() {
        $(this).toggleClass('on');
        $('.btStar').removeClass('on');
    });
    
    /* LNB */
    $('.lnb li.on').children('.sub').slideDown();
    $('.lnb li').click(function() {
        if ($(this).hasClass('on')) {
            $(this).removeClass('on');
            $(this).children('.sub').slideUp();
        } else {
            $('.lnb li').removeClass('on');
            $('.lnb li').children('.sub').slideUp();
            $(this).addClass('on');
            $(this).children('.sub').slideDown();
        }
    });

    /* BT_CLOSE */
    $('.btClose').click(function(){
        $(this).parents('.popup').addClass('hide');
        $(this).parents('.sitemap').addClass('hide');
        $('.btBookmark').removeClass('on');
    });
    
    /* BT_SITE */
    $('.btSite').click(function() {
        $('.sitemap').removeClass('hide');
        $('.myNav , .btStar').removeClass('on');
    });

    /* BT_STAR */
    $('#btBookmark').click(function() {
        $('.myNav').removeClass('on');
        if ($(this).hasClass('on')) {
            $(this).removeClass('on');
        } else {
            $(this).addClass('on');
        }
    });

    /* BT_PUSH */
    $('.btPush').click(function() {
        if ($(this).hasClass('on')) {
            $(this).removeClass('on');
            $('.lnb').removeClass('push');
            $('section.sub').removeClass('on');
            $('footer').removeClass('push');
        } else {
            $(this).addClass('on');
            $('.lnb').addClass('push');
            $('section.sub').addClass('on');
            $('footer').addClass('push');
        }
    });

    /* BT_TOP */
    $('.btTop').hide();
    $(function() {
        $(window).scroll(function() {
            if ($(this).scrollTop() > 100) {
                $('.btTop').fadeIn();
            } else {
                $('.btTop').fadeOut();
            }
        });
        $('.btTop').click(function() {
            $('body,html').animate({
                scrollTop : 0
            }, 500);
            return false;
        });
    });

    $(".daypicker").datepicker({
        dateFormat: 'yy-mm-dd',
        prevText: '이전 달',
        nextText: '다음 달',
        yearSuffix: '년',
        monthNames: ['01','02','03','04','05','06','07','08','09','10','11','12'],
        monthNamesShort: ['01','02','03','04','05','06','07','08','09','10','11','12'],
        dayNames: ['일', '월', '화', '수', '목', '금', '토'],
        dayNamesShort: ['일','월','화','수','목','금','토'],
        dayNamesMin: ['일','월','화','수','목','금','토'],
        showMonthAfterYear: true,
    });
    
    

});

function fn_FixTableTh (tableEl) {

    if ($(tableEl).prop("tagName") == 'TABLE') {
        var thTr = $(tableEl).find("th:last").parent("tr");
        var thCnt = thTr.children("th").length;
        var tdTr = $(tableEl).find("td:last").parent("tr")
        var tdCnt = tdTr.children("td").length;

        $.each($(tableEl).find('th'), function(idx, el) {
            $(this).outerWidth($(tableEl).find('td').eq(idx).outerWidth());
        });
    } else {
        return false;
    }
};


$(document).ajaxStart(function() {
    HoldOn.open({
        theme : "sk-cube",
        message : '처리중입니다. 잠시만 기다려 주세요',
        // backgroundColor:"#1847B1",
        textColor : "white",
    });
}).ajaxStop(HoldOn.close);

Array.prototype.contains = function(obj) {
    var i = this.length;
    while (i--) {
        if (this[i] === obj) {
            return true;
        }
    }
    return false;
}

/*
 * trim을 사용하기 위해 프로토타입에 trim을 추가한다. 사용예) var strTrimTest = " TrimTest "; var
 * strTrimResult = strTrimTest.trim(); @returns
 */
String.prototype.trim = function() {
    return this.replace(/(^\s*)|(\s*$)/gi, "");
}

/**
 * 문자열 중에 orgChar를 찾아서 모두 newChar로 치환 한다.
 *
 * @param orgChar
 * @param newChar
 *            사용예) var sampleStr = "aaabbbccc"; sampleStr.replaceAll("bbb",
 *            "111");
 * @returns
 */
String.prototype.replaceAll = function(orgChar, newChar) {
    return this.split(orgChar).join(newChar);
}

/*
 * Date에 Prototype을 추가 한다. 날짜를 주어진 포맷으로 변환한다. //2011년 09월 11일 오후 03시 45분 42초
 * console.log(new Date().format("yyyy년 MM월 dd일 a/p hh시 mm분 ss초"));
 *
 * //2011-09-11 console.log(new Date().format("yyyy-MM-dd"));
 *
 * //'11 09.11 console.log(new Date().format("'yy MM.dd"));
 *
 * //2011-09-11 일요일 console.log(new Date().format("yyyy-MM-dd E"));
 *
 * //현재년도 : 2011 console.log("현재년도 : " + new Date().format("yyyy")); @param f
 * @returns
 */
Date.prototype.format = function(f) {
    if (!this.valueOf())
        return " ";

    var weekName = [ "일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일" ];
    var d = this;

    return f.replace(/(yyyy|yy|MM|dd|E|hh|mm|ss|a\/p)/gi, function($1) {
        switch ($1) {
        case "yyyy":
            return d.getFullYear();
        case "yy":
            return (d.getFullYear() % 1000).zf(2);
        case "MM":
            return (d.getMonth() + 1).zf(2);
        case "dd":
            return d.getDate().zf(2);
        case "E":
            return weekName[d.getDay()];
        case "HH":
            return d.getHours().zf(2);
        case "hh":
            return ((h = d.getHours() % 12) ? h : 12).zf(2);
        case "mm":
            return d.getMinutes().zf(2);
        case "ss":
            return d.getSeconds().zf(2);
        case "a/p":
            return d.getHours() < 12 ? "오전" : "오후";
        default:
            return $1;
        }
    });
};
String.prototype.string = function(len) {
    var s = '', i = 0;
    while (i++ < len) {
        s += this;
    }
    return s;
};
String.prototype.zf = function(len) {
    return "0".string(len - this.length) + this;
};
Number.prototype.zf = function(len) {
    return this.toString().zf(len);
};

//uv, pv 수집 서버로 데이터 전송
function navilog(userId, docName, clientIp, domain) {
    var timing = JSON.stringify(window.performance.timing);
    var datas = "USERID=" + userId + "&";
    datas += "DOCNAME=" + docName + "&";
    datas += "clientIp=" + clientIp + "&";
    datas += "NAVIGATION=" + timing;
    $.ajax({
        method : "POST",
        url : "https://mdi." + domain + "/mdi/api/NavigationTimingAPI",
        data : datas,
        dataType : "jsonp",
    });
}

//그리드 resizing
function resizeGrid(gridId, w, h) {
    if (gridId)
        AUIGrid.resize(gridId, w, h);
}

/**
 * date타입을 string으로 변환시키는 함수 yyyymmdd포맷이며 넘겨진 type에 따라 포맷을 변경한다.
 *
 * @param date
 * @param type
 * @author es-seungglee
 * @returns
 */
function getDate(date, type, days) {
    if (!(date instanceof Date)) {
        return date;
    }
    if (days) {
        date.setDate(date.getDate() + days);
    }
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();

    if (month < 10) {
        month = "0" + month;
    }
    if (day < 10) {
        day = "0" + day;
    }
    let today;
    if (!type) {
        type = "";
    }

    today = year + type + month + type + day;

    return today;
}

function getThisMonth(format) {
    if (!format) {
        format = '-';
    }
    let today = new Date();
    let year = today.getFullYear();
    let month = today.getMonth() + 1;

    if (month < 10) {
        month = "0" + month;
    }

    return year + format + month;
}
/**
 * null 체크용 함수
 *
 * @param str
 * @author es-seungglee
 * @returns
 */
function isNull(str) {
    return (str == null || str == undefined || str == '' || str == 'undefined' || str == 'null');
}

/**
 * 금액 콤마 마스킹 처리
 *
 * @param str //
 *            마스킹 처리 할 금액
 * @author es-seungglee
 * @returns
 */
function setComma(str) {
    if(!str || str == 'null') {
        return 0;
    }
    if (typeof (str) == 'number') { // 치환 작업때문에 number라면 String으로 바꾼다.
        str = str.toString();
    } else if (typeof (str) == 'string') {
        try {
            str = Number(str).toString(); // 0으로 시작하는 문자열은 number로 치환하여 0을 자동
            // 제거한다.
        } catch (e) {
            str = '0';
        }
    }
    return str.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
}

/**
 * 리스트 하단에 뿌릴 페이지 리스트
 *
 * @param start //
 *            시작점
 * @param end //
 *            끝
 * @author es-seungglee
 * @returns
 */
function getPageList(start, end) {
    let arr = new Array();
    let cnt = 0;
    for (let i = start; i <= end; i++) {
        arr[cnt++] = i;
    }
    return arr;
}

/**
 * 페이징 만들어 주는 함수
 *
 * @param {*}
 *            fnName 클릭시 조회 될 함수 명
 * @param {*}
 *            target append될 엘리먼트
 * @author es-seungglee
 */
function makePagingVO(fnName, target) {
    let html = '';
    $("#" + target).empty();
    html += '    <button type="button" class="btPrev end"';
    if (pagingVO.pageNo == 1) {
        html += ' disabled'
    } else {

        html += ' onclick="' + fnName + '(1)" style="cursor:pointer"';
    }
    html += '><i>처음</i></button>';
    html += '<button type="button" class="btPrev" ';
    if (pagingVO.pageNo <= pagingVO.pageCnt) {
        html += ' disabled';
    } else {
        html += '" onclick="' + fnName + '(' + (pagingVO.startPage - 10)
        + ')" style="cursor:pointer"';
    }
    html += ' ><i>이전</i></button>';
    let pageList = getPageList(pagingVO.startPage, pagingVO.endPage);
    for (let i = 0; i < pageList.length; i++) {
        let num = pageList[i];
        html += '        <a class="pgNum';
        if (num == pagingVO.pageNo) {
            html += ' on" style="cursor:pointer">';
        } else {
            html += '" onclick="' + fnName + '(\'' + num
            + '\')" style="cursor:pointer">';
        }
        html += num + '</a>';
    }
    html += '        <button type="button" class="btNext"';
    if (Math.floor(pagingVO.pageNo) == Math.floor(pagingVO.totalPage)
            || pagingVO.totalPage <= pagingVO.pageCnt || pagingVO.endPage == pagingVO.totalPage) {
        html += ' disabled';
    } else {
        html += '" onclick="' + fnName + '(\'' + (pagingVO.endPage + 1)
        + '\')" style="cursor:pointer"';
    }
    html += '><i>다음</i></button>';
    html += '<button type="button" class="btNext end"';
    if (pagingVO.pageNo == pagingVO.totalPage) {
        html += ' disabled';
    } else {
        html += '" onclick="' + fnName
        + '('+pagingVO.totalPage+')" style="cursor:pointer"';
    }
    html += '><i>마지막</i></button>';
    $("#" + target).append(html);
}

/**
 * @note 공통 ajax
 * @author es-seungglee
 * @returns
 */
function doAjax(url, type, param, config) {
    let res = {};
    const ajaxConfig = {
            url : url,
            type : type,
            data : param,
            cache:false,
            async : false,
            beforeSend : function(xhr) {
                xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
            },
            success : function(data) {
                res = data;
            },
            error : function(data) {
                res.result = -1;
                if(data.status == 0) {
                    res.resultMsg = '네트워크 오류! 네트워크 연결을 확인해 주세요.';
                }else if(data.status == 400) {
                    res.resultMsg = '요청하신 url이 올바르지 않습니다.'; 
                }else if(data.status == 401) {
                    res.resultMsg = '권한이 충분치 않습니다. 관리자에게 문의하세요';
                }else {
                    res.resultMsg = '통신 중 문제가 발생하였습니다.';
                }
            }
    }
    // 추가 될 ajax 설정이 있다면 추가 시킨다.
    for ( let temp in config) {
        ajaxConfig[temp] = config[temp];
    }
    try {
        $.ajax(ajaxConfig);
    } catch (e) {
        console.log(e);
        alert(e);
        holdOn.close();
    }

    return res;

}

/**
 * 날짜 형식
 *
 * @param value //
 *            값
 * @param type //
 *            형식 (default는 '-')
 * @author es-seungglee
 * @returns
 */
function dateFilter(value, type) {
    if (!value || value == 'null') {
        return '-';
    } else if (value.length > 8) {
        return value;
    } else if (!type) {
        type = '-';
    }
    return value.substr(0, 4) + type + value.substr(4, 2) + type
    + value.substr(6, 2);
}

function nvl(value, text){
    if(!text) {
        text = '';
    }
    if(!value || value == 'null') {
        value = text;
    }
    return value
}
/**
 * 사업자번호 마스킹
 *
 * @param value
 * @param type
 * @author es-seungglee
 * @returns
 */
function bizNoFilter(value, type) {
    if (!value)
        return;
    if (value.indexOf('-') != -1) {
        return value;
    }
    var formatNum = '';
    try {
        if (value.length == 10) {
            if (type == 0) {
                formatNum = value.replace(/(\d{3})(\d{2})(\d{5})/,
                '$1-$2-*****');
            } else {
                formatNum = value.replace(/(\d{3})(\d{2})(\d{5})/, '$1-$2-$3');
            }
        }
    } catch (e) {
        formatNum = value;
    }
    return formatNum;
}

/**
 * 오늘날짜 문자열로 리턴
 *
 * @param type :
 *            마스킹 될 타입
 * @author es-seungglee
 * @returns
 */
function getToday(type) {
    if (!type) {
        type = "";
    }
    let date = new Date();
    let year = date.getFullYear();
    let month = new String(date.getMonth() + 1);
    let day = new String(date.getDate());
    if (month.length == 1) {
        month = "0" + month;
    }
    if (day.length == 1) {
        day = "0" + day;
    }

    return year + type + month + type + day;
}

/**
 * 사업자번호 유효성 체크
 *
 * @param bizNo
 * @author es-seungglee
 * @returns
 */
function checkBizNo(bizNo) { // 사업자 번호 체크

    let checkID = new Array(1, 3, 7, 1, 3, 7, 1, 3, 5, 1);
    let i, chkSum = 0, c2, remander;
    bizNo = bizNo.replace(/-/gi, '');
    if (bizNo.length != 10) {
        return false;
    }
    for (i = 0; i <= 7; i++) {
        chkSum += checkID[i] * bizNo.charAt(i);
    }
    c2 = "0" + (checkID[8] * bizNo.charAt(8));
    c2 = c2.substring(c2.length - 2, c2.length);
    chkSum += Math.floor(c2.charAt(0)) + Math.floor(c2.charAt(1));
    remander = (10 - (chkSum % 10)) % 10;

    return (Math.floor(bizNo.charAt(9)) == remander);
}

/**
 * form데이터 보기
 *
 * @param formData
 * @author es-seungglee
 * @returns
 */
function viewFormData(formData) {
    let arr = new Array();
    /*
     * for (var key of formData.keys()) { let data = {}; data[key] =
     * formData.get(key); arr.push(data); }
     */
}

/**
 * 리스트 중복 제거
 *
 * @param arr
 * @author es-seungglee
 * @returns
 */
function retainAll(arr) {
    let arrList = arr.reduce(function(a, b) {
        if (a.indexOf(b) < 0) {
            a.push(b);
        }
        return a;
    }, []);
    return arrList;
}

/**
 * 뒤로 가기시 ajax처리
 *
 * @author es-seungglee
 * @returns
 */
function checkUrl(url) {
    let arr = new Array();
    let moveUrl = getCookie(url);
    if (moveUrl) {
        moveUrl = moveUrl.replace("#", "");
        if (moveUrl.indexOf(",") != -1) {
            arr = moveUrl.split(",");
        } else {
            arr.push(moveUrl);
        }
        deleteCookie(url);
    }
    return arr;
}

/**
 * 쿠키 저장
 *
 * @param cookie_name :
 *            저장될 쿠키 이름
 * @param value :
 *            값
 * @param days :
 *            얼마나 저장할 건지.
 * @author es-seungglee
 * @returns
 */
function setCookie(cookie_name, value, days) {
    let exdate = new Date();
    exdate.setDate(exdate.getDate() + days);
    // 설정 일수만큼 현재시간에 만료값으로 지정

    let cookie_value = escape(value)
    + ((days == null) ? '' : ';    expires=' + exdate.toUTCString());
    document.cookie = cookie_name + '=' + cookie_value;
}

/**
 * 넘겨진 cookie_name으로 쿠기 값 조회
 *
 * @param cookie_name
 * @author es-seungglee
 * @returns
 */
function getCookie(cookie_name) {
    let x, y;
    let val = document.cookie.split(';');

    for (let i = 0; i < val.length; i++) {
        x = val[i].substr(0, val[i].indexOf('='));
        y = val[i].substr(val[i].indexOf('=') + 1);
        x = x.replace(/^\s+|\s+$/g, ''); // 앞과 뒤의 공백 제거하기
        if (x == cookie_name) {
            return unescape(y); // unescape로 디코딩 후 값 리턴
        }
    }
}

/**
 * 쿠키 삭제
 *
 * @param cookie_name
 * @author es-seungglee
 * @returns
 */
function deleteCookie(cookieName) {
    let cookie = getCookie(cookieName);
    if (cookie) {
        setCookie(cookieName, cookie, -1);
    }
}

/**
 * url 인코딩(크롬은 괜찮지만 익스플로러에서 에러가 생기는 것을 방지.)
 *
 * @param str
 * @author es-seungglee
 * @returns
 */
function urlencode(str) {
    str = (str + '').toString();
    return encodeURIComponent(str).replace(/!/g, '%21').replace(/'/g, '%27')
    .replace(/\(/g, '%28').replace(/\)/g, '%29').replace(/\*/g, '%2A')
    .replace(/%20/g, '+');
}

/**
 * url 디코딩(인코딩 된 url을 디코드 시킨다.)
 *
 * @param str
 * @author es-seungglee
 * @returns
 */
function urldecode(str) {
    return decodeURIComponent((str + '').replace(/%(?![\da-f]{2})/gi,
            function() {
        return '%25';
    }).replace(/\+/g, '%20'));
}

/**
 * 객체의 깊은 복사
 *
 * @param obj
 * @author es-seungglee
 * @returns
 */
function cloneObject(obj) {
    var clone = {};
    for ( var i in obj) {
        if (typeof (obj[i]) == "object" && obj[i] != null)
            clone[i] = cloneObject(obj[i]);
        else
            clone[i] = obj[i];
    }
    return clone;
}

/**
 *
 * @author es-seungglee
 * @param str
 * @returns
 */
function makeUrlStr(str) {
    let urlStr = '';
    for (let i = 0; i < str.length; i++) {
        urlStr += (str[i] + ",");
    }

    return urlStr.substring(0, urlStr.length - 1);
}

/**
 * 프로알라 에디터 세팅
 *
 * @author es-seungglee
 * @param el
 * @returns
 */
function setFroalaEditor(el) {
    if (!el) {
        alert("프로알라 에디터를 적용할 Element를 선택해 주세요");
        return;
    }
    const editorInstance = new FroalaEditor(
            el,
            {
                key : 'wFE7nA4E3F4B3A9A6eMRPYf1h1REb1BGQOQIc2CDBREJImA11C8D6C5B1G4I3F2I3A8==',
                imageUploadURL : '/api/uploadFroalaImg',
                enter : FroalaEditor.ENTER_P,
                language : 'ko',
                attribution : false,
                heightMin: 350,
                heightMax: 400,
                placeholderText : null,
                fontFamily: {"맑은 고딕": '맑은 고딕',"굴림": '굴림', "돋움": '돋움',"바탕": '바탕', "궁서": '궁서'},
                fontFamilyDefaultSelection: '맑은 고딕',
                fontFamilySelection: true,
                toolbarButtons : {
                    moreText : {
                        // List of buttons used in the group.
                        buttons : [ 'bold', 'italic', 'underline',
                            'strikeThrough', 'subscript', 'superscript',
                            'fontFamily', 'fontSize', 'textColor',
                            'backgroundColor', 'inlineClass',
                            'inlineStyle', 'clearFormatting' ],

                            // Alignment of the group in the toolbar.
                            align : 'left',

                            // By default, 3 buttons are shown in the main toolbar.
                            // The rest of them are available when using the more
                            // button.
                            buttonsVisible : 3
                    },
                    moreParagraph : {
                        buttons : [ 'alignLeft', 'alignCenter',
                            'formatOLSimple', 'alignRight', 'alignJustify',
                            'formatOL', 'formatUL', 'paragraphFormat',
                            'paragraphStyle', 'lineHeight', 'outdent',
                            'indent', 'quote' ],
                            align : 'left',
                            buttonsVisible : 3
                    },
                    moreRich : {
                        buttons : [ 'insertLink', 'insertImage', 'insertTable',
                            'emoticons', 'fontAwesome',
                            'specialCharacters', 'embedly', 'insertHR' ],
                            align : 'left',
                            buttonsVisible : 3
                    },
                    moreMisc : {
                        buttons : [ 'undo', 'redo', 'print', 'spellChecker',
                            'selectAll', ],
                            align : 'right',
                            buttonsVisible : 2
                    }
                },
                // default : ['image', 'video', 'embedly', 'table', 'ul', 'ol',
                // 'hr']
                quickInsertButtons : [ 'image', 'table', 'hr' ],
                events : {
                    /*
                     * 'image.beforeUpload': function (files) { const editor =
                     * this if (files.length) { var reader = new FileReader();
                     * reader.onload = function (e) { var result =
                     * e.target.result; editor.image.insert(result, null, null,
                     * editor.image.get()); } reader.readAsDataURL(files[0]); }
                     * return false; }
                     */
                    'image.removed' : function($img) {
                        // Do something here.
                        // this is the editor instance.
                        let idx = $img[0].src.lastIndexOf('/');
                        let imgName = $img[0].src.substring(idx + 1,
                                $img[0].src.length);
                        let res = doAjax("/api/deleteFroalaImg/" + imgName,
                                "get", null, {
                            global : false
                        });
                    },

                }
            });
}


/**********************************************
 * @method : setSimpleFroalaEditor
 * @note : 사용 가능한 기능 중 심플한 것만 담은 froala editor 생성 함수
 *         args : editor를 적용할 대상, 문자열 배열
 * @since : 2021.10.07
 * @author : jooypark
 ***********************************************/
function setSimpleFroalaEditor(heightMinSize, heightMaxSize, ...args){ //args :
    const editorInstance = new FroalaEditor(`${args}`, { //`${args}` : ES6 template Literals 문법사용, 배열일 경우 toString 됨
        key: 'wFE7nA4E3F4B3A9A6eMRPYf1h1REb1BGQOQIc2CDBREJImA11C8D6C5B1G4I3F2I3A8==',
        imageUploadURL: '/api/uploadFroalaImg',
        enter: FroalaEditor.ENTER_P,
        language: 'ko',
        heightMin: heightMinSize,
        heightMax: heightMaxSize,
        attribution: false,
        placeholderText: null,
        fontFamily: {"나눔고딕": '나눔고딕', "바탕": '바탕', "바탕체": '바탕체', "맑은 고딕": '맑은 고딕',"굴림": '굴림', "돋움": '돋움', "궁서": '궁서', "Times New Roman":'Times New Roman'},
        fontFamilyDefaultSelection: '나눔고딕',
        fontFamilySelection: true,

        toolbarButtons: {
            moreText: {
                // List of buttons used in the  group.
                buttons: ['fontFamily', 'bold', 'italic', 'underline', 'strikeThrough', 'fontSize', 'textColor', 'backgroundColor', 'clearFormatting'],

                // Alignment of the group in the toolbar.
                align: 'left',

                // By default, 3 buttons are shown in the main toolbar. The rest of them are available when using the more button.
                buttonsVisible: 3
            },
            moreParagraph: {
                buttons: ['alignLeft', 'alignCenter', 'alignRight', 'alignJustify', 'formatOL', 'formatUL', 'lineHeight'],
                align: 'left',
                buttonsVisible: 3
            },
            moreRich: {
                buttons: [ 'insertImage', 'insertTable', 'insertHR', 'insertLink', 'fontAwesome', 'specialCharacters', 'embedly'],
                align: 'left',
                buttonsVisible: 3
            },
            moreMisc: {
                buttons: ['undo', 'redo', 'spellChecker', 'selectAll'],
                align: 'right',
                buttonsVisible: 4
            }
        },
        quickInsertButtons: ['image', 'table', 'hr'],
        events: {
            'image.removed': function ($img) {
                // Do something here.
                // this is the editor instance.
                let idx = $img[0].src.lastIndexOf('/');
                let imgName = $img[0].src.substring(idx + 1, $img[0].src.length);
                let res = doAjax("/api/deleteFroalaImg/" + imgName, "get", null, {global: false});
            },
        },

        //default에 onCLick 추가
        htmlAllowedAttrs : ['onClick', 'accept', 'accept-charset', 'accesskey', 'action', 'align', 'allowfullscreen', 'allowtransparency', 'alt', 'aria-.*', 'async', 'autocomplete', 'autofocus', 'autoplay', 'autosave', 'background', 'bgcolor', 'border', 'charset', 'cellpadding', 'cellspacing', 'checked', 'cite', 'class', 'color', 'cols', 'colspan', 'content', 'contenteditable', 'contextmenu', 'controls', 'coords', 'data', 'data-.*', 'datetime', 'default', 'defer', 'dir', 'dirname', 'disabled', 'download', 'draggable', 'dropzone', 'enctype', 'for', 'form', 'formaction', 'frameborder', 'headers', 'height', 'hidden', 'high', 'href', 'hreflang', 'http-equiv', 'icon', 'id', 'ismap', 'itemprop', 'keytype', 'kind', 'label', 'lang', 'language', 'list', 'loop', 'low', 'max', 'maxlength', 'media', 'method', 'min', 'mozallowfullscreen', 'multiple', 'muted', 'name', 'novalidate', 'open', 'optimum', 'pattern', 'ping', 'placeholder', 'playsinline', 'poster', 'preload', 'pubdate', 'radiogroup', 'readonly', 'rel', 'required', 'reversed', 'rows', 'rowspan', 'sandbox', 'scope', 'scoped', 'scrolling', 'seamless', 'selected', 'shape', 'size', 'sizes', 'span', 'src', 'srcdoc', 'srclang', 'srcset', 'start', 'step', 'summary', 'spellcheck', 'style', 'tabindex', 'target', 'title', 'type', 'translate', 'usemap', 'value', 'valign', 'webkitallowfullscreen', 'width', 'wrap'],

    });
}

/**
 * 넘겨진 element로 select2 라이브러리 세팅
 *
 * @author es-seungglee
 * @param el,config
 * @returns
 */
function setSelect2(el, config) {
    let option = {
            placeholder : "선택해 주세요.",
            language : "ko",
            dropdownAutoWidth : true,
            minimumResultsForSearch : Infinity,
    };
    for ( let temp in config) {
        option[temp] = config[temp];
    }
    $(el).select2(option);
}

/**
 * 넘겨진 element와 순번으로 select2 라이브러리 세팅
 *
 * @author es-seungglee
 * @param el,
 *            idx, config
 * @returns
 */
function setSelect2Idx(el, idx, config) {
    let option = {
            placeholder : "선택해 주세요.",
            language : "ko",
            dropdownAutoWidth : true,
            minimumResultsForSearch : Infinity,
    };
    for ( let temp in config) {
        option[temp] = config[temp];
    }
    $(el).eq(idx).select2(option);
}

/**
 * 정 가운데에 팝업이 오도록 수정된 팝업
 *
 * @author es-seungglee
 * @returns
 */
function openNewPopup(url, width, height) {
    if (!width) {
        width = 500;
    }
    if (!height) {
        height = 800;
    }
    let winWidth = document.body.clientWidth; // 현재창의 너비

    let winHeight = document.body.clientHeight; // 현재창의 높이

    let winX = window.screenX || window.screenLeft || 0;// 현재창의 x좌표

    let winY = window.screenY || window.screenTop || 0; // 현재창의 y좌표

    let left = winX + (winWidth - width) / 2;

    let top = winY + (winHeight - height) / 2;
    window.open(url, '_blnak', "toolbar=yes,scrollbars=yes,resizable=yes,left="
            + left + ",top=" + top + ",width=" + width + ",height=" + height);
}

function getOrDefault(value, default_value) {
    if(!default_value) {
        default_value="";
    }
    if(!value) {
        value = default_value;
    }
    return value;
}



function isFloat(n) {
    return n === +n && n !== (n|0);
}

function isInteger(n) {
    return n === +n && n === (n|0);
}

/**********************************************
 * @method : checkDetailPopupOpenYn
 * @note 세부항목 팝업 띄울지 여부 리턴하는 함수
 * @since 2020.04.02
 * @author : es-seungglee
 ***********************************************/
function checkDetailPopupOpenYn(costInfoVO, flag) {
    let smKindSeq = costInfoVO.smKindSeq;        // 중분류
    let costSeq = costInfoVO.costSeq;            // 소분류
    
    let arr = [
        {
            smKind : '4503006'      // 교통비
                ,child : [
                    10              // 야근 교통비
                    ,11             // 외근 교통비
                    ,86             // 유류대-직원
                    ]
        }
        ,{
            smKind : '4503010'
                ,child : [          // 접대비
                    42              // 해외-접대비
                    , 44            // 경조사-접대비
                    , 45            // 일반접대비
                    ]
        }
        ,{
            smKind : '4503008'      // 해외 출장
                ,child : [
                    24              // 식대-해외출장
                    ,26             // 교통비-해외출장
                    ,31             // 기타
                    ,81             // 커뮤니케이션
                    ,87             // 렌터카
                    ,88             // 항공료
                    ,89             // 로밍
                    ,90             // 호텔
                    ,25             // 접대비
                    ]
        }
        ,{
            smKind : '4503009'      // 국내출장
                ,child : [
                    34              // 식대
                    ,35             // 접대
                    ,36             // 교통비
                    ,82             // 커뮤니케이션
                    ,91             // 렌터카
                    ,92             // 호텔
                    ,93             // 항공료
                    ,40             // 국내출장 기타
                    ]
        }
    ];
    if(flag) {
        arr[0].smKind = '';
        arr[0].child = [];
        arr.push({
            smKind : '4503021'  // 총무(카드)-해외출장
            , child : [
                // 123,
                100,
                101,
                102,
                103,
                
                
            ]
        });
        arr.push({
            smKind : '4503022',
            child : [
                // 122,
                114,
                115,
                116,
                117
            ]
        })
    }
    for(let i=0; i<arr.length; i++) {
        let smKind = arr[i].smKind;                         // 중분류
        if(smKind == smKindSeq ) {                         // 해당 중분류가 배열에도 있다면
            for(let j=0; j<arr[i].child.length; j++) {      // 해당 중분류의 소분류를 비교
                let cost = arr[i].child[j];
                if(cost == costSeq) {                      // 맞는게 있다면
                    return true;                            // 참을 리턴하고 종료
                }
            }
        }
    }
    return false;
}

function isDate(value, type) {
	if (value == '') {
    	return true;
	}
	
    var monthPattern = /^(\d{4})\/(\d{2})$/;
    var datePattern = /^(\d{4})\/(\d{2})\/(\d{2})$/;
    
    var mtArray = value.match(monthPattern);
    var dtArray = value.match(datePattern);
    
    var dtYear = "";
    var dtMonth = "";
    var dtDay = "";
    
    if (mtArray == null && dtArray != null) {
    	dtYear = dtArray[1];
	    dtMonth = dtArray[2];
	    dtDay = dtArray[3];
	    
	    if (dtMonth < 1 || dtMonth > 12) {
	    	return false;
	    } else if (dtDay < 1 || dtDay > 31) {
	    	return false;
	    } else if ((dtMonth == 4 || dtMonth == 6 || dtMonth == 9 || dtMonth == 11) && dtDay == 31) {
	    	return false;
	    } else if (dtMonth == 2) {
	        var isleap = (dtYear % 4 == 0 && (dtYear % 100 != 0 || dtYear % 400 == 0));
	        if (dtDay > 29 || (dtDay == 29 && !isleap)) {
	        	return false;
	        }
	    }
    } else if (type == 'month' && mtArray != null && dtArray == null) {
	    dtMonth = mtArray[2];
	    
	    if (dtMonth < 1 || dtMonth > 12) {
	    	return false;
	    }
    } else {
    	return false;
    }
    
    return true;
}

function dateCompare(startDate, endDate, type) {
	var startDateArr = startDate.split('/');
	var endDateArr = endDate.split('/');
	
	var startDateCompare = "";
	var endDateCompare = "";
	
	if (type == 'day') {
		startDateCompare = new Date(startDateArr[0], parseInt(startDateArr[1])-1, startDateArr[2]);
	    endDateCompare = new Date(endDateArr[0], parseInt(endDateArr[1])-1, endDateArr[2]);
	} else if (type == 'month') {
		startDateCompare = new Date(startDateArr[0], parseInt(startDateArr[1])-1);
	    endDateCompare = new Date(endDateArr[0], parseInt(endDateArr[1])-1);
	}
    
    if(startDateCompare.getTime() > endDateCompare.getTime()) {
        return false;
    }
    
    return true;
}

function cardAutoHypen(str) {
	str = str.replace(/[^0-9]/g, '');
	let strLen = str.length;
	let tmp = '';
	
	if (strLen < 4) {
		return str;
	} else if (strLen < 8) {
		tmp += str.substr(0, 4);
		tmp += '-';
		tmp += str.substr(4,4);
		return tmp;
	} else if (strLen < 12) {
		tmp += str.substr(0, 4);
		tmp += '-';
		tmp += str.substr(4, 4);
		tmp += '-';
		tmp += str.substr(8,4);
		return tmp;
	} else if (strLen < 17) {
		tmp += str.substr(0, 4);
		tmp += '-';
		tmp += str.substr(4, 4);
		tmp += '-';
		tmp += str.substr(8,4);
		tmp += '-';
		tmp += str.substr(12,4);
		return tmp;
	}
	
	return tmp;
}

function commaNumber(str, maxLen) {
	str = String($('#amount').val());
	let minus = str.substring(0, 1);
 
	str = str.replace(/[^\d]+/g, '');
	str = str.substr(0, maxLen);
	str = str.replace(/(\d)(?=(?:\d{3})+(?!\d))/g, '$1,');

	if(minus == '-') {
		str = '-' + str;
	}
	
	return str;
}

function selectYearList() {
	let date = new Date();
	let year = date.getFullYear();
	
	let startYear = Number(year)-2;
	let endYear = Number(year)+5;
	
	for (let i=startYear; i<=endYear; i++) {
		$('#selectYearList').append('<option value="' + i + '" + >' + i + '</option>')
	}
	
	$('#selectYearList').val(year);
}

function fileDownload (fileId) {
    location.href="/api/download/"+fileId;
}
