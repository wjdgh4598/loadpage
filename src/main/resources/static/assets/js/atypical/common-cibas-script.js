var $_emplNoEl = $("#ATYP11_pEmplNo");
$_emplNoEl.on("keyup", onKeyPress);

var $_searchBtn = $("#_ATYP_EMP_NO_BTN");
$_searchBtn.on("click", function () {
    var emplNoName = $_emplNoEl.val();
    openPopup(emplNoName);
});
function onKeyPress(ev) {
    if (ev.keyCode == 13) {
        if (_.size(ev.target.value) < 2) {
            $.alert("사번 혹은 성명을 1자이상 입력하세요.", "알림", function () {});
            return false;
        } else {
            var value = ev.target.value;
            openPopup(value);
        }
    } else {
        $_emplNoEl.val("");
    }
}
function openPopup(emplNoName) {
    openPop("/popup/psmst/psmstr-pop/view", {
        emplNoName: emplNoName,
        onApply: function (checkedRow) {
            if (!_.isEmpty(checkedRow)) {
                $_emplNoEl.val(checkedRow.emplNo);
            }
        }
    });
}
