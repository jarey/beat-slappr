var patternModal, savePatternModal;

/***INIT***/

if(window.addEventListener) {
    window.addEventListener('load', patternInit, false);
}else {
    window.attachEvent('onload', patternInit);
}

function patternInit() {
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
}


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
