function Sampler() {

    /**************************************************************************************************************************
        VARIABLE DECLARATION
    **************************************************************************************************************************/

    var divPlayPause, divJumpToStart, divClearPattern, divTempo, divSteps, divVolume,

        channelArr = [],
        instrumentNameArr = [],
        instrumentArr = [],
        divStepArr = [],
        sequencerPositionLEDArr = [],
        sequenceArr = {
            tempo:    0,
            steps:    0,
            chVol:    {},
            kit:      {},
            pattern:  []
        },

        volumeWidgetArr = [],
        muteBtnArr = [],
        soloBtnArr = [],
        divViewBarArr = [],

        playerState = 'paused',
        instrumentChannels = 16,

        currentStep    =  1,
        totalSteps     = 16,

        currentMeasure =  0,
        totalMeasures  =  1,

        beatLength     =  4,
        measureLength  = 16,

        lastStep = totalSteps,
        priorityTask,
        sequencerTimer,
        sequencerTimeoutLength,
        tempoWidget,
        stepsWidget,
        masterVolumeWidget,
        masterVolume,
        audioFormat,
        soloCount = 0,
        
        keyHash = {
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
        },
        
        account,
        kit,
        pattern;

    function _getLastStepMeasure() {
        return Math.ceil(lastStep / measureLength);
    }

    function runSequencer() {
        priorityTask.add(runSequencer, sequencerTimeoutLength);

        var stepArr = sequenceArr.pattern[currentStep-1],
            n,
            lastStepMeasure,
            currentStepMeasure;
        
        //Update GUI

        lastStepMeasure = _getLastStepMeasure();
        currentStepMeasure = Math.ceil(currentStep / measureLength);
        
        if(lastStepMeasure == currentMeasure) {
            removeClass(sequencerPositionLEDArr[(lastStep-1) - ((lastStepMeasure - 1) * measureLength)], 'clsStepCurrent');
        }
        if(currentStepMeasure == currentMeasure) {
            addClass(sequencerPositionLEDArr[(currentStep-1) - ((currentStepMeasure - 1) * measureLength)], 'clsStepCurrent');
        }

        lastStep = currentStep;
        currentStep++;
        if(currentStep > totalSteps) {
            currentStep = 1;
        }
        
        //Play sounds for current step
        for(n=0; n<stepArr.length; n++) {
            channelArr[stepArr[n]].play();
        }

        priorityTask.fire();
    }

    function togglePlayer(state) {
        if(state == 'playing') {
            addClass(divPlayPause, 'btnPause');
            removeClass(divPlayPause, 'btnPlay');
            divPlayPause.title = "Pause    [space]";
            clearInterval(sequencerTimer);
            runSequencer();
            //sequencerTimer = setInterval(runSequencer, sequencerTimeoutLength);
        }else if(state == 'paused') {
            addClass(divPlayPause, 'btnPlay');
            removeClass(divPlayPause, 'btnPause');
            divPlayPause.title = "Play    [space]";
            priorityTask.clear();
            //clearInterval(sequencerTimer);
        }
    }

    function togglePlay() {
        playerState = (playerState == 'playing') ? 'paused' : 'playing';
        togglePlayer(playerState);
    }

    //The following causes the spacebar to run togglePlay()
    keyHash[32] = function() {togglePlay();};

    //The following causes the left arrow key to initialize the loop position
    keyHash[37] = function() {initLoopPosition();};

    function toggleInstrument(instrument, step) {
        if(step < totalSteps) {
            var measureStep = (step - ((Math.ceil((step+1)/measureLength)-1) * measureLength)),
                currentStep = sequenceArr.pattern[step],
                stepEl = divStepArr[instrument][measureStep],
                n;

            for(n=0; n<currentStep.length; n++) {
                if(currentStep[n] == instrument) {
                    currentStep.splice(n,1);
                    removeClass(stepEl, 'clsStepOn');
                    return;
                }
            }
            currentStep.push(instrument);
            addClass(stepEl, 'clsStepOn');
        }
    }

    function _toggleInstrument(instrument, index) {
        return function() {
            priorityTask.run(function() {toggleInstrument(instrument, index);});
        };
    }

    function setStepEvents() {
        var n, m;

        for(n=0; n<totalSteps; n++) {
            if(!sequenceArr.pattern[n]) {
                sequenceArr.pattern[n] = [];
            }
        }
        for(m=0; m<divStepArr.length; m++) {
            for(n=0; n<measureLength; n++) {
                if(divStepArr[m][n]) {
                    divStepArr[m][n].onclick = _toggleInstrument(m, (n + ((currentMeasure-1) * measureLength)));
                }
            }
        }
    }

    function renderPattern() {
        var start = ((currentMeasure-1) * measureLength),
            sequenceStep, sequenceEl, sequenceElClass, sequenceElDisabled, sequenceElOn, stepInstrumentArr, stepOn,
            stepDisabledRegex = new RegExp('(\\s|^)clsStepDisabled(\\s|$)'),
            stepOnRegex = new RegExp('(\\s|^)clsStepOn(\\s|$)'),
            m, n, o;

        for(m=0; m<divStepArr.length; m++) {
            for(n=0; n<measureLength; n++) {
                sequenceStep = (n + start);
                sequenceEl = divStepArr[m][n];
                stepInstrumentArr = sequenceArr.pattern[sequenceStep];
                
                sequenceElClass = sequenceEl.className;
                sequenceElDisabled = sequenceElClass.match(stepDisabledRegex);
                sequenceElOn = sequenceElClass.match(stepOnRegex);

                if(sequenceStep >= totalSteps) {
                    if(!sequenceElDisabled) {
                        addClass(sequenceEl, 'clsStepDisabled', true);
                    }
                }else {
                    if(sequenceElDisabled) {
                        removeClass(sequenceEl, 'clsStepDisabled', true);
                    }
                    stepOn = false;
                    for(o=0; o<stepInstrumentArr.length; o++) {
                        if(stepInstrumentArr[o] == m) {
                            stepOn = true;
                            if(!sequenceElOn) {
                                addClass(sequenceEl, 'clsStepOn', true);
                            }
                            break;
                        }
                    }
                    if(!stepOn && sequenceElOn) {
                        removeClass(sequenceEl, 'clsStepOn', true);
                    }
                }
            }
        }
    }

    function _getCurrentStepIndex() {
        var lastStepMeasure = _getLastStepMeasure();
        return (lastStep - 1) - ((lastStepMeasure - 1) * measureLength);
    }

    function setCurrentMeasure(val) {
        if(val <= totalMeasures && val != currentMeasure) {
            var n,
                lastStepMeasure,
                currentStepIndex,
                el;

            currentMeasure = val;

            setStepEvents();
            renderPattern();

            for(n=0; n<divViewBarArr.length; n++) {
                el = divViewBarArr[n];
                if((n+1) == val) {
                    addClass(el, 'barCurrent');
                }else {
                    removeClass(el, 'barCurrent');
                }
            }

            lastStepMeasure = _getLastStepMeasure();
            currentStepIndex = _getCurrentStepIndex();

            if(lastStepMeasure != val) {
                removeClass(sequencerPositionLEDArr[currentStepIndex], 'clsStepCurrent');
            }else {
                addClass(sequencerPositionLEDArr[currentStepIndex], 'clsStepCurrent');
            }
        }
    }

    function _setCurrentMeasure(val) {
        return function() {
            priorityTask.run(function() {setCurrentMeasure(val);});
            return false;
        };
    }

    function _setChannelPlayState() {
        var n;
        if(soloCount) {
            for(n=0; n<instrumentChannels; n++) {
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
            for(n=0; n<instrumentChannels; n++) {
                if(hasClass(muteBtnArr[n], 'channelMuteOn')) {
                    channelArr[n].setMute(true);
                }else {
                    channelArr[n].setMute(false);
                }
            }
        }
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

    function _toggleSolo(index) {
        return function() {
            toggleSolo(index);
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

    function _toggleMute(index) {
        return function() {
            toggleMute(index);
            return false;
        };
    }

    function initLoopPosition() {
        currentStep = 1;
        currentMeasure = 0;

        setCurrentMeasure(1);

        var currentStepIndex = _getCurrentStepIndex();
        removeClass(sequencerPositionLEDArr[currentStepIndex], 'clsStepCurrent');
        addClass(sequencerPositionLEDArr[0], 'clsStepCurrent');
    }

    function clearPattern() {
        var val, n;
        val = confirm("Are you sure you want to clear this pattern?");
        if(val) {
            for(n=0; n<totalSteps; n++) {
                sequenceArr.pattern[n] = [];
            }
            playerState = 'playing';
            togglePlay();
            initLoopPosition();
        }
    }

    function setInstrumentClass(el) {
        addClass(instrumentArr[el], 'clsInstrumentActive');
    }

    function playInstrument(index) {
        setInstrumentClass(index);
        channelArr[index].play();
    }

    function _playInstrument(index) {
        return function() {
            playInstrument(index);
            return false;
        };
    }

    function releaseHandler(index) {
        return function() {
            removeClass(instrumentArr[index], 'clsInstrumentActive');
        };
    }

    function keyDownHandler(e) {
        if(!e) {
            e = window.event;
        }

        var keyHashVal = keyHash[e.keyCode],
            keyHashType = typeof(keyHashVal);

        if(keyHashType != "undefined") {
            if(keyHashType == "function") {
                keyHashVal();
            }else if(keyHashType == "number") {
                playInstrument(keyHashVal);
            }
            return false;
        }
    }

    function keyUpHandler(e) {
        if(!e) {
            e = window.event;
        }

        var keyHashVal = keyHash[e.keyCode],
            keyHashType = typeof(keyHashVal);
        if(keyHashType != "undefined") {
            if(keyHashType == "number") {
                removeClass(instrumentArr[keyHashVal], 'clsInstrumentActive');
            }
        }
    }

    function _setChVolume(index) {
        return function(val) {
            sequenceArr.chVol[index] = val;
            channelArr[index].setVolume((val/100) * (masterVolume/100));
        };
    }

    function setTempo(val) {
        sequenceArr.tempo = val;
        sequencerTimeoutLength = Math.round((1000*((60/val)/beatLength)));
    }

    function setTotalSteps(val) {
        removeClass(sequencerPositionLEDArr[_getCurrentStepIndex()], 'clsStepCurrent');        
        totalSteps = val;
        totalMeasures = Math.ceil(totalSteps/measureLength);
        lastStep = totalSteps;

        setStepEvents();
        initLoopPosition();
    }

    function setSteps(val) {
        var n, el;

        sequenceArr.steps = val;
        setTotalSteps(val);

        for(n=0; n<divViewBarArr.length; n++) {
            el = divViewBarArr[n];
            if((n+1) <= totalMeasures) {
                removeClass(el, 'barDisabled');
            }else {
                addClass(el, 'barDisabled');
            }
        }
    }

    function setMasterVolume(val) {
        var n, channelVolume;

        masterVolume = val;

        for(n=0; n<instrumentChannels; n++) {
            channelVolume = volumeWidgetArr[n].getValue();
            channelArr[n].setVolume(Math.round((channelVolume * masterVolume)/100)/100);
        }
    }


    /***EXPOSE BASE CLASS METHODS***/

    //KIT METHODS
    function setSystemKit(kitName, kitId) {
        kit.setSystemKit(kitName, kitId, audioFormat, instrumentChannels, instrumentNameArr, channelArr);
        sequenceArr.kit = {id: kitId, name: kitName};
    }
    this.setSystemKit = setSystemKit;

    //ACCOUNT METHODS
    function logout() {
        account.logout();
    }
    this.logout = logout;

    function sessionExists() {
        return account.sessionExists();
    }
    this.sessionExists = sessionExists;

    function setCurrentUser(val) {
        account.setCurrentUser(val);    
    }
    this.setCurrentUser = setCurrentUser;

    //PATTERN METHODS
    function setPattern(val, type) {
        pattern.setPattern(val, type, priorityTask, sequenceArr, volumeWidgetArr, stepsWidget, tempoWidget);
    }
    this.setPattern = setPattern;

    function setUserPatternArr(val) {
        pattern.setUserPatternArr(val);
    }
    this.setUserPatternArr = setUserPatternArr;

    function setSystemPatternArr(val) {
        pattern.setSystemPatternArr(val);
    }
    this.setSystemPatternArr = setSystemPatternArr;

    function setUserPatternDirtyFlag(val) {
        pattern.setUserPatternDirtyFlag(val);
    }
    this.setUserPatternDirtyFlag = setUserPatternDirtyFlag;
    
    //SAMPLER METHODS
    function getTotalSteps() {
        return totalSteps;    
    }
    this.getTotalSteps = getTotalSteps;

    function getSequenceArr() {
        return sequenceArr;
    }
    this.getSequenceArr = getSequenceArr;

    /**************************************************************************************************************************
        CONSTRUCTOR/DESTRUCTOR
    **************************************************************************************************************************/

    function init(scope) {
        divPlayPause = $('divPlayPause');
        divJumpToStart = $('divJumpToStart');
        divClearPattern = $('divClearPattern');
        
        divTempo = $("divTempo");
        divSteps = $("divSteps");
        divVolume = $("divVolume");
        
        var divStepWrapper,
            n,
            validFormats;
        
        window.onkeydown = keyDownHandler;
        window.onkeyup = keyUpHandler;

        instrumentArr = getElementsByClassName('drumPad');
        volumeWidgetArr = getElementsByClassName('divVolumeWidget');
        muteBtnArr = getElementsByClassName('channelMute');
        soloBtnArr = getElementsByClassName('channelSolo');
        instrumentNameArr = getElementsByClassName('instrumentName');
        sequencerPositionLEDArr = getElementsByClassName('sequencerPositionLED');

        divStepWrapper = $("divStepWrapper");
        for(n=0; n< divStepWrapper.children.length; n++) {
            divStepArr[n] = divStepWrapper.children[n].children;
        }

        divViewBarArr = $("divViewBarInnerWrapper").getElementsByTagName('div');

        priorityTask = new Kodiak.Data.PriorityTask();

        for(n=0; n<divViewBarArr.length; n++) {
            divViewBarArr[n].onmousedown = _setCurrentMeasure(n+1);
        }

        for(n=0; n<instrumentChannels; n++) {
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
	            onValueChange:     _setChVolume(n)
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
            onValueChange:  function(val) {priorityTask.run(function() {setTempo(val);});}
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

        validFormats = channelArr[0].getValidFormats();
        if(validFormats.ogg) {
            audioFormat = 'ogg';
        }else if(validFormats.mp3) {
            audioFormat = 'mp3';
        }else {
            alert("Your browser does not support this app :-\\");
        }

        divPlayPause.onclick = function() {togglePlay(); return false;};
        divJumpToStart.onclick = function() {initLoopPosition(); return false;};
        divClearPattern.onclick = function() {clearPattern(); return false;};

        kit = new Kit();
        pattern = new Pattern();
        account = new Account();

        //EXPOSE BASE CLASS PROPERTIES
        scope.loginModal = account.loginModal;
        scope.signupModal = account.signupModal;

        scope.kitModal = kit.kitModal;

        scope.patternModal = pattern.patternModal;
        scope.savePatternModal = pattern.savePatternModal;
        scope.sharePatternModal = pattern.sharePatternModal;
        scope.downloadPatternModal = pattern.downloadPatternModal;
    }

    init(this);

}
