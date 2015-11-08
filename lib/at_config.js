AccountsTemplates.configureRoute('signIn', {
    name: 'login',
    template: 'login',
    layoutTemplate: 'login',
    redirect: '/manage',
});

//AccountsTemplates.configureRoute('signIn');

AccountsTemplates.configure({
    // Behavior
    confirmPassword: true,
    enablePasswordChange: true,
    forbidClientAccountCreation: false,
    overrideLoginErrors: true,
    sendVerificationEmail: false,
    lowercaseUsername: false,

    // Appearance
    showAddRemoveServices: false,
    showForgotPasswordLink: false,
    showLabels: true,
    showPlaceholders: false,
    showResendVerificationEmailLink: false,

    // Client-side Validation
    continuousValidation: false,
    negativeFeedback: false,
    negativeValidation: true,
    positiveValidation: true,
    positiveFeedback: true,
    showValidating: true,

    // Privacy Policy and Terms of Use
    privacyUrl: 'privacy',
    termsUrl: 'terms-of-use',

    // Redirects
    homeRoutePath: '/home',
    redirectTimeout: 4000,

    // Hooks
    //onLogoutHook: myLogoutFunc,
    //onSubmitHook: mySubmitFunc,
    //preSignUpHook: myPreSubmitFunc,

    texts: {
      button: {
          signUp: "Register Now!"
      },
      socialSignUp: "Register",
      socialIcons: {
          "meteor-developer": "fa fa-rocket"
      },
      title: {
          forgotPwd: "Recover Your Password"
      },
    },
});

AccountsTemplates.removeField('email');
AccountsTemplates.removeField('password');
AccountsTemplates.addFields([
    {
        _id: 'username',
        type: 'text',
        displayName: "Device ID",
        required:true,
    },
    {
        _id: 'password',
        type: 'password',
        required: true,
        minLength: 6,
    },
/*
    {
        _id: 'email',
        type: 'email',
        required:true,
    },
*/
]);
