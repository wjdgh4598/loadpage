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

// 기본 toast그리드 스타일 설정
Grid.applyTheme('stripped', {
   cell: {
     disabled: {
       text: '#000000'
     }
   }
});

var ToastGrid = (function () {

    function convertTreeData (dataList, id, parent, rootValue) {
        var dataMap = {};
        var treeList = [];
        rootValue = rootValue || '';

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
            if (parentData && !parentData._children) {
                parentData._children = []
            }

            if (parentData) {
                parentData._children.push(data);
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

        return treeList;
    }

    // 그리드 수정데이터 서버에 업데이트
    function updateGridData(url, data, options) {
        $.post(url, data, function(){
            $.alert(options.successMsg || '처리되었습니다.');
            if (options.onSuccess) {
                options.onSuccess();
            }
        }).fail(function(){
            if (options.onError) {
                options.onError();
            }
        });
    }

    function bindGridSearch(grid, options) {
        var $saveButton = $('#' + options.button || 'btnSearch');
        var $searchForm = $('#' + options.searchForm || 'divSearch');

    }

    function bindGridRemove(grid, options) {

        function removeRows(rows) {
            $.each(rows, function(index, row) {
                grid.removeRow(row.rowKey);
            });

            // 등록된 데이터를 삭제한 경우
            if (grid.isModifiedByType('DELETE')) {
                updateGridData(options.url, grid.getRemovedDataJson(options.fieldName),{
                    onSuccess: options.onSuccess,
                    onError: options.onError
                });
            }
            grid.refreshLayout();
            $removeButton.attr('disabled', true);
            if(typeof options.onRemove == 'function') {
                options.onRemove.apply(grid, [grid.isModifiedByType('DELETE')]);
            }
        }

        var $removeButton = $('#' + options.button || 'btnRemoveRow');

        // 삭제버튼 활성화, 비활성화
        grid.on('check', function(gridEvent){
            $removeButton.attr('disabled', false);
        });
        grid.on('uncheck', function(gridEvent){
            var checkedRows = grid.getCheckedRows();
            if (checkedRows.length == 0) {
                $removeButton.attr('disabled', true);
            }
        });
        grid.on('checkAll', function(gridEvent){
            $removeButton.attr('disabled', false);
        });
        grid.on('uncheckAll', function(gridEvent){
            $removeButton.attr('disabled', true);
        });

        // 삭제
        $removeButton.on('click',  function(e) {
            var checkedRows = grid.getCheckedRows();
            if (checkedRows == null || checkedRows.length == 0) {
                return;
            }

            $.confirm('총 ' + checkedRows.length + '건을 삭제하시겠습니까?', '알림', function(){
                removeRows(checkedRows);
            });

        });
    }

    function bindGridSave(grid, options) {
        var $saveButton = $('#' + options.button || 'btnSaveGrid');

        // 저장
        $saveButton.on('click', function(e) {
            var modifiedData = grid.getModifiedDataJson(options.fieldName);
            if (modifiedData == null) {
                return;
            }

            var validationResults = grid.validateIfModified();
            if (validationResults.length > 0) {
                alertToastGridError(grid, validationResults.shift());
                return;
            }

            updateGridData(options.url, modifiedData, {
                successMsg: '저장되었습니다',
                onSuccess: options.onSuccess,
                onError: options.onError
            });
        });
    }

    function bindGridCRUD(grid, crudOptions) {
        if (crudOptions.search) {
            bindGridSave(grid, crudOptions.search);
        }

        if (crudOptions.save) {
            bindGridSave(grid, crudOptions.save);
        }

        if (crudOptions.remove) {
            bindGridRemove(grid, crudOptions.remove);
        }
    }

    function ToastGrid(id, column, options) {
        this._grid = null;
        this._tree = false;
        this._id = id;
        this._column = column;
        this._options = options;
        this._callevents = [];
        return this;
    }
    ToastGrid.instance  = [];
    ToastGrid.prototype = {
        build:function () {
            var id = this._id;
            var options = this._options;
            var columns = this._column.getColumns();
            var disables = this._column.getDisables();
            var events = this._callevents;
            var defaultOption = {
                el: document.getElementById(id),
                columns: columns,
                scrollX: true,
                scrollY: true,
                bodyHeight: 673
            };

            if(ToastGrid.instance.filter(function(grid) { return grid.el.id == id; }).length > 0) {
                ToastGrid.instance.filter(function(grid) {
                    return grid.el.id == id;
                }).forEach(function(grid) {
                    grid.destroy();
                });
            }

            if (!options) {
                options = {};
            }

            if (options.tree) {
                this._tree = options.tree;
                Object.assign(defaultOption, {
                    treeColumnOptions:  {
	                    name: options.tree.treeColumn,
	                    useCascadingCheckbox: (options.tree.useCascadingCheckbox == null ? true : options.tree.useCascadingCheckbox),
	                    useIcon: (options.tree.useIcon == null ? true : options.tree.useIcon),
	                }
                });
            }

            Object.assign(defaultOption, options);
            var rowHeaders = [];

            if (defaultOption.check) {
//                rowHeaders.push('checkbox');
                rowHeaders.push({
                    type: 'checkbox',
                    header:
                      '<label for="all-checkbox-'+id+'" class="checkbox">'+
                        '<input type="checkbox" id="all-checkbox-'+id+'" name="_checked" class="hidden-input">'+
                        '<div tabindex="0" class="input_button" style="border-width: 1rem;"></div>'+
                      '</label>',
                    renderer: CustomCheckboxHeaders
                });
            }

            if (defaultOption.radio) {
                rowHeaders.push({
                    type: 'checkbox',
                    header:
                      '<label for="all-checkbox-'+id+'" class="checkbox">'+
                        '<input type="checkbox" id="all-checkbox-'+id+'" class="hidden-input" name="_checked" />'+
                      '</label>',
                    renderer: CustomRadioHeaders
                });
            }

            if (defaultOption.rownum) {
                rowHeaders.push('rowNum');
            }

            defaultOption.rowHeaders = rowHeaders;

            this._grid = new Grid(defaultOption);

            var gridObject = this._grid;
            for (var idx in disables) {
                this._grid.disableColumn(disables[idx]);
            }

            this._grid.on('click', function(ev) {
                for (var idx in events) {
                    var event = events[idx];
                    event(ev);
                }

            });

            // 그리드에서 mouseleave시 editing 종료(focusout시 editing 오류)
            $('#'+id).on('mouseleave',function(){
            	gridObject.finishEditing();
            });

            // curd 이벤트 바인드
            if (defaultOption.crudOptions) {
                bindGridCRUD(this, defaultOption.crudOptions);
            }
            ToastGrid.instance.push(this._grid);

            return this;
        },
        on: function(eventName, fn) {
            this._grid.on(eventName, fn);
        },
        off:function(eventName, fn){
            this._grid.off(eventName, fn);
        },
        trigger: function(eventName, gridEvent) {
            this._grid.eventBus.trigger(eventName, gridEvent);
        },
        getByteLength: function(s,p,b,i,c) {
            if(typeof p == 'undefined') p = 3;
            for(b=i=0;c=s.charCodeAt(i++);b+=c>>11?p:c>>7?2:1);
            return b;
        },
        export: function(options) {
            var _this = this;
            if(typeof XLSX == 'undefined') {
                var script = document.createElement("script");
                script.setAttribute("src", "/assets/vendors/sheetjs/xlsx.full.min.js");
                script.setAttribute("async", "false");
                script.onload = function () {
                   _this.export(options);
                }

                var head = document.head;
                head.insertBefore(script, head.firstChild);
            }
            else {
                var defaultOptions = {
                    fileName   : 'export.xlsx',
                    sheetName  : 'Data',
                    bodyOnly   : false,
                    visibleOnly: true,
                    hideColumns: [],
                    showColumns: [],
                };

                Object.assign(defaultOptions, options || {});

                var columns = Array.from(this._grid.getColumns());

                columns = columns.filter(function(column) {
                    return (defaultOptions.showColumns.includes(column.name) && !defaultOptions.hideColumns.includes(column.name)) || (defaultOptions.visibleOnly && !column.hidden);
                });

                var wscols = {};
                var data = this.getData();
                var exportData  = [];
                exportData.push(columns.map(function(column) { return column.header; }));
                if(defaultOptions.bodyOnly == false) {
                    for(var i = 0; i < data.length; i++) {
                        var dataItem = [];
                        for(column of columns) {
                            for(key in data[i]) {
                                if(column.name == key) {
                                    dataItem.push(data[i][key] || '');
                                    var curr = _this.getByteLength(String(data[i][key] || ''),2);
                                    wscols[key] = ((wscols[key] || 6) < curr) ? curr : (wscols[key] || 6);
                                }
                            }
                        }
                        exportData.push(dataItem);
                    }
                }
                data = null;

                var ws = XLSX.utils.aoa_to_sheet(exportData, {
                });
                ws["!cols"] = columns.map(function(column) {
                    return {
                        wch: wscols[column.name]
                    };
                });
                exportData = null;

                var wb = XLSX.utils.book_new();
                XLSX.utils.book_append_sheet(wb, ws, defaultOptions.sheetName);
                XLSX.writeFile(wb, defaultOptions.fileName);
                wb = null;
                ws = null;
            }
        },

        appendRow:function(data, optionsParam) {
            var options = {};
            Object.assign(options, optionsParam);
            if(options){
                options.focus = true;
            }
            this._grid.appendRow(data, options);
            return this._grid.getFocusedCell().rowKey;
        },
        appendRows: function(data){
            var grid = this._grid;
            data.forEach(function(row){
                grid.appendRow(row);
            });
        },
        prependRow:function(data, optionsParam) {
        	var options = {};
        	Object.assign(options, optionsParam);
        	if(options){
        		options.focus = true;
        	}
        	this._grid.prependRow(data, options);
        	return this._grid.getFocusedCell().rowKey;
        },
        focus:function(rowKey, columnName, setScroll){
            this._grid.focus(rowKey, columnName, setScroll);
        },
        setFocus:function(row, col) {
            if (!col) {
                col = 0;
            }
            this._grid.focusAt(row, col);
        },
        bind:function(data) {
            if (this._tree) {
                var tree = this._tree;
                data = convertTreeData(data, tree.id, tree.parent, tree.root)
            }
            this._grid.resetData(data);
        },
        load:function(url, param, callback) {
            var self = this;
            if (typeof param == 'function') {
                callback = param;
                param = undefined;
            }
            self.clear();
            if (param) {
                param.perPage = 1;
                param.page = 1;
            }

            self._grid.dispatch('setLoadingState', 'LOADING');
            $.get(url, param, function(data) {
                self.bind(data);
                if(data.length > 0){
                    self._grid.dispatch('setLoadingState', 'DONE');
                	self.setFocus(0);
                } else {
                    self._grid.dispatch('setLoadingState', 'EMPTY');
                }
                if(callback) {
                    callback(data);
                }
                data = null;
            });

        },
        clear:function() {
            this._grid.clear();
        },
        getGrid:function() {
            return this._grid;
        },
        getElement:function(rowKey, columnName) {
            return this._grid.getElement(rowKey, columnName);
        },
        getJson:function(fieldName) {
            return this.toDataJson(fieldName, this._grid.getData());
        },
        getData:function(){
        	var grid = this._grid;
        	var data = grid.getData();
        	return data;
        },
        getDepth:function() {
            var grid = this._grid;
            var rowKey = grid.getFocusedCell().rowKey;
            return grid.getDepth(rowKey);
        },
        getFocusData:function() {
        	var grid = this._grid;
        	var rowKey = grid.getFocusedCell().rowKey;
        	return grid.getRow(rowKey);
        },
        click:function(callback) {
            var grid = this._grid;
            this._callevents.push(function(ev) {
                callback(grid.getRow(ev.rowKey), ev);
            });
        },
     // 2020.06.20 jwl customcheckbox 전체체크,해제
        checkAllCustomCheckbox:function(checkColumnName) {
            var grid = this._grid;
            grid.on('click', function(ev) {
            	if(ev.columnName == checkColumnName){
            		var rowKey = ev.rowKey;
            		var checked = $('input[id="'+checkColumnName+'_checkbox_'+ev.rowKey+'"]').prop('checked');
        			var allCheckValue = checked ? 'Y' : 'N';

                	for(var columInfo of grid.getColumns()){
                		if(columInfo.renderer.type.name == 'CustomCheckBox' && columInfo.name != checkColumnName){
                			grid.setValue(rowKey, columInfo.name, allCheckValue);
                			$('input[id="'+columInfo.name+'_checkbox_'+ev.rowKey+'"]').prop('checked',checked);
                		}
                	}
                	stop();
            	}
            });
        },
        dblClick:function(callback) {
            var grid = this._grid;
            grid.on('dblclick', function(ev) {
                callback(grid.getRow(ev.rowKey), ev);
            });
        },
        cellClick:function(columnName, callback) {
            var grid = this._grid;
            this._callevents.push(function(ev) {
                if (columnName!=ev.columnName) {
                    return;
                }
                var row = grid.getRow(ev.rowKey);
                callback(row[columnName], ev);
            })
        },
        expandAll:function() {
            this._grid.dispatch('expandAll');
        },
        readData:function(page, data, resetData){
            this._grid.readData(page, data, resetData);
        },
        validate:function(){
            return this._grid.validate();
        },
        validateIfModified:function(){
			var modifiedRows = this._grid.getModifiedRows({ withRawData: true });
			var createdRows = modifiedRows.createdRows;
        	var updatedRows = modifiedRows.updatedRows;

        	var modifiedKeys = [];
        	createdRows.forEach(function(row){
				modifiedKeys.push(row.rowKey);
			});
			updatedRows.forEach(function(row){
				modifiedKeys.push(row.rowKey);
			});

			if (modifiedKeys.length == 0) {
				return [];
			}

			var validationResults = this._grid.validate();
			return validationResults.filter(function(row){
				return modifiedKeys.indexOf(row.rowKey) > -1;
			});

        },
        getCheckedRowKeys : function() {
            return this._grid.getCheckedRowKeys();
        },
        getCheckedRows:function(options){
            options = options || {};
            var checkedRows = this._grid.getCheckedRows();
            // rowStatus 추가
            if (checkedRows.length > 0 && options.rowStatus) {
                this.setRowStatus(checkedRows);
            }

            return checkedRows;
        },
        setRowStatus: function(rows) {
            var modifiedData = this._grid.getModifiedRows();
            _setRowStatus(modifiedData.createdRows, 'C');
            _setRowStatus(modifiedData.updatedRows, 'U');
            _setRowStatus(modifiedData.deletedRows, 'D');

            function _setRowStatus(modifiedRows, status) {
                if (modifiedRows.length == 0) return;

	            rows.forEach(function(row){
	                modifiedRows.forEach(function(modifiedRow){
	                   if (row.rowKey == modifiedRow.rowKey) {
	                       row.rowStatus = status;
	                   }
	                });
	            });
            }

            return rows;
        },
        getFocusedCell:function(){
            return this._grid.getFocusedCell();
        },
        getModifiedRows:function(options){
            return this._grid.getModifiedRows(options);
        },
        getRemovedDataJson:function(fieldName){
            var modifiedRows = this._grid.getModifiedRows({ withRawData: true });
            var deletedRows = modifiedRows.deletedRows;
            if (deletedRows.length == 0) {
                return null;
            }

			deletedRows.forEach(function(row){
				row.rowStatus = 'D';
			});

            return this.toDataJson(fieldName, deletedRows);
        },
        getModifiedData: function(options) {
            var modifiedData = this._grid.getModifiedRows(options);
            var createData = modifiedData.createdRows;
            var updateData = modifiedData.updatedRows;
            var deleteData = modifiedData.deletedRows;
            var modified = new Array();

            for(var cData of createData){
                cData.rowStatus = 'C';
                modified.push(cData);
            }
            for(var uData of updateData){
                uData.rowStatus = 'U';
                modified.push(uData);
            }
            for(var dData of deleteData){
                dData.rowStatus = 'D';
                modified.push(dData);
            }
            modified.sort(function(a, b) { return a.rowKey - b.rowKey; });
            return modified;
        },
        getModifiedDataJson:function(fieldName, options){
            var modified = this.getModifiedData(options);
            return this.toDataJson(fieldName, modified);
        },
        toDataJson: function(fieldName, data){
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
        },
        getRow: function(rowKey) {
            return this._grid.getRow(rowKey);
        },
        getRowCount: function() {
            return this._grid.getRowCount();
        },
        getLastRow:function(){
            var rowCount = this._grid.getRowCount();
            if (rowCount == 0) {
                return null;
            }

            return this._grid.getRowAt(rowCount - 1);
        },

        getAncestorRows: function(rowKey) {
            return this._grid.getAncestorRows(rowKey);
        },

        getParentRow: function(rowKey){
            return this._grid.getParentRow(rowKey);
        },

        getChildRows: function(rowKey){
            return this._grid.getChildRows(rowKey);
        },

        setRow: function(rowKey, row) {
            this._grid.setRow(rowKey, row);
        },

        getColumnHeader: function() {
            var columns = this._column.getColumns();
            var results = columns.filter(function(column) {
                    // 히든 컬럼 필터
	                return column.hidden !== true;
		        }).map(function(column){
		            return {
		                header: column.header,
		                name: column.name
		            };
		        });

		    return results;
        },

        getColumnByName:function(columnName) {
            return this._column.getColumns().filter(function(column){ return column.name == columnName; }).pop() || {};
        },

        finishEditing:function(){
        	return this._grid.finishEditing();
        },
        enableRow:function(){
        	return this._grid.enableRow();
        },
        removeRow:function(rowKey, options){
            return this._grid.removeRow(rowKey, options);
        },
        check:function(rowKey){
            this._grid.check(rowKey);
        },
        checkAll:function(allPage){
            this._grid.checkAll(allPage);
        },

        uncheckAll: function(allPage) {
            this._grid.uncheckAll(allPage);
        },


        isModified:function(){
            return this._grid.isModified();
        },

        isModifiedByType:function(type){
            return this._grid.dataManager.isModifiedByType(type);
        },

        expand: function(options){
            var grid = this._grid;
            if (typeof options === 'object') {
	            var rows = grid.findRows(options);
	            rows.forEach(function(row){
	                grid.expand(row.rowKey);
	            });
            } else {
                grid.expand(options);
            }

        },

        findRows: function(options) {
            return this._grid.findRows(options);
        },

        disableRowCheck: function(rowKey) {
            this._grid.disableRowCheck(rowKey);
        },

        moveRow: function(rowKey, targetIndex) {
            this._grid.moveRow(rowKey, targetIndex);
        },
        moveDown: function(rowKey) {
            var lastRow = this.getLastRow();
            if (rowKey === lastRow.rowKey) {
                return
            }
            var currentRow = this.getRow(rowKey);
            // 한 줄 아래로 이동
            this.moveRow(rowKey, currentRow._attributes.rowNum)
        },
        moveUp: function(rowKey) {
            var currentRow = this.getRow(rowKey);
            if (currentRow._attributes.rowNum === 1) {
                return;
            }
            // 한 줄 위로 이동
            this.moveRow(rowKey, currentRow._attributes.rowNum - 2)
        },

        refreshLayout: function() {
//            var width = Number(document.getElementById(this._id).clientWidth);
//            if(width != 0) {
//                this._grid.setWidth(width);
//            }
            this._grid.refreshLayout();
        },
        hideColumn: function(columnName) {
            this._grid.hideColumn(columnName);
        },
        showColumn: function(columnName) {
            this._grid.showColumn(columnName);
        }
    };
    return ToastGrid;
})();


var ToastColumn = (function () {

    function ToastColumn() {
        this._columnList = [];
        this._disables = [];
        return this;
    }

    function _checkVariable(width, readonly, options) {
        if (typeof width == 'object') {
        	var returnData = {options:width};
        	if(typeof readonly == 'boolean'){
        		returnData.readonly = readonly;
        	}
            return returnData;
        }

        if (typeof readonly == 'object') {
            return {width:width, options: readonly};
        }

        return {width:width, readonly: readonly, options:options};
    }

    ToastColumn.prototype = {
        add:function(id, label, width, readonly, options) {
            var editOptions = null;
            var renderer = null;
            var type = null;
            var formatter = null;

            if ($.isArray(id)) {
                var that = this;
                id.forEach(function(col){
                    that.add(col);
                });
                return this;

            } else if (typeof id == 'object') {
                var column = id;
                if (column.options) {
                    options = column.options;
                } else {
                    options = column;
                }

                id = column.id;
                label = column.label;
                width = column.width;
                readonly = column.readonly;
                editOptions = column.editOptions;
                type = column.type;
                renderer = column.renderer;
                formatter = column.formatter;
            }

            if (typeof width == 'object') {
                options = width;
                type = options.type;
                formatter = options.formatter;
                width = options.width;
                readonly = options.readonly;
                editOptions = options.editOptions;
            }

            if (typeof width == 'boolean') {
                if (typeof readonly == 'object') {
                    options = readonly;
                }
                readonly = width;
                width = undefined;
            }

            if (typeof readonly === 'object') {
                options = readonly;
                readonly = undefined;
            }

            if (typeof options === 'boolean') {
                options = options;
            }

            if (typeof options === 'object') {
                options = options;
            }

            var sortable = (options === null || options === undefined) ? true :
                           (typeof options === 'boolean') ? options :
                           (options.sortable === null || options.sortable === undefined) ? true : options.sortable;
            var column = {
                name: id,
                header: label,
                width: width,
                editor:{},
                sortable: sortable // 2020.05.19 jwl sort 추가
            }

            if(editOptions){
                // 커스텀 인풋 사용
                if (editOptions.maxLength) {
                    type = CustomTextEditor;
                }

                // 달력 기간 제한, thymeleaf에서 new Date();를 사용할 수 없어 스크립트로 변경
                if (editOptions.range && editOptions.range.length == 2) {
                    var rangeForm = parseDate(editOptions.range[0]);
                    var rangeTo = parseDate(editOptions.range[1]);

                    editOptions.selectableRanges = [[ rangeForm, rangeTo ]];
                }

                // select, check, radio 데이터변환
                if ($.isArray(editOptions.listItems)) {
                    editOptions.listItems = this.convertToListItemData(editOptions.listItems);
                    type = editOptions.type;
                    delete editOptions.type;
                }

                column.editor.options = editOptions;

            }

            column.editor.type = type

            if(formatter){			// 2020.05.21 jwl numberformat 추가
                column.formatter = formatter;
            }

            if(renderer){			// 2020.05.19 jwl renderer 추가
                column.renderer = renderer;
                if(typeof renderer != 'function' || renderer.name.indexOf('Renderer') == -1) {
                    /*
                     * Custom으로 에디터와 렌더러 동시 지정 시
                     * 렌더러는 Suffix로 Renderer를 붙여서 작성이 필요함
                     */
                    delete column.editor;
                }
            } else if (options && options.link) {
                column.renderer = {
                    type: CustomLinkCell,
                    options: options
                };
            }

            Object.assign(column, options);
//            if (readonly == true) {
//                this._disables.push(id);
//            }
            if(column.editor && _.isEmpty(column.editor.type)) {
                delete column.editor;
            }
            this._columnList.push(column);
            return this;
        },
        addDate:function(id, label, width, readonly, options, langu) {
			if (langu === null || langu === undefined) langu = 'ko';
            var column = {
                id:id,
                label:label,
                width:width,
                readonly:readonly,
                options:options,
                type:'datePicker',
                editOptions:{format:'yyyy-MM-dd', language:langu},
                formatter:function({value}){
                    return value ? moment(value).format('YYYY-MM-DD') : null;
                }
            };
            return this.add(column);
        },
        addMonth:function(id, label, width, readonly, options, langu) {
			if (langu === null || langu === undefined) langu = 'ko';
            var column = {
                id:id,
                label:label,
                width:width,
                readonly:readonly,
                options:options,
                type:'datePicker',
                editOptions:{format:'yyyy-MM', type:'month', language:langu},
                formatter:function({value}){
                    return value ? moment(value).format('YYYY-MM') : null;
                }
            };
            return this.add(column);
        },
        /*
		 * addCheck:function(id, label, width, readonly, options) { var column = {
		 * id:id, label:label, width:width, readonly:readonly, options:options,
		 * type:'checkbox' }; return this.add(column); },
		 */
        addSelect:function(id, label, width, readonly, options) {
            var variables = _checkVariable(width, readonly, options);
            options = variables.options;
            var column = {
                id:id,
                label:label,
                width:variables.width,
                readonly:variables.readonly,
                options:variables.options,
                formatter: 'listItemText',
                type: CustomSelectBox,
                editOptions: {
                    type: CustomSelectBox,
                    listItems: options.editOptions && options.editOptions.listItems || []
                }
            };
            delete options.listItems;
            return this.add(column);
        },
        addTextArea:function(id, label, width, readonly, options) {
            /*
             * 2020-11-24 juhyeon Textarea 입력창 추가
             */
            var column = {
                id:id,
                label:label,
                width:width,
                readonly:readonly,
                options:options,
                type: CustomTextArea,
                editor: {
                    type: CustomTextArea,
                    editOptions: {
                        type: 'text'
                    }
                },
                renderer: CustomTextAreaRenderer
            };
            return this.add(column);
        },
        addNumber:function(id, label, width, readonly, options) {	// 2020.05.21
																	// jwl
																	// number 추가
            var column = {
                id:id,
                label:label,
                width:width,
                readonly:readonly,
                options:options,
                formatter:function({value}){
                    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
                }
            };
            return this.add(column);
        },
        addToggle:function(id, label, width, readonly, options) {	// 2020.05.19
																	// jwl
																	// renderer
																	// 추가
            var column = {
                id:id,
                label:label,
                width:width,
                readonly:readonly,
                options:options,
                renderer:{
                    type: CustomToggle,
                    options: options.toggleOptions
                }
            };
            return this.add(column);
        },
        addButton:function(id, label, width, readonly, options) {	// 2020.05.24
																	// jwl
																	// renderer
																	// 추가
            var column = {
                id:id,
                label:label,
                width:width,
                readonly:readonly,
                options:options,
                renderer:{
                    type: CustomButton,
                    options: options.buttonOptions
                }
            };
            return this.add(column);
        },
        addTwoButton:function(id, label, width, readonly, options) {	// 2020.05.25
																		// jwl
																		// renderer
																		// 추가
            var column = {
                id:id,
                label:label,
                width:width,
                readonly:readonly,
                options:options,
                renderer:{
                    type: CustomTwoButton,
                    options: options.buttonOptions
                }
            };
            return this.add(column);
        },
        addSearchButton:function(id, label, width, readonly, options) {
            /*
             * 2020-11-24 juhyeon 검색아이콘 버튼 추가
             */
            options.buttonOptions = options.buttonOptions || {};
            options.buttonOptions.icon = 'search';
            var column = {
                id:id,
                label:label,
                width:width,
                readonly:readonly,
                options:options,
                renderer:{
                    type: CustomButton,
                    options: options.buttonOptions
                }
            };
            return this.add(column);
        },

        addCheck:function(id, label, width, readonly, options) {		// 2020.06.20 jwl addCheck추가
        	var variables = _checkVariable(width, readonly, options);
            options = variables.options;
            if(!options) {
                options = {
                    align : 'center'
                };
            }
        	var column = {
                id:id,
                label:label,
                width:variables.width,
                readonly:variables.readonly,
                options:options,
                renderer:{
                    type: CustomCheckBox
                }
            };
            return this.add(column);
        },
        getColumns:function() {
            return this._columnList;
        },
        getDisables:function() {
            return this._disables;
        },
        convertToListItemData: function(listItemList) {
            return listItemList.map(function(item){
                item.text  = item.text || item.cmmCodNm || item.coNm;
                item.value = item.value || item.cmmCodCl || item.coId;
                return item;
            });
        }
    };
    return ToastColumn;
})();


/**
 * 그리드 입력 에러 알림
 */
function alertToastGridError(grid, result) {
    var rowKey = result.rowKey;
    var errors = result.errors;
    // 하나의 컬럼에 에러가 여러 개일 수 있음, 첫 번째 에러 항목만 알림
    var firstError = errors[0];
    var columnName = firstError.columnName;
    var errorCode = firstError.errorCode;

    var alertMsg = getGridErrorMsg(grid, columnName, errorCode[0]);
    $.alert(alertMsg, '에러', function(){
        grid.focus(rowKey, columnName, true);
    });
}

var ERROR_MSG_MAP = {
    REQUIRED: '${header} 필수 값입니다.',
    VALIDATOR_FN: '${header} 확인해주세요.',
    TYPE_NUMBER: '${header} 확인해주세요.(숫자입력)',
    UNIQUE: '중복된 값입니다.'
};

/**
 * 그리드 입력 에러 메세지 리턴
 */
function getGridErrorMsg(grid, columnName, errorCode) {
    var column = grid.getColumnByName(columnName);
    var header = column.header || columnName;
    if (errorCode == 'REQUIRED') {
        header = addProperJosa(header, '은');
    } else {
        header = addProperJosa(header, '를');
    }

    var errorMsg = (ERROR_MSG_MAP[errorCode] || errorCode).replace('${header}', header);
    return errorMsg.trim();
}

/**
 * Toast grid validators
 */
var ToastGridValidators = (function () {
    return {
        phone: function(value, row, columnName) {
            if (_.isEmpty(value)) {
                return true;
            }

            return checkPhone(value);
        },
        num: function(value, row, columnName) {
            if (_.isEmpty(value)) {
                return true;
            }

            value = _.parseInt(value);
            if (_.isNaN(value)) {
                return false;
            }

            return _.isNumber(value);
        },
    };
})();

/**
 * Toast grid formatters
 */
var ToastGridFormatters = (function () {
    return {
        num: function(data) {
            var row = data.row;
            var column = data.column;
            var value = data.value;

            return addComma(value);
        },
        money: function(data) {
            var row = data.row;
            var column = data.column;
            var value = data.value;

            if (isEmpty(value)) {
                return '';
            }

            return addComma(value) + '원';
        },
        phone: function(data) {
            var row = data.row;
            var column = data.column;
            var value = data.value;

            return formatPhoneNum(value);
        }
    };
})();