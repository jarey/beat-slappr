/**************************************************************************************************************************
    VARIABLE DECLARATION
**************************************************************************************************************************/

var divPlayPause, divJumpToStart, divClearPattern, divTempo, divSteps, divLoopPosition, divVolume;

var channelArr = [];
var instrumentNameArr = [];
var instrumentArr = [];
var divStepArr = [];
var sequencerPositionLEDArr = []
var sequenceArr = {
    tempo:    0,
    steps:    0,
    kit:      {},
    pattern:  []
};

var volumeWidgetArr = [];
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
var tempoWidget;
var stepsWidget;
var masterVolumeWidget;
var masterVolume;
var audioFormat;
var soloCount = 0;

var keyHash = {
    32: function() {togglePlay();},
    65: 8,
    68: 10,
    69: 2,
    70: 11,
    71: 12,
    73: 6,
    74: 13,
    75: 14,
    76: 15,
    79: 7,
    81: 0,
    82: 3,
    83: 9,
    84: 4,
    85: 5,
    87: 1
};



/**************************************************************************************************************************
    CONSTRUCTOR/DESTRUCTOR
**************************************************************************************************************************/

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
    divSteps = $("divSteps");
    divVolume = $("divVolume");
    divLoopPosition = $("divLoopPosition");
    
    var validAudioFormats = new AudioChannel().getValidFormats();
    
    window.onkeydown = keyDownHandler;
    window.onkeyup = keyUpHandler;

    instrumentArr = getElementsByClassName('drumPad');
    volumeWidgetArr = getElementsByClassName('divVolumeWidget');
    muteBtnArr = getElementsByClassName('channelMute');
    soloBtnArr = getElementsByClassName('channelSolo');
    instrumentNameArr = getElementsByClassName('instrumentName');
    sequencerPositionLEDArr = getElementsByClassName('sequencerPositionLED');

    var divStepWrapper = $("divStepWrapper");
    for(var n=0; n< divStepWrapper.children.length; n++) {
        divStepArr[n] = divStepWrapper.children[n].children;
    }

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
        volumeWidgetArr[n] = new StepWidget({
	        container:      volumeWidgetArr[n],
        	minValue:       0,
	        maxValue:       100,
	        initValue:      75,
            btnWidth:       15,
            txtPadding:      2,
            clickTimeout:   50,
            title:          'Volume',
            maxLength:      3,
            bodyClass:         'stepWidgetChannelBody',
            txtClass:          'stepWidgetChannelTxt',
            incBtnClass:       'stepWidgetInc',
            decBtnClass:       'stepWidgetDec',
	        onValueChange:     _setVolume(n)
        });
    }

    tempoWidget = new StepWidget({
        container:      divTempo,
    	minValue:       20,
        maxValue:       200,
        initValue:      120,
        btnWidth:       15,
        title:          'Tempo',
        maxLength:      3,
        bodyClass:      'stepWidgetBody',
        txtClass:       'stepWidgetTxt',
        incBtnClass:    'stepWidgetInc',
        decBtnClass:    'stepWidgetDec',
        onValueChange:  setTempo
    });
    
    stepsWidget = new StepWidget({
        container:         divSteps,
    	minValue:          1,
        maxValue:          64,
        initValue:         16,
        btnWidth:          15,
        title:             'Steps',
        maxLength:         2,
        bodyClass:         'stepWidgetBody',
        txtClass:          'stepWidgetTxt',
        incBtnClass:       'stepWidgetInc',
        decBtnClass:       'stepWidgetDec',
        onValueChange:     setSteps
    });
    
    masterVolumeWidget = new StepWidget({
        container:        divVolume,
    	minValue:         0,
        maxValue:         100,
        initValue:        75,
        btnWidth:         15,
        title:            'Master Volume',
        maxLength:        3,
        bodyClass:        'stepWidgetBody',
        txtClass:         'stepWidgetTxt',
        incBtnClass:      'stepWidgetInc',
        decBtnClass:      'stepWidgetDec',
        onValueChange:    setMasterVolume
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
}

window.onbeforeunload = function(){
	var message = 'Any unsaved changes will be lost!';
  	return message;
};



/**************************************************************************************************************************
    MACHINE FUNCTIONS
**************************************************************************************************************************/

function setStepEvents() {
    for(var n=0; n<totalSteps; n++) {
        if(!sequenceArr.pattern[n]) {
            sequenceArr.pattern[n] = [];
        }
    }
    for(var m=0; m<divStepArr.length; m++) {
        for(n=0; n<measureLength; n++) {
            if(divStepArr[m][n]) {
                divStepArr[m][n].onclick = _toggleInstrument(m, (n + ((currentMeasure-1) * measureLength)));
            }
        }
    }
}

function updateShuttlePosition() {
    var measure = Math.ceil(currentStep / measureLength);
    var beat = (Math.ceil(currentStep / beatLength)) - ((measure-1) * beatsPerMeasure);
    var step = currentStep - ((measure-1) * measureLength) - ((beat-1) * beatLength);

    divLoopPosition.innerHTML = measure + "." + beat + "." + step;
}

function setTotalSteps(val) {
    var currentStepIndex = _getCurrentStepIndex();

    initLoopPosition();

    removeClass(sequencerPositionLEDArr[currentStepIndex], 'clsStepCurrent');        
        
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

        if(lastStepMeasure != val) {
            removeClass(sequencerPositionLEDArr[currentStepIndex], 'clsStepCurrent');
        }else {
            addClass(sequencerPositionLEDArr[currentStepIndex], 'clsStepCurrent');
        }
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
    var lastStepMeasure = _getLastStepMeasure();
    var currentStepMeasure = Math.ceil(currentStep / measureLength);

    var lastStepIndex = lastStep-1;
    var currentStepIndex = currentStep-1;
    var lastStepArr = sequenceArr.pattern[lastStepIndex];
    var stepArr = sequenceArr.pattern[currentStepIndex];    

    var step;
    var noteArr = [];

    //Play sounds for current step
    for(var step in stepArr) {
        //setInstrumentClass(stepArr[n]);
        noteArr.push(channelArr[stepArr[step]]);
    }
    
    for(var step in noteArr) {
        noteArr[step].play();    
    }

    updateShuttlePosition();

    //Update GUI
    
    if(lastStepMeasure == currentMeasure) {
        removeClass(sequencerPositionLEDArr[lastStepIndex - ((lastStepMeasure - 1) * measureLength)], 'clsStepCurrent');
    }
    if(currentStepMeasure == currentMeasure) {
        addClass(sequencerPositionLEDArr[currentStepIndex - ((currentStepMeasure - 1) * measureLength)], 'clsStepCurrent');
    }

    /*
    //Clear trigger illumination from previous step
    for(var n=0; n<lastStepArr.length; n++) {
        releaseHandler(lastStepArr[n])();
    }
    */    

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

function _toggleInstrument(instrument, index) {
    return function() {
        toggleInstrument(instrument, index);
    };
}

function toggleInstrument(instrument, step) {
    var measureStep = (step - ((Math.ceil((step+1)/measureLength)-1) * measureLength));
    if(step < totalSteps) {
        for(var n=0; n<sequenceArr.pattern[step].length; n++) {
            if (sequenceArr.pattern[step][n] == instrument) {
                sequenceArr.pattern[step].splice(n,1);
                removeClass(divStepArr[instrument][measureStep], 'clsStepOn');
                return;
            }
        }
        sequenceArr.pattern[step].push(instrument);
        addClass(divStepArr[instrument][measureStep], 'clsStepOn');
    }
}

function selectInstrument() {
    var start = ((currentMeasure-1) * measureLength);
    var sequenceStep;
    for(var m=0; m<divStepArr.length; m++) {
        for(var n=0; n<measureLength; n++) {
            removeClass(divStepArr[m][n], 'clsStepOn');
            removeClass(divStepArr[m][n], 'clsStepDisabled');
            sequenceStep = (n + start);
            if(sequenceStep >= totalSteps) {
                addClass(divStepArr[m][n], 'clsStepDisabled');
            }else {
                for(var o=0; o<sequenceArr.pattern[sequenceStep].length; o++) {
                    if(sequenceArr.pattern[sequenceStep][o] == m) {
                        addClass(divStepArr[m][n], 'clsStepOn');
                        break;
                    }
                }
            }
        }
    }
}



/********************************************************************/
/***FUNCTIONS FOR INITIALIZING LOOP POSITION AND CLEARING PATTERNS***/
/********************************************************************/

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



/**********************************************/
/***FUNCTIONS FOR PLAYING/PAUSING THE PLAYER***/
/**********************************************/

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

/*****************************************/
/***FUNCTIONS FOR PLAYING AN INSTRUMENT***/
/*****************************************/

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

function setInstrumentClass(el) {
    addClass(instrumentArr[el], 'clsInstrumentActive');
}

function releaseHandler(index) {
    return function() {
        removeClass(instrumentArr[index], 'clsInstrumentActive');
    };
}



/********************************************/
/***WINDOW KEYDOWN/KEYUP HANDLER FUNCTIONS***/
/********************************************/

function keyDownHandler(e) {
    if(!e) {
        var e = window.event;
    }

    var keyHashVal = keyHash[e.keyCode];
    var keyHashType = typeof(keyHashVal);
    if(keyHashType != "undefined") {
        if(keyHashType == "function") {
            keyHashVal();
        }else if(keyHashType == "number") {
            playInstrument(keyHashVal);
        }
    }
}

function keyUpHandler(e) {
    if(!e) {
        var e = window.event;
    }

    var keyHashVal = keyHash[e.keyCode];
    var keyHashType = typeof(keyHashVal);
    if(keyHashType != "undefined") {
        if(keyHashType == "number") {
            removeClass(instrumentArr[keyHashVal], 'clsInstrumentActive');
        }
    }
}



/***********************************/
/***STEP WIDGET HANDLER FUNCTIONS***/
/***********************************/

function _setVolume(index) {
    return function(val) {
        channelArr[index].setVolume((val/100) * (masterVolume/100));
    }
}

function setTempo(val) {
    sequenceArr.tempo = val;
    sequencerTimeoutLength = Math.round((1000*((60/val)/beatLength)));

    //The following block clears the sequencer timer and resets it to the new timeout value.
    //This will work more smoothly once the sequencer algorithm is updated.
    if(playerState == 'playing') {
        clearInterval(sequencerTimer);
        sequencerTimer = setInterval(runSequencer, sequencerTimeoutLength);    
    }
}

function setSteps(val) {
    sequenceArr.steps = val;
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

function setMasterVolume(val) {
    masterVolume = val;

    for(var n=0; n<instrumentChannels; n++) {
        var channelVolume = volumeWidgetArr[n].getValue();
        channelArr[n].setVolume(Math.round((channelVolume * masterVolume)/100)/100);
    }
}
