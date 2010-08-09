var StepWidget = function(config) {
    var _this = this;
    if(config) {
        for(prop in config) {
            this[prop] = config[prop];
        }
        if(this.container && typeof(this.container) != 'object') {
            alert('Invalid Container');
            return;
        }		
    } else {
        alert('Invalid Config');
        return;
    }

    this.render();

    this.setValue(this.initValue);

    this.textEl.onkeydown = function(e) {
	    if(!e) {
	        var e = window.event;
	    }

    	if(!e || !((e.keyCode >= 48 && e.keyCode <= 57) || (e.keyCode >= 96 && e.keyCode <= 105) || (e.keyCode >= 35 && e.keyCode <= 40) || (e.keyCode == 8) || (e.keyCode == 46))) {
            return false;
        }
    };

    this.textEl.onchange = function() {_this.changeValue(_this);};
    this.incEl.onmousedown = function() {_this.incValue(_this); return false;};
    this.decEl.onmousedown = function() {_this.decValue(_this); return false};
};

StepWidget.prototype = {

    btnWidth:      25,
    minValue:       0,
    maxValue:     100,
    initValue:     50,
    txtPadding:     5,
    clickDelay:   500,
    clickTimeout:  80,
    trigger:     true,
    maxLength:      0,
    title:         '',
    bodyClass:     '',
    txtClass:      '',
    incBtnClass:   '',
    decBtnClass:   '',
    _value:         0,
    onValueChange: function() {},

    render: function() {
        this.container.title = this.title;

        this.bodyEl = document.createElement('div');
        this.bodyEl.className = this.bodyClass;
        
        this.textEl = document.createElement('input');
        this.textEl.style.padding = "0 " + this.txtPadding + "px 0 0";
        this.textEl.className = this.txtClass;
        if(this.maxLength > 0) {
            this.textEl.setAttribute('maxLength', this.maxLength);
        }

        this.btnWrapperEl = document.createElement('div');
        this.btnWrapperEl.style.width = this.btnWidth + "px";
        this.btnWrapperEl.style.cssFloat = "right";

        this.incEl = document.createElement('div');
        this.incEl.className = this.incBtnClass;

        this.decEl = document.createElement('div');
        this.decEl.className = this.decBtnClass;

        this.bodyEl.appendChild(this.textEl);
        this.btnWrapperEl.appendChild(this.incEl);
        this.btnWrapperEl.appendChild(this.decEl);
        this.bodyEl.appendChild(this.btnWrapperEl);
        this.container.appendChild(this.bodyEl);
        this.textEl.style.height = this.bodyEl.clientHeight + "px";
        this.textEl.style.width = (this.bodyEl.clientWidth - this.btnWidth) - this.txtPadding + "px";

        var halfHeight = Math.round((this.bodyEl.clientHeight / 2));
        this.incEl.style.height = (halfHeight - (this.incEl.offsetHeight - this.incEl.clientHeight)) + "px";
        this.decEl.style.height = this.bodyEl.clientHeight - this.incEl.offsetHeight + "px";
    },
    
    getValue: function() {
        return this.textEl.value;
    },

    setValue: function(val) {
        this.textEl.value = val;
        this._value = val;
        this.onValueChange(val);
    },

    changeValue: function(scope) {
        if(scope.textEl.value < scope.minValue || !scope.textEl.value) {
            scope.setValue(scope.minValue);
        }else if(scope.textEl.value > scope.maxValue) {
            scope.setValue(scope.maxValue);
        }else {
            scope.setValue(parseInt(scope.textEl.value));
        }
    },
    
    incValue: function(scope) {
        if(scope.textEl.value < scope.minValue) {
            scope.setValue(scope.minValue);
        }else if(scope.textEl.value > scope.maxValue) {
            scope.setValue(scope.maxValue);
        }else if(scope.textEl.value < scope.maxValue) {
            scope.setValue(scope._value+1);
        }
        if(scope.trigger) {
            window.onmouseup = function() {
                clearTimeout(scope._timeout);
                window.onmouseup = "";
            };
            scope._timeout = setTimeout(function() {scope._incValue(scope);}, scope.clickDelay);
        }
    },

    _incValue: function(scope) {
        if(scope.textEl.value < scope.maxValue) {
            scope.setValue(scope._value+1);
        }
        scope._timeout = setTimeout(function() {scope._incValue(scope);}, scope.clickTimeout);
    },

    decValue: function(scope) {
        if(scope.textEl.value > scope.maxValue) {
            scope.setValue(scope.maxValue);
        }else if(scope.textEl.value < scope.minValue) {
            scope.setValue(scope.minValue);
        }else if(scope.textEl.value > scope.minValue) {
            scope.setValue(scope._value-1);
        }
        if(scope.trigger) {
            window.onmouseup = function() {
                clearTimeout(scope._timeout);
                window.onmouseup = "";
            };
            scope._timeout = setTimeout(function() {scope._decValue(scope);}, scope.clickDelay);
        }
    },

    _decValue: function(scope) {
        if(scope.textEl.value > scope.minValue) {
            scope.setValue(scope._value-1);
        }
        scope._timeout = setTimeout(function() {scope._decValue(scope);}, scope.clickTimeout);
    },
};
