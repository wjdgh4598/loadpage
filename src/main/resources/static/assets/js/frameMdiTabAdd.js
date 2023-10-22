const _mdiContainer = top.document.querySelector('.tab-contents.is-mdi');
const _mdiTabContainer = top.document.querySelector('.tabs.is-mdi');

/**
 * MDI Contents Load
 */
function pageMdiOnLoad(url, pageEl) {
    var data = null;
    switch (pageEl) {
        case "1": //
            data = { breadcrumb: "보상>급여회계 및 리포트>급여지출결의서작성", pathname: "", menuId: "77", uprMenuId: "52", pgmId: "449", relBizCod: "PR", favPgmAt: "N", menuTyCod: "" };
            break;
        case "2": // 테스트
            data = { breadcrumb: "시스템>코드관리>직급코드관리", pathname: "", menuId: "2", uprMenuId: "1", pgmId: "213", relBizCod: "SY", favPgmAt: "N", menuTyCod: "" };
            break;
        case "3": // 목표설정 평가진행현황관리(담당자)
            data = { breadcrumb: "평가>목표설정>목표설정", pathname: "", menuId: "111", uprMenuId: "109", pgmId: "1051", relBizCod: "AP", favPgmAt: "N", menuTyCod: "" };
            break;
        case "4": // 중간점검 평가진행현황관리(담당자)
            data = { breadcrumb: "평가>중간점검>중간점검(담당자)", pathname: "", menuId: "113", uprMenuId: "109", pgmId: "1046", relBizCod: "AP", favPgmAt: "N", menuTyCod: "" };
            break;
        case "5": // 중간점검 평가진행현황관리(관리자)
            data = { breadcrumb: "평가>중간점검>중간점검(관리자)", pathname: "", menuId: "113", uprMenuId: "109", pgmId: "1049", relBizCod: "AP", favPgmAt: "N", menuTyCod: "" };
            break;
        case "6": // 연말평가 평가진행현황관리(담당자)
            data = { breadcrumb: "평가>연말평가>연말평가(담당자)", pathname: "", menuId: "114", uprMenuId: "109", pgmId: "1055", relBizCod: "AP", favPgmAt: "N", menuTyCod: "" };
            break;
        case "7": // 연말평가 평가진행현황관리(관리자)
            data = { breadcrumb: "평가>연말평가>연말평가(관리자)", pathname: "", menuId: "114", uprMenuId: "109", pgmId: "1056", relBizCod: "AP", favPgmAt: "N", menuTyCod: "" };
            break;
        case "8": // 다면평가 평가진행현황관리(담당자)
            data = { breadcrumb: "평가>다면평가>다면평가(담당자)", pathname: "", menuId: "109", uprMenuId: "109", pgmId: "1065", relBizCod: "AP", favPgmAt: "N", menuTyCod: "" };
            break;
        case "9": // 다면평가 평가진행현황관리(평가자용)
            data = { breadcrumb: "직원메뉴>평가>다면평가", pathname: "", menuId: "112", uprMenuId: "67", pgmId: "1069", relBizCod: "AP", favPgmAt: "N", menuTyCod: "" };
            break;
        case "10": // 자기신고서 진행현황관리(담당자)
            data = { breadcrumb: "평가>자기신고서>자기신고서", pathname: "", menuId: "116", uprMenuId: "67", pgmId: "1066", relBizCod: "AP", favPgmAt: "N", menuTyCod: "" };
            break;
        default:
            data = "";
    }

    if (data == "") {
        return false;
    }

    url = new URL(url, location.origin);

    var datasetObject = eval(data);

    var dataset = datasetObject;

    var mdiTabUl = $(_mdiTabContainer);
    mdiTabUl.find(".tab.is-mdi").removeClass("is-active");
    var currTab = mdiTabUl.find(getMdiMenuPgmSelector(dataset)).parent();
    var container = $(_mdiContainer);
    //$(".tab-contents.is-mdi .tab-content .page-body", window.parent.document).removeClass("is-active");
    container.find('.tab-content').removeClass('is-active');
    var currFrameLi = container.find(getMdiMenuPgmSelector(dataset)).parent().parent();
    if (currFrameLi.length == 0) {
        // 새로 열기
        var topMenuNm = $(".navbar-left .navbar-item.is-active").text();
        var current = $(".menu .menu-item.is-active");
        var menuPath = current
            .find(".menu-link, .sub-menu-item.is-active .sub-menu-link")
            .map(function () {
                return $(this).text();
            })
            .toArray();

        var iframeEl = document.createElement("iframe");
        iframeEl.style.width = "100%";
        iframeEl.src = url;

         /*
        iframeEl.addEventListener('load', function() {
            _pageLoaded = true;
            $('#content-loading').hide();
            setTimeout(function() {
                iframeEl.style.height = iframeEl.contentDocument.body.scrollHeight + 'px';
            }, 100)
        });

         */
        // iframeEl.classList.add("is-grown-vertically");

        for (var key in getMdiDataset(datasetObject)) {
            iframeEl.dataset[key] = datasetObject[key];
        }
        iframeEl.dataset["breadcrumb"] = datasetObject.breadcrumb || [topMenuNm].concat(menuPath).join(">");
        for (var key in getMdiDataset(iframeEl.dataset)) {
            datasetObject[key] = iframeEl.dataset[key];
        }

        var breadcrumb = iframeEl.dataset["breadcrumb"].split(">");
        var tabEl = document.createElement("template");
        tabEl.innerHTML = '<li class="tab is-mdi is-active">' + '<a href="#!" ' + getMdiDataAttribute(iframeEl.dataset) + ' rel="noopener">' + breadcrumb[2] + "</a>" + '<button type="button" class="button is-mdi is-ghost">' + '<span class="icon is-close is-gray is-medium">' + "<svg>" + '<use href="#close"></use>' + "</svg" + "</span>" + "</button>" + "</li>";
        tabEl = Ustra._getChildNodes(tabEl)[0];
        mdiTabUl.append(tabEl);

        var frameWrapper = window.parent.document.querySelector('.tab-contents.is-mdi');
        var container = window.parent.document.createElement('div');
        var pageBody = window.parent.document.createElement('div');

        frameWrapper.appendChild(container);
        container.appendChild(pageBody);
        pageBody.appendChild(iframeEl);

        $(container).addClass('tab-content is-active');
        $(pageBody).addClass('page-body');

        iframeEl.addEventListener('load', function() {
            if (typeof callback == 'function') {
                callback($(this));
                _pageLoaded = true;
                $('#content-loading').hide();
                console.log("page dynamic iframe loading 완료!");
            }
        });
    } else {
        _pageLoaded = true;
        $("#content-loading").hide();

        currTab.addClass("is-active");
        currFrameLi.addClass("is-active");

        var mdiparam = new URLSearchParams(url.search).get("mdiparam");
        // console.log("mdiparam: ",mdiparam);
        if (mdiparam) {
            var paramDecode = CryptoJS.AES.decrypt(window.atob(mdiparam), $_key);
            var paramObj = JSON.parse(paramDecode.toString(CryptoJS.enc.Utf8));
            // console.log("paramText: ",paramObj);
            var key = Object.keys(paramObj)[0];
            var ifrm = container.find("div.is-active iframe");
            var $control = ifrm.contents().find("#" + key);
            if ($control) {
                $control.val(paramObj[key]);

                var caller = ifrm[0].contentWindow;
                if (typeof caller.sendMdiParamCallback != "undefined") {
                    caller.sendMdiParamCallback();
                } else if (typeof caller.sendMdiParamAppprogressgCallback != "undefined") {
                    // 목표설정(담당자)
                    caller.sendMdiParamAppprogressgCallback(paramObj);
                } else if (typeof caller.sendMdiParamAppprogresspCallback != "undefined") {
                    // 중간점검(담당자)
                    caller.sendMdiParamAppprogresspCallback(paramObj);
                } else if (typeof caller.sendMdiParamAppprogresspaCallback != "undefined") {
                    // 중간점검(관리자)
                    caller.sendMdiParamAppprogresspaCallback(paramObj);
                } else if (typeof caller.sendMdiParamAppprogressyCallback != "undefined") {
                    // 연말평가(담당자)
                    caller.sendMdiParamAppprogressyCallback(paramObj);
                } else if (typeof caller.sendMdiParamAppprogressyaCallback != "undefined") {
                    // 연말평가(관리자)
                    caller.sendMdiParamAppprogressyaCallback(paramObj);
                } else if (typeof caller.sendMdiParamAppprogressmCallback != "undefined") {
                    // 다면평가(담당자)
                    caller.sendMdiParamAppprogressmCallback(paramObj);
                } else if (typeof caller.sendMdiParamAppprogressmpCallback != "undefined") {
                    // 다면평가(평가자용)
                    caller.sendMdiParamAppprogressmpCallback(paramObj);
                } else if (typeof caller.sendMdiParamAppprogresssCallback != "undefined") {
                    // 자기신고서(담당자)
                    caller.sendMdiParamAppprogresssCallback(paramObj);
                }
            }
        }
    }
}

