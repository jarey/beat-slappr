var loginModal, signupModal;
var frmSignup, divSignupMesg, txtSignupEmail;
var frmLogin, divLoginMesg, txtLoginEmail, txtLoginPassword;
var frmResetPassword, divResetMesg, txtResetEmail;

var accountAjax;

var emailErrorMesg = "The email address you provided was not valid.";
var passwordErrorMesg = "Password must be provided.";


/***INIT***/

if(window.addEventListener) {
    window.addEventListener('load', accountInit, false);
}else {
    window.attachEvent('onload', accountInit);
}

function accountInit() {
    accountAjax = new Kodiak.Data.Ajax();

    loginModal = new Kodiak.Controls.Modal({
        applyTo:     'lblLogin',
        componentId: 'loginModal',
        modalClass:  'modalWindow accountModal',
        orientation: 'right',
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
        onBeforeShow:   function() {
            this.setContent($('txtSignupWindow').value);
        },
        onShowComplete: signUpInit
    });
}


/**************************/
/***LOGIN MODAL HANDLING***/
/**************************/

function loginInit() {
    frmLogin = $('frmLogin');
    frmLogin.onkeydown = stopPropagation;

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

    frmResetPassword = $('frmResetPassword');
    frmResetPassword.onkeydown = stopPropagation;

    txtResetEmail = $('txtResetEmail');
    txtResetEmail.value = '';
    txtResetEmail.focus();

    divResetMesg = $('divResetMesg');
    divResetMesg.className = 'error';
    divResetMesg.innerHTML = '';

    $('cmdResetPassword').onclick = forgotPassword;
}

function forgotPassword() {

    /***VALIDATION***/
    if(!isValidEmail(txtResetEmail.value)) {
        divResetMesg.innerHTML = emailErrorMesg;
        return false;
    }

    /***POST VALIDATION***/
 
    accountAjax.request({
        url:    'api/user.php',
        method: 'post',
        parameters: {cmd: 'resetPassword', email: txtResetEmail.value},
        handler: forgotPasswordHandler
    });
}

function forgotPasswordHandler(obj) {
    var response = decodeJSON(obj.response);
    if(response.success) {
        loginModal.setContent("<label class='lblLink' style='float: right;' onclick='loginModal.hide();'>Close</label><div id='divResetMesg' class='success' style='clear: right; padding-top: 20px;'></div>");
        divResetMesg = $('divResetMesg');
        divResetMesg.className = 'success';
    }
    divResetMesg.innerHTML = response.mesg;
}


/***************************/
/***SIGNUP MODAL HANDLING***/
/***************************/

function signUpInit() {
    frmSignup = $('frmSignup');
    frmSignup.onkeydown = stopPropagation;

    txtSignupEmail = $('txtSignupEmail');
    txtSignupEmail.value = '';
    txtSignupEmail.focus();

    divSignupMesg = $('divSignupMesg');
    divSignupMesg.className = 'error';
    divSignupMesg.innerHTML = '';

    $('cmdSignUp').onclick = signup;
}

function signup() {

    /***VALIDATION***/

    if(!isValidEmail(txtSignupEmail.value)) {
        divSignupMesg.innerHTML = emailErrorMesg;
        return false;
    }

    /***POST VALIDATION***/
 
    accountAjax.request({
        url:    'api/user.php',
        method: 'post',
        parameters: {cmd: 'create', email: txtSignupEmail.value},
        handler: signupHandler
    });
}

function signupHandler(obj) {
    var response = decodeJSON(obj.response);
    if(response.success) {
        signupModal.setContent("<label class='lblLink' style='float: right;' onclick='signupModal.hide();'>Close</label><div id='divSignupMesg' class='success' style='clear: right; padding-top: 20px;'></div>");
        divSignupMesg = $('divSignupMesg');
        divSignupMesg.className = 'success';
    }
    divSignupMesg.innerHTML = response.mesg;
}
