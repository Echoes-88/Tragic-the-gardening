
const utils = {

    showMainMenu: function() {
        
        // SHOW MENU
        const menu = document.querySelector('.menu')
        menu.classList.add('is-active');

        // SHOW LOGIN, CREATE ACCOUNT, RULES
        const playButton = document.querySelector('li[set-menu="login"]');
        playButton.classList.add('is-active');

        const createAccountButton = document.querySelector('li[set-menu="createAccount"]');
        createAccountButton.classList.add('is-active');
        
        const rulesButton = document.querySelector('li[set-menu="rules"]');
        rulesButton.classList.add('is-active');
    },

    showLoggedMenu: function() {

        // CLEAR DISPLAY
        utils.clearEverything();

        // SHOW MENU
        const menu = document.querySelector('.menu')
        menu.classList.add('is-active');

        const playButton = document.querySelector('li[set-menu="play"]');
        playButton.classList.add('is-active');
        const accountButton = document.querySelector('li[set-menu="account"]');
        accountButton.classList.add('is-active');
        const rulesButton = document.querySelector('li[set-menu="rules"]');
        rulesButton.classList.add('is-active');

    },

    clearEverything: function() {
        const activeElements = document.querySelectorAll('*');

        for(let activElt of activeElements) {
            activElt.classList.remove('is-active');
        }
    },


    showLoginForm: function(event) {

        event.preventDefault();

        // CLEAR DISPLAY
        utils.clearEverything();

        // SHOW LOGIN FORM
        const loginForm = document.querySelector('form[id="login"]')
        loginForm.classList.add('is-active');
    },
};

module.exports = utils;