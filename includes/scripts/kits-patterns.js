var loginModal, signupModal, savePatternModal, kitModal, patternModal;
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
        applyTo:     'aPatternModal',
        componentId: 'patternModal',
        modalClass:  'modalWindow kitPatternModal',
        orientation: 'right',
        closeOnBlur: true,
        content: $('txtPatternWindow').value
    });

    loginModal = new Kodiak.Controls.Modal({
        applyTo:     'lblLogin',
        componentId: 'loginModal',
        modalClass:  'modalWindow accountModal',
        orientation: 'right',
        content:     $('txtLoginWindow').value,
        onShowComplete: function() {$('txtLoginEmail').focus();}
    });

    signupModal = new Kodiak.Controls.Modal({
        applyTo:     'lblSignUp',
        componentId: 'signupModal',
        modalClass:  'modalWindow accountModal',
        orientation: 'right',
        content:     $('txtSignupWindow').value,
        onShowComplete: function() {$('txtSignupEmail').focus();}
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
            setSystemKit(kitArr[1]['id'], kitArr[1]['name']);
        }
    }else {
        return false;
    }
}

function setKitContent() {
    var str = "<div class='modalWrapper'>";
    for(var kit in kitArr) {
        kit = kitArr[kit];
        str += "<div class='modalWrapperRow' onclick='setSystemKit(" + kit.id + ", \"" + kit.name + "\");'>" + kit.name + "</div>";
    }
    str += "</div>";
    this.setContent(str);
}

function setSystemKit(val, kitName) {
    var ajax = new Kodiak.Data.Ajax();
    ajax.request({
        url:    'api/system.php',
        method: 'post',
        parameters: {cmd: 'getKitChannels', id: val, format: audioFormat},
        handler: function(obj) {setSystemKitHandler(obj, val, kitName);}
    });
}

function setSystemKitHandler(obj, id, kitName) {
    if(obj.success) {
        var response = decodeJSON(obj.response);
        var record;
        var mime = "";

        currentKit.innerHTML = kitName;
        kitModal.hide();
        sequenceArr.kit = id;

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
