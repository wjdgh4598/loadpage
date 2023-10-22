var Dialog = (function() {

    function Dialog(message, title, closeCallback, options) {
        this._thisDialog = null;
        var defaultOptions ={};

        $.extend(defaultOptions, options);

        createDialog(defaultOptions);

        this._thisDialog = $('#'+defaultOptions.id);

        if ($.isFunction(title)) {
            closeCallback = title;
            title = undefined;
        }

        if ($.isFunction(closeCallback)) {
            this._thisDialog.off('dialogclose');
            this._thisDialog.on('dialogclose', closeCallback);
        }

        this._thisDialog.html(message);
        this._thisDialog.jQueryDialog('option', 'title', title);
    }

    function createDialog(options) {
        var alertForm = '';
        var defaultOptions = {
            width: 'auto',
            modal: true,
            autoOpen: false,
            resizable: false,
            draggable: false,
        };

        $.extend(defaultOptions, options);

        if (!options.id) {
            throw 'plz define id';
        }

        if ($('#'+options.id).length > 0 ) {
            if(typeof $('#'+options.id).jQueryDialog('instance') != 'undefined') {
                $('#'+options.id).jQueryDialog('destroy');
            }
            $('#'+options.id).remove();
        }

        if (!options.styleClass) {
            options.styleClass ='';
        }

        if (!defaultOptions.width) {
            defaultOptions.minWidth = '354rem';
        }

        if (!defaultOptions.height) {
            defaultOptions.minHeight = 183;
        }

        alertForm += '<div id="'+options.id+'" class="'+options.styleClass+'" title="'+options.title+'" role="dialog">';
        alertForm += options.contents;
        alertForm += '</div>';
        $('body').append(alertForm);
        $.extend(defaultOptions,{
            open: function(event, ui) {
                $('.ui-dialog-titlebar-close', ui.dialog | ui).show();
                $(event.target).dialog('option', 'width', ($(event.target)[0].scrollWidth + 150) + 'rem');
                $(event.target).dialog('option', 'position', 'center');
            }
        });
        $('#'+options.id).jQueryDialog(defaultOptions);
    }

    Dialog.prototype = {
        open:function(event, ui){
            this._thisDialog.jQueryDialog('open');
        }
    };
    return Dialog;
})();

(function ( $ ) {

    /**
     * show alert;
     */
    $.dialog = function(message, title, callback,  options) {
        var defaultOptions = {
            buttons:[
                {
                    text: "확인",
                    class: "button is-filled is-primary is-medium",
                    /*  class: options && options.buttonClass ? options.buttonClass : ' ',   */
                    click: function() {
                        $( this ).jQueryDialog('close');
                    }
                },
            ],
            id:'_mc-alert'
        };

        if ($.isFunction(title)) {
            callback = title;
            title = undefined;
        }

        if (!title) {
            title = '알림';
        }

        if (options) {
            $.extend(defaultOptions, options);
        }

        var alertDialog = new Dialog(message, title, callback, defaultOptions);
        alertDialog.open();
    };

    /**
     * show alert;
     */
    $.alert = function(message, title, callback,  options) {

        message = '<span class="icon is-positive is-medium"><svg><use href="#positive"></use></svg></span>'
                + '<span>' + message + '</span>';

        var options = {
            buttonClass : 'button is-filled is-primary is-medium',
            classes: {
                //'ui-dialog': 'mercury-modal-alert',
                //'ui-dialog-content' : 'justify-content-md-center d-flex align-items-center'
                'ui-dialog': 'is-confirm ui-corner-all'
            },
            width: 236
        };

        if (!title) {
            title = '알림';
        }

        if(self != top) {
            window.parent.$.dialog(message, title, callback, options);
        }
        else {
            $.dialog(message, title, callback, options);
        }
    };

    $.warning = function (message, title, callback, isFalseCallback) {
        if ($.isFunction(title)) {
            isFalseCallback = callback;
            callback = title;
            title = undefined;
        }

        message = '<span class="icon is-negative is-medium"><svg><use href="#negative"></use></svg></span>'
                + '<span>' + message + '</span>';

        var options = {
            id:'_mc-warning',
            buttons:[
                {
                    text: "확인",
                    class: "button is-filled is-primary is-medium",
                    click: function() {
                        $( this ).jQueryDialog('close');
                        if (typeof isFalseCallback != "undefined") {
                            if ($.isFunction(isFalseCallback)) {
                                callback(true);
                            }
                        }
                    }
                },
                {
                    text: "취소",
                    class: 'button is-default is-secondary',
                    click: function() {
                        $( this ).jQueryDialog('close');
                        if (isFalseCallback==true) {
                            callback(false);
                        }
                    }
                }
            ],
            hideClose: true,
            classes: {
                'ui-dialog': 'is-confirm ui-corner-all'
            },
            width: 236
        };

        if (!title) {
            title = '알림';
        }

        var warningDialog = new Dialog(message, title, null, options);
        warningDialog.open();
    };

    $.error = function(message, title, callback) {

        message = '<span class="icon is-negative is-medium"><svg><use href="#negative"></use></svg></span>'
                + '<span>' + message + '</span>';

        var options = {
            class: "button is-filled is-primary is-medium",
            classes: {
                //'ui-dialog': 'mercury-modal-error',
                //'ui-dialog-content' : 'justify-content-md-center d-flex align-items-center'
                'ui-dialog': 'is-confirm ui-corner-all'
            },
            width: 236
        }

        if (!title) {
            title = '알림';
        }
        $.dialog(message, title, null, options);
    };

    /**
     *
     */
    $.confirm = function (message, title, callback, isFalseCallback) {
        if ($.isFunction(title)) {
            isFalseCallback = callback;
            callback = title;
            title = undefined;
        }

        message = '<span class="icon is-negative is-medium"><svg><use href="#negative"></use></svg></span>'
                + '<span>' + message + '</span>';

        var options = {
            id:'_mc-confirm',
            buttons:[
                {
                    text: "확인",
                    class: "button is-filled is-primary is-medium",
                    click: function() {
                        $( this ).jQueryDialog('close');
                        callback(true);
                    }
                },
                {
                    text: "취소",
                    class: "button is-outline is-secondary is-medium",
                    click: function() {
                        $( this ).jQueryDialog("close");
                        if (typeof isFalseCallback != "undefined") {
                            if ($.isFunction(isFalseCallback)) {
                                isFalseCallback(true);
                            } else {
                                isFalseCallback(false);
                            }
                        }

                    }
                }
            ],
            hideClose: true,
            classes: {
                'ui-dialog': 'is-confirm ui-corner-all',
            },
            width: 236
        };

        var confirmDialog = new Dialog(message, title, null, options);
        confirmDialog.open();
    };


}( jQuery ));