/**
 * MDI Contents Load frame 내에서 호출...iframe을 호출함...
 */
function getMdiData(pgmId, pgmUrlAd) {
    return new Promise(function (resolve, reject) {
        $.get("/open-api/system/tabopen", { pgmId: pgmId, pgmUrlAd: pgmUrlAd }, function (result) {
            //console.log(result);
            resolve(result);
        });
    });
}

function pageMdiOnLoad_new(data, url) {
    //console.log(data);
    //console.log(url);

    var frames = window.parent.document.querySelectorAll('.tab-content > .page-body iframe')
    if (frames.length >= 12) {
        //$.alert('탭이 너무 많이 열려있습니다. 사용하지 않는 탭을 닫고 이용해주시기 바랍니다.');
        //return;
    }

    if (data == "") {
        return false;
    }

    url = new URL(url, location.origin);

    var datasetObject = eval(data);

    var dataset = datasetObject;

    console.log(dataset);

    var mdiTabUl = $(_mdiTabContainer);
    mdiTabUl.find(".tab.is-mdi").removeClass("is-active");
    var currTab = mdiTabUl.find(getMdiMenuPgmSelector(dataset)).parent();
    var container = $(_mdiContainer);
    //$(".tab-contents.is-mdi .tab-content", window.parent.document).removeClass("is-active");
    container.find('.tab-content').removeClass('is-active');
    var currFrameLi = container.find(getMdiMenuPgmSelector(dataset)).parent().parent();
    if (currFrameLi.length == 0) {
        // 새로 열기
        var topMenuNm = $(".navbar-left .navbar-item.is-active").text();
        var current = $(".menu .menu-item.is-active");
        var menuPath = current
            .find(".menu-link, .sub-menu-item.is-active .sub-menu-link")
            .map(function () {
                return $(this).text();
            })
            .toArray();

        var iframeEl = document.createElement("iframe");
        iframeEl.style.width = "100%";
        iframeEl.src = url;
        /*
        iframeEl.addEventListener('load', function() {
            _pageLoaded = true;
            $('#content-loading').hide();
            setTimeout(function() {
                iframeEl.style.height = iframeEl.contentDocument.body.scrollHeight + 'px';
            }, 100)
        });
        */
        iframeEl.classList.add("is-grown-vertically");

        for (var key in getMdiDataset(datasetObject)) {
            iframeEl.dataset[key] = datasetObject[key];
        }
        iframeEl.dataset["breadcrumb"] = datasetObject.breadcrumb || [topMenuNm].concat(menuPath).join(">");
        for (var key in getMdiDataset(iframeEl.dataset)) {
            datasetObject[key] = iframeEl.dataset[key];
        }

        var breadcrumb = iframeEl.dataset["breadcrumb"].split(">");
        var tabEl = document.createElement("template");
        tabEl.innerHTML = '<li class="tab is-mdi is-active">' + '<a href="#!" ' + getMdiDataAttribute(iframeEl.dataset) + ' rel="noopener">' + breadcrumb[2] + "</a>" + '<button type="button" class="button is-mdi is-ghost">' + '<span class="icon is-close is-gray is-medium">' + "<svg>" + '<use href="#close"></use>' + "</svg>" + "</span>" + "</button>" + "</li>";
        tabEl = Ustra._getChildNodes(tabEl)[0];
        mdiTabUl.append(tabEl);

        var frameWrapper = window.parent.document.querySelector('.tab-contents.is-mdi');
        var container = window.parent.document.createElement('div');
        var pageBody = window.parent.document.createElement('div');

        frameWrapper.appendChild(container);
        container.appendChild(pageBody);
        pageBody.appendChild(iframeEl);

        $(container).addClass('tab-content is-active');
        $(pageBody).addClass('page-body');

        /*
        $.ajax({
            type: "GET",
            url: url.toString(),
            contentType: "text/html",
            beforeSend: function (xhr, settings) {
                xhr.setRequestHeader("X-MDI-Frame", "true");
            },
            success: function (data) {
                //iframeEl.src = url.toString();
                iframeEl.contentDocument.open().write(data);
                iframeEl.contentDocument.close();
            }
        });
         */

        iframeEl.addEventListener('load', function() {
            if (typeof callback == 'function') {
                callback($(this));
                _pageLoaded = true;
                $('#content-loading').hide();
                console.log("page dynamic iframe loading 완료!");
            }
        });
    } else {
        _pageLoaded = true;
        $("#content-loading").hide();

        currTab.addClass("is-active");
        currFrameLi.addClass("is-active");

        var mdiparam = new URLSearchParams(url.search).get("mdiparam");
        // console.log("mdiparam: ",mdiparam);
        if (mdiparam) {
            var paramDecode = CryptoJS.AES.decrypt(window.atob(mdiparam), $_key);
            var paramObj = JSON.parse(paramDecode.toString(CryptoJS.enc.Utf8));
            // console.log("paramText: ",paramObj);
            var key = Object.keys(paramObj)[0];
            var ifrm = container.find("div.is-active iframe");
            var $control = ifrm.contents().find("#" + key);
            if ($control) {
                $control.val(paramObj[key]);

                var caller = ifrm[0].contentWindow;
                if (typeof caller.sendMdiParamCallback != "undefined") {
                    caller.sendMdiParamCallback(paramObj);
                }
            }
        }
    }
}

function callback(obj){
    console.log("height: " + $(obj).contents().find("body").height());
    $(obj).css("height", $(obj).contents().find("body").height() + "px");
}

function getMdiMenuPgmSelector(dataset) {
    return '[data-menu-id="' + dataset.menuId + '"][data-pgm-id="' + dataset.pgmId + '"]';
}

function getMdiDataset(obj) {
    var dataset = {};
    ["breadcrumb", "pathname", "menuId", "uprMenuId", "pgmId", "relBizCod", "favPgmAt", "menuTyCod"].forEach(function (key) {
        dataset[key] = obj[key];
    });
    return dataset;
}

/**
 * JSON에서 data attribute string을 구한다.
 *
 * @param obj
 * @returns {string}
 */
function getMdiDataAttribute(obj) {
    var attr = [];
    for (var key in getMdiDataset(obj)) {
        attr.push("data-".concat(_.kebabCase(key), '="', obj[key] || "", '"'));
    }
    return attr.join(" ");
}
