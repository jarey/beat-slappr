var divPlayPause, divJumpToStart, divClearPattern, divTempo, txtTempo, divSteps, txtSteps, divLoopPosition, divVolume, txtVolume;

var channelArr = [];
var instrumentNameArr = [];
var instrumentArr = [];
var divStepArr = [];
var sequenceArr = {
    tempo:    0,
    steps:    0,
    kit:      0,
    pattern: []
};

var volumeSliderArr = [];
var muteBtnArr = [];
var soloBtnArr = [];
var divViewBarArr = [];

var playerState = 'paused';
var instrumentChannels = 16;

var currentStep    =  1;
var totalSteps     = 16;

var currentMeasure =  1;
var totalMeasures  =  1;

var beatLength     =  4;
var measureLength  = 16;
var beatsPerMeasure = (measureLength / beatLength);

var lastStep = totalSteps;
var sequencerTimer;
var sequencerTimeoutLength;
var currentInstrument;
var tempoSlider;
var stepsSlider;
var masterVolumeSlider;
var masterVolume;
var audioFormat;
var soloCount = 0;

if(window.addEventListener) {
    window.addEventListener('load', init, false);
}else {
    window.attachEvent('onload', init);
}

function init() {
    divPlayPause = $('divPlayPause');
    divJumpToStart = $('divJumpToStart');
    divClearPattern = $('divClearPattern');
    
    divTempo = $("divTempo");
    txtTempo = $("txtTempo");
    divSteps = $("divSteps");
    txtSteps = $("txtSteps");
    divVolume = $("divVolume");
    txtVolume = $("txtVolume");
    divLoopPosition = $("divLoopPosition");
    
    var validAudioFormats = new AudioChannel().getValidFormats();
    
    window.onkeydown = keyDownHandler;
    window.onkeyup = releaseAll;

    instrumentArr = getElementsByClassName('drumPad');
    volumeSliderArr = getElementsByClassName('divVolumeSlider');
    muteBtnArr = getElementsByClassName('channelMute');
    soloBtnArr = getElementsByClassName('channelSolo');
    instrumentNameArr = getElementsByClassName('instrumentName');

    divStepArr = $("divStepWrapper").getElementsByTagName('div');
    divViewBarArr = $("divViewBarInnerWrapper").getElementsByTagName('div');
    for(var n=0; n<divViewBarArr.length; n++) {
        divViewBarArr[n].onmousedown = _setCurrentMeasure(n+1);
    }

    for(var n=0; n<instrumentChannels; n++) {
        instrumentArr[n].onmousedown = _playInstrument(n);
        instrumentArr[n].onmouseup = releaseHandler(n);

        channelArr[n] = new AudioChannel();

        muteBtnArr[n].onmousedown = _toggleMute(n);
        soloBtnArr[n].onmousedown = _toggleSolo(n);
        volumeSliderArr[n] = new Slider({
        	minValue:       0,
	        maxValue:       100,
	        initValue:      75,
	        container:      volumeSliderArr[n],
	        containerClass: 'sliderOutter',
	        sliderClass:    'sliderInner',
	        title:          function(val) {return "Volume: " + val;},
	        onSlide:        _setVolume(n)
        });
    }

    tempoSlider = new Slider({
    	minValue:        20,
        maxValue:        200,
        initValue:       120,
        container:       divTempo,
        containerClass:  'sliderOutter',
        sliderClass:     'sliderInner',
        title:           function(val) {return "Tempo: " + val + "BPM";},
        onSlide:         updateTempoGUI,
        onSlideComplete: setTempo
    });
    
    stepsSlider = new Slider({
    	minValue:         1,
        maxValue:         64,
        initValue:        16,
        container:        divSteps,
        containerClass:   'sliderOutter',
        sliderClass:      'sliderInner',
        title:            function(val) {return "Steps: " + val;},
        onSlide:          updateStepsGUI,
        onSlideComplete:  setSteps
    });
    
    masterVolumeSlider = new Slider({
    	minValue:         0,
        maxValue:         100,
        initValue:        75,
        container:        divVolume,
        containerClass:   'sliderOutter',
        sliderClass:      'sliderInner',
        title:            function(val) {return "Master Volume: " + val;},
        onSlide:          updateMasterVolumeGUI,
        onSlideComplete:  setMasterVolume
    });

    var validFormats = channelArr[0].getValidFormats();
    if(validFormats.ogg) {
        audioFormat = 'ogg';
    }else if(validFormats.mp3) {
        audioFormat = 'mp3';
    }else {
        alert("Your browser does not support this app :-\\");
    }

    setStepEvents();
    setCurrentMeasure(currentMeasure);
    updateShuttlePosition();
        
    divPlayPause.onclick = function() {togglePlay(); return false;};
    divJumpToStart.onclick = function() {initLoopPosition(); return false;};
    divClearPattern.onclick = function() {clearPattern(); return false;};

    setTempo(tempoSlider.getValue());
    setSteps(stepsSlider.getValue());
    setMasterVolume(masterVolumeSlider.getValue());

    txtTempo.onkeyup = keyInTempo;
    txtSteps.onkeyup = keyInSteps;
    txtVolume.onkeyup = keyInMasterVolume;
}

