var loginModal, signupModal;
var divSignupMesg, txtSignupEmail;
var divLoginMesg, txtLoginEmail, txtLoginPassword;
var divResetMesg, txtResetEmail;

var emailErrorMesg = "The email address you provided was not valid.";
var passwordErrorMesg = "Password must be provided.";


/***INIT***/

if(window.addEventListener) {
    window.addEventListener('load', accountInit, false);
}else {
    window.attachEvent('onload', accountInit);
}

function accountInit() {
    loginModal = new Kodiak.Controls.Modal({
        applyTo:     'lblLogin',
        componentId: 'loginModal',
        modalClass:  'modalWindow accountModal',
        orientation: 'right',
        content:     $('txtLoginWindow').value,
        onBeforeShow:   function() {
            this.setContent($('txtLoginWindow').value);
        },
        onShowComplete: loginInit
    });

    signupModal = new Kodiak.Controls.Modal({
        applyTo:     'lblSignUp',
        componentId: 'signupModal',
        modalClass:  'modalWindow accountModal',
        orientation: 'right',
        content:     $('txtSignupWindow').value,
        onShowComplete: signUpInit
    });
}


/**************************/
/***LOGIN MODAL HANDLING***/
/**************************/

function loginInit() {
    txtLoginEmail = $('txtLoginEmail');
    txtLoginEmail.value = '';
    txtLoginEmail.focus();

    txtLoginPassword = $('txtLoginPassword');
    txtLoginPassword.value = '';

    divLoginMesg = $('divLoginMesg');
    divLoginMesg.innerHTML = '';

    $('cmdLogin').onclick = login;
    $('lblForgotPassword').onclick = forgotPasswordInit;
}

function login() {

    /***VALIDATION***/

    var errorArr = [];
    if(!isValidEmail(txtLoginEmail.value)) {
        errorArr.push(emailErrorMesg);
    }
    if(!txtLoginPassword.value) {
        errorArr.push(passwordErrorMesg);
    }
    if(errorArr.length) {
        divLoginMesg.innerHTML = errorArr.join('<br />');
        return false;
    }

    /***POST VALIDATION***/

    alert('logging in');
}


/************************************/
/***FORGOT PASSWORD MODAL HANDLING***/
/************************************/

function forgotPasswordInit() {
    loginModal.setContent($('txtForgotPasswordWindow').value);

    txtResetEmail = $('txtResetEmail');
    txtResetEmail.value = '';
    txtResetEmail.focus();

    divResetMesg = $('divResetMesg');
    divResetMesg.innerHTML = '';

    $('cmdResetPassword').onclick = forgotPassword;

}

function forgotPassword() {

    /***VALIDATION***/
    if(!isValidEmail(txtResetEmail.value)) {
        $('divResetMesg').innerHTML = emailErrorMesg;
        return false;
    }

    /***POST VALIDATION***/
 
    alert('resetting password');
}

/***************************/
/***SIGNUP MODAL HANDLING***/
/***************************/

function signUpInit() {
    txtSignupEmail = $('txtSignupEmail');
    txtSignupEmail.value = '';
    txtSignupEmail.focus();

    divSignupMesg = $('divSignupMesg');
    divSignupMesg.innerHTML = '';

    $('cmdSignUp').onclick = signup;
}

function signup() {

    /***VALIDATION***/

    if(!isValidEmail(txtSignupEmail.value)) {
        $('divSignupMesg').innerHTML = emailErrorMesg;
        return false;
    }

    /***POST VALIDATION***/
 
    alert('signing up');
}

function isValidEmail(email) {
    if(email.match(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i)) {
        return true;
    }else {
        return false;
    }
}
