const Store = require('../Store');

const PlayGame = require('./PlayGame');

// Middleware request
const MiddlewareDeck = require('../Middleware/Deck');

// Render
// const DeckGeneratorScreen = require('../DomRender/ManageDeck');
const DomRenderDeck = require('../DomRender/Deck');

const InitGame = {

    init: () => {

        event.preventDefault();
        console.log(Store)

        const mainContainer = document.querySelector('.container');
        mainContainer.classList.add('flex');

        // Check if user has decks. Yes => show all decks. No => create one
        if(Store.user.decks.length > 0) {

                mainContainer.innerHTML = DomRenderDeck.showDeck(Store.user.decks);

                const manageDeck = document.getElementsByClassName('manage-deck');
                const playDeck = document.getElementsByClassName('play-deck');

                for(const deck of manageDeck) {
                    deck.addEventListener('click', function(){
                        event.preventDefault();
                        mainContainer.innerHTML = DomRenderDeck.render(deck.id);
                    });
                }

                for(const deck of playDeck) {
                    deck.addEventListener('click', function(){
                        event.preventDefault();
                        mainContainer.classList.remove('flex');
                        mainContainer.classList.add('board-game');
                       
                        // Start game;
                        PlayGame.init(deck.id)
                    });
                }


        } else {
            console.log("ça passe car il n a pas de deck")
            mainContainer.innerHTML = DomRenderDeck.createDeck();

            const form = document.getElementById('create-deck');
            form.addEventListener('submit', function(data){ 
                event.preventDefault();
                // Create deck in database
                const response = MiddlewareDeck.createOne(data);
                if(response) {
                    console.log("le deck est bien créé")
                }
                // Reload
            });
        }
            
    }
}

module.exports = InitGame;