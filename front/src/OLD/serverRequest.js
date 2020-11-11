const Store = require('./store');
const DomHandler = require('./domHandler');
const EventListener = require('./eventListener');
const App = require('./app');

let ServerRequest = {

    baseUrl: 'http://localhost:5000',

    login: async function(event) {

        event.preventDefault();

        let dataForm = new FormData(event.target);

        const requestConfig = {
            method: 'POST',
            body: dataForm
        };

        const response = await fetch(`${ServerRequest.baseUrl}/login`, requestConfig);
		const jsonResponse = await response.json();

        if(response.status === 404) {
            // Debugger
            // console.log(jsonResponse)

        } else {

            // Saving datas in local session
            sessionStorage.setItem('userDatas', jsonResponse);

            // Saving datas in store
            Store.user = jsonResponse;

            Store.menu = ['Play', 'my_account', 'rules', 'logout'];
            console.log('hello')
            // DomHandler.add('.nav', Store.menu, 'li');
            App.init();
        }

    },

    signup: function() {

    },
}

module.exports = ServerRequest;