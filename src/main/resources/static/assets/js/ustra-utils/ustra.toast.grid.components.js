if (typeof Object.assign !== 'function') {
// Must be writable: true, enumerable: false, configurable: true
    Object.defineProperty(Object, "assign", {
        value: function assign(target, varArgs) { // .length of function is 2
            'use strict';
            if (target === null || target === undefined) {
                throw new TypeError('Cannot convert undefined or null to object');
            }

            var to = Object(target);

            for (var index = 1; index < arguments.length; index++) {
                var nextSource = arguments[index];

                if (nextSource !== null && nextSource !== undefined) {
                    for (var nextKey in nextSource) {
                        if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
                            to[nextKey] = nextSource[nextKey];
                        }
                    }
                }
            }
            return to;
        },
        writable: true,
        configurable: true
    });
}

class CustomToggle {
    constructor(props) {
        var options = props.columnInfo.renderer.options;
        var el = document.createElement('div');
        el.setAttribute('class',"tog_btn");

        var input = document.createElement('input');
        input.type = 'checkbox';
        input.id = 'tog_btn_' + props.rowKey;
        input.name = 'tog_btn_' + props.rowKey;
        input.checked = props.value == 'Y' ? true : false;

        var label = document.createElement('label');
        label.setAttribute('for','tog_btn_'+ props.rowKey);

        el.appendChild(input);
        el.appendChild(label);

        input.addEventListener('click', (ev) => {
            ev.stopPropagation();
            ev.preventDefault();
        });

        this.el = el;
        this.render(props);
    }

    getElement() {
        return this.el;
    }

    render(props) {
        this.el.value = String(props.value);
    }
}

class CustomButton {
    constructor(props) {
        var row = props.grid.getRow(props.rowKey);
        var options = props.columnInfo.renderer.options;
        var hideButton = false;

        if (options.hide) {
            hideButton = Object.keys(options.hide).every(function (key) {
                if ($.isArray(options.hide[key])) {
                    return options.hide[key].indexOf(row[key]) > -1;
                } else {
                    return row[key] == options.hide[key];
                }
            });
        }

        var wrapDiv = document.createElement('div');
        wrapDiv.value = props.value;
        wrapDiv.setAttribute('class', '');
        wrapDiv.setAttribute('style', 'display:flex; align-items: center; justify-content: center;');

        // 텍스트
        var textDiv = document.createElement('div');
        var textNode = document.createTextNode(props.value || '');
        textDiv.setAttribute('class', 'tui-grid-cell-content text-node');
        textDiv.setAttribute('style', 'text-overflow: ellipsis; width: 100%;' + (options.align == 'center' ? ' display: none;' : ''));
        textDiv.appendChild(textNode);
        wrapDiv.appendChild(textDiv);

        if (hideButton === false) {
            var button = this.createButton(props);
            if(options.align == 'left') {
                wrapDiv.prepend(button);
            }
            else {
                wrapDiv.appendChild(button);
            }
        }

        this.el = wrapDiv;
        this.render(props);
    }

    createButton(props) {
        var options = props.columnInfo.renderer.options;
        var buttonWrap = document.createElement('div');
        var button = document.createElement('button');
        var yn = props.value;

        button.innerText = options.ytext;
        if(yn == 'N'){
            button.innerText = options.ntext;
        }
        button.id = options.btnId + props.rowKey;
        button.setAttribute('type', 'button');
        button.setAttribute('data-row-key', props.rowKey);
        button.setAttribute('class', 'button is-outline is-primary');

        if(typeof options.icon != 'undefined' && options.icon == 'search') {
            button.innerText = '';
            button.setAttribute('style', 'background: transparent; border: 0;');

            var span = document.createElement('span');
            span.setAttribute('class', 'icon icon_operations_search is-small');
            //Toast Grid Event 오류 방지
            span.className.split =  function() { return String.prototype.split.apply(this.baseVal, arguments); };
            button.appendChild(span);

            var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            span.appendChild(svg);

            var use = document.createElementNS('http://www.w3.org/2000/svg', 'use');
            use.setAttributeNS('http://www.w3.org/1999/xlink', 'href', '#icon_operations_search');
            //Toast Grid Event 오류 방지
            use.className.split =  function() { return String.prototype.split.apply(this.baseVal, arguments); };
            svg.appendChild(use);
        }
        else {
            button.setAttribute('style', 'padding: .25em 1em;');
            if(options.align == 'left') {
                buttonWrap.setAttribute('style', 'padding-left:5rem;');
            }
            else {
                buttonWrap.setAttribute('style', 'padding-right:5rem;');
            }
        }

        if (options.btnOnClick) {
            button.addEventListener('click', options.btnOnClick);
        }
        buttonWrap.appendChild(button);

        return buttonWrap;
    }

