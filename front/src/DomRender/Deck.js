const Deck = {
    showDeck: (decks) => {
        return `
            ${decks.map(deck => 
                `
                <div class="deck-container">
                <p>Deck : "${deck.title}"</p>
                <div class="card-deck"></div>
                <button class="play-deck" id="${deck.id}">Play with this deck</button>
                <button class="manage-deck" id="${deck.id}">Manage deck</button>
                </div>
                `
            )}
        `
    },

    createDeck: () => {
        return `
            <p>Create your first deck to play !</p>
            <form action="" class="form" id="create-deck">
                <input name="title" placeholder="name"></input>
                <button type="submit">Create a deck</button>
            </form>
        `
    }
}

module.exports = Deck;