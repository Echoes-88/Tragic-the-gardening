const game = require('./game');
const utils = require('./utils');

var cardGenerator = {

    deck: function(deckDatas) {

        // Creating div for the deck with deck picture, title and buttons (deck manager / play with deck)
        const deckContainer = document.createElement('div');
        deckContainer.classList.add('deck-container');
        const deckTitle = document.createElement('p');
        deckTitle.textContent = deckDatas.title;
        const deckImage = document.createElement('div');
        deckImage.classList.add('card');
        deckImage.classList.add('deck');

        const article = document.querySelector('article');

        deckContainer.setAttribute('set-id', deckDatas.id);

        article.appendChild(deckContainer);
        deckContainer.appendChild(deckTitle)
        deckContainer.appendChild(deckImage);

        const seeThisDeck = document.createElement('button');
        const playThisDeck = document.createElement('button');
        seeThisDeck.textContent = 'Manage deck'
        playThisDeck.textContent = 'Play with this deck'

        deckContainer.appendChild(seeThisDeck)
        deckContainer.appendChild(playThisDeck);

        // EventListeners for buttons (deck manager / play with deck)
        seeThisDeck.addEventListener('click', function(event){
            utils.showDeck(deckDatas);
        });
        playThisDeck.addEventListener('click', game.launchGame);
    },

    monster: function(caracterstics) {

    },

    booster: function(caracterstics) {

    },
}


module.exports = cardGenerator;