var patternModal, savePatternModal, sharePatternModal;

var divGuestPatternWrapper, divMyPatternWrapper, cmbWithSelected, divMyPatterns, divPresetPatterns;
var divSharePatternMesg, frmSharePattern, divGuestUser, txtUserEmail, txtShareWithEmail, cmdSharePattern, imgSharePatternLoader;

var userPatternDataset, systemPatternDataset, userPatternTable, systemPatternTable;

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
        modalClass:  'modalWindow patternModal',
        onBeforeShow: function() {
            this.setContent($('txtPatternWindow').value);
        },
        onShowComplete: userPatternInit
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



/****************************/
/***PATTERN MODAL HANDLING***/
/****************************/

function userPatternInit() {
    var type;
    divGuestPatternWrapper = $('divGuestPatternWrapper');
    divMyPatternWrapper = $('divMyPatternWrapper');

    if(currentUser) {
        type = "all";
        divMyPatternWrapper.style.display = "block";
        divGuestPatternWrapper.style.display = "none";
        cmbWithSelected = $('cmbWithSelected');
        divMyPatterns = $('divMyPatterns');
    }else {
        type = "system"
        divMyPatternWrapper.style.display = "none";
        divGuestPatternWrapper.style.display = "block";    
    }

    patternAjax.request({
        url:    'api/pattern.php',
        method: 'post',
        parameters: {cmd: 'get', type: type},
        handler: userPatternHandler
    });

    divPresetPatterns = $('divPresetPatterns');
}

function userPatternHandler(obj) {
    var response = decodeJSON(obj.response);
    if(response.success) {
        if(response.data.user) {
            userPatternDataset = new Kodiak.Data.Dataset(response.data.user);
        }
        if(response.data.system) {
            systemPatternDataset = new Kodiak.Data.Dataset();
            systemPatternTable = new Kodiak.Controls.Table({
                applyTo: divPresetPatterns,
                componentId: 'tblSystemPatterns',
                tableDomId: 'tblSystemPatterns',
                rowSelectedClass: 'selectedTableRow',
                data: systemPatternDataset,
                sortArrow: {
                    img: 'includes/images/tblArrowSprite.png',
                    size: {width: 14, height: 14},
                    up: {x: 0, y: 0},
                    down: {x: 0, y: -14}
                },
                columns: {
                    Name: {
                        dataField: 'name',
                        sortable: true,
                        width: 100,
                    },
                    Kit: {
                        dataField: 'kit.name',
                        sortable: true,
                        width: 100
                    },
                    Tempo: {
                        dataField: 'tempo',
                        sortable: true,
                        width: 100,
                        align: 'right'
                    }
                }
            });
            systemPatternDataset.setData({
                data: response.data.system,
                sortObj: {field: 'name', dir: 'ASC'}
            });




        }
    }else {
        divPatternMesg.innerHTML = response.mesg;
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
