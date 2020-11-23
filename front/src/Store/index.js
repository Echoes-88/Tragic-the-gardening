const Store = {

    user: {
        id: null,
        firstname: null,
        lastname: null,
        pseudo: null,
        email: null,
        victory: null,
        defeat: null,
        level: null,
        role: null,
        decks: null,
        currentDeck: {
            monsters: [],
            boosters: [],
        }
    },

    cpter: {
        deck: null,
    }
};

module.exports = Store;