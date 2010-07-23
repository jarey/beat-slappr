var divPlayPause, txtTempo, cmdSetTempo;

var channelArr = []
var instrumentArr = [];
var divStepArr = [];
var sequenceArr = [];
var currentInstrument;

var playerState = 'paused';
var instrumentChannels = 16;
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
        new AudioChannel({src: "samples/808-openhh.ogg"}),

        new AudioChannel({src: "samples/mt_hit_dacado.ogg"}),
        new AudioChannel({src: "samples/mt_hit_domba.ogg"}),
        new AudioChannel({src: "samples/mt_hit_dunna.ogg"}),
        new AudioChannel({src: "samples/mt_hit_echofalls.ogg"}),
        new AudioChannel({src: "samples/mt_hit_glatch.ogg"}),
        new AudioChannel({src: "samples/mt_hit_glitchburn.ogg"}),
        new AudioChannel({src: "samples/mt_hit_glitchvoc.ogg"}),
        new AudioChannel({src: "samples/mt_hit_hitack.ogg"})
    ];

    window.onkeydown = keyDownHandler;
    window.onkeyup = releaseAll;

    instrumentArr = getElementsByClassName('drumPad');
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
    txtTempo = $("txtTempo");
    cmdSetTempo = $("cmdSetTempo");
    
    divPlayPause.onclick = function() {togglePlay(); return false;};
    cmdSetTempo.onclick = setTempo;
    
    txtTempo.value = tempo;
    setTempo();
};

function _playInstrument(index) {
    return function() {
        playInstrument(index);
        for(var n=0; n<instrumentChannels; n++) {
            if(n == index) {
                addClass(instrumentArr[n].parentNode, 'clsStepOn');
                currentInstrument = index;
                selectInstrument();
            }else {
                removeClass(instrumentArr[n].parentNode, 'clsStepOn');
            }
        }
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
            playInstrument(8);
            break;
        case 68:
            playInstrument(10);
            break;
        case 70:
            playInstrument(11);
            break;
        case 71:
            playInstrument(12);
            break;
        case 74:
            playInstrument(13);
            break;
        case 75:
            playInstrument(14);
            break;
        case 76:
            playInstrument(15);
            break;
        case 83:
            playInstrument(9);
            break;
        case 81:
            playInstrument(0);
            break;
        case 87:
            playInstrument(1);
            break;
        case 69:
            playInstrument(2);
            break;
        case 82:
            playInstrument(3);
            break;
        case 84:
            playInstrument(4);
            break;
        case 85:
            playInstrument(5);
            break;
        case 73:
            playInstrument(6);
            break;
        case 79:
            playInstrument(7);
            break;
    }
}

function releaseHandler(index) {
    return function() {
        removeClass(instrumentArr[index], 'clsInstrumentActive');
    };
}

function releaseAll() {
    for(var n=0; n<instrumentChannels; n++) {
        removeClass(instrumentArr[n], 'clsInstrumentActive');
    }
}

function setInstrumentClass(el) {
    addClass(instrumentArr[el], 'clsInstrumentActive');
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
    var lastStepIndex = lastStep-1;
    var currentStepIndex = currentStep-1;
    var stepArr = sequenceArr[currentStepIndex];
    
    //Update GUI
    removeClass(divStepArr[lastStepIndex], 'clsStepCurrent');
    addClass(divStepArr[currentStepIndex], 'clsStepCurrent');

    //2. Play sounds for current step
    for(var n=0; n<stepArr.length; n++) {
        channelArr[stepArr[n]].play();
    }

    lastStep = currentStep;
    currentStep++
    if(currentStep > totalSteps) {
        currentStep = 1;
    }

    sequencerTimer = setTimeout(runSequencer, sequencerTimeoutLength);
}

function _toggleInstrument(index) {
    return function() {
        toggleInstrument(index);
    };
}

function toggleInstrument(step) {
    if(currentInstrument >= 0) {
        for(var n=0; n<sequenceArr[step].length; n++) {
            if (sequenceArr[step][n] == currentInstrument) {
                sequenceArr[step].splice(n,1);
                removeClass(divStepArr[step], 'clsStepOn');
                return;
            }
        }
        sequenceArr[step].push(currentInstrument);
        addClass(divStepArr[step], 'clsStepOn');
    }
}

function selectInstrument() {
    for(var n=0; n<totalSteps; n++) {
        removeClass(divStepArr[n], 'clsStepOn');
        for(var m=0; m<sequenceArr[n].length; m++) {
            if(sequenceArr[n][m] == currentInstrument) {
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

function getElementsByClassName(className) {
    elArr = document.getElementsByTagName('*');
    elClassArr = [];
    for(var n=0; n<elArr.length; n++) {
        if(elArr[n].className == className) {
            elClassArr.push(elArr[n]);
        }
    }
    return elClassArr;
}

function $(el) {
    return document.getElementById(el);
}
