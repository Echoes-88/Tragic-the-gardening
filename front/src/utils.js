
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