/********************************/

/*
    lK is defined in the homepage dynamically.  It stands for loadKit.
    This defines the initial kit to load on page load.

    p is defined in the homepage upon pageload if a 'p' attribute was passed on the url.
    This means the link was of a shared pattern.

    spa is defined in the homepage upon pageload.  It is short for systemPatternArr.

    upa is defined in the homepage upon pageload.  It is short for userPatternArr.

    u is defined in the homepage upon pageload.  It is short for currentUser.

*/

var sampler, p, spa, upa, u, lK,
    Kodiak = {};

    Kodiak.Data = {};
    Kodiak.Controls = {};
    Kodiak.Components = {};

function pageLoaded() {
    sampler = new Sampler();

    if(typeof(lK) == 'object') {
        sampler.setSystemKit(lK[0], lK[1]);
    }
    if(typeof(p) == 'object') {
        sampler.setPattern(p);
    }

    if(typeof(upa) == 'object') {
        sampler.setUserPatternArr(upa);
    }

    if(typeof(spa) == 'object') {
        sampler.setSystemPatternArr(spa);
    }

    if(typeof(u) == 'number') {
        sampler.setCurrentUser(u);
    }
}


if(window.addEventListener) {
    window.addEventListener('load', pageLoaded, false);
}else {
    window.attachEvent('onload', pageLoaded);
}

window.onbeforeunload = function(){
    var message = 'Any unsaved changes will be lost!';
    return message;
};
