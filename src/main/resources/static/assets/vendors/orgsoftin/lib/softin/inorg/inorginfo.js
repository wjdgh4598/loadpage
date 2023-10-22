var softin;

softin = softin || {};

/*
 * INOrg를 사용하기 위한 설정 값들을 정의한다.
 *
 */
softin.inorg = softin.inorg || {};

/*
 * global 허용가능 event 나열
 */
softin.inorg.allowEvents = [
    "onServerMsg",
    "onClick",
    "onSearchEnd",
    "onExpandButtonClick"
];
/*
 * global event callback 사용여부
 *
 * default : false
 *
 * false :
 *  생성자의 option.event에 지정한 각각의 event callback을 사용한다.
 *
 * true :
 *  생성자의 option.event에 지정한 각각의 event callback은 무시되고
 *  global에 ["orgid_eventname"]에 해당하는 callback을 사용한다.
 *  ex) orgid가 "myOrg"이고 onSearchEnd event일 경우
 *      myOrg_onSearchEnd를 사용하게 된다.
 *
 */
softin.inorg.allowGlobalEvent = false;

/*
 *
 * INOrg를 사용하기 위한 Heler 및 Wrapper 성격의 Function 들을 정의한다.
 *
 */

/*
 * INOrg 객체 생성
 */
function createINOrg(id, options) {

    var org,
        cfg
    ;

    org = __createINOrg(id, options);

    /**
     * 기본적으로 라이센스 인증에 실패 할 경우 alert으로 메세지를 제공하므로
     * 별도의 체크가 필요 할 경우에만 이곳에 후처리를 기술지원에서 가이드 한다.
     *
     * org.authorized 가 존재 할 경우 비정상으로 인지한다.
     * 코드는 아래와 같다.
     *
     * authorized [
     *     -1 : 생성할 컨테이너 id가 이미 사용중인 경우
     *     -2 : 라이센스 인증에 실패한 경우
     *     -3 : 지원하지 않는 protocol로 접근 [ http:, https: ] 이외
     *     -4 : system error
     *     -5 : 컨테이너 id에 해당하는 dom element가 존재하지 않는경우
     *     -6 : softin.js의 license 설정 에러
     *          softin가 존재하지 않거나 license 설정이 비정상인 경우
     *     ]
     */
    if(org.hasOwnProperty("authorized")) {
        console.log("inorg authorized: ", org.authorized);
        return org;
    }

    cfg = softin.inorg || {};

    /*
     * org 객체 global에 노출
     * 사용하지 않을경우 주석처리한다.
     */
    window[org.id] = org;

    /*
     * global event 할당
     */
    if (!cfg.allowGlobalEvent) return org;
    for (var index in cfg.allowEvents) {
        var
        ename = cfg.allowEvents[index],
        gename = org.id + "_" + ename;
        org.options.event[ename] = (function(_gename){
            return function(evt){
                var _func = window[_gename];
                (_func) && _func(evt);
            }
        })(gename);
    }

    return org;
}
