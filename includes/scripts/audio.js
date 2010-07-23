function AudioChannel(config) {
    if(config) {
        this.src = config.src;
        this.elArr = this.createObjectElements();
    }
}

AudioChannel.prototype = {

    polyphony:  100,
    vol:        0.75,
    _padTime:   8,
    
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
            if(this.elArr[n].busy) {
                if(curTime > this.elArr[n].busy) {
                    this.elArr[n].busy = false;
                }
            }else {
                this.elArr[n].el.volume = this.vol;
                this.elArr[n].el.play();
                this.elArr[n].busy = (new Date().getTime() / 1000) + this.elArr[0].el.duration + this._padTime;
                return;
            }
        }
    }
};
