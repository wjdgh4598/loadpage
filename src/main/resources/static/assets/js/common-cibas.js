
function buildCiForm(id, data, params) {
    var layer = document.getElementById(id);
    layer.textContent = '';
    layer.style.opacity = '0';

    var headWrap = document.createElement('div');
    headWrap.className = 'head';

    for(var key in params) {
        var inputEl = document.createElement('input');
        inputEl.type  = 'hidden';
        inputEl.name  = key;
        inputEl.value = params[key];
        headWrap.appendChild(inputEl);
    }
    layer.appendChild(headWrap);

    // 데이터 취합
    var ciAttrGrpData = {};
    data.ciAttr.forEach(function(item) {
        if(!ciAttrGrpData.hasOwnProperty(item.ciAttrGrpId)) {
            ciAttrGrpData[item.ciAttrGrpId] = [];
        }
        ciAttrGrpData[item.ciAttrGrpId].push(item);
    });
    var ciAttrData = {};
    data.ciAttrVal.forEach(function(item) {
        if(!ciAttrData.hasOwnProperty(item.ciAttrId)) {
            ciAttrData[item.ciAttrId] = [];
        }
        ciAttrData[item.ciAttrId].push(item);
    });


    // CI 속성 그룹 처리
    buildCiAttrGrp(layer, data.ciAttrGrp, ciAttrGrpData, ciAttrData);

    // Date Picker 생성
    $('input[aria-label="Date-Time"]').each(function() {
        $('#' +this.id).datepicker({
            format: 'yyyy-mm-dd',
            todayBtn: true,
            autoclose : true,
            clearBtn : true,
            language : 'ko',
            todayHighlight: true,
            templates: {
                leftArrow: '<span class="icon is-calendar-chevron-left is-medium"><svg><use href="#calendar-chevron-left"></use></svg></span>',
                rightArrow: '<span class="icon is-calendar-chevron-right is-medium"><svg><use href="#calendar-chevron-left"></use></svg></span>'
            }
        });
        $("#" +this.id).datepicker('setDate', new Date());
    });

    // Date Picker YYYY-MM 생성
    $('input[aria-label="Date-Time-YM"]').each(function() {
        $('#' +this.id).datepicker({
            format: 'yyyy-mm',
            minViewMode: 'months',
            todayBtn: false,
            autoclose : true,
            clearBtn : true,
            language : 'ko',
            todayHighlight: true,
            templates: {
                leftArrow: '<span class="icon is-calendar-chevron-left is-medium"><svg><use href="#calendar-chevron-left"></use></svg></span>',
                rightArrow: '<span class="icon is-calendar-chevron-right is-medium"><svg><use href="#calendar-chevron-left"></use></svg></span>'
            }
        });
        $("#" +this.id).datepicker('setDate', new Date());
    });

    // Date Picker YYYY 생성
    $('input[aria-label="Date-Time-YY"]').each(function() {
        $('#' +this.id).datepicker({
            format: 'yyyy',
            minViewMode: 'years',
            todayBtn: false,
            autoclose : true,
            clearBtn : true,
            language : 'ko',
            todayHighlight: true,
            templates: {
                leftArrow: '<span class="icon is-calendar-chevron-left is-medium"><svg><use href="#calendar-chevron-left"></use></svg></span>',
                rightArrow: '<span class="icon is-calendar-chevron-right is-medium"><svg><use href="#calendar-chevron-left"></use></svg></span>'
            }
        });
        $("#" +this.id).datepicker('setDate', new Date());
    });

    // File Drop 생성
    //buildFileDrop(layer, params);

    layer.style.opacity = '1';
}

function buildCiAttrGrp(layer, data, ciAttrGrpData, ciAttrData) {

    for(var i = 0; i < data.length; i++) {
        var group = data[i];
        if(typeof ciAttrGrpData[group.ciAttrGrpId] == 'undefined') continue;

        var table = document.createElement('table');
        table.className = 'table is-striped-vertically is-fullwidth';

        var template = document.createElement('template');
        template.innerHTML = '<colgroup><col style="width: 120rem" /><col><col style="width: 110rem" /><col><col style="width: 110rem" /><col></colgroup>';

        template = template.content.childNodes[0];
        table.appendChild(template);

        table.appendChild(buildCiAttr(ciAttrGrpData[group.ciAttrGrpId], ciAttrData));
        layer.appendChild(table);
    }
}

