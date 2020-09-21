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