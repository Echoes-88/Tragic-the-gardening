
const utils = {

    showMenu: function() {

        // HIDDE LOGIN FORM
        const loginForm = document.querySelector('form[id="login"]')
        loginForm.classList.remove('is-active');
        loginForm.classList.add('inactive');

        // SHOW MENU
        const menu = document.querySelector('.menu')
        menu.classList.remove('inactive');
        menu.classList.add('is-active');

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