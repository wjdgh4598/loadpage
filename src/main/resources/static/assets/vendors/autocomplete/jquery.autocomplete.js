(function($){

    $.fn.autocomplete = function(options) {
        var _this = $.extend({
            type: "text",
            level: "soft", //soft: 단순 검색, hard: 한글 검색
            ul: null,
            itemCallback: null,
            onClick: null,
            onEnter: null
        }, options);

        var that = this;

        this.init = function() {
            _this.$list = $(options.ul || "<ul></ul>");
            _this.$list.addClass("input-select").addClass("autocomplete");
            that.hide();

            _this.inputText = $(this).addClass("active");
            _this.inputText.after(_this.$list);

            this.eventSetting();
        };

        this.eventSetting = function() {
            _this.inputText.on("focusin", function() {
                if(_this.inputText.hasClass("active") && _this.inputText.attr("key") == undefined) {
                    that.filterApply(_this.inputText.val());

                    _this.inputText.removeAttr("key");
                    _this.$list.find("li.focus").removeClass("focus");
                    that.show();
                }
            });

            _this.inputText.on("keydown", function(e) {
                if(e.keyCode == 38) {//arrow up
                    var $li = _this.$list.find("li:visible");
                    if($li.length > 0) {
                        if($li.filter(".focus").length == 0) {
                            _this.inputText.attr("key", _this.inputText.val());
                            var key = $li.last()
                                .addClass("focus")
                                .attr("key");

                            _this.$list.scrollTop(_this.$list.scrollTop() + $li.filter(".focus").position().top);
                            _this.inputText.val(key);
                        }
                        else {
                            if($li.filter(".focus").is(":first-child")) {
                                $li.filter(".focus").removeClass("focus");
                                _this.inputText.val(_this.inputText.attr("key"));
                                _this.inputText.removeAttr("key");
                            }
                            else {
                                var key = $li.filter(".focus")
                                    .removeClass("focus")
                                    .prevAll(":visible:first")
                                    .addClass("focus")
                                    .attr("key");

                                _this.$list.scrollTop(_this.$list.scrollTop() + $li.filter(".focus").position().top - _this.$list.height()/2 + $li.filter(".focus").height()/2);
                                _this.inputText.val(key);
                            }
                        }
                        return false;
                    }
                }
                else if(e.keyCode == 40) {//arrow down
                    var $li = _this.$list.find("li:visible");
                    if($li.length > 0) {
                        if($li.filter(".focus").length == 0) {
                            _this.inputText.attr("key", _this.inputText.val());
                            var key = $li.first()
                                .addClass("focus")
                                .attr("key");
                            _this.inputText.val(key);
                        }
                        else {
                            if($li.filter(".focus").is(":last-child")) {
                                $li.filter(".focus").removeClass("focus");
                                _this.inputText.val(_this.inputText.attr("key"));
                                _this.inputText.removeAttr("key");
                                _this.$list.scrollTop(0);
                            }
                            else {
                                var key = $li.filter(".focus")
                                    .removeClass("focus")
                                    .nextAll(":visible:first")
                                    .addClass("focus")
                                    .attr("key");

                                _this.$list.scrollTop(_this.$list.scrollTop() + $li.filter(".focus").position().top - _this.$list.height()/2 + $li.filter(".focus").height()/2);
                                _this.inputText.val(key);
                            }
                        }
                        return false;
                    }
                }
            });

            _this.inputText.on("keyup", function(e) {
                if(e.keyCode == 13) {
                    _this.$list.find("li.focus").removeClass("focus").trigger("click");
                    _this.inputText.removeAttr("key");
                    that.hide();
                    if(typeof _this.onEnter == "function") {
                        _this.onEnter.apply(_this, [this]);
                    }
                    return;
                }
                else if(e.keyCode == 8) {
                    _this.$list.find("li.focus").removeClass("focus");
                    _this.inputText.removeAttr("key");
                }

                if(_this.inputText.hasClass("active")) {
                    if(_this.inputText.attr("key") == undefined) {
                        that.filterApply(_this.inputText.val());
                    }
                }
            });

            //리스트 항목 선택
            _this.$list.on("click", "li", function() {
                _this.inputText.val(that.removeExtra($(this).attr("key"))).trigger("change");
                that.hide();
                if(typeof _this.onClick == "function") {
                    _this.onClick.apply(_this, [this]);
                }
            });

            $(document).on("click.autocomplete-".concat(_this.inputText.attr("id")), function (e) {
                if (!_this.inputText.hasClass("active") || $(e.target)[0] === _this.inputText[0] || $(e.target).closest('.autocomplete')[0] === _this.$list[0]) {
                    return;
                }

                if (($(e.target)[0] === _this.$list[0] || $(e.target).closest('.autocomplete')[0] !== _this.$list[0]) && _this.isOpen) {
                    that.hide();
                }
            });
        };

        this.show = function() {
            setTimeout(function() {
                _this.inputText.parent().addClass('is-active');
                // _this.$list.show();
                _this.isOpen = true;
            }, 200);
        }

        this.hide = function() {
            setTimeout(function() {
                _this.inputText.parent().removeClass('is-active');
                // _this.$list.hide();
                _this.inputText.blur();
                _this.isOpen = false;
            }, 200);
        }

        this.removeExtra = function(value) {
            if(_this.type == "text") {
                return value;
            }
            else if(_this.type == "number") {
                return value.replace(/[^0-9]/g,"");
            }
        };

        this.filterApply = function(value) {
            var rows = [];
            if(_this.level == "soft") {
                rows = _this.data.filter(function(v) {
                    return that.removeExtra(v.value).indexOf(value) != -1;
                });
            }
            else if(_this.level == "hard") {
                rows = _this.data.filter(function(v) {
                    return that.removeExtra(v.value).indexOf(value) != -1 || Hangul.search(v.value, value) >= 0;
                });
            }
            if(typeof _this.itemCallback === "function") {
                _this.value = value;
                rows = rows.map(_this.itemCallback.bind(_this));
            }
            else {
                rows = rows.map(function(v) {
                    return '<li key="'+v.value+'">'+v.txt+'</li>';
                });
            }
            _this.$list.html(rows.join(""));
        };

        /**
         * [{
         *     value: "",
         *     txt  : ""
         * }]
         */
        this.setData = function(data, callback) {
            _this.data = data;
            // _this.data = data.map(function(v) {
            //     return JSON.stringify(v, ["value","txt"]);
            // });
            // _this.data = _this.data.filter(function(v1, i) {
            //     return i === _this.data.findIndex(function(v2) {
            //         return v1 === v2;
            //     });
            // }).map(function(v) {
            //     return JSON.parse(v);
            // });
            _this.$list.empty();
            if(_this.data.length > 0) {
                _this.$list.html(_this.data.map(function(v) {
                    return '<li key="'+v.value+'">'+v.txt+'</li>';
                }));
                _this.inputText.addClass("active");
            }
            else {
                _this.inputText.removeClass("active");
            }

            if(typeof callback == "function") {

            }
        };

        this.init();

        return this;
    };

})(jQuery);