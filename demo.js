/** @type {RingCentral.SDK} */
var sdk = null;
/** @type {Platform} */
var platform = null;

function __instanceManager(appKeyField, appSecretField, usernameField, extensionField, passwordField) {
    var instance = this;
    instance.appKeyField = appKeyField;
    instance.appSecretField = appSecretField;
    instance.usernameField = usernameField;
    instance.extensionField = extensionField;
    instance.passwordField = passwordField;

    instance.serverUrl = 'https://platform.devtest.ringcentral.com';
    instance.sdk = '';
    instance.helper = '';
    instance.authorizeFields = function () {
        instance.authorizeFull(
            $(instance.appKeyField).val(),
            $(instance.appSecretField).val(),
            $(instance.usernameField).val(),
            $(instance.extensionField).val(),
            $(instance.passwordField).val()
        );
    }
    instance.authorizeFull = function (appKey, appSecret, username, extension, password) {
        instance.loadRcsdk(appKey, appSecret);
        instance.authorize(username, extension, password);
    }
    instance.loadRcsdk = function (appKey, appSecret) {
        instance.sdk = new RingCentral.SDK({
            server: instance.serverUrl,
            appKey: appKey,
            appSecret: appSecret
        });
    }
    instance.authorize = function (username, extension, password) {
        platform = instance.sdk.platform();
        s = instance.sdk;
        platform.login({
            username: username,
            extension: extension,
            password: password
        }).then(function (response) {
            alert('SuccessFul Login');
        }).catch(function (e) {
            alert('ERR ' + e.message || 'Server cannot authorize user');
        });
        instance.helper = new rcHelper(platform, s);
    }
}

function rcHelper(platform, sdk) {
    var instance = this;
    // var callrecording;
    instance.platform = platform;
    instance.sdk = sdk;
    instance.sms = function (from, to, text) {
        instance.platform.post('/account/~/extension/~/sms', {
            from: {
                phoneNumber: from
            },
            to: [{
                phoneNumber: to
            }
            ],
            text: text
        }).then(function (response) {
            var txt = JSON.stringify(response.json(), null, 2);
            document.getElementById("sms_result").innerHTML = txt;
        }).catch(function (e) {
            alert('Error: ' + e.message);
        });
    }

    instance.ringout = function (from, to) {
        this.platform.post('/account/~/extension/~/ringout', {

            from: {
                phoneNumber: from
            },
            to: {
                phoneNumber: to
            },
            playPrompt: true

        }).then(function (response) {
            var txt = JSON.stringify(response.json(), null, 2);
            document.getElementById("ringout_result").innerHTML = txt;
        }).catch(function (e) {
            alert('Error: ' + e.message);
        });
    }

    instance.calllog = function () {
        instance.platform.get('/account/~/extension/~/call-log').then(function (response) {
            var txt = JSON.stringify(response.json(), null, 2);
            document.getElementById("call-logs-text").innerHTML = txt;
        }).catch(function (e) {
            alert('Error: ' + e.message);
        });
    }

    instance.getInfo = function () {
        instance.platform.get('/account/~/').then(function (response) {
            var txt = JSON.stringify(response.json(), null, 2);
            document.getElementById("result").innerHTML = txt;
        }).catch(function (e) {
            alert('Error: ' + e.message);
        });
    }
}

rcInstance = new __instanceManager('#appkey', '#appSecret', '#userid', '#extension', '#password');