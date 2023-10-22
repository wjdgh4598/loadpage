/**
 * 서비스요청/확인 공통 스크립트
 */

$(document).ready(function() {

});

// 공통변수
var COMM_API_URL = '/approval/servicedeskcomm';

var SMPL_API_URL = '/approval/servicedesksmpl';
var PROB_API_URL = '/approval/servicedeskprob';
var INCI_API_URL = '/approval/servicedeskinci';
var CHG_DEV_API_URL = '/approval/servicedeskchgdev'; // 변경(개발)
var RELS_API_URL = '/approval/servicedeskrels';

// 결재라인 조회
function getApprovalLine() {
    var params = {
        coId: $('#qusrCompId').val(),
        createEmpId: $('#qusrId').val(),
        srId: $('#srId').val()
    };

    $.get(COMM_API_URL + '/apprlines', params, function(data) {
        if (data == null || data.length == 0) {
            return;
        }

        var apprLines = data.map(function(appr){
            return {
                userNm: appr.apprEmpNm,
                posiNm: appr.apprPosiNm,
                apprTy: appr.apprTy,
                apprDt: appr.apprDt,
            }
        });

        // 작성자 처리
        delete apprLines[0].apprTy;

        drawApprovalLine(apprLines);
    });
}

// 결재유형별로 정렬
function sortApprovalList(approvalList) {
    // 'A': 결재, 'C': 합의, 'S': 확인
    return approvalList.sort(function(prev, next){
        if (prev.apprTy > next.apprTy) {
            return 1; // next를 앞으로
        } else if (prev.apprTy < next.apprTy) {
            return -1; // prev를 앞으로
        }

        return 0; // 유지
    });
}

function clearApprovalLines() {
    $('#approvalLine').find('#approvalLinePosi th:gt(0)').remove();
    $('#approvalLine').find('#approvalLineUser').empty();
    $('#approvalLineSummary').find('#approvalSummaryTd').empty();
}


var APPR_TY_MAP = {
    'A': '결재',
    'C': '합의',
    'S': '확인'
};
// 결재라인 그리기
function drawApprovalLine(approvalList, isDefault) {
    var $apprLine = $('#approvalLine');
    var $summary = $('#approvalLineSummary');

    // 초기화
    $apprLine.find('.added').remove();
    $summary.find('.added').remove();

    if (approvalList == null || approvalList.length === 0) {
        return;
    }

    if ($apprLine.length === 1 && $apprLine.find('tbody').length == 0) {
        $apprLine.append(
            '<tbody>'
          + '  <tr id="approvalLinePosi">'
          + '    <th rowspan="2">결재</th>'
          + '  </tr>'
          + '  <tr id="approvalLineUser">'
          + '  </tr>'
          + '</tbody>'
        );
    }

    if ($summary.length === 1 && $summary.find('tbody').length == 0) {
        $summary.append(
            '<tbody>'
          + '  <tr>'
          + '    <th rowspan="2">결재순서</th>'
          + '    <td id="approvalSummaryTd"></td>'
          + '  </tr>'
          + '</tbody>'
        );
    }

    // 상단 - 간략보기 스타일
    var positionStr = ''
    var userNmStr = '';
    // 요약
    var summaryStr = '';

    var tdClass = isDefault ? 'default' : 'added';

    approvalList.forEach(function(user, index) {
        var userNm = user.userNm;
        var posiNm = user.posiNm;
        var apprDt = user.apprDt || '';
        var apprTyNm = APPR_TY_MAP[user.apprTy] || '작성자';
        var admitStatus = user.admitStatusNm || '';

        positionStr   += '<th class="' + tdClass + '">' + posiNm + '</th>';
        userNmStr     += '<td class="' + tdClass + '">'
                       + '  <span class="' + (apprTyNm === '작성자' ? 'requester' : 'signer')  + '">' + apprTyNm + '  </span>'
                       + '  <span>' + userNm + '</span>'
                       + '</td>';

        summaryStr    += '<div class="approval-process-item ' + tdClass + '">'
                       + '  <p>'
                       + '    <span>' + userNm + '/' + posiNm + '</span>'
                       + '    <span>[' + apprTyNm
                       + ( admitStatus ? '</span><span class="is-approved"><span>:</span><span>' + admitStatus + '</span></span><span>' : '')
                       +     ']</span>'
                       + '  </p>'
                       + '  <p class="signed-date">' + apprDt + '</p>'
                       + '</div>';
    });

    $apprLine.find('#approvalLinePosi').append(positionStr);
    $apprLine.find('#approvalLineUser').append(userNmStr);
    $summary.find('#approvalSummaryTd').append(summaryStr);
}

