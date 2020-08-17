const Booster = require('./booster');
const Card = require('./card');
const Deck = require('./deck');
const User = require('./user');

// Un deck est possédé par un utilisateur
Deck.belongsTo(User, {
    foreignKey: "user_id",
    as: "userDeck"
})


// "Un Deck possède plusieurs cartes"
Deck.belongsToMany(Card, {
    as: "cards",
    through: 'deck_has_card',
    foreignKey: 'deck_id',
    otherKey: 'card_id',
});
// ... et la réciproque !
Card.belongsToMany(Deck, {
    as: "decksCard",
    through: 'deck_has_card',
    otherKey: 'deck_id',
    foreignKey: 'card_id'
});


// "Un Deck possède plusieurs booster"
Deck.belongsToMany(Booster, {
    as: "boosters",
    through: 'deck_has_booster',
    foreignKey: 'deck_id',
    otherKey: 'booster_id',
});
// ... et la réciproque !
Card.belongsToMany(Deck, {
    as: "decksBooster",
    through: 'deck_has_booster',
    otherKey: 'deck_id',
    foreignKey: 'card_id'
});