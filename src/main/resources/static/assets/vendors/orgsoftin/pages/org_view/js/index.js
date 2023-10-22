inapp.add( "idx", {
    msg: {},
    cfg: {},

    init: function () {
        var that = this;

        that.bindUI();
    },

    actionMap: {

    },

    bindUI: function () {
        var that;

        that = this;

        // 화면리사이즈 이벤트 바인딩
        $( window ).on( "resize", function () {
            inapp.raise( that.name, {
                action: "window_resized"
            } );
        } );
    }
} );