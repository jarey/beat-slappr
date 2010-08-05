var Slider = function(config){
	this._sliderInstanceArr.push(this);
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
	
	this._outterDiv = document.createElement('div');
	this._outterDiv.className = this.containerClass;

	this._innerDiv = document.createElement('div');
	this._innerDiv.className = this.sliderClass;
	
	this._outterDiv.appendChild(this._innerDiv);
	this.container.appendChild(this._outterDiv);

	this._slideRangePx = this._outterDiv.clientHeight - this._innerDiv.offsetHeight;
	
	this.setValue(this.initValue);
	
	this._getDocumentPos(this);
	window.onscroll = this._windowScroll(this);
	
	this._outterDiv.onmousedown = function(e) {
		_this._mouseHandler(e);
		window.onmousemove = function(e) {
			_this._mouseHandler(e);
		};

	    window.onmouseup = function(){
		    window.onmousemove = '';
		    window.onmouseup = '';
		    _this.onSlideComplete(_this._currentValue);
	    };

		return false;
	};
};

Slider.prototype = {
	minValue:                    0,
	maxValue:                  100,
	initValue:                  50,
	container:                  '',
	containerClass:             '',
	sliderClass:                '',
	title:           function() {},
	onSlide:         function() {},
    onSlideComplete: function() {},
	_currentValue:               0,
	_slideRangePx:               0,
	_sliderInstanceArr:         [],


	getValue: function() {
		return this._currentValue;
	},

	setValue: function(val) {
		this._currentValue = val;
		this._setTitleText();
		this._setSliderPos(val);
	},
	
	_mouseHandler: function(e){
		var yPos = e.clientY;					
        var docPos = this._documentPos;
		var val = 0;
		
		if(yPos < docPos.min){
			yPos = docPos.min;
			val = this.maxValue;
		} else if(yPos > docPos.max){
			yPos = docPos.max;
			val = this.minValue;
		} else {
			val = this.maxValue - Math.round((yPos - docPos.min) / docPos.incrementPixels);
		}

		this._currentValue = val;
		this._setTitleText();
		this._innerDiv.style.top = (yPos - docPos.min) + "px";
		this.onSlide(this._currentValue);
	},
	
	_setTitleText: function() {
	    var titleText = this.title(this._currentValue);
        
	    if(titleText) {
            this._innerDiv.title = titleText;
	    }
	},
	
	_setSliderPos: function(val){
		var initPos = Math.round(((val - this.minValue) / (this.maxValue - this.minValue)) * this._slideRangePx);
		this._innerDiv.style.top = this._slideRangePx - initPos + "px"; 
	},
	
	_findElPos: function(obj) {
	    var curleft = curtop = 0;
	    if (obj.offsetParent) {
	        curleft = obj.offsetLeft
	        curtop = obj.offsetTop
	        while (obj = obj.offsetParent) {
	            curleft += obj.offsetLeft
	            curtop += obj.offsetTop
	        }
	    }
	    return {
			elLeft: curleft,
			elTop:  curtop
		};
	},
	
	_getDocumentPos: function(scope) {
		var sliderMargin = this._innerDiv.offsetHeight / 2;
		scope._documentPos = scope._findElPos(scope._outterDiv);

        var minPos = scope._documentPos.elTop - window.scrollY + sliderMargin;
        var maxPos = scope._outterDiv.clientHeight + scope._documentPos.elTop - sliderMargin - window.scrollY;
        
		scope._documentPos = {
			min:                minPos,
			max:                maxPos,
			incrementPixels:    (maxPos - minPos) / (scope.maxValue - scope.minValue)
		};
	},
	
	_windowScroll: function(scope) {
		return function() {
			scope._getDocumentPos(scope);
			for(var n=0; n<scope._sliderInstanceArr.length; n++) {
				var instance = scope._sliderInstanceArr[n];
				instance._getDocumentPos(instance);
			}
		};
	}
};
