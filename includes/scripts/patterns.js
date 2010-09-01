var patternModal, savePatternModal, sharePatternModal, downloadPatternModal;
var currentPattern;

var divGuestPatternWrapper, divMyPatternWrapper, cmdRenamePattern, cmdDeletePattern, divUserPatterns, divPresetPatterns, divPatternMesg;
var divSharePatternMesg, frmSharePattern, divGuestUser, txtUserEmail, txtShareWithEmail, cmdSharePattern, imgSharePatternLoader;
var divGuestPatternSaveWrapper, divUserPatternSaveWrapper, divSavePatternMesg, frmSavePattern, txtSavePattern, cmdSavePattern, imgSavePatternLoader;

var userPatternDataset, systemPatternDataset, userPatternTable, systemPatternTable;

var userPatternDataIsDirty = false;
var userPatternArr = [];
var systemPatternArr = [];
var patternAjax;

//p is defined in the homepage upon pageload if a 'p' attribute was passed on the url
//This means the link was of a shared pattern.
var p;

//spa is defined in the homepage upon pageload.  It is obfuscated for systemPatternArr.
var spa;

//upa is defined in the homepage upon pageload.  It is obfuscated for userPatternArr.
var upa;

/***INIT***/

if(window.addEventListener) {
    window.addEventListener('load', patternInit, false);
}else {
    window.attachEvent('onload', patternInit);
}

function patternInit() {
    currentPattern = $("currentPattern");

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
        modalClass:  'modalWindow accountModal',
        onBeforeShow: function() {
            this.setContent($('txtSavePatternWindow').value);
        },
        onShowComplete: savePatternInit
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

    downloadPatternModal = new Kodiak.Controls.Modal({
        applyTo:     'lblDownloadPattern',
        componentId: 'downloadPatternModal',
        modalClass:  'modalWindow accountModal',
        onBeforeShow:   function() {
            this.setContent($('txtDownloadPatternWindow').value);
        },
        onShowComplete: downloadPatternInit
    });

    if(typeof(upa) == 'object') {
        userPatternArr = upa;
    }

    if(typeof(spa) == 'object') {
        systemPatternArr = spa;
    }

    if(typeof(p) == 'object') {
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
    divPresetPatterns = $('divPresetPatterns');

    if(currentUser) {
        divMyPatternWrapper.style.display = "block";
        divGuestPatternWrapper.style.display = "none";
        cmdRenamePattern = $('cmdRenamePattern');
        cmdRenamePattern.onclick = function() {doWithSelected('rename');};
        cmdDeletePattern = $('cmdDeletePattern');
        cmdDeletePattern.onclick = function() {doWithSelected('delete');};
        divUserPatterns = $('divUserPatterns');
        $('lblSelectAll').onclick = function() {userPatternDataset.selectAllRows(true);};
        $('lblSelectNone').onclick = function() {userPatternDataset.selectAllRows(false);};

        if(systemPatternArr.length) {
            type = "user";
            if(!userPatternDataIsDirty) {
                var obj = {};
                obj.response = {success: true, data: {user: userPatternArr}};
                userPatternHandler(obj);
                return;
            }
        }else {
            type = "all";
        }
    }else {
        divMyPatternWrapper.style.display = "none";
        divGuestPatternWrapper.style.display = "block";

        if(systemPatternArr.length) {
            var obj = {};
            obj.response = {success: true, data: {system: systemPatternArr}};
            userPatternHandler(obj);
            return;            
        }
        type = "system"
    }

    patternAjax.request({
        url:    'api/pattern.php',
        method: 'post',
        parameters: {cmd: 'get', type: type},
        handler: userPatternHandler
    });
}

function userPatternHandler(obj) {
    var response;
    if(typeof(obj.response) == "string") {
        response = decodeJSON(obj.response);
    }else if(typeof(obj.response) == "object") {
        response = obj.response;
    }

    if(systemPatternArr.length) {
        response.data.system = systemPatternArr;
    }

    if(response.success) {
        if(response.data.user) {
            userPatternArr = response.data.user;
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
                        renderFn: function(data) {
                            return "<div onclick='setPattern(userPatternDataset.getRow(" + data.index + "));'>" + data.val.name + "</div>";
                        }
                    },
                    Kit: {
                        dataField: 'kit.name',
                        sortable: true,
                        width: 110,
                        renderFn: function(data) {
                            return "<div onclick='setPattern(userPatternDataset.getRow(" + data.index + "));'>" + data.val.kit.name + "</div>";
                        }
                    },
                    Tempo: {
                        dataField: 'tempo',
                        sortable: true,
                        width: 60,
                        align: 'right',
                        renderFn: function(data) {
                            return "<div onclick='setPattern(userPatternDataset.getRow(" + data.index + "));'>" + data.val.tempo + "</div>";
                        }
                    }
                }
            });
            userPatternDataset.setData({
                data: response.data.user,
                sortObj: {field: 'name', dir: 'ASC'}
            });
            setWithSelectedBtnState();
            userPatternDataIsDirty = false;
        }
        if(response.data.system) {
            systemPatternArr = response.data.system;
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
                        renderFn: function(data) {
                            return "<div onclick='setPattern(systemPatternDataset.getRow(" + data.index + "));'>" + data.val.name + "</div>";
                        }
                    },
                    Kit: {
                        dataField: 'kit.name',
                        sortable: true,
                        width: 120,
                        renderFn: function(data) {
                            return "<div onclick='setPattern(systemPatternDataset.getRow(" + data.index + "));'>" + data.val.kit.name + "</div>";
                        }
                    },
                    Tempo: {
                        dataField: 'tempo',
                        sortable: true,
                        width: 60,
                        align: 'right',
                        renderFn: function(data) {
                            return "<div onclick='setPattern(systemPatternDataset.getRow(" + data.index + "));'>" + data.val.tempo + "</div>";
                        }
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
        userPatternDataset.selectAllRows(false);
        userPatternDataset.sort(this.sortCol);
        userPatternDataset.updateListener.fire();

        userPatternArr = userPatternDataset.data;

    }else {
        divPatternMesg.style.display = "block";
        divPatternMesg.innerHTML = response.mesg;
    }
}

