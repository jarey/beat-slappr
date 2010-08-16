var kitModal;
var currentKit;
var kitArr = [];

/***INIT***/

if(window.addEventListener) {
    window.addEventListener('load', kitInit, false);
}else {
    window.attachEvent('onload', kitInit);
}

function kitInit() {
    currentKit = $("currentKit");

    kitModal = new Kodiak.Controls.Modal({
        applyTo:      'aKitModal',
        componentId:  'kitModal',
        modalClass:   'modalWindow kitPatternModal',
        orientation:  'right',
        closeOnBlur:  true,
        onBeforeShow: function() {
            this.setContent($('txtKitWindow').value);
        }
    });

    loadKit();
}


/***KITS***/

function setSystemKit(kitName, kitId) {
    kitModal.setContent("<div style='width: 16px; height: 16px; margin: 10px auto;'><img src='includes/images/ajax-loader.gif' /></div>");
    var ajax = new Kodiak.Data.Ajax();
    ajax.request({
        url:    'api/kit.php',
        method: 'post',
        parameters: {cmd: 'getKitChannels', id: kitId, format: audioFormat},
        handler: function(obj) {setSystemKitHandler(obj, kitName, kitId);}
    });
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
        kitModal.hide();
    }else {
        return false;
    }
}
