var audBassDrum, audClap, audClosedHH, audOpenHH, audCymbal, audSnare, audLowConga, audHiConga;
var instrumentArr = [];

window.onload = function() {
    audBassDrum = new AudioChannel({src: "samples/808-kick.ogg"});
    audClosedHH = new AudioChannel({src: "samples/808-closedhh.ogg"});
    audOpenHH = new AudioChannel({src: "samples/808-openhh.ogg"});
    audClap = new AudioChannel({src: "samples/808-clap.ogg"});
    audCymbal = new AudioChannel({src: "samples/808-cymbal.ogg"});
    audSnare = new AudioChannel({src: "samples/808-snare.ogg"});
    audLowConga = new AudioChannel({src: "samples/808-lowconga.ogg"});
    audHiConga = new AudioChannel({src: "samples/808-hiconga.ogg"});
    window.onkeydown = keyDownHandler;
    window.onkeyup = keyUpHandler

    for(var n=0; n<8; n++) {
        instrumentArr[n] = $('instrument' + n);
        instrumentArr[n].onmouseup = keyUpHandler;
    }
};

function keyDownHandler(e) {
    if(!e) {
        var e = window.event;
    }

    switch(e.keyCode) {
        case 65:
            setInstrumentClass(0);
            audBassDrum.play();
            break;
        case 68:
            setInstrumentClass(2);
            audClap.play();
            break;
        case 70:
            setInstrumentClass(3);
            audLowConga.play();
            break;
        case 71:
            setInstrumentClass(4);
            audHiConga.play();
            break;
        case 74:
            setInstrumentClass(5);
            audCymbal.play();
            break;
        case 75:
            setInstrumentClass(6);
            audClosedHH.play();
            break;
        case 76:
            setInstrumentClass(7);
            audOpenHH.play();
            break;
        case 83:
            setInstrumentClass(1);
            audSnare.play();
            break;
    }
}

function keyUpHandler() {
    for(var n=0; n<instrumentArr.length; n++) {
        instrumentArr[n].className = '';
    }
}

function setInstrumentClass(el) {
    instrumentArr[el].className = 'clsInstrumentActive';
}

function $(el) {
    return document.getElementById(el);
}