    getElement(props) {
        return this.el;
    }

    getValue() {
        var node = this.el.getElementsByClassName('text-node');
        return node[0].textContent;
    }

    render(props) {
        var options = props.columnInfo.renderer.options;
        var $button = $(this.el).find('button');

        $button.prop('disabled', props.disabled);
        if(typeof options.icon != 'undefined') {
            if(props.disabled) {
                $button.find('.icon').css({
                    "fill"  : "#808080",
                    "cursor": "not-allowed"
                });
            }
            else {
                $button.find('.icon').css({
                    "fill"  : "#0354ff",
                    "cursor": "pointer"
                });
            }
        }
        if(options.hideOnDisable) {
            if(props.disabled) {
                $button.css('display', 'none');
            }
            else {
                $button.css('display', '');
            }
        }
        var node = this.el.getElementsByClassName('text-node');
        node[0].textContent = String(props.value);
    }
}

class CustomTwoButton {
    constructor(props) {
        var options = props.columnInfo.renderer.options;

        var div = document.createElement('div');
        div.setAttribute('class','res_footer');

        var button1 = document.createElement('button');
        //button1.setAttribute('class','btn_rnd btcoverln');
        button1.type = 'button';
        button1.innerText = options.btn1Text;
        button1.id = options.btn1Id+props.rowKey;
        button1.setAttribute('data-row-key', props.rowKey);
        if (options.btn1OnClick) {
            button1.addEventListener('click', options.btn1OnClick);
        }

        var button2 = document.createElement('button');
        //button2.setAttribute('class','btn_rnd btpoint');
        button2.type = 'button';
        button2.innerText = options.btn2Text;
        button2.id = options.btn2Id+props.rowKey;
        button2.setAttribute('data-row-key', props.rowKey);
        if (options.btn2OnClick) {
            button2.addEventListener('click', options.btn2OnClick);
        }

        div.appendChild(button1);
        div.appendChild(button2);

        // text-align
        if (options.align) {
            div.style.textAlign = options.align;
        } else {
            div.style.textAlign = props.columnInfo.align;
        }

        this.el = div;
        this.render(props);
    }

    getElement() {
        return this.el;
    }

    render(props) {
        this.el.value = String(props.value);
    }
}

class CustomCheckBox {
    constructor(props) {
        var wrapper = document.createElement('label');
        wrapper.className = 'checkbox';

        var checkboxEl  = document.createElement('input');
        var checkboxDiv = document.createElement('div');
        checkboxDiv.className = 'input_button';
        checkboxDiv.setAttribute('style', 'border-width: 1rem;');

        wrapper.append(checkboxEl);
        wrapper.append(checkboxDiv);

        checkboxEl.type = 'checkbox';
        checkboxEl.className = 'check-input';
        checkboxEl.id = props.columnInfo.name + '_checkbox_' + props.rowKey;
        checkboxEl.readOnly = !props.editable;
        checkboxEl.disabled = props.disabled;
        checkboxEl.setAttribute('rowKey', props.rowKey);

        var yn = props.value;
        if(yn == "Y") {
            checkboxEl.checked = true;
        }

        this.el = wrapper;
        this.render(props);

        checkboxEl.addEventListener('change', function(event) {
            var $this = $(this);
            var selectedValue = $this.prop('checked') ? 'Y' : 'N';
            props.grid.setValue(props.rowKey, props.columnInfo.name, selectedValue);
        });
    }

