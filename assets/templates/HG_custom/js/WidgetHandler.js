(function () {
    var jQuery;
    var serverFQDN = 'http://widget.bluecalypso.com/';
    var advocate, options, container, overlay, socialWindow, brandName, sharingOption;
    var overlay_selector, container_selector, lastButton, clickId, lastOLSelector, sessionId;
    var messageQueue = {};
    var SocialChannel = {
        "Facebook": 1,
        "Twitter": 2,
        "LinkedIn": 4,
        "Blog": 8,
        "Email": 16,
        "GooglePlus": 32
    };
    var supportedFileExtensions = ['gif','png','jpg','jpeg','ico','wmv','mp4','mov','3gp','mpg','avi'];
    var maxFileSize = 15728640;
    var warningsTimeout;
    var mobile = function () {
        return {
            detect: function () {
                var agent = navigator.userAgent.toLowerCase();
                var isUAMobile = false;
                var isUATablet = false;
                // Check if the UA is a mobile one (regexp from http://detectmobilebrowsers.com/ (WURFL))
                if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(agent) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(agent.substr(0, 4))) {
                    isUAMobile = true;
                }
                // Check if the device is a Tablet such as iPad, Samsung Tab, Motorola Xoom or Amazon Kindle
                if (!!(agent.match(/(iPad|SCH-I|xoom|NOOK|silk|kindle|GT-P|touchpad|kindle|sch-t|viewpad|bolt|playbook)/i))) {
                    // Check if the redirection needs to happen for tablets
                    isUATablet = true;
                    isUAMobile = false;
                }
                return isUAMobile;
            }
        };
    }();
    var BC = BC || {};
    BC.storage = (function(){
        var _storage;
        var _initialized = false;
        var _inMemory = false;

        var lazyLoad = function () {
            if (_initialized === false) {
                try {
                    if (localStorage.getItem) {
                        _storage = localStorage;
                        _storage.setItem("kv1silk", "silk");
                        _storage.removeItem("kv1silk");
                    }
                } catch (e) {
                    _storage = {};
                    _inMemory = true;
                }
            }
            _initialized = true;
        };

        var add = function (key, value) {
            lazyLoad();
            if (_inMemory === false)
                _storage.setItem(key, value);
            else
                _storage[key] = value;
        };

        var remove = function (key) {
            lazyLoad();
            if (_inMemory === false)
                _storage.removeItem(key);
            else
                delete _storage[key];
        };

        var get = function (key) {
            lazyLoad();
            if (_inMemory === false)
                return _storage.getItem(key);
            else
                return _storage[key];
        };

        return {
            Add: add,
            Remove: remove,
            Get: get
        }
    })();

    if (!window.Calyp) window.Calyp = {};
    Calyp.Widget = function (opts) {
        options = opts;
        overlay_selector = '#_bcWOverlay';
        container_selector = '#_bcWc';
        alert_selector = '#_bcMSGBox';
        container = '_bcWc';
        alert_container = '_bcMSGBox';
        overlay = '_bcWOverlay';
        brandName = '';
    };

    Calyp.Widget.Token = function () {
        return options.token;
    };

    Calyp.Widget.ServerFQDN = function () {
        return serverFQDN;
    };
    Calyp.Widget.HideModal = function () {
        close_modal();
    };

    function init() {
        if (window.jQuery === undefined || window.jQuery.fn.jquery !== '1.9.1') {
            var script_tag = document.createElement('script');
            script_tag.setAttribute("type", "text/javascript");
            script_tag.setAttribute("src", "https://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js");
            (document.getElementsByTagName("head")[0] || document.documentElement).appendChild(script_tag);
            if (script_tag.attachEvent) {
                script_tag.onreadystatechange = function () {
                    if (this.readyState == 'complete' || this.readyState == 'loaded') {
                        this.onreadystatechange = null;
                        scriptLoadHandler();
                    }
                };
            } else {
                script_tag.onload = scriptLoadHandler;
            }
        } else {
            jQuery = window.jQuery;
            main();
        }
    }

    function scriptLoadHandler() {
        jQuery = window.jQuery.noConflict();
        main();
    }

    function main() {
        jQuery(document).ready(function () {
            if (options && options.token) {

                defineOldBrowserFunctions();

                if (typeof options.use_uicss === "undefined") options.use_uicss = true;
                if (typeof options.track_reshare === "undefined") options.track_reshare = true;
                if (typeof options.testimonial === "undefined") options.testimonial = true;

                loadWidgetCss();
                loadWidgetJS();
                initializeJQueryPlugins();
                initializeWidgetContainers();
                initializeAuthorization();
            }
        });
    }

    function defineOldBrowserFunctions() {
        if (!String.prototype.trim) {
            String.prototype.trim = function () {
                return this.replace(/^\s+|\s+$/g, '');
            }
        }
        if (!Array.prototype.indexOf) {
            Array.prototype.indexOf = function (elt /*, from*/) {
                var len = this.length;

                var from = Number(arguments[1]) || 0;
                from = (from < 0)
                     ? Math.ceil(from)
                     : Math.floor(from);
                if (from < 0)
                    from += len;

                for (; from < len; from++) {
                    if (from in this &&
                        this[from] === elt)
                        return from;
                }
                return -1;
            };
        }
    }

    function clearHashMap(set, key) {
        var _array = {};
        for (var item in set) {
            if (set[item] && item !== key)
                _array[item] = set[item];
        }
        return _array;
    }

    function loadWidgetCss() {
        if (options.use_uicss)
            jQuery('head').append('<link href="' + serverFQDN + 'CSSBridge.ashx?bcbrand_token=' + encodeURIComponent(options.token) + '" rel="stylesheet" type="text/css">');
    }

    function loadWidgetJS() {
        jQuery.getScript(serverFQDN + 'JSBridge.ashx?bcbrand_token=' + encodeURIComponent(options.token));
    }

    function ajaxFileUpload(url, postData, fileElementId, closeDialog, callback) {
        jQuery.ajaxFileUpload({
            url: url,
            secureuri: false,
            fileElementId: fileElementId,
            dataType: 'application/json',
            data: postData,
            success: function(data, status){
                callback(data);
            },
            error: function (data, status, e) {
            }
        });
    }

    function initializeJQueryPlugins() {
        jQuery.fn.extend({
            bcCounter: function (opts) {
                return this.each(function () {
                    var $this = jQuery(this);
                    var options = jQuery.extend({ maxChars: 100, warningStart: 80, appendMethod: 'insertAfter' }, opts);

                    if (options.maxChars <= 0) return;
                    var counterMsg = jQuery("._bcCM");
                    if (counterMsg.size() === 0) {
                        counterMsg = jQuery("<div class=\"_bcCM\">&nbsp;</div>");
                        counterMsg[options.appendMethod]($this);
                    }
                    $this.bind('keydown keyup keypress', doCount)
                    .bind('focus paste', function () { setTimeout(doCount, 10); })
                    .bind('blur', function () { counterMsg.stop().fadeTo('fast', 0); return false; });

                    $this.data('bcCounterOptions', options);

                    function doCount() {
                        var options = $this.data('bcCounterOptions');
                        var val = $this.val();
                        var length = val.length;

                        if (length >= options.maxChars)
                            val = val.substring(0, options.maxChars);

                        if (length > options.maxChars) {
                            var originalScrollTopPosition = $this.scrollTop();
                            $this.val(val.substring(0, options.maxChars));
                            $this.scrollTop(originalScrollTopPosition);
                        }

                        if (length >= options.warningStart) {
                            counterMsg.addClass("warning");
                        } else {
                            counterMsg.removeClass("warning");
                        }

                        counterMsg.html('Characters: ' + $this.val().length + "/" + options.maxChars);
                        counterMsg.stop().fadeTo('fast', 1);
                    };
                });
            }
        });
        jQuery.extend({
            createUploadIframe: function (id, uri) {
                //create frame
                var frameId = 'jUploadFrame' + id;
                var iframeHtml = '<iframe id="' + frameId + '" name="' + frameId + '" style="position:absolute; top:-9999px; left:-9999px"';
                if (window.ActiveXObject) {
                    if (typeof uri == 'boolean') {
                        iframeHtml += ' src="' + 'javascript:false' + '"';

                    }
                    else if (typeof uri == 'string') {
                        var d = new Date();
                        iframeHtml += ' src="' + uri + "?v=" + d.getTime() + '"';
                    }
                }
                iframeHtml += ' />';
                jQuery(iframeHtml).appendTo(document.body);

                return jQuery('#' + frameId).get(0);
            },
            createUploadForm: function (id, fileElementId, data) {
                //create form	
                var formId = 'jUploadForm' + id;
                var fileId = 'jUploadFile' + id;
                var form = jQuery('<form  action="" method="POST" name="' + formId + '" id="' + formId + '" enctype="multipart/form-data"></form>');

                for (var key in data) {
                    if (data.hasOwnProperty(key)) {
                        var value = data[key];
                        jQuery('<input type="hidden" name="' + key + '" value="' + value + '" />').appendTo(form);
                    }
                }

                var oldElement = jQuery('#' + fileElementId);
                var newElement = jQuery(oldElement).clone();
                jQuery(oldElement).attr('id', fileId);
                jQuery(oldElement).before(newElement);
                jQuery(oldElement).appendTo(form);

                //set attributes
                jQuery(form).css('position', 'absolute');
                jQuery(form).css('top', '-1200px');
                jQuery(form).css('left', '-1200px');
                jQuery(form).appendTo('body');
                return form;
            },

            ajaxFileUpload: function (s) {
                // TODO introduce global settings, allowing the client to modify them for all requests, not only timeout		
                s = jQuery.extend({}, jQuery.ajaxSettings, s);
                var id = new Date().getTime();
                var form = jQuery.createUploadForm(id, s.fileElementId, (typeof (s.data) == 'undefined' ? false : s.data));
                var io = jQuery.createUploadIframe(id, s.secureuri);
                var frameId = 'jUploadFrame' + id;
                var formId = 'jUploadForm' + id;
                // Watch for a new set of requests
                if (s.global && !jQuery.active++) {
                    jQuery.event.trigger("ajaxStart");
                }
                var requestDone = false;
                // Create the request object
                var xml = {}
                if (s.global)
                    jQuery.event.trigger("ajaxSend", [xml, s]);
                // Wait for a response to come back
                var uploadCallback = function (isTimeout) {
                    var io = document.getElementById(frameId);
                    try {
                        if (io.contentWindow) {
                            xml.responseText = io.contentWindow.document.body ? io.contentWindow.document.body.innerHTML : null;
                            xml.responseXML = io.contentWindow.document.XMLDocument ? io.contentWindow.document.XMLDocument : io.contentWindow.document;

                            if (s.dataType == 'application/json' && io.contentWindow.document.body.innerText) {
                                xml.responseText = io.contentWindow.document.body.innerText;
                                //xml.responseXML = jQuery.parseJSON(io.contentWindow.document.body.innerText);
                            }

                        } else if (io.contentDocument) {
                            xml.responseText = io.contentDocument.document.body ? io.contentDocument.document.body.innerHTML : null;
                            xml.responseXML = io.contentDocument.document.XMLDocument ? io.contentDocument.document.XMLDocument : io.contentDocument.document;

                            if (s.dataType == 'application/json' && io.contentDocument.document.body.innerText) {
                                xml.responseText = io.contentDocument.document.body.innerText;
                                //xml.responseXML = jQuery.parseJSON(io.contentDocument.document.body.innerText);
                            }
                        }
                    } catch (e) {
                        //jQuery.handleError(s, xml, null, e);
                    }
                    if (xml || isTimeout == "timeout") {
                        requestDone = true;
                        var status;
                        try {
                            status = isTimeout != "timeout" ? "success" : "error";
                            // Make sure that the request was successful or notmodified
                            if (status != "error") {
                                // process the data (runs the xml through httpData regardless of callback)
                                var data = jQuery.uploadHttpData(xml, s.dataType);
                                // If a local callback was specified, fire it and pass it the data
                                if (s.success)
                                    s.success(data, status);

                                // Fire the global callback
                                if (s.global)
                                    jQuery.event.trigger("ajaxSuccess", [xml, s]);
                            } //else
                            //jQuery.handleError(s, xml, status);
                        } catch (e) {
                            status = "error";
                            //jQuery.handleError(s, xml, status, e);
                        }

                        // The request was completed
                        if (s.global)
                            jQuery.event.trigger("ajaxComplete", [xml, s]);

                        // Handle the global AJAX counter
                        if (s.global && ! --jQuery.active)
                            jQuery.event.trigger("ajaxStop");

                        // Process result
                        if (s.complete)
                            s.complete(xml, status);

                        jQuery(io).unbind()

                        setTimeout(function () {
                            try {
                                jQuery(io).remove();
                                jQuery(form).remove();

                            } catch (e) {
                                //jQuery.handleError(s, xml, null, e);
                            }

                        }, 100)

                        xml = null

                    }
                }
                // Timeout checker
                if (s.timeout > 0) {
                    setTimeout(function () {
                        // Check to see if the request is still happening
                        if (!requestDone) uploadCallback("timeout");
                    }, s.timeout);
                }
                try {

                    var form = jQuery('#' + formId);
                    if (s.url.indexOf('?') > 0) {
                        jQuery(form).attr('action', s.url + "&v=" + new Date().getTime());
                    }
                    else {
                        jQuery(form).attr('action', s.url + "?v=" + new Date().getTime());
                    }
                    jQuery(form).attr('method', 'POST');
                    jQuery(form).attr('target', frameId);
                    if (form.encoding) {
                        jQuery(form).attr('encoding', 'multipart/form-data');
                    }
                    else {
                        jQuery(form).attr('enctype', 'multipart/form-data');
                    }
                    jQuery(form).submit();

                } catch (e) {
                    //jQuery.handleError(s, xml, null, e);
                }

                jQuery('#' + frameId).load(uploadCallback);
                return { abort: function () { } };

            },

            uploadHttpData: function (r, type) {
                var data = !type;
                data = type == "xml" || data ? r.responseXML : r.responseText;
                // If the type is "script", eval it in global context
                if (type == "script")
                    jQuery.globalEval(data);
                // Get the JavaScript object, if JSON is used.
                if (type == "json")
                    eval("data = " + data);
                // evaluate scripts within html
                if (type == "html")
                    jQuery("<div>").html(data).evalScripts();

                return data;
            }
        });
        jQuery.fn.serializeJSON = function () {
            var json = {};
            jQuery.map(jQuery(this).serializeArray(), function (n, i) {
                var _ = n.name.indexOf('[');
                if (_ > -1) {
                    var o = json;
                    _name = n.name.replace(/\]/gi, '').split('[');
                    for (var i = 0, len = _name.length; i < len; i++) {
                        if (i == len - 1) {
                            if (o[_name[i]]) {
                                if (typeof o[_name[i]] == 'string') {
                                    o[_name[i]] = [o[_name[i]]];
                                }
                                o[_name[i]].push(n.value);
                            }
                            else o[_name[i]] = n.value || '';
                        }
                        else o = o[_name[i]] = o[_name[i]] || {};
                    }
                }
                else {
                    if (json[n.name] !== undefined) {
                        if (!json[n.name].push) {
                            json[n.name] = [json[n.name]];
                        }
                        json[n.name].push(n.value || '');
                    }
                    else json[n.name] = n.value || '';
                }
            });
            return json;
        };
    }
    
    function initializeWidgetContainers() {
        if (jQuery(container_selector).size() === 0) {
            jQuery('body').append('<div id="' + container + '"></div>');
        }
        if (jQuery(alert_selector).size() === 0) {
            jQuery('body').append('<div id="' + alert_container + '"></div>');
        }
        if (jQuery(overlay_selector).size() === 0) {
            jQuery('body').append('<div id="' + overlay + '"></div>');
            jQuery(overlay_selector).css({
                'display': 'none',
                'position': 'fixed',
                'background': '#000',
                'z-index': 100,
                'left': '0px',
                'height': '100%',
                'width': '100%',
                'top': '0px'
            }).click(close_modal);
        }
    }

    function initializeAuthorization() {
        if (options.token) {
            clickId = getUrlParam("bcpsk");
            //check if hash tag exists in the URL
            if (window.location.hash) {
                //set the value as a variable, and remove the #
                var hash_value = window.location.hash.replace('#', '');
                //show the value with an alert pop-up
                var startIndex = hash_value.indexOf('bcpsk');
                if (startIndex > -1) {
                    clickId = hash_value.substring(startIndex + 5);
                }
            }
            validateToken();
        } else {
            logError('No Token specified');
        }
    }

    function validateToken() {
        if (options.shareSelector) {
            jQuery(options.shareSelector).each(function (i) {
                var tokenId = getRandomToken();
                var attrs = getElementSharingOptions(jQuery(this));
                attrs["bcbrand_token"] = options.token;
                //attrs["brandUri"] = getPageUrl();
                attrs["tokenid"] = tokenId;
                messageQueue[tokenId] = jQuery(this);
                jQuery.getJSON(serverFQDN + 'eventHandler.ashx/validate?callback=?', attrs, validateTokenCallback);
            });
        }
    }

    function getCampaignThumbnailUri(e) {
        var result = "";
        if (typeof e !== "undefined") {
            if (typeof e !== 'function' && ((e.indexOf('#') === 0) || (e.indexOf('.') === 0))) {
                if (jQuery(e).size() === 0) {
                    result = e;
                } else {
                    result = jQuery(e).attr("src");
                }
            } else if (typeof e === 'function') {
                result = e(sharingOption);
            } else {
                result = e;
            }
        }

        return result;
    }

    function getCampaignTargetUri(e) {
        var result = "";
        if (typeof e !== "undefined") {
            if (typeof e !== 'function' && ((e.indexOf('#') === 0) || (e.indexOf('.') === 0))) {
                if (jQuery(e).size() === 0) {
                    result = e;
                } else {
                    result = jQuery(e).attr("href");
                }
            } else if (typeof e === 'function') {
                result = e(sharingOption);
            } else {
                result = e;
            }
            result = toAbsoluteURL(result);
        }

        return result;
    }

    function getHtmlValue(e) {
        var result = "";
        if (typeof e !== "undefined") {
            if (typeof e !== 'function' && ((e.indexOf('#') === 0) || (e.indexOf('.') === 0))) {
                if (jQuery(e).size() === 0) {
                    result = e;
                } else {
                    result = jQuery(e).html();
                }
            } else if (typeof e === 'function') {
                result = e(sharingOption);
            } else {
                result = e;
            }
        }
        
        return result;
    }

    function toAbsoluteURL(url) {
        // Handle absolute URLs (with protocol-relative prefix)
        // Example: //domain.com/file.png
        if (url.search(/^\/\//) != -1) {
            return window.location.protocol + url;
        }

        // Handle absolute URLs (with explicit origin)
        // Example: http://domain.com/file.png
        if (url.search(/:\/\//) != -1) {
            return url;
        }

        // Handle absolute URLs (without explicit origin)
        // Example: /file.png
        if (url.search(/^\//) != -1) {
            return window.location.origin + url;
        }

        // Handle relative URLs
        // Example: file.png
        var base = window.location.href.match(/(.*\/)/)[0];

        return base + url;
    }

    function getUrlParam(key) {
        var hash;
        var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
        var result = null;
        var i = 0, count = hashes.length;
        while (i < count) {
            hash = hashes[i].split('=');
            if (hash[0] === key) {
                result = hash[1];
                i = count;
            }
            i++;
        }
        return result;
    }

    function IsValidEmail(email) {
        var filter = /^([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
        return filter.test(email);
    }

    function multiEmail(emailList, separator) {
        var email = emailList.split(separator);
        var counter = 0;
        for (var i = 0; i < email.length; i++) {
            if (email[i].trim().length > 0) {
                counter++;
                if (!IsValidEmail(email[i].trim()))
                    return false;
            }
        }
        return (counter > 0);
    }

    function getRandomToken() {
        var chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz";
        var string_length = 8;
        var randomstring = '';
        for (var i = 0; i < string_length; i++) {
            var rnum = Math.floor(Math.random() * chars.length);
            randomstring += chars.substring(rnum, rnum + 1);
        }
        return randomstring;
    }

    function isValidEmailSelection(emailList) {
        var result = true;
        if (emailList.trim() !== '') {
            if (!multiEmail(emailList.trim().replace(/ /g, ",").replace(/;/g, ","), ',')) {
                showWarnings('Please verify your email address to continue.');
                result = false;
            }
        } else {
            showWarnings('Please enter an email address to continue.');
            result = false;
        }
        return result;
    }

    function validateTokenCallback(data) {
        if (data.valid === "true") {
            reloadAdvocateInfo();
            var $this = messageQueue[data.tokenid];

            if (typeof $this !== 'undefined' && $this !== false) {
                jQuery.each(data.items, function (i, item) {
                    var opts = { id: item.id, flags: item.bitmap, on: item.on, title: item.title, description: item.description, thumbnail: item.thumbnail, url: item.url, testimonial: item.testimonial };
                    $this.data('bcdata', opts);
                });
                $this.click(openShareDialog);
            }
            brandName = data.brandName;
        } else {
            logError('Invalid Token');
        }
        messageQueue = clearHashMap(messageQueue, data.tokenid);
    }

    function logError(msg) {
        if (window.console && console.error) console.error(msg);
    }

    function logDebug(msg) {
        if (window.console && console.log) console.log(msg);
    }

    function reloadAdvocateInfo(callback) {
        var advocateid = BC.storage.Get("__bceid");
        if (advocateid && advocateid.length) {
            var params = {};
            params["advocateid"] = advocateid;
            jQuery.getJSON(serverFQDN + 'eventHandler.ashx/forceauthenticate?callback=?', params, function (data) {
                if (data.found)
                    advocate = data.advocate;
                else
                    BC.storage.Remove("__bceid");

                if (callback)
                    callback(data);
            });
        }
    }

    function openShareDialog(e) {
        var $container = jQuery(container_selector);
        var $this = jQuery(this);
        var defaultText = $this.attr('bcps-msg');
        var opts = $this.data('bcdata');

        sharingOption = $this;
        $container.empty().append(bcJST.widget);
        $container.find('a._bcBC').click(close_modal);
        $container.find('#_bcShare').click(executeShare);
        $container.find('#_bcUIc').hide();

        $container.find('._bcIM').bcCounter({maxChars: 140, warningStart: 100});
        $container.find('._bcHc').find('h1').empty().append(brandName);
        $container.find('._bcCIc').find('img').attr("src", opts.thumbnail);
        $container.find('._bcCDc').find('h3').empty().append(opts.title);
        $container.find('._bcCDc').find('p').empty().append(opts.description);
        $container.find('#_bcBFn').click(handleFBLink);
        $container.find('#_bcBTn').click(handleTWLink);
        $container.find('#_bcBLn').click(handleLILink);
        $container.find('#_bcBEn').click(handleEMLink);
        $container.find('#_bcInpFile').on("change", handleFileSelect);
        lastButton = null;

        if (opts.on === "1") {
            if (typeof defaultText !== 'undefined' && defaultText !== false) {
                $container.find('._bcIM').val(getHtmlValue(defaultText));
            } else if (typeof options.msg !== "undefined" && options.msg !== false) {
                $container.find('._bcIM').val(getHtmlValue(options.msg));
            }
            refreshButtonView($container, $this);
            refreshButtonStatus();
            refreshLoginInfo();
            toggleTestimonialsView($this);
            showDialog(container_selector);
        } else {
            showModalAlert('The content is no longer available.', 'Attention!');
        }
    }

    function showDialog(e) {
        lastOLSelector = e;
        jQuery(overlay_selector).css({ 'width': jQuery(window).width(), 'height': jQuery(window).height(), 'display': 'block', opacity: 0 });
        jQuery(overlay_selector).fadeTo(200, 0.5);
        var top = 0 | (jQuery(document).scrollTop() + ((jQuery(window).height() - jQuery(e).height()) / 2));
        var left = 0 | (jQuery(document).scrollLeft() +((jQuery(window).width() - jQuery(e).width()) / 2));
        jQuery(e).css({
            'display': 'block',
            'position': 'absolute',
            'opacity': 0,
            'z-index': 11000,
            'left': (left < 0 ? 0 : left) + 'px',
            'top': (top < 0 ? 0 : top) + 'px'
        });
        jQuery(e).fadeTo(200, 1);
    }

    function close_modal() {
        jQuery(overlay_selector).fadeOut(200);
        jQuery(lastOLSelector).css({ 'display': 'none' });
    }

    function signOut() {
        var $container = jQuery(container_selector);
        if (advocate) {
            advocate = null;
            BC.storage.Remove("__bceid");
            $container.find('#_bcNYa').unbind('click');
        }
        refreshLoginInfo();
        refreshButtonStatus();
        toggleEmailFromField();
    }
    function toggleSNButton(button) {
        var $this = jQuery(button);
        if ($this.hasClass('active'))
            $this.removeClass('active').addClass('selected');
        else
            $this.removeClass('selected').addClass('active');
        checkCustomMessageRemainingCount();
    }
    function handleFBLink() {
        var $this = jQuery(this);
        lastButton = $this;
        if (advocate) {
            var bitmap = parseInt(advocate.bitmap);
            lastButton.attr('bcps-bit', 1);
            if ((bitmap & 1) > 0) {
                if ($this.hasClass('active'))
                    checkSocialNetworkToken("FBAL", { eid: advocate.eid });
                else
                    $this.removeClass('selected').addClass('active');
            } else {
                executeAuthorizationLinkRequest("FBAL", { eid: advocate.eid });
            }
        } else {
            executeAuthorizationLinkRequest("FBAL", {});
        }
        return false;
    }

    function handleTWLink() {
        var $this = jQuery(this);
        lastButton = $this;
        if (advocate) {
            var bitmap = parseInt(advocate.bitmap);
            lastButton.attr('bcps-bit', 2);
            if ((bitmap & 2) > 0) {
                if ($this.hasClass('active'))
                    checkSocialNetworkToken("TWAL", { eid: advocate.eid });
                else
                    $this.removeClass('selected').addClass('active');
            } else {
                executeAuthorizationLinkRequest("TWAL", { eid: advocate.eid });
            }
        } else {
            executeAuthorizationLinkRequest("TWAL", {});
        }

        return false;
    }

    function handleLILink() {
        var $this = jQuery(this);
        lastButton = $this;
        if (advocate) {
            var bitmap = parseInt(advocate.bitmap);
            lastButton.attr('bcps-bit', 4);
            if ((bitmap & 4) > 0) {
                if ($this.hasClass('active'))
                    checkSocialNetworkToken("LIAL", { eid: advocate.eid });
                else
                    $this.removeClass('selected').addClass('active');
            } else {
                executeAuthorizationLinkRequest("LIAL", { eid: advocate.eid });
            }
        } else {
            executeAuthorizationLinkRequest("LIAL", {});
        }

        return false;
    }

    function handleEMLink() {
        var $this = jQuery(this);
        var $container = jQuery(container_selector);
        if ($this.hasClass('active')) {
            $container.find('._bcESc').show();
            $container.find('._bcITo').show();
            toggleEmailFromField();
            $this.removeClass('active').addClass('selected');
            enableInteractions();
            checkCustomMessageRemainingCount();
        } else {
            $container.find('._bcESc').hide();
            $this.removeClass('selected').addClass('active');
            if (!advocate) {
                disableInteractions();
            } 
        }
    }

    function handleFileSelect() {
        var $this = jQuery(this);
        var $container = jQuery(container_selector);
        var arrInputs = $this;
        for (var i = 0; i < arrInputs.length; i++) {
            var oInput = arrInputs[i];
            if (oInput.type == "file") {
                var sFileName = oInput.value;
                if (sFileName.length > 0) {
                    var blnValidExtension = false;
                    var blnValidSizeOrUnknown = false;
                    var message = [];
                    for (var j = 0; j < supportedFileExtensions.length; j++) {
                        var sCurExtension = supportedFileExtensions[j];
                        if (sFileName.substr(sFileName.length - sCurExtension.length, sCurExtension.length).toLowerCase() == sCurExtension.toLowerCase()) {
                            blnValidExtension = true;
                            break;
                        }
                    }
                    if (oInput.files !== undefined) {
                        if (oInput.files[0].size < maxFileSize) {
                            blnValidSizeOrUnknown = true;
                        }
                    }
                    else { 
                        blnValidSizeOrUnknown = true;
                    }
                    if (!blnValidExtension || !blnValidSizeOrUnknown) {
                        if (!blnValidExtension) {
                            message.push('Invalid File Extension. Extensions allowed: gif, png, jpg, jpeg, ico, mp4, mov, 3gp, mpg, and avi.');
                        }
                        if (!blnValidSizeOrUnknown) {
                            message.push('Invalid File Size. Max file size: 15 Mb.');
                        }
                        $this.wrap('<form>').closest('form').get(0).reset();//clear value.
                        $this.unwrap();
                        showWarnings(message);
                    }
                }
            }
        }
    }

    function checkCustomMessageRemainingCount() {
        var $container = jQuery(container_selector);
        var textArea = $container.find('textarea._bcIM');
        var options = textArea.data('bcCounterOptions');
        var textAreaValue = textArea.val().trim();
        var params = {};
        params["snActiveList"] = [];
        $container.find('button.selected').each(function (i) {
            params["snActiveList"].push(jQuery(this).attr("id"));
        });
        if (params["snActiveList"].indexOf("_bcBTn") > -1) {
            jQuery.extend(options, { maxChars: 80, warningStart: 60 });
            if (textAreaValue.length > 80)
                textArea.val(textAreaValue.substring(0, 76)+'...');
        }
        else {
            jQuery.extend(options, { maxChars: 140, warningStart: 100 });
        }
    }

    function toggleEmailFromField() {
        var operationComplete = false;
        var $container = jQuery(container_selector);
        if (advocate) {
            if (advocate.email && advocate.email.length > 0) {
                $container.find('._bcIFrom').hide();
                operationComplete = true;
            }
        }

        if (!operationComplete) {
            var $this = $container.find('#_bcBEn');
            if ($this.hasClass('selected')) {
                $container.find('._bcIFrom').show();
            }
        }
    }
    function checkSocialNetworkToken(endPoint, params) {
       
        jQuery.ajax({
            url: serverFQDN + 'eventHandler.ashx/' + 'c' + endPoint,
            async: false,
            data: params,
            dataType: "jsonp"
        }).done(function (response) {
            checkSocialNetworkTokenHandleResponse(response, endPoint, params);
        });
    }
    function checkSocialNetworkTokenHandleResponse(response, endPoint, params) {
        if (response && response.hasOwnProperty("status")) {
            if (response.status == 200) { //OK
                toggleSNButton(lastButton);
            }
            else {
                executeAuthorizationLinkRequest(endPoint, params)
            }
        }
    }
    function executeAuthorizationLinkRequest(endPoint, params) {
        var width = 846;
        var height = 561;
        if (navigator.appVersion.indexOf('Chrome') > 0)
            height = height + 50;

        var dualScreenLeft = window.screenLeft != undefined ? window.screenLeft : screen.left;
        var dualScreenTop = window.screenTop != undefined ? window.screenTop : screen.top;
        var x = ((screen.width / 2) - (width / 2)) + dualScreenLeft;
        var y = ((screen.height / 2) - (height / 2)) + dualScreenTop;
        socialWindow = window.open(serverFQDN + 'eventHandler.ashx', 'Login', 'height=' + height + ',width=' + width + ',left=' + x + ',top=' + y);

        if (clickId && clickId.length > 0)
            params["clickId"] = clickId;

        jQuery.ajax({
            url: serverFQDN + 'eventHandler.ashx/' + endPoint,
            async: false,
            data: params,
            dataType: "jsonp"
        }).done(handleAuthorizationLinkResponse);
    }

    function handleAuthorizationLinkResponse(response) {
        if (response && response.hasOwnProperty("status")) {
            if (response.status == 200) { //OK
                if (socialWindow) {
                    socialWindow.location = response.data.redirectUri;
                    if (socialWindow.focus)
                        socialWindow.focus();

                    var pollTimer = window.setInterval(function () {
                        if (socialWindow.closed !== false) { // !== is required for compatibility with Opera
                            window.clearInterval(pollTimer);
                            revalidateToken();
                        }
                    }, 800);
                }
            }
        }
    }

    function revalidateToken() {
        jQuery.ajax({
            url: serverFQDN + 'eventHandler.ashx/fetchToken',
            async: false,
            data: {},
            dataType: "jsonp"
        }).done(handleRevalidateTokenResponse);
    }

    function handleRevalidateTokenResponse(response) {
        if (response && response.hasOwnProperty("status")) {
            if (response.status == 200) { //OK
                var advocateid = BC.storage.Get("__bceid");
                BC.storage.Add("__bceid", response.data.token);
                if (advocateid && advocateid.length) {
                    refreshUserInfoView();
                } else {
                    refreshWidgetView();
                }
            }
        }
    }

    function refreshWidgetView() {
        reloadAdvocateInfo(function () {
            refreshLoginInfo();
            refreshButtonStatus();
            toggleEmailFromField();
            if (lastButton) {
                lastButton.trigger("click");
            }
        });
    }

    function refreshUserInfoView() {
        reloadAdvocateInfo(function () {
            if (lastButton) {
                if (advocate) {
                    jQuery(container_selector).find('#_bcUFNs').empty().append(advocate.firstname + " " + advocate.lastname);
                    toggleEmailFromField();
                    var bitmap = parseInt(advocate.bitmap);
                    if ((bitmap & parseInt(lastButton.attr('bcps-bit'))) > 0)
                        lastButton.removeClass('selected').addClass('active');
                }
                lastButton.trigger("click");
            }
        });
    }

    function refreshLoginInfo() {
        var $container = jQuery(container_selector);
        $container.find('#_bcUIc').hide();
        disableInteractions();
        if (advocate) {
            $container.find('#_bcUIc').show();
            $container.find('#_bcUFNs').empty().append(advocate.firstname + " " + advocate.lastname);
            $container.find('#_bcNYa').click(signOut);
            enableInteractions();
        }
    }

    function refreshButtonStatus() {

        var $container = jQuery(container_selector);
        var bitmap = 0;
        $container.find('#_bcBFn').removeClass('active').removeClass('selected');
        $container.find('#_bcBLn').removeClass('active').removeClass('selected');
        $container.find('#_bcBTn').removeClass('active').removeClass('selected');
        $container.find('#_bcBWn').removeClass('active').removeClass('selected');
        $container.find('#_bcBBn').removeClass('active').removeClass('selected');
        if (advocate) {
            bitmap = parseInt(advocate.bitmap);
            if ((bitmap & 1) > 0)
                $container.find('#_bcBFn').addClass('active');
            if ((bitmap & 2) > 0)
                $container.find('#_bcBTn').addClass('active');
            if ((bitmap & 4) > 0)
                $container.find('#_bcBLn').addClass('active');
        }
    }

    function refreshButtonView($container, $this) {
        var opts = $this.data('bcdata');
        var flags = opts.flags;//$this.attr("bcps-flags");
        var length = (flags) ? flags.length : false;
        var bitmap = 0;

        $container.find('#_bcBFn').hide();
        $container.find('#_bcBTn').hide();
        $container.find('#_bcBLn').hide();
        $container.find('#_bcBWn').hide();
        $container.find('#_bcBBn').hide();
        $container.find('#_bcBEn').hide();
        $container.find('._bcESc').hide();

        if (length) {
            bitmap = parseInt(flags);
            if ((bitmap & 1) > 0)
                $container.find('#_bcBFn').show();
            if ((bitmap & 2) > 0)
                $container.find('#_bcBTn').show();
            if ((bitmap & 4) > 0)
                $container.find('#_bcBLn').show();
            if ((bitmap & 8) > 0)
                $container.find('#_bcBWn').show();
            if ((bitmap & 16) > 0) {
                $container.find('#_bcBEn').show();
                $container.find('#_bcBEn').addClass('active');
            }
        }
    }
    function toggleTestimonialsView(e) {
        var $container = jQuery(container_selector);
        var theTestimonial;
        var attrTestimonial = e.attr("bcps-testimonial");
        var $this = jQuery(this);
        var opts = $this.data('bcdata');
        

        if (typeof attrTestimonial !== 'undefined') {
            theTestimonial = getHtmlValue(attrTestimonial);
        }
        else if (typeof options.testimonial !== "undefined") {
            theTestimonial = options.testimonial;
        }
        else if (typeof opts.testimonial !== "undefined"){
            theTestimonial = opts.testimonial;
        }
        else {
            theTestimonial = true;
        }
        if (theTestimonial == "true" || theTestimonial == true) {
            $container.find('._bcUPc').show();
        }
        else {
            $container.find('._bcUPc').hide();
        }
    }

    function executeShare() {
        var params = {};
        var $container = jQuery(container_selector);
        var custommessage = $container.find('textarea._bcIM').val().trim();
        var endorserEmail = "";
        var shouldVerifyEmail = false;
        var shouldAbort = false;
        var opts = sharingOption.data('bcdata');
        params["campaign"] = opts.id;
        params["snActiveList"] = [];
        $container.find('button.selected').each(function (i) {
            params["snActiveList"].push(jQuery(this).attr("id"));
        });

        if (params["snActiveList"].indexOf("_bcBEn") > -1)
            shouldVerifyEmail = true;

        params["to"] = $container.find('#_bcTo').val().trim();
        if (advocate) {
            params["did"] = advocate.did;
            params["eid"] = advocate.eid;
            endorserEmail = advocate.email;
        } else {
            params["did"] = 0;
            params["eid"] = 0;
        }

        if (endorserEmail && endorserEmail.length > 0 && endorserEmail.trim().length > 0)
            params["from"] = endorserEmail.trim();
        else
            params["from"] = $container.find('#_bcFrom').val().trim();

        if (shouldVerifyEmail) {
            if (IsValidEmail(params["from"])) {
                if (!isValidEmailSelection(params["to"])) {
                    $container.find('#_bcTo').focus();
                    shouldAbort = true;
                }
            } else {
                shouldAbort = true;
                $container.find('#_bcFrom').focus();
                showWarnings('Please enter your email address to continue.');
            }
        }
        if (shouldAbort === true)
            return;
        if (custommessage === '') {
            showWarnings('Please insert a personal message.');
            shouldAbort = true;
        } else {
            params["message"] = custommessage;
        }
        if (shouldAbort === true)
            return;

        params["clickId"] = clickId;
        params["source"] = document.location.href;

        if (options.track_reshare !== true) {
            params["source"] = document.location.href + '#!BCPSTR';
        }
        sessionId = getRandomToken();
        params["sessionId"] = sessionId;
        if ($container.find('button.selected').length > 0) {
            showLoading();
            disableInteractions();
            shareResponseFetchCounter = 0;
            ajaxFileUpload(serverFQDN + 'eventHandler.ashx/share?callback=handleShareResponse', params, '_bcInpFile', null, handleShareResponse);
        }
        else {
            showWarnings('Please select at least one sharing method above to continue.');
        }
    }
    var shareResponseFetchCounter = 0;
    function handleShareResponse(response) {
        if (response && response.hasOwnProperty("status")) {
            shareResponseFetchCounter = 0;
            if (response.status == 200) { //OK
                var $container = jQuery(container_selector);
                BC.storage.Add("__bceid", response.data.token);
                if (response.data.advocateset === "1")
                    advocate = response.data.advocate;
                $container.find('._bcHc').nextAll().remove();
                $container.append(getThankyouTemplate());
                CalypVendor.init({ key: response.data.campaign });
            } else {
                showWarnings(response.message);
            }
            hideLoading();
            enableInteractions();
        }
        else {
            if (shareResponseFetchCounter == 0) {
                var params = {};
                params["sessionId"] = sessionId;
                jQuery.getJSON(serverFQDN + 'eventHandler.ashx/fetchshareresponse?callback=?', params, handleShareResponse);
            }
            shareResponseFetchCounter = shareResponseFetchCounter + 1;
        }
    }

    function getPageTitle() {
        return document.title;
    }

    function getPageUrl() {
        var theResult = document.location.href;
        var startIndex = theResult.indexOf('bcpsk');
        if (startIndex > -1) {
            theResult = document.location.href.substring(0, startIndex - 1);
        }
        return theResult;
    }

    function getElementSharingOptions(e) {
        var attrKey = e.attr("bcps-key");
        var attrTitle = e.attr("bcps-title");
        var attrDescription = e.attr("bcps-description");
        var attrUrl = e.attr("bcps-url");
        var attrThumbnail = e.attr("bcps-thumbnail");
        var attrTestimonial = e.attr("bcps-testimonial");

        var theKey = '';
        var theTitle;
        var theUrl;
        var theThumbnail;
        var theDescription;
        var theTestimonial;
        sharingOption = e;

        if (typeof attrKey !== 'undefined' && attrKey !== false) {
            theKey = getHtmlValue(attrKey);
        }
        else if (typeof options.key !== "undefined" && options.key !== false) {
            theKey = getHtmlValue(options.key);
        }

        if (typeof attrTitle !== 'undefined' && attrTitle !== false) {
            theTitle = getHtmlValue(attrTitle);
        }
        else if (typeof options.title !== "undefined" && options.title !== false) {
            theTitle = getHtmlValue(options.title);
        } else {
            theTitle = getPageTitle();
        }

        if (typeof attrDescription !== 'undefined' && attrDescription !== false) {
            theDescription = getHtmlValue(attrDescription);
        }
        else if (typeof options.description !== "undefined" && options.description !== false) {
            theDescription = getHtmlValue(options.description);
        } else {
            theDescription = getPageTitle();
        }

        if (typeof attrUrl !== 'undefined' && attrUrl !== false) {
            theUrl = getCampaignTargetUri(attrUrl);
        }
        else if (typeof options.url !== "undefined" && options.url !== false) {
            theUrl = getCampaignTargetUri(options.url);
        } else {
            theUrl = getPageUrl();
        }

        if (typeof attrThumbnail !== 'undefined' && attrThumbnail !== false) {
            theThumbnail = getCampaignThumbnailUri(attrThumbnail);
        }
        else if (typeof options.thumbnail !== "undefined" && options.thumbnail !== false) {
            theThumbnail = getCampaignThumbnailUri(options.thumbnail);
        } else {
            theThumbnail = 'http://calyp.co/Ads/images/Alogos/nophoto.gif';
        }

        if (typeof attrTestimonial !== 'undefined') {
            theTestimonial = getHtmlValue(attrTestimonial);
        }
        else if (typeof options.testimonial !== "undefined") {
            theTestimonial = options.testimonial;
        } else {
            theTestimonial = true;
        }

        var attrs = {};
        attrs["key"] = theKey;
        attrs["title"] = encodeURIComponent(theTitle);
        attrs["description"] = encodeURIComponent(theDescription);
        attrs["thumbnail"] = toAbsoluteURL(theThumbnail);
        attrs["url"] = theUrl;
        attrs["testimonial"] = theTestimonial? 1 : 0;
       
        return attrs;
    }

    function getThankyouTemplate() {
        var defaultTT = sharingOption.attr('bcps-thankyou');
        var theResult = bcJST.simplethankyou;
        if (typeof defaultTT !== 'undefined' && defaultTT !== false) {
            theResult = getHtmlValue(defaultTT);
        } else if (typeof options.thankyou !== "undefined" && options.thankyou !== false) {
            theResult = getHtmlValue(options.thankyou);
        }
        return theResult;
    }

    function showAlert(message)
    {
        alert(message);
    }

    function showModalAlert(message, title) {
        var $alertDialog = jQuery(alert_selector);
        $alertDialog.empty().append(bcJST.modalAlert);

        if (title && title.trim() === '') {
            title = 'Attention!';
        }
        if (message && message.trim() != '') {
            $alertDialog.find('._bcMSGBoxTitle').empty().html(title);
            $alertDialog.find('._bcMSGBoxMessage').empty().html(message);
            $alertDialog.find('#_bcMSGBoxOk').click(function () { close_modal(); });
            showDialog(alert_selector);
        }
    }

    function showWarnings(msg) {
        if (mobile.detect()) {
            showAlert(msg);
        }
        else {
            var $container = jQuery(container_selector);
            var ul = $container.find('#_bcWCmes ul')
            $container.find('#_bcWCmes').show();
            clearInterval(warningsTimeout);
            jQuery(ul).empty().show();

            if (Object.prototype.toString.call(msg) === '[object Array]') {
                var length = msg.length, element = null;
                for (var i = 0; i < length; i++) {
                    element = msg[i];
                    jQuery(ul).append(
                        jQuery('<li>').append(element)
                        );
                }
            }
            else {
                jQuery(ul).append(
                        jQuery('<li>').append(msg)
                        ).show();
            }
            warningsTimeout = setTimeout(function () { jQuery(ul).hide(); }, 10000);
        }
    }
    function showLoading() {
        var $container = jQuery(container_selector);
        $container.find('#_bcImLoading').css('display', 'inline-block');
    }
    function hideLoading() {
        var $container = jQuery(container_selector);
        $container.find('#_bcImLoading').hide();
    }
    function disableInteractions() {
        var $container = jQuery(container_selector);
        $container.find('#_bcShare').attr('disabled', 'disabled');
 //       $container.find('#inpFileWrap').attr('disabled', 'disabled');
    }
    function enableInteractions() {
        var $container = jQuery(container_selector);
        $container.find('#_bcShare').removeAttr('disabled');
//        $container.find('#inpFileWrap').removeAttr('disabled');
    }
    //$.getScript(url, successCallback)
    init();

})();
