inapp.add("option_tool", {
    msg: {
        all: "전체",
        level: "레벨"
    },
    cfg: {},
    init: function () {
        var that;

        that = this;

        that.bindUI();
        that.setDateInfo(); // 기준일 설정
    },
    actionMap: {
        "data_manage": {
            "org_data_loaded": function (prop) {
                $("input:checkbox[id='check-emp-compare-list']").prop("checked", false);
            }
        },
        "org_view": {
            "load_before": function() {
                $("input:checkbox[id='check-emp-compare-list']").prop("checked", false);
            },
            "org_created": function (prop) {
                $("#btn-retrieve").trigger("click");
            }
        }
    },

    bindUI: function () {
        var that = this;

        // 날짜 선택
        $("#base_ymd").datepicker({
            format: 'yyyy-mm-dd',
            autoclose: true, // 사용자가 날짜를 클릭하면 자동 캘린더가 닫히는 옵션
            todayHighlight: true, // 오늘 날짜에 하이라이팅 기능
            toggleActive: true,
            language: "ko", // 달력의 언어 선택, 그에 맞는 js로 교체
            templates: {
                leftArrow: '<span class="icon is-calendar-chevron-left is-medium"><svg><use href="#calendar-chevron-left"></use></svg></span>',
                rightArrow: '<span class="icon is-calendar-chevron-right is-medium"><svg><use href="#calendar-chevron-left"></use></svg></span>'
            }
        });

        // 조회 버튼 클릭 이벤트 바인딩
        $("#btn-retrieve").on("click", function () {
            inapp.raise(that.name, {
                action: "btn_retrieve_click"
            });
        });

        // 디자인 변경 이벤트 바인딩
        $("#select-design").on("change", function () {
            inapp.raise(that.name, {
                action: "design_change",
                data: {
                    design: $(this).val()
                }
            });
        });

        // 팀원 포함
        $("#check-include-member").on("change", function () {
            var isChk = $(this).is(":checked");
            inapp.raise(that.name, {
                action: "check_include_member",
                chk: isChk
            });
        });

        // 인원 비교 선택
        $("#check-emp-compare-list").on("change", function () {
            var isChk = $(this).is(":checked");
            inapp.raise(that.name, {
                action: "check_emp_compare",
                chk: isChk
            });
        });

        // 비교
        $("#btn-emp-compare").on("click", function () {
            inapp.raise(that.name, {
                action: "btn_emp_compare_click"
            });
        });

        $("[data-tool-action]").on("click", function () {
            var id = $(this).attr("data-tool-action");
            orgUtil[id]();
        });
    },

    /**
     * 오늘 날짜를 셋팅한다.
     */
    setDateInfo: function () {
        var now = dayjs();
        var today = now.format("YYYY-MM-DD");

        $("#base_ymd").val(today);
    }
});