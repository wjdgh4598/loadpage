var project_onchange;
var calendar;
var arrHoliDays;



function setAccYYMM_Init() {

    var DraftDate = new Date();

    y = DraftDate.getFullYear()
    m = DraftDate.getMonth() + 1;
    d = DraftDate.getDate();
    /// lkc : 20131001 : 업무일 5일 이전인 경우 이전월 자동선택

    if (m < 10)
        m = "0" + m;
    if (d < 10)
        d = "0" + d;

    var sWORK_YYMM = y + "" + m;
    $("#hdnWORK_YYMM").val(sWORK_YYMM);

    $('#cboWorkYear').find("option").remove();
    $('#cboWorkMonth').find("option").remove();

    for (var i = y - 1; i <= y + 1; i++) {
        $('#cboWorkYear').append($('<OPTION>').attr({ value: i }).append(i + "년"));
    }

    for (var i = 1; i <= 12; i++) {
        if (i < 10) {
            $('#cboWorkMonth').append($('<OPTION>').attr({ value: "0" + i }).append(i + "월"));
        } else {
            $('#cboWorkMonth').append($('<OPTION>').attr({ value: i }).append(i + "월"));
        }
    }

    $('#cboWorkYear').val(y);
    $('#cboWorkMonth').val(m);

}

function initProject() {
	/*
    var jsonPjt = "";
    var row = 1;

    jsonPjt = "[";
    $('#ulProjectAll > li').each(function () {
        var key = $(this).attr('key');
        var remark = $(this).children('div:eq(0)').text();
        if ($(this).children('div:eq(1)').text() != "") {
            remark += ' - ' + $(this).children('div:eq(1)').text();
        }

        if (row > 1) jsonPjt += ",";

        jsonPjt += "{\"key\":\"" + key + "\", \"label\":\"" + remark + "\"}";

        row++;
    });

    jsonPjt += "]";

    jsonProjectList = $.parseJSON(jsonPjt);
    */
}

