/*
    Class AudioChannel
    Creates a polyphonic audio channel for playing an instrument

    -------------------------------------------------
    config properties:
    -------------------------------------------------
    src:        The source of the sound clip to play.
                Default: ''
    polyphony:  The number of channels to generate.
                Default: 4.
*/

function AudioChannel(config) {
    var polyphony;
    
    if(config) {
        if(config.src) {
            this.setSrc(config.src);
        }
        polyphony = config.polyphony;
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
        if(polyphony) {
            this._polyphony = polyphony;
        }
        this._channelArr = [];
        for(var n=0; n<this._polyphony; n++) {
            this._channelArr.push(new Audio());
        }
    },
    
    setVolume: function(val) {
        this._vol = val;
    },
    
    getVolume: function() {
        return this._vol;
    },
    
    setMute: function(state) {
        this._muted = state;
    },
    
    setSrc: function(src) {
        this._src = src;    
    },

    getValidFormats: function() {
        var playTypes = {};
        var channel = this._channelArr[this._curChannel];
        if(channel.canPlayType) {
            //Currently canPlayType(type) returns: "no", "maybe" or "probably"
            playTypes.ogg = (channel.canPlayType("audio/ogg") != "no") && (channel.canPlayType("audio/ogg") != "");
            playTypes.mp3 = (channel.canPlayType("audio/mpeg") != "no") && (channel.canPlayType("audio/mpeg") != "");
            playTypes.wav = (channel.canPlayType("audio/wav") != "no") && (channel.canPlayType("audio/wav") != "");

            return playTypes;
        }
        return false;
    },
    
    play: function() {
            var channel = this._channelArr[this._curChannel];

            channel.src = this._src;
            channel.load();
            channel.volume = this._vol;
            channel.muted = this._muted;
            channel.play();

            this._curChannel++;
            if(this._curChannel == this._polyphony) {
                this._curChannel = 0;
            }
    }
};
