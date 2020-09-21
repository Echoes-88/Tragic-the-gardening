const utils = require('./utils');

const user = {

    baseUrl: 'http://localhost:5000',


    handleLoginForm: async function(data) {

        event.preventDefault();

        let dataForm = new FormData(data.target);

        const requestConfig = {
            method: 'POST',
            body: dataForm
        };

        const response = await fetch(`${user.baseUrl}/login`, requestConfig);
		const jsonResponse = await response.json();

        if(response.status === 404) {
            // Debugger
            // console.log(jsonResponse)

        } else {

            // Saving json response in local session
            userDatas = JSON.stringify(jsonResponse);
            console.log(userDatas);
            sessionStorage.setItem('userDatas', userDatas);

            utils.showLoggedMenu();
        }

    },

    account: function(event) {

        event.preventDefault();

        // CLEAR DISPLAY
        utils.clearEverything();

        // SHOW MENU
        const menu = document.querySelector('.menu')
        menu.classList.remove('is-hidden');

        // GET DATAS FROM SESSION STORAGE
        const userDatas = sessionStorage.getItem('userDatas');
        const user = JSON.parse(userDatas);

        // CREATING DOM
        const dom = document.querySelector('main');

        const article = document.createElement('article');
        dom.appendChild(article);

        // GENERATING USER INFORMATIONS IN DOM
        for(const elt of Object.entries(user)) {

            console.log(elt)
            const paragraph = document.createElement('p');
            paragraph.classList.add('account-key');
            paragraph.textContent = elt[0] + ' : ' + elt[1];
            article.appendChild(paragraph);
        }

        // ADDING "BACK TO MAIN MENU"
        const backMenu = document.createElement('button');
        backMenu.classList.add('nav-button');
        backMenu.textContent = "GO BACK"
        article.appendChild(backMenu);

        // EVENTLISTENER "BACK TO MAIN MENU"
        backMenu.addEventListener('click', utils.showLoggedMenu);
    },

    handleCreateAccountForm: async function(data) {

        event.preventDefault();

        let dataForm = new FormData(data.target);

        const requestConfig = {
            method: 'POST',
            body: dataForm
        }

        const response = await fetch(`${user.baseUrl}/signup`, requestConfig);

        const jsonResponse = await response.json();

        const form = document.querySelector('form[id="createAccount"]');
        const paragraph = document.createElement('p');

        // responseString = JSON.stringify(jsonResponse);
        console.log(jsonResponse.error);

        if(response.status === 404) {

            paragraph.textContent = `Erreur 404`
            form.appendChild(paragraph);

        } else if (jsonResponse.error === 'userExist') {
            
            paragraph.textContent = `l'utilisateur existe déjà`
            form.appendChild(paragraph);
            
        } else if (jsonResponse.error === 'wrongConfirm') {

            paragraph.textContent = `Erreur de confirmation de mot de passe`
            form.appendChild(paragraph);

        } else {

        // Saving json response in local session
        userDatas = JSON.stringify(jsonResponse);
        sessionStorage.setItem('userDatas', userDatas);

        // CLEAR DISPLAY
        utils.clearEverything();

        // ADDING "BACK TO MAIN MENU"
        const main = document.querySelector('main');
        const backMenu = document.createElement('button');
        backMenu.classList.add('nav-button');
        backMenu.textContent = "GO BACK"
        main.appendChild(backMenu);

        // EVENTLISTENER "BACK TO MAIN MENU"
        backMenu.addEventListener('click', utils.showLoggedMenu);
        }


    }

};

module.exports = user;