function buildCiAttr(data, ciAttrData) {
    if(typeof data == 'undefined') return;

    var layer = document.createElement('tbody');

    var tr = document.createElement('tr');

    for(var i = 0; i < data.length; i++) {
        var attr = data[i];
        if(typeof ciAttrData[attr.ciAttrId] == 'undefined' && ['1020','1030','1040'].includes(attr.columnTypeCode)) continue;

        // 현재 행에 입력란이 이미 있는 경우
        // TEXTAREA 등 너비 전체를 차지해, colspan 적용키 위함
        if(['0317'].includes(attr.columnTypeCode) && tr.children.length !== 0) {
            appendEmpty(tr);
            layer.append(tr);
            tr = document.createElement('tr');
        }

        var template = document.createElement('template');
        template.innerHTML = (attr.manYn == 'Y' ? '<th><span class="is-required">'+attr.ciAttrNm+'</span></th>' : '<th>'+attr.ciAttrNm+'</th>');
        template = template.content.childNodes[0];
        tr.appendChild(template);

        template = document.createElement('template');
        template.innerHTML = '<td></td>';
        template = template.content.childNodes[0];


        template.appendChild(buildCiAttrVal(attr, ciAttrData[attr.ciAttrId]));
        template.dataset.name = attr.ciAttrNm;
        tr.appendChild(template);

        if(['0317'].includes(attr.columnTypeCode)) {
            template.setAttribute('colspan', '5');
            layer.append(tr);
            tr = document.createElement('tr');
        }
        else if(tr.children.length == 6) {
            layer.append(tr);
            tr = document.createElement('tr');
        }
    }

    if(!layer.contains(tr) && Number(tr.childNodes.length) > 0) {
        appendEmpty(tr);
        layer.append(tr);
        if (Number(tr.childNodes.length) >= 2 && Number(tr.childNodes.length) <= 4) {
            appendEmpty(tr);
            layer.append(tr);
        }
    }

    return layer;
}

function buildCiAttrVal(attr, data) {
    switch(attr.columnTypeCode) {
    case '1010': // TEXT
        return buildInput(attr);
    case '0317': // TEXTAREA
        return buildTextArea(attr);
    case '1020': // SELECT
        return buildSelect(attr, data);
    case '1030': // RADIO
        return buildRadio(attr, data);
    case '1040': // CHECK
        return buildCheckBox(attr, data);
    case '1050': // DATE_YYYY-MM-DD
        return buildDatePicker(attr, 'Date-Time');
    case '1060': // DATE_YYYY-MM
        return buildDatePicker(attr, 'Date-Time-YM');
    case '1070': // DATE_YYYY
        return buildDatePicker(attr, 'Date-Time-YY');
    case '1260': // SELECT
        return buildSelect(attr, data);
    case '1220': // SELECT
        return buildSelect(attr, data);
    case '1100': // EMP POP
        return buildEmpInput(attr);
    default:
        return buildInput(attr);
    }
}

function buildInput(attr) {
    var TEMPLATE  = '<input type="{{TYPE}}" id="{{ID}}" name="{{NAME}}" title="{{TITLE}}" value="{{DEFAULTVAL}}" class="input" style="{{STYLE}}" data-ci-attr-grp-id="{{GROUP}}" data-ci-attr-id="{{NAME}}" {{REQUIRED}}>';

    var inputHtml = TEMPLATE
        .replace(/\{\{ID\}\}/g, attr.ciAttrGrpId+'_'+attr.ciAttrId)
        .replace(/\{\{TITLE\}\}/g, attr.ciAttrNm)
        .replace(/\{\{GROUP\}\}/g, attr.ciAttrGrpId)
        .replace(/\{\{NAME\}\}/g, attr.ciAttrId)
        .replace(/\{\{DEFAULTVAL\}\}/g, attr.defaultValue)
        .replace(/\{\{TYPE\}\}/g, (attr.dataTypeCode == '10' ? 'text' : 'number'))
        .replace(/\{\{STYLE\}\}/g, (attr.dataTypeCode == '20' ? 'text-align : right' : ''))
        .replace(/\{\{REQUIRED\}\}/g, (attr.manYn == 'Y' ? 'required' : ''));

    var input = document.createElement('template');
    input.innerHTML = inputHtml;
    input = input.content.childNodes[0];

    return input;
}

