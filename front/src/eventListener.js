const moduleUtils = require('./utils');

const eventListener = {

    login: function() {

        const menuLogin = document.querySelector('a[menu="login"]');
        
        menuLogin.addEventListener('click', moduleUtils.showLoginForm);
    }

};

module.exports = eventListener;