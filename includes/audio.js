function AudioChannel(config) {
    if(config) {
        this.src = config.src;
        this.elArr = this.createObjectElements();
    }
}

AudioChannel.prototype = {

    polyphony:  48,
    _padTime:   5,
    
    createObjectElements: function() {
        var elArr = [];
        var el;
        
        for(var n=0; n<this.polyphony; n++) {
            el = new Audio(this.src);
            el.preload = "auto";
            
            elArr.push({
                el:     el,
                busy:   false
            });
        }
        return elArr;
    },
    
    play: function() {
        for(var n=0; n<this.polyphony; n++) {
            if(this.elArr[n].busy) {
                var curTime = (new Date().getTime() / 1000);
                if(curTime > this.elArr[n].busy) {
                    this.elArr[n].busy = false;
                    n--;
                }
            }else {
                this.elArr[n].el.play();
                this.elArr[n].busy = (new Date().getTime() / 1000) + this.elArr[0].el.duration + this._padTime;
                return;
            }
        }
    }
};
