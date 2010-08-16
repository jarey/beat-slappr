var kitModal, patternModal, savePatternModal;
var currentKit;
var kitArr = [];

/***INIT***/

if(window.addEventListener) {
    window.addEventListener('load', kitPatternInit, false);
}else {
    window.attachEvent('onload', kitPatternInit);
}

function kitPatternInit() {
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

    patternModal = new Kodiak.Controls.Modal({
        applyTo:     'aPatternModal',
        componentId: 'patternModal',
        modalClass:  'modalWindow kitPatternModal',
        orientation: 'right',
        closeOnBlur: true,
        content:     $('txtPatternWindow').value
    });

    savePatternModal = new Kodiak.Controls.Modal({
        applyTo:     'lblSavePattern',
        componentId: 'savePatternModal',
        modalClass:  'modalWindow',
        content:     $('txtSavePatternWindow').value
    });

    kitInit();
}

/***END INIT***/

/***KITS***/

function setSystemKit(kitName, kitId) {
    kitModal.setContent("<div style='width: 16px; height: 16px; margin: 10px auto;'><img src='includes/images/ajax-loader.gif' /></div>");
    var ajax = new Kodiak.Data.Ajax();
    ajax.request({
        url:    'api/system.php',
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
        sequenceArr.kit = kitId;

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

/***END KITS***/

/***PATTERNS***/

function getPattern() {
    var str = encodeJSON(sequenceArr);
    return str;
}

function setPattern(val) {
    if(val) {
        sequenceArr = decodeJSON(val);
        stepsWidget.setValue(parseInt(sequenceArr.steps));
        tempoWidget.setValue(parseInt(sequenceArr.tempo));
        setSystemKit(parseInt(sequenceArr.kit));
    }
}

/***END PATTERNS***/
