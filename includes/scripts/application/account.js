var loginModal, signupModal,
    divGuestAccount, divUserAccount,

    frmSignup, divSignupMesg, txtSignupEmail, cmdSignUp, cmdSignupLoader,
    frmLogin, divLoginMesg, txtLoginEmail, txtLoginPassword, cmdLogin, imgLoginLoader,
    frmResetPassword, divResetMesg, txtResetEmail, cmdResetPassword, cmdResetLoader,

    currentUser,
    accountAjax,

    emailErrorMesg = "The email address you provided was not valid.",
    passwordErrorMesg = "Password must be provided.",

    //u is defined in the homepage upon pageload if an active session exists.
    u;

/************************************/
/***FORGOT PASSWORD MODAL HANDLING***/
/************************************/

function forgotPasswordHandler(obj) {
    var response = decodeJSON(obj.response);
    if(response.success) {
        loginModal.setContent("<label class='lblLink' style='float: right;' onclick='loginModal.hide();'>Close</label><div id='divResetMesg' class='success' style='clear: right; padding-top: 20px;'></div>");
        divResetMesg = $('divResetMesg');
        divResetMesg.className = 'success';
    }else {
        cmdResetPassword.style.display = "inline";
        imgResetLoader.style.display = "none";
    }
    divResetMesg.innerHTML = response.mesg;
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

/**************************/
/***LOGIN MODAL HANDLING***/
/**************************/

function loginHandler(obj) {
    var response = decodeJSON(obj.response);
    if(response.success) {
        loginModal.hide();
        currentUser = response.user;
        userPatternArr = response.pattern.data.user;

        divGuestAccount.style.display = "none";
        divUserAccount.innerHTML = currentUser + " | <label class='lblLink' onclick='logout();'>Logout</label>";
        divUserAccount.style.display = "block";
    }else {
        divLoginMesg.innerHTML = response.mesg;
        cmdLogin.style.display = "inline";
        imgLoginLoader.style.display = "none";
    }
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

    cmdLogin.style.display = "none";
    imgLoginLoader.style.display = "inline";

    accountAjax.request({
        url:    'api/user.php',
        method: 'post',
        parameters: {cmd: 'login', email: txtLoginEmail.value, password: md5(txtLoginPassword.value)},
        handler: loginHandler
    });
}

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



/***************************/
/***SIGNUP MODAL HANDLING***/
/***************************/

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



/*********************/
/***LOGOUT HANDLING***/
/*********************/

function logoutHandler(obj) {
    var response = decodeJSON(obj.response);
    if(response.success) {
        currentUser = "";

        divUserAccount.style.display = "none";
        divGuestAccount.style.display = "block";

        //Initialize userPatternArr and mark as dirty
        userPatternArr = [];
        userPatternDataIsDirty = true;
    }
}

function logout() {
    var component,
        val;

    //Close all modals:
    for(component in Kodiak.Components) {
        if(Kodiak.Components[component]) {
            val = Kodiak.Components[component];
            if(val._isModal) {
                val.hide();
            }
        }
    }


    accountAjax.request({
        url:    'api/user.php',
        method: 'post',
        parameters: {cmd: 'logout'},
        handler: logoutHandler
    });
}



/***INIT***/

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

    //Set the value of currentUser from variable u, which is generated in the homepage
    //if an active session exists
    if(typeof(u) == 'number') {
        currentUser = u;
    }
}

if(window.addEventListener) {
    window.addEventListener('load', accountInit, false);
}else {
    window.attachEvent('onload', accountInit);
}