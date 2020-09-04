const utils = require('./utils');
const user = require('./user');
const game = require('./game');

var app = {

eventListener: function() {

    // SHOW LOGIN FORM
    const menuLogin = document.querySelector('li[set-menu="login"] a');      
    menuLogin.addEventListener('click', utils.showLoginForm);

    // LOGIN SUBMIT
    const loginForm = document.querySelector('form[id="login"]')
    loginForm.addEventListener('submit', user.handleLoginForm);

    // PLAY BUTTON
    const menuPlay = document.querySelector('li[set-menu="play"] a');
    menuPlay.addEventListener('click', game.play);

    // SHOW ACCOUNT
    const menuAccount = document.querySelector('li[set-menu="account"] a');
    menuAccount.addEventListener('click', user.account);
},

init: function () {

    app.eventListener();
},
};

document.addEventListener('DOMContentLoaded', app.init);