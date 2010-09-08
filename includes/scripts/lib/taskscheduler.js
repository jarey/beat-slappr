Kodiak.Data.PriorityTask = function() {
    this.eventQueue = [];
};

Kodiak.Data.PriorityTask.prototype = {
    timeout:   0,
    blocked:   false,
    blockTime: 60,
    loopTime:  10,
    _timeout:   0,
    _isCleared: true,
    _fn:        function() {},

    add: function(fn, timeout) {
        var _this = this;
        this._fn = fn;
        this._isCleared = false;
        this.executionTime = new Date().getTime() + timeout;
        this.timeout = timeout;
        this._timeout = setTimeout(function() {_this._async();}, (timeout - this.loopTime));
    },
    
    clear: function() {
        clearTimeout(this._timeout);
        this._isCleared = true;
        this.fire();
    },

    run: function(fn) {
        if(this._isCleared) { //not running or running and not blocked
            fn();
        }else {  //running
            this.blocked = ((this.executionTime - new Date().getTime()) >= (this.timeout - this.blockTime)) ? true : false;
            if(this.blocked) {
                this.eventQueue.push(fn);
            }else {
                fn();
            }
        }

    },
    
    _async: function() {
        var sTime = new Date().getTime(),
            eTime = sTime,
            delay = this.executionTime - sTime;
        
        while((delay - (eTime - sTime)) > 0) {
            eTime = new Date().getTime();
            if(this._isCleared) {
                return false;
            }
        }
        this._fn();
        this.blocked = false;
    },
    
    fire: function() {
        //needs to eventually be updated to only run through queue as long as state is not blocked!
        var fn;

        for(fn in this.eventQueue) {
            if(this.eventQueue[fn]) {
                this.eventQueue[fn]();
            }
        }
        this.eventQueue = [];
    }
};
