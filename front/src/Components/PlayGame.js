const Store = require('../Store');

// Render
const DomRenderBoardGame= require('../DomRender/BoardGame');
const DomRenderTutorial = require('../DomRender/Tutorial');
const DomRenderCard= require('../DomRender/Card');

// Middleware
const MiddlewareDeck = require('../Middleware/Deck');

// Utils
const dragAndDrop = require('../Utils/DragAndDrop');
const animation = require('../Utils/Animation');

let round = 0;

let userDeck = {
    monsters: [],
    boosters: [],
};

let cpterDeck = {
    monsters: [],
    boosters: [],
};

const PlayGame = {

    init: async(deckId) => {

        // Create deck for computer
        MiddlewareDeck.cpterDeck();

        // Tutorial
        const mainContainer = document.querySelector('.container');
        mainContainer.innerHTML = DomRenderTutorial.card();

        const close = document.querySelector(".close-button");
        close.addEventListener('click', function() {
            event.preventDefault();
            mainContainer.innerHTML = DomRenderBoardGame.render();

            const dropArea = document.querySelector('.drop-area');
            dropArea.classList.add('show-message');
            dropArea.innerHTML = `<p>DRAG AND DROP YOUR CARD HERE</p>`;

            // Render cards in DOM & add deck in store
            let deck = Store.user.decks.find(deck => deck.id == deckId);

            const playerArea = document.querySelector('.playerCards');

            let inc = 0;

            deck.monsters.map(card => {
                for(let i=0;i<card.recurrence.quantity;i++) {
                    userDeck.monsters.push(card);
                }
            })

            // Deep copy to avoid duplicate key
            userDeck.monsters = JSON.parse(JSON.stringify(userDeck.monsters));

            userDeck.monsters.map(card => {
                card.key = inc++; 
                card.onBoard = false; 
                card.type = 'monster'; 
                card.owner = 'user';
                playerArea.innerHTML += DomRenderCard.monster(card, "user");
            });

            deck.boosters.map(card => {
                for(let i=0;i<card.recurrence.quantity;i++) {
                    userDeck.boosters.push(card);
                }
            })

            // Deep copy to avoid duplicate key
            userDeck.boosters = JSON.parse(JSON.stringify(userDeck.boosters));

            userDeck.boosters.map(card => {
                card.key = inc++; 
                card.onBoard = false; 
                card.type = 'booster'; 
                card.owner = 'user';   
                playerArea.innerHTML += DomRenderCard.booster(card, "user")
            });

            // Save cpter Deck  
            cpterDeck = Store.cpter.deck
            cpterDeck.monsters.forEach(card => {card.key = inc++; card.onBoard = false; card.type = 'monster'; card.owner = 'cpter'});
            cpterDeck.boosters.forEach(card => {card.key = inc++; card.onBoard = false; card.type = 'booster'; card.owner = 'cpter'});

         
            // launch game
            PlayGame.userRound();
            console.log(userDeck.monsters)
        })
    },


    userRound: function() {

        round++;

        // Display informations to user
        const infosField = document.querySelector('.infosField');

        if(round === 1) {
            infosField.innerHTML = `Welcome ! <br><br> Please drag and drop your first card on the board.`;
        } else {
            infosField.innerHTML = 'Add a card on the board or play a card from the board to attack computer';
        }

        // Handle cards
        const userCardsDom = document.getElementsByClassName('userCard');
    
        for (const userCardDom of userCardsDom) {

            // Initialisation of drag and drop
            dragAndDrop.init(userCardDom);

            // Listening drop
            userCardDom.addEventListener('dragend', function () {

                var x = event.clientX, y = event.clientY,
                eltFlewOver = document.elementFromPoint(x, y);


                if(userCardDom.classList.contains("booster")) {

                    if(eltFlewOver.classList.contains("user")) {

                        // Detect monster card selected
                        const monsterCardDom = eltFlewOver.closest('.cardComponent');
                        console.log('il veut poser la carte booster sur', monsterCardDom)

                        // Get booster informations
                        const cardKeyBooster = userCardDom.getAttribute('data-key');
                        const booster = userDeck.boosters.find(booster => booster.key == cardKeyBooster);

                        // Get monster informations
                        const cardKeyMonster = monsterCardDom.getAttribute('data-key');
                        const monster = userDeck.monsters.find(monster => monster.key == cardKeyMonster);

                        // Detect type of booster
                        const typeBooster = booster.special_effect_text;

                        const bonus = booster.special_effect_value + monster[typeBooster];

                        // update monster card value in dom
                        let textBonus = monsterCardDom.querySelector(`.${typeBooster}`);
                        textBonus.textContent = bonus;
        
                        // update monster card value
                        // let monsterInDeck = cpterDeck.monster.find(card => card.key = monsterCard.key)
                        monster[typeBooster] = bonus;
        
                        userCardDom.remove();

                        console.log(booster)
                    }

                } else {

                // player put card on board
                if ((eltFlewOver.className === 'drop-area') || (eltFlewOver.className === 'drop-area show-message')) {

                    
                    if(round == 1) {
                    eltFlewOver.className = 'drop-area';
                    eltFlewOver.innerHTML = '';
                    }

                    eltFlewOver.appendChild(userCardDom);

                    // Disable draggable
                    const playerCards = document.querySelectorAll('.userCard');

                    for(const card of playerCards) { card.draggable = false; }

                    // Display message
                    const infosField = document.querySelector('.infosField');
                    infosField.textContent = 'Click "end of round" or "cancel"';
                    endOfRoundButton = document.querySelector('.endOfRound');
                    endOfRoundButton.classList.remove('inactive');

                    // Cancel action
                    const cancel = document.createElement('button');
                    cancel.classList.add('cancel')
                    cancel.textContent = 'CANCEL'

                    document.querySelector('.sideArea').appendChild(cancel);

                    cancel.addEventListener("click", function() {
                        userCardDom.remove();
                        cancel.remove();
                        document.querySelector('.playerCards').appendChild(userCardDom);

                        // reset draggable
                        const cardsOnHand = document.querySelector('.playerCards').childNodes;
                        for(const card of cardsOnHand) { card.draggable = true; }

                        const infosField = document.querySelector('.infosField');
                        infosField.innerHTML = 'Add a card on the board or play a card from the board to attack computer';
                    })

                    // Handle end of round
                    const handleEndOfRound = () => {
                        endOfRoundButton.classList.add('inactive');
                        endOfRoundButton.removeEventListener("click", handleEndOfRound);
                        
                        // Find card in state to set onBoard = true
                        const cardKey = userCardDom.getAttribute('data-key');
                        const cardInState = userDeck.monsters.find(monster => monster.key == cardKey);
                        console.log("key", cardKey, "state", userDeck)
                        cardInState.onBoard = true;

                        document.querySelector('.cancel').remove();

                        PlayGame.cpterRound();
                    }

                        endOfRoundButton.addEventListener('click', handleEndOfRound);
                    
                } else if ((eltFlewOver.parentNode.className === 'cpterCards') || (eltFlewOver.className === 'card-picture cpter'))  {
                    
                    // Player attack a computer card
                    const cpterCardDom = eltFlewOver.closest('.cardComponent');

                    if(userCardDom.classList.contains("booster")) {
                        alert('You can\'t attack with a booster');
                    } else {

                        // Select user and player cards in state
                        let cardAttack = userDeck.monsters.find(card => card.key == userCardDom.getAttribute('data-key'))
                        let cardDefense = cpterDeck.monsters.find(card => card.key == cpterCardDom.getAttribute('data-key'))

                        PlayGame.fight(cardAttack, cardDefense);
                    }
                }
                
                }
            });
        }
    },

    cpterRound: function() {

        // console.log('cpter round / user Cards :', userDeck)
        // console.log('cpter round / cpter Cards :', cpterDeck)
        
        if(cpterDeck.monsters.length == 0) {
            console.log("YOU WIN !!")
        }

        let cards = cpterDeck.monsters.concat(cpterDeck.boosters);
        let cardsOnBoard = cards.filter(card => card.onBoard);
        let cardsOnHand = cards.filter(card => !card.onBoard);

         if((round == 2 || round == 4 || round == 5 || round == 8 || round == 9 || round == 12 || round > 13) && (cardsOnBoard.length > 0)) {

            PlayGame.cpterAttack(cardsOnBoard, cardsOnHand);

         } else {

            // If round 1, add a monster on board
            if(round == 1) {
                const infosField = document.querySelector('.infosField');
                infosField.textContent = "...Computer is playing..."

                setTimeout(function(){ 

                // Get random monster
                let cardFirstRound = cpterDeck.monsters[Math.floor(Math.random()*cpterDeck.monsters.length)];

                // Generating card on board
                const cardsContainer = document.querySelector('.cpterCards');
                cardsContainer.innerHTML += DomRenderCard.monster(cardFirstRound, 'cpter')

                // Update status cardOnboard = true
                cpterDeck.monsters.forEach((monster, index) => {
                    if(monster.key === cardFirstRound.key) {
                        cpterDeck.monsters[index].onBoard = true;
                    }
                });

                PlayGame.userRound();
                }, 1500);

            // Else if, get random card
            } else if(cards.length > 0) {

                PlayGame.cpterAddCard(cardsOnBoard, cardsOnHand);

            } else {
                PlayGame.cpterAttack(cardsOnBoard, cardsOnHand);
            }
         }

    },


    fight: function(cardAttack, cardDefense) {

        console.log("carte attaque : ", cardAttack)
        console.log("carte defense : ", cardDefense)
        // Algorithm for damage

        const coefficient = cardAttack.attack - cardDefense.defense;

        let damageToDefenser = null;
        if(coefficient <= 0) {
            damageToDefenser = Math.floor(Math.random()*2)+1;
        } else {
            damageToDefenser = Math.floor(Math.random()*3)+coefficient;
        }

        let damageToAttacker = null;
        if(damageToDefenser == 1) {
            damageToAttacker = 0;
        } else {
            damageToAttacker = damageToDefenser - 1;
        }

        const initialAttackHp = cardAttack.hit_point;
        const initialDefenseHp = cardDefense.hit_point;

        cardAttack.hit_point = cardAttack.hit_point - damageToAttacker;
        cardDefense.hit_point = cardDefense.hit_point - damageToDefenser;

        // Getting cards in dom
        const cardAttackDom = document.querySelector(`div[data-key="${cardAttack.key}"]`);
        const cardDefenseDom = document.querySelector(`div[data-key="${cardDefense.key}"]`);

        // Animation
        if(cardAttack.owner === 'cpter') {
            animation.moveCards(cardAttackDom, cardDefenseDom)
        } else {
            animation.blink(cardAttackDom, cardDefenseDom)
        }


        setTimeout(function(){ 

            // Update values in dom
            if(cardAttack.hit_point != initialAttackHp) {
                let attackerHp = cardAttackDom.querySelector('.hit_point');
                attackerHp.textContent = cardAttack.hit_point;

                attackerHp.classList.add('blink_hit-point');
                setTimeout(function(){ 
                    attackerHp.classList.remove('blink_hit-point');
                }, 1000);
            }

            if(cardDefense.hit_point != initialDefenseHp) {
                let defenserHp = cardDefenseDom.querySelector('.hit_point');
                defenserHp.textContent = cardDefense.hit_point;

                defenserHp.classList.add('blink_hit-point');
                setTimeout(function(){ 
                    defenserHp.classList.remove('blink_hit-point');
                }, 1000);
            }

            // Handle fight result
            if(cardAttack.hit_point <= 0) {
                setTimeout(function(){ 
                // delete card on board
                cardAttackDom.remove();
                // delete card in state
                if(cardAttack.owner === 'cpter') {
                    let index = cpterDeck.monsters.indexOf(cardAttack);
                    cpterDeck.monsters.splice(index, 1);

                } else {
                    let index = userDeck.monsters.indexOf(cardAttack);
                    userDeck.monsters.splice(index, 1);
                }

                }, 1000);
            }

            if(cardDefense.hit_point <= 0) {
                setTimeout(function(){ 
                // delete card on board
                cardDefenseDom.remove();
                // delete card in state
                if(cardDefense.owner === 'cpter') {
                    let index = cpterDeck.monsters.indexOf(cardDefense);
                    cpterDeck.monsters.splice(index, 1);

                } else {
                    let index = userDeck.monsters.indexOf(cardDefense);
                    userDeck.monsters.splice(index, 1);
                }
                }, 1000);
            }

            // TOGGLE PLAYER ROUND
            if(cardAttack.owner === 'cpter') {
                PlayGame.userRound() ;
            } else {
                setTimeout(function(){ 
                    PlayGame.cpterRound();
                }, 1000);
            }
            }, 3000);

    },

    cpterAddCard: function(cardsOnBoard, cardsOnHand) {

        let card = null;
                
        // if there is a card on board, get random on monster & booster. Else get random monster
        if(cardsOnBoard.length > 0) {
            card = cardsOnHand[Math.floor(Math.random()*cardsOnHand.length)];
        } else {
            let cardsMonster = cardsOnHand.filter(card => card.type === 'monster');
            card = cardsMonster[Math.floor(Math.random()*cardsMonster.length)];
        }

        console.log("cpter want to add :", card)

        // Handle booster cards
        if(card.type === 'booster') {

            // Get random monster card from board to apply boost
            const monsterCards= cpterDeck.monsters.filter(card => card.onBoard == true);
            let monsterCard = monsterCards[Math.floor(Math.random()*monsterCards.length)];

            // Generating booster card on board
            const cardsContainer = document.querySelector('.cpterCards');
            cardsContainer.innerHTML += DomRenderCard.booster(card, 'cpter')


            // Select monster card on board
            let cardMonsterDom = document.querySelector(`div[data-key="${monsterCard.key}"]`);
            let cardBoosterDom = document.querySelector(`div[data-key="${card.key}"]`);

            animation.moveCards(cardBoosterDom, cardMonsterDom);

            setTimeout(function(){ 

                const typeBooster = card.special_effect_text;
                console.log('type de booster', typeBooster)
                const bonus = card.special_effect_value + monsterCard[typeBooster];
                console.log('bonus', bonus)
                // update monster card value in dom
                let textBonus = cardMonsterDom.querySelector(`.${typeBooster}`);
                textBonus.textContent = bonus;

                // update monster card value
                // let monsterInDeck = cpterDeck.monster.find(card => card.key = monsterCard.key)
                monsterCard[typeBooster] = bonus;

                cardBoosterDom.remove();

                // Delete card in state
                let index = cpterDeck.boosters.indexOf(card);
                cpterDeck.boosters.splice(index, 1);

                PlayGame.userRound();
                }, 2000);

        } else {

            // Computer add a card on board
            const cardsContainer = document.querySelector('.cpterCards');
            cardsContainer.innerHTML += DomRenderCard.monster(card, 'cpter')


            // Update status cardOnboard = true
            cpterDeck.monsters.forEach((monster, index) => {
                if(monster.key === card.key) {
                    cpterDeck.monsters[index].onBoard = true;
                }
            });

            PlayGame.userRound();
        }
    },

    cpterAttack: function(cardsOnBoard, cardsOnHand) {
        
        const infosField = document.querySelector('.infosField');
        infosField.textContent = "...Computer is playing..."

        // Getting computer cards on board and select one
        let cardAttack = cardsOnBoard[Math.floor(Math.random()*cardsOnBoard.length)];

        // Getting user cards on board and select one
        const userCards = userDeck.monsters.filter(card => card.onBoard == true);
        let cardDefense = userCards[Math.floor(Math.random()*userCards.length)];

        // Select each card in dom
        let cardAttackDom = document.querySelector(`div[data-key="${cardAttack.key}"]`);
        let cardDefenseDom = document.querySelector(`div[data-key="${cardDefense.key}"]`);

        setTimeout(function(){ 
            animation.moveCards(cardAttackDom, cardDefenseDom)
            PlayGame.fight(cardAttack, cardDefense)
        }, 1000);

    }
}

module.exports = PlayGame;