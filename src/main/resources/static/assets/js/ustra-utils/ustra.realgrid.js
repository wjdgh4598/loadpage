/**
 * 주의사항.
 *   - RealGrid에서는 DataProvider의 dataRow, GridView의 itemIndex가 다를 수 있다.
 *     그 경우에 잘못된 조작을 할 경우 값이 다른 곳에 세팅이 될 수 있는데, 이를 방지하고자
 *     그리드 공통 모듈에서는 dataRow만 다루며, dataRow를 개발자에게 rowKey로 제공한다.
 *
 *   - RealGrid의 이벤트는 1개만 지정이 가능하다.
 *     이를 보충하고자 이벤트 핸들링을 공통 모듈에서 한다.
 *     on, off 메소드를 통해 이벤트를 추가, 삭제할 수 있다.
 *
 *   -
 */
let UstraRealGridColumn;
if(typeof UstraRealGridColumn === "undefined") {
    UstraRealGridColumn = (function () {
        var columnAttributes = ["edgeMark","placeHolder","placeHolderStyleName","autoFilter","autoFilters","blankWhenCopy","blankWhenExport","booleanFormat","breakMergeOnEmpty","button","buttonVisibility","buttonVisibleCallback","checked","datetimeFormat","defaultValue","displayCallback","displayIndex","displayMinusZero","displayText","displayWidth","editable","editButtonVisibility","editor","equalBlank","equalBlankExpression","error","errorLevel","excelFormat","excelFormulaStatement","fieldIndex","fieldName","fieldNames","fillWidth","filterable","filters","footer","footers","grid","groupable","groupFooter","groupFooters","header","headerSummaries","headerSummary","index","labelField","labels","layout","lookupDisplay","lookupKeyFields","lookupSourceId","mergeRule","movable","name","nanText","numberFormat","popupMenu","popupMenuName","prefix","readOnly","renderer","required","requiredLevel","requiredMessage","resizable","sortable","sortByLabel","sortDirection","sortOrder","styleCallback","styleName","suffix","tag","textFormat","textInputCase","textOfInvalid","validations","values","valueSeparator","visible","width","zeroText"],
        fieldAttributes  = ["amText","baseField","baseYear","booleanFormat","calculated","dataType","datetimeFormat","defaultValue","fieldName","header","index","length","maximum","minimum","nullValue","orgFieldName","pmText","set","subType","subTypeEnabled","updatable","valueCallback","valueExpression"];

        function _addClass(origin, className) {
            var result = [];
            if(origin) {
                result.push(origin);
            }
            if(className) {
                result.push(className);
            }
            return result.join(" ");
        }

        function _setCustomOptions(options) {
            options             = options || {};
            options.editor      = options.editor || {};
            options.renderer    = options.renderer || {};
            options.editOptions = options.editOptions || {};
            return options;
        }

        function UstraRealGridColumn() {
            this._ustraGrid = null;
            this._columnList = [];
            this._disables = [];
            this._renderer = [];
            return this;
        }

        UstraRealGridColumn.prototype = {
            add: function(id, label, labelCode, width, readonly, options) {
                options = options || {};
                for(var key in options) {
                    if(JSON.stringify(options[key]) === "{}") delete options[key];
                }

                if (labelCode !== "i18n") {
                    var labels = sessionStorage.getItem('MESSAGES');
                    if (labels !== null) {
                        const parsedLabels = JSON.parse(labels);
                        var i, attribute;

                        for(i = 0; i < parsedLabels.length; i++) {
                            attribute = parsedLabels[i].code;
                            if (attribute === labelCode) {

                                label = parsedLabels[i].message;  // Grid Header 다국어 명칭 Set
                                break;
                            }
                        }
                    }
                }

                var column = {
                    name     : id,
                    fieldName: options.fieldName || id,
                    width    : width,
                    header   : { text: label },
                    readOnly : readonly
                }

                // 동적 Editable 설정
                if(typeof options.editable == "function") {
                    column.editable = true;
                    column.editableCallback = options.editable;
                    if(typeof options.styleCallback == "function") {
                        column.originStyleCallback = options.styleCallback;
                    }
                    // options.styleCallback = (function(self) {
                    //     return function(grid, dataCell) {
                    //         var column = self.getColumn(dataCell.dataColumn.name);
                    //         if(_.isEmpty(column)) {
                    //             return {};
                    //         }
                    //         var editable = null;
                    //         if(typeof column.editableCallback == "function") {
                    //             editable = column.editableCallback.apply(self._ustraGrid, Array.from(arguments));
                    //         }

                    //         var style = {};
                    //         if(typeof column.originStyleCallback == "function") {
                    //             Object.assign(style, column.originStyleCallback.apply(self._ustraGrid, Array.from(arguments)));
                    //         }
                    //         if(!_.isEmpty(editable)) {
                    //             style.editable = editable;
                    //         }
                    //         return style;
                    //     }
                    // })(this);
                    delete options.editable;
                }
                options.styleCallback = (function(self) {
                    return function(grid, dataCell) {
                        // Grid Options의 editable과, Custom Editor에서 호출
                        var column = self.getColumn(dataCell.index.column.name);
                        if(_.isEmpty(column)) {
                            return {};
                        }
                        var editable = null, ustraGrid = UstraRealGrid.of(grid);
                        if(typeof ustraGrid._options.editable == "function") {
                            editable = ustraGrid._options.editable.apply(ustraGrid, Array.from(arguments));
                        }
                        if(editable !== false && typeof column.editableCallback == "function") {
                            editable = column.editableCallback.apply(self._ustraGrid, Array.from(arguments));
                        }

                        var style = {};
                        if(typeof column.originStyleCallback == "function") {
                            Object.assign(style, column.originStyleCallback.apply(self._ustraGrid, Array.from(arguments)));
                        }
                        if(_.isBoolean(editable)) {
                            style.editable = editable;
                        }

                        return style;
                    }
                })(this);

                // Default Options
                if(typeof options.editor == "undefined") {
                    options.editor = {
                        type          : "line",
                        maxLength     : 50
                    };
                }

                if(options.align == "right") {
                    options.styleName = _addClass(options && options.styleName, "has-text-right");
                } else if(options.align == "left") {
                    options.styleName = _addClass(options && options.styleName, "has-text-left");
                } else {
                    options.styleName = _addClass(options && options.styleName, "has-text-center");
                }

                if(options.position == "is-left") {
                    options.styleName = _addClass(options && options.styleName, "is-left");
                }
                else if(options.position == "is-top") {
                    options.styleName = _addClass(options && options.styleName, "is-top");
                }

                if(options.required === true) {
                    options.requiredMessage = UstraRealGrid.getGridErrorMsg(label, "REQUIRED");
                    column.header.template = "<span class=\"is-required\">"+label+"</span>";
                    //column.edgeMark = "leftTop";  // 그리드 각 row, cell 마다 필수 표시 아이콘 삭제(헤더에 이미 * 가 있으므로)
                }

                if(typeof options.check != "undefined") {
                    column.header.checkLocation = "right";
                }

                if(typeof options.placeHolder != "undefined") {
                    column.placeHolder = options.placeHolder;
                }

                column = _.defaultsDeep(column, options);
                // Object.assign(column, options);

                column.fillWidth = (column.width === "auto" ? 1 : NaN);
                this._columnList.push(column);
                return this;
            },
            addDate1: function(id, label, labelCode, width, readonly, options) {
                var dataType = options && options.editOptions && options.editOptions.dataType;
                var format = options && options.editOptions && options.editOptions.format;
                var defaultOptions = {
                    dataType: _.isEmpty(dataType) ? "text" : dataType,
                    datetimeFormat: _.isEmpty(format) ? "yyyy-MM-dd" : format,
                    renderer: {
                        type: "CustomDatePicker"
                    },
                    editor: {
                        mask: {
                            editMask: _.isEmpty(format) ? "0000-00-00" : format.replace(/[a-zA-Z]/g, "0")
                        },
                        datetimeFormat: _.isEmpty(format) ? "yyyyMMdd" : format.replace(/[^a-zA-Z]/g, "")
                    },
                    editOptions: {
                        format: _.isEmpty(format) ? "yyyy-MM-dd" : format
                    }
                };
                defaultOptions = _.defaultsDeep(options, defaultOptions);

                this._renderer.push("CustomDatePicker");
                this._renderer = this._renderer.filter(function(v, i, a) { return a.indexOf(v) === i; });

                return this.add(id, label, labelCode, width, readonly, defaultOptions);
            },
            addMonth1: function(id, label, labelCode, width, readonly, options) {
                var dataType = options && options.editOptions && options.editOptions.dataType;
                var format = options && options.editOptions && options.editOptions.format;
                var defaultOptions = {
                    dataType: _.isEmpty(dataType) ? "text" : dataType,
                    datetimeFormat: _.isEmpty(format) ? "yyyy-MM" : format,
                    renderer: {
                        type: "CustomDatePicker"
                    },
                    editor: {
                        mask: {
                            editMask: _.isEmpty(format) ? "0000-00" : format.replace(/[a-zA-Z]/g, "0")
                        },
                        datetimeFormat: _.isEmpty(format) ? "yyyyMM" : format.replace(/[^a-zA-Z]/g, "")
                    },
                    editOptions: {
                        type: "month",
                        format: _.isEmpty(format) ? "yyyy-MM" : format
                    }
                };
                defaultOptions = _.defaultsDeep(options, defaultOptions);

                this._renderer.push("CustomDatePicker");
                this._renderer = this._renderer.filter(function(v, i, a) { return a.indexOf(v) === i; });

                return this.add(id, label, labelCode, width, readonly, defaultOptions);
            },
            addBar: function(id, label, labelCode, width, readonly, options) {
                var dataType = options && options.editOptions && options.editOptions.dataType;
                var defaultOptions = {
                    dataType: _.isEmpty(dataType) ? "text" : dataType,
                    type: "data",
                    renderer: {
                        type: "bar",
                        origin: "left",
                        minimum: 0,
                        maximum: 100,
                        barWidth: "80%"
                    }
                };

                options.styleName = _addClass(options && options.styleName, "right-bar-text");
                defaultOptions = _.defaultsDeep(options, defaultOptions);

                return this.add(id, label, labelCode, width, readonly, defaultOptions);
            },
            addMonth: function(id, label, labelCode, width, readonly, options) {
                var dataType = options && options.editOptions && options.editOptions.dataType;
                var format = options && options.editOptions && options.editOptions.format;

                var btOptions1 = {
                    startView: 1,
                    minViewMode: 1,
                    todayBtn: "linked",
                    language:"ko",
                    todayHighlight: true
                }

                var defaultOptions = {
                    dataType: _.isEmpty(dataType) ? "text" : dataType,
                    textFormat: "([0-9]{4})([0-9]{2})$;$1-$2",
                    editor: {
                        type:"btdate",
                        btOptions:btOptions1,
                        datetimeFormat:"yyyyMM",
                        textReadOnly:false,
                        maxLength: 7,
                        yearNavigation: true,
                        datetimeFormat: _.isEmpty(format) ? "yyyyMM" : format.replace(/[^a-zA-Z]/g, ""),
                        minDate: (typeof options.minDate === "undefined") ? moment("1900","YYYY/MM/DD hh/mm/ss").format("YYYY-MM-DD hh:mm:ss") : options.minDate,
                        maxDate: (typeof options.maxDate === "undefined") ? moment("3000","YYYY/MM/DD hh/mm/ss").format("YYYY-MM-DD hh:mm:ss") : options.maxDate,
                        dropDownWhenClick:true
                    },
                    datetimeFormat:"yyyy-MM"
                };
                defaultOptions = _.defaultsDeep(options, defaultOptions);

                return this.add(id, label, labelCode, width, readonly, defaultOptions);
            },
            addDate: function(id, label, labelCode, width, readonly, options) {
                var dataType = options && options.editOptions && options.editOptions.dataType;
                var format = options && options.editOptions && options.editOptions.format;

                var btOptions1 = {
                    startView: 1,
                    minViewMode: 2,
                    todayBtn: "linked",
                    language:"ko",
                    todayHighlight: true
                }

                var defaultOptions = {
                    dataType: _.isEmpty(dataType) ? "text" : dataType,
                    textFormat: "([0-9]{4})([0-9]{2})([0-9]{2})$;$1-$2-$3",
                    editor: {
                        type:"date",
                        btOptions:btOptions1,
                        datetimeFormat:"yyyyMMdd",
                        textReadOnly:false,
                        maxLength: 10,
                        yearNavigation: true,
                        datetimeFormat: _.isEmpty(format) ? "yyyyMMdd" : format.replace(/[^a-zA-Z]/g, ""),
                        minDate: (typeof options.minDate === "undefined") ? moment("1900","YYYY/MM/DD hh/mm/ss").format("YYYY-MM-DD hh:mm:ss") : options.minDate,
                        maxDate: (typeof options.maxDate === "undefined") ? moment("3000","YYYY/MM/DD hh/mm/ss").format("YYYY-MM-DD hh:mm:ss") : options.maxDate,
                        dropDownWhenClick:true
                    },
                    datetimeFormat:"yyyy-MM-dd"
                };
                defaultOptions = _.defaultsDeep(options, defaultOptions);

                return this.add(id, label, labelCode, width, readonly, defaultOptions);
            },
            addSelect: function(id, label, labelCode, width, readonly, options) {
                var listItems = convertToListItemData(options.editOptions && options.editOptions.listItems || []);
                var defaultOptions = {
                    lookupDisplay: true,
                    sortByLabel: true,
                    editButtonVisibility: "always",
                    values       : !_.isEmpty(listItems) ? listItems.map(function(item) { return item.value; }) : options.values,
                    labels       : !_.isEmpty(listItems) ? listItems.map(function(item) { return item.text; }) : options.labels,
                    editor: {
                        type          : "dropdown",
                        domainOnly    : true,
                        partialMatch  : true,
                        dropDownCount : (typeof options.dropDownCount === "undefined" ? 8: options.dropDownCount)
                    },
                };
                if (typeof options.align == "undefined") {
                    options.styleName = _addClass(options && options.styleName, "has-text-left");
                }

                defaultOptions = _.defaultsDeep(options, defaultOptions);

                return this.add(id, label, labelCode, width, readonly, defaultOptions);
            },
            addTextArea: function(id, label, labelCode, width, readonly, options) {
                var defaultOptions = {
                    editor: {
                        type          : "multiline",
                        maxLength     : options.editor.maxLength || 200
                    },
                    styleName: "multiline-editor"
                };
                defaultOptions = _.defaultsDeep(options, defaultOptions);

                return this.add(id, label, labelCode, width, readonly, defaultOptions);
            },
            addNumber: function(id, label, labelCode, width, readonly, options) {
                var defaultOptions = {
                    dataType    : "number",
                    numberFormat: "#,##0",
                    styleName   : _addClass(options && options.styleName, "has-text-right"),
                    editor: {
                        type             : "number",
                        editFormat       : "#,##0.##",
                        positiveOnly     : false,
                        integerOnly      : false,
                        maxIntegerLength : 0,
                        maxLengthExceptComma : true
                    }
                };
                // Default Options
                if(typeof options.editor == "undefined") {
                    options.editor = {
                        maxLength     : _.isNumber(options.maxLength) ? options.maxLength : 13
                    };
                }

                defaultOptions = _.defaultsDeep(options, defaultOptions);

                return this.add(id, label, labelCode, width, readonly, defaultOptions);
            },
            addRealNumber: function(id, label, labelCode, width, readonly, options) {
                var defaultOptions = {
                    dataType    : "number",
                    numberFormat: "#,##0.##",
                    styleName   : _addClass(options && options.styleName, "has-text-right"),
                    editor: {
                        type             : "number",
                        editFormat       : "#,##0.##",
                        positiveOnly     : false,
                        integerOnly      : false,
                        maxIntegerLength : 0,
                        maxLengthExceptComma : true
                    }
                };
                // Default Options
                if(typeof options.editor == "undefined") {
                    options.editor = {
                        maxLength     : _.isNumber(options.maxLength) ? options.maxLength : 13
                    };
                }

                defaultOptions = _.defaultsDeep(options, defaultOptions);

                return this.add(id, label, labelCode, width, readonly, defaultOptions);
            },
            addToggle: function(id, label, labelCode, width, readonly, options) {
                console.error("Not implemented");
            },
            addButtonLeft: function(id, label, labelCode, width, readonly, options) {
                var defaultOptions = {
                    renderer: {
                        type: "CustomButtonLeft"
                    }
                };
                defaultOptions = _.defaultsDeep(options, defaultOptions);

                this._renderer.push("CustomButtonLeft");
                this._renderer = this._renderer.filter(function(v, i, a) { return a.indexOf(v) === i; });

                return this.add(id, label, labelCode, width, readonly, defaultOptions);
            },
            addButton: function(id, label, labelCode, width, readonly, options) {
                var defaultOptions = {
                    renderer: {
                        type: "CustomButton"
                    }
                };
                defaultOptions = _.defaultsDeep(options, defaultOptions);

                this._renderer.push("CustomButton");
                this._renderer = this._renderer.filter(function(v, i, a) { return a.indexOf(v) === i; });

                return this.add(id, label, labelCode, width, readonly, defaultOptions);
            },
            addTwoButton: function(id, label, labelCode, width, readonly, options) {
                var defaultOptions = {
                    renderer: {
                        type: "CustomTwoButton"
                    }
                };
                defaultOptions = _.defaultsDeep(options, defaultOptions);

                this._renderer.push("CustomTwoButton");
                this._renderer = this._renderer.filter(function(v, i, a) { return a.indexOf(v) === i; });

                return this.add(id, label, labelCode, width, readonly, defaultOptions);
            },
            addSearchButton: function(id, label, labelCode, width, readonly, options) {
                console.error("Not implemented");
            },
            addCheck: function(id, label, labelCode, width, readonly, options) {
                var defaultOptions = {
                    editable: false,
                    renderer: {
                        type             : "check",
                        trueValues       : "Y",
                        falseValues      : "N",
                        checkLocation    : "center"
                    }
                };
                defaultOptions = _.defaultsDeep(options, defaultOptions);

                return this.add(id, label, labelCode, width, readonly, defaultOptions);
            },
            addLink: function(id, label, labelCode, width, readonly, options) {
                var defaultOptions = {
                    editable: false,
                    renderer: {
                        type             : "link",
                        urlCallback: function (grid, cell) {
                            return options.url;
                        }
                    }
                };

                defaultOptions = _.defaultsDeep(options, defaultOptions);

                return this.add(id, label, labelCode, width, readonly, defaultOptions);
            },
            getFields: function() {
                var fields = [], i, obj, attribute, key;

                for(i = 0; i < this._columnList.length; i++) {
                    obj = {};
                    attribute = this._columnList[i];
                    for(key in attribute) {
                        if(fieldAttributes.includes(key)) {
                            obj[key] = attribute[key];
                        }
                    }
                    fields.push(obj);
                }
                return fields;
            },
            setColumn: function(columnName, newColumn) {
                var idx = _.findIndex(this._columnList, { name: columnName });
                if(idx !== -1) {
                    this._columnList[idx] = newColumn;
                }
                return idx;
            },
            getColumn: function(columnName) {
                var column = _.find(this._columnList, { name: columnName });
                if(_.isEmpty(column)) {
                    return {};
                }
                return column;
            },
            getColumns: function() {
                var columns = [], i, obj, attribute, key;

                for(i = 0; i < this._columnList.length; i++) {
                    obj = {};
                    attribute = this._columnList[i];
                    for(key in attribute) {
                        if(columnAttributes.includes(key)) {
                            obj[key] = attribute[key];
                        }
                    }
                    columns.push(obj);
                }
                return columns;
            },
            getDisables: function() {
                return this._disables;
            }
        };
        return UstraRealGridColumn;
    })();
}

