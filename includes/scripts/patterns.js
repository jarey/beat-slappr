var patternModal, savePatternModal, sharePatternModal;

var divSharePatternMesg, frmSharePattern, divGuestUser, txtUserEmail, txtShareWithEmail, cmdSharePattern, imgSharePatternLoader;

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

    sharePatternModal = new Kodiak.Controls.Modal({
        applyTo:     'lblSharePattern',
        componentId: 'sharePatternModal',
        modalClass:  'modalWindow accountModal',
        content:     $('txtSharePatternWindow').value,
        onShowComplete: sharePatternInit
    });
}


/**********************************/
/***SHARE PATTERN MODAL HANDLING***/
/**********************************/

function sharePatternInit() {
    divSharePatternMesg = $('divSharePatternMesg');
    divSharePatternMesg.innerHTML = "";

    frmSharePattern = $('frmSharePattern');
    frmSharePattern.onkeydown = stopPropagation;

    divShareUser = $('divShareUser');
    divGuestUser = $('divGuestUser');

    txtShareWithEmail = $('txtShareWithEmail');
    txtShareWithEmail.value = '';

    if(currentUser) {
        divGuestUser.style.display = "none";
        txtUserEmail = "";
        txtShareWithEmail.focus();
    }else {
        divGuestUser.style.display = "block";
        txtUserEmail = $('txtUserEmail');
        txtUserEmail.value = '';
        txtUserEmail.focus();
    }

    cmdSharePattern = $('cmdSharePattern');
    cmdSharePattern.onclick = sharePattern;

    imgSharePatternLoader = $('imgSharePatternLoader');
}

function sharePattern() {
 
    /***VALIDATION***/

    var errorArr = [];
    if(txtUserEmail && !isValidEmail(txtUserEmail.value)) {
        errorArr.push(emailErrorMesg);
    }
    if(!txtShareWithEmail.value) {
        errorArr.push("You must provide at least one recipient");
    }else {
        var shareArr = txtShareWithEmail.value.split(',');    
        for(var share in shareArr) {
            if(!isValidEmail(shareArr[share].replace(/^\s+|\s+$/g,""))) {
                errorArr.push("One or more of the recipient's addresses you provided is invalid");
                break;
            }
        }
    }
    if(errorArr.length) {
        divSharePatternMesg.innerHTML = errorArr.join('<br />');
        return false;
    }

    /***POST VALIDATION***/

    alert('submitting...');
}

//Below functions will eventually be used for pattern modal

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
