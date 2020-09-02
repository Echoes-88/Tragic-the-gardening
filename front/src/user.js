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
            console.log(jsonResponse)
        } else {
            console.log(jsonResponse);
            utils.showPlayGame();
        }

    }

};

module.exports = user;