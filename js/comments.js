function SigComments_loginUser (login, email, photo) {
    if (typeof jQuery != 'undefined' && typeof pm != 'undefined' && typeof FrameManager != 'undefined' && typeof window.sigCommentsReady != "undefined" && window.sigCommentsReady == true){
        pm({
          target: window.frames['gChatFrame'],
          type:   "loginChatUser", 
          data:   {
            login: login,
            email: email,
            photo: photo
          }
        });
    } else {
        setTimeout(function(){SigComments_loginUser(login, email, photo);},300);
    }
}
function SigComments_SSOLoginUser (login,email,photo,link,sig) {
    if (typeof jQuery != 'undefined' && typeof pm != 'undefined' && typeof FrameManager != 'undefined' && typeof window.sigCommentsReady != "undefined" && window.sigCommentsReady == true){
        if (
            typeof login == "undefined" ||
            typeof email == "undefined" ||
            typeof photo == "undefined" ||
            typeof link == "undefined" ||
            typeof sig == "undefined"
        ) return false;
        pm({
          target: window.frames['gChatFrame'],
          type:   "SSOLoginChatUser", 
          data:   {
            login: login,
            email: email,
            photo: photo,
            link: link,
            sig: sig
          }
        });
    } else {
        setTimeout(function(){SigComments_SSOLoginUser (login,email,photo,link,sig);},300);
    }
}
function createCookie(name, value, days) {
    var expires;

    if (days) {
        var date = new Date();         date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));         expires = "; expires=" + date.toGMTString();
    } else {         expires = "";
    }     document.cookie = escape(name) + "=" + escape(value) + expires + "; path=/";
}
function readCookie(name) {
    var nameEQ = escape(name) + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) === ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) === 0) return unescape(c.substring(nameEQ.length, c.length));
    }
    return null;
}
function eraseCookie(name) { createCookie(name, "", -1); }

