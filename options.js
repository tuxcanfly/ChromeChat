function loadOptions() {
	var jid = localStorage["jid"];
	var password = localStorage["password"];

    $("#jid").val(jid);
    $("#password").val(password);

}

function saveOptions() {
    localStorage["jid"] = $("#jid").val();
    localStorage["password"] = $("#password").val();
    $("#saved").text("Saved!");
}