function doOnLoad() {

    scheduler.config.xml_date = "%Y-%m-%d %H:%i";
    scheduler.config.api_date = "%Y-%m-%d %H:%i";
    scheduler.config.default_date = "%y.%m.%d";
    scheduler.config.month_date = "%Y.%m";
    scheduler.config.day_date = "%Y.%m.%d (%D)";
    //scheduler.config.hour_date = "%H";
    scheduler.config.multi_day = false;
    scheduler.config.start_on_monday = false;
    scheduler.config.time_step = 10;
    scheduler.config.prevent_cache = false;
    scheduler.config.details_on_create = true;
    scheduler.config.details_on_dblclick = true;
    scheduler.config.scroll_hour = 8;
    scheduler.config.fix_tab_position = false;

    project_onchange = function (event) {
        var txt = this.options[this.selectedIndex].text;
        $(this).parent().parent().parent().find('textarea:eq(0)').text(txt);
    };

    scheduler.config.lightbox.sections = [
			{ name: "프로젝트", height: 21, map_to: "project", type: "select", options: jsonProjectList, onchange: project_onchange },
			{ name: "text", height: 80, map_to: "text", type: "textarea", focus: true },
			{ name: "time", height: 72, type: "calendar_time", map_to: "auto", time_format: ["%H:%i", "%m", "%d", "%Y"] }
    //				{ name: "checkbox", map_to: "single_checkbox", type: "checkbox", checked_value: "registrable", unchecked_value: "unchecked" },
    //				{ name: "radiobutton", height: 58, options: pizza_size, map_to: "radiobutton_option", type: "radio", vertical: true },
    //				{ name: "template", height: 21, map_to: "text", type: "template" },
    //				{ name: "recurring", type: "recurring", map_to: "rec_type", button: "recurring"},
    //				{ name: "time", height: 72, type: "time", map_to: "auto"}
	];

    scheduler.templates.tooltip_date_format = scheduler.date.date_to_str("%Y-%m-%d %H:%i");
    scheduler.locale.labels.section_text = '내용';
    scheduler.locale.labels.section_select = 'BU';
    //scheduler.locale.labels.section_template = 'Template';
    scheduler.keys.edit_save = -1;

    scheduler.init('scheduler_here', new Date(), "week");
    //        scheduler.load("./data/events.xml", function () {
    //        });

    scheduler.form_blocks.textarea.set_value = function (node, value, ev) {
        node.firstChild.value = value.replace(/<br>/gi, '\n');
    }

    scheduler.attachEvent("onBeforeViewChange", function (old_mode, old_date, mode, date) {
        $('#hdnCurMode').val(mode);
        $('#hdnCurDate').val(date);
        fnSelect();
        return true;
    });

    scheduler.attachEvent("onBeforeLightbox", change_lightbox);

    scheduler.attachEvent("onKeyUp", function (inp, ev, id, value) {
        if (typeof (value) != "undefined") {
            // radiobutton
            postAlert("onKeyUp event, id: " + id + ",value: " + value + "<br>");
        } else {
            postAlert("onKeyUp event, id: " + id + "<br>");
        }
    });

	
    var dp = new dataProcessor("./ManDay_User_Schedule_ajax.aspx?sMode=saveUserTimeline&UserID=" + sUserId);
    dp.init(scheduler);
    dp.attachEvent("onAfterUpdate", function (id, action, tid, response) {
        var newId = response[0].tid.toString();
        scheduler.changeEventId(id, newId);

        fnSelect();
        //fnSetWorkDayTime();

    });
	
    dp.attachEvent("onBeforeUpdate", function (id, action, tid, response) {
		
        var url = '/baseinfo/putrate/mmcalendar/v1/save';
        var workDate = tid.start_date;
        var workMonth = parseInt(workDate.substring(5, 7));
        var nowDate = new Date($('#hdnCurDate').val());
        var nowMonth = nowDate.getMonth() + 1;

        if (workMonth == nowMonth) {
            if ($('#hdnCloseStatus').val() == "4" || $('#hdnCloseStatus').val() == "5") {
                scheduler.deleteEvent(id);

                postAlert("마감되어 저장할수 없습니다.");
                fnSelect();
                return false;
            }
        }
        else if (workMonth < nowMonth) {
            if ($('#hdnPrevCloseStatus').val() == "4" || $('#hdnPrevCloseStatus').val() == "5") {
                scheduler.deleteEvent(id);
                postAlert("마감되어 저장할수 없습니다.");
                fnSelect();
                return false;
            }
        }
        else if (workMonth > nowMonth) {
            if ($('#hdnNextCloseStatus').val() == "4" || $('#hdnNextCloseStatus').val() == "5") {
                scheduler.deleteEvent(id);
                postAlert("마감되어 저장할수 없습니다.");
                fnSelect();
                return false;
            }
        }

        dp.serverProcessor = url;
        return true;
    });
	

    var format = scheduler.date.date_to_str("%F %j일 (%D)");
    var today = scheduler.date.date_part(new Date());
    scheduler.templates.week_scale_date = function (date) {
        var rtnVal = "";

        if (date.valueOf() == today.valueOf()) {
            rtnVal = "<span class=\"btnToday\"></span>";
        }

        rtnVal += "<span style=\"vertical-align:top;\">" + format(date) + "</span>";

        //if (date.valueOf() == today.valueOf()) return "<div style='background-color:#ffd3bf; padding-top:-5px;'>" + format(date) + "</div>";

        return rtnVal;
    }

    //WorkTime marks and blocks dates
    scheduler.addMarkedTimespan({
        days: [1, 2, 3, 4, 5],
        zones: [0 * 60, 9 * 60],
        css: "gray_section"
    });

    scheduler.addMarkedTimespan({
        days: [1, 2, 3, 4, 5],
        zones: [12 * 60, 13 * 60],
        css: "gray_section"
    });

    scheduler.addMarkedTimespan({
        days: [1, 2, 3, 4, 5],
        zones: [18 * 60, 24 * 60],
        css: "gray_section"
    });

    //Holiday marks and blocks dates
    scheduler.addMarkedTimespan({
        days: [0,6],
        //days: [new Date('2016-07-26'), new Date('2016-07-27')],
        zones: "fullday",
        css: "gray_section"
        //html:"<p style=\"text-align:center;\">휴일</p>"
    });
    scheduler.updateView();

    calendar = scheduler.renderCalendar({
        container: "cal_here",
        date: new Date(),
        navigation: true,
        handler: function (date) {
            scheduler.setCurrentView(date, scheduler._mode);
        }
    });
    scheduler.linkCalendar(calendar);
    //scheduler.setCurrentView(scheduler._date, scheduler._mode);
    scheduler.setCurrentView(new Date(), 'week');

    scheduler.attachEvent("onEventAdded", function (id, ev) {
        var sDt = new Date(ev.start_date);
        var eDt = new Date(ev.end_date);
        var sDay = sDt.getDate();
        var eDay = eDt.getDate();

        if (!ev.text) {
            postAlert("내용을 먼저 입력하세요.");
            return false;
        }
        if (sDay != eDay) {
            postAlert("기간은 동일한 일자만 저장 가능합니다.");
            return false;
        }
        return true;
    })

    scheduler.attachEvent("onEventSave", function (id, ev) {
        var sDt = new Date(ev.start_date);
        var eDt = new Date(ev.end_date);
        var sDay = sDt.getDate();
        var eDay = eDt.getDate();

        if (!ev.project || ev.project == "0") {
            postAlert("프로젝트를 먼저 선택하세요.");
            return false;
        }

        if (!ev.text) {
            postAlert("내용을 먼저 입력하세요.");
            return false;
        }
        if (sDay != eDay) {
            postAlert("기간은 동일한 일자만 저장 가능합니다.");
            return false;
        }
         
        var workMonth = sDt.getMonth() + 1;
        var nowDate = new Date($('#hdnCurDate').val());
        var nowMonth = nowDate.getMonth() + 1;

        if (workMonth == nowMonth) {
            if ($('#hdnCloseStatus').val() == "4" || $('#hdnCloseStatus').val() == "5") {
                postAlert("마감되어 저장할수 없습니다.");
                fnSelect();
                return false;
            }
        }
        else if (workMonth < nowMonth) {
            if ($('#hdnPrevCloseStatus').val() == "4" || $('#hdnPrevCloseStatus').val() == "5") {
                postAlert("마감되어 저장할수 없습니다.");
                fnSelect();
                return false;
            }
        }
        else if (workMonth > nowMonth) {
            if ($('#hdnNextCloseStatus').val() == "4" || $('#hdnNextCloseStatus').val() == "5") {
                postAlert("마감되어 저장할수 없습니다.");
                fnSelect();
                return false;
            }
        }

        return true;
    })

    //fnListFavorite('1');

    $('.divWidgetHeader').click(function () {
        $('.divWidget').children('.ulWidgetBU').slideUp(100);
        $('.widgetArrow').children('span').removeClass('icon290');
        $('.widgetArrow').children('span').addClass('icon291');

        var obj = $(this).parent().children('.ulWidgetBU');
        var objIcon = $(this).find('.widgetArrow').children('span');
        $('.PjtSearchWrpper').slideUp(100);
        $('.widgetSearch').css('background-color', '#a0a0a0');
        $('#txtSrchPjt').val('');

        if (obj.css('display') == "none") {
            obj.slideDown(100);
            objIcon.removeClass('icon291');
            objIcon.addClass('icon290');
        }
        else {
            obj.slideUp(100);
            objIcon.removeClass('icon290');
            objIcon.addClass('icon291');
            $('.widgetSearch').hide();
        }
    });

    $("#txtSrchPjt").keyup(function (evt) {
        if (evt.keyCode == 13) {
            if (!chkSearchVal()) return;
            //fnListFavorite('2');
        }

        //            if ($("#txtSrchPjt").val().length > 1) {
        //                fnListFavorite('2');
        //            }
    });
}