function buildEmpInput(attr) {

    var TEMPLATE = '<div class="field is-grouped">'
                 +   '<div class="control is-medium" style="width: 29.2%">'
                 +     '<input type="text" class="input" id="ATYP11_pEmplNo" title="{{TITLE}}" name="{{NAME}}" autocomplete="off"  {{REQUIRED}}>'
                 +   '</div>'
                 +   '<button id="_ATYP_EMP_NO_BTN" type="button" class="button is-search is-outline is-secondary is-medium is-square">'
                 +   '<span class="icon is-search is-blue is-medium"><svg><use href="#search"></use></svg></span>'
                 +   '</button>'
                 + '</div>'
                 ;

    var inputHtml1 = TEMPLATE
        .replace(/\{\{ID\}\}/g, attr.ciAttrGrpId+'_'+attr.ciAttrId)
        .replace(/\{\{NAME\}\}/g, attr.ciAttrId)
        .replace(/\{\{TITLE\}\}/g, attr.ciAttrNm)
        .replace(/\{\{BTNNAME\}\}/g, attr.ciAttrId+'_BTN')
        .replace(/\{\{REQUIRED\}\}/g, (attr.manYn == 'Y' ? 'required' : ''));
        ;

    var inputHtml = '<div>{{EMP_INPUT}}</div>'
        .replace(/\{\{EMP_INPUT\}\}/g, inputHtml1);

    var input = document.createElement('template');
    input.innerHTML = inputHtml;
    input = input.content.childNodes[0];

    var TEMPLATE_SCRIPT = 'var $_emplNoEl = "{{ID}}"'
                        + '$_emplNoEl.on("keyup", onKeyPress);'
                        ;

    var scriptHtml1 = TEMPLATE_SCRIPT
        .replace(/\{\{ID\}\}/g, attr.ciAttrGrpId+'_'+attr.ciAttrId)
        .replace(/\{\{NAME\}\}/g, attr.ciAttrId)
        .replace(/\{\{TITLE\}\}/g, attr.ciAttrNm)
        .replace(/\{\{BTNNAME\}\}/g, attr.ciAttrId+'_BTN')
        .replace(/\{\{REQUIRED\}\}/g, (attr.manYn == 'Y' ? 'required' : ''));
        ;

    var js = document.createElement('script');
    js.type ='text/javascript';
    js.src = '/assets/js/atypical/common-cibas-script.js';
    var s = document.getElementsByTagName('script')[0];
    s.parentNode.insertBefore(js, s);

    return input;
}


function buildTextArea(attr) {
    var TEMPLATE = '<textarea id="{{ID}}" name="{{NAME}}" class="textarea data-bind {{NAME}}" data-ci-attr-grp-id="{{GROUP}}" data-ci-attr-id="{{NAME}}"></textarea>';

    var textareaHtml = TEMPLATE
        .replace(/\{\{ID\}\}/g, attr.ciAttrGrpId+'_'+attr.ciAttrId)
        .replace(/\{\{GROUP\}\}/g, attr.ciAttrGrpId)
        .replace(/\{\{NAME\}\}/g, attr.ciAttrId);

    var textarea = document.createElement('template');
    textarea.innerHTML = textareaHtml;
    textarea = textarea.content.childNodes[0];

    return textarea;
}

