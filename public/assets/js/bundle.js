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

    // ACCOUNT BUTTON
    const menuAccount = document.querySelector('li[set-menu="account"] a');
    menuAccount.addEventListener('click', user.account);
},

init: function () {
    utils.clearEverything();
    utils.showMainMenu();
    app.eventListener();
},
};

document.addEventListener('DOMContentLoaded', app.init);
},{"./game":2,"./user":3,"./utils":4}],2:[function(require,module,exports){
    const utils = require('./utils');

const game = {

    baseUrl: 'http://localhost:3000',

    play: async function(event) {
        event.preventDefault();

        // CLEAR DISPLAY
        utils.clearEverything();

        // Checking if user has decks from API

        const userDatas = sessionStorage.getItem('userDatas');
        const user = JSON.parse(userDatas);


        const requestConfig = {
            method: 'GET'
        };

        const response = await fetch(`${game.baseUrl}/user-decks/${user.id}`, requestConfig);
		const jsonResponse = await response.json();

        if(response.status === 404) {


            console.log(jsonResponse)
        } else {

            // Creating main elements in dom
            const mainArea = document.querySelector('main');
            const article = document.createElement('article');
            mainArea.appendChild(article);

                        
            if(jsonResponse.userHasDecks > 0) {
                console.log('user has some decks')
                // afficher les decks

            } else {
                console.log('no decks')

                const textNewDeck = document.createElement('p');
                textNewDeck.textContent = 'Create your first deck to play !'

                const form = document.createElement('form');

                article.appendChild(textNewDeck);
                textNewDeck.appendChild(form);

                const deckName = document.createElement('input');
                deckName.placeholder = 'name';
                deckName.name = 'title';
                form.appendChild(deckName);

                const userId = document.createElement('input');
                userId.name = 'id';
                userId.value = user.id;
                userId.style.display = 'none';
                form.appendChild(userId);

                const createDeckButton = document.createElement('button');
                createDeckButton.textContent = 'Create a deck';
                form.appendChild(createDeckButton);

                form.addEventListener('submit', game.deckGenerator);
            }
        }


        // if yes, call show decks method and ask to choose the deck to play + button manage decks

            
            //

        // if no, show button create deck, on click addEvent to show deckGenerator method


        // ADDING "BACK TO MAIN MENU"
        const backMenu = document.createElement('button');
        backMenu.classList.add('nav-button');
        backMenu.textContent = "GO BACK"
        // document.appendChild(backMenu);

        // EVENTLISTENER "BACK TO MAIN MENU"
        backMenu.addEventListener('click', utils.showLoggedMenu);

    },
    

    deckGenerator: async function(data) {

        event.preventDefault();

        const datas = new FormData(data.target);

        const requestConfig = {
            method: 'POST',
            body: datas
        };

        const response = await fetch(`${game.baseUrl}/crud/deck`, requestConfig);
        const jsonResponse = await response.json();
        
        console.log(jsonResponse);

        // for (var value of datas.values()) {
        //     console.log(value); 
        //  }

    },

    showDecks: function() {
        
        // Fetch API get all decks from user id

        // OnClick on a deck, add launch game button
    }

}

module.exports = game;
},{"./utils":4}],3:[function(require,module,exports){
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

            utils.showLoggedMenu();
        }

    },

    account: function(event) {

        event.preventDefault();

        // CLEAR DISPLAY
        utils.clearEverything();

        // SHOW MENU
        const menu = document.querySelector('.menu')
        menu.classList.remove('is-hidden');

        // GET DATAS FROM SESSION STORAGE
        const userDatas = sessionStorage.getItem('userDatas');
        const user = JSON.parse(userDatas);

        // CREATING DOM
        const dom = document.querySelector('main');

        const article = document.createElement('article');
        dom.appendChild(article);

        // GENERATING USER INFORMATIONS IN DOM
        for(const elt of Object.entries(user)) {

            console.log(elt)
            const paragraph = document.createElement('p');
            paragraph.classList.add('account-key');
            paragraph.textContent = elt[0] + ' : ' + elt[1];
            article.appendChild(paragraph);
        }

        // ADDING "BACK TO MAIN MENU"
        const backMenu = document.createElement('button');
        backMenu.classList.add('nav-button');
        backMenu.textContent = "GO BACK"
        article.appendChild(backMenu);

        // EVENTLISTENER "BACK TO MAIN MENU"
        backMenu.addEventListener('click', utils.showLoggedMenu);
    }

};

module.exports = user;
},{"./utils":4}],4:[function(require,module,exports){

const utils = {

    showMainMenu: function() {
        
        // SHOW MENU
        const menu = document.querySelector('.menu')
        menu.classList.remove('is-hidden');

        // SHOW LOGIN, CREATE ACCOUNT, RULES
        const playButton = document.querySelector('li[set-menu="login"]');
        playButton.classList.remove('is-hidden');

        const createAccountButton = document.querySelector('li[set-menu="createAccount"]');
        createAccountButton.classList.remove('is-hidden');
        
        const rulesButton = document.querySelector('li[set-menu="rules"]');
        rulesButton.classList.remove('is-hidden');
    },

    showLoggedMenu: function() {

        // CLEAR DISPLAY
        utils.clearEverything();

        // SHOW MENU
        const menu = document.querySelector('.menu')
        menu.classList.remove('is-hidden');

        const playButton = document.querySelector('li[set-menu="play"]');
        playButton.classList.remove('is-hidden');
        const accountButton = document.querySelector('li[set-menu="account"]');
        accountButton.classList.remove('is-hidden');
        const rulesButton = document.querySelector('li[set-menu="rules"]');
        rulesButton.classList.remove('is-hidden');

    },

    clearEverything: function() {
        const activeElements = document.querySelectorAll('nav, form, article, li');

        for(let activElt of activeElements) {
            activElt.classList.add('is-hidden');
        }
    },


    showLoginForm: function(event) {

        event.preventDefault();

        // CLEAR DISPLAY
        utils.clearEverything();

        // SHOW LOGIN FORM
        const loginForm = document.querySelector('form[id="login"]')
        loginForm.classList.remove('is-hidden');
    },
};

module.exports = utils;
},{}]},{},[1]);