function setStepEvents() {
    for(var n=0; n<totalSteps; n++) {
        if(!sequenceArr.pattern[n]) {
            sequenceArr.pattern[n] = [];
        }
    }
    for(n=0; n<measureLength; n++) {
        if(divStepArr[n]) {
            divStepArr[n].onclick = _toggleInstrument(n + ((currentMeasure-1) * measureLength));
        }
    }
}

window.onbeforeunload = function(){
	var message = 'Any unsaved changes will be lost!';
  	return message;
};

function _setVolume(index) {
    return function(val) {
        channelArr[index].setVolume((val/100) * (masterVolume/100));
    }
}

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
        addClass(divPlayPause, 'btnPause');
        removeClass(divPlayPause, 'btnPlay');
        divPlayPause.title = "Pause";
        clearInterval(sequencerTimer);
        runSequencer();
        sequencerTimer = setInterval(runSequencer, sequencerTimeoutLength);
    }else if(state == 'paused') {
        addClass(divPlayPause, 'btnPlay');
        removeClass(divPlayPause, 'btnPause');
        divPlayPause.title = "Play";
        clearInterval(sequencerTimer);
    }
}

function updateShuttlePosition() {
    var measure = Math.ceil(currentStep / measureLength);
    var beat = (Math.ceil(currentStep / beatLength)) - ((measure-1) * beatsPerMeasure);
    var step = currentStep - ((measure-1) * measureLength) - ((beat-1) * beatLength);

    divLoopPosition.innerHTML = measure + "." + beat + "." + step;
}

function initLoopPosition() {
    currentStep = 1;
    currentMeasure = 1;
    setCurrentMeasure(currentMeasure);
}

function clearPattern() {
    var val = confirm("Are you sure you want to clear this pattern?");
    if(val) {
        for(var n=0; n<totalSteps; n++) {
            sequenceArr.pattern[n] = [];
        }
        playerState = 'playing';
        togglePlay();
        initLoopPosition();
    }
}

function setTotalSteps(val) {
    var currentStepIndex = _getCurrentStepIndex();

    initLoopPosition();

    //removeClass(divStepArr[currentStepIndex], 'clsStepCurrent');        
        
    totalSteps = val;
    totalMeasures = Math.ceil(totalSteps/measureLength);
    lastStep = totalSteps;

    setStepEvents();
    selectInstrument();
}

function _setCurrentMeasure(val) {
    return function() {
        setCurrentMeasure(val);
        return false;
    };
}

function setCurrentMeasure(val) {
    if(val <= totalMeasures) {
        var lastStepMeasure = _getLastStepMeasure();
        var currentStepIndex = _getCurrentStepIndex();

        currentMeasure = val;
        for(var n=0; n<divViewBarArr.length; n++) {
            el = divViewBarArr[n];
            if((n+1) == val) {
                addClass(el, 'barCurrent');
            }else {
                removeClass(el, 'barCurrent');
            }
        }

        setStepEvents();
        selectInstrument();

        //if(lastStepMeasure != val) {
        //    removeClass(divStepArr[currentStepIndex], 'clsStepCurrent');
        //}else {
        //    addClass(divStepArr[currentStepIndex], 'clsStepCurrent');
        //}
    }
}

function _getLastStepMeasure() {
    return lastStepMeasure = Math.ceil(lastStep / measureLength);
}

function _getCurrentStepIndex() {
    var lastStepMeasure = _getLastStepMeasure();
    return (lastStep - 1) - ((lastStepMeasure - 1) * measureLength);
}

function runSequencer() {
    //var lastStepMeasure = _getLastStepMeasure();
    //var currentStepMeasure = Math.ceil(currentStep / measureLength);

    //var lastStepIndex = lastStep-1;
    var currentStepIndex = currentStep-1;
    //var lastStepArr = sequenceArr.pattern[lastStepIndex];
    var stepArr = sequenceArr.pattern[currentStepIndex];    

    //updateShuttlePosition();
    
    //Update GUI
    /*
    if(lastStepMeasure == currentMeasure) {
        removeClass(divStepArr[lastStepIndex - ((lastStepMeasure - 1) * measureLength)], 'clsStepCurrent');
    }
    if(currentStepMeasure == currentMeasure) {
        addClass(divStepArr[currentStepIndex - ((currentStepMeasure - 1) * measureLength)], 'clsStepCurrent');
    }

    //Clear trigger illumination from previous step
    for(var n=0; n<lastStepArr.length; n++) {
        releaseHandler(lastStepArr[n])();
    }
    */    

    //2. Play sounds for current step
    for(var n=0; n<stepArr.length; n++) {
        //setInstrumentClass(stepArr[n]);
        channelArr[stepArr[n]].play();
    }
    
    lastStep = currentStep;
    currentStep++
    if(currentStep > totalSteps) {
        currentStep = 1;
    }
}

