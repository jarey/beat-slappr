var patternModal, savePatternModal, sharePatternModal;

var divSharePatternMesg, frmSharePattern, divGuestUser, txtUserEmail, txtShareWithEmail, cmdSharePattern, imgSharePatternLoader;

var patternAjax;

/***INIT***/

if(window.addEventListener) {
    window.addEventListener('load', patternInit, false);
}else {
    window.attachEvent('onload', patternInit);
}

function patternInit() {

    patternAjax = new Kodiak.Data.Ajax();

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
        onBeforeShow:   function() {
            this.setContent($('txtSharePatternWindow').value);
        },
        onShowComplete: sharePatternInit
    });

    if(p) {
        setPattern(p);
    }
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

    var user = "";
    var sequenceStr = "";
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

    if(txtUserEmail) {
        user = txtUserEmail.value;
    }else {
        user = "[user]";
    }
    sequenceStr = encodeJSON(sequenceArr);
    
    cmdSharePattern.style.display = "none";
    imgSharePatternLoader.style.display = "inline";

    patternAjax.request({
        url:    'api/pattern.php',
        method: 'post',
        parameters: {
            cmd: 'share',
            user: user,
            sequence: sequenceStr,
            hash: hex_md5(user + sequenceStr + Math.random()),
            recipients: txtShareWithEmail.value
        },
        handler: sharePatternHandler
    });
}

function sharePatternHandler(obj) {
    var response = decodeJSON(obj.response);
    if(response.success) {
        sharePatternModal.setContent("<label class='lblLink' style='float: right;' onclick='sharePatternModal.hide();'>Close</label><div id='divSharePatternMesg' class='success' style='clear: right; padding-top: 20px;'></div>");
        divSharePatternMesg = $('divSharePatternMesg');
        divSharePatternMesg.className = 'success';
    }else {
        cmdSharepattern.style.display = "inline";
        imgSharePatternLoader.style.display = "none";
    }
    divSharePatternMesg.innerHTML = response.mesg;
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
        setSystemKit(sequenceArr.kit.name, parseInt(sequenceArr.kit.id));
    }
}
