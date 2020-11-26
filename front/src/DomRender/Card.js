const Card = {

    monster: (card, user) => {
        return `
        <div class="cardComponent ${user}Card monster" data-key="${card.key}">
            <p class="card-name">${card.title}</p>
            <div class="card-picture-container">
            <img class="card-picture ${user}" src="./assets/img/monster/${card.id}.png">
            </div>
            <img class="card-background" src="./assets/img/monster.png">
            <p class="card-value attack" id="attack">${card.attack}</p>
            <p class="card-value defense" id="defense">${card.defense}</p>
            <p class="card-value hit_point" id="hit_point">${card.hit_point}</p>
      </div>
        `
    },
    
    booster: (card, user) => {
        return `
        <div class="cardComponent ${user}Card booster" data-key="${card.key}">
            <p class="card-name">${card.title}</p>
            <div class="card-picture-container">
            <img class="card-picture ${user}" src="./assets/img/booster/${card.id}.png">
            </div>
            <img class="card-background" src="./assets/img/booster.png">
            <p class="card-value boost" id="boost">${card.special_effect_value}</p>
      </div>
        `
    },

    showDeck: (decks) => {
        return `
            ${decks.map(deck => 
                `
                <div class="deck-container">
                <p>Deck : "${deck.title}"</p>
                <div class="card-deck"></div>
                <button class="play-deck" id="${deck.id}">Play with this deck</button>
                <!-- <button class="manage-deck" id="${deck.id}">Manage deck</button> -->
                </div>
                `
            )}
        `
    },

    createDeck: () => {
        return `
            <div class="create-deck-container">
            <img src="assets/img/vault-boy/vault-boy-letsPlay.png" class="vault-boy-createDeck">
            <p>Create your first deck to play !</p>
            <form action="" class="create-deck" id="create-deck">
                <input name="title" placeholder="name"></input>
                <button type="submit">Create a deck</button>
            </form>
            </div>
        `
    }
}

module.exports = Card;