// 배분할 업무 조회
function getServSelect() {
    $.get(COMM_API_URL + '/myserv', {
        coId : $('#srCcompId').val(),
        reqCl: $('#reqCl').val()
    }, function(data) {
        drawServSelect(data);
    });
}
// 배분할 업무 그리기
function drawServSelect(data) {
    var $servId = $('#servId');
    var reqCl   = $('#reqCl').find(':selected').data();
    var options = {
        dataList    : data,
        value       : 'servId',
        text        : 'servPathNm',
        selectedVal : reqCl.servId
    };
    $servId.addOptions(options);
    $servId.find('option').filter(function() {
        var data = $(this).data();
        return typeof data != 'undefined' && data.myServAt == 'Y';
    }).css('background-color', 'rgba(3, 84, 255, 0.1)');
}

// 마이리스트로 이동
function goToMyList() {
    redirect('/approval/mylist/view');
}

// 요청현황(종합)로 이동
function goToStatsList(url) {
    redirect(url);
}

function getFormInput() {
    return $('#detailForm')
        .find('input, select, textarea')
        .filter(function(){
            // 팝업 데이터 제외
            return !$(this).parents('div').hasClass('popup-container');
        });
}

// 화면입력 데이터 리턴(json)
function getInputData() {
    var params = getFormInput().getData({ skipSearch: true });

    delete params.files;

    return params;
}

// 화면입력 데이터 리턴(FormData)
function getFormData(params) {
    var inputData = params || getInputData();
    var formData = new FormData();

    for ( var key in inputData ) {
        formData.append(key, inputData[key]);
    }

    // 파일 첨부
    var files = getFiles();
    if (files != null && files.length > 0) {
		files.forEach(function(file, index){
		    formData.append('files[' + index + ']', file);
		});

		// 저장 경로
		formData.append('filePath', 'SYSTEM,PGMG');
    }

    return formData;
}

// 파일첨부 fragment에서 등록한 $fileDrop을 참조
function getFiles() {
    if (typeof $fileDrop === 'undefined') {
        return null;
    }

    return $fileDrop.getCheckedFiles();
}

// 입력값 검증
// input에 required="required" 속성이 있어야 함
function validateForm(options) {
    options = options || { showError: true };
    var result = getFormInput().valid($.noop, $.noop, { skipSearch: true });
    if (result) {
        return result;
    }

    var $input = $('#detailForm .is-invalid:first');
    var _activateTab = function() {
        var activeTabIndex = $('div.tabs li.is-active').index();

        if (activeTabIndex === 0 && $('#tabShow2').find($input).length === 1) {
            $('#tab2').trigger('click');
        } else if (activeTabIndex === 1 && $('#tabShow1').find($input).length === 1) {
            $('#tab1').trigger('click');
        }
    };

    if (options.showError) {
	    $.warning('필수값을 입력하세요.', '알림', function(){
	        _activateTab();
            $input.focus();
	    });
    } else {
        _activateTab();
        $input.focus();
    }

    return result;
}

// 서버요청
function sendData(url, msg, params) {
    if (url == null) {
        return;
    }

    if (params instanceof FormData) {
        sendFormData(url, msg, params);
        return;
    }

    params = params || getInputData();
    msg = msg || '처리가 완료되었습니다.';

    $.post(url, params, function() {
        $.get('/api/workflow/getCurrentActivity', { businessKey: params.srId }, function(currentTask) {
            if(Object.prototype.toString.call(currentTask) == '[object Object]'
                    && typeof currentTask.pgmUrlAd == 'string' && currentTask.pgmUrlAd.length > 0) {
                $.alert(msg, '알림', function() {
                    redirect(currentTask.pgmUrlAd + '?srId=' + params.srId);
                });
            }
            else {
                msg += '<br/>목록으로 이동합니다.';
                $.alert(msg, '알림', function() {
                    redirect('/approval/mylist/view');
                });
            }
        });
    });
}

// 서버요청(formdata)
function sendFormData(url, msg, formData) {
    if (url == null || formData instanceof FormData === false) {
        return;
    }

    formData = formData || getFormData();
    msg = msg || '처리가 완료되었습니다.';

    $.ajax({
        url: url,
        data: formData,
        processData: false,
        contentType: false,
        type: 'POST',
        success: function(data) {
            $.get('/api/workflow/getCurrentActivity', { businessKey: formData.get("srId") }, function(currentTask) {
                if(Object.prototype.toString.call(currentTask) == '[object Object]'
                        && typeof currentTask.pgmUrlAd == 'string' && currentTask.pgmUrlAd.length > 0) {
                    $.alert(msg, '알림', function() {
                        redirect(currentTask.pgmUrlAd + '?srId=' + formData.get("srId"));
                    });
                }
                else {
                    msg += '<br/>목록으로 이동합니다.';
                    $.alert(msg, '알림', function() {
                        redirect('/approval/mylist/view');
                    });
                }
            });
        },
        error: function(data) {
            $.alert('요청이 실패했습니다.');
        }
    });
}

function NOT_IMPLEMENTED() { $.alert('미개발...'); }

// 기본정보 조회
function getBaseInfo(callback) {
    var srId = $('#srId').val();
    var actiId = $('#actiId').val();
    callback = callback || $.noop;
    $.get(COMM_API_URL + '/baseinfo', { srId: srId, actiId: actiId }, callback);
}
