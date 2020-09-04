(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
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
},{"./game":2,"./user":3,"./utils":4}],2:[function(require,module,exports){

const game = {

    play: function(event) {
        event.preventDefault();

        // Checking if user has decks from API

        const userDatas = sessionStorage.getItem('userDatas');
        const user = JSON.parse(userDatas);
        console.log('game', user);


        const dom = document.querySelector('main');

        for(const data of Object.keys(user)) {
            const paragraph = document.createElement('p');
            paragraph.classList.add('account-key');
            paragraph.textContent = data;
            dom.appendChild(paragraph);
        }


        // console.log(user)
        

        // let dataForm = new FormData(data.target);

        // const requestConfig = {
        //     method: 'POST',
        //     body: dataForm
        // };

        // const response = await fetch(`${user.baseUrl}/login`, requestConfig);
		// const jsonResponse = await response.json();

        // if(response.status === 404) {
        //     console.log(jsonResponse)
        // } else {
        //     console.log(jsonResponse);
        //     utils.showPlayGame();
        // }


        // if yes, call show decks method and ask to choose the deck to play + button manage decks

            
            //

        // if no, show button create deck, on click addEvent to show deckGenerator method


    },
    

    deckGenerator: function() {

    },

    showDecks: function() {
        
        // Fetch API get all decks from user id

        // OnClick on a deck, add launch game button
    }

}

module.exports = game;
},{}],3:[function(require,module,exports){
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
            // Debugger
            // console.log(jsonResponse)

        } else {

            // Saving json response in local session
            userDatas = JSON.stringify(jsonResponse);
            sessionStorage.setItem('userDatas', userDatas);

            utils.showPlayGame();
        }

    },

    account: function(event) {

        event.preventDefault();

        //HIDDE MENU
        const menu = document.querySelector('.menu')
        menu.classList.remove('is-active');
        menu.classList.add('inactive');


        const userDatas = sessionStorage.getItem('userDatas');
        const user = JSON.parse(userDatas);
        console.log('user', user);

        const dom = document.querySelector('main');

        const article = document.createElement('article');
        dom.appendChild(article);

        for(const data of Object.keys(user)) {
            const paragraph = document.createElement('p');
            paragraph.classList.add('account-key');
            paragraph.textContent = data;
            article.appendChild(paragraph);
        }
    }

};

module.exports = user;
},{"./utils":4}],4:[function(require,module,exports){

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

        // ADD PLAY BUTTON & REMOVE LOGIN + SUBSCRIBE + ACCOUNT
        const playButton = document.querySelector('li[set-menu="play"]');
        playButton.classList.remove('inactive');
        playButton.classList.add('is-active');
        const loginButton = document.querySelector('li[set-menu="login"]');
        loginButton.classList.remove('is-active');
        loginButton.classList.add('inactive');
        const subscribeButton = document.querySelector('li[set-menu="createAccount"]');
        subscribeButton.classList.remove('is-active');
        subscribeButton.classList.add('inactive');
        const accountButton = document.querySelector('li[set-menu="account"]');
        accountButton.classList.remove('inactive');
        accountButton.classList.add('is-active');
    },

    showLoginForm: function(event) {

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
