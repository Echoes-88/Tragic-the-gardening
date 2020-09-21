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

    // SHOW CREATE ACCOUNT FORM
    const menuCreateAccount = document.querySelector('li[set-menu="createAccount"] a');
    menuCreateAccount.addEventListener('click', utils.showCreateAccountForm);

    // CREATE ACCOUNT SUBMIT
    const createAccountForm = document.querySelector('form[id="createAccount"]');
    createAccountForm.addEventListener('submit', user.handleCreateAccountForm);
},

init: function () {
    utils.clearEverything();
    utils.showMainMenu();
    app.eventListener();
},
};

document.addEventListener('DOMContentLoaded', app.init);
},{"./game":3,"./user":5,"./utils":6}],2:[function(require,module,exports){
const game = require('./game');
const utils = require('./utils');

var cardGenerator = {

    baseUrl: 'http://localhost:5000',

    deck: function(deckDatas) {

        // Creating div for the deck with deck picture, title and buttons (deck manager / play with deck)
        const deckContainer = document.createElement('div');
        deckContainer.classList.add('deck-container');
        const deckTitle = document.createElement('p');
        deckTitle.textContent = deckDatas.title;
        const deckImage = document.createElement('div');
        deckImage.classList.add('card');
        deckImage.classList.add('deck');

        const article = document.querySelector('article');

        deckContainer.setAttribute('set-id', deckDatas.id);

        article.appendChild(deckContainer);
        deckContainer.appendChild(deckTitle)
        deckContainer.appendChild(deckImage);

        const seeThisDeck = document.createElement('button');
        seeThisDeck.classList.add('see-deck');
        const playThisDeck = document.createElement('button');
        playThisDeck.classList.add('play-deck');
        seeThisDeck.textContent = 'Manage deck'
        playThisDeck.textContent = 'Play with this deck'

        deckContainer.appendChild(seeThisDeck)
        deckContainer.appendChild(playThisDeck);

    },

    createDeck: async function(type) {

        // GETTING LEVEL OF USER // DEBBUG + TARD POUR GENERER LES CARTES CPTER SELON NIVEAU JOUEUR
        const userDatas = sessionStorage.getItem('userDatas');
        const user = JSON.parse(userDatas);
        const userLevel = user.level;
        console.log(userLevel);

        const requestConfig = {
            method: 'GET'
        };

        const getMonsters = await fetch(`${cardGenerator.baseUrl}/crud/monster`, requestConfig);
        const monsters = await getMonsters.json();

        const getBoosters = await fetch(`${cardGenerator.baseUrl}/crud/booster`, requestConfig);
        const boosters = await getBoosters.json();

        // Init monster and booster arrays
        let monstersArray = [];
        let boostersArray = [];

        if (type === 'player-deck') {

        // Choosing 5 random monsters and adding in arrays
        for (var i = 0; i < 5; i++) {
            let monster = monsters[Math.floor(Math.random()*monsters.length)];
            monstersArray.push(monster.id)       
        }

        // Choosing 3 random booster and adding in arrays
        for (var i = 0; i < 3; i++) {
            let booster = boosters[Math.floor(Math.random()*boosters.length)];
            boostersArray.push(booster.id)       
        }

        // Add cards to the player deck

        const requestConfig = {
            method: 'POST'
        };


        } else if (type === 'cpter-deck') {

        // DEBUGGER : GENERER DES MONSTRES EN FONCTION DU NIVEAU DU JOUEUR

        for (var i = 0; i < 5; i++) {
            let monster = monsters[Math.floor(Math.random()*monsters.length)];
            monstersArray.push(monster.id)       
        }

        for (var i = 0; i < 3; i++) {
            let booster = boosters[Math.floor(Math.random()*boosters.length)];
            boostersArray.push(booster.id)       
        }

        }

        const cards = {monsters: monstersArray, boosters: boostersArray};
        return cards;
    },

}


module.exports = cardGenerator;
},{"./game":3,"./utils":6}],3:[function(require,module,exports){
const utils = require('./utils');
const play = require('./play');
const cardGenerator = require('./cardGenerator');

const game = {

    baseUrl: 'http://localhost:5000',

    play: async function(event) {
        event.preventDefault();

        // CLEAR DISPLAY
        utils.clearEverything();
        const article = document.querySelector('article');
        if(article) { document.querySelector('article').innerHTML = ''; }
        

        // Checking if user has decks from API

        const userDatas = sessionStorage.getItem('userDatas');
        const user = JSON.parse(userDatas);

        const requestConfig = {
            method: 'GET'
        };

        const response = await fetch(`${game.baseUrl}/user-decks/${user.id}`, requestConfig);
        const jsonResponse = await response.json();

        if(response.status === 404) {

        } else {

            // Creating main elements in dom
            const mainArea = document.querySelector('main');
            const article = document.createElement('article');
            mainArea.appendChild(article);

            // Add decks datas in session (back) !!

                        
            if(jsonResponse[0].userHasDecks.length > 0) {

                const decks = jsonResponse[0].userHasDecks;

                for(const deck of decks) {

                    cardGenerator.deck(deck);

                    // EventListeners for buttons (deck manager / play with deck)

                    const seeThisDeck = document.querySelector('.see-deck');
                    const playThisDeck = document.querySelector('.play-deck');

                    seeThisDeck.addEventListener('click', function(event){
                        game.showDeck(deck);
                    });
                    playThisDeck.addEventListener('click', play.launchGame);

                }

                // Appendchild un visuel global par deck
                // Onclick du deck afficher les cartes

            } else {
                console.log('no decks')

                const textNewDeck = document.createElement('p');
                textNewDeck.textContent = 'Create your first deck to play !'

                const form = document.createElement('form');
                form.classList.add('form');
                article.appendChild(textNewDeck);
                article.appendChild(form);

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
                createDeckButton.type = 'submit';
                createDeckButton.textContent = 'Create a deck';
                form.appendChild(createDeckButton);

                form.addEventListener('submit', game.deckGenerator);
            }
        }

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

        await fetch(`${game.baseUrl}/crud/deck`, requestConfig);
        // const jsonResponse = await response.json();
        
        // console.log(jsonResponse);

        // for (var value of datas.values()) {
        //     console.log(value); 
        //  }

    },
    
    showDeck: function(deckDatas) {

        // CLEAR DISPLAY
        utils.clearEverything();

        // SHOW ARTICLE AREA 
        const article = document.querySelector('article');
        article.innerHTML = '';
        article.classList.remove('is-hidden');

        const monsters = deckDatas.deckHasMonster;
        const boosters = deckDatas.deckHasBooster;

        for(const monster of monsters) {

            const monsterCard = document.createElement('div');
            monsterCard.classList.add('card');
            monsterCard.classList.add('monster');

            const monsterPicture = document.createElement('img');
            monsterPicture.classList.add('card-picture');
            monsterPicture.src =  `./assets/img/monsters/${monster.id}.jpg`

            const article = document.querySelector('article');
            article.classList.add('deckContainer')
            article.appendChild(monsterCard);
            monsterCard.appendChild(monsterPicture);
        }

        for(const booster of boosters) {

            const boosterCard = document.createElement('div');
            boosterCard.classList.add('card');
            boosterCard.classList.add('booster');

            const boosterPicture = document.createElement('img');
            boosterPicture.classList.add('card-picture');
            boosterPicture.src =  `./assets/img/boosters/${booster.id}.jpg`

            article.appendChild(boosterCard);
            boosterCard.appendChild(boosterPicture);
        }

        // "BACK TO CHOOSE DECK MENU"
        const backMenu = document.createElement('button');
        backMenu.classList.add('nav-button');
        backMenu.textContent = "GO BACK"
        article.appendChild(backMenu);

        // EVENTLISTENER "BACK TO CHOOSE DECK MENU"
        console.log(game)
        backMenu.addEventListener('click', game.play);
    },

}

module.exports = game;
},{"./cardGenerator":2,"./play":4,"./utils":6}],4:[function(require,module,exports){
const utils = require('./utils');
const cardGenerator = require('./cardGenerator');

const play = {

    launchGame: function(deck) {

        // CLEAR DISPLAY
        utils.clearEverything();

        utils.createBoardGame();

        cardGenerator.createDeck('cpter-deck');
        // utils.insertPlayerCards();


    }


}

module.exports = play;
},{"./cardGenerator":2,"./utils":6}],5:[function(require,module,exports){
const utils = require('./utils');

const user = {

    baseUrl: 'http://localhost:5000',


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
            console.log(userDatas);
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
    },

    handleCreateAccountForm: async function(data) {

        event.preventDefault();

        let dataForm = new FormData(data.target);

        const requestConfig = {
            method: 'POST',
            body: dataForm
        }

        const response = await fetch(`${user.baseUrl}/signup`, requestConfig);

        const jsonResponse = await response.json();

        const form = document.querySelector('form[id="createAccount"]');
        const paragraph = document.createElement('p');

        // responseString = JSON.stringify(jsonResponse);
        console.log(jsonResponse.error);

        if(response.status === 404) {

            paragraph.textContent = `Erreur 404`
            form.appendChild(paragraph);

        } else if (jsonResponse.error === 'userExist') {
            
            paragraph.textContent = `l'utilisateur existe déjà`
            form.appendChild(paragraph);
            
        } else if (jsonResponse.error === 'wrongConfirm') {

            paragraph.textContent = `Erreur de confirmation de mot de passe`
            form.appendChild(paragraph);

        } else {

        // Saving json response in local session
        userDatas = JSON.stringify(jsonResponse);
        sessionStorage.setItem('userDatas', userDatas);

        // CLEAR DISPLAY
        utils.clearEverything();

        // ADDING "BACK TO MAIN MENU"
        const main = document.querySelector('main');
        const backMenu = document.createElement('button');
        backMenu.classList.add('nav-button');
        backMenu.textContent = "GO BACK"
        main.appendChild(backMenu);

        // EVENTLISTENER "BACK TO MAIN MENU"
        backMenu.addEventListener('click', utils.showLoggedMenu);
        }


    }

};

module.exports = user;
},{"./utils":6}],6:[function(require,module,exports){
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

    showCreateAccountForm: function(event) {
        event.preventDefault();

        // CLEAR DISPLAY
        utils.clearEverything();

        // SHOW CREATE ACCOUNT FORM
        const createAccountForm = document.querySelector('form[id="createAccount"]');
        createAccountForm.classList.remove('is-hidden');
    },

    createBoardGame: function() {

        const main = document.querySelector('main');
        main.classList.add('board-game');

        const sideArea = document.createElement('div');
        sideArea.classList.add('sideArea');

        const playArea = document.createElement('div');
        playArea.classList.add('playArea');

        // COMPUTER CARDS AREA
        const cpterCards = document.createElement('div');
        cpterCards.classList.add('cardsContainer');
        cpterCards.classList.add('cpter');

        // PLAYER CARDS AREA
        const playerCards = document.createElement('div');
        playerCards.classList.add('cardsContainer');
        playerCards.classList.add('player');

        // DROP AREA
        const dropArea = document.createElement('div');
        dropArea.classList.add('drop-area');

        // ADD ELEMENTS IN DOM

        main.appendChild(sideArea);
        main.appendChild(playArea);

        playArea.appendChild(cpterCards);
        playArea.appendChild(dropArea);
        playArea.appendChild(playerCards);
    }

};

module.exports = utils;
},{}]},{},[1]);