function buildSelect(attr, data) {
    var TEMPLATE = '<div class="field"><div class="control is-select is-medium"><select id="{{ID}}" name="{{NAME}}" class="{{NAME}}" title="{{TITLE}}" data-ci-attr-grp-id="{{GROUP}}" data-ci-attr-id="{{NAME}}" {{REQUIRED}}>{{OPTIONS}}</select></div></div>';
    var OPTIONS_TEMPLATE  = '<option value="{{VALUE}}" {{SELECTED}}>{{LABEL}}</option>';

    data.unshift({"attrItemCod":"", "attrItemNm":"선택"}); // 선택추가

    var options = data.map(function(item) {
        return OPTIONS_TEMPLATE
            .replace(/\{\{VALUE\}\}/g, item.attrItemCod)
            .replace(/\{\{LABEL\}\}/g, item.attrItemNm)
            .replace(/\{\{SELECTED\}\}/g, (item.dfltAt == 'Y' ? 'selected' : ''));
    }).join('');

    var selectHtml = TEMPLATE
        .replace(/\{\{ID\}\}/g, attr.ciAttrGrpId+'_'+attr.ciAttrId)
        .replace(/\{\{NAME\}\}/g, attr.ciAttrId)
        .replace(/\{\{GROUP\}\}/g, attr.ciAttrGrpId)
        .replace(/\{\{OPTIONS\}\}/g, options)
        .replace(/\{\{TITLE\}\}/g, attr.ciAttrNm)
        .replace(/\{\{REQUIRED\}\}/g, (attr.manYn == 'Y' ? 'required' : ''));

    var select = document.createElement('template');
    select.innerHTML = selectHtml;
    select = select.content.childNodes[0];



    return select;
}

function buildRadio(attr, data) {
    var TEMPLATE = '<div class="field"><div class="control">{{RADIO}}</div>';
    var RADIO_TEMPLATE = '<label class="radio">'
                       +   '<input type="radio" id="{{ID}}" name="{{NAME}}" class="{{NAME}}" value="{{VALUE}}" data-ci-attr-grp-id="{{GROUP}}" data-ci-attr-id="{{NAME}}" {{CHECKED}}>'
                       +   '<span class="input-button"></span>'
                       +   '<span class="input-label" text="{{LABEL}}">{{LABEL}}</span>'
                       + '</label>';

    var radio = data.map(function(item, idx) {
        return RADIO_TEMPLATE
            .replace(/\{\{ID\}\}/g, attr.ciAttrGrpId+'_'+attr.ciAttrId+'_'+idx)
            .replace(/\{\{SUB_ID\}\}/g, attr.ciAttrGrpId+'_'+attr.ciAttrId)
            .replace(/\{\{GROUP\}\}/g, attr.ciAttrGrpId)
            .replace(/\{\{NAME\}\}/g, item.ciAttrId)
            .replace(/\{\{VALUE\}\}/g, item.attrItemCod)
            .replace(/\{\{LABEL\}\}/g, item.attrItemNm)
            .replace(/\{\{CHECKED\}\}/g, (item.dfltAt == 'Y' ? 'checked' : ''));
    }).join('');

    var radioHtml = TEMPLATE
        .replace(/\{\{RADIO\}\}/g, radio);

    var radio = document.createElement('template');
    radio.innerHTML = radioHtml;
    radio = radio.content.childNodes[0];

    return radio;
}

function buildCheckBox(attr, data) {
    var TEMPLATE = '<label class="checkbox">'
                 +   '<input type="checkbox" id="{{ID}}" name="{{NAME}}" class="check-input {{NAME}}" value="{{VALUE}}" data-ci-attr-grp-id="{{GROUP}}" data-ci-attr-id="{{NAME}}" {{CHECKED}}>'
//                 +   '<div tabindex="0" class="input_button"></div>'
                 +   '<span class="input-button"></span>'
//                 +   '<span style="margin-left: 3rem;">{{LABEL}}</span>'
                 +   '<span class="input-label" text="{{LABEL}}">{{LABEL}}</span>'
                 + '</label>';

    var checkbox = data.map(function(item, idx) {
        return TEMPLATE
            .replace(/\{\{ID\}\}/g, attr.ciAttrGrpId+'_'+attr.ciAttrId+'_'+idx)
            .replace(/\{\{SUB_ID\}\}/g, attr.ciAttrGrpId+'_'+attr.ciAttrId)
            .replace(/\{\{GROUP\}\}/g, attr.ciAttrGrpId)
            .replace(/\{\{NAME\}\}/g, item.ciAttrId)
            .replace(/\{\{VALUE\}\}/g, item.attrItemCod)
            .replace(/\{\{LABEL\}\}/g, item.attrItemNm)
            .replace(/\{\{CHECKED\}\}/g, (item.dfltAt == 'Y' ? 'checked' : ''));
    }).join('');

    var checkboxHtml = '<div>{{CHECKBOX}}</div>'
        .replace(/\{\{CHECKBOX\}\}/g, checkbox);

    var checkbox = document.createElement('template');
    checkbox.innerHTML = checkboxHtml;
    checkbox = checkbox.content.childNodes[0];

    return checkbox;
}

