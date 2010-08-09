var cmbSystemKit;

/***INIT***/

if(window.addEventListener) {
    window.addEventListener('load', kitPatternInit, false);
}else {
    window.attachEvent('onload', kitPatternInit);
}

function kitPatternInit() {
    cmbSystemKit = $('cmbSystemKit');

    cmbSystemKit.onchange = function() {setSystemKit(this.value);};

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
        var response = decodeJSON(obj.response);
        var str = "";
        for(var record in response) {
            record = response[record];
            str += "<option value='" + record.id + "'>" + record.name + "</option>";
        }
        cmbSystemKit.innerHTML = str;
        if(init) {
            cmbSystemKit.value = 1;
            cmbSystemKit.onchange();
        }
    }else {
        return false;
    }
}

function setSystemKit(val) {
    var ajax = new Kodiak.Data.Ajax();
    ajax.request({
        url:    'api/system.php',
        method: 'post',
        parameters: {cmd: 'getKitChannels', id: val, format: audioFormat},
        handler: function(obj) {setSystemKitHandler(obj, val);}
    });
}

function setSystemKitHandler(obj, id) {
    if(obj.success) {
        var response = decodeJSON(obj.response);
        var record;
        var mime = "";

        cmbSystemKit.value = id;
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
