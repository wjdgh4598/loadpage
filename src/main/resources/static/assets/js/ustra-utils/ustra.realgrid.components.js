var UstraRealGridRenderer;
if(typeof UstraRealGridRenderer === "undefined") {
    UstraRealGridRenderer = (function () {

        var CustomButtonLeft = (function() {
            function ClassButton() {
                return this;
            }
            ClassButton.prototype = {
                initContent: function(parent) {
                    this._ustraGrid  = UstraRealGrid.of(this.grid.handler);
                    this._columnInfo = this._ustraGrid._column.getColumn(this._index.column.name);

                    parent.appendChild(this._button = document.createElement("button"));
                    this._button.textContent = this._columnInfo.btnText || "";
                    this._button.className   = this._columnInfo.btnClass || "button is-outline is-primary is-medium";

                    var span = this._span = document.createElement("span");
                    parent.appendChild(span);
                    span.className = "text-content"
                },
                canClick: function(event) {
                    var clickable = false, style;
                    if(typeof this._columnInfo.canClick == "function") {
                        clickable = this._columnInfo.canClick.apply(this._ustraGrid, [this, event]);
                    }
                    else if(typeof this._columnInfo.styleCallback == "function") {
                        style = this._columnInfo.styleCallback.apply(this._ustraGrid, [this.grid.handler, this]);
                        if(style.editable === true) {
                            clickable = true;
                        }
                    }
                    if(clickable === false) {
                        this._button.setAttribute("disabled", true);
                    }
                    else {
                        this._button.removeAttribute("disabled");
                    }
                    return clickable;
                },
                canEdit: function(event) {
                    var editable = false, style;
                    if(typeof this._columnInfo.canEdit == "function") {
                        editable = this._columnInfo.canEdit.apply(this._ustraGrid, [this, event]);
                    }
                    return editable;
                },
                canEditKey: function(event) {
                    var editKey = true;
                    if(typeof this._columnInfo.canEditKey == "function") {
                        editKey = this._columnInfo.canEditKey.apply(this._ustraGrid, [this, event]);
                    }
                    return editKey;
                },
                clearContent: function(dom) {
                    parent.innerHTML = "";
                },
                click: function(event) {
                    if (event.target === this._button && typeof this._columnInfo.onClick == "function") {
                        this._columnInfo.onClick.apply(this._ustraGrid, [this]);
                    }
                },
                render: function(grid, model, width, height, info) {
                    this.canClick();
                    var span = this._span;
                    // text설정.
                    span.textContent = model.value;

                    this._value = model.value;
                }
            };

            return ClassButton;
        })();

        var CustomButton = (function() {
            function ClassButton() {
                return this;
            }
            ClassButton.prototype = {
                initContent: function(parent) {
                    
                    // 2022.12.27 추가 --> button 및 span 태그가 남아있어 계속 추가되는 현상 수정 
                    if(parent.hasChildNodes()){
                        while(parent.hasChildNodes()){
                            parent.removeChild(parent.firstChild);
                        }
                    }

                    this._ustraGrid  = UstraRealGrid.of(this.grid.handler);
                    this._columnInfo = this._ustraGrid._column.getColumn(this._index.column.name);

                    var span = this._span = document.createElement("span");
                    parent.appendChild(span);
                    span.className = "text-content"

                    parent.appendChild(this._button = document.createElement("button"));
                    this._button.textContent = this._columnInfo.btnText || "";
                    this._button.className   = this._columnInfo.btnClass || "button is-outline is-primary is-medium";
                },
                canClick: function(event) {
                    var clickable = false, style;
                    if(typeof this._columnInfo.canClick == "function") {
                        clickable = this._columnInfo.canClick.apply(this._ustraGrid, [this, event]);
                    }
                    else if(typeof this._columnInfo.styleCallback == "function") {
                        style = this._columnInfo.styleCallback.apply(this._ustraGrid, [this.grid.handler, this]);
                        if(style.editable === true) {
                            clickable = true;
                        }
                    }
                    if(clickable === false) {
                        this._button.setAttribute("disabled", true);
                    }
                    else {
                        this._button.removeAttribute("disabled");
                    }
                    return clickable;
                },
                canEdit: function(event) {
                    var editable = false, style;
                    if(typeof this._columnInfo.canEdit == "function") {
                        editable = this._columnInfo.canEdit.apply(this._ustraGrid, [this, event]);
                    }
                    return editable;
                },
                canEditKey: function(event) {
                    var editKey = true;
                    if(typeof this._columnInfo.canEditKey == "function") {
                        editKey = this._columnInfo.canEditKey.apply(this._ustraGrid, [this, event]);
                    }
                    return editKey;
                },
                clearContent: function(dom) {
                    parent.innerHTML = "";
                },
                click: function(event) {
                    if (event.target === this._button && typeof this._columnInfo.onClick == "function") {
                        this._columnInfo.onClick.apply(this._ustraGrid, [this]);
                    }
                },
                render: function(grid, model, width, height, info) {
                    this.canClick();
                    var span = this._span;
                    // text설정. (ie 에서 undefined가 들어가서 3항연산 사용)
                    span.textContent = typeof model.value == "undefined" ? "" : model.value;

                    this._value = typeof model.value == "undefined" ? "" : model.value;
                }
            };

            return ClassButton;
        })();

        var CustomTwoButton = (function() {
            function CustomTwoButton() {
                return this;
            }
            CustomTwoButton.prototype = {
                initContent: function(parent) {
                    this._ustraGrid  = UstraRealGrid.of(this.grid.handler);
                    this._columnInfo = this._ustraGrid._column.getColumn(this._index.column.name);

                    var span = this._span = document.createElement("span");
                    span.className = "span"
                    parent.appendChild(span);
                    parent.appendChild(this._button1 = document.createElement("button"));
                    parent.appendChild(this._button2 = document.createElement("button"));

                    this._button1.textContent = this._columnInfo.btn1Text || "버튼";
                    this._button1.className   = this._columnInfo.btn1Class || "button is-outline is-primary is-medium";
                    this._button2.textContent = this._columnInfo.btn2Text || "버튼";
                    this._button2.className   = this._columnInfo.btn2Class || "button is-outline is-primary is-medium";

                    this._button1.name = "button1";
                    this._button2.name = "button2";
                },
                canClick: function(event) {
                    var clickable = false, style;
                    if(typeof this._columnInfo.canClick == "function") {
                        clickable = this._columnInfo.canClick.apply(this._ustraGrid, [this, event]);
                    }
                    else if(typeof this._columnInfo.styleCallback == "function") {
                        style = this._columnInfo.styleCallback.apply(this._ustraGrid, [this.grid.handler, this]);
                        if(style.editable === true) {
                            clickable = true;
                        }
                    }
                    if(clickable === false) {
                        this._button1.setAttribute("disabled", true);
                        this._button2.setAttribute("disabled", true);
                    }
                    else {
                        this._button1.removeAttribute("disabled");
                        this._button2.removeAttribute("disabled");
                    }
                    return clickable;
                },
                canEditKey: function(event) {
                    var editKey = true;
                    if(typeof this._columnInfo.canEditKey == "function") {
                        editKey = this._columnInfo.canEditKey.apply(this._ustraGrid, [this, event]);
                    }
                    return editKey;
                },
                clearContent: function(dom) {
                    parent.innerHTML = "";
                },
                click: function(event) {
                    if ((event.target === this._button1 || event.target === this._button2)
                        && typeof this._columnInfo.onClick == "function") {
                        this._columnInfo.onClick.apply(this._ustraGrid, [this, event]);
                    }
                },
                render: function(grid, model, width, height, info) {
                    this.canClick();
                    info = info || {};
                    var span = this._span;
                    // text설정. (ie 에서 undefined가 들어가서 3항연산 사용)
                    span.textContent = typeof model.value == "undefined" ? "" : model.value;

                    this._value = typeof model.value == "undefined" ? "" : model.value;
                }
            };

            return CustomTwoButton;
        })();

        var CustomDatePicker = (function() {
            function CustomDatePicker() {
                return this;
            }
            CustomDatePicker.prototype = {
                initContent: function(parent) {
                    this._ustraGrid  = UstraRealGrid.of(this.grid.handler);
                    this._columnInfo = this._ustraGrid._column.getColumn(this._index.column.name);

                    this._datePickerId = this._index.column.name + "_" + this._index.dataRow;
                    var template = document.createElement("template");
                    template.innerHTML = "<div class=\"tui-datepicker-input tui-datetime-input tui-has-focus\">"
                        +   "<input type=\"text\" id=\""+ this._datePickerId +"\" aria-label=\"Date-Time\">"
                        +   "<span class=\"tui-ico-date\"></span>"
                        + "</div>"
                        + "<div style=\"margin-top: -1rem;\"></div>";

                    Ustra._getChildNodes(template).forEach(function(node) {
                        parent.appendChild(node);
                    });

                    this._datePickerEl = document.getElementById(this._datePickerId);
                },
                clearContent: function(dom) {
                    parent.innerHTML = "";
                    if(typeof this._datePicker != "undefined") {
                        this._datePicker._tuiDatePicker && this._datePicker._tuiDatePicker.destroy();
                        this._datePicker._tuiDatePicker = null;
                        this._datePicker = null;
                        delete this._datePicker;
                    }
                },
                canClick: function(event) {
                    return true;
                },
                click: function(event) {
                    if((!this._datePickerEl.hasAttribute("disabled")) && typeof this._datePicker == "undefined") {
                        this._datePicker = new ToastDatePicker("#" + this._datePickerId,
                            _.defaultsDeep({
                                date: (this.index.value && new Date().setDatetime(this.index.value)) || null
                            }, this._columnInfo.editOptions));

                        var self = this;
                        this._datePicker.on("change", function() {
                            var value = self._datePicker._tuiDatePicker.getDate();
                            if(_.isDate(value) && self._columnInfo.editOptions && !_.isEmpty(self._columnInfo.editOptions.format)) {
                                value = value.format(self._columnInfo.editOptions.format);
                            }
                            if(value != self._ustraGrid._grid.getValue(self.index.itemIndex, self.index.dataColumn.fieldName)) {
                                self._ustraGrid._grid.setValue(self.index.itemIndex, self.index.dataColumn.fieldName, value);
                            }
                            self._datePicker._tuiDatePicker.close();
                        });
                        this._datePicker._tuiDatePicker.open();
                    }
                },
                render: function(grid, model, width, height, info) {
                    if(typeof this._datePicker != "undefined") {
                        if(!_.isEmpty(model.value) || _.isDate(model.value)) {
                            this._datePicker.setDate(new Date().setDatetime(model.value));
                        }
                        else {
                            this._datePicker.setNull();
                        }
                        if(typeof this._columnInfo.styleCallback == "function") {
                            var editable = false, style = this._columnInfo.styleCallback.apply(this._ustraGrid, [this.grid.handler, this]);
                            if(style.editable === true) {
                                editable = true;
                            }
                            if(editable) {
                                this._datePicker._tuiDatePicker.enable();
                            }
                            else {
                                this._datePicker._tuiDatePicker.disable();
                            }
                        }
                    }
                    else {
                        var input = document.getElementById(this._datePickerId);
                        if(!_.isEmpty(model.value) || _.isDate(model.value)) {
                            var date = new Date().setDatetime(model.value);
                            this._datePickerEl.value = this._columnInfo.editOptions.format == "yyyy-MM-dd" ? date.format("yyyy-MM-dd") : date.format("yyyy-MM");
                        }
                        if(typeof this._columnInfo.styleCallback == "function") {
                            var editable = false, style = this._columnInfo.styleCallback.apply(this._ustraGrid, [this.grid.handler, this]);
                            if(style.editable === true) {
                                editable = true;
                            }
                            if(editable) {
                                this._datePickerEl.removeAttribute("disabled");
                            }
                            else {
                                this._datePickerEl.setAttribute("disabled", true);
                            }
                        }
                    }
                }
            };

            return CustomDatePicker;
        })();

        return {
            CustomButton: new CustomButton(),
            CustomTwoButton: new CustomTwoButton(),
            CustomDatePicker: new CustomDatePicker()
        };
    })();
}
