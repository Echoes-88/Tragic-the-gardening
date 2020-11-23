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
}

module.exports = Card;