let UstraRealGridContextMenu;
if(typeof UstraRealGridContextMenu == "undefined") {
    UstraRealGridContextMenu = (function() {

        let _defaultMenu = [{
            label: "고정",
            children: [{
                label: "행 1개",
                tag: "1rowFixed"
            }, {
                label: "행 2개",
                tag: "2rowFixed"
            }, {
                label: "",
                tag: "rowFixed"
            }, {
                label: "-"
            }, {
                label: "첫번째 컬럼",
                tag: "1colFixed"
            }, {
                label: "두번째 컬럼",
                tag: "2colFixed"
            }, {
                label: "",
                tag: "colFixed"
            }, {
                label: "-"
            }, {
                label: "고정 취소",
                tag: "cancelFixed",
                enabled: false
            }]
        }, {
            label: "컬럼",
            tag  : "columnMenu",
            children: []
        }, {
            label: "-"
        }, {
            label: "엑셀 내보내기",
            tag  : "exportExcel"
        }];

        function _onContextMenuItemClicked(grid, data, index) {
            var ustraGrid = UstraRealGrid.of(grid);
            if(ustraGrid != null) {
                var contextMenu = ustraGrid._contextMenu;
                var cell = grid.getCurrent();

                var colName = null;
                if(_.isArray(data.tag)) {
                    colName  = data.tag[1];
                    data.tag = data.tag[0];
                }
                switch(data.tag) {
                    case "1rowFixed" :
                        grid.setFixedOptions({rowCount: 1});
                        break;
                    case "2rowFixed" :
                        grid.setFixedOptions({rowCount: 2});
                        break;
                    case "rowFixed" :
                        grid.setFixedOptions({rowCount: cell.itemIndex + 1});
                        break;
                    case "1colFixed" :
                        grid.setFixedOptions({colCount: 1});
                        break;
                    case "2colFixed" :
                        grid.setFixedOptions({colCount: 2});
                        break;
                    case "colFixed" :
                        let col = grid.columnByName(cell.column);
                        grid.setFixedOptions({colCount: col.displayIndex + 1});
                        break;
                    case "cancelFixed" :
                        grid.setFixedOptions({colCount: 0, rowCount: 0});
                        break;
                    case "exportExcel":
                        ustraGrid.export();
                        break;
                    case "autoFilter":
                        var column = ustraGrid.getColumnByName(index.column);
                        column.autoFilter = true;
                        break;
                    case "hideColumn":
                        var column = ustraGrid.getColumnByName(colName);
                        column.visible = !data.checked;
                        if(column.visible) {
                            _.pull(contextMenu._hidden, colName);
                        }
                        else {
                            contextMenu._hidden.push(colName);
                        }
                        grid.refresh();
                        break;
                    case "cancelHideColumn":
                        contextMenu._hidden.forEach(function(item) {
                            var column = ustraGrid.getColumnByName(item);
                            column.visible = true;
                        });
                        contextMenu._hidden = [];
                        break;
                }
            }
        }
        function _onContextMenuPopup(grid, x, y, clickData) {
            var ustraGrid = UstraRealGrid.of(grid);
            if(ustraGrid != null) {
                var contextMenu = ustraGrid._contextMenu.getContextMenu(grid, clickData);
                if(contextMenu) {
                    grid.setContextMenu(contextMenu);
                    return true;
                }
            }
            return false;
        };

        function UstraRealGridContextMenu(contextMenuOptions) {
            this._contextMenu = null;
            this._options     = contextMenuOptions;
            this._isFixed     = false;
            this._hidden      = [];
            return this;
        }
        UstraRealGridContextMenu.prototype = {
            getContextMenu: function(grid, clickData) {
                var self = this;

                if (typeof clickData == "undefined") {
                    return false;
                }

                if(clickData.cellType == "header" || clickData.cellType == "data") {
                    var contextMenu = _.cloneDeep(_defaultMenu);
                    var columns = grid.getColumnNames();
                    var visibleContextMenu = [];
                    for (var i in columns) {
                        var menuItem = {};
                        var column = grid.columnByName(columns[i]);

                        if (typeof column != "undefined") {
                            if (column.fieldName) {
                                if(this._hidden.includes(column.name) === false && column.visible === false) {
                                    continue;
                                }
                                menuItem.label   = column.header.text;
                                menuItem.tag     = ["hideColumn", column.name];
                                menuItem.checked = column.visible;

                                visibleContextMenu.push(menuItem);
                            }
                        }
                    };

                    visibleContextMenu.push({
                        label: "-"
                    }, {
                        label: "컬럼 모두 보기",
                        tag  : "cancelHideColumn"
                    }, {
                        label: "-"
                    }, {
                        label: "현재 컬럼 필터 겨기",
                        tag  : "autoFilter"
                    });

                    // 컬럼
                    contextMenu[1].children = visibleContextMenu;

                    // 고정
                    var row = grid.getCurrent().itemIndex + 1;
                    var column = grid.columnByName(grid.getCurrent().column);



                    contextMenu[0].children[2].label   = "현재 행까지("+ row +")";
                    contextMenu[0].children[6].label   = "현재 컬럼까지("+  (typeof column != "undefined" ? column.header.text: "") +")";
                    contextMenu[0].children[8].enabled = (grid.fixedOptions.rightCount + grid.fixedOptions.colCount + grid.fixedOptions.rowCount) != 0;

                    return contextMenu;
                }
                else {
                    return false;
                }
            },
            setEventHandler: function(grid) {
                grid.onContextMenuItemClicked = _onContextMenuItemClicked;
                grid.onContextMenuPopup = _onContextMenuPopup;
            }
        };

        return UstraRealGridContextMenu;
    })();
}