$.fn.extend({
    jQueryDialog: function() {
        var $appDocument = $(window.parent.document);

        var result = $(this).dialog.apply(this, arguments);
        if(arguments.length == 1 && Object.prototype.toString.call(arguments[0]) == '[object Object]') {
            //모달 생성 시
            var options = arguments[0];
            var dialog = result.closest('.ui-dialog[role="dialog"]');

            // dialog.addClass('modal-card');
            var titleBar = dialog.find('.ui-dialog-titlebar')/* .addClass('modal-card-head') */;
            // if(options.hideClose) {
            //     titleBar.find('.close').addClass('delete').empty().hide();
            // }
            // else {
            //     titleBar.find('.close')
            //         .addClass('delete').empty().show()
            //         .one('click', function(){
            //             if(self != top) {
            //                 $appDocument.find('.app-modal').hide();
            //             }
            //         });
            // }
            //if(titleBar.hasClass('ui-draggable-handle')) {
            //    titleBar.css({
            //        cursor: 'move'
            //    });
            //}
            dialog.find('.ui-dialog-titlebar > .ui-dialog-title')/* .addClass('card-header is-alert').addClass('card-title').addClass('padding-left30') */;
            dialog.find('.ui-dialog-content')/* .addClass('modal-card-body') */;
            dialog.find('.ui-dialog-buttonpane')/* .addClass('card-footer').addClass('buttons is-center') */;
            
            dialog.attr("draggable","false");

            var zIndexes = [1100].concat(Array.from($('[role="dialog"]').map(function() { return Number($(this).css('z-index')); })).filter(function(v) { return !isNaN(v); }));
            var zIndex = Math.max.apply(undefined, zIndexes) + 1;
            dialog.css({
                "z-index": zIndex
            });

            setTimeout(function() {
                $('.ui-widget-overlay.ui-front')/* .addClass('modal-background').css('background-color', 'rgba(0,0,0,.35)') */;
                dialog.next('.ui-widget-overlay.ui-front').css('z-index', zIndex - 1);
            });

            // ESC key bind
            $(document).find('.ui-dialog').off('keydown.modal').on('keydown.modal', function(ev) {
                if(ev.keyCode == 27) {
                   $appDocument.find('.app-modal').hide();
                }
            });

        } else if (typeof arguments[0] === 'string') {
            if(arguments[0] === 'open') {
                $(this).dialog('option', 'position', { my: 'center center', at: 'center center', of: window });
            }
            if(self != top) {
                if (arguments[0] === 'open') {
                    $appDocument.find('.app-modal').show();
                } else if(arguments[0] === 'close') {
                    $appDocument.find('.app-modal').hide();
                }
            }
        }

        return result;
    }
});