function change_lightbox() {
    initProject();

    scheduler.config.lightbox.sections = [
			{ name: "프로젝트", height: 21, map_to: "project", type: "select", options: jsonProjectList, onchange: project_onchange },
			{ name: "text", height: 80, map_to: "text", type: "textarea", focus: true },
			{ name: "time", height: 72, type: "calendar_time", map_to: "auto", time_format: ["%H:%i", "%m", "%d", "%Y"] }
    	];
    scheduler.resetLightbox();
    return true;
}

function chkSearchVal() {
    if ($("#txtSrchPjt").val().length == 1) {
        postAlert("한글자 이상 입력하세요.");
        return false;
    }

    return true;
}

function initDrag() {
    $(".ulWidgetBU > li").draggable({
        stop: function (event, ui) {
            var drop = scheduler.getActionData(event);
            node = event.target || event.srcElement;
            //node is dropped on a valid scheduler date
            var key = $(this).attr('key');
            var remark = $(this).children('div:eq(0)').text();
            if ($(this).children('div:eq(1)').text() != '')
                remark += ' - ' + $(this).children('div:eq(1)').text();

            var left = ui.offset.left;
            var fixLeft = $('#cal_here').offset().left;
            if (left < fixLeft - 100) {
                if (drop.date) {
                    //create new event
                    var sDt = new Date(drop.date);
                    var eDt = new Date(drop.date);
                    var chkDt = new Date(drop.date);
                    chkDt.setDate(chkDt.getDate() + 1);
                    sDt.setHours(0);
                    sDt.setMinutes(0);
                    sDt.setSeconds(0);
                    chkDt.setHours(0);
                    chkDt.setMinutes(0);
                    chkDt.setSeconds(0);
                    var evs = scheduler.getEvents(new Date(sDt.toUTCString()), new Date(chkDt.toUTCString()));
                    if (fnCalcTotalDayTimeLIne(evs) == 0) {
                        sDt.setHours(9);
                        sDt.setMinutes(0);
                        sDt.setSeconds(0);
                        eDt.setHours(18);
                        eDt.setMinutes(0);
                        eDt.setSeconds(0);
                    }
                    else {
                        sDt = new Date(drop.date);
                        eDt = scheduler.date.add(drop.date, 30, 'minute');
                    }

                    var ev = {
                        text: remark,
                        start_date: sDt,
                        //end_date: scheduler.date.add(drop.date, 30, 'minute'),
                        end_date: eDt,
                        project: key
                    }
                    //add it to the scheduler

                    scheduler.addEvent(ev);

//                    if ($('#hdnCloseStatus').val() != "4" && $('#hdnCloseStatus').val() != "5") {
//                        scheduler.addEvent(ev);
//                    }
//                    else {
//                        alert("마감되어 저장할수 없습니다.");
//                    }
                }
            }
        }, opacity: 1, cursor: 'move', helper: 'clone'

    });

	/*
    $("#ulProjectAll > li > span").click(function () {
        var workMode = "";
        if ($(this).hasClass('btnfavoriteOff')) {
            $(this).removeClass('btnfavoriteOff')
            $(this).addClass('btnfavoriteOn')
            workMode = "I";
        }
        else {
            $(this).removeClass('btnfavoriteOn')
            $(this).addClass('btnfavoriteOff')
            workMode = "D";
        }

        var pjtCd = $(this).parent().attr('key');

        fnSaveUserFavorite(workMode, $('#selUser').val(), pjtCd);

    });
	*/
    $("#ulUserFavorite > li > span").click(function () {
        var pjtCd = $(this).parent().attr('key');
        var workMode = "D";
        $(this).parent().remove();

        fnSaveUserFavorite(workMode, $('#selUser').val(), pjtCd);
    });
}

