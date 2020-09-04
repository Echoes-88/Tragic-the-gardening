    const utils = require('./utils');

const game = {

    play: function(event) {
        event.preventDefault();

        // CLEAR DISPLAY
        utils.clearEverything();

        // Checking if user has decks from API

        const userDatas = sessionStorage.getItem('userDatas');
        const user = JSON.parse(userDatas);
        console.log('game', user);


        const dom = document.querySelector('main');

        for(const data of Object.keys(user)) {
            const paragraph = document.createElement('p');
            paragraph.classList.add('account-key');
            paragraph.textContent = data;
            dom.appendChild(paragraph);
        }


        // console.log(user)
        

        // let dataForm = new FormData(data.target);

        // const requestConfig = {
        //     method: 'POST',
        //     body: dataForm
        // };

        // const response = await fetch(`${user.baseUrl}/login`, requestConfig);
		// const jsonResponse = await response.json();

        // if(response.status === 404) {
        //     console.log(jsonResponse)
        // } else {
        //     console.log(jsonResponse);
        //     utils.showPlayGame();
        // }


        // if yes, call show decks method and ask to choose the deck to play + button manage decks

            
            //

        // if no, show button create deck, on click addEvent to show deckGenerator method


    },
    

    deckGenerator: function() {

    },

    showDecks: function() {
        
        // Fetch API get all decks from user id

        // OnClick on a deck, add launch game button
    }

}

module.exports = game;