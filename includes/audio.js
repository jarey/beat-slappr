function AudioChannel(config) {
    if(config) {
        this.srcOgg = config.srcOgg;
        this.srcMp3 = config.srcMp3;
        this.elArr = this.createObjectElements();
    }
}

AudioChannel.prototype = {

    polyphony:  48,
    _padTime:   5,
    
    createObjectElements: function() {
        var n, el, srcOggEl, srcMp3El;
        var elArr = [];
        
        for(n=0; n<this.polyphony; n++) {
            el = document.createElement("audio");
            srcOggEl = document.createElement("source");
            srcMp3El = document.createElement("source");

            srcOggEl.type="audio/ogg";
            srcOggEl.src = this.srcOgg;
            srcMp3El.type="audio/mpeg";
            srcMp3El.src = this.srcMp3;

            el.appendChild(srcOggEl);
            el.appendChild(srcMp3El);
            document.body.appendChild(el);
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
                }
            }else {
                this.elArr[n].el.play(); 
                this.elArr[n].busy = (new Date().getTime() / 1000) + this.elArr[0].el.duration + this._padTime;
                return;
            }
        }
    }
};