    getElement() {
        return this.el;
    }

    render(props) {
        var checked = Boolean(props.value == "Y");
        var checkboxEl = this.el.querySelector('.check-input');
        checkboxEl.checked = checked;
        checkboxEl.readOnly = !props.editable;
        checkboxEl.disabled = props.disabled;
    }
}

class CustomCheckboxHeaders {
    constructor(props) {
        var wrapper = document.createElement('label');
        wrapper.className = 'checkbox';

        var checkboxEl  = document.createElement('input');
        var checkboxDiv = document.createElement('div');
        checkboxDiv.className = 'input_button';
        checkboxDiv.setAttribute('style', 'border-width: 1rem;');

        wrapper.append(checkboxEl);
        wrapper.append(checkboxDiv);

        checkboxEl.type = 'checkbox';
        checkboxEl.name = props.grid.el.id + '_checkbox' + props.columnInfo.name;
        checkboxEl.className = 'check-input';
        checkboxEl.id = props.grid.el.id + '_checkbox_' + props.rowKey;
        checkboxEl.readOnly = !props.editable;
        checkboxEl.disabled = props.disabled;
        checkboxEl.setAttribute('rowKey', props.rowKey);

        checkboxEl.addEventListener('click', function(event) {
            if (checkboxEl.checked) {
                props.grid.check(props.rowKey);
            } else {
                props.grid.uncheck(props.rowKey);
            }
            var checkboxes = Array.from(document.querySelectorAll('[name="'+checkboxEl.name+'"]'));
            var prevCheck  = checkboxes.filter(function(item) { return item.getAttribute('prevCheck'); });
            if(prevCheck.length > 0) {
                prevCheck = prevCheck[0];
                prevCheck.removeAttribute('prevCheck');
                if(event.shiftKey == true) {
                    var prevIndex = checkboxes.findIndex(function(item) {
                        return item.getAttribute('rowKey') == prevCheck.getAttribute('rowKey');
                    });
                    var currIndex = checkboxes.findIndex(function(item) {
                        return item.getAttribute('rowKey') == checkboxEl.getAttribute('rowKey');
                    });
                    if(prevIndex > currIndex) {
                        checkboxes = checkboxes.slice(currIndex+1, prevIndex+1);
                        checkboxes.forEach(function(item) {
                            item.checked = checkboxEl.checked;
                            if (checkboxEl.checked) {
                                props.grid.check(item.getAttribute('rowKey'));
                            } else {
                                props.grid.uncheck(item.getAttribute('rowKey'));
                            }
                        });
                    }
                    else if(prevIndex < currIndex) {
                        checkboxes = checkboxes.slice(prevIndex, currIndex);
                        checkboxes.forEach(function(item) {
                            item.checked = checkboxEl.checked;
                            if (checkboxEl.checked) {
                                props.grid.check(item.getAttribute('rowKey'));
                            } else {
                                props.grid.uncheck(item.getAttribute('rowKey'));
                            }
                        });
                    }
                }
            }
            checkboxEl.setAttribute('prevCheck', true);
        });

        this.el = wrapper;
        this.render(props);
    }

    getElement() {
        return this.el;
    }

    render(props) {
        var checked = Boolean(props.value);
        var checkboxEl = this.el.querySelector('.check-input');
        checkboxEl.checked = checked;
        checkboxEl.readOnly = !props.editable;
        checkboxEl.disabled = props.disabled;
    }
}

class CustomTextAreaRenderer {
    constructor(props) {
        var wrapEl = document.createElement('div');
        wrapEl.className = 'tui-grid-cell-content';
        wrapEl.setAttribute('style', 'white-space: pre-wrap; height: '+(props.grid.store.dimension.minRowHeight - 1)+'rem;');

        var textNode = document.createTextNode(props.value || '');
        wrapEl.appendChild(textNode);
        wrapEl.setAttribute('title', textNode.nodeValue);

        this.el = wrapEl;
        this.render(props);
    }

    getElement() {
        return this.el;
    }

    render(props) {
        this.el.textContent = props.value || '';
    }

    getValue() {
        return this.el.textContent;
    }
}

