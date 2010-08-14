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

    patternModal = new Kodiak.Controls.Modal({
        applyTo:     'aPatternModal',
        componentId: 'patternModal',
        modalClass:  'modalWindow kitPatternModal',
        orientation: 'right',
        closeOnBlur: true,
        content: $('txtPatternWindow').value
    });

    savePatternModal = new Kodiak.Controls.Modal({
        applyTo:     'lblSavePattern',
        componentId: 'savePatternModal',
        modalClass:  'modalWindow',
        content:     $('txtSavePatternWindow').value
    });

    var ajax = new Kodiak.Data.Ajax();
    ajax.request({
        url:    'api/system.php',
        method: 'post',
        parameters: {cmd: 'getKits'},
        handler: function(obj) {getSystemKitHandler(obj, true);}
    });
}

/***END INIT***/

/***KITS***/

function getSystemKitHandler(obj, init) {
    if(obj.success) {
        kitModal = new Kodiak.Controls.Modal({
            applyTo:      'aKitModal',
            componentId:  'kitModal',
            modalClass:   'modalWindow kitPatternModal',
            orientation:  'right',
            closeOnBlur:  true,
            onBeforeShow: setKitContent
        });

        kitArr = decodeJSON(obj.response);

        if(init) {
            setSystemKit(kitArr[1]['id']);
        }
    }else {
        return false;
    }
}

function setKitContent() {
    var str = "<div class='modalWrapper'>";
    var n=0;
    for(var kit in kitArr) {
        kit = kitArr[kit];
        str += "<div class='modalWrapperRow' onclick='setSystemKit(" + n + ");'>" + kit.name + "</div>";
        n++;
    }
    str += "</div>";
    this.setContent(str);
}

function setSystemKit(val) {
    var ajax = new Kodiak.Data.Ajax();
    ajax.request({
        url:    'api/system.php',
        method: 'post',
        parameters: {cmd: 'getKitChannels', id: kitArr[val]['id'], format: audioFormat},
        handler: function(obj) {setSystemKitHandler(obj, val);}
    });
}

function setSystemKitHandler(obj, id) {
    if(obj.success) {
        var response = decodeJSON(obj.response);
        var record;
        var mime = "";

        currentKit.innerHTML = kitArr[id]['name'];
        kitModal.hide();
        sequenceArr.kit = kitArr[id]['id'];

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
