const Store = require('../Store');

const MiddlewareLog = {

    baseUrl: 'http://localhost:5000',

    handleLogin: async (data) => {

        event.preventDefault();

        let dataForm = new FormData(data.target);

        const requestConfig = {
            method: 'POST',
            body: dataForm
        };

        const response = await fetch(`${MiddlewareLog.baseUrl}/login`, requestConfig);
		const jsonResponse = await response.json();

        if(response.status === 404) {

            return false;

        } else {

            // Saving datas in local session
            userDatas = JSON.stringify(jsonResponse);
            sessionStorage.setItem('userDatas', userDatas);

            // Saving datas in store
            Store.user = jsonResponse;
            return true;
        }
   
    },
        
    handleCreateAccount: async (data) => {

        event.preventDefault();

        let dataForm = new FormData(data.target);

        const requestConfig = {
            method: 'POST',
            body: dataForm
        }

        const response = await fetch(`${MiddlewareLog.baseUrl}/signup`, requestConfig);

        const jsonResponse = await response.json();

        const form = document.querySelector('form[id="createAccount"]');
        const paragraph = document.createElement('p');

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

            // Saving datas in store
            Store.user = jsonResponse;
            Store.user.decks = [];

            return true;
        }
    }
}

module.exports = MiddlewareLog;