const utils = require('./utils');

const user = {

    baseUrl: 'http://localhost:3000',


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
            sessionStorage.setItem('userDatas', userDatas);

            utils.showPlayGame();
        }

    },

    account: function(event) {

        event.preventDefault();

        //HIDDE MENU
        const menu = document.querySelector('.menu')
        menu.classList.remove('is-active');
        menu.classList.add('inactive');


        const userDatas = sessionStorage.getItem('userDatas');
        const user = JSON.parse(userDatas);
        console.log('user', user);

        const dom = document.querySelector('main');

        const article = document.createElement('article');
        dom.appendChild(article);

        for(const data of Object.keys(user)) {
            const paragraph = document.createElement('p');
            paragraph.classList.add('account-key');
            paragraph.textContent = data;
            article.appendChild(paragraph);
        }
    }

};

module.exports = user;