let UstraRealGrid;
if(typeof UstraRealGrid === "undefined") {
    UstraRealGrid = (function () {
        let _instance = {};

        const ERROR_MSG_MAP = {
            REQUIRED: "{{COLUMN}} 필수 값입니다.",
            VALIDATOR_FN: "{{COLUMN}} 확인해주세요.",
            TYPE_NUMBER: "{{COLUMN}} 확인해주세요.(숫자입력)",
            UNIQUE: "중복된 값입니다."
        };

        const EVENT_MAP = {
            "click"    : "onCellClicked",
            "dblClick" : "onCellDblClicked",
        };

        const MINIMUM_COLUMN_WIDTH = 100;

        /**
         * GridUtils.bind에서 전달받은 이벤트가 GridView 이벤트인지, DataProvider 이벤트인지 체크.
         * 둘 다 있는 이벤트의 경우 GridView가 우선순위가 높다.
         *
         * @param {*} id
         * @param {*} event
         */
        function _getEventTarget(ustraGrid, event) {
            if(ustraGrid._grid.hasOwnProperty(event)) {
                return ustraGrid._grid;
            }
            else if(ustraGrid._provider.hasOwnProperty(event)) {
                return ustraGrid._provider;
            }
            return undefined;
        };

        function _getByteLength(s,p,b,i,c) {
            if(typeof p == "undefined") p = 3;
            for(b=i=0;c=s.charCodeAt(i++);b+=c>>11?p:c>>7?2:1);
            return b;
        };

        function _setAutoWidthColumn(columns, lazy) {
            // Version 3. 너비를 직접 계산해서 세팅하는 방법
            var self = this;

            var autoWidthColumns = columns.filter(function(column) { return column.width === "auto" && column.fillWidth === 1 && column.visible !== false; });
            if(autoWidthColumns.length > 0) {
                var defaultBarWidth = 2;
                ["checkBar", "stateBar", "rowIndicator"].forEach(function(defaultBar) {
                    if(self._grid[defaultBar].visible) {
                        defaultBarWidth += (self._grid[defaultBar].width === 0 ? self._grid[defaultBar].minWidth : self._grid[defaultBar].width);
                    }
                });
                if(this._grid.fixedOptions.colCount !== 0) defaultBarWidth += this._grid.fixedOptions.colBarWidth;

                if(self._el.offsetWidth === 0) {
                    return false;
                }
                var remainingWidth = self._el.offsetWidth - defaultBarWidth;
                columns.forEach(function(column) {
                    if(column.visible !== false) {
                        remainingWidth += (-1) * (column.width === "auto" ? MINIMUM_COLUMN_WIDTH : column.width);
                    }
                });
                var additionalWidth = Math.floor(remainingWidth / autoWidthColumns.length);
                columns.forEach(function(column, idx) {
                    if(column.fillWidth === 1 && column.visible !== false) {
                        var width = (column.width === "auto" ? MINIMUM_COLUMN_WIDTH : column.width);
                        width += additionalWidth;

                        column.width = width;
                        // columns[idx].width = width;
                        if(lazy) {
                            self._grid.layoutByColumn(column.name).cellWidth = width;
                        }
                    }
                });
            }
            return true;
        };

        /**
         * 그리드 입력 에러 알림
         */
        function _alertGridError(ustraGrid, result) {
            //var rowKey = result.rowKey;
            var errors = result;

            // 하나의 컬럼에 에러가 여러 개일 수 있음, 첫 번째 에러 항목만 알림
            var firstError = errors[0];
            //var columnName = firstError.columnName;
            //var errorCode  = firstError.errorCode;
            var rowNum     = firstError.rowKey;
            var columnName = firstError.column;
            var errorCode  = firstError.message;

            var alertMsg = _getGridErrorMsg(ustraGrid, columnName, errorCode);
            $.alert(alertMsg, "알림", function() {
                ustraGrid.setFocus(rowNum, columnName, true);
            });
        };

        /**
         * 그리드 입력 에러 메세지 리턴
         */
        function _getGridErrorMsg(ustraGrid, columnName, errorCode) {
            var columnLabel;
            if(typeof ustraGrid === "string" && arguments.length === 2) {
                //columnLabel, errorCode
                columnLabel = ustraGrid || "";
                errorCode   = columnName;
            }
            else {
                //ustraGrid, columnName, errorCode
                var column = ustraGrid.getColumnByName(columnName);
                columnLabel = column.header.text || columnName;
            }

            if (errorCode == "REQUIRED") {
                columnLabel = addProperJosa(columnLabel, "은");
            } else {
                columnLabel = addProperJosa(columnLabel, "를");
            }

            var errorMsg = (ERROR_MSG_MAP[errorCode] || errorCode).replace("{{COLUMN}}", columnLabel);
            return errorMsg.trim();
        };

        /**
         * 그리드 수정데이터 서버에 업데이트
         */
        function _updateGridData(url, data, options) {
            //var formData = new FormData();
            //for(var key in data) {
            //    formData.append(key, data[key]);
            //}

            $.post(url, data, function(result) {
                if(result && result > 0){
                    $.alert(options.successMsg || "처리되었습니다.", "알림", function() {
                        options.onSuccess();
                    });
                }else{
                    $.error("저장에 실패하였습니다.", "알림", function() {
                        options.onError();
                    });
                }
            }).fail(function (xhr, status, error) {
                console.log(xhr.responseJSON.message);
                options.onError();
            });
            ;

/*
            axios.post(url, formData)
            .then(function (result) {
                if(result && result.data > 0){
                    $.alert(options.successMsg || "처리되었습니다.", "알림", function() {
                        options.onSuccess();
                    });
                }else{
                    $.error("저장에 실패하였습니다.", "알림", function() {
                        options.onError();
                    });
                }
            })
            .catch(function (error) {
                console.log("ress err->",error);
            });
*/

/*
            fetch(url, { method: "POST",
                         body: formData
                       })
            .then(function(response) {
                //$.alert(options.successMsg || "처리되었습니다.");
                //if(options.onSuccess) {
                //    options.onSuccess();
                //}
                if (response.ok) {
                    $.alert(options.successMsg || "처리되었습니다.");
                    options.onSuccess(response);
                } else {
                    $.error("처리중 오류가 발생하였습니다.");
                    options.onError();

                }
            })
            .catch(function(error) {
                if(options.onError) {
                    options.onError();
                }
            });
*/



        };

        function _bindGridSearch(ustraGrid, options) {
            console.error("Not implemented");
            var searchButton = document.getElementById(options.button || "btnSearch");
            var searchForm   = document.getElementById(options.searchForm || "divSearch");

            var params = searchForm.getData();
            //searchButton
            // TODO
        };

        function _bindGridSave(ustraGrid, options) {
            ustraGrid.finishEditing();
            var saveButton = document.getElementById(options.button || "btnSaveGrid");

            if (saveButton){
                saveButton.addEventListener("click", function() {
                    var modifiedData = ustraGrid.getModifiedDataJson(options.fieldName);
                    if (modifiedData == null) {
                        return;
                    }

                    var validationResults = ustraGrid.validateIfModified();

                    if (validationResults.length > 0) {
                        //_alertGridError(ustraGrid, validationResults.shift());
                        _alertGridError(ustraGrid, validationResults);
                        return;
                    }
                    //2022-11-22 추가
					if(options.onBeforeSend){
						if(!options.onBeforeSend()) return;
					}                    

                    _updateGridData(options.url, modifiedData, {
                        successMsg: "저장되었습니다",
                        onSuccess : options.onSuccess,
                        onError   : options.onError
                    });
                });
            }
        };

        function _bindGridRemove(ustraGrid, options) {
            var removeButton = document.getElementById(options.button || "btnRemoveRow");

            if (removeButton){
                function removeRows(rows) {
                    rows.forEach(function(row, idx) {
                        ustraGrid.removeRow(row.rowKey);
                    });

                    // 등록된 데이터를 삭제한 경우
                    if (ustraGrid.isModifiedByType("deleted")) {
                        _updateGridData(options.url, ustraGrid.getRemovedDataJson(options.fieldName), {
                            onSuccess: options.onSuccess,
                            onError: options.onError
                        });
                    }
                    ustraGrid.refreshLayout();
                    removeButton.setAttribute("disabled", "disabled");
                    if(typeof options.onRemove == "function") {
                        options.onRemove.apply(ustraGrid, [ustraGrid.isModifiedByType("deleted")]);
                    }
                }


                removeButton.setAttribute("disabled", "disabled");

                // 삭제버튼 활성화, 비활성화
                ustraGrid.on("onItemChecked, onItemsChecked, onItemAllChecked", function(gridEvent) {
                    ustraGrid.finishEditing();
                    var checkedRows = ustraGrid.getCheckedRows();
                    if (options.btnEnable) {
                        removeButton.removeAttribute("disabled");
                    } else {
                        if (checkedRows.length === 0) {
                            removeButton.setAttribute("disabled", "disabled");
                        }
                        else {
                            removeButton.removeAttribute("disabled");
                        }
                    }
                });

                // 삭제
                removeButton.addEventListener("click", function() {
                    var checkedRows = ustraGrid.getCheckedRows();
                    if (checkedRows == null || checkedRows.length === 0) {
                        return;
                    }

                    $.confirm('총 ' + checkedRows.length + '건을 삭제하시겠습니까?', '알림', function(e){
                        removeRows(checkedRows);
                    });



                });
            }
        };

        function _bindGridRemovenoop(ustraGrid, options) {
            var removeButton = document.getElementById(options.button || "btnRemoveRow");

            if (removeButton){
                function removeRows(rows) {
                    rows.forEach(function(row, idx) {
                        ustraGrid.removeRow(row.rowKey);
                    });

                    // 등록된 데이터를 삭제한 경우
                    if (ustraGrid.isModifiedByType("deleted")) {
                        _updateGridData(options.url, ustraGrid.getRemovedDataJson(options.fieldName), {
                            onSuccess: options.onSuccess,
                            onError: options.onError
                        });
                    }
                    ustraGrid.refreshLayout();
                    //removeButton.setAttribute("disabled", "disabled");
                    if(typeof options.onRemove == "function") {
                        options.onRemove.apply(ustraGrid, [ustraGrid.isModifiedByType("deleted")]);
                    }
                }


                //removeButton.setAttribute("disabled", "disabled");

                /*
                // 삭제버튼 활성화, 비활성화
                ustraGrid.on("onItemChecked, onItemsChecked, onItemAllChecked", function(gridEvent) {
                    ustraGrid.finishEditing();
                    var checkedRows = ustraGrid.getCheckedRows();
                    if (options.btnEnable) {
                        removeButton.removeAttribute("disabled");
                    } else {
                        if (checkedRows.length === 0) {
                            removeButton.setAttribute("disabled", "disabled");
                        }
                        else {
                            removeButton.removeAttribute("disabled");
                        }
                    }
                });
                 */
                // 삭제
                removeButton.addEventListener("click", function() {
                    var checkedRows = ustraGrid.getCheckedRows();
                    if (checkedRows == null || checkedRows.length === 0) {
                        return;
                    }

                    $.confirm('총 ' + checkedRows.length + '건을 삭제하시겠습니까?', '알림', function(e){
                        removeRows(checkedRows);
                    });
                });
            }
        };

        function _bindGridCRUD(ustraGrid, crudOptions) {
            if (crudOptions.search) {
                _bindGridSearch(ustraGrid, crudOptions.search);
            }

            if (crudOptions.save) {
                _bindGridSave(ustraGrid, crudOptions.save);
            }

            if (crudOptions.remove) {
                _bindGridRemove(ustraGrid, crudOptions.remove);
            }

            if (crudOptions.removenoop) {
                _bindGridRemovenoop(ustraGrid, crudOptions.removenoop);
            }
        };

        /**
         * @param id 그리드 div id
         * @param column UstraRealGridColumn
         * @param options
         */
        function UstraRealGrid(id, column, options) {
            this._id          = id;
            this._el          = null;
            this._grid        = null;
            this._provider    = null;
            this._contextMenu = null;
            this._tree        = false;
            this._column      = column;
            this._options     = options;
            this._callevents  = {};
            this._search      = null;
            return this;
        }
        UstraRealGrid.prototype = {
            build: function () {
                var self     = this;
                var id       = this._id;
                var options  = this._options || {};
                var columns  = null;

                this._el                = document.getElementById(id);
                this._column._ustraGrid = this;
                this._fileName          = options.fileName;

                if (options.tree) {
                    this._tree     = options.tree;
                    this._grid     = new RealGrid.TreeView(this._el);
                    this._provider = new RealGrid.LocalTreeDataProvider();
                }
                else {
                    this._grid     = new RealGrid.GridView(this._el);
                    this._provider = new RealGrid.LocalDataProvider();
                }
                this._provider.setFields(this._column.getFields());

                // 컨텍스트 메뉴 세팅
                this._contextMenu = new UstraRealGridContextMenu(options.contextMenu);
                this._contextMenu.setEventHandler(this._grid);

                // 그리드 기타 세팅(크기, 등)

                //if(typeof options.height == "undefined" || typeof options.bodyHeight == "undefined") {
                //    this._el.style.height = String(options.height || options.bodyHeight || 550).concat("rem");
                //}

                // 그리드 옵션 세팅
                var defaultOptions = {
                    sortMode        : "explicit",
                    checkBar        : {
                        displayOrder: 0,
                        width       : 49,
                        visible     : (_.isBoolean(options.check) ? options.check : true)
                    },
                    rowIndicator    : {
                        displayOrder: 1,
                        width       : 49,
                        visible     : (_.isBoolean(options.rownum) ? options.rownum : true)
                    },
                    stateBar        : {
                        displayOrder: 2,
                        width       : 30,
                        visible     : (_.isBoolean(options.state) ? options.state : false),
                        headText    : "상태",
                        mark        : "image"
                        /* ,
                        stateTexts  : {
                            "created": "신규",
                            "updated": "수정",
                            "deleted": "삭제",
                            "createAndDeleted": "삭제"
                        }  */
                    },
                    display         : {
                        rowHeight   : (_.isNumber(options.rowHeight) ? options.rowHeight : 42),
                        emptyMessage: "표시할 데이터가 없습니다."
                    },
                    header          : {
                        height: (_.isNumber(options.headerHeight) ? options.headerHeight : 42),
                    },
                    headerSummaries : {},
                    headerSummary   : {},
                    // footer          : {
                    //     height: 40,
                    //     visible: (_.isBoolean(options.footer) ? options.footer : false)
                    // },
                    footers         : {
                        visible: (_.isBoolean(options.footer) ? options.footer : false)
                    },
                    edit            : {
                        commitByCell      : true,
                        commitWhenExitLast: true,
                        commitWhenLeave   : true,
                        enterToEdit       : true,
                        // enterToTab        : true,
                        invalidFormatMessage: "잘못된 입력 유형입니다.",
                        strictDiff        : true
                    },
                    editor          : {
                        viewGridInside: false,
                        holidays: [
                            {
                                type : "date",
                                dates : ["2021-09-20","2021-09-21","2021-09-22","2021-10-04","2021-10-09","2021-10-11","2021-12-25"],
                                styleName: "is-red",
                                tooltips : ["추석","추석","추석","개천절","한글날","한글날","크리스마스"]
                            },
                        ]
                    },
                    filtering       : {
                        automating: {
                            dateCategorize: true,
                            lookupDisplay: true
                        },
                        selector: {
                            showButtons: true
                        }
                    },
                    fixed           : {
                        colCount: 0
                    },
                    format          : {},
                    copy            : {},
                    paste           : {
                        commitEdit        : true,
                        checkDomainOnly   : true,
                        checkReadOnly     : true,
                        enableAppend      : false,
                        selectBlockPaste  : true,
                        selectionBase     : true,
                        singleMode        : false,
                        convertLookupLabel: true,
                        noEditEvent       : true,
                        startEdit         : false
                    },
                    dataDrop        : {},
                    sorting         : {},
                    summaryMode     : {}
                };

                Object.keys(defaultOptions).forEach(function(key) {
                    Object.assign(defaultOptions[key], options[key]);
                    if(JSON.stringify(defaultOptions[key]) === "{}" || JSON.stringify(defaultOptions[key]) === "[]") delete defaultOptions[key];
                });
                this._grid.setOptions(defaultOptions);

                // 그리드 Editable 적용 대상 체크
                if(typeof options.editable !== "function") {
                    self._column._columnList.forEach(function(column) {
                        if(typeof column.editableCallback !== "function" && typeof column.originStyleCallback !== "function") {
                            delete column.styleCallback;
                        }
                    });
                }
                columns = self._column.getColumns();

                this._layoutInitialized = _setAutoWidthColumn.apply(self, [columns]);
                this._grid.setDataSource(this._provider);
                this._grid.setColumns(columns);

                this._provider.setOptions({
                    softDeleting: true,
                    restoreMode: "auto"
                });
                this._grid.hideDeletedRows = true;


                if(this._layoutInitialized === false) {
                    setTimeout(function() {
                        self._layoutInitialized = _setAutoWidthColumn.apply(self, [columns, true]);
                    }, 50);
                }

                // Version 1. fitStyle을 활용해서 RealGrid에서 자동 조정된 너비 사용하는 방법
                // this._grid.displayOptions.fitStyle = "fill";
                // setTimeout(function() {
                //     self._grid.getDisplayColumns().forEach(function(column) {
                //         column.width = column.displayWidth;
                //     });
                //     self._grid.displayOptions.fitStyle = "none";
                //     setTimeout(function() {
                //         self._grid.getDisplayColumns().forEach(function(column) {
                //             self._grid.layoutByColumn(column.name).cellWidth = column.width;
                //         });
                //     });
                // });

                // Version 2.
                // setTimeout(function() {
                //     var autoWidthColumns = columns.filter(function(column) { return column.fillWidth === 1; });
                //     var remainingWidth = self._el.offsetWidth - (self._el.querySelector(".rg-head").offsetWidth + self._el.querySelector(".rg-header").offsetWidth);
                //     var additionalWidth = Math.floor(remainingWidth / autoWidthColumns.length);

                //     columns.forEach(function(column, idx) {
                //         if(column.fillWidth === 1) {
                //             var width = self._grid.columnByName(column.name).width;
                //             width += additionalWidth;

                //             self._grid.layoutByColumn(column.name).cellWidth = width;
                //         }
                //     });
                // }, 50);

                this._column._renderer.forEach(function(requiredRenderer) {
                    self._grid.registerCustomRenderer(requiredRenderer, UstraRealGridRenderer[requiredRenderer]);
                });

                // Defulat Event Handling
                this.on("onValidationFail", function(grid, itemIndex, column, err) {
                    err.message = _getGridErrorMsg(self, column.name, "REQUIRED");
                    return err;
                });

                this.on("onHideEditor", function() {
                    self.finishEditing();
                });

                if(typeof options.rowCount == "undefined" && this._el.parentElement.querySelector("h2.table-title > span.data-count > span")) {
                    options.rowCount = this._el.parentElement.querySelector("h2.table-title > span.data-count > span");
                }

                if(options.rowCount) {
                    this.on("onRowCountChanged", function(provider, count) {
                        options.rowCount.textContent = (count || 0).format();
                    });
                }

                //그리드 수정 시 자동 체크
                if(this.autoCheck === true) {
                    this.on("onRowStateChanged, onRowStatesChanged, onRowInserted, onRowsInserted, onRowUpdated", function (provider, row, count) {
                        var i, eventName = arguments[arguments.length - 1],
                            self = this;
                        if(typeof count == "number" && typeof row == "number" && !Array.isArray(row)) {
                            //onRowsInserted, itemIndex와 Insert된 count
                            row = Array(count).fill(row).map(function(v, i) { return v = v + i; });
                        }
                        if(!Array.isArray(row) && typeof row == "number" && typeof count == "string") {
                            row = [row];
                        }
                        if(Array.isArray(row)) {
                            if(eventName == "onRowInserted" || eventName == "onRowsInserted") {
                                setTimeout(function() {
                                    for(i = 0; i < row.length; i++) {
                                        self._grid.checkItem(self._grid.getItemIndex(row[i]), provider.getRowState(row[i]) != "none");
                                    }
                                });
                            }
                            else if(eventName == "onRowUpdated") {
                                for(i = 0; i < row.length; i++) {
                                    if(provider.getRowState(row[i]) == "none") {
                                        self._grid.checkItem(self._grid.getItemIndex(row[i]), false);
                                    }
                                }
                            }
                            else { //onRowStateChanged OR onRowStatesChanged
                                for(i = 0; i < row.length; i++) {
                                    self._grid.checkItem(self._grid.getItemIndex(row[i]), provider.getRowState(row[i]) != "none");
                                }
                            }
                        }
                    });
                }
                if (options.crudOptions) {
                    _bindGridCRUD(this, options.crudOptions);
                }

                // 그리드에서 mouseleave시 editing 종료(그리드내 달력, 콤보박스도 mouseleave로  event 됨 ** 오류 **)
                this._el.addEventListener("mouseleave",function(ev) {
                    ev.stopPropagation();
                    ev.preventDefault();

                    if(this.id === ev.target.id) {
                        //self.finishEditing();
                    }
                });

                _instance[id] = this;
                return this;
            },
            on: function(eventNames, fn) {
                var eventName, i;

                // 일반적인 이벤트 명을 리얼그리드 이벤트명으로 변경
                if(EVENT_MAP.hasOwnProperty(eventNames)) eventNames = EVENT_MAP[eventNames];

                eventNames = eventNames.split(",");
                eventNames.forEach(function(v, i) { this[i] = v.replace(/\s/g, ""); }, eventNames);
                for(i = 0; i < eventNames.length; i++) {
                    eventName  = eventNames[i];
                    (function(that, eventName, fn) {
                        let target = _getEventTarget(that, eventName);
                        if(typeof target == "undefined") {
                            console.error("can not find event[\""+eventName+"\"] from target");
                            return;
                        }
                        if(typeof that._callevents[eventName] == "undefined") {
                            that._callevents[eventName] = {};
                            that._callevents[eventName].enable   = true;
                            that._callevents[eventName].listener = [];
                            target[eventName] = function() {
                                var i, result;
                                if(that._callevents[eventName].enable) {
                                    for(i = 0; i < that._callevents[eventName].listener.length; i++) {
                                        result = that._callevents[eventName].listener[i].apply(that, Array.from(arguments).concat(eventName));
                                    }
                                }
                                return result;
                            };
                        }
                        that._callevents[eventName].listener.push(fn);
                    })(this, eventName, fn);
                }
            },
            off: function(eventNames) {
                var eventName, i;

                eventNames = eventNames.split(",");
                eventNames.forEach(function(v, i) { this[i] = v.replace(/\s/g, ""); }, eventNames);
                for(i = 0; i < eventNames.length; i++) {
                    eventName  = eventNames[i];
                    if(that._callevents[eventName].hasOwnProperty(eventName)) {
                        that._callevents[eventName].enable   = false;
                        that._callevents[eventName].listener = [];
                    }
                }
            },
            trigger: function(eventName, param) {
                var self = this;
                if(EVENT_MAP.hasOwnProperty(eventName)) eventName = EVENT_MAP[eventName];

                if(typeof this._callevents[eventName] !== "undefined" && this._callevents[eventName].enable) {
                    this._callevents[eventName].listener.forEach(function(listener) {
                        listener.apply(self, [self._grid, param]);
                    });
                }
            },
            load: function(url, params, callback) {
                var self = this;
                self._grid.cancel();
                if (typeof params == "function") {
                    callback = params;
                    params = {};
                }
                self.clear();
                self._grid.showLoading();

                this._search = {
                    url     : url,
                    params  : params,
                    callback: callback
                };
                url = new URL(url, window.location);
                url.search = new URLSearchParams(params).toString();
                fetch(url, {
                    method: "GET"
                })
                .then(function(response) {
                    return response.json();
                })
                .then(function(data) {
                    if (data.viewName === "error/500") {
						let vMsg = "조회 중 오류가 발생했습니다.<br>관리자에게 문의해 주세요.<br>";
                        $.alert(vMsg+"["+data.modelMap.message+"]");
                        self._grid.closeLoading();
                        return;
                    }
                    self.bind(data);
                    self._grid.closeLoading();
                    if(data.length > 0) {
                         //self._grid.dispatch("setLoadingState", "DONE");
                         //self.setFocus(0);
                    } else {
                        self.showToast("조회된 데이타가 존재하지 않습니다.");
                        //self._grid.dispatch("setLoadingState", "EMPTY");
                    }
                    if(callback) {
                        callback(data);
                    }
                    data = null;
                })
                .catch(function(error) {
                });
            },
            reload: function() {
                if(!_.isEmpty(this._search)) {
                    var focusData = this.getFocusData(), self = this;
                    this.load(this._search.url, this._search.params, function() {
                        for(var key in focusData) {
                            if(key.startsWith("_") || key === "rowKey" || key === "rowStatus") delete focusData[key];
                        }
                        var row = self.findRow(focusData);
                        self.focus(row.rowKey);
                        if(typeof self._search.callback === "function") {
                            self._search.callback();
                        }
                    });
                }
            },
            import: function(files, onBefore, onAfter) {
                var i, f;
                var self = this;

                self._grid.showLoading();

                if(typeof XLSX == 'undefined') {
                    console.error("XLSX JS 위치 확인 필요!!");
                    var script = document.createElement("script");
                    script.setAttribute("src", "/assets/vendors/sheetjs/xlsx.full.min.js");
                    script.setAttribute("async", "false");
                    script.onload = function () {
                        self.import.apply(self, [files, onBefore, onAfter]);
                    }

                    var head = document.head;
                    head.insertBefore(script, head.firstChild);
                    return;
                }

                function fixdata(data) {
                    var o = "", l = 0, w = 10240;
                    for (; l < data.byteLength / w; ++l) o += String.fromCharCode.apply(null, new Uint8Array(data.slice(l * w, l * w + w)));
                    o += String.fromCharCode.apply(null, new Uint8Array(data.slice(l * w)));
                    return o;
                }
                function process_wb(wb) {
                    var output = to_json(wb),
                        sheetNames = Object.keys(output),
                        colsObj, fields, fieldName, keys, key, i;

                    if (sheetNames.length > 0) {
                        colsObj = output[sheetNames][0];

                        if (colsObj) {
                            fields = self._provider.getFields();
                            output[sheetNames[0]].forEach(function(v, idx) {
                                keys = Object.keys(v) || [];
                                for(i = 0; i < keys.length; i++) {
                                    key = keys[i];
                                    fieldName = fields.filter(function(v) { return v.header.text.replace(/[\s]/g,'') == key.replace(/[\s]/g,''); });
                                    if(fieldName.length > 0) {
                                        fieldName = fieldName[0].orgFieldName;
                                        output[sheetNames[0]][idx][fieldName] = output[sheetNames[0]][idx][key];
                                    }
                                    delete output[sheetNames[0]][idx][key];
                                }
                            });
                            output = output[sheetNames[0]];

                            if(typeof onBefore == "function") {
                                //output = onBefore.apply(self, [output]);
                                onBefore.apply(self, [output]);
                            }

            				self._provider.removeRows(self.getAllRowKeys());
            				self._provider.addRows(output);
                            //self._provider.fillJsonData(output);

                            if(typeof onAfter == "function") {
                                onAfter.apply(self, [output]);
                            }
                        }
                    }
                    self._grid.closeLoading();
                }

                function to_json(workbook) {
                    var result = {};
                    workbook.SheetNames.forEach(function (sheetName) {
                        var roa = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheetName], {});
                        if (roa.length > 0) {
                            result[sheetName] = roa;
                        }
                    });
                    return result;
                }

                for (i = 0, f = files[i]; i != files.length; ++i) {
                    var reader = new FileReader();
                    var name = f.name;

                    reader.onload = function (e) {
                        var data = e.target.result;

                        var arr = fixdata(data);
                        workbook = XLSX.read(btoa(arr), { type: 'base64' });

                        process_wb(workbook);
                        /* DO SOMETHING WITH workbook HERE */
                    };
                    reader.readAsArrayBuffer(f);
                }

            },
            export: function(options) {
                var defaultOptions = {
                    type       : "excel",
                    target     : "local",
                    fileName   : this._fileName
                                || (this._el.parentElement.querySelector('h2.table-title > span')
                                    && this._el.parentElement.querySelector('h2.table-title > span').textContent)
                                || "export.xlsx",
                    sheetName  : "Data",
                    bodyOnly   : false,
                    visibleOnly: true,
                    hideColumns: [],
                    showColumns: [],
                    lookupDisplay : true,
                    footer     : (this._grid.footer && this._grid.footer.visible) ? "default" : "hidden"
                };

                Object.assign(defaultOptions, options || {});

                this._grid.exportGrid(defaultOptions);
            },
            appendRow: function(data, focus) {
                var rowKey = this._provider.addRow(data);

                if(focus != false) {
                    this._grid.setCurrent({ dataRow: rowKey, column: this._grid.getColumn(0).name });
                }
                return rowKey;
            },
            appendRows: function(data, focus) {
                var self = this, lastRowKey = 0;

                data.forEach(function(item) {
                    lastRowKey = self.appendRow(item, false);
                });

                if(focus != false) {
                    this._grid.setCurrent({ dataRow: lastRowKey, column: this._grid.getColumn(0).name });
                }
                return lastRowKey;
            },
            prependRow: function(data, focus) {
                return this.insertRow(0, data, focus);
            },
            insertRow: function(rowKey, data, focus) {
                var self = this;
                self.finishEditing();
                this._provider.insertRow(rowKey, data);

                if(focus != false) {
                    this._grid.setCurrent({ dataRow:rowKey, column: this._grid.getColumn(0).name });
                }
                return rowKey;
            },
            insertFocusRow: function(data) {
                var focusData = this.getFocusData();
                if(focusData === null) {
                    return this.prependRow(data, false);
                }
                else {
                    return this.insertRow(focusData.rowKey, data, false);
                }
            },
            focus: function(rowKey, columnName) {
                this._grid.setCurrent({
                    dataRow: rowKey,
                    column : columnName || this._grid.getColumn(0).name
                });
            },
            setFocus: function(rowIndex, columnIndex) {
                this._grid.setCurrent({
                    dataRow: rowIndex,
                    column : columnIndex || this._grid.getColumn(columnIndex).name
                });
            },
            bind: function(data) {
                if(this._tree && this._provider instanceof RealGrid.LocalTreeDataProvider) {
                    var tree = this._tree;
                    data = convertTreeData(data, tree.id, tree.parent, tree.root);
                    this._provider.setObjectRows(data, "_children", "", "");
                }
                else {
                    this._provider.fillJsonData(data, { fillMode: "set" });
                }
            },
            clear: function() {
                this._provider.clearRows();
            },
            destroy: function() {
                this._provider.destroy();
            },
            getGrid: function() {
                return this._grid;
            },
            getProvider: function() {
                return this._provider;
            },
            getJson: function(fieldName) {
                return this.toDataJson(fieldName, this.getData());
            },
            getData: function() {
                var self = this;
                return this.getAllRowKeys().map(function(dataRow) {
                    return self.getRow(dataRow);
                }).sort(function(a, b) {
                    return a.rowKey - b.rowKey;
                });;
            },
            getDepth: function() {
                return this._provider.getLevel(this.getFocusedCell().rowKey);
            },
            click: function(callback) {
                this.on(EVENT_MAP.click, callback);
            },
            dblClick: function(callback) {
                this.on(EVENT_MAP.dblClick, callback);
            },
            cellClick: function(columnName, callback) {
                var self = this;
                this.on(EVENT_MAP.click, function(grid, clickData) {
                    if(clickData.column == columnName) {
                        callback.apply(self, Array.from(arguments));
                    }
                });
            },
            readData: function(page, data, resetData) {
                // TODO
                console.error("Not implemented");
            },
            validate: function() {
                return this._grid.validateCells(null, false);
            },
            validateModified: function() {
                var modifiedData = this.getModifiedData();
                var modifiedRow = modifiedData[0].rowKey;

                return this._grid.validateCells(modifiedRow, false);
            },
            clearValidate: function() {
                this._grid.clearInvalidCells();
            },
            validateIfModified: function() {
                var modifiedRows = this.getModifiedRowKeys();

                var modifiedKeys = []
                        .concat(modifiedRows.created)
                        .concat(modifiedRows.updated);

                if (modifiedKeys.length == 0) {
                    return [];
                }

                var validationResults = this._grid.validateCells(null, false) || [];
                this._grid.clearInvalidCells();
                return validationResults.filter(function(row) {
                    return modifiedKeys.indexOf(row.dataRow) > -1;
                }).map(function(row) {
                    row.rowKey = row.dataRow;
                    return row;
                });
            },
            validateIfModifiedCustom: function() {
                var validationResults = this.validateIfModified();
                var errors = validationResults;

                if (errors.length > 0) {
                    // 하나의 컬럼에 에러가 여러 개일 수 있음, 첫 번째 에러 항목만 알림
                    var firstError = errors[0];
                    var rowNum     = firstError.rowKey;
                    var columnName = firstError.column;
                    var errorCode  = firstError.message;

                    var alertMsg = _getGridErrorMsg(this, columnName, errorCode);
                    $.alert(alertMsg);
                    this._grid.setCurrent({
                        dataRow: rowNum,
                        column : columnName
                    });

                }
                return errors;
            },
            getFocusData: function() {
                return this.getFocusedCell();
            },
            getCheckedRowKeys : function(options) {
                options = options || {};
                return this._grid.getCheckedRows(options.visibleOnly);
            },
            getCheckedRows: function(options) {
                options = options || {};
                var self = this;
                return this._grid.getCheckedRows(options.visibleOnly).map(function(dataRow) {
                    return self.getRow(dataRow);
                });
            },
            getFocusedCell: function() {
                var current = this._grid.getCurrent();
                return this.getRow(current.dataRow);
            },
            getAllRowKeys: function() {
                var rows = [], self = this;
                if(this._tree && this._provider instanceof RealGrid.LocalTreeDataProvider) {
                    return this._provider.getDescendants();
                }
                else {
                    ["createAndDeleted", "created", "updated", "deleted", "none"].forEach(function(state) {
                        rows = rows.concat(self._provider.getStateRows(state));
                    });
                    return rows;
                }
            },
            getModifiedRowKeys: function() {
                return this._provider.getAllStateRows();
            },
            getModifiedRows: function() {
                var self = this;
                var stateRows = self.getModifiedRowKeys();

                if(!_.isEmpty(stateRows.created)) {
                    stateRows.created = this.getRows(stateRows.created);
                }

                if(!_.isEmpty(stateRows.updated)) {
                    stateRows.updated = this.getRows(stateRows.updated);
                }

                if(!_.isEmpty(stateRows.deleted)) {
                    stateRows.deleted = this.getRows(stateRows.deleted);
                }
                return stateRows;
            },
            getRemovedDataJson: function(fieldName) {
                var modifiedRows = this.getModifiedRows();
                if(_.isEmpty(modifiedRows.deleted)) {
                    return null;
                }

                return this.toDataJson(fieldName, modifiedRows.deleted);
            },
            getModifiedDataKeys: function() {
                var modifiedRows = this.getModifiedRowKeys();

                var modified = new Array()
                        .concat(modifiedRows.created)
                        .concat(modifiedRows.updated)
                        .concat(modifiedRows.deleted);

                modified.sort();
                return modified;
            },
            getModifiedData: function() {
                var modifiedRows = this.getModifiedRows();

                var modified = new Array()
                        .concat(modifiedRows.created)
                        .concat(modifiedRows.updated)
                        .concat(modifiedRows.deleted);

                modified.sort(function(a, b) { return a.rowKey - b.rowKey; });
                return modified;
            },
            getModifiedDataJson: function(fieldName, options){
                var modified = this.getModifiedData(options);
                return this.toDataJson(fieldName, modified);
            },
            toDataJson: function(fieldName, data) {
                var dataSet = {};
                for (var idx in data) {
                    var row = data[idx];
                    for (var cidx in row) {
                        var col = row[cidx];
                        if(Object.prototype.toString.call(col) != "[object Undefined]"
                            && Object.prototype.toString.call(col) != "[object Null]"
                            && (typeof col != "string" || (col.length > 0 && cidx.indexOf("_") < 0))) {
                            dataSet[fieldName + "[" + idx + "]." + cidx] = col;
                        }
                    }
                }
                if(Object.keys(dataSet).length == 0){
                    dataSet = null;
                }
                return dataSet;
            },
            getRowCount: function() {
                return this._provider.getRowCount();
            },
            getLastRow: function() {
                var rowCount = this.getRowCount();
                if (rowCount == 0) {
                    return null;
                }

                return this.getRow(rowCount - 1);
            },
            getAncestorRowKeys: function(rowKey) {
                return this._provider.getAncestors(rowKey);
            },
            getAncestorRows: function(rowKey) {
                var self = this;
                return this.getAncestorRowKeys(rowKey).map(function(rowKey) {
                    return self.getRow(rowKey);
                });
            },
            getDescendantRowKeys: function(rowKey) {
                return this._provider.getDescendants(rowKey);
            },
            getDescendantRows: function(rowKey) {
                var self = this;
                return _.isEmpty(this.getDescendantRowKeys(rowKey)) ?
                    [] : this.getDescendantRowKeys(rowKey).map(function(rowKey) {
                        return self.getRow(rowKey);
                    });
            },
            getParentRow: function(rowKey) {
                return this.getRow(this._provider.getParent(rowKey));
            },
            getChildRows: function(rowKey) {
                return this.getRows(this._provider.getChildren(rowKey));
            },
            setRow: function(rowKey, row) {
                this._provider.updateRow(rowKey, row);
            },
            getRow: function(rowKey) {
                if(Object.prototype.toString.call(rowKey) == "[object Object]") {
                    rowKey = rowKey.rowKey || rowKey.dataRow || rowKey.itemIndex;
                }
                if(rowKey === -1) return null;

                var jsonRow = this._provider.getJsonRow(rowKey);
                jsonRow.rowKey = rowKey;
                jsonRow.rowStatus = this.getRowState(rowKey);
                return jsonRow;
            },
            getRows: function(rowKeys) {
                var self = this;
                return rowKeys.map(function(rowKey) {
                    return self.getRow(rowKey);
                });
            },
            getRowState: function(rowKey) {
                var state = this._provider.getRowState(rowKey);
                switch(state) {
                    case "created":
                        state = "C";
                        break;
                    case "updated":
                        state = "U";
                        break;
                    case "deleted":
                        state = "D";
                        break;
                    default:
                        state = "N";
                        break;
                }
                return state;
            },
            setRowStates: function(data, state) {
                this._provider.setRowStates(data, state, true);
            },
            getColumnHeader: function() {
                return this._grid.getColumns().map(function(column) {
                    return {
                        name  : column.name,
                        header: column.header.text
                    }
                });
            },
            getColumnByName: function(columnName) {
                return this._grid.columnByName(columnName) || {};
            },
            finishEditing: function() {
                try{
                    this._grid.commit(true);
                } catch(e){
                    console.error(e.message);
                }
            },
            finishCancel: function() {
                try{
                    this._grid.cancel();
                } catch(e){
                    console.error(e.message);
                }
            },
            enableRow: function() {
                console.error("Not implemented");
                console.error("Grid Options에 editable 속성을 function으로 설정할 것.");
            },
            removeRow: function(rowKey) {
                this._provider.removeRow(rowKey);
                return rowKey;
            },
            removeRows: function(rowKey) {
                this._provider.removeRows(rowKey);
                return rowKey;
            },
            check: function(rowKey) {
                this._grid.checkRow(rowKey, true);
            },
            uncheck: function(rowKey) {
                this._grid.checkRow(rowKey, false);
            },
            checkAll: function() {
                this._grid.checkAll(true, true, true);
            },
            uncheckAll: function() {
                this._grid.checkAll(false, true, true);
            },
            isModified: function() {
                return this._provider.getRowStateCount("*") > 0;
            },
            isModifiedByType: function(type) {
                return this._provider.getRowStateCount(type) > 0;
            },
            expand: function(options) {
                var self = this;
                if (typeof options === "object") {
                    var rows = this.findRows(options);
                    if(rows.length > 0) {
                        var focusKey = rows[rows.length - 1].rowKey;
                        while(rows.length !== 0) {
                            rows.forEach(function(row, idx, arr) {

                                var ancestors = self.getAncestorRows(row.rowKey);
                                while(ancestors.length !== 0) {

                                    ancestors.forEach(function (row, idx, arr) {
                                        if(self._grid.getItemIndex(row.rowKey) !== -1) {
                                            self._grid.expand(self._grid.getItemIndex(row.rowKey));
                                            arr.splice(idx, 1);
                                        }
                                    });
                                }
                                arr.splice(idx, 1);
                            });
                        }
                        self.focus(focusKey);
                    }
                    // rows.forEach(function(row) {
                    //     self._grid.expand(row.rowKey);
                    // });
                } else {
                    self._grid.expand(options);
                }
            },
            expandAll: function(options) {
                this._grid.expandAll(options);
            },
            findRow: function(options) {
                var data = this.getData();
                options = options || {};
                return _.find(data, options);
            },
            findRows: function(options) {
                var data = this.getData();
                options = options || {};
                return _.filter(data, options);
            },
            disableRowCheck: function(rowKey) {
                // TODO
                console.error("Not implemented");
            },
            moveRow: function(itemIndex, targetIndex) {
                this._provider.moveRow(itemIndex, targetIndex);
            },
            moveDown: function(rowKey) {
                var count = this._grid.getItemCount();
                var index = this._grid.getItemIndex(rowKey);

                if((index+1) == count) {
                    return;
                }
                // 한 줄 아래로 이동
                this.moveRow(index, index+1);
            },
            moveUp: function(rowKey) {
                var index = this._grid.getItemIndex(rowKey);

                if(index == 0) {
                    return;
                }
                // 한 줄 위로 이동
                this.moveRow(index, index-1);
            },
            refreshLayout: function() {
                if(this._layoutInitialized === false) {
                    this._layoutInitialized = _setAutoWidthColumn.apply(this, [this._column.getColumns(), true]);
                }
                this._grid.refresh();
            },
            hideColumn: function(columnName) {
                var column = this._grid.columnByName(columnName);
                if(typeof column != "undefined") column.visible = false;
            },
            showColumn: function(columnName) {
                var column = this._grid.columnByName(columnName);
                if(typeof column != "undefined") column.visible = true;
            },
            setColumnItems: function(columnName, values, labels) {
                var column = this._grid.columnByName(columnName);

                if(arguments.length === 2) {
                    var listItems = convertToListItemData(values || []);
                    values = !_.isEmpty(listItems) ? listItems.map(function(item) { return item.value; }) : [];
                    labels = !_.isEmpty(listItems) ? listItems.map(function(item) { return item.text; }) : [];
                }
                column.values = values;
                column.labels = labels;
            },
            setHeaderLayout: function(headerLayout) {
                this._grid.setColumnLayout(headerLayout);
            },
            showToast: function(message, options) {
                var self = this,
                    defaultOptions = {
                    // default 옵션
                    visible: true,
                    message: message,
                    duration: 700,
                    styles: {
                    },
                };
                Object.assign(defaultOptions, options);

                this._grid.showToast(defaultOptions, true);
                setTimeout(function () {
                    if(self && self._grid != null) self._grid.hideToast();
                }, defaultOptions.duration);
            },
            setCheckExclusive: function(exclusive) {
                this._grid.checkBar.exclusive = exclusive;
            },
            duplicateRow: function(rowKey, excludeKeys) {
                var data = this.getFocusData();
                if(!_.isEmpty(excludeKeys)) {
                    excludeKeys.forEach(function(key) {
                        delete data[key];
                    });
                }
                this.insertRow(data.rowKey + 1, data);
            },
            duplicateCurrent: function(excludeKeys) {
                this.duplicateRow(this.getFocusData().rowKey, excludeKeys);
            }
        };

        Object.assign(UstraRealGrid, {
            of: function(grid) {
                if(typeof grid == "string") {
                    grid = RealGrid.getGridInstance(document.getElementById(grid));
                }
                if(grid instanceof HTMLDivElement) {
                    grid = RealGrid.getGridInstance(grid);
                }
                for(var key in _instance) {
                    if (_instance[key]._grid === grid) return _instance[key];
                }
                return null;
            },
            refreshLayout: function() {
                for(var key in _instance) {
                    if (_instance[key] !== null && (_instance[key]._el.offsetWidth > 0 && _instance[key]._el.offsetHeight > 0)) _instance[key].refreshLayout();
                }
            },
            deleteGridProps: function(data) {
                return _.omit(data, ['rowKey', 'rowStatus']);
            },
            getGridErrorMsg: _getGridErrorMsg
        });

        return UstraRealGrid;
    })();
}
