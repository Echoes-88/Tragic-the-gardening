const utils = require('./utils');
const play = require('./play');
const cardGenerator = require('./cardGenerator');
const Store = require('./store');

const game = {

    baseUrl: 'http://localhost:5000',

    play: async function(event) {
        event.preventDefault();

        // CLEAR DISPLAY
        utils.clearEverything();

        const logo = document.querySelector('.logo')
        logo.classList.add('is-hidden');

        const container = document.querySelector('.container');
        container.style.justifyContent = 'center';

        // const article = document.querySelector('article');
        // if(article) { document.querySelector('article').innerHTML = ''; }
        
        // Creating main elements in dom
        const mainArea = document.querySelector('main');
        const article = document.createElement('article');
        mainArea.appendChild(article);

        // Checking if user has decks

        if(Store.user.decks) {

            for(const deck of Store.user.decks) {

                cardGenerator.deck(deck);

                const seeThisDeck = document.querySelector('.see-deck');
                const playThisDeck = document.querySelector('.play-deck');

                seeThisDeck.addEventListener('click', function(){ game.showDeck(deck);});
                playThisDeck.addEventListener('click', function(){ play.launchGame(deck)});
            }

        } else {
            
            // Generating a deck for new user

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

            form.addEventListener('submit', cardGenerator.firstUserDeck);
        }

        // ADDING "BACK TO MAIN MENU"
        const backMenu = document.createElement('button');
        backMenu.classList.add('nav-button');
        backMenu.textContent = "GO BACK"
        mainArea.appendChild(backMenu);

        // EVENTLISTENER "BACK TO MAIN MENU"
        backMenu.addEventListener('click', utils.showLoggedMenu);

    },
    
    showDeck: function(deck) {

        // CLEAR DISPLAY
        utils.clearEverything();

        // SHOW ARTICLE AREA 
        const article = document.querySelector('article');
        article.innerHTML = '';
        article.classList.remove('is-hidden');

        const monsters = deck.monsters;
        const boosters = deck.boosters;

        for(const monster of monsters) {

            const monsterCard = document.createElement('div');
            monsterCard.classList.add('card');
            monsterCard.classList.add('monster');

            const monsterPicture = document.createElement('img');
            monsterPicture.classList.add('card-picture');
            monsterPicture.src =  `./assets/img/monsters/${monster.id}.jpg`

            const article = document.querySelector('article');
            article.classList.add('deckContainer')
            article.appendChild(monsterCard);
            monsterCard.appendChild(monsterPicture);
        }

        for(const booster of boosters) {

            const boosterCard = document.createElement('div');
            boosterCard.classList.add('card');
            boosterCard.classList.add('booster');

            const boosterPicture = document.createElement('img');
            boosterPicture.classList.add('card-picture');
            boosterPicture.src =  `./assets/img/boosters/${booster.id}.jpg`

            article.appendChild(boosterCard);
            boosterCard.appendChild(boosterPicture);
        }

        // "BACK TO CHOOSE DECK MENU"
        const backMenu = document.createElement('button');
        backMenu.classList.add('nav-button');
        backMenu.textContent = "GO BACK"
        article.appendChild(backMenu);

        // EVENTLISTENER "BACK TO CHOOSE DECK MENU"
        console.log(game)
        backMenu.addEventListener('click', game.play);
    },

}

module.exports = game;