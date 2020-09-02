(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
const utils = require('./utils');
const user = require('./user');

var app = {

eventListener: function() {

    // LOGIN SHOW FORM
    const menuLogin = document.querySelector('li[menu="login"]');      
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
},{"./user":2,"./utils":3}],2:[function(require,module,exports){
const utils = require('./utils');

const user = {

    baseUrl: 'http://localhost:3000',


    handleLoginForm: async function(data) {

        event.preventDefault();

        let dataForm = new FormData(data.target);

        const requestConfig = {
            method: 'POST',
            body: dataForm
        };

        const response = await fetch(`${user.baseUrl}/login`, requestConfig);
		const jsonResponse = await response.json();

        if(response.status === 404) {
            console.log(jsonResponse)
        } else {
            console.log(jsonResponse);
            utils.showPlayGame();
        }

    }

};

module.exports = user;
},{"./utils":3}],3:[function(require,module,exports){

const utils = {

    showPlayGame: function() {

        // HIDDE LOGIN FORM
        const loginForm = document.querySelector('form[id="login"]')
        loginForm.classList.remove('is-active');
        loginForm.classList.add('inactive');

        // SHOW MENU
        const menu = document.querySelector('.menu')
        menu.classList.remove('inactive');
        menu.classList.add('is-active');

        // ADD PLAY BUTTON & REMOVE LOGIN + SUBSCRIBE
        const playButton = document.querySelector('li[menu="play"]');
        playButton.classList.remove('inactive');
        playButton.classList.add('is-active');
        const loginButton = document.querySelector('li[menu="login"]');
        loginButton.classList.remove('is-active');
        loginButton.classList.add('inactive');
        const subscribeButton = document.querySelector('li[menu="createAccount"]');
        subscribeButton.classList.remove('is-active');
        subscribeButton.classList.add('inactive');
    },

    showLoginForm: function() {

        event.preventDefault();

        // HIDDE MENU
        const menu = document.querySelector('.menu')
        menu.classList.remove('is-active');
        menu.classList.add('inactive');

        // SHOW LOGIN FORM
        const loginForm = document.querySelector('form[id="login"]')
        loginForm.classList.remove('inactive');
        loginForm.classList.add('is-active');
    },
};

module.exports = utils;
},{}]},{},[1]);
