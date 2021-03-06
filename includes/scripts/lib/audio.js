/*
    Class AudioChannel
    Creates a polyphonic audio channel for playing an instrument

    -------------------------------------------------
    config properties:
    -------------------------------------------------
    src:        The source of the sound clip to play.
                Default: ''
    polyphony:  The number of channels to generate.
*/

function AudioChannel(config) {
    var polyphony = 0;
    if(config) {
        if(config.src) {
            this.setSrc(config.src);
        }
        if(config.polyphony) {
            polyphony = config.polyphony;
        }
    }
    this.init(polyphony);
}

AudioChannel.prototype = {

    /************************/
    /***Private Properties***/
    /************************/

    _polyphony:      4,
    _curChannel:     0,
    _src:           '',
    _vol:         0.75,
    _muted:      false,
    

    /********************/
    /***Public Methods***/
    /********************/

    init: function(polyphony) {
        var n;
        if(polyphony) {
            this._polyphony = polyphony;
        }
        this._channelArr = [];
        for(n=0; n<this._polyphony; n++) {
            this._channelArr.push(new Audio());
        }
    },
    
    setVolume: function(val) {
        var n;
        this._vol = val;
        for(n=0; n<this._polyphony; n++) {
            this._channelArr[n].volume = val;
        }
    },
    
    getVolume: function() {
        return this._vol;
    },
    
    setMute: function(state) {
        var n;
        this._muted = state;
        for(n=0; n<this._polyphony; n++) {
            this._channelArr[n].muted = state;
        }
    },
    
    getMute: function() {
        return this._muted;
    },
    
    setSrc: function(src) {
        var n;
        this._src = src;
        for(n=0; n<this._polyphony; n++) {
            this._channelArr[n].src = src;
        }
    },

    getSrc: function() {
        return this._src;
    },
    
    getValidFormats: function() {
        var playTypes = {},
            channel = this._channelArr[this._curChannel];

        if(channel.canPlayType) {
            //Currently canPlayType(type) returns: "no", "maybe" or "probably"
            playTypes.ogg = (channel.canPlayType("audio/ogg") != "no") && (channel.canPlayType("audio/ogg") !== "");
            playTypes.mp3 = (channel.canPlayType("audio/mpeg") != "no") && (channel.canPlayType("audio/mpeg") !== "");
            playTypes.wav = (channel.canPlayType("audio/wav") != "no") && (channel.canPlayType("audio/wav") !== "");

            return playTypes;
        }
        return false;
    },
    
    play: function() {
        this._channelArr[this._curChannel].load();
        this._channelArr[this._curChannel].play();

        this._curChannel++;
        if(this._curChannel == this._polyphony) {
            this._curChannel = 0;
        }
    }
};
