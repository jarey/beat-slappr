var divPlayPause, cmbInstrument, txtTempo, cmdSetTempo;

var channelArr = []
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
    channelArr = [
        new AudioChannel({src: "samples/808-kick.ogg"}),
        new AudioChannel({src: "samples/808-snare.ogg"}),
        new AudioChannel({src: "samples/808-clap.ogg"}),
        new AudioChannel({src: "samples/808-lowconga.ogg"}),
        new AudioChannel({src: "samples/808-hiconga.ogg"}),
        new AudioChannel({src: "samples/808-cymbal.ogg"}),
        new AudioChannel({src: "samples/808-closedhh.ogg"}),
        new AudioChannel({src: "samples/808-openhh.ogg"})
    ];

    window.onkeydown = keyDownHandler;
    window.onkeyup = releaseAll;

    instrumentArr = $("divInstrument").getElementsByTagName('div');
    for(var n=0; n<instrumentChannels; n++) {
        instrumentArr[n].onmousedown = _playInstrument(n);
        instrumentArr[n].onmouseup = releaseHandler(n);
    }

    divStepArr = $("divStepWrapper").getElementsByTagName('div');
    for(var n=0; n<totalSteps; n++) {
        sequenceArr[n] = [];
        divStepArr[n].onclick = _toggleInstrument(n);
    }
    
    divPlayPause = $('divPlayPause');
    cmbInstrument = $("cmbInstrument");
    txtTempo = $("txtTempo");
    cmdSetTempo = $("cmdSetTempo");
    
    divPlayPause.onclick = function() {togglePlay(); return false;};
    cmdSetTempo.onclick = setTempo;
    cmbInstrument.onclick = selectInstrument;
    
    txtTempo.value = tempo;
    setTempo();
};

function _playInstrument(index) {
    return function() {
        playInstrument(index);
        return false;
    };
}

function playInstrument(index) {
    setInstrumentClass(index);
    channelArr[index].play();
}

function keyDownHandler(e) {
    if(!e) {
        var e = window.event;
    }
    switch(e.keyCode) {
        case 32:
            togglePlay();
            break;
        case 65:
            playInstrument(0);
            break;
        case 68:
            playInstrument(2);
            break;
        case 70:
            playInstrument(3);
            break;
        case 71:
            playInstrument(4);
            break;
        case 74:
            playInstrument(5);
            break;
        case 75:
            playInstrument(6);
            break;
        case 76:
            playInstrument(7);
            break;
        case 83:
            playInstrument(1);
            break;
    }
}

function releaseHandler(index) {
    return function() {
        instrumentArr[index].className = '';
    };
}

function releaseAll() {
    for(var n=0; n<instrumentChannels; n++) {
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
        channelArr[sequenceArr[currentStep-1][n]].play();
    }

    lastStep = currentStep;
    currentStep++
    currentStep = (currentStep > totalSteps) ? 1 : currentStep;
    sequencerTimer = setTimeout("runSequencer();", sequencerTimeoutLength);
}

function _toggleInstrument(index) {
    return function() {
        toggleInstrument(index);
    };
}

function toggleInstrument(step) {
    var instrument = cmbInstrument.value;
    for(var n=0; n<sequenceArr[step].length; n++) {
        if (sequenceArr[step][n] == instrument) {
            sequenceArr[step].splice(n,1);
            removeClass(divStepArr[step], 'clsStepOn');
            return;
        }
    }
    sequenceArr[step].push(instrument);
    addClass(divStepArr[step], 'clsStepOn');
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
