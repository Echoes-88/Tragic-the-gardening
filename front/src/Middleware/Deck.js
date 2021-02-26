const Store = require('../Store');
const InitGame = require('../Components/InitGame');

const axios = require('axios');

const MiddlewareDeck = {

    baseUrl: 'http://localhost:5000',

    createOne: async (data) => {

        event.preventDefault();

        let form_data = new FormData();
        form_data.append("title", data.target.title.value);
        form_data.append("id", Store.user.id);

        const requestConfig = {
            method: 'POST',
            body: form_data,
        };

        const response = await fetch(`${MiddlewareDeck.baseUrl}/crud/deck`, requestConfig);
        const jsonResponse = await response.json();

        if(response.status === 404) {

            return false;

        } else {
            // Saving json response in local session
            userDeck = JSON.stringify(jsonResponse);
            sessionStorage.setItem('userDatas', userDeck);
            console.log("le json response est", jsonResponse)
            // Saving datas in store
            Store.user.decks.push(jsonResponse);
            console.log(Store)
            return true
        }

    },

    cpterDeck: async() => {

        const monsters = await axios(`${MiddlewareDeck.baseUrl}/crud/monster`);
        const boosters = await axios(`${MiddlewareDeck.baseUrl}/crud/booster`);

        let monstersArray = [];
        let boostersArray = [];

        // Choosing 5 random monsters and adding in arrays
        for (var i = 0; i < 5; i++) {
            let monster = monsters.data[Math.floor(Math.random()*monsters.data.length)];
            monstersArray.push(monster)       
        }

        // Choosing 3 random booster and adding in arrays
        for (var i = 0; i < 2; i++) {
            let booster = boosters.data[Math.floor(Math.random()*boosters.data.length)];
            boostersArray.push(booster)       
        }

        const deck = {monsters: monstersArray, boosters: boostersArray};

        // Saving datas in store
        Store.cpter.deck = deck;
    }
  
}

module.exports = MiddlewareDeck;