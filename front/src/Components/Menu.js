const DomRenderForm = require('../DomRender/Form');
const DomRenderMenu = require('../DomRender/Menu');

const MiddlewareLog = require('../Middleware/Log');
const InitGame = require('./InitGame');

const Store = require('../Store');

const Menu = {

    unLogged: () => {

        const mainContainer = document.querySelector('.container');
        mainContainer.innerHTML = DomRenderMenu.render('unLogged');

        // LOGIN
        const login = document.querySelector('li[set-menu="login"] a');
        
        login.addEventListener('click', ()=> {
            event.preventDefault();

            // Create Dom elements
            mainContainer.innerHTML = DomRenderForm.login();

            // Listen login form submit
            const loginForm = document.querySelector('form[id="login"]');
            loginForm.addEventListener('submit', async (datas) => {

                const response = await MiddlewareLog.handleLogin(datas);
                (response ? Menu.logged() : console.log("T qui ?"));
            });

            // Listen back to menu
            const backToMenu = document.querySelector('.go-back');
            backToMenu.addEventListener('click', () => {
                event.preventDefault();
                Menu.unLogged();
            });
        });

        // CREATE ACCOUNT
        const createAccount = document.querySelector('li[set-menu="createAccount"] a');

        createAccount.addEventListener('click', ()=> {
            event.preventDefault();

            // Create Dom elements
            const mainContainer = document.querySelector('.container');
            mainContainer.innerHTML = DomRenderForm.createAccount();

            // Listen Create Account form submit
            const createAccountForm = document.querySelector('form[id="createAccount"]');
            createAccountForm.addEventListener('submit', async(datas) => {
                
                const response = MiddlewareLog.handleCreateAccount(datas);
                if(response) {
                    Menu.logged();
                }

            });

            // Listen back to menu
            const backToMenu = document.querySelector('.go-back');
            backToMenu.addEventListener('click', () => {
                event.preventDefault();
                Menu.unLogged();
            });
        });

    },

    logged: () => {

        console.log(Store)
        const mainContainer = document.querySelector('.container');
        mainContainer.innerHTML = DomRenderMenu.render('logged');

        // Listen play button event
        const play = document.querySelector('li[set-menu="play"] a');
        play.addEventListener('click', InitGame.init);
    }
}

module.exports = Menu;