function numberToDate(num) {
    if (num == "") return;

    var val = num;
    if (parseInt(num) < 10) val = "0" + num.toString();

    return val;
}

function fnListFavorite(flag) {
    var obj = "ulUserFavorite";
    $('.widgetSearch').hide();

    $('#' + obj + ' > li').remove();

	/*
    $.ajax({
        type: "GET",
        url: "./ManDay_User_Schedule_ajax.aspx",
        data: { sMode: 'selectUserFavorite',
            flag: flag,
            WorkYM: $('#hdnWORK_YYMM').val(),
            ComCd: sComCd,
            UserID: $('#selUser').val(),
            PJT_NM: $('#txtSrchPjt').val()
        },
        dataType: "json",
        success: function (response) {
            fnListFavorite_Json(response, flag);
        },
        error: function (result) {
            //postAlert(result.status + " : " + result.description);
        }
    });
    */
    
 	$.get("/baseinfo/putrate/mmprjasgmtset/tab1/prjlist/"+coId+"/"+deptCd , {}, function(data) {
		
		if(!_.isEmpty(data))  {
			fnListFavorite_Json(data, flag);
			/*
        	$('#'+_prefix+'prjCd').addOptions({
			   dataList   : data
			  ,value	  : "prjCd"
			  ,text	      : "prjNm"
			  ,placeholder: "선택"
			});
			*/           				
		}
	});    
        	
}

