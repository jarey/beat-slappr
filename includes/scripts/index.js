var audBassDrum, audClap, audClosedHH, audOpenHH, audCymbal, audSnare, audLowConga, audHiConga;
var divPlayPause, cmbInstrument, txtTempo;

var instrumentArr = [];
var divStepArr = [];
var sequenceArr = [];

var playerState = 'paused';
var instrumentChannels = 8;
var currentStep = 1;
var totalSteps = 16;
var tempo = 120;
var lastStep = totalSteps;
var sequencerTimer;
var sequencerTimeoutLength;

window.onload = function() {
    audBassDrum = new AudioChannel({src: "samples/808-kick.ogg"});
    audClosedHH = new AudioChannel({src: "samples/808-closedhh.ogg"});
    audOpenHH = new AudioChannel({src: "samples/808-openhh.ogg"});
    audClap = new AudioChannel({src: "samples/808-clap.ogg"});
    audCymbal = new AudioChannel({src: "samples/808-cymbal.ogg"});
    audSnare = new AudioChannel({src: "samples/808-snare.ogg"});
    audLowConga = new AudioChannel({src: "samples/808-lowconga.ogg"});
    audHiConga = new AudioChannel({src: "samples/808-hiconga.ogg"});
    window.onkeydown = keyDownHandler;
    window.onkeyup = keyUpHandler

    divPlayPause = $('divPlayPause');

    for(var n=0; n<instrumentChannels; n++) {
        instrumentArr[n] = $('instrument' + n);
        instrumentArr[n].onmouseup = keyUpHandler;
    }

    for(var n=0; n<totalSteps; n++) {
        sequenceArr[n] = [];
    }
    
    divStepArr = $("divStepWrapper").getElementsByTagName('div');
    cmbInstrument = $("cmbInstrument");
    txtTempo = $("txtTempo");
    
    txtTempo.value = tempo;
    setTempo();
};

function keyDownHandler(e) {
    if(!e) {
        var e = window.event;
    }
    switch(e.keyCode) {
        case 32:
            togglePlay();
            break;
        case 65:
            setInstrumentClass(0);
            audBassDrum.play();
            break;
        case 68:
            setInstrumentClass(2);
            audClap.play();
            break;
        case 70:
            setInstrumentClass(3);
            audLowConga.play();
            break;
        case 71:
            setInstrumentClass(4);
            audHiConga.play();
            break;
        case 74:
            setInstrumentClass(5);
            audCymbal.play();
            break;
        case 75:
            setInstrumentClass(6);
            audClosedHH.play();
            break;
        case 76:
            setInstrumentClass(7);
            audOpenHH.play();
            break;
        case 83:
            setInstrumentClass(1);
            audSnare.play();
            break;
    }
}

function keyUpHandler() {
    for(var n=0; n<instrumentArr.length; n++) {
        instrumentArr[n].className = '';
    }
}

function setInstrumentClass(el) {
    instrumentArr[el].className = 'clsInstrumentActive';
}

function togglePlay() {
    playerState = (playerState == 'playing') ? 'paused' : 'playing';
    togglePlayer(playerState);
}

function togglePlayer(state) {
    if(state == 'playing') {
        divPlayPause.innerHTML = "|&nbsp;|";
        runSequencer();
    }else if(state == 'paused') {
        divPlayPause.innerHTML = ">";
        clearTimeout(sequencerTimer);       
    }
}

function runSequencer() {
    //Update GUI
    removeClass(divStepArr[lastStep-1], 'clsStepCurrent');
    addClass(divStepArr[currentStep-1], 'clsStepCurrent');

    //2. Play sounds for current step
    for(var n=0; n<sequenceArr[currentStep-1].length; n++) {
        instrumentArr[sequenceArr[currentStep-1][n]].onmousedown();
    }

    lastStep = currentStep;
    currentStep++
    currentStep = (currentStep > totalSteps) ? 1 : currentStep;
    sequencerTimer = setTimeout("runSequencer();", sequencerTimeoutLength);
}

function toggleInstrument(step) {
    var instrument = cmbInstrument.value;
    for(var n=0; n<sequenceArr[step-1].length; n++) {
        if (sequenceArr[step-1][n] == instrument) {
            sequenceArr[step-1].splice(n,1);
            removeClass(divStepArr[step-1], 'clsStepOn');
            return;
        }
    }
    sequenceArr[step-1].push(instrument);
    addClass(divStepArr[step-1], 'clsStepOn');
}

function selectInstrument() {
    var instrument = cmbInstrument.value;
    for(var n=0; n<totalSteps; n++) {
        removeClass(divStepArr[n], 'clsStepOn');
        for(var m=0; m<sequenceArr[n].length; m++) {
            if(sequenceArr[n][m] == instrument) {
                addClass(divStepArr[n], 'clsStepOn');
                break;
            }
        }
    }
}

function setTempo() {
    tempo = txtTempo.value;
    sequencerTimeoutLength = (1000*((60/tempo)/4));
}

function hasClass(ele,cls) {
    return ele.className.match(new RegExp('(\\s|^)'+cls+'(\\s|$)'));
}

function addClass(ele,cls) {
    if(!this.hasClass(ele,cls)) {
        ele.className += " " + cls;
    }
}

function removeClass(ele,cls) {
    if (hasClass(ele,cls)) {
        var reg = new RegExp('(\\s|^)'+cls+'(\\s|$)');
        ele.className=ele.className.replace(reg,' ');
    }
}

function $(el) {
    return document.getElementById(el);
}
