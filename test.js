const dotenv = require('dotenv');
dotenv.config();

const { Booster, Deck, Monster, User} = require('./app/models');


// TEST DES RELATIONS

Monster.findAll({})
.then((monsters) => {
    console.log(monsters);
})

Deck.findByPk(1, {
    include: ["deckParent"]
}).then((deck)=>{
    console.log(deck.deckParent)
})

Deck.findAll({
    include: ["deckHasMonster"]
}).then((deck)=>{
    console.log(deck)
})