function fnListFavorite_Json(response, flag) {
    try {
		console.log("flag"+flag);
        var obj = "ulUserFavorite";

        
        var sb = '';
        if (response != null) {
            if (response.length == 0) {
                sb.Append("<h1>등록된 프로젝트가 없습니다.</h1>");
                $('#' + obj).html(sb.ToString());
            }
            else {
				
                for (var i = 0, result; result = response[i]; i++) {
                    var sPJT_CD = result.prjCd.toString();
                    var sPJT_NM = result.prjNm.toString();
                    //var sMGR_DEPT_CD = result.MGR_DEPT_CD.toString();
                    //var sMGR_DEPT_NM = result.MGR_DEPT_NM.toString();
                    //var sMGR_USER_ID = result.MGR_USER_ID.toString();
                    //var sMGR_USER_NM = result.MGR_USER_NM.toString();
                    var sUSER_FG = ''  ;// result.USER_FG.toString();

                    var MGR_TXT = "";
                    /*
                    if (sMGR_DEPT_NM != "") {
                        MGR_TXT = sMGR_DEPT_NM + " (" + sMGR_USER_NM + ")";
                    }
                    */

                    if (sUSER_FG == "Y" || flag == "1")
                        sb = sb +"<li key=\"" + sPJT_CD + "\"><div>" + sPJT_NM + "</div><div>" + MGR_TXT + "</div><span class=\"btnfavoriteOn\"></span></li>";
                    else
                        sb = sb +"<li key=\"" + sPJT_CD + "\"><div>" + sPJT_NM + "</div><div>" + MGR_TXT + "</div><span class=\"btnfavoriteOff\"></span></li>";
                }

                $('#' + obj).html(sb);
            }
        }
        else {
            $('#' + obj).html("<h1>등록된 프로젝트가 없습니다.</h1>");
        }
    }
    catch (e) {
    }

    if (flag == "3") {
//        initProject();

//        scheduler.config.lightbox.sections = [
//			{ name: "프로젝트", height: 21, map_to: "project", type: "select", options: jsonProjectList, onchange: project_onchange },
//			{ name: "text", height: 80, map_to: "text", type: "textarea", focus: true },
//			{ name: "time", height: 72, type: "calendar_time", map_to: "auto", time_format: ["%H:%i", "%m", "%d", "%Y"] }
//    	];
//        scheduler.resetLightbox();
    }
    initDrag();
}


function fnSaveUserFavorite(workmode, user_id, pjt_Cd) {
	
	return;
	
    $.ajax({
        type: "GET",
        url: "./ManDay_User_Schedule_ajax.aspx",
        data: { sMode: 'saveUserFavorite',
            WorkMode: workmode,
            UserID: user_id,
            PjtCd: pjt_Cd
        },
        dataType: "text",
        async: false,
        cache: false,
        success: function (response) {
            //                if (response == "ok")
            //                    fnListFavorite();
        },
        error: function (result) {
            postAlert(result.status + " : " + result.description);
        }
    });
}

function fnToggleSearch() {

    if ($('.PjtSearchWrpper').css('display') == "none") {
        $('.PjtSearchWrpper').slideDown(100);
        $('.widgetSearch').css('background-color', 'rgb(45, 45, 45)');
        $('#txtSrchPjt').focus();
    }
    else {
        $('.PjtSearchWrpper').slideUp(100);
        $('.widgetSearch').css('background-color', '#a0a0a0');
        $('#txtSrchPjt').val('');
        //fnListFavorite('2');
    }
}