function buildDatePicker(attr, dateType) {

    var TEMPLATE = '<div class="field" >'
                 + '<div class="control is-medium is-datepicker" style="width:110rem;min-width:110rem;">'
                 + '<input type="text" id="{{ID}}" name="{{NAME}}" title="{{TITLE}}" class="input date-picker" aria-label="{{DATE_TIME}}" data-ci-attr-grp-id="{{GROUP}}" data-ci-attr-id="{{NAME}}" {{REQUIRED}} autocomplete="off">'
                 + '<i aria-hidden="true" class="date-icon"></i>'
                 + '</div>'
                 + '</div>'

    var datePicker = TEMPLATE
        .replace(/\{\{ID\}\}/g, attr.ciAttrGrpId+'_'+attr.ciAttrId)
        .replace(/\{\{GROUP\}\}/g, attr.ciAttrGrpId)
        .replace(/\{\{NAME\}\}/g, attr.ciAttrId)
        .replace(/\{\{TITLE\}\}/g, attr.ciAttrNm)
        .replace(/\{\{DATE_TIME\}\}/g, dateType)
        .replace(/\{\{REQUIRED\}\}/g, (attr.manYn == 'Y' ? 'required' : ''));

    var datePickerHtml = '<div>{{DATE_PICKER}}</div>'
        .replace(/\{\{DATE_PICKER\}\}/g, datePicker);

    var datePicker = document.createElement('template');
    datePicker.innerHTML = datePickerHtml;
    datePicker = datePicker.content.childNodes[0];

    return datePicker;
}

function appendEmpty(tr) {
    var empty = document.createElement('template');
    empty.innerHTML = '<td></td><td></td>';
    Array.from(empty.content.childNodes).forEach(function(node) {
        tr.appendChild(node);
    });
}

function buildFileDrop(layer, params) {
    var TEMPLATE = '<div class="file-upload">'
                 +   '<div class="field is-grouped has-buttons">'
                 +     '<div class="file">'
                 +       '<label class="file-label">'
                 +         '<div class="file-cta button">'
                 +           '<span class="file-label">파일찾기</span>'
                 +         '</div>'
                 +         '<input type="file" id="files" name="files" class="file-input" multiple="multiple"/>'
                 +       '</label>'
                 +     '</div>'
                 +     '<p>최대 20MB까지 첨부하실 수 있습니다.</p>'
                 +   '</div>'
                 +   '<h2 class="table-title">'
                 +       '<span>업로드할 파일 목록</span>'
                 +   '</h2>'
                 +   '<table id="fileDrop" class="table table-file is-fullwidth">'
                 +   '</table>'
                 + '</div>'
                 + '<h2 class="table-title">'
                 +   '<span>업로드된 파일 목록</span>'
                 + '</h2>'
                 + '<table id="fileTable" class="file-table table is-fullwidth is-hstriped">'
                 +   '<colgroup>'
                 +     '<col>'
                 +     '<col>'
                 +     '<col>'
                 +     '<col>'
                 +     '<col>'
                 +     '<col>'
                 +     '<col>'
                 +   '</colgroup>'
                 + '</table>';

    var fileDrop = document.createElement('template');
    fileDrop.innerHTML = TEMPLATE;
    Array.from(fileDrop.content.childNodes).forEach(function(node) {
        layer.appendChild(node);
    });

    var $table = $(layer);
    // 파일 드래드 & 드랍 초기화
    $table.find('.file-upload .table-file').fileDrop({
        fileEl: 'files' // 파일 element id
    });

    // 파일 항목 onchange
    $table.find('.file-upload .file input').on('change', function() {
        var fileDrop = $(this).closest('.file-upload').find('.table-file').data('fileDrop');
        fileDrop.addFiles(this.files);
    });
    bindFiles(layer.id, params);
}

