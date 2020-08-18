const Booster = require('./booster');
const Monster = require('./monster');
const Deck = require('./deck');
const User = require('./user');

// Un deck est possédé par un utilisateur
Deck.belongsTo(User, {
    foreignKey: "user_id",
    as: "deckParent"
})

// Un utilisateur possede plusieurs deck
User.hasMany(Deck, {
    foreignKey: "user_id",
    as: "userHasDecks"
})


// "Un Deck possède plusieurs monstres"
Deck.belongsToMany(Monster, {
    as: "deckHasMonster",
    through: 'deck_has_monster',
    foreignKey: 'deck_id',
    otherKey: 'monster_id',
});
// ... et la réciproque !
Monster.belongsToMany(Deck, {
    as: "monsterHasDeck",
    through: 'deck_has_monster',
    foreignKey: 'monster_id',
    otherKey: 'deck_id'
});


// "Un Deck possède plusieurs booster"
Deck.belongsToMany(Booster, {
    as: "deckHasBooster",
    through: 'deck_has_booster',
    foreignKey: 'deck_id',
    otherKey: 'booster_id',
});
// ... et la réciproque !
Booster.belongsToMany(Deck, {
    as: "boosterHasDeck",
    through: 'deck_has_booster',
    foreignKey: 'booster_id',
    otherKey: 'deck_id'
});

module.exports = { Booster, Monster, Deck, User };