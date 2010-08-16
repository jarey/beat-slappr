var loginModal, signupModal;
var divGuestAccount, divUserAccount;

var frmSignup, divSignupMesg, txtSignupEmail, cmdSignUp, cmdSignupLoader;
var frmLogin, divLoginMesg, txtLoginEmail, txtLoginPassword, cmdLogin, imgLoginLoader;
var frmResetPassword, divResetMesg, txtResetEmail, cmdResetPassword, cmdResetLoader;

var currentUser;
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

    divGuestAccount = $('divGuestAccount');
    divUserAccount = $('divUserAccount');

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

    cmdLogin = $('cmdLogin');
    cmdLogin.onclick = login;

    imgLoginLoader = $('imgLoginLoader');

    $('lblForgotPassword').onclick = forgotPasswordInit;
}

function login() {

    /***VALIDATION***/

    var errorArr = [];
    if(!isValidEmail(txtLoginEmail.value)) {
        errorArr.push(emailErrorMesg);    imgLoginLoader = $('imgLoginLoader');
    }
    if(!txtLoginPassword.value) {
        errorArr.push(passwordErrorMesg);
    }
    if(errorArr.length) {
        divLoginMesg.innerHTML = errorArr.join('<br />');
        return false;
    }

    /***POST VALIDATION***/

    cmdLogin.style.display = "none";
    imgLoginLoader.style.display = "inline";

    accountAjax.request({
        url:    'api/user.php',
        method: 'post',
        parameters: {cmd: 'login', email: txtLoginEmail.value, password: hex_md5(txtLoginPassword.value)},
        handler: loginHandler
    });
}

function loginHandler(obj) {
    var response = decodeJSON(obj.response);
    if(response.success) {
        loginModal.hide();
        currentUser = response.user;
        divGuestAccount.style.display = "none";
        divUserAccount.innerHTML = currentUser + " | <label class='lblLink' onclick='logout();'>Logout</label>";
        divUserAccount.style.display = "block";
    }else {
        divLoginMesg.innerHTML = response.mesg;
        cmdLogin.style.display = "inline";
        imgLoginLoader.style.display = "none";
    }
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

    cmdResetPassword = $('cmdResetPassword');
    cmdResetPassword.onclick = forgotPassword;

    imgResetLoader = $('imgResetLoader');
}

function forgotPassword() {

    /***VALIDATION***/
    if(!isValidEmail(txtResetEmail.value)) {
        divResetMesg.innerHTML = emailErrorMesg;
        return false;
    }

    /***POST VALIDATION***/
 
    cmdResetPassword.style.display = "none";
    imgResetLoader.style.display = "inline";

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
    }else {
        divResetMesg.innerHTML = response.mesg;
        cmdResetPassword.style.display = "inline";
        imgResetLoader.style.display = "none";
    }
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

    cmdSignUp = $('cmdSignUp');
    cmdSignUp.onclick = signup;

    imgSignupLoader = $('imgSignupLoader');
}

function signup() {

    /***VALIDATION***/

    if(!isValidEmail(txtSignupEmail.value)) {
        divSignupMesg.innerHTML = emailErrorMesg;
        return false;
    }

    /***POST VALIDATION***/
 
    cmdSignUp.style.display = "none";
    imgSignupLoader.style.display = "inline";

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
    }else {
        cmdSignUp.style.display = "inline";
        imgSignupLoader.style.display = "none";
    }
    divSignupMesg.innerHTML = response.mesg;
}


/*********************/
/***LOGOUT HANDLING***/
/*********************/

function logout() {
    accountAjax.request({
        url:    'api/user.php',
        method: 'post',
        parameters: {cmd: 'logout'},
        handler: logoutHandler
    });
}

function logoutHandler(obj) {
    var response = decodeJSON(obj.response);
    if(response.success) {
        divUserAccount.style.display = "none";
        divGuestAccount.style.display = "block";
    }
}
