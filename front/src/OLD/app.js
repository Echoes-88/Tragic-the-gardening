// IMPORT
const DomGenerator = require('./domGenerator');
const EventListener = require('./eventListener');
const Store = require('./store');

// APP

let App = {

    // Add session request to api

    init: function(action, state) {

        // Display menu
        // DomGenerator.menu(Store.menu);
        // EventListener.menu();

        switch (action) {
            case 'displayMenu':
                DomGenerator.menu(Store.menu);
                EventListener.menu();
                break;
            case 'displayFormLogin':
                DomGenerator.form('.form', ['surname', 'firstname', 'lastname', 'email', 'password', 'confirm_password'], 'input', 'signup');
                EventListener.form('signup');
                break;
            case 'displayFormCreateAccount':
                DomGenerator.form('.form', ['surname', 'firstname', 'lastname', 'email', 'password', 'confirm_password'], 'input', 'signup');
                EventListener.form('signup');
                break;
            case 'displayGame':
                console.log('coucou de rules')
                break;
            case 'logged':
                Store.menu = ['play', 'rules', 'logout'];
                DomGenerator.menu(Store.menu);
                break;
            case 'profil':
                login.display();
                break;
            case 'logout':
                login.display();
                break;
            default:
                console.log('coucou general')
        }
    },
}

module.exports = App;