function bindCiBasData(id, data, params) {
    var layer = document.getElementById(id);

    var headWrap = layer.querySelector('div.head');
    if(headWrap == null || headWrap.length == 0) {
        headWrap = document.createElement('div');
        headWrap.className = 'head';
        layer.appendChild(headWrap);
    }
    else {
        headWrap = layer.querySelector('div.head');
    }

    for(var key in params) {
        var inputEl = layer.querySelector('[name="'+key+'"]');
        if(inputEl == null || inputEl.length == 0) {
            inputEl = document.createElement('input');
            inputEl.type  = 'hidden';
            inputEl.name  = key;
            inputEl.value = params[key];
            headWrap.appendChild(inputEl);
        }
    }

    var $table = $('#'+id);
    for(var i = 0; i < data.length; i++) {
        var item    = data[i];
        var $target = $table.find('[data-ci-attr-grp-id="'+item.ciAttrGrpId+'"][data-ci-attr-id="'+item.ciAttrId+'"]');

        if($target.length == 0) {
            console.log('attribute : ' + item.ciAttrId + ' is not found', item);
        }
        else if($target.is('[type="checkbox"]')) {
            var values = item.ciAttrValCn.split(',');
            $target.filter(function() {
                return values.includes($(this).val());
            }).prop('checked', true).data('origin', item.ciAttrValCn);
        }
        else if($target.is('[type="radio"]')) {
            var value = item.ciAttrValCn;
            $target.filter(function() {
                return value == $(this).val();
            }).prop('checked', true).data('origin', item.ciAttrValCn);
        }
        else if($target.is('textarea')) {
            $target.text(item.ciAttrValCn).data('origin', item.ciAttrValCn);
        }
        else {
            $target.val(item.ciAttrValCn).data('origin', item.ciAttrValCn);
        }
    }
}

function bindFiles(id, params) {
    if(typeof params.atchFileId == 'string' && params.atchFileId.length > 0) {
        $.get('/files/'+params.atchFileId+'/down', function(files) {
            bindFileData(id, files);
        });
    }
    else {
        document.getElementById('ciDetail').querySelector('.file-table').remove();
    }
}

function bindFileData(id, files) {
    var $table   = $('#'+id);

    $table = $table.find('.file-table');
    $table.find('tbody').remove();

    var tbody = document.createElement('tbody');
    if(files == undefined || files.length == 0) {
        tbody.innerHTML = '<tr><td colspan="7">업로드된 파일이 없습니다.</td></tr>';
    }
    else {
        tbody.innerHTML = '<tr><th colspan="5">파일명</th><th>크기</th><th></th></tr>';

        var TEMPLATE = '<tr>'
                     +   '<td colspan="5">{{ORG_FILE_NM}}</td>'
                     +   '<td>{{FILE_SIZE}}</td>'
                     +   '<td class="buttons is-centered">'
                     +     '<a class="button is-outline is-secondary" href="{{FILE_PATH}}" filename="{{ORG_FILE_NM}}" download style="margin-bottom:0rem;">다운로드</a>'
                     //+     '<a class="button is-outline is-primary tagForDeleteFiie is-hidden" th:onclick="removeSelectedFile([[${file.atchFileId}]], [[${file.fileSn}]] );" >삭제</a>'
                     +   '</td>'
                     + '</tr>';

        for(var i = 0; i < files.length; i++) {
            var file = files[i];
            var tableTr = document.createElement('template');
            tableTr.innerHTML = TEMPLATE
                .replace(/\{\{ORG_FILE_NM\}\}/g, file.orignlFileNm)
                .replace(/\{\{FILE_SIZE\}\}/g, file.fileSize)
                .replace(/\{\{FILE_PATH\}\}/g, '/files/'+ file.atchFileId + '/' + file.fileSn + '/download');

            tbody.appendChild(tableTr.content.childNodes[0]);
        }
        $table.append(tbody);
    }
}

