(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
const eventListener = require('./eventListener');

var app = {

init: function () {

    eventListener.main();
},
};
document.addEventListener('DOMContentLoaded', app.init);
},{"./eventListener":2}],2:[function(require,module,exports){
const moduleUtils = require('./utils');

const eventListener = {

    main: function(event) {

        const menuLogin = document.querySelector('a[menu="login"]');
        
        menuLogin.addEventListener('click', moduleUtils.showLoginForm);
    }

};

module.exports = eventListener;
},{"./utils":3}],3:[function(require,module,exports){

const moduleUtils = {

    showLoginForm: function() {
        event.preventDefault();
        const loginForm = document.querySelector('form[id="login"]')
        const menu = document.querySelector('.menu')

        menu.classList.remove('is-active');
        menu.classList.add('displayNone');

        loginForm.classList.remove('displayNone');
        loginForm.classList.add('is-active');
    }

};

module.exports = moduleUtils;
},{}]},{},[1]);
