(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
const eventListener = require('./eventListener');

var app = {

init: function () {

    eventListener.login();
},
};
document.addEventListener('DOMContentLoaded', app.init);
},{"./eventListener":2}],2:[function(require,module,exports){
const moduleUtils = require('./utils');

const eventListener = {

    login: function() {

        const menuLogin = document.querySelector('a[menu="login"]');
        
        menuLogin.addEventListener('click', moduleUtils.showLoginForm);
    }

};

module.exports = eventListener;
},{"./utils":3}],3:[function(require,module,exports){

const moduleUtils = {

    // VERIFIER SI CE PARAMETRE EST UTILE, COMMENT MODIFIER APRES ?
    baseUrl: 'http://localhost:2000',

    showLoginForm: function() {
        event.preventDefault();
        const loginForm = document.querySelector('form[id="login"]')
        const menu = document.querySelector('.menu')

        // On desactive l'affichage du menu
        menu.classList.remove('is-active');
        menu.classList.add('displayNone');

        // On active l'affichage du formulaire login
        loginForm.classList.remove('displayNone');
        loginForm.classList.add('is-active');

        const loginButton = loginForm.querySelector('button[type="submit"');


        console.log(loginButton)
        // au click de validation du form login je verifie l'existence de l'utilisateur
        loginForm.addEventListener('submit', function(data){
            event.preventDefault();

            // L'email
            console.log(data.target.elements[0].value);

            // Le mdp
            console.log(data.target.elements[1].value);

            let dataForm = new FormData(data);

            console.log(dataForm);


            // Faire un return des erreur en json du côté de l'api

            // AJOUTER UNE METHODE SPECIFIQUE POUR RECUPERER LES DONNEES PUIS SOUMETTRE LE FORM ??? Voir ligne 112 https://github.com/Echoes-88/Cheat_sheet/blob/master/ALL-IN-ONE/FRONT-IN-API/front/src/card.js

            const requestConfig = {
                method: 'POST',
                body: data
            };

            return (
                fetch(`${moduleUtils.baseUrl}/login`, requestConfig)

                    .then((response) => {

                        return response.json();
                    })
            );

        })
    }

};

module.exports = moduleUtils;
},{}]},{},[1]);