// IMPORT
const DomGenerator = require('./domGenerator');
const ServerRequest = require('./serverRequest');

let EventListener = {

    menu: function() {
        
        document.querySelector('.nav').addEventListener('click', function(e){ 
            console.log(e.target.className)
            switch (e.target.className) {
                case 'login':
                    DomGenerator.form(['email', 'password']);
                    EventListener.form('login');
                    break;
                case 'create_account':
                    DomHandler.add(['surname', 'firstname', 'lastname', 'email', 'password', 'confirm_password']);
                    EventListener.form('signup');
                    break;
                case 'rules':
                    console.log('coucou de rules')
                    break;
                case 'play':
                    login.display();
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
        });
    },

    form: function(action) {
        const form = document.querySelector('.form');

        if(action === 'login') {
            form.addEventListener('submit', ServerRequest.login)
        } else {
            form.addEventListener('submit', ServerRequest.signup(event))
        }
    }
}

module.exports = EventListener;