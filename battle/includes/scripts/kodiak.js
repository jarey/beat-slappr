var Kodiak = {
    Data: {}
};

Kodiak.Data.Ajax = function() {
    this._getXMLHttpRequest();
};

Kodiak.Data.Ajax.prototype = {
    _http_request: false,
    
    request: function(obj) {
        var _this = this, params;
        
        obj.method = obj.method.toLowerCase();
        this._http_request.onreadystatechange = function() {_this._handleResponse(obj.handler);};
        obj.parameters = this._objToPostStr(obj.parameters);
        
        if(obj.method == 'get' && obj.parameters) {
            obj.url += "?" + obj.parameters;
        }    
        
        this._http_request.open(obj.method, obj.url, true);
        
        if(obj.method == 'post') {
            params = obj.parameters;
            this._http_request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            this._http_request.setRequestHeader("Content-length", obj.parameters.length);
            this._http_request.setRequestHeader("Connection", "close");
        }

        this._http_request.send(params);
    },
    
    submitForm: function(obj) {
        var formFields = obj.form.elements,
            postObj = {},
            field;

        for(field in formFields) {
            if(formFields[field].name && formFields[field].value) {
                postObj[formFields[field].name] = encodeURI(formFields[field].value);
            }
        }
        this.request({url: obj.url, method: obj.method, parameters: postObj, handler: obj.handler});
    },

    _getXMLHttpRequest: function() {
        if (window.XMLHttpRequest) { // Mozilla, Safari,...
            this._http_request = new XMLHttpRequest();
            if (this._http_request.overrideMimeType) {
                this._http_request.overrideMimeType('text/html');
            }
        } else if (window.ActiveXObject) { // IE
            try {
                this._http_request = new ActiveXObject("Msxml2.XMLHTTP");
            }catch(e) {
                this._http_request = new ActiveXObject("Microsoft.XMLHTTP");
            }
        }
        if (!this._http_request) {
            return false;
        }
    },
    
    _objToPostStr: function(obj) {
        if(typeof(obj) == 'object') {
            var postStr = "",
                prop;
            for(prop in obj) {
                if(obj[prop]) {
                    postStr += prop + "=" + escape(obj[prop]) + "&";
                }
            }
            postStr = postStr.replace(/\&$/, '');
            return postStr;
        }else {
            return obj;
        }
    },

    _handleResponse: function(handler) {
        if (this._http_request.readyState == 4) {
            if (this._http_request.status == 200) {
                handler({success: true, response: this._http_request.responseText});
            }else {
                handler({success: false});
            }
        }
    }
};