function _toggleSolo(index) {
    return function() {
        toggleSolo(index);
        return false;
    };
}

function toggleSolo(index) {
    var soloBtn = soloBtnArr[index];

    if(hasClass(soloBtn, 'channelSoloOn')) {
        removeClass(soloBtn, 'channelSoloOn');
        soloCount--;
    }else {
        addClass(soloBtn, 'channelSoloOn');
        soloCount++;
    }

    _setChannelPlayState();
}

function _toggleMute(index) {
    return function() {
        toggleMute(index);
        return false;
    };
}

function toggleMute(index) {
    var muteBtn = muteBtnArr[index];
        if(hasClass(muteBtn, 'channelMuteOn')) {
            removeClass(muteBtn, 'channelMuteOn');
        }else {
            addClass(muteBtn, 'channelMuteOn');
        }
    _setChannelPlayState();
}

function _setChannelPlayState() {
    if(soloCount) {
        for(var n=0; n<instrumentChannels; n++) {
            if(hasClass(soloBtnArr[n], 'channelSoloOn')) {
                if(hasClass(muteBtnArr[n], 'channelMuteOn')) {
                    channelArr[n].setMute(true);
                }else {
                    channelArr[n].setMute(false);
                }
            }else {
                channelArr[n].setMute(true);
            }
        }
    }else {
        for(var n=0; n<instrumentChannels; n++) {
            if(hasClass(muteBtnArr[n], 'channelMuteOn')) {
                channelArr[n].setMute(true);
            }else {
                channelArr[n].setMute(false);
            }
        }
    }
}

function _toggleInstrument(index) {
    return function() {
        toggleInstrument(index);
    };
}

function toggleInstrument(step) {
    var measureStep = (step - ((Math.ceil((step+1)/measureLength)-1) * measureLength));
    if((currentInstrument >= 0) && (step < totalSteps)) {
        for(var n=0; n<sequenceArr.pattern[step].length; n++) {
            if (sequenceArr.pattern[step][n] == currentInstrument) {
                sequenceArr.pattern[step].splice(n,1);
                removeClass(divStepArr[measureStep], 'clsStepOn');
                return;
            }
        }
        sequenceArr.pattern[step].push(currentInstrument);
        addClass(divStepArr[measureStep], 'clsStepOn');
    }
}

function selectInstrument() {
    var start = ((currentMeasure-1) * measureLength);
    var sequenceStep;
    
    for(var n=0; n<measureLength; n++) {
        removeClass(divStepArr[n], 'clsStepOn');
        removeClass(divStepArr[n], 'clsStepDisabled');
        sequenceStep = (n + start);
        if(sequenceStep >= totalSteps) {
            addClass(divStepArr[n], 'clsStepDisabled');
        }else {
            for(var m=0; m<sequenceArr.pattern[sequenceStep].length; m++) {
                if(sequenceArr.pattern[sequenceStep][m] == currentInstrument) {
                    addClass(divStepArr[n], 'clsStepOn');
                    break;
                }
            }
        }
    }
}

function keyInTempo() {
    var val = txtTempo.value;
    
    if(val >= tempoSlider.minValue && val <= tempoSlider.maxValue) {
        tempoSlider.setValue(val);
        setTempo(val);    
    }
}

function updateTempoGUI(val) {
    txtTempo.value = val;
}

function setTempo(val) {
    updateTempoGUI(val);
    sequenceArr.tempo = val;
    sequencerTimeoutLength = (1000*((60/val)/beatLength));
    togglePlayer(playerState);
}

function keyInSteps() {
    var val = txtSteps.value;
    
    if(val >= stepsSlider.minValue && val <= stepsSlider.maxValue) {
        stepsSlider.setValue(val);
        setSteps(val);    
    }
}

function updateStepsGUI(val) {
    txtSteps.value = val;
}

function setSteps(val) {
    sequenceArr.steps = val;
    updateStepsGUI(val);
    setTotalSteps(val);

    for(var n=0; n<divViewBarArr.length; n++) {
        el = divViewBarArr[n];
        if((n+1) <= totalMeasures) {
            removeClass(el, 'barDisabled');
        }else {
            addClass(el, 'barDisabled');
        }
    }
}

function keyInMasterVolume() {
    var val = txtVolume.value;
    
    if(val >= masterVolumeSlider.minValue && val <= masterVolumeSlider.maxValue) {
        masterVolumeSlider.setValue(val);
        setMasterVolume(val);    
    }
}

function updateMasterVolumeGUI(val) {
    txtVolume.value = val;
}

function setMasterVolume(val) {
    updateMasterVolumeGUI(val);
    masterVolume = val;

    for(var n=0; n<instrumentChannels; n++) {
        var channelVolume = volumeSliderArr[n].getValue();
        channelArr[n].setVolume(Math.round((channelVolume * masterVolume)/100)/100);
    }
}
