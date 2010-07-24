function AudioChannel(config) {
    if(config) {
        this.src = config.src;
        this.elArr = this.createObjectElements();
    }
}

AudioChannel.prototype = {

    polyphony:  128,
    _padTime:   10,
    vol:        0.75,
    
    createObjectElements: function() {
        var elArr = [];
        
        for(var n=0; n<this.polyphony; n++) {
            elArr.push({
                el:     new Audio(this.src),
                busy:   false
            });
        }
        return elArr;
    },
    
    play: function() {
        var curTime = (new Date().getTime() / 1000);      
        for(var n=0; n<this.polyphony; n++) {
            var channel = this.elArr[n];
            if(channel.busy) {
                if(curTime > channel.busy) {
                    channel.busy = false;
                }
            }else {
                channel.el.volume = this.vol;
                channel.el.play();
                channel.busy = (new Date().getTime() / 1000) + channel.el.duration + this._padTime;
                return;
            }
        }
    }
};
