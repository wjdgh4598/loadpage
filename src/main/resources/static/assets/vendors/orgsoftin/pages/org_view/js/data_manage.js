inapp.add("data_manage", {
    msg: {},
    cfg: {
        isTest: false
    },
    url: {
        orgData: "/open-api/hrorglist",
        empData: "/open-api/hremplist"
    },
    map: {},
    init: function () {
        var that;

        that = this;
        that.map = _data_map;
    },
    actionMap: {
        "option_tool": {
            "btn_retrieve_click": function (prop) {
                var that = this;
                that.searchData();
            }
        }
    },

    /**
     * 화상조직도 조회
     */
    searchData: function () {
        var that = this;
        var orgData;
        var empData;
        var empMap = {};
        var emp;
        var row;
        var memMap = {};

        // 1. 부서목록 조회
        orgData = that.searchOrgData();
        // console.log(orgData);

        // 2. 직원목록 조회
        empData = that.searchEmpData();
        // console.log(empData);

        if (!orgData || orgData.length === 0) {
            return;
        }

        // 부서 + 직책자 병합할 데이터
        mergeData = incmm.util.copyObject(orgData);

        // 리더 구분
        leaderMap = {};
        for (i = 0, len = mergeData.length; i < len; i++) {
            row = mergeData[i];
            if (row.leaderId) {
                leaderMap[row.leaderId] = true;
            }
        }

        // 직원 데이터 구성
        for (i = 0, len = empData.length; i < len; i++) {
            row = empData[i];

            if (!row.orgId) {
                continue;
            }

            if (leaderMap[row.empId]) {
                empMap[row.empId] = row;
            } else {
                // 팀원 데이터 보관
                if (!memMap[row.orgId]) {
                    memMap[row.orgId] = [];
                }
                memMap[row.orgId].push(row);
            }
        }

        // 부서 + 직책자 데이터 병합
        for (i = 0, len = mergeData.length; i < len; i++) {
            row = mergeData[i];

            if (row.leaderId) {
                emp = JSON.parse(JSON.stringify(empMap[row.leaderId]));

                row.leaderYn = "Y";
                row.dualYn = (row.orgId !== emp.orgId) ? "Y" : "N";

                delete emp.orgId;
                delete emp.orgNm;
                row = $.extend(row, (emp || {}), true);
            }

            row.member = (memMap[row.orgId] || []);
        }

        inapp.raise(that.name, {
            action: "org_data_loaded",
            data: {
                orgData: mergeData
            }
        });
    },

    convertData: function (type, data) {
        var that = this;
        var res = [];
        var dataMap;
        var row;
        var unit;
        var field;
        var val;
        var i;
        var j;
        var len;
        var mapLen;

        dataMap = that.map[type];

        for (i = 0, len = data.length; i < len; i++) {
            unit = {};
            row = data[i];

            for (j = 0, mapLen = dataMap.length; j < mapLen; j++) {
                field = dataMap[j];

                if (typeof field.convert === "function") {
                    val = field.convert(row);
                } else {
                    val = row[field.alias.code];
                }

                unit[field.code] = val;
            }

            res.push(unit);
        }

        return res;
    },

    /**
     * 부서목록 조회
     */
    searchOrgData: function () {
        var that = this;
        var url = that.url.orgData;
        var data;
        var params = {
            baseYmd: dayjs($("#base_ymd").val()).format('YYYYMMDD'),
            orgCode: ''
        }

        if (that.cfg.isTest) {
            url = "data/hrorglist.json";
        }

        $.ajax({
            url: url,
            dataType: 'json',
            method: 'post',
            data: params,
            async: false,
            success: function (res) {
                if (res && res.length > 0) {
                    data = that.convertData("org", res);
                }
            }
        });

        return data;
    },

    /**
     * 직원목록 조회
     */
    searchEmpData: function () {
        var that = this;
        var url = that.url.empData;
        var data;
        var params = {
            baseYmd: dayjs($("#base_ymd").val()).format('YYYYMMDD'),
            orgCode: ''
        }

        if (that.cfg.isTest) {
            url = "data/hremplist.json";
        }

        $.ajax({
            url: url,
            dataType: 'json',
            method: 'post',
            data: params,
            async: false,
            success: function (res) {
                if (res && res.length > 0) {
                    data = that.convertData("emp", res);
                }
            }
        });

        return data;
    }
});