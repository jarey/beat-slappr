function hasClass(ele,cls) {
    return ele.className.match(new RegExp('(\\s|^)'+cls+'(\\s|$)'));
}

function addClass(ele,cls, skip) {
    if(skip || !this.hasClass(ele,cls)) {
        ele.className += " " + cls;
    }
}

function removeClass(ele,cls, skip) {
    var reg = new RegExp('(\\s|^)'+cls+'(\\s|$)');
    if(skip || hasClass(ele,cls)) {
        ele.className=ele.className.replace(reg,' ');
    }
}

function $(el) {
    return document.getElementById(el);
}

function getElementsByClassName(className) {
    elArr = document.getElementsByTagName('*');
    elClassArr = [];
    for(var n=0; n<elArr.length; n++) {
        if(hasClass(elArr[n], className)) {
            elClassArr.push(elArr[n]);
        }
    }
    return elClassArr;
}

function encodeJSON(arr, parentIsArray) {
    var parts = [];
    var is_list = (Object.prototype.toString.apply(arr) === '[object Array]');

    for(var key in arr) {
        if(arr[key]) {
            var value = arr[key];
            var str = "";

            if(typeof value == "object") { //Custom handling for arrays
                if(is_list) {
                    parts.push(encodeJSON(value, true));
                }else {
                    str  = '"' + key + '":' + encodeJSON(value);
                    parts.push(str);
                }
            } else {
                if(!parentIsArray) {
                    str = '"' + key + '":';
                }

                //Custom handling for multiple data types
                if(typeof value == "number") {
                    str += value; //Numbers
                }else if(value === false) {
                    str += 'false'; //The booleans
                }else if(value === true) {
                    str += 'true';
                }else {
                    str += '"' + value + '"'; //All other things
                }

                parts.push(str);
            }
        }
    }
    var json = parts.join(",");
    
    if(is_list) {
        return '[' + json + ']';//Return numerical JSON
    }else {
        return '{' + json + '}';//Return associative JSON
    }
}

var decodeJSON = function(str) {
    var val;
    try {
        val = eval('(' + str + ')');
    }catch(err) {
        val = err;
    }
    return val;
};

function isValidEmail(email) {
    if(email.match(/^[A-Z0-9._%+\-]+@[A-Z0-9.\-]+\.[A-Z]{2,4}$/i)) {
        return true;
    }else {
        return false;
    }
}

function stopPropagation(e) {
    e.cancelBubble = true;
    if (e.stopPropagation) {
        e.stopPropagation();
    }
}
