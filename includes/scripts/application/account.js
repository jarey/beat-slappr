function Account() {
    /*
        u is defined in the homepage upon pageload if an active session exists.

        Public Properties:
        
        loginModal
        signupModal
        
        Public Methods:
        
        logout();
        sessionExists();
    */

    var loginModal, signupModal,
        divGuestAccount, divUserAccount,

        divSignupMesg, txtSignupEmail, cmdSignUp, imgSignupLoader,
        divLoginMesg, txtLoginEmail, txtLoginPassword, cmdLogin, imgLoginLoader,
        divResetMesg, txtResetEmail, cmdResetPassword, imgResetLoader,

        currentUser,
        accountAjax,

        emailErrorMesg = "The email address you provided was not valid.",
        passwordErrorMesg = "Password must be provided.",
        
        signupModalContent = " \
            <div class='patternModalHeader'><label class='lblModalTitle'>Sign Up</label><label class='lblModalButtons' title='close' onclick='sampler.signupModal.hide();'>X</label></div> \
            <div class='patternModalWrapper'> \
                <div id='divSignupMesg' class='error'></div> \
                <form action='' onsubmit='return false;' id='frmSignup'> \
                    <label class='labelText'>email:</label> <input type='text' id='txtSignupEmail' class='modalText' /><br /><br /> \
                    <input type='submit' id='cmdSignUp' value='sign up' /> <img id='imgSignupLoader' style='display: none;' src='includes/images/ajax-loader.gif' /> <label class='lblLink' onclick='sampler.loginModal.show();'>login</label> \
                </form> \
            </div>",

        loginModalContent = " \
            <div class='patternModalHeader'><label class='lblModalTitle'>Login</label><label class='lblModalButtons' title='close' onclick='sampler.loginModal.hide();'>X</label></div> \
            <div class='patternModalWrapper'> \
                <div id='divLoginMesg' class='error'></div> \
                <form action='' onsubmit='return false;' id='frmLogin'> \
                    <label class='labelText'>email:</label><br /><input type='text' id='txtLoginEmail' class='modalText' /><br /> \
                    <label class='labelText'>password:</label><br /><input type='password' id='txtLoginPassword' class='modalText' /><br /><br /> \
                    <input type='submit' id='cmdLogin' value='login' /> <img id='imgLoginLoader' style='display: none;' src='includes/images/ajax-loader.gif' /> <label class='lblLink' onclick='sampler.signupModal.show();'>sign up</label><br /><br /> \
                </form> \
                <label id='lblForgotPassword' class='lblLink'>forgot password</label> \
            </div>",

        forgotPasswordModalContent = " \
            <div class='patternModalHeader'><label class='lblModalTitle'>Forgot Password</label><label class='lblModalButtons' title='close' onclick='sampler.loginModal.hide();'>X</label></div> \
            <div class='patternModalWrapper'> \
                <div id='divResetMesg' class='error'></div> \
                <form action='' onsubmit='return false;' id='frmResetPassword'> \
                    <label class='labelText'>email:</label> <input type='text' id='txtResetEmail' class='modalText' /><br /><br /> \
                    <input type='submit' id='cmdResetPassword' value='reset password' /> <img id='imgResetLoader' style='display: none;' src='includes/images/ajax-loader.gif' /> \
                </form> \
            </div>";


    /************************************/
    /***FORGOT PASSWORD MODAL HANDLING***/
    /************************************/

    function forgotPasswordHandler(obj) {
        var response = decodeJSON(obj.response);
        if(response.success) {
            $("frmResetPassword").style.display = "none";
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
        loginModal.setContent(forgotPasswordModalContent);

        $('frmResetPassword').onkeydown = stopPropagation;

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

            sampler.setUserPatternArr(response.pattern.data.user);

            divGuestAccount.style.display = "none";
            divUserAccount.innerHTML = currentUser + " | <label class='lblLink' onclick='sampler.logout();'>Logout</label>";
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
        $('frmLogin').onkeydown = stopPropagation;

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
            $("frmSignup").style.display = "none";
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
            parameters: {
                cmd:         'create',
                email:       txtSignupEmail.value,
                sequence:    encodeJSON(sampler.getSequenceArr())
            },
            handler: signupHandler
        });
    }

    function signUpInit() {
        $('frmSignup').onkeydown = stopPropagation;

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
            sampler.setUserPatternArr([]);
            sampler.setUserPatternDirtyFlag(true);
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
    this.logout = logout;

    function sessionExists() {
        if(currentUser) {
            return true;
        }else {
            return false;
        }
    }
    this.sessionExists = sessionExists;

    function setCurrentUser(val) {
        currentUser = val;
    }
    this.setCurrentUser = setCurrentUser;

    /***INIT***/

    function accountInit(scope) {
        accountAjax = new Kodiak.Data.Ajax();

        divGuestAccount = $('divGuestAccount');
        divUserAccount = $('divUserAccount');

        loginModal = new Kodiak.Controls.Modal({
            applyTo:     'lblLogin',
            componentId: 'loginModal',
            modalClass:  'modalWindow accountModal',
            orientation:  'right',
            onBeforeShow:   function() {
                window.scroll(0,0);
                this.setContent(loginModalContent);
            },
            onShowComplete: loginInit
        });

        signupModal = new Kodiak.Controls.Modal({
            applyTo:     'lblSignUp',
            componentId: 'signupModal',
            modalClass:  'modalWindow accountModal',
            orientation:  'right',
            onBeforeShow:   function() {
                window.scroll(0,0);
                this.setContent(signupModalContent);
            },
            onShowComplete: signUpInit
        });

        scope.loginModal = loginModal;
        scope.signupModal = signupModal;
    }

    accountInit(this);

}
