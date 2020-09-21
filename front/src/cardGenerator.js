const game = require('./game');
const utils = require('./utils');

var cardGenerator = {

    baseUrl: 'http://localhost:5000',

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
        seeThisDeck.classList.add('see-deck');
        const playThisDeck = document.createElement('button');
        playThisDeck.classList.add('play-deck');
        seeThisDeck.textContent = 'Manage deck'
        playThisDeck.textContent = 'Play with this deck'

        deckContainer.appendChild(seeThisDeck)
        deckContainer.appendChild(playThisDeck);

    },

    createDeck: async function(type) {

        // GETTING LEVEL OF USER // DEBBUG + TARD POUR GENERER LES CARTES CPTER SELON NIVEAU JOUEUR
        const userDatas = sessionStorage.getItem('userDatas');
        const user = JSON.parse(userDatas);
        const userLevel = user.level;
        console.log(userLevel);

        const requestConfig = {
            method: 'GET'
        };

        const getMonsters = await fetch(`${cardGenerator.baseUrl}/crud/monster`, requestConfig);
        const monsters = await getMonsters.json();

        const getBoosters = await fetch(`${cardGenerator.baseUrl}/crud/booster`, requestConfig);
        const boosters = await getBoosters.json();

        // Init monster and booster arrays
        let monstersArray = [];
        let boostersArray = [];

        if (type === 'player-deck') {

        // Choosing 5 random monsters and adding in arrays
        for (var i = 0; i < 5; i++) {
            let monster = monsters[Math.floor(Math.random()*monsters.length)];
            monstersArray.push(monster.id)       
        }

        // Choosing 3 random booster and adding in arrays
        for (var i = 0; i < 3; i++) {
            let booster = boosters[Math.floor(Math.random()*boosters.length)];
            boostersArray.push(booster.id)       
        }

        // Add cards to the player deck

        const requestConfig = {
            method: 'POST'
        };


        } else if (type === 'cpter-deck') {

        // DEBUGGER : GENERER DES MONSTRES EN FONCTION DU NIVEAU DU JOUEUR

        for (var i = 0; i < 5; i++) {
            let monster = monsters[Math.floor(Math.random()*monsters.length)];
            monstersArray.push(monster.id)       
        }

        for (var i = 0; i < 3; i++) {
            let booster = boosters[Math.floor(Math.random()*boosters.length)];
            boostersArray.push(booster.id)       
        }

        }

        const cards = {monsters: monstersArray, boosters: boostersArray};
        return cards;
    },

}


module.exports = cardGenerator;