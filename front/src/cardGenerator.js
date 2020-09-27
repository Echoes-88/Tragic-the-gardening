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
        for (var i = 0; i < 5; i++) {
            let monster = monsters[Math.floor(Math.random()*monsters.length)];
            monstersArray.push(monster.id)       
        }

        // Choosing 3 random booster and adding in arrays
        for (var i = 0; i < 3; i++) {
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

        // GETTING LEVEL OF USER // DEBBUG + TARD POUR GENERER LES CARTES CPTER SELON NIVEAU JOUEUR
        // const userDatas = sessionStorage.getItem('userDatas');
        // const user = JSON.parse(userDatas);
        // const userLevel = user.level;
        // console.log(userLevel);

        const cards = await cardGenerator.getAllCards();

        const monsters = cards.monsters
        const boosters = cards.boosters

        let monstersArray = [];
        let boostersArray = [];

        // Choosing 5 random monsters and adding in arrays
        for (var i = 0; i < 5; i++) {
            let monster = monsters[Math.floor(Math.random()*monsters.length)];
            monstersArray.push(monster)       
        }

        // Choosing 3 random booster and adding in arrays
        for (var i = 0; i < 3; i++) {
            let booster = boosters[Math.floor(Math.random()*boosters.length)];
            boostersArray.push(booster)       
        }


        const deck = {monsters: monstersArray, boosters: boostersArray};
        return deck;

    },

    monsters: function(deck, user) {

        for(const monster of deck) {

            const cardComponent = document.createElement('div');
            cardComponent.classList.add('cardComponent');
            cardComponent.setAttribute("draggable", true);

            // CARD
            const monsterCard = document.createElement('img');
            monsterCard.classList.add('card-monster');
            monsterCard.src =  `./assets/img/Monster.png`

            const cardElementsContainer = document.createElement('div');
            cardElementsContainer.classList.add('cardElementsContainer');

            // NAME
            const monsterName = document.createElement('p');
            monsterName.classList.add('card-name');
            monsterName.textContent = monster.title;

            // DESCRIPTION
            const monsterDescription = document.createElement('p');
            monsterDescription.classList.add('card-description');
            monsterDescription.textContent = monster.text;

            // PICTURE
            const monsterPicture = document.createElement('img');
            monsterPicture.classList.add('card-picture');
            monsterPicture.src =  `./assets/img/monsters/${monster.id}.jpg`

            // ATTACK - DEFENSE - HIT POINT
            const monsterAttack = document.createElement('p');
            monsterAttack.classList.add('card-attack');
            monsterAttack.textContent = monster.attack;

            const monsterDefense = document.createElement('p');
            monsterDefense.classList.add('card-defense');
            monsterDefense.textContent = monster.defense;

            const monsterHitpoint = document.createElement('p');
            monsterHitpoint.classList.add('card-hitpoint');
            monsterHitpoint.textContent = monster.hit_point;

            const container = document.querySelector(`div[user="${user}"]`);
            container.appendChild(cardComponent);
            cardComponent.appendChild(monsterCard);
            cardComponent.appendChild(cardElementsContainer);
            cardElementsContainer.appendChild(monsterName);
            cardElementsContainer.appendChild(monsterPicture);
            cardElementsContainer.appendChild(monsterDescription);
            cardElementsContainer.appendChild(monsterAttack);
            cardElementsContainer.appendChild(monsterDefense);
            cardElementsContainer.appendChild(monsterHitpoint);
        }
    },

    boosters: function(deck, user) {

        for(const booster of deck) {

            const cardComponent = document.createElement('div');
            cardComponent.classList.add('cardComponent');
            cardComponent.setAttribute("draggable", true);

            // CARD
            const boosterCard = document.createElement('img');
            boosterCard.classList.add('card-booster');
            boosterCard.src =  `./assets/img/Booster.png`

            const cardElementsContainer = document.createElement('div');
            cardElementsContainer.classList.add('cardElementsContainer');

            // NAME
            const boosterName = document.createElement('p');
            boosterName.classList.add('card-name');
            boosterName.textContent = booster.title;

            // DESCRIPTION
            const boosterDescription = document.createElement('p');
            boosterDescription.classList.add('card-description');
            boosterDescription.textContent = booster.special_effect_text;

            // PICTURE
            const boosterPicture = document.createElement('img');
            boosterPicture.classList.add('card-picture');
            boosterPicture.src =  `./assets/img/boosters/${booster.id}.jpg`

            // BOOSTER VALUE
            const boosterValue = document.createElement('p');
            boosterValue.classList.add('card-value');
            boosterValue.textContent = booster.special_effect_value;


            const container = document.querySelector(`div[user="${user}"]`);
            container.appendChild(cardComponent);
            cardComponent.appendChild(boosterCard);
            cardComponent.appendChild(cardElementsContainer);
            cardElementsContainer.appendChild(boosterName);
            cardElementsContainer.appendChild(boosterPicture);
            cardElementsContainer.appendChild(boosterDescription);
            cardElementsContainer.appendChild(boosterValue);
        }

        cardGenerator.displayBigCard();
    },

    displayBigCard: function() {

        const cards = document.getElementsByClassName('cardComponent');

        for(const card of cards) {
            card.addEventListener('click', function(e) {

                const bigCardContainer = document.querySelector('.sideArea');
                bigCardContainer.innerHTML = '';

                const card = e.target.closest('.cardComponent');

                const bigCard = card.cloneNode(true);


                bigCardContainer.appendChild(bigCard);

            })
        }
    }

}


module.exports = cardGenerator;