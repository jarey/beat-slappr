function Kit() {
    /*
        Public Properties:
        
        Public Methods:
        
        setSystemKit();
        setAvailableKits();
    */

    var kitModal,
        kitCache = [],
        
        kitModalContent = " \
            <div class='patternModalHeader'><label class='lblModalTitle'>Kits</label><label class='lblModalButtons' title='close' onclick='sampler.kitModal.hide();'>X</label></div> \
            <div class='patternModalWrapper'> \
                <div id='divKitWrapper' class='modalWrapper'> \
                    [kits] \
                </div> \
            </div>";

    /***KITS***/

    function setAvailableKits(kitArr) {
        if(typeof(kitArr) == 'object') {
            var kitStr = "",
                n;

            for(n=0; n<kitArr.length; n++) {
                kitStr += "<div class='modalWrapperRow' onclick='sampler.setSystemKit(\"" + kitArr[n]['name'] + "\"," + kitArr[n]['id'] + ");'>" + kitArr[n]['name'] + "</div>";
            }

            kitModalContent = kitModalContent.replace(/\[kits\]/, kitStr);
        }else {
            return false;
        }
    }
    this.setAvailableKits = setAvailableKits;

    function _isCached(id) {
        var prop;
        for(prop in kitCache) {
            if(kitCache[prop].id == id) {
                return prop;
            }
        }
        return false;
    }

    function setSystemKitHandler(obj, kitName, kitId, audioFormat, instrumentChannels, instrumentNameArr, channelArr) {
        if(obj.success) {
            var response = decodeJSON(obj.response),
                record,
                mime = "",
                n;

            $("currentKit").innerHTML = kitName;

            if(audioFormat == 'ogg') {
                mime = 'ogg';
            }else if(audioFormat == 'mp3') {
                mime = 'mpeg';
            }

            for(n=0; n<instrumentChannels; n++) {
                instrumentNameArr[n].innerHTML = "";
                channelArr[n].setSrc("");

                record = response[n];
                instrumentNameArr[record.channel].innerHTML = record.name;
                channelArr[record.channel].setSrc("data:audio/" + mime + ";base64," + record.src);
            }

            if(!_isCached(kitId)) {
                kitCache.push({id: kitId, val: obj});
            }

            kitModal.hide();
        }else {
            return false;
        }
    }

    function setSystemKit(kitName, kitId, audioFormat, instrumentChannels, instrumentNameArr, channelArr) {
        kitModal.setContent("<div style='width: 16px; height: 16px; margin: 10px auto;'><img src='includes/images/ajax-loader.gif' /></div>");
        var ajax = new Kodiak.Data.Ajax(),
            cacheIndex = _isCached(kitId);

        if(cacheIndex) {
            setSystemKitHandler(kitCache[cacheIndex].val, kitName, kitId, audioFormat, instrumentChannels, instrumentNameArr, channelArr);
            return;
        }

        ajax.request({
            url:    'api/kit.php',
            method: 'post',
            parameters: {cmd: 'getKitChannels', id: kitId, format: audioFormat},
            handler: function(obj) {setSystemKitHandler(obj, kitName, kitId, audioFormat, instrumentChannels, instrumentNameArr, channelArr);}
        });
    }
    this.setSystemKit = setSystemKit;


    /***INIT***/

    function kitInit(scope) {
        kitModal = new Kodiak.Controls.Modal({
            applyTo:      'aKitModal',
            componentId:  'kitModal',
            modalClass:   'modalWindow kitModal',
            closeOnBlur:  true,
            onBeforeShow: function() {
                this.setContent(kitModalContent);
            }
        });

        scope.kitModal = kitModal;
    }

    kitInit(this);
}
