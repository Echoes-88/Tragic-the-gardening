const Sequelize = require('sequelize');
const sequelize = require('../database');

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
    as: "decks"
})

// Ajout de la colonne quantité pour l'association deck has Monster
MonsterQuantity = sequelize.define('recurrence', {
    quantity: Sequelize.INTEGER
  }, {
    // Empêche l'ajout auto du "s" par sequelize à la fin du nom de la table
    freezeTableName: true,
    tableName: 'deck_has_monster',
  });

// "Un Deck possède plusieurs monstres"
Deck.belongsToMany(Monster, {
    as: "monsters",
    through: MonsterQuantity,
    foreignKey: 'deck_id',
    otherKey: 'monster_id'
});


// Ajout de la colonne quantité pour l'association deck has Booster
BoosterQuantity = sequelize.define('recurrence', {
    quantity: Sequelize.INTEGER
  }, {
    // Empêche l'ajout auto du "s" par sequelize à la fin du nom de la table
    freezeTableName: true,
    tableName: 'deck_has_booster',
  });

// Monster.belongsToMany(Deck, {
//     as: "monsterHasDeck",
//     through: 'deck_has_monster',
//     foreignKey: 'monster_id',
//     otherKey: 'deck_id'
// });


// "Un Deck possède plusieurs booster"
Deck.belongsToMany(Booster, {
    as: "boosters",
    through: BoosterQuantity,
    foreignKey: 'deck_id',
    otherKey: 'booster_id',
});
// // ... et la réciproque !
// Booster.belongsToMany(Deck, {
//     as: "boosterHasDeck",
//     through: 'deck_has_booster',
//     foreignKey: 'booster_id',
//     otherKey: 'deck_id'
// });

module.exports = { Booster, Monster, Deck, User };