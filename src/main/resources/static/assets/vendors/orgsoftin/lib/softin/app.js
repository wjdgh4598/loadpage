/**
 * app.js는 web application을 구성하기 위한 최초 진입 모듈입니다.
 *
 * app에서 불러와 사용할 모듈들은 index 페이지에서 순차적으로 include 하여 사용합니다.
 * ( 필요시 commonjs 또는 AMD 형태를 구성합니다. )
 *
 * inapp의 watch()를 활용하여 페이지에 구성될 모듈들을 등록합니다.
 *
 * inapp의 init()을 활용하여 각 모듈들의 초기화 및 모듈간 이벤트 바인딩을 수행합니다.
 * ( 각 모듈은 init() 메소드를 소유해야 합니다. 초기화 과정이 필요없다면 존재하지 않아도 됩니다. )
 */
$( function () {

    /**
     * watch 로 등록되는 모듈은 name이라는 프로퍼티가 존재해야 하며
     * name 프로퍼티에 사용될 모듈의 이름을 명명합니다.
     * name은 각 모듈에서 타 모듈을 subscribe 하기위한 actionMap의 namespace로 사용됩니다.
     */

    /**
     * TODO
     * - inapp에 config data IO 기능 추가
     * - IO storage에 대해서는 설정을 통해 스위칭 가능하도록 하자.
     * - remote, js memory, cookie, localstorage, indexedDB 뭐 등등등
     */
	
    inapp.config = inconfig;

    inapp.init();

} );