class CustomTextArea {
    constructor(props) {
        var options = props.columnInfo.editor.options || {};

        var textareaEl = document.createElement('textarea');
        textareaEl.rows = options.rows || '4';
        textareaEl.cols = options.cols || '20';
        textareaEl.className = 'textarea';
        textareaEl.readonly  = true;
        textareaEl.value     = props.value || '';

        $(textareaEl).css({
            "width": "100%",
            "height": "100%",
            "max-height": "100%",
            "padding": "4rem 5rem",
            "resize": "none",
            "overflow": "auto",
            "font-size": "12rem"
        });

        textareaEl.id = props.grid.el.id + '_textarea_' + props.rowKey;

        textareaEl.addEventListener('keydown', function (e) {
            if (e.shiftKey && e.keyCode == 13) {
            }
            else if (e.altKey && e.keyCode == 13) {
                var position = this.selectionEnd;
                this.value = this.value.substring(0, position) + '\n' + this.value.substring(position);
                this.selectionEnd = position;
                e.stopPropagation();
            }
            else if(e.keyCode == 13) {
                props.grid.finishEditing();
            }
            return false;
        });

        this.el = textareaEl;
    }

    getElement() {
        return this.el;
    }

    getValue() {
        return this.el.value;
    }

    mounted() {
        this.el.select();
    }
}

class CustomRadioHeaders {
    constructor(props) {
        var wrapper = document.createElement('label');
        wrapper.className = 'radio';

        var radioEl = document.createElement('input');
        var radioDiv = document.createElement('div');
        radioDiv.className = 'input_button';

        wrapper.append(radioEl);
        wrapper.append(radioDiv);

        radioEl.type = 'radio';
        radioEl.name = props.grid.el.id + '_radio' + props.columnInfo.name;
        radioEl.className = 'radio-input';
        radioEl.id = props.grid.el.id + '_radio_' + props.rowKey;
        if(props.editable == false) {
            radioEl.readOnly = true;
        }
        if(props.disabled == true) {
            radioEl.disabled = true;
        }

        radioEl.addEventListener('change', function(event) {
            props.grid.uncheckAll();
            if (radioEl.checked) {
                props.grid.check(props.rowKey);
            } else {
                props.grid.uncheck(props.rowKey);
            }
        });

        props.grid.on('check', function(ev) {
            if(typeof ev.rowKey != 'undefined') {
                ev.instance.getCheckedRowKeys().filter(function(rowKey) {
                    return rowKey != ev.rowKey
                }).forEach(function(rowKey) {
                    ev.instance.uncheck(rowKey);
                });
            }
        });

//        this.el = radioEl;
        this.el = wrapper;
        this.render(props);
    }

    getElement() {
        return this.el;
    }

    render(props) {
        var checked = Boolean(props.value);
//        this.el.checked = checked;
        var radioEl = this.el.querySelector('.radio-input');
        radioEl.checked = checked;
    }
}

//class CustomRadio {
//    constructor(props) {
//        var options = props.columnInfo.renderer.options;
//        var radioEl = document.createElement('input');
//        var yn = props.value;
//
//        radioEl.type = 'radio';
//        radioEl.name = props.columnInfo.name;
//        radioEl.id = props.columnInfo.name + '_radio_' + props.rowKey;
//        if(yn == "Y"){
//            radioEl.checked = true;
//        }
//        if(props.editable == false) {
//            radioEl.readOnly = true;
//        }
//        if(props.disabled == true) {
//            radioEl.disabled = true;
//        }
//
//        radioEl.addEventListener('change', function(event) {
//            var $this = $(this);
//            var selectedValue = $this.prop('checked') ? 'Y' : 'N';
//            props.grid.setValue(props.rowKey, props.columnInfo.name, selectedValue);
//        });
//
//        this.el = radioEl;
//        this.render(props);
//    }
//
//    getElement() {
//        return this.el;
//    }
//
//    render(props) {
//        this.el.value = String(props.value);
//    }
//}

