var audBassDrum, audClap, audClosedHH, audOpenHH, audCymbal, audSnare, audLowConga, audHiConga;
var divPlayPause;
var instrumentArr = [];
var divStepArr = [];

var playerState = 'paused';
var currentStep = 1;
var totalSteps = 16;
var lastStep = totalSteps;
var sequencerTimer;
var tempo = 120;
var sequencerTimeoutLength = (1000*((60/tempo)/4));

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

    for(var n=0; n<8; n++) {
        instrumentArr[n] = $('instrument' + n);
        instrumentArr[n].onmouseup = keyUpHandler;
    }
    divStepArr = $("divStepWrapper").getElementsByTagName('div');
};

function keyDownHandler(e) {
    if(!e) {
        var e = window.event;
    }

    switch(e.keyCode) {
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
    removeClass(divStepArr[lastStep-1], 'clsStepCurrent');
    addClass(divStepArr[currentStep-1], 'clsStepCurrent');
    /*
        1. Update GUI
        2. Play sounds for current step
    */
    //console.log(lastStep + " " + currentStep);
    lastStep = currentStep;
    currentStep++
    currentStep = (currentStep > totalSteps) ? 1 : currentStep;
    sequencerTimer = setTimeout("runSequencer();", sequencerTimeoutLength);
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
