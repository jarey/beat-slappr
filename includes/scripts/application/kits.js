function Kit() {
    /*
        Public Properties:
        
        Public Methods:
        
        setSystemKit();
    */

    var kitModal,
        kitCache = [];

    /***KITS***/

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

    function kitInit() {
        kitModal = new Kodiak.Controls.Modal({
            applyTo:      'aKitModal',
            componentId:  'kitModal',
            modalClass:   'modalWindow kitModal',
            orientation:  'right',
            closeOnBlur:  true,
            onBeforeShow: function() {
                this.setContent($('txtKitWindow').value);
            }
        });
    }

    kitInit();
}
