var orgUtil = {
    /**
     * INOrg를 생성
     * @param   {object}    orgID           INOrg#이 생성되는 객체
     * @param   {String}    div_width       너비
     * @param   {String}    div_height      높이
     */
    create: function (orgID, div_width, div_height, orgDivID, prop) {
        var org;

        /**
         * 외부 프레임워크안에 조직도 객체 생성시, 캘린더/드롭다운 객체가 조직도 보다
         * 뒤에 표시되는 문제가 있어서 z-Index를 1로 설정하도록 구성함.
         */
        $('<div/>', {
            id: orgID,
            style: 'width: ' + div_width + ';' +
                'height: ' + div_height + ';' +
                'z-Index: 1;'
        }).appendTo('#' + orgDivID);

        this.org = org = this.initINOrg(orgID, prop);;

        return org;
    },
    /**
     * 속성별 타입 또는 벨리데이션 처리를 위해서는
     * config를 고도화 하여야 한다. 필요하면 진행
     */
    setOrgProp: function (target, source) {
        var that,
            key, value;

        that = this;

        if (typeof target === "undefined") {
            target = {};
        }

        for (key in source) {

            value = source[key];

            if (typeof value === "object") {
                if (Object.prototype.toString.call(value) === '[object Array]') {
                    target[key] = value;
                } else {
                    if (!target[key]) {
                        target[key] = {};
                    }
                    target[key] = that.setOrgProp(target[key], value);
                }
            } else {
                if (typeof target[key] === "undefined") {
                    target[key] = value;
                }
            }
        }

        return target;
    },
    initINOrg: function (orgID, prop) {
        var that,
            event;

        that = this;
        event = {
            onDebugMsg: function (evt) {},
            onServerMsg: function (evt) {},
            onSearchEnd: function (evt) {},
            onDiagramLoadEnd: function (evt) {},
            onExpandButtonClick: function (evt) {},
            onClick: function (evt) {},
            onMouseUp: function (evt) {}
        };

        prop = that.setOrgProp(prop, inapp.config.option);

        prop.event = event;

        return createINOrg(orgID, prop);
    },
    hookOrgEvent: function (org, targets) {
        var that,
            name,
            behavior;

        that = this;

        for (name in targets) {
            behavior = org.options.event[name];
            org.options.event[name] = (function (func, _behavior, that) {
                return function (evt) {
                    (_behavior) && (_behavior(evt));
                    func(evt, that);
                };
            })(targets[name], behavior, that);
        }
    },
    zoomToFit: function (prop) {
        this.org.scale("fith");
    },
    zoomFit: function (prop) {
        this.org.scale("fit");
    },
    zoomIn: function (prop) {
        this.org.zoomIn();
    },
    zoomOut: function (prop) {
        this.org.zoomOut();
    },
    zoomReset: function (prop) {
        this.org.scale(1);
    },

    node2Json: function (node) {
        var res = {},
            data,
            prop;

        data = node.fields().toJSON();

        for (prop in data) {
            res[prop] = (data[prop].value || "");
        }

        return res;
    },

    /**
     * inorg 엑셀 다운로드
     */
    saveAsExcel: function (org, opt) {
        var that;

        that = this;
        opt = opt || {};

        org.saveAsExcel({
            filename: (opt.filename || "inorg"),
            showGridLines: false,
            fontFamilyConverter: function () {
                return "Malgun Gothic";
            },
            startSave: function (evt) {
                incmm.util.showLoading();

                if (typeof opt.startSave === "function") {
                    opt.startSave(evt);
                }
            },
            endSave: function (evt) {
                incmm.util.hideLoading();

                if (typeof opt.endSave === "function") {
                    opt.endSave(evt);
                }
            }
        });
    },

    /**
     * inorg 이미지 다운로드
     */
    saveAsImage: function (org, opt) {
        var that;

        that = this;
        opt = opt || {};

        that.org.saveAsImage({
            filename: (opt.filename || "inorg"),
            backgroundColor: "white",
            startSave: function (evt) {
                incmm.util.showLoading();

                setTimeout(function () {
                    incmm.util.hideLoading();
                }, 3000);
            },
        });
    }
};