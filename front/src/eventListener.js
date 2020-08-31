const moduleUtils = require('./utils');

const eventListener = {

    main: function(event) {

        const menuLogin = document.querySelector('a[menu="login"]');
        
        menuLogin.addEventListener('click', moduleUtils.showLoginForm);
    }

};

module.exports = eventListener;