function getCiBasData(id) {
    var $table   = $('#'+id);
    var $targets = $table.find('input, select, textarea').not('.file-upload *');

    var data = {};
    $targets.each(function () {
        var $td;
        if (!this.name) {
            return true;
        }
        if ($(this).prop('type') == 'hidden') {
            return true;
        }

        $td = $(this).closest('td');
        if ($(this).prop('type') == 'checkbox') {
            var value;
            if ($(this).is(':checked')) {
                value = this.value;
            } else {
                if ($(this).data('unchecked')) {
                    value = $(this).data('unchecked');
                }
            }
            if(typeof data[this.name] == 'undefined') {
                data[this.name] = $.extend({}, $(this).data(), {
                    ciAttrNm: $td.data('name'),
                    value   : []
                });
            }
            if (typeof value != 'undefined') {
                data[this.name].value.push(value);
            }
            return true;
        }

        if ($(this).prop('type') == 'radio') {
            data[this.name] = $.extend({}, $(this).data(), {
                ciAttrNm: $td.data('name'),
                value   : $('input[name="' + this.name + '"]:checked').val()
            });
            if (data[this.name] == null) {
                delete data[this.name];
            }
            return true;
        }

        var value = this.value;
        if (!value && $(this).data('set')) {
            value = $(this).data('set');
        }
        if (data[this.id] !== undefined) {
            if (!data[this.id].value.push) {
                data[this.id].value = [data[this.id].value];
            }
            data[this.id].value.push(value || '');
        } else {
            data[this.id] = $.extend({}, $(this).data(), {
                ciAttrNm: $td.data('name'),
                value   : (value || '')
            });
        }

        if ($(this).hasClass('num')) {
            $(this).setComma();
        }
    });

    return data;
}

function getCiBasChanges(id) {
    var $table = $('#'+id);
    var data   = getCiBasData(id);

    var changes = [];
    for(var key in data) {
        if(Object.prototype.toString.call(data[key].value) == '[object Array]') {
            data[key].value = data[key].value.join(',');
        }

        if(isEmpty(data[key].value)) continue;
        var orgData = $table.find('[id="'+key+'"], [name="'+key+'"]').data('origin');
        if(orgData != data[key].value) {
            changes.push({
                ciAttrGrpId: data[key].ciAttrGrpId,
                ciAttrId   : data[key].ciAttrId,
                ciAttrNm   : data[key].ciAttrNm,
                from       : orgData || '',
                to         : data[key].value
            });
        }
    }
    return changes;
}

function getCiBasFormData(id) {
    var $table   = $('#'+id);

    var data = getCiBasData(id);
    var params = $table.find('.head').getData();
    params.list = [];
    for(var key in data) {
        if(Object.prototype.toString.call(data[key].value) == '[object Array]') {
            data[key].value = data[key].value.join(',');
        }

        if(isEmpty(data[key].value)) continue;
        data[key].ciAttrValCn = data[key].value;
        delete data[key].value;
        delete data[key].error;
        delete data[key].toggle;
        delete data[key].placement;
        delete data[key].datePicker;
        delete data[key].toastDatePicker;
        delete data[key].multipleSelect;
        params.list.push(data[key]);
    }

    $.extend(params, toDataJson('list', params.list));
    delete params.list;

    params.files = $table.find('.file-upload table.table-file').data('fileDrop').getCheckedFiles();
    if(params.files.length == 0) {
        delete params.files;
    }
    else {
        params.files.forEach(function(file, idx) {
            params['files['+idx+']'] = file;
        })
    }
    delete params.files;
    console.log(params);
    var formData = new FormData();
    for(var key in params) {
        formData.append(key, params[key]);
    }
    return formData;
}

