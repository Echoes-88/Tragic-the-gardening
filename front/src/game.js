    const utils = require('./utils');

const game = {

    baseUrl: 'http://localhost:3000',

    play: async function(event) {
        event.preventDefault();

        // CLEAR DISPLAY
        utils.clearEverything();

        // Checking if user has decks from API

        const userDatas = sessionStorage.getItem('userDatas');
        const user = JSON.parse(userDatas);


        const requestConfig = {
            method: 'GET'
        };

        const response = await fetch(`${game.baseUrl}/user-decks/${user.id}`, requestConfig);
		const jsonResponse = await response.json();

        if(response.status === 404) {


            console.log(jsonResponse)
        } else {

            // Creating main elements in dom
            const mainArea = document.querySelector('main');
            const article = document.createElement('article');
            mainArea.appendChild(article);

                        
            if(jsonResponse.userHasDecks > 0) {
                console.log('user has some decks')
                // afficher les decks

            } else {
                console.log('no decks')

                const textNewDeck = document.createElement('p');
                textNewDeck.textContent = 'Create your first deck to play !'

                const form = document.createElement('form');

                article.appendChild(textNewDeck);
                textNewDeck.appendChild(form);

                const deckName = document.createElement('input');
                deckName.placeholder = 'name';
                deckName.name = 'title';
                form.appendChild(deckName);

                const userId = document.createElement('input');
                userId.name = 'id';
                userId.value = user.id;
                userId.style.display = 'none';
                form.appendChild(userId);

                const createDeckButton = document.createElement('button');
                createDeckButton.textContent = 'Create a deck';
                form.appendChild(createDeckButton);

                form.addEventListener('submit', game.deckGenerator);
            }
        }


        // if yes, call show decks method and ask to choose the deck to play + button manage decks

            
            //

        // if no, show button create deck, on click addEvent to show deckGenerator method


        // ADDING "BACK TO MAIN MENU"
        const backMenu = document.createElement('button');
        backMenu.classList.add('nav-button');
        backMenu.textContent = "GO BACK"
        // document.appendChild(backMenu);

        // EVENTLISTENER "BACK TO MAIN MENU"
        backMenu.addEventListener('click', utils.showLoggedMenu);

    },
    

    deckGenerator: async function(data) {

        event.preventDefault();

        const datas = new FormData(data.target);

        const requestConfig = {
            method: 'POST',
            body: datas
        };

        const response = await fetch(`${game.baseUrl}/crud/deck`, requestConfig);
        const jsonResponse = await response.json();
        
        console.log(jsonResponse);

        // for (var value of datas.values()) {
        //     console.log(value); 
        //  }

    },

    showDecks: function() {
        
        // Fetch API get all decks from user id

        // OnClick on a deck, add launch game button
    }

}

module.exports = game;