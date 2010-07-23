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
		return false;
	};

	window.onmouseup = function(){
		window.onmousemove = '';
	};
};

Slider.prototype = {
	minValue:        0,
	maxValue:      100,
	initValue:      50,
	container:      '',
	containerClass: '',
	sliderClass:    '',
	onSlide:        function() {},
	_currentValue:   0,
	_slideRangePx:   0,
	_sliderInstanceArr: [],


	getValue: function() {
		return this._currentValue;
	},

	setValue: function(val) {
		this._currentValue = val;
		this._setSliderPos(val);
	},
	
	_mouseHandler: function(e){
		var yPos = e.clientY;					
		var sliderMargin = this._innerDiv.offsetHeight / 2;
		var minPos = this._documentPos.min + sliderMargin; // Top			
		var maxPos = this._documentPos.max - sliderMargin; // Bottom
		var val = 0;

		if(yPos < minPos ){
			yPos = minPos;
			val = this.maxValue;
		} else if(yPos > maxPos){
			yPos = maxPos;
			val = this.minValue;
		} else {
			var incrementPixels = (maxPos - minPos) / this.maxValue;
			val = this.maxValue - Math.round((yPos - minPos) / incrementPixels);
		}
		this._currentValue = val;
		this._innerDiv.style.top = (yPos - minPos) + "px";
		this.onSlide(this._currentValue);
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
		scope._documentPos = scope._findElPos(scope._outterDiv);
		scope._documentPos = {
			min: scope._documentPos.elTop - window.scrollY,
			max: scope._outterDiv.clientHeight + scope._documentPos.elTop - window.scrollY
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