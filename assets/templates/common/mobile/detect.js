
var pagename = escape(window.location);
var sPage = pagename.substring(pagename.lastIndexOf('/') + 1);


var showfullsite;

showfullsite = get_cookie("showfullsite")

if (pagename.search("view_full_site") != -1) {
	set_cookie("showfullsite", "1");
	showfullsite = "1";
}

if (pagename.search("_b_") != -1) {
	showfullsite = "1";
}

if (pagename.search("_ep_") != -1) {
	showfullsite = "1";
}

if (pagename.search("registry_home") != -1) {
	showfullsite = "1";
}

if (pagename.search("resetpassword") != -1) {
    showfullsite = "1";
}

if (pagename.search("myaccount") != -1) {
    showfullsite = "1";
}

if (pagename.search("shiptracking") != -1) {
    showfullsite = "1";
}


if (navigator.userAgent.match(/Android/i) ||
    navigator.userAgent.match(/webOS/i) ||
    navigator.userAgent.match(/iPhone/i) ||
    navigator.userAgent.match(/iPod/i) ||
    navigator.userAgent.match(/Opera Mobi/i) ||
    navigator.userAgent.match(/Opera Mini/i) ||
    navigator.userAgent.match(/BlackBerry/i) ||
    navigator.userAgent.match(/Nokia/i) ||
    navigator.userAgent.match(/SymbianOS/i) ||
    navigator.userAgent.match(/Windows CE/i) ||
    navigator.userAgent.match(/BenQ/i)
    ){


    if (showfullsite != "1") {
        if (pagename.search("checkout") != -1)
            sPage = "checkout.asp";
        window.location = '/mobile/' + unescape(sPage);
    }

}

function delete_cookie(cookie_name) {
    var cookie_date = new Date();  // current date & time
    cookie_date.setTime(cookie_date.getTime() - 1);
    document.cookie = cookie_name += "=; expires=" + cookie_date.toGMTString();
}

function set_cookie(name, value, exp_y, exp_m, exp_d, path, domain, secure) {
    var cookie_string = name + "=" + escape(value);
    if (exp_y) {
        var expires = new Date(exp_y, exp_m, exp_d);
        cookie_string += "; expires=" + expires.toGMTString();
    }
    if (path)
        cookie_string += "; path=" + escape(path);
    if (domain)
        cookie_string += "; domain=" + escape(domain);
    if (secure)
        cookie_string += "; secure";
    document.cookie = cookie_string;
}

function get_cookie(cookie_name) {
    var results = document.cookie.match('(^|;) ?' + cookie_name + '=([^;]*)(;|$)');
    if (results)
        return (unescape(results[2]));
    else
        return null;
}