(function(){
/*var style = document.createElement('link');
style.href = "http://sigcomments.com/style/icons/css/ionicons.css";
style.rel="stylesheet";
style.type="text/css";
style.media="screen";
var ss = document.getElementsByTagName('script')[0]; 
ss.parentNode.insertBefore(style, ss);*/
    
    
var loadTo = 'sigCommentsBlock';
var loaderImgSrc = 'http://sigcomments.com/icons/loader.gif';

/*if (document.getElementById('sigCommentsBlock') == null) {
    var bl = document.createElement('div');
    bl.id = 'sigCommentsBlock';
    document.body.appendChild(bl);
}*/
if (document.getElementById('sigCommentsBlock') == null) {
    return false;
}

document.getElementById('sigCommentsBlock').innerHTML = '<div style="padding:20px; width: 100px; margin: 0px auto; text-align: center;" id="sigCommentsLoading"><img src="'+loaderImgSrc+'"/></div>';

/*document.getElementById('sigCommentsBlock').innerHTML = '<div style="background-color:white;padding:20px;border: 1px solid rgb(242,242,242); width: 100px; margin: 0px auto; text-align: center;" id="sigCommentsLoading"><div class=".ion-loading-c" style="font-size: 32px;"></div></div>';*/
/*document.getElementById('sigCommentsBlock').innerHTML = '<div style="padding:20px; text-align: center;" id="sigCommentsLoading"><div class="ion-loading-c" style="font-size: 32px;"></div></div>';*/
/*jQuery('<link href="http://sigcomments.com/style/icons/css/ionicons.css" rel="stylesheet" type="text/css" media="screen" />').prependTo(jQuery('body'));*/



function init () {
    if (typeof jQuery != 'undefined' && typeof pm != 'undefined' && typeof FrameManager != 'undefined') {
        jQuery.ajax({
            url: "http://sigcomments.com/core/ajax.php",
            type: "POST",
            data: {
                "function":"init_chat",
                "host_id":1183          },
            dataType: 'json',
            success: function (otvet) {
                var chatBlockId = 'chatBlockBox';
                var frameId = 'gChatFrame';
                otvet.loadTo = loadTo;
                if (typeof otvet.license != 'undefined' && otvet.license == 1 && otvet.chatCode != '') {
                    if (typeof otvet.loadTo != 'undefined') {
                        if (jQuery("#"+chatBlockId).length > 0) {
                            jQuery("#"+chatBlockId).remove();
                        }
                        if (otvet.loadTo == 'document' || otvet.loadTo == '') {
                            var positionValue = 'right:0px;bottom:0px;';
                            for (var fNum in otvet.chatStyle) {
                                var tArr = fNum.split('|');
                                var elem_idName = tArr[0];
                                var style_name = tArr[1];
                                var styleValue = otvet.chatStyle[fNum];
                                
                                if (elem_idName == 'positionParams' && $.trim(styleValue) != '') {
                                    positionValue += style_name + ':' + styleValue + ';';
                                }
                                
                            }
                            jQuery('<div id="'+chatBlockId+'" style="display:block;position: fixed; z-index:99999; '+positionValue+'">'+otvet.chatCode+'</div>').prependTo(jQuery('body'));
                        } else {
                            var loadBlock = jQuery("#"+otvet.loadTo);
                            if (loadBlock.length > 0) {
                                /*loadBlock.html('');*/
                                var tmpFr = jQuery('<div id="'+chatBlockId+'">'+otvet.chatCode+'</div>');
                                tmpFr.appendTo(loadBlock);
                            }
                        }
                        /*jQuery("#"+chatBlockId).draggable({
                            scroll: false
                        });*/
                        setTimeout(function(){
                            var cFrame = jQuery("#gChatFrame");
                            cFrame.on('load',function (){
                                
                                if (location.hash != "") {
                                    var scA = location.hash.substr(1);
                                    var scS = scA.split('_');
                                    if (scS[0]=='sc') {
                                        if (scS.length == 2) {
                                            var scId = parseInt(scS[1],10);
                                            if (!isNaN(scId)) {
                                                pm({
                                                  target: window.frames[frameId],
                                                  type:   "scrollToMessage", 
                                                  data:   {
                                                    id:scId
                                                  }
                                                });
                                            } else {
                                                var distTop = jQuery("#gChatFrame").offset().top;
                                                if (distTop > 150) distTop -= 150;
                                                jQuery("html, body").animate({ scrollTop: distTop+"px" },400);
                                            }
                                        } else {
                                            var distTop = jQuery("#gChatFrame").offset().top;
                                            if (distTop > 150) distTop -= 150;
                                            jQuery("html, body").animate({ scrollTop: distTop+"px" },400);
                                        }
                                    }
                                }

                                
                                window.sigCommentsReady = true;
                                jQuery('#sigCommentsLoading').remove();
                                pm({
                                  target: window.frames[frameId],
                                  type:   "sendStyles", 
                                  data:   {
                                    chatStyle:otvet.chatStyle
                                  }
                                });
                                var sgAuthKey = readCookie('sigcomments_auth_key_client');
                                /*if (sgAuthKey != null) {*/
                                    pm({
                                        target: window.frames[frameId],
                                        type:   "sendAuthKey", 
                                        data:   {
                                            auth_key:sgAuthKey
                                        }
                                    });
                                /*}*/
                                pm.bind("sendCommentsCount", function (data) {
                                    if (typeof data['count'] != 'undefined')
                                        var commentCount = data['count'];
                                    else 
                                        var commentCount = 0;
                                    jQuery(".sigCommentsCount").text(commentCount);
                                    if (typeof SigComments_count == "function") {
                                        SigComments_count(commentCount);
                                    }
                                });
                                pm.bind("updateCommentsCount", function (data) {
                                    if (typeof data['count'] != 'undefined')
                                        var commentCount = data['count'];
                                    else 
                                        var commentCount = 0;
                                    if (typeof SigComments_updateCount == "function") {
                                        SigComments_updateCount(commentCount);
                                    }
                                });
                                pm.bind("scrollToIFRTop", function(data) {
                                    var distTop = jQuery("#gChatFrame").offset().top + data['distTop'];
                                    if (distTop > 150) distTop -= 150;
                                    jQuery("html, body").animate({ scrollTop: distTop+"px" },400);
                                    return true;
                                });
                                pm.bind("getBlockText", function(data) {
                                    var blocks_id = data.blocks_id;
                                    var blocksText = {
                                        
                                    }
                                    for (var i in blocks_id) {
                                        if (jQuery(blocks_id[i]).length > 0) {
                                            if (blocks_id[i].substring(0,1) == '.') {
                                                var bt = 'class';
                                            } else {
                                                var bt = 'id';
                                            }
                                            blocksText['{'+bt+':'+blocks_id[i].substring(1)+'}']=   "<b>"+jQuery(blocks_id[i]).eq(0).text()+"</b>";
                                        }
                                    }
                                    return blocksText;
                                });
                                pm.bind("getWindowLocation", function (data) {
                                    return window.location.href;
                                });
                                pm.bind("saveAuthKey", function(data) {
                                    var auth_key = data['auth_key'];
                                    createCookie('sigcomments_auth_key_client',auth_key,9999);
                                    /*console.log('save CC auth_key: '+auth_key);*/
                                    return 'success';
                                });
                                pm.bind("removeAuthKey", function() {
                                    eraseCookie('sigcomments_auth_key_client');
                                    /*console.log('remove CC auth_key');*/
                                    return 'success';
                                });
                            });
                        },10);
                    }
                } else {
                    jQuery("#"+otvet.loadTo).html('');
                }
            }
        });
    } else {
        setTimeout(function(){ init(); },300);
    }
}

setTimeout(function(){
    if (typeof jQuery != "undefined") {
        if (jQuery('#sigCommentsLoading').length > 0) jQuery('#sigCommentsLoading').remove();
    } else {
        var elem = document.getElementById('sigCommentsLoading');
        elem.parentNode.removeChild(elem);
    }
},5000);

var jq = document.createElement('script'); 
jq.type = 'text/javascript';
/*jq.src = 'http://code.jquery.com/jquery-latest.min.js';*/
jq.src = 'http://sigcomments.com/core/js/jquery.js';
document.getElementsByTagName('head')[0].appendChild(jq);
var pmf = document.createElement('script');
pmf.type = 'text/javascript';
pmf.src = 'http://sigcomments.com/core/chat/postmessage.js';
document.getElementsByTagName('head')[0].appendChild(pmf);
var pmf = document.createElement('script');
pmf.type = 'text/javascript';
pmf.src = 'http://sigcomments.com/core/chat/FrameManager.js';
document.getElementsByTagName('head')[0].appendChild(pmf);
window.sigCommentsReady = false;
init();
})();
