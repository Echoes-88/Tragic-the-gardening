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
        deckImage.classList.add('card-deck');

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

    getAllCards: async function() {

        const requestConfig = {
            method: 'GET'
        };

        const getMonsters = await fetch(`${cardGenerator.baseUrl}/crud/monster`, requestConfig);
        const monsters = await getMonsters.json();

        const getBoosters = await fetch(`${cardGenerator.baseUrl}/crud/booster`, requestConfig);
        const boosters = await getBoosters.json();

        const cards = {monsters: monsters, boosters: boosters};

        return cards;

    },

    firstUserDeck: async function(data) {

        event.preventDefault();

        const cards = await cardGenerator.getAllCards();

        const monsters = cards.monsters
        const boosters = cards.boosters

        // Init monster and booster arrays
        let monstersArray = [];
        let boostersArray = [];

        // Choosing 5 random monsters and adding in arrays
        for (var i = 0; i < 4; i++) {
            let monster = monsters[Math.floor(Math.random()*monsters.length)];
            monstersArray.push(monster.id)       
        }

        // Choosing 2 random booster and adding in arrays
        for (var i = 0; i < 2; i++) {
            let booster = boosters[Math.floor(Math.random()*boosters.length)];
            boostersArray.push(booster.id)       
        }

        const datasToSend = {id: data.target.id.value, title: data.target.title.value, monsters: monstersArray, boosters: boostersArray};

        var form_data = new FormData();

        for ( var key in datasToSend ) {
            form_data.append(key, datasToSend[key]);
        }

        const requestConfig = {
            method: 'POST',
            body: form_data
        };

        await fetch(`${cardGenerator.baseUrl}/crud/deck`, requestConfig);

    },

    cpterDeck: async function() {

        const cards = await cardGenerator.getAllCards();

        const monsters = cards.monsters
        const boosters = cards.boosters

        let monstersArray = [];
        let boostersArray = [];

        // Choosing 5 random monsters and adding in arrays
        for (var i = 0; i < 4; i++) {
            let monster = monsters[Math.floor(Math.random()*monsters.length)];
            monster.key = null;
            monstersArray.push(monster)       
        }

        // Choosing 3 random booster and adding in arrays
        for (var i = 0; i < 2; i++) {
            let booster = boosters[Math.floor(Math.random()*boosters.length)];
            boostersArray.push(booster)       
        }

        const deck = {monsters: monstersArray, boosters: boostersArray};
        return deck;

    },

    card: function(card, type, user) {

        var template = document.querySelector('#template-card');
        var clone = document.importNode(template.content, true);

        // ATTRIBUTE
        const container = clone.querySelector('.cardComponent');
        container.setAttribute('data-key', card.key);

        if(user != 'cpter') {
            container.classList.add('playerCard');
            container.setAttribute('data-player', 'userDeck');
            container.setAttribute("draggable", true);
            container.setAttribute('data-status', 'onHand');
        }

        if(user === 'cpter') {
            container.setAttribute('data-player', 'cpterDeck');
            clone.querySelector('.card-picture').classList.add('cpter');
        }

        // TITLE
        clone.querySelector('.card-name').textContent = card.title;

        // PICTURE
        clone.querySelector('.card-picture').src =  `./assets/img/${type}/${card.id}.png`;

        // STATISTICS & BACKGROUND
        if(type === 'monster') {
            clone.querySelector('.card-background').src =  `./assets/img/Monster.png`;

            clone.querySelector('.attack').textContent = card.attack;
            clone.querySelector('.defense').textContent = card.defense;
            clone.querySelector('.hitpoint').textContent = card.hit_point;
        } else {
            clone.querySelector('.card-background').src =  `./assets/img/Booster.png`;
            clone.querySelector('.boost').textContent = card.special_effect_value;
        }

        return clone;
    },

}


module.exports = cardGenerator;