function fnSelectStatus() {
    $('#spCloseStatus').text('');
    $('#hdnCloseStatus').val('');

    $.ajax({
        type: "GET",
        url: "./ManDay_DeptPjt_Mng_ajax.aspx",
        data: { sMode: 'SelectUserStatus',
            ComCd: sComCd,
            WorkYM: $('#hdnWORK_YYMM').val(),
            UserId: $('#selUser').val()
        },
        dataType: "json",
        success: function (response) {
            if (response.length > 0) {
                var STATUS_CD = response[0].STATUS_CD.toString();
                var STATUS_NM = response[0].STATUS_NM.toString();
                $('#hdnCloseStatus').val(STATUS_CD);
                $('#hdnPrevCloseStatus').val(response[0].PREV_STATUS_CD.toString());
                $('#hdnNextCloseStatus').val(response[0].NEXT_STATUS_CD.toString());

                if (STATUS_CD != "4" && STATUS_CD != "5")
                    STATUS_NM = "진행중";

                $('#spCloseStatus').text(STATUS_NM);
            }
            else {
                $('#spCloseStatus').text('진행중');
            }
        },
        error: function (result) {
        }
    });
}

function fnCopyTimeline(flag) {
    var msg = "";
    if (flag == "P")
        msg = "전 주 내역을 일괄 등록 하시겠습니까?";
    else
        msg = "월요일 내역을 일괄 등록 하시겠습니까?";

    $.confirm({
        title: '알림',
        content: msg,
        boxWidth: '30%',
        useBootstrap: false,
        buttons: {
            confirm: function () {
                var curDate = $('#hdnCurDate').val();
                var date = new Date(curDate);
                var sYear = date.getFullYear();
                var sMonth = numberToDate(date.getMonth() + 1);
                var sDay = numberToDate(date.getDate());
                var sDate = sYear + '-' + sMonth + '-' + sDay;

                $.ajax({
                    type: "GET",
                    url: "./ManDay_User_Schedule_ajax.aspx",
                    data: { sMode: 'saveCopyTimeLine',
                        WorkMode: flag,
                        UserID: $('#selUser').val(),
                        WorkDate: sDate
                    },
                    dataType: "text",
                    async: false,
                    cache: false,
                    success: function (response) {
                        fnSelect();
                    },
                    error: function (result) {
                        postAlert(result.status + " : " + result.description);
                    }
                });
            },
            cancel: function () {
                postAlert('취소되었습니다.');
            }
        }
    });    
}

function fnCalcTotalDayTimeLIne(ev) {
    var rtnTot = 0;
    var start_date;
    var end_date;

    for (var i = 0; i < ev.length; i++) {
//        start_date = ev[i].start_date;
//        end_date = ev[i].end_date;

//        var diff = Math.abs(start_date.getTime() - end_date.getTime());
//        var minutes = Math.floor((diff / 1000) / 60);
        var minutes = parseFloat(ev[i].SUM_TM);

        rtnTot += minutes;
    }

    return rtnTot;
}

function fnSetWorkDayTime() {
    if ($('#selUser').val() == "null" || $('#selUser').val() == "") return;

    var idx = 0;
    var format = scheduler.date.date_to_str("%F %j일 (%D)");
    var today = scheduler.date.date_part(new Date());

    scheduler.templates.week_scale_date = function (date) {
        idx++;

        if (idx % 7 == 1 || idx % 7 == 0) return format(date);

        var fromDate = new Date(date);
        var toDate = new Date(date);
        toDate.setDate(toDate.getDate() + 1);
        //var evs2 = scheduler.getEvents()
        fromDate.setHours(0);
        fromDate.setMinutes(0);
        fromDate.setSeconds(0);
        toDate.setHours(0);
        toDate.setMinutes(0);
        toDate.setSeconds(0);

        var evs = scheduler.getEvents(new Date(fromDate.toUTCString()), new Date(toDate.toUTCString()));
        var totTime = fnCalcTotalDayTimeLIne(evs);
        var rtnVal = "";

        if (date.valueOf() == today.valueOf()) {
            //rtnVal = "<div style='background-color:#ffd3bf; padding-top:-5px;'>" + format(date) + "</div>";
            rtnVal = "<span class=\"btnToday\"></span>";
        }

        rtnVal += "<span style=\"vertical-align:top;\">" + format(date) + "</span>";

        if (totTime < 480) {
            var cYear = fromDate.getFullYear();
            var cMonth = fromDate.getMonth() + 1;
            var cDay = fromDate.getDate();

            cMonth = cMonth < 10 ? "0" + cMonth : cMonth;
            cDay = cDay < 10 ? "0" + cDay : cDay;
            sDate = cYear + '-' + cMonth + '-' + cDay;
            var isHoliday = false;
            for (kk = 0; kk < arrHoliDays.length; kk++) {
                if (arrHoliDays[kk].DateText == sDate) {
                    isHoliday = true;
                    break;
                }
            }
            //return "<div class=\"notWorkTIme\">" + format(date) + "</div>";
            if (!isHoliday)
                rtnVal += "<span class=\"btnnotWorkTIme\"></span>";
        }

        return rtnVal;

    }
    scheduler.updateView();

    fnCalendarInit();
}

