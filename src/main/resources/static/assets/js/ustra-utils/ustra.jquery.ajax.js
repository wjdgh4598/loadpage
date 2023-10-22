
var Ajax = {
    defaults: {
        enabledProgressBar: false,
        activeDialogError:false,
        progressBarText: '' //please wait...
    },
    setProgressBarText: function (text) {
        Ajax.defaults.progressBarText = text;
    },
    enableProgressBar: function () {
        Ajax.defaults.enabledProgressBar = false; // 이 값만 바꿔주세요.
        var spinner = new Spin.Spinner({
            lines    : 13,                        // The number of lines to draw
            length   : 38,                        // The length of each line
            width    : 17,                        // The line thickness
            radius   : 45,                        // The radius of the inner circle
            scale    : 0.5,                       // Scales overall size of the spinner
            corners  : 1,                         // Corner roundness (0..1)
            speed    : 1,                         // Rounds per second
            rotate   : 0,                         // The rotation offset
            animation: 'spinner-line-fade-quick', // The CSS animation name for the lines
            direction: 1,                         // 1: clockwise, -1: counterclockwise
            color    : '#000000',                 // CSS color or array of colors
            fadeColor: 'transparent',             // CSS color or array of colors
            top      : '500rem',                     // Top position relative to parent
            left     : '50%',                     // Left position relative to parent
            shadow   : '0 0 1px transparent',     // Box-shadow for the lines
            zIndex   : 2000000000,                // The z-index (defaults to 2e9)
            className: 'spinner',                 // The CSS class to assign to the spinner
            position : 'absolute',                // Element positioning
        }).spin(document.querySelector('#spin-progress'));

		$.ajaxPrefilter(function(settings){
		    //console.log(settings);
		    if (Ajax.defaults.enabledProgressBar === true) {
                return
            }

		    var skipUrls = [ '/api/setcmmcode' ];
		    if (skipUrls.indexOf(settings.url) > -1) {
		        return;
		    }

            var method = (settings && settings.type) ? settings.type.toUpperCase() : 'GET';
			if (method !== 'GET') {
			    enableProgressBarOnce();
			} else if (settings.showProgress) {
                enableProgressBarOnce();
            }
		});

        $(document).ajaxStart(function () {
            if (Ajax.defaults.enabledProgressBar) {
                $('#spin-progress').show();

				//gnb 1차메뉴 클릭시 gnb close
                $(".header__menu").removeClass('on');	
			    $(".gnb__wrap").removeClass('bm_on');
			    $(".gnb__item").removeClass("ov");
			    $(".body").removeClass("gnb_on");
                
                
                if (typeof Ajax.defaults.enableCount === 'number' && Ajax.defaults.enableCount > 0) {
                    Ajax.defaults.enableCount--;
                }
            }
        });

        $(document).ajaxStop(function () {
            if (Ajax.defaults.enabledProgressBar) {
                $('#spin-progress').hide();
                if (typeof Ajax.defaults.enableCount === 'number' && Ajax.defaults.enableCount === 0) {
                    Ajax.defaults.enabledProgressBar = false;
                    delete Ajax.defaults.enableCount;
                }
            }
        });

        $(document).ajaxSend(function(ev, xhr, settings) {
//            if(settings && settings.type && settings.type.toUpperCase() == 'GET') {
//                if(settings.url.indexOf('?') != -1) {
//                  var ejectParams = ['page','perPage','userId'];
//
//                  var queryParams = settings.url.split('?')[1];
//                  var queryObject = Object.fromEntries(new URLSearchParams(queryParams));
//
//                  ejectParams.forEach(function(eject) {
//                      delete queryObject[eject];
//                  });
//
//                  var origin = Object.fromEntries(new URLSearchParams(location.search));
//                  Object.assign(origin, queryObject);
//
//                  queryParams = new URLSearchParams(origin).toString();
//
//                  window.history.pushState({}, '', '?'+queryParams);
//              }
//            }
        });
    },
    setActiveDialog: function () {
        Ajax.defaults.activeDialogError=true
    },
    enableErrorHandler: function () {
        $(document).ajaxError(function (evnet, xhr, settings, thrownError) {

            var response;

            console.log(thrownError);
            console.log(xhr);
            console.log(settings);
            if (xhr.responseText && (xhr.status=='500' || xhr.status=='400')) {
                response = JSON.parse(xhr.responseText);
            } else {
                response = {};
            }

            if (xhr.status == '0') {
                //response.message = '서버연결에 실패하였습니다.';
                response.message = '오류가 발생하였습니다.';
            }

            if (xhr.status =='403') {
                response.message = '권한이 없습니다.';
            }

            if (xhr.status =='404') {
                response.message = '페이지를 찾을수 없습니다.';
            }

            if (xhr.status == '419') {
                response.message = '세션이 유효하지 않습니다.';
            }

            if (Ajax.defaults.activeDialogError) {
                $.error(response.message, function () {
                    if (xhr.status == '419') {
                        if (self != top) {
                            window.parent.location.reload();
                        } else {
                            window.location.reload();
                        }
                    }
                    if (xhr.status == '500' || xhr.status == '400') {
                        if (typeof callback == 'undefined') {
                            if (typeof _systemErrorCallback != 'undefined') {
                                _systemErrorCallback();
                            }
                        }
                    }
                });
            } else {
                alert(response.message);
                if (xhr.status == '419') {
                    if (self != top) {
                        window.parent.location.reload();
                    } else {
                        window.location.reload();
                    }
                }

                if (xhr.status == '500' || xhr.status == '400') {
                    if (typeof callback == 'undefined') {
                        if (typeof _systemErrorCallback != 'undefined') {
                            _systemErrorCallback();
                        }
                    }
                }
            }
        });
    }
};
Ajax.enableProgressBar();
Ajax.enableErrorHandler();

jQuery.each([ "put", "delete" ], function(i, method) {
    jQuery[method] = function(url, data, callback, type) {
        if (jQuery.isFunction(data)) {
            type = type || callback;
            callback = data;
            data = undefined;
        }

        return jQuery.ajax({
            url : url,
            type : method,
            dataType : type,
            data : data,
            success : callback
        });
    };
});

function enableProgressBarOnce() {
    enableProgressBar(1);
}

function enableProgressBar(enableCount) {
    Ajax.defaults.enabledProgressBar = true;
    if (typeof enableCount === 'number') {
        Ajax.defaults.enableCount = enableCount;
    }
}

function disableProgressBar() {
    Ajax.defaults.enabledProgressBar = false;
    $('#spin-progress').hide();
    delete Ajax.defaults.enableCount;
}