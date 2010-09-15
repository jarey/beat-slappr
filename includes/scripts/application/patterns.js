function Pattern() {

    /*

    Public Properties:
    
    patternModal
    savePatternModal
    sharePatternModal
    downloadPatternModal

    Public Methods:

    setPattern()
    setUserPatternArr()
    setSystemPatternArr()
    setUserPatternDirtyFlag()

    */

    var patternModal, savePatternModal, sharePatternModal, downloadPatternModal,
        currentPattern,

        cmdRenamePattern, cmdDeletePattern, divPatternMesg,
        divSharePatternMesg, txtUserEmail, txtShareWithEmail, cmdSharePattern, imgSharePatternLoader,
        divSavePatternMesg, txtSavePattern, cmdSavePattern, imgSavePatternLoader,

        userPatternDataset, systemPatternDataset,

        userPatternDataIsDirty = false,
        userPatternArr = [],
        systemPatternArr = [],
        patternAjax;


    /*******************************/
    /***GET/SET PATTERN FUNCTIONS***/
    /*******************************/

    function setPattern(val, type, priorityTask, sequenceArr, volumeWidgetArr, stepsWidget, tempoWidget) {
        if(typeof(val) == "number" && type) {
            if(type == "user") {
                val = userPatternDataset.getRow(val);
            }else if(type == "system") {
                val = systemPatternDataset.getRow(val);
            }
        }

        if(typeof(val) == "object") {
            priorityTask.run(
                function() {
                    var ch, 
                        util;

                    util = new Kodiak.Util();
                    if(typeof(val) == 'string') {
                        util.clone(decodeJSON(val), sequenceArr);
                    }else if(typeof(val) == 'object') {
                        util.clone(val, sequenceArr);
                    }
                    
                    for(ch in sequenceArr.chVol) {
                        if(sequenceArr.chVol[ch]) {
                            volumeWidgetArr[ch].setValue(sequenceArr.chVol[ch]);
                        }
                    }

                    stepsWidget.setValue(parseInt(sequenceArr.steps, 10));
                    tempoWidget.setValue(parseInt(sequenceArr.tempo, 10));
                    sampler.setSystemKit(sequenceArr.kit.name, parseInt(sequenceArr.kit.id, 10));
                    
                    if(sequenceArr.name) {
                        currentPattern.innerHTML = sequenceArr.name;
                    }
                }
            );
        }
    }
    this.setPattern = setPattern;

    function setUserPatternArr(val) {
        userPatternArr = val;
    }
    this.setUserPatternArr = setUserPatternArr;
    
    function setSystemPatternArr(val) {
        systemPatternArr = val;
    }
    this.setSystemPatternArr = setSystemPatternArr;

    function setUserPatternDirtyFlag(val) {
        userPatternDataIsDirty = val;
    }
    this.setUserPatternDirtyFlag = setUserPatternDirtyFlag;


    /****************************/
    /***PATTERN MODAL HANDLING***/
    /****************************/

    function setWithSelectedBtnState() {
        var selectedRowCount = userPatternDataset.getSelectedRowCount(),
            buttonState = false;

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

    function userPatternHandler(obj) {
        var response,
            userPatternTable,
            systemPatternTable;

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
                    applyTo: 'divUserPatterns',
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
                                return "<div onclick='sampler.setPattern(" + data.index + ", \"user\");'>" + data.val.name + "</div>";
                            }
                        },
                        Kit: {
                            dataField: 'kit.name',
                            sortable: true,
                            width: 110,
                            renderFn: function(data) {
                                return "<div onclick='sampler.setPattern(" + data.index + ", \"user\");'>" + data.val.kit.name + "</div>";
                            }
                        },
                        Tempo: {
                            dataField: 'tempo',
                            sortable: true,
                            width: 60,
                            align: 'right',
                            renderFn: function(data) {
                                return "<div onclick='sampler.setPattern(" + data.index + ", \"user\");'>" + data.val.tempo + "</div>";
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
                    applyTo: 'divPresetPatterns',
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
                                return "<div onclick='sampler.setPattern(" + data.index + ", \"system\");'>" + data.val.name + "</div>";
                            }
                        },
                        Kit: {
                            dataField: 'kit.name',
                            sortable: true,
                            width: 120,
                            renderFn: function(data) {
                                return "<div onclick='sampler.setPattern(" + data.index + ", \"system\");'>" + data.val.kit.name + "</div>";
                            }
                        },
                        Tempo: {
                            dataField: 'tempo',
                            sortable: true,
                            width: 60,
                            align: 'right',
                            renderFn: function(data) {
                                return "<div onclick='sampler.setPattern(" + data.index + ", \"system\");'>" + data.val.tempo + "</div>";
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

    function renameHandler(obj, newName) {
        var response = decodeJSON(obj.response),
            selectedPatterns;
        
        if(response.success) {
            divPatternMesg.style.display = "none";
            selectedPatterns = userPatternDataset.getSelected();

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
        var response = decodeJSON(obj.response),
            n=0,
            val,
            index;

        if(response.success) {
            divPatternMesg.style.display = "none";
            for(index in delIdArr) {
                if(delIdArr[index]) {
                    val = delIdArr[index] - n;
                    userPatternDataset.data.splice(val, 1);
                    n++;
                }
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

    function doWithSelected(val) {
        var selectedPatterns = userPatternDataset.getSelected(),
            originalName,
            newName,
            postObj,
            delIdArr,
            delNameArr,
            key,
            value,
            pattern;

        switch(val) {
            case "rename":
                if(selectedPatterns.length == 1) {
                    originalName = selectedPatterns[0].data.name;
                    newName = prompt("New name:", originalName);
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
                        postObj = {
                            cmd:   'delete',
                            items: ''
                        };
                        delIdArr = [];
                        delNameArr = [];
                        for(pattern in selectedPatterns) {
                            if(selectedPatterns[pattern]) {
                                key = selectedPatterns[pattern].index;
                                value = selectedPatterns[pattern].data.name;
                                delIdArr.push(key);
                                delNameArr.push(value);
                            }
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

    function userPatternInit() {
        var type,
            obj = {},
            divGuestPatternWrapper = $('divGuestPatternWrapper'),
            divMyPatternWrapper = $('divMyPatternWrapper');

        divPatternMesg = $('divPatternMesg');

        if(sampler.sessionExists()) {
            divMyPatternWrapper.style.display = "block";
            divGuestPatternWrapper.style.display = "none";
            cmdRenamePattern = $('cmdRenamePattern');
            cmdRenamePattern.onclick = function() {doWithSelected('rename');};
            cmdDeletePattern = $('cmdDeletePattern');
            cmdDeletePattern.onclick = function() {doWithSelected('delete');};
            $('lblSelectAll').onclick = function() {userPatternDataset.selectAllRows(true);};
            $('lblSelectNone').onclick = function() {userPatternDataset.selectAllRows(false);};

            if(systemPatternArr.length) {
                type = "user";
                if(!userPatternDataIsDirty) {
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
                obj.response = {success: true, data: {system: systemPatternArr}};
                userPatternHandler(obj);
                return;            
            }
            type = "system";
        }

        patternAjax.request({
            url:    'api/pattern.php',
            method: 'post',
            parameters: {cmd: 'get', type: type},
            handler: userPatternHandler
        });
    }


    /*********************************/
    /***SAVE PATTERN MODAL HANDLING***/
    /*********************************/

    function savePatternHandler(obj, patternName) {
        var response = decodeJSON(obj.response),
            util,
            newSequence,
            pattern;

        if(response.success) {
            savePatternModal.setContent("<label class='lblLink' style='float: right;' onclick='sampler.savePatternModal.hide();'>Close</label><div id='divSavePatternMesg' class='success' style='clear: right; padding-top: 20px;'></div>");
            divSavePatternMesg = $('divSavePatternMesg');
            util = new Kodiak.Util();
            if(response.action == "added") {
                //if a new pattern was added, clone sequencearr, update the new array's name property to the name
                //of the new pattern, and push it to userPatternArr.

                newSequence = {};
                util.clone(sequenceArr, newSequence);
                newSequence.name = patternName;
                userPatternArr.push(newSequence);
            }else if(response.action == "updated") {
                //if an existing pattern was updated, look up the pattern in userPatternArr and update it's value
                //with a clone of sequenceArr.

                for(pattern in userPatternArr) {
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

    function savePattern() {
        var sequenceStr,
            pattern,
            patternExists = false,
            patternName = txtSavePattern.value,
            overwrite;

        for(pattern in userPatternArr) {
            if(userPatternArr[pattern].name == patternName) {
                patternExists = true;
                break;
            }
        }

        if(patternExists) {
            overwrite = confirm("A pattern with this name already exists.  Overwrite?");
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

    function savePatternInit() {
        var divGuestPatternSaveWrapper = $("divGuestPatternSaveWrapper"),
            divUserPatternSaveWrapper = $("divUserPatternSaveWrapper");

        divSavePatternMesg = $("divSavePatternMesg");
        divSavePatternMesg.innerHTML = "";
        divSavePatternMesg.style.display = "none";

        if(sampler.sessionExists()) {
            divGuestPatternSaveWrapper.style.display = "none";
            divUserPatternSaveWrapper.style.display = "block";
            
            $("frmSavePattern").onkeydown = stopPropagation;

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


    /**********************************/
    /***SHARE PATTERN MODAL HANDLING***/
    /**********************************/

    function sharePatternHandler(obj) {
        var response = decodeJSON(obj.response);
        if(response.success) {
            sharePatternModal.setContent("<label class='lblLink' style='float: right;' onclick='sampler.sharePatternModal.hide();'>Close</label><div id='divSharePatternMesg' class='success' style='clear: right; padding-top: 20px;'></div>");
            divSharePatternMesg = $('divSharePatternMesg');
        }else {
            cmdSharepattern.style.display = "inline";
            imgSharePatternLoader.style.display = "none";
        }
        divSharePatternMesg.innerHTML = response.mesg;
    }

    function sharePattern() {
     
        /***VALIDATION***/

        var user = "",
            sequenceStr = "",
            errorArr = [],
            shareArr,
            share;

        if(txtUserEmail && !isValidEmail(txtUserEmail.value)) {
            errorArr.push(emailErrorMesg);
        }
        if(!txtShareWithEmail.value) {
            errorArr.push("You must provide at least one recipient");
        }else {
            shareArr = txtShareWithEmail.value.split(',');    
            for(share in shareArr) {
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
                hash: md5(user + sequenceStr + Math.random()),
                recipients: txtShareWithEmail.value
            },
            handler: sharePatternHandler
        });
    }

    function sharePatternInit() {
        var divGuestUser = $('divGuestUser');

        divSharePatternMesg = $('divSharePatternMesg');
        divSharePatternMesg.innerHTML = "";

        $('frmSharePattern').onkeydown = stopPropagation;

        divShareUser = $('divShareUser');

        txtShareWithEmail = $('txtShareWithEmail');
        txtShareWithEmail.value = '';

        if(sampler.sessionExists()) {
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


    /*************************************/
    /***DOWNLOAD PATTERN MODAL HANDLING***/
    /*************************************/

    function downloadPattern() {
        var onbeforeunload = window.onbeforeunload;

        window.onbeforeunload = "";

        $("sequence").value = encodeJSON(sequenceArr);
        
        $("frmDownloadPattern").submit();
        
        setTimeout(function() {window.onbeforeunload = onbeforeunload;}, 1000);
    }

    function downloadPatternInit() {
        $("cmdDownloadPattern").onclick = downloadPattern;
        $("txtStepEnd").value = sampler.getTotalSteps();
        $('cmdCancelDownload').onclick = function() {downloadPatternModal.hide();};
    }


    /******************/
    /***PATTERN INIT***/
    /******************/

    function patternInit(scope) {
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

        scope.patternModal = patternModal;
        scope.savePatternModal = savePatternModal;
        scope.sharePatternModal = sharePatternModal;
        scope.downloadPatternModal = downloadPatternModal;
    }

    patternInit(this);

}
