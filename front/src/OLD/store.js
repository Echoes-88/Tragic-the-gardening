
let Store = {


    menu: ['create_account', 'login', 'rules'],

    cards: {
        allCards: [],
        computerCards: [],
        userCards: []
    },
        
    user: {
        id: null,
        pseudo: null,
        firstname: null,
        lastname: null,
        email: null,
        victory: null,
        defeat: null,
        level: null,
        decks: null
    }
}

module.exports = Store;