function deleteHandler(obj, delIdArr) {
    var response = decodeJSON(obj.response);
    var n=0;
    var val;
    if(response.success) {
        divPatternMesg.style.display = "none";
        for(var index in delIdArr) {
            val = delIdArr[index] - n;
            userPatternDataset.data.splice(val, 1);
            n++;
        }
        userPatternDataset.selectAllRows(false);
        userPatternDataset.sort(this.sortCol);
        userPatternDataset.updateListener.fire();
        userPatternArr = userPatternDataset.data;
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

/*********************************/
/***SAVE PATTERN MODAL HANDLING***/
/*********************************/

function savePatternInit() {
    divGuestPatternSaveWrapper = $("divGuestPatternSaveWrapper");
    divUserPatternSaveWrapper = $("divUserPatternSaveWrapper");

    divSavePatternMesg = $("divSavePatternMesg");
    divSavePatternMesg.innerHTML = "";
    divSavePatternMesg.style.display = "none";

    if(currentUser) {
        divGuestPatternSaveWrapper.style.display = "none";
        divUserPatternSaveWrapper.style.display = "block";
        
        frmSavePattern = $("frmSavePattern");
        frmSavePattern.onkeydown = stopPropagation;

        txtSavePattern = $("txtSavePattern");
        txtSavePattern.value = $("currentPattern").innerHTML;
        txtSavePattern.focus();

        cmdSavePattern = $("cmdSavePattern");
        cmdSavePattern.onclick = savePattern;

        imgSavePatternLoader = $("imgSavePatternLoader");
        $('cmdCancelSave').onclick = function() {savePatternModal.hide();};
    }else {
        divUserPatternSaveWrapper.style.display = "none";
        divGuestPatternSaveWrapper.style.display = "block";
    }
}

function savePattern() {
    var sequenceStr, pattern;
    var patternExists = false;
    var patternName = txtSavePattern.value;

    for(pattern in userPatternArr) {
        if(userPatternArr[pattern].name == patternName) {
            patternExists = true;
            break;
        }
    }

    if(patternExists) {
        var overwrite = confirm("A pattern with this name already exists.  Overwrite?");
        if(!overwrite) {
            return;
        }
    }

    cmdSavePattern.style.display = "none";
    imgSavePatternLoader.style.display = "inline";

    sequenceStr = encodeJSON(sequenceArr);

    patternAjax.request({
        url:    'api/pattern.php',
        method: 'post',
        parameters: {
            cmd: 'save',
            name: patternName,
            sequence: sequenceStr
        },
        handler: function(obj) {savePatternHandler(obj, patternName);}
    });
}

function savePatternHandler(obj, patternName) {
    var response = decodeJSON(obj.response);
    if(response.success) {
        savePatternModal.setContent("<label class='lblLink' style='float: right;' onclick='savePatternModal.hide();'>Close</label><div id='divSavePatternMesg' class='success' style='clear: right; padding-top: 20px;'></div>");
        divSavePatternMesg = $('divSavePatternMesg');
        var util = new Kodiak.Util();
        if(response.action == "added") {
            //if a new pattern was added, clone sequencearr, update the new array's name property to the name
            //of the new pattern, and push it to userPatternArr.

            var newSequence = {};
            util.clone(sequenceArr, newSequence);
            newSequence.name = patternName;
            userPatternArr.push(newSequence);
        }else if(response.action == "updated") {
            //if an existing pattern was updated, look up the pattern in userPatternArr and update it's value
            //with a clone of sequenceArr.

            for(var pattern in userPatternArr) {
                if(userPatternArr[pattern].name == sequenceArr.name) {
                    util.clone(sequenceArr, userPatternArr[pattern]);
                    break;
                }
            }
        }
        //userPatternDataIsDirty = true;
    }else {
        cmdSavePattern.style.display = "inline";
        imgSavePatternLoader.style.display = "none";
    }
    divSavePatternMesg.style.display = "block";
    divSavePatternMesg.innerHTML = response.mesg;
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
    $('cmdCancelShare').onclick = function() {sharePatternModal.hide();};
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
        priorityTask.run(
            function() {
                if(typeof(val) == 'string') {
                    sequenceArr = decodeJSON(val);
                }else if(typeof(val) == 'object') {
                    sequenceArr = val;
                }
                
                for(var ch in sequenceArr.chVol) {
                    volumeWidgetArr[ch].setValue(sequenceArr.chVol[ch]);
                }

                stepsWidget.setValue(parseInt(sequenceArr.steps));
                tempoWidget.setValue(parseInt(sequenceArr.tempo));
                setSystemKit(sequenceArr.kit.name, parseInt(sequenceArr.kit.id));
                
                if(sequenceArr.name) {
                    currentPattern.innerHTML = sequenceArr.name;
                }
            }
        );
    }
}

/*************************************/
/***DOWNLOAD PATTERN MODAL HANDLING***/
/*************************************/

function downloadPatternInit() {
    $("cmdDownloadPattern").onclick = downloadPattern;
    $("txtStepEnd").value = totalSteps;
    $('cmdCancelDownload').onclick = function() {downloadPatternModal.hide();};
}

function downloadPattern() {
    var onbeforeunload = window.onbeforeunload;

    window.onbeforeunload = "";

    $("sequence").value = encodeJSON(sequenceArr);
    
    $("frmDownloadPattern").submit();
    
    setTimeout(function() {window.onbeforeunload = onbeforeunload}, 1000);
}
