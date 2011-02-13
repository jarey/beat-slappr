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
        patternAjax,

        emailErrorMesg = "The email address you provided was not valid.",

        downloadPatternModalContent = " \
            <div class='patternModalHeader'><label class='lblModalTitle'>Download Loop</label><label class='lblModalButtons' title='close' onclick='sampler.downloadPatternModal.hide();'>X</label></div> \
            <div class='patternModalWrapper'> \
                <form action='download.php' method='post' onsubmit='return false;' name='frmDownloadPattern' id='frmDownloadPattern'> \
                    <label class='labelText'>Steps:</label><br /> \
                    <input type='text' name='stepStart' id='txtStepStart' maxlength='2' style='width: 30px;' value='1' /> - <input type='text' name='stepEnd' id='txtStepEnd' maxlength='2' style='width: 30px;' /> <b>X</b>\
                    <select name='loopCount' id='loopCount'> \
                        <option value='1'>1</option> \
                        <option value='2'>2</option> \
                        <option value='4' selected='selected'>4</option> \
                        <option value='8'>8</option> \
                        <option value='16'>16</option> \
                    </select> <b>loops</b><hr /> \
                    <label class='labelText'>Format:</label><br /> \
                    <input type='radio' name='format' checked='checked' value='wav' /> wav<br /> \
                    <input type='radio' name='format' value='ogg' /> ogg<br /> \
                    <input type='radio' name='format' value='mp3' /> mp3 (may not loop properly)<br /><br /> \
                    <input type='hidden' name='sequence' id='sequence' /> \
                    <input type='submit' id='cmdDownloadPattern' value='download' /> <img id='imgDownloadLoader' style='display: none;' src='includes/images/ajax-loader.gif' /> \
                </form> \
                <br /><b>- OR -</b><br /><br /> \
                <img src='includes/images/small-connect-with-sc.png' id='imgSoundcloudUpload' style='cursor: pointer;' /> \
            </div>",

        soundcloudUploadModalContent = " \
            <div class='patternModalHeader'><label class='lblModalTitle'>Download Loop</label><label class='lblModalButtons' title='close' onclick='sampler.downloadPatternModal.hide();'>X</label></div> \
            <div class='patternModalWrapper'> \
                <iframe id='soundcloudIframe' style='width: 100%; height: 400px; border: none;'></iframe> \
            </div>",

        savePatternModalContent = " \
            <div class='patternModalHeader'><label class='lblModalTitle'>Save Pattern</label><label class='lblModalButtons' title='close' onclick='sampler.savePatternModal.hide();'>X</label></div> \
            <div class='patternModalWrapper'> \
                <div id='divSavePatternMesg' class='error'></div> \
                <div id='divGuestPatternSaveWrapper' class='guestWrapper'> \
                    Log in now to save your pattern.<br /><br /> \
                    <label class='lblLink' onclick='sampler.loginModal.show();'>login</label>&nbsp;&nbsp;&nbsp;&nbsp;<label class='lblLink' onclick='sampler.signupModal.show();'>sign up</label><br /><br /><br /> \
                    <span style='color: #ff0000;'>Don't worry-</span> <span style='font-weight: normal;'>If you haven't created an account yet, whatever you're working on right now will be automatically saved in your account when you sign up.</span> \
                </div> \
                <div id='divUserPatternSaveWrapper'> \
                    <form action='' onsubmit='return false;' id='frmSavePattern'> \
                        <label class='labelText'>Name:</label> \
                        <input type='text' id='txtSavePattern' class='modalText' /><br /><br /> \
                        <input type='submit' id='cmdSavePattern' value='save' /> <img id='imgSavePatternLoader' style='display: none;' src='includes/images/ajax-loader.gif' /> <input type='button' id='cmdCancelSave'  value='cancel' /> \
                    </form> \
                </div> \
            </div>",

        patternModalContent = " \
            <div id='divPatternMesg' class='error' style='display: none;'></div> \
            <div class='patternModalHeader'><label class='lblModalTitle'>Patterns</label><label class='lblModalButtons' title='close' onclick='sampler.patternModal.hide();'>X</label></div> \
            <div class='patternModalWrapper'> \
                <div class='patternHeader'>My Patterns</div> \
                <div id='divGuestPatternWrapper' class='guestWrapper'> \
                    Log in now to create and edit your own patterns.<br /><br /> \
                    <label class='lblLink' onclick='sampler.loginModal.show();'>login</label>&nbsp;&nbsp;&nbsp;&nbsp;<label class='lblLink' onclick='sampler.signupModal.show();'>sign up</label> \
                </div> \
                <div id='divMyPatternWrapper' style='display: none;'> \
                    <div id='divWithSelectedPatterns'> \
                        Select: <label id='lblSelectAll' class='lblLink' style='font-weight: normal;'>all</label>, <label id='lblSelectNone' class='lblLink' style='font-weight: normal;'>none</label>&nbsp;&nbsp;|&nbsp;&nbsp; \
                        With Selected: \
                        <input type='button' id='cmdRenamePattern' value='rename' class='withSelectedBtn' /> \
                        <input type='button' id='cmdDeletePattern' value='delete' class='withSelectedBtn' /> \
                    </div> \
                    <div id='divUserPatterns' class='patternTable userPatternTable'></div> \
                </div> \
                <div class='patternHeader'>Preset Patterns</div> \
                <div id='divPresetPatterns' class='patternTable presetPatternTable' style='margin-bottom: 0;'></div> \
            </div>"

        sharePatternModalContent = " \
            <div class='patternModalHeader'><label class='lblModalTitle'>Share Pattern</label><label class='lblModalButtons' title='close' onclick='sampler.sharePatternModal.hide();'>X</label></div> \
            <div class='patternModalWrapper'> \
                <div id='divSharePatternMesg' class='error'></div> \
                <form action='' onsubmit='return false;' id='frmSharePattern'> \
                    <div id='divGuestUser'> \
                        <label class='labelText'>Your email:</label><br /> \
                        <input type='text' class='modalText' id='txtUserEmail' /><br /><br /> \
                    </div> \
                    <label class='labelText'>Share with:<br /><span style='font-weight: normal;'>(separate multiple email addresses with commas)</span></label> \
                    <input type='text' id='txtShareWithEmail' class='modalText' /><br /><br /> \
                    <input type='submit' id='cmdSharePattern' value='share' /> <img id='imgSharePatternLoader' style='display: none;' src='includes/images/ajax-loader.gif' /> <input type='button' id='cmdCancelShare'  value='cancel' /> \
                </form> \
            </div>";



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
            sequenceArr = sampler.getSequenceArr(),
            pattern;

        if(response.success) {
            $("frmSavePattern").style.display = "none";
            divSavePatternMesg = $('divSavePatternMesg');
            divSavePatternMesg.className = "success";
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

        sequenceStr = encodeJSON(sampler.getSequenceArr());

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
            $('frmSharePattern').style.display = "none";
            divSharePatternMesg = $('divSharePatternMesg');
            divSharePatternMesg.className = "success";
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
        sequenceStr = encodeJSON(sampler.getSequenceArr());
        
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

        $("cmdDownloadPattern").style.display = "none";
        $("imgDownloadLoader").style.display = "inline";

        window.onbeforeunload = "";

        $("sequence").value = encodeJSON(sampler.getSequenceArr());
        
        $("frmDownloadPattern").submit();
        
        setTimeout(function() {window.onbeforeunload = onbeforeunload; sampler.downloadPatternModal.hide();}, 1000);
    }

    function downloadPatternInit() {
        downloadPatternModal.updateModalClass("modalWindow downloadModal");

        $("cmdDownloadPattern").onclick = downloadPattern;
        $("imgSoundcloudUpload").onclick = soundcloudUploadInit;
        $("txtStepEnd").value = sampler.getTotalSteps();
    }


    /**************************************/
    /***SOUNDCLOUD UPLOAD MODAL HANDLING***/
    /**************************************/

    function soundcloudUploadInit() {
        var stepStart = $('txtStepStart').value,
            stepEnd = $('txtStepEnd').value,
            loopCount = $('loopCount').value

        downloadPatternModal.updateModalClass("modalWindow soundcloudModal");
        downloadPatternModal.setContent(soundcloudUploadModalContent);
        patternAjax.request({
            url:    'download.php',
            method: 'post',
            parameters: {
                stepStart: stepStart,
                stepEnd: stepEnd,
                loopCount: loopCount,
                format: 'soundcloud',
                sequence: encodeJSON(sampler.getSequenceArr())
            },
            handler: function(obj) {$('soundcloudIframe').src = obj.response;}
        });
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
                this.setContent(patternModalContent);
            },
            onShowComplete: userPatternInit
        });

        savePatternModal = new Kodiak.Controls.Modal({
            applyTo:     'divSavePattern',
            componentId: 'savePatternModal',
            modalClass:  'modalWindow accountModal',
            orientation: 'right',
            onBeforeShow: function() {
                this.setContent(savePatternModalContent);
            },
            onShowComplete: savePatternInit
        });

        sharePatternModal = new Kodiak.Controls.Modal({
            applyTo:     'divSharePattern',
            componentId: 'sharePatternModal',
            modalClass:  'modalWindow accountModal',
            orientation: 'right',
            onBeforeShow:   function() {
                this.setContent(sharePatternModalContent);
            },
            onShowComplete: sharePatternInit
        });

        downloadPatternModal = new Kodiak.Controls.Modal({
            applyTo:     'divDownloadPattern',
            componentId: 'downloadPatternModal',
            modalClass:  'modalWindow downloadModal',
            orientation: 'right',
            onBeforeShow:   function() {
                this.setContent(downloadPatternModalContent);
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
