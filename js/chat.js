settings = {
  'BOSH_SERVICE': "http://localhost/xmpp-httpbind",
  'DEBUG': true
};

PubSubClient.prototype = {
  
    connect: function(username, password) {
        console.log("logging in as ", username);
        this._conn = new Strophe.Connection(settings.BOSH_SERVICE);
        this._conn.connect(username, password, this._on_connect(this));
        this._nick = username.split("@")[0];
        return this._conn;
    },

    /* disconnect from the xmpp server */
    disconnect: function() {
        this._conn.disconnect();
        this._on_disconnect();
    },

    /* callback fired when connection status changes */
    _on_connect: function(context) {
        return function (status, condition) {
            context._jid = context._conn.jid;
            if (settings.DEBUG) {
                console.log("status is ", status);
            }
        };
    },

    /* callback fired before disconnect */
    _on_disconnect: function(status) {
    },

    focus: true, /* whether the window has focus */
    unread: 0 /* count of unread messages */

};

function PubSubClient(options) {
    this.options = options;
    this.updates = new Array();
    var connection = null;
    connection = this.connect(options.username, options.password);
    $(window).blur(function(context) {
        return function() {
            context.focus = false;
        };
    }(this));

    $(window).focus(function(context) {
        return function() {
            context.focus = true;
            /* reset counter */
            context.unread = 0;
        };
    }(this));

}
