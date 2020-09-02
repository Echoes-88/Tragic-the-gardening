const utils = require('./utils');
const user = require('./user');

var app = {

eventListener: function() {

    // LOGIN SHOW FORM
    const menuLogin = document.querySelector('a[menu="login"]');      
    menuLogin.addEventListener('click', utils.showLoginForm);

    // LOGIN SUBMIT
    const loginForm = document.querySelector('form[id="login"]')
    loginForm.addEventListener('submit', user.handleLoginForm);

},

init: function () {

    app.eventListener();
},
};
document.addEventListener('DOMContentLoaded', app.init);