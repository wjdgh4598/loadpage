let ToastDatePicker = (function() {
    /*
     * new ToastDatePicker({
     *     date: {Date},          // default new Date()
     *     language: {String},    // default "ko"
     *     input: {
     *         element: {String},
     *         format: {String}   // default "yyyy-MM-dd"
     *     },
     *     timePicker: {Boolean}, // default false
     *     openers: {Array}       // default calendar icon Element
     * });
     */
    function ToastDatePicker(selector, options) {
        if(arguments.length == 1) {
            if(Object.prototype.toString.call(arguments[0]) == "[object Object]") {
                options  = arguments[0];
                selector = undefined;
                if(typeof options.input.element == "string") {
                    selector = options.input.element;
                }
            }
            else {
                throw "arguments error";
            }
        }
        if(typeof selector == "undefined") {
            throw "arguments error";
        }
        this._tuiDatePicker = null;
        this._el = document.querySelector(selector);
        this._id = this._el.id;

        if(this._el.tagName == "INPUT") {
            //selector가 datePicker input
            this._wrapper = this._el.parentNode.nextElementSibling;
        }
        else {
            //selector가 wrapper
            this._wrapper = this._el;
            this._el      = this._el.previousElementSibling.querySelector("[aria-label=\"Date-Time\"]");
        }
        this._opener = this._el.nextElementSibling;

        this._defaultOptions = {
            date: new Date(),
            language: "ko",
            input: {
                element: this._el,
                format: "yyyy-MM-dd"
            },
            timePicker: false,
            openers: [this._opener],
            usageStatistics: false
        };

        this._defaultOptions = _.defaultsDeep(options, this._defaultOptions);
        if(this._defaultOptions.type === "year") {
            this._defaultOptions.input.format = "yyyy";
        }
        else if(this._defaultOptions.type === "month") {
            this._defaultOptions.input.format = "yyyy-MM";
        }

        if(typeof this._defaultOptions.timePicker != "undefined" && this._defaultOptions.timePicker !== false) {
            this._defaultOptions.timePicker = {
                inputType: "selectbox", // spinbox
                format: "hh:mm"
            };
        }
        this._tuiDatePicker = new DatePicker(this._wrapper, this._defaultOptions);
        this._el.datePicker = this;
        if(this._el.disabled) {
            this._tuiDatePicker.disable();
        }

        return this;
    }
    ToastDatePicker.prototype = {
        on: function(ev, fn) {
            this._tuiDatePicker.on(ev, fn);
        },
        off: function(ev) {
            this._tuiDatePicker.off(ev);
        },
        setDate: function(date) {
            this._tuiDatePicker.setDate(date);
        },
        setNull: function() {
            this._tuiDatePicker.setNull();
        }
    };

    return ToastDatePicker;
})();

let ToastDateRangePicker = (function() {
    /*
     * new ToastDatePicker({
     *     date: {Date},          // default new Date()
     *     language: {String},    // default "ko"
     *     input: {
     *         element: {String},
     *         format: {String}   // default "yyyy-MM-dd"
     *     },
     *     timePicker: {Boolean}, // default false
     *     openers: {Array}       // default calendar icon Element
     * });
     */
    function ToastDateRangePicker(startSelector, endSelector, options) {
        if(typeof startSelector == "undefined" || typeof endSelector == "undefined") {
            throw "arguments error";
        }
        options = options || {};

        this._tuiDateStartPicker = null;
        this._startId = startSelector;
        this._startEl = document.querySelector(startSelector);

        this._tuiDateEndPicker = null;
        this._endId = startSelector;
        this._endEl = document.querySelector(endSelector);

        if(this._startEl.tagName == "INPUT") {
            //selector가 datePicker input
            this._startWrapper = this._startEl.nextElementSibling.nextElementSibling;
        }
        else {
            //selector가 wrapper
            this._startWrapper = this._startEl;
            this._startEl      = this._startEl.previousElementSibling.previousElementSibling;
        }
        this._startOpener = this._startEl.nextElementSibling;

        if(this._endEl.tagName == "INPUT") {
            //selector가 datePicker input
            this._endWrapper = this._endEl.nextElementSibling.nextElementSibling;
        }
        else {
            //selector가 wrapper
            this._endWrapper = this._endEl;
            this._endEl      = this._endEl.previousElementSibling.previousElementSibling;
        }
        this._endOpener = this._endEl.nextElementSibling;

        this._startOptions = {
            date: options.startDate || new Date(),
            //date: options.startDate,
            input: this._startEl,
            container: this._startWrapper
        };
        this._endOptions = {
            //date: options.startDate || options.endDate ||  new Date(),
            date: options.endDate || new Date(),
            //date: options.endDate ,
            input: this._endEl,
            container: this._endWrapper
        };

        this._defaultOptions = {
            startpicker: this._startOptions,
            endpicker: this._endOptions,

            language: "ko",
            format: "yyyy-MM-dd",
            timePicker: false,
            usageStatistics: false
        };
        this._defaultOptions = _.defaultsDeep(options, this._defaultOptions);
        if(this._defaultOptions.type === "year") {
            this._defaultOptions.format = "yyyy";
        }
        else if(this._defaultOptions.type === "month") {
            this._defaultOptions.format = "yyyy-MM";
        }

        if(typeof this._defaultOptions.timePicker != "undefined" && this._defaultOptions.timePicker !== false) {
            this._defaultOptions.timePicker = {
                inputType: "selectbox", // spinbox
                format: "hh:mm"
            };
        }

        this._tuiDateRangePicker = DatePicker.createRangePicker(this._defaultOptions);

        this._startEl.dateRangePicker = this;
        this._endEl.dateRangePicker = this;

        if(this._startEl.disabled) {
            this._tuiDateRangePicker.getStartpicker().disable();
        }
        if(this._endEl.disabled) {
            this._tuiDateRangePicker.getEndpicker().disable();
        }


        this._startOpener.addEventListener("click", function() {
            this._tuiDateRangePicker.getStartpicker().open();
        }.bind(this));

        this._endOpener.addEventListener("click", function() {
            this._tuiDateRangePicker.getEndpicker().open();
        }.bind(this));

        return this;
    }
    ToastDateRangePicker.prototype = {
        setStartDate: function(date) {
            this._tuiDateRangePicker.getStartpicker().setDate(date);
        },
        setEndDate: function(date) {
            this._tuiDateRangePicker.getEndpicker().setDate(date);
        },
        on: function(ev,fn){
            this._tuiDateRangePicker.on(ev,fn);
        },
    };

    return ToastDateRangePicker;
})();
