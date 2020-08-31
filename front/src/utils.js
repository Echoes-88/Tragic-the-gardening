
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