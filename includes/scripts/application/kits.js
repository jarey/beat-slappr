var kitModal;
var currentKit;
var kitCache = [];


//lK is defined in the homepage dynamically.  It stands for loadKit.
//This defines the initial kit to load on page load.
var lK;



/***KITS***/

function _isCached(id) {
    for(var prop in kitCache) {
        if(kitCache[prop].id == id) {
            return prop;
        }
    }
    return false;
}

function setSystemKitHandler(obj, kitName, kitId) {
    if(obj.success) {
        var response = decodeJSON(obj.response);
        var record;
        var mime = "";

        currentKit.innerHTML = kitName;
        sequenceArr.kit = {id: kitId, name: kitName};

        if(audioFormat == 'ogg') {
            mime = 'ogg';
        }else if(audioFormat == 'mp3') {
            mime = 'mpeg';
        }
        
        for(n=0; n<instrumentChannels; n++) {
            instrumentNameArr[n].innerHTML = "";
            channelArr[n].setSrc("");

            record = response[n];
            instrumentNameArr[record.channel].innerHTML = record.name;
            channelArr[record.channel].setSrc("data:audio/" + mime + ";base64," + record.src);
        }

        if(!_isCached(kitId)) {
            kitCache.push({id: kitId, val: obj});
        }

        kitModal.hide();
    }else {
        return false;
    }
}

function setSystemKit(kitName, kitId) {
    kitModal.setContent("<div style='width: 16px; height: 16px; margin: 10px auto;'><img src='includes/images/ajax-loader.gif' /></div>");
    var ajax = new Kodiak.Data.Ajax();

    var cacheIndex = _isCached(kitId);
    if(cacheIndex) {
        setSystemKitHandler(kitCache[cacheIndex].val, kitName, kitId);
        return;
    }

    ajax.request({
        url:    'api/kit.php',
        method: 'post',
        parameters: {cmd: 'getKitChannels', id: kitId, format: audioFormat},
        handler: function(obj) {setSystemKitHandler(obj, kitName, kitId);}
    });
}

/***INIT***/


function kitInit() {
    currentKit = $("currentKit");

    kitModal = new Kodiak.Controls.Modal({
        applyTo:      'aKitModal',
        componentId:  'kitModal',
        modalClass:   'modalWindow kitModal',
        orientation:  'right',
        closeOnBlur:  true,
        onBeforeShow: function() {
            this.setContent($('txtKitWindow').value);
        }
    });

    if(typeof(lK) == 'object') {
        setSystemKit(lK[0], lK[1]);
    }
}

if(window.addEventListener) {
    window.addEventListener('load', kitInit, false);
}else {
    window.attachEvent('onload', kitInit);
}
