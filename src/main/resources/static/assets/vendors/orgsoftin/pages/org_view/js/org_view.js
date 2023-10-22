inapp.add("org_view", {
    msg: {
        dual2: "겸"
    },
    url: {
        checkbox: "/assets/vendors/orgsoftin/lib/softin/images/chk{x}.png",
        checkbox2: "/assets/vendors/orgsoftin/lib/softin/images/chka{x}.png"
    },
    cfg: {
        color: ['#101566', '#232B99', '#005174', '#0070C0', '#8389E0', '#AAAEEB', '#60C5F1', '#94D8F6', '#7A297B', '#C785C8', '#DAAADB', '#595959']
    },
    resize: function () {
        var top = $('.card').height() + 5;
        var h = $(window).height() - top;
        $("#article-wrapper").height(h);
    },
    init: function () {
        var that;

        that = this;
        that.cfg.nodeTemplate = node_template;

        that.resize();
        that.bindUI();
        that.createOrg();
    },
    actionMap: {
        "idx": {
            "window_resized": function () {
                var that = this,
                    org;

                org = that.org || {};

                if (typeof org.requestUpdate === "function") {
                    org.requestUpdate();
                }
            }
        },
        "option_tool": {
            "check_include_member": function (prop) {
                var that = this;
                that.loadData();
            },
            "check_emp_compare": function (prop) {
                var that = this;
                var org = that.org;
                var isShow = prop.chk;
                var empId;
                var node;
                var checkValue;

                org.nodes().foreach(function () {
                    node = this;
                    empId = $.trim(node.fields('empId').value());
                    dualYn = node.fields("dualYn").value();

                    // empId 없거나 겸직인 경우 비교하지 못함
                    if (empId && dualYn !== "Y") {
                        if (!isShow) {
                            checkValue = 0;
                            node.fields("cmpValue").value(checkValue);
                            node.fields("cmpYn").value(that.url.checkbox.replace(/{x}/g, checkValue));
                        }

                        node.fields('cmpYn').style('display', isShow);
                    }
                });
            },
            "design_change": function (prop) {
                var that = this;
                var org = that.org;
                var templateName = prop.data.design;
                var includeMember = $("input:checkbox[id='check-include-member']").is(":checked");

                if (includeMember) {
                    templateName += "List";
                }

                org.nodes().template(templateName);
                org.nodes().root().center(100);
            }
        },
        "data_manage": {
            "org_data_loaded": function (prop) {
                var that = this;
                that.cfg.orgData = prop.data.orgData;
                that.loadData();
            }
        }
    },
    bindUI: function () {
        var that = this;

        $("#org-sidebar").on("transitionend", function () {
            that.org.requestUpdate();
        });
    },

    /**
     * INORG 객체 생성
     */
    createOrg: function () {
        var that = this;

        if (typeof that.org !== "undefined") {
            return;
        }

        var opt = {};

        that.org = orgUtil.create("viewOrg", "100%", "100%", "org-view", opt);
        that.bindUIOrg();

        inapp.raise(that.name, {
            action: "org_created",
            org: that.org
        });
    },

    /**
     * INORG 이벤트 바인딩
     */
    bindUIOrg: function () {
        var that;

        that = this;

        orgUtil.hookOrgEvent(that.org, {
            onDebugMsg: function (evt) {
                if (evt.type === "error") {
                    console.log("onDebugMsg", evt.type, evt.msg);
                }
            },
            onDiagramLoadEnd: function (evt) {
                evt.org.nodes().root().center(10);
            },
            onClick: function (evt) {
                if (!evt.key || evt.which === 3) {
                    return;
                }

                var isCompare = $("#check-emp-compare-list").is(":checked");
                var node = evt.member || evt.node;

                if (evt.binding === 'cmpYn' ||
                    (isCompare && (evt.binding === 'empPhoto' || evt.binding === 'empNm'))) {
                    that.nodeCompareCheckAction(node);
                }
            }
        });
    },

    /**
     * 조직도 로드 데이터 구성
     */
    makeOrgData: function (data) {
        var that = this;
        var orgData = [];
        var i;
        var row;
        var unit;
        var len;

        data = JSON.parse(JSON.stringify(data));

        for (i = 0, len = data.length; i < len; i++) {
            row = data[i];

            unit = that.makeNodeData(row);
            if (unit) {
                for (j = 0; j < unit.length; j++) {
                    orgData.push(unit[j]);
                }
            }
        }

        return orgData;
    },

    makeNodeData: function (data) {
        var that = this;
        var nodeData = [];
        var unit;
        var templateName;
        var members;
        var member;
        var templateName = $("#select-design").val();
        var includeMember = $("input:checkbox[id='check-include-member']").is(":checked");

        if (includeMember) {
            templateName += "List";
        }

        var colorMap = that.cfg.color;

        var makeData = function (data, isMember) {
            var i;
            var len;
            var unit = {};
            var res = [];
            var lv;

            for (i = 0, len = data.length; i < len; i++) {
                row = data[i];

                unit = {};
                unit.layout = {};

                lv = row.orgLv - 0;
                unit.layout.level = lv;

                unit.template = templateName; // 템플릿 지정

                unit.fields = JSON.parse(JSON.stringify(row));
                delete unit.fields.member;

                // 조직명(색상)
                unit.fields.orgNm = {
                    value: row.orgNm,
                    style: {
                        backgroundColor: colorMap[lv]
                    }
                }

                // 비교 선택 체크
                unit.fields.cmpValue = '0';
                unit.fields.cmpYn = {
                    value: that.url.checkbox.replace(/{x}/g, unit.fields.cmpValue)
                };

                // 키설정
                if (isMember) {
                    unit.fields.pkey = row.empId;
                    unit.fields.mkey = row.orgId;
                } else {
                    unit.fields.pkey = row.orgId;
                    unit.fields.rkey = row.upOrgId;
                }

                if (isMember && i === 0) {
                    unit.fields.lineh = {
                        style: {
                            display: false
                        }
                    };
                }

                // 겸직
                if (row.dualYn === "Y") {
                    unit.fields.dual = {
                        value: "겸",
                        style: {
                            display: true
                        }
                    };
                }

                res.push(unit);
            }

            return res;
        };

        unit = makeData([data]);
        nodeData = nodeData.concat(unit);

        members = data.member || [];

        if (members.length > 0) {
            member = makeData(members, true);
            if (member) {
                nodeData = nodeData.concat(member);
            }
        }

        return nodeData;
    },

    /**
     * INORG 데이터 로드
     */
    loadData: function () {
        var that = this;
        var org = that.org;
        var res;

        // 조회버튼, 디자인 변경 시 인사비교, 조직비교 reset
        inapp.raise(that.name, {
            action: "load_before"
        });

        res = that.cfg.nodeTemplate;
        res.orgData = that.makeOrgData(that.cfg.orgData);

        // console.log(res);

        org.loadJson({
            data: res,
            success: function () {
                org.nodes().root().center(0);
            }
        });
    },

    /**
     * 비교 노드 선택
     * @param {*} node
     */
    nodeCompareCheckAction: function (node) {
        var that,
            checkValue,
            data,
            empId;

        that = this;
        org = that.org;

        data = orgUtil.node2Json(node);

        empId = data.empId;

        if (!$.trim(empId)) { //빈노드 제외
            return;
        }

        checkValue = data.cmpValue - 0;
        checkValue = (checkValue == 0 ? 1 : 0);

        node.fields("cmpValue").value(checkValue);
        node.fields("cmpYn").value(that.url.checkbox.replace(/{x}/g, checkValue));

        inapp.raise(that.name, {
            action: 'compare_chk_info',
            data: {
                info: data,
                value: checkValue
            }
        });
    }
});