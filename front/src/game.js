const utils = require('./utils');
const cardGenerator = require('./cardGenerator');

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

        } else {

            // Creating main elements in dom
            const mainArea = document.querySelector('main');
            const article = document.createElement('article');
            mainArea.appendChild(article);

            // Add decks datas in session (back) !!

                        
            if(jsonResponse[0].userHasDecks.length > 0) {

                const decks = jsonResponse[0].userHasDecks;

                for(const deck of decks) {

                    cardGenerator.deck(deck);


                }

                // Appendchild un visuel global par deck
                // Onclick du deck afficher les cartes

            } else {
                console.log('no decks')

                const textNewDeck = document.createElement('p');
                textNewDeck.textContent = 'Create your first deck to play !'

                const form = document.createElement('form');
                form.classList.add('form');
                article.appendChild(textNewDeck);
                article.appendChild(form);

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
                createDeckButton.type = 'submit';
                createDeckButton.textContent = 'Create a deck';
                form.appendChild(createDeckButton);

                form.addEventListener('submit', game.deckGenerator);
            }
        }

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

        await fetch(`${game.baseUrl}/crud/deck`, requestConfig);
        // const jsonResponse = await response.json();
        
        // console.log(jsonResponse);

        // for (var value of datas.values()) {
        //     console.log(value); 
        //  }

    },

    showDecks: function() {
        
        // Fetch API get all decks from user id

        // OnClick on a deck, add launch game button
    },

    launchGame: function() {

    }

}

module.exports = game;