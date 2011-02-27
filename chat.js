settings = {
  'BOSH_SERVICE': "http://localhost/xmpp-httpbind",
  'DEBUG': true,
  'STATUS': 'available'
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
        this._conn.send($pres({type: "unavailable"}), function() {
            this._conn.disconnect();
        });
    },

    /* callback fired when connection status changes */
    _on_connect: function(context) {
        return function (status, condition) {
            context._jid = context._conn.jid;
            if (settings.DEBUG) {
                console.log("status is ", status);
                //context._conn.xmlOutput = context._logger;
            }
            if (status == Strophe.Status.CONNECTED) {
                context._get_roster();
                context._conn.send($pres());
                context.pres_handler = context._conn.addHandler(context.options.pres_handler, null,
                        'presence', null, null, null);
                context.msg_handler = context._conn.addHandler(context.options.chat_msg_cb, null,
                        'message', null, null, null);
            }
        };
    },

    _get_roster: function () {
        console.log("getting roster");
        iq_roster = $iq({type: 'get', id: pubsub._conn.getUniqueId()})
                    .c("query", {xmlns: "jabber:iq:roster"});
        this._conn.sendIQ(iq_roster, this._roster_cb(this));
    },

    _roster_cb: function(context) {
        return function(data) {
                console.log(data);
                context.roster = data;
                $(data).find("item").each(function() {
                    context.options.roster_item_cb(this);
                });
        };
    },

    _logger: function(data) {
        console.log(data);
        return true;
    },

    focus: true, /* whether the window has focus */
    unread: 0 /* count of unread messages */,
    context: this

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