function fnCalendarInit() {
    if ($('#selUser').val() == null || $('#selUser').val() == '' || $('#selUser').val() == "null") return;

    $.ajax({
        type: "GET",
        url: "./ManDay_DeptPjt_Mng_ajax.aspx",
        data: { sMode: 'SelectUserTimelineNoWorkList',
            WorkYM: $('#hdnWORK_YYMM').val(),
            UserId: $('#selUser').val()
        },
        dataType: "json",
        success: function (response) {
            fnCalendarInit_Json(response);
        },
        error: function (result) {
            postAlert(result.status + " : " + result.description);
        }
    });
}
function fnCalendarInit_Json(response) {
    var arrDays = [];
    var yy = $('#hdnWORK_YYMM').val().substring(0, 4);
    var mm = $('#hdnWORK_YYMM').val().substring(4, 6);

    if (response != null) {
        for (var i = 0, result; result = response[i]; i++) {
            var sDAYS = result.DAYS.toString();
            var sWORK_TM = result.WORK_TM.toString();
            var sDate = yy + '-' + mm + '-' + sDAYS;
            var isHoliday = false;
            for (kk = 0; kk < arrHoliDays.length; kk++) {
                if (arrHoliDays[kk].DateText == sDate) {
                    isHoliday = true;
                    break;
                }
            }

            if (!isHoliday)
                scheduler.markCalendar(calendar, new Date(sDate), "dhx_calendar_noTime");

            //arrDays.push(sDAYS);
        }
        scheduler.updateView();
    }

//    $('.dhx_year_body tbody tr').each(function () {
//        $(this).children('td').each(function () {
//            if (!$(this).hasClass('dhx_before') && !$(this).hasClass('dhx_after')) {
//                var obj = $(this).children('.dhx_month_head');

//                if (arrDays.indexOf($.trim($(obj).text())) >= 0) {
//                    $(obj).addClass('dhx_calendar_noTime');
//                }
//            }
//        });
//    });
}

function getHolidayList() {
	return;
    var nowDate = new Date($('#hdnCurDate').val());
    var nowYear = nowDate.getFullYear();
    var nowMonth = nowDate.getMonth() + 1;

    $.ajax({
        type: "GET",
        url: "./ManDay_DeptPjt_Mng_ajax.aspx",
        data: { sMode: 'SelecHolidayMonth',
            WorkYM: $('#hdnWORK_YYMM').val()
        },
        dataType: "json",
        success: function (response) {
            getHolidayList_ajax(response);
        },
        error: function (result) {
            postAlert(result.status + " : " + result.description);
        }
    });
}

function getHolidayList_ajax(response) {
    arrHoliDays = response; 
    for (kk = 0; kk < arrHoliDays.length; kk++) {
        //Holiday marks and blocks dates
        scheduler.addMarkedTimespan({
            days: [new Date(arrHoliDays[kk].DateText), new Date(arrHoliDays[kk].DateText)],
            zones: "fullday",
            css: "gray_section",
            html: "<p style=\"text-align:center;\">" + arrHoliDays[kk].HoliText + "</p>"
        });
    }
    scheduler.updateView();

    fnSetWorkDayTime();

}
