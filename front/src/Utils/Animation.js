
const dragAndDrop = require('./DragAndDrop');

var animation = {
  
    blink: function(cardone, cardtwo) {

        cardone.classList.add('blink_me');
        cardtwo.classList.add('blink_me');

        setTimeout(function(){ 
            cardone.classList.remove('blink_me');
            cardtwo.classList.remove('blink_me');

        }, 2000);

    },

    moveCards: function(cpterCard, playerCard) {

        const positionPlayerCard = dragAndDrop.getPosition(playerCard);
        const positionCpterCard = dragAndDrop.getPosition(cpterCard);

        cpterCard.style.position = 'fixed';

        cpterCard.animate([{
            top: positionCpterCard.top+'px',
            left: positionCpterCard.left+'px'
        },
        {
            top: positionPlayerCard.top+'px',
            left: positionPlayerCard.left+'px'
        }
    ], {
        duration: 1000,
    });

    setTimeout(function(){ 
    cpterCard.removeAttribute('style');
    animation.blink(cpterCard, playerCard);
    }, 1000);
    },

    cpterAddBooster: function(booster, monster) {

        // Select monster card on board
        let domMonsterCard = document.querySelector(`div[data-key="${monster.key}"]`);

        // Select monster card on board
        let domBoosterCard = document.querySelector(`div[data-key="${booster.key}"]`);

        animation.blink(domBoosterCard, domMonsterCard);
    }

}

module.exports = animation;