class CustomTextEditor {
	constructor(props) {
		var el = document.createElement('input');
		var { maxLength } = props.columnInfo.editor.options;

        // text-align
        if (props.columnInfo.align) {
            el.style.textAlign = props.columnInfo.align;
        }

		el.type = 'text';
		el.maxLength = maxLength;
		el.value = String(props.value);

		this.el = el;
	}
	getElement() {
		return this.el;
	}
	getValue() {
		return this.el.value;
	}
	mounted() {
		this.el.select();
	}
}

class CustomLinkCell {
    constructor(props) {
        var wrapEl = document.createElement('div');

        var options = props.columnInfo.renderer.options;
        wrapEl.setAttribute('class', 'tui-grid-cell-content link');
        //rowHeight에서 border를 뺀 높이를 직접 지정
        //rowNum과의 높이 차이, 포커스 시 테두리선 오류 Fix
        var alignStyle = options.align === 'center' ? '' : ' display: -webkit-box; -webkit-box-align: center;';
        wrapEl.setAttribute('style', 'height: '+(props.grid.store.dimension.minRowHeight - 1)+'rem;' + alignStyle);

        var textEl = document.createElement('div');
        textEl.className= 'text-node';

        var textNode = document.createTextNode(props.value);
        textEl.appendChild(textNode);
        wrapEl.appendChild(textEl);

        wrapEl.addEventListener('click', function(event) {
            var row = props.grid.getRow(props.rowKey);
            var linkUrl = options.linkUrl;
            if (linkUrl) {
                redirect(linkUrl.format(row));
            }
            else if(options.onClick) {
                options.onClick({
                    row: row,
                    rowKey: props.rowKey,
                    column: props.columnInfo,
                    grid: props.grid
                });
            }
        });

        textEl.value = String(props.value);
        this.el = wrapEl;
    }
    getElement() {
        return this.el;
    }
    getValue() {
        var textEl = this.wrapEl.getElementsByClassName('text-node')[0];
        return textEl[0].value;
    }
}

class CustomSelectBox {
    constructor(props) {
        var _this = this;
        this.props = props;
        this.selectFinish = false;
        this.isMounted = false;
        this.onKeydown = function (ev) {
            var passingKeys = [9, 27]; //esc, tab
            if (_this.selectFinish || passingKeys.includes(ev.keyCode)) {
                // with passingKeyNames, pass the event to editing layer for using existing editing keyMap
                _this.portalEditingKeydown(ev);
            }
            else {
                ev.preventDefault();
            }
        };
        var width = props.width, value = props.value, formattedValue = props.formattedValue, portalEditingKeydown = props.portalEditingKeydown;
        var el = document.createElement('div');
        el.className = 'tui-grid-layer-editing-inner';
        el.innerText = formattedValue;
        var listItems = this.getListItems(props);
        var layer = this.createLayer(listItems, width, value);
        this.portalEditingKeydown = portalEditingKeydown;
        this.el = el;
        this.layer = layer;
        this.layer.addEventListener('keydown', this.onKeydown);
    }
    setSelectFinish(selectFinish) {
        var _this = this;
        setTimeout(function () {
            _this.selectFinish = selectFinish;
        });
    };
    createLayer(listItems, width, value) {
        var _this = this;
        var layer = document.createElement('div');
        layer.className = 'tui-grid-editor-select-box-layer';
        layer.style.minWidth = width - 10 + "rem";
        // To hide the initial layer which is having the position which is not calculated properly
        layer.style.opacity = '0';
        var data = listItems.map(function (item) { return ({ value: String(item.value), label: item.text }); });
        this.selectBoxEl = new SelectBox(layer, { data: data });
        if (value) {
            this.selectBoxEl.select(value);
        }
        this.selectBoxEl.on('close', function () {
            _this.focusSelectBox();
            _this.setSelectFinish(true);
            _this.setLayerPosition(_this.el, _this.layer, _this.selectBoxEl.dropdown.el);
            setTimeout(function() {
                _this.props.grid.finishEditing();
            });
        });
        this.selectBoxEl.on('open', function () {
            _this.setSelectFinish(false);
            if (_this.isMounted) {
                _this.setLayerPosition(_this.el, _this.layer, _this.selectBoxEl.dropdown.el);
            }
        });
        return layer;
    };
    focusSelectBox() {
        this.selectBoxEl.input.focus();
    };
    getElement() {
        return this.el;
    };
    getValue() {
        return this.selectBoxEl.getSelectedItem().getValue();
    };
    mounted() {
        this.selectBoxEl.open();
        // To prevent wrong stacked z-index context, layer append to grid container
        this.getContainerElement(this.el).appendChild(this.layer);
        // @ts-ignore
        this.setLayerPosition(this.el, this.layer, this.selectBoxEl.dropdown.el);

        this.focusSelectBox();
        this.isMounted = true;
        // To show the layer which has appropriate position
        this.layer.style.opacity = '1';
    };
    beforeDestroy() {
        this.selectBoxEl.destroy();
        this.layer.removeEventListener('keydown', this.onKeydown);
        this.getContainerElement(this.el).removeChild(this.layer);
    };
    getListItems(props) {
        var _a = props.columnInfo.editor.options, listItems = _a.listItems, relationListItemMap = _a.relationListItemMap;
        if (typeof relationListItemMap != 'undefined' && Array.isArray(relationListItemMap[props.rowKey]) && relationListItemMap[props.rowKey].length > 0) {
            return relationListItemMap[props.rowKey];
        }
        return listItems;
    };
    hasClass(el, className) {
        return el.className.split(' ').indexOf(className) !== -1;
    };
    findParent(el, className) {
        var currentEl = el;
        while (currentEl && !this.hasClass(currentEl, className)) {
            currentEl = currentEl.parentElement;
        }
        return currentEl;
    };
    getContainerElement(el) {
        return this.findParent(el, 'tui-grid-container');
    };
    setLayerPosition(innerEl, layerEl, childEl, startBottom) {
        var INDENT = 5;
        var SCROLL_BAR_WIDTH = 17;
        var SCROLL_BAR_HEIGHT = 17;

        if (startBottom === void 0) { startBottom = false; }
        var containerRect = this.getContainerElement(innerEl).getBoundingClientRect();
        var innerHeight = window.innerHeight, innerWidth = window.innerWidth;
        var _a = innerEl.getBoundingClientRect(), left = _a.left, top = _a.top, bottom = _a.bottom;
        var _b = layerEl.getBoundingClientRect(), layerHeight = _b.height, layerWidth = _b.width;
        var layerTop = startBottom ? bottom : top + INDENT;
        var childElHeight = 0;
        var childElWidth = 0;
        if (childEl) {
            var _c = childEl.getBoundingClientRect(), height = _c.height, width = _c.width;
            childElHeight = height;
            childElWidth = width;
        }
        var totalHeight = layerHeight + childElHeight;
        var totalWidth = layerWidth || childElWidth;
        layerEl.style.top = (layerTop + totalHeight > innerHeight - SCROLL_BAR_WIDTH
            ? innerHeight - totalHeight - INDENT - SCROLL_BAR_WIDTH
            : layerTop) - containerRect.top + "rem";
        layerEl.style.left = (left + totalWidth > innerWidth - SCROLL_BAR_HEIGHT
            ? innerWidth - totalWidth - INDENT - SCROLL_BAR_HEIGHT
            : left) - containerRect.left + "rem";
    };
}

function toastSelectBox (divId, inputId, paramOptions){
    var options = JSON.parse(JSON.stringify(paramOptions));;
    for(var item of options){
        item.label = item.text;
        delete item.text;
    }
    var selectBox = new SelectBox(document.getElementById(divId), {
        data: options
    });

    $('#'+divId+' select.tui-select-box-hidden').attr("name",inputId);

    selectBox.on('open', ev => {
        // selectBox.select(2);
    });
    return selectBox;
};

function toastDatePicker (divId, inputId, options){
    var container = document.getElementById(divId);
    var target = document.getElementById(inputId);

    var datePicker = new DatePicker(container, {
        input: {
            element: target,
            format: 'yyyy-MM-dd'
        },
    });

    $('#'+inputId).on('change',function(){
        $this = $(this);
    });


    return datePicker;
};

