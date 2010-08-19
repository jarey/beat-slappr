var patternModal, savePatternModal, sharePatternModal;

var divGuestPatternWrapper, divMyPatternWrapper, cmdRenamePattern, cmdDeletePattern, divUserPatterns, divPresetPatterns, divPatternMesg;
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
    divPatternMesg = $('divPatternMesg');

    if(currentUser) {
        type = "all";
        divMyPatternWrapper.style.display = "block";
        divGuestPatternWrapper.style.display = "none";
        cmdRenamePattern = $('cmdRenamePattern');
        cmdRenamePattern.onclick = function() {doWithSelected('rename');};
        cmdDeletePattern = $('cmdDeletePattern');
        cmdDeletePattern.onclick = function() {doWithSelected('delete');};
        divUserPatterns = $('divUserPatterns');
        $('lblSelectAll').onclick = function() {userPatternDataset.selectAllRows(true);};
        $('lblSelectNone').onclick = function() {userPatternDataset.selectAllRows(false);};
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
            userPatternDataset = new Kodiak.Data.Dataset();
            userPatternDataset.selectListener.add(setWithSelectedBtnState);
            userPatternTable = new Kodiak.Controls.Table({
                applyTo: divUserPatterns,
                componentId: 'tblUserPatterns',
                tableDomId: 'tblUserPatterns',
                rowSelectedClass: 'selectedTableRow',
                data: userPatternDataset,
                sortArrow: {
                    img: 'includes/images/tblArrowSprite.png',
                    size: {width: 14, height: 14},
                    up: {x: 0, y: 0},
                    down: {x: 0, y: -14}
                },
                columns: {
                    Select: {
                        width: 10,
                        title: ' ',
                        selectRowCheckBox: true
                    },
                    Name: {
                        dataField: 'name',
                        sortable: true,
                        width: 120,
                    },
                    Kit: {
                        dataField: 'kit.name',
                        sortable: true,
                        width: 110
                    },
                    Tempo: {
                        dataField: 'tempo',
                        sortable: true,
                        width: 60,
                        align: 'right'
                    }
                }
            });
            userPatternDataset.setData({
                data: response.data.user,
                sortObj: {field: 'name', dir: 'ASC'}
            });
            setWithSelectedBtnState();
        }
        if(response.data.system) {
            systemPatternDataset = new Kodiak.Data.Dataset();
            systemPatternTable = new Kodiak.Controls.Table({
                applyTo: divPresetPatterns,
                componentId: 'tblSystemPatterns',
                tableDomId: 'tblSystemPatterns',
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
                        width: 120,
                    },
                    Kit: {
                        dataField: 'kit.name',
                        sortable: true,
                        width: 120
                    },
                    Tempo: {
                        dataField: 'tempo',
                        sortable: true,
                        width: 60,
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

function doWithSelected(val) {
    var selectedPatterns = userPatternDataset.getSelected();
    switch(val) {
        case "rename":
            if(selectedPatterns.length == 1) {
                var originalName = selectedPatterns[0].data.name;
                var newName = prompt("New name:", originalName);
                if(newName && newName != originalName) {
                     patternAjax.request({
                        url:    'api/pattern.php',
                        method: 'post',
                        parameters: {cmd: 'rename', from: originalName, to: newName},
                        handler: function(obj) {renameHandler(obj, newName);}
                    });
                }
            }
        break;
        case "delete":
            if(selectedPatterns) {
                if(confirm("Are you sure you want to delete the selected patterns?  This can't be undone!")) {
                    var postObj = {
                        cmd:   'delete',
                        items: ''
                    };
                    var delIdArr = [];
                    var delNameArr = [];
                    var key, val, pattern;
                    for(pattern in selectedPatterns) {
                        key = selectedPatterns[pattern].index;
                        val = selectedPatterns[pattern].data.name;
                        delIdArr.push(key);
                        delNameArr.push(val);
                    }
                    postObj.items = delNameArr.join("|-|");
                     patternAjax.request({
                        url:    'api/pattern.php',
                        method: 'post',
                        parameters: postObj,
                        handler: function(obj) {deleteHandler(obj, delIdArr);}
                    });
                }
            }
        break;
    }
}

function renameHandler(obj, newName) {
    var response = decodeJSON(obj.response);
    if(response.success) {
        divPatternMesg.style.display = "none";
        var selectedPatterns = userPatternDataset.getSelected();
        selectedPatterns[0].data.name = newName;
        userPatternDataset.updateListener.fire();
    }else {
        divPatternMesg.style.display = "block";
        divPatternMesg.innerHTML = response.mesg;
    }
}

function deleteHandler(obj, delIdArr) {
    var response = decodeJSON(obj.response);
    if(response.success) {
        divPatternMesg.style.display = "none";
        for(var index in delIdArr) {
            userPatternDataset.data.splice(index, 1);
        }
        userPatternDataset.selectAllRows(false);
        userPatternDataset.updateListener.fire();
    }else {
        divPatternMesg.style.display = "block";
        divPatternMesg.innerHTML = response.mesg;
    }
}

function setWithSelectedBtnState() {
    var selectedRowCount = userPatternDataset.getSelectedRowCount();
    var buttonState = false;

    if(selectedRowCount) {
        buttonState = false;
    }else {
        buttonState = true;
    }

    cmdRenamePattern.disabled = buttonState;
    cmdDeletePattern.disabled = buttonState;    

    if(selectedRowCount > 1) {
        cmdRenamePattern.disabled = true;
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
