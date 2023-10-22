inapp.add('emp_compare', {
    url: {},
    cfg: {
        maxCountEmp: 5
    },
    compareEmpList: {},
    init: function () {
        var that;

        that = this;

        that.compareEmpList = {};
        $('.modal-dialog').css('max-width', 'auto');
    },
    actionMap: {
        option_tool: {
            btn_emp_compare_click: function (prop) {
                var that = this;

                // 모달 show
                that.showModal();
            },
            check_emp_compare: function (prop) {
                var that = this;
                var isShow = prop.chk;

                if (!isShow) {
                    that.hideArea(true);
                }
            }
        },
        org_view: {
            /** 조직도 생성시 데이터 캐싱
             * @param {*} prop.org 조직도 데이터
             */
            org_created: function (prop) {
                var that;

                that = this;
                that.org = prop.org;
            },
            /** 조직도에서 선택시 로직
             * @param {*} prop.org 조직도 데이터
             */
            compare_chk_info: function (prop) {
                var that = this;
                var data = prop.data;
                var info = data.info;
                var value;

                value = data.value != 0;

                if (value) {
                    that.addInfoNode(info);
                } else {
                    that.removeInfoNode(info.empId + '-' + info.orgId);
                }
            },
            // 재조회 시 인사비교 닫기
            load_before: function (prop) {
                var that = this;

                that.hideArea(true);
            }
        }
    },
    hideArea: function (reload) {
        var that = this;

        if (reload) {
            that.compareEmpList = {}; // 추가된 node 삭제
            $('#compare-list').empty();
        }

        $('#compare-emp-info').hide(); // 분석창 닫기

        $(window).trigger('resize');
    },
    bindUI: function () {
        var that = this;
        var len;
        var empList;
        var compareEmpList;
        var empData;
        var key;

        $('#cm-e-emp-compare-modal').on('shown.bs.modal', function () {
        });

        // 모달 닫을시 clear 처리
        $('#cm-e-emp-compare-modal').on('hidden.bs.modal', function () {
            $('#cm-e-emp-compare-content').remove();
        });
    },

    showModal: function () {
        var that = this;
        var len = $('#compare-list').children().length;

        if (len < 2) {
            alert('비교 대상을 2명 이상 선택해야 합니다.');
            return;
        }

        if (len > that.cfg.maxCountEmp) {
            alert('비교 대상은 ' + that.cfg.maxCountEmp + '명 이하로 선택해주세요.');
            return;
        }

        var w = len * 300 + 100;
        $('.modal-dialog').css('max-width', w);
        $('#cm-e-emp-compare-modal').modal('show');
    },

    /**
     * 선택한 노드에 대한 객체를 생성한다.
     * @param {*} node
     */
    addInfoNode: function (data) {
        var that = this;
        var id;
        var empId;
        var orgId;
        var $node;
        var empPhoto;
        var $img;
        var $imgDiv;
        var $empInfo;
        var personId;
        var empMap = incmm.util._dataMap['emp'];

        empId = data.empId; // 사번
        orgId = data.orgId;
        personId = data.personId;
        id = empId + '-' + orgId;

        var gradeYears = ['2022년', '2021년', '2020년'];
        var gradeArr = ['S', 'A', 'B', 'C'];

        // 리스트
        if (Object.keys(that.compareEmpList).length < that.cfg.maxCountEmp) {
            that.compareEmpList[id] = {
                empId: empId,
                orgId: orgId,
                personId: personId
            };

            $node = $('<div>', {
                id: 'info-' + id,
                class: 'compare-item'
            });

            $orgInfo = $('<div>', {
                class: 'orgNm-info'
            });

            $orgInfo.append(data.orgNm);

            // FIXME : onerror 시 이미지 대체가 정상적으로 되지 않아 우회 처리
            empPhoto = data.empPhoto;
            if (!empPhoto) {
                empPhoto = inapp.config.option.defaultImage
            }

            $img = $('<img>', {
                src: empPhoto,
                style: 'margin-top: 10px; width: 90px; height: 110px;'
            });

            $imgDiv = $('<div>', {
            });

            $empInfo = $('<div>', {
                class: 'emp-info'
            });

            $info = $('<div>', {
                text: '[직원정보]'
            });
            $empInfo.append($info);

            for (i in empMap) {
                row = empMap[i];

                if (row.info) {
                    $info = $('<div>', {
                        text: [row.name, data[row.code]].join(': ')
                    });
                    $empInfo.append($info);
                }
            }

            $evalInfo = $('<div>', {
                class: 'emp-info'
            });

            $info = $('<div>', {
                text: '[최근평가결과(평가년도 + 등급)]'
            });
            $evalInfo.append($info);

            for (i = 0, len = gradeYears.length; i < len; i++) {
                rnd = Math.round(Math.random() * len);
                $info = $('<div>', {
                    text: [gradeYears[i], gradeArr[rnd]].join(': ')
                });
                $evalInfo.append($info);
            }

            $imgDiv.append($img);

            $node.append($orgInfo);
            $node.append($imgDiv);
            $node.append($empInfo);
            $node.append($evalInfo);

            $('#compare-list').append($node);
        } else {
            that.removeInfoNode(id, true);
        }
    },
    // 비교 객체 제거 로직
    removeInfoNode: function (id, isTrigger) {
        var that = this;
        var $info;
        var empId;
        var orgId;
        var listData;
        var arr;

        $info = $('#info-' + id);
        listData = that.compareEmpList[id];

        if ($info.length > 0) {
            $info.remove();

            if (listData) {
                empId = listData.empId;
                orgId = listData.orgId;

                delete that.compareEmpList[id];
            }
        } else {
            arr = id.split('-');
            empId = arr[0];
            orgId = arr[1];
        }

        if (isTrigger) {
            inapp.raise(that.name, {
                action: 'remove_info',
                empId: empId,
                orgId: orgId
            });
        }
    }
});
