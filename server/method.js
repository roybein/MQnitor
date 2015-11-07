process.env.MAIL_URL = "smtp://roybein@sandbox249320b734964f25b665eabaf91a22a3.mailgun.org:123456test@smtp.mailgun.org:587/";

Meteor.methods({
    publishUserData: publishUserData,
    publishDeviceData: publishDeviceData,
    doMsgDownBsTargetOutput: doMsgDownBsTargetOutput,
    doMsgDownBsTargetConfig: doMsgDownBsTargetConfig,
    doMsgDownBsTargetConfigNetwork: doMsgDownBsTargetConfigNetwork,
    sendEmail: sendEmail,
});

