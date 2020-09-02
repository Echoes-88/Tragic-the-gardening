const utils = require('./utils');

const user = {

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
    },


    handleLoginForm: function(data) {

        event.preventDefault();

        let dataForm = new FormData(data.target);

        const requestConfig = {
            method: 'POST',
            body: dataForm
        };

        return (
            fetch(`${user.baseUrl}/login`, requestConfig)

                .then((response) => {
                    utils.showMenu();
                })
        );
    }

};

module.exports = user;