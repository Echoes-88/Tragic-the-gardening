const utils = require('./utils');
const cardGenerator = require('./cardGenerator');
const dragAndDrop = require('./dragAndDrop');
const animation = require('./animation');




// Regular variable used for dom selection
let infosField = null;
let endOfRoundButton = null;
// Game

let round = 0;

let userDeck = {
    monsters: [],
    boosters: [],
};

let cpterDeck = {
    monsters: [],
    boosters: [],
};

const play = {

    launchGame: async function(userDeckDatas) {

        // Change flex direction
        const container = document.querySelector('.container');
        container.style.flexDirection = 'row';

        // Clear display and create board
        utils.clearEverything();

        // Show exemple card
        const body = document.querySelector('body');
        const blackFilter = document.createElement('div');
        const exempleCard = document.createElement('div');
        const close = document.createElement('button');
        close.textContent = 'close';

        blackFilter.classList.add('black-filter');
        exempleCard.classList.add('exemple-card');
        close.classList.add('close-button');

        body.insertBefore(blackFilter, body.firstChild);
        container.appendChild(close)
        container.appendChild(exempleCard)
        close.addEventListener('click', function() {
            blackFilter.remove();
            exempleCard.remove();
            close.remove();
        })

        // Create board game and assign frequent called dom elements
        utils.createBoardGame();
        infosField = document.querySelector('.infosField');
        endOfRoundButton = document.querySelector('.endOfRound');

        // Show user board area
        const userBoard = document.querySelector('.drop-area');
        userBoard.classList.add('show');
        const userBoardMessage = document.createElement('p');
        userBoardMessage.textContent = "DRAG AND DROP YOUR CARD HERE";
        userBoard.appendChild(userBoardMessage);

        // Generating a deck for computer
        const cpterDeckDatas = await cardGenerator.cpterDeck();

        // Deep copy to avoid duplicate keys
        const deepCopyUser = JSON.parse(JSON.stringify(userDeckDatas));
        const deepCopyCpter = JSON.parse(JSON.stringify(cpterDeckDatas));

        // Assign decks for each player

        userDeck.monsters = deepCopyUser.monsters;
        userDeck.boosters = deepCopyUser.boosters;

        cpterDeck.monsters = deepCopyCpter.monsters;
        cpterDeck.boosters = deepCopyCpter.boosters;


        // Generating unique key, status and type for each card
        let inc = 0;
        userDeck.monsters.forEach(card => {card.key = inc++; card.onBoard = false; card.type = 'monster'; card.owner = 'user'});
        userDeck.boosters.forEach(card => {card.key = inc++; card.onBoard = false; card.type = 'booster'; card.owner = 'user'});

        // inc = 0;
        cpterDeck.monsters.forEach(card => {card.key = inc++; card.onBoard = false; card.type = 'monster'; card.owner = 'cpter'});

        cpterDeck.boosters.forEach(card => {card.key = inc++; card.onBoard = false; card.type = 'booster'; card.owner = 'cpter'});

        // Generating player cards on board
        const cardsContainer = document.querySelector(`div[player="user"]`);

        userDeck.monsters.map((card) => {
            const monsterCard = cardGenerator.card(card, 'monster', 'user');
            cardsContainer.appendChild(monsterCard);
        });

        userDeck.boosters.map((card) => {
            const boosterCard = cardGenerator.card(card, 'booster', 'user');
            cardsContainer.appendChild(boosterCard);
        });

        // Ready to play
        play.userRound();
    },

    userRound: function() {

        round++;

        // Display informations to user
        if(round === 1) {
            infosField.innerHTML = `Welcome ! <br><br> Please drag and drop your first card on the board.`;
        } else {
            infosField.innerHTML = 'Add a card on the board or play a card from the board to attack computer';
        }

        // Handle cards
        const userCardsDom = document.getElementsByClassName('playerCard');
    
        for (const userCardDom of userCardsDom) {

            // Initialisation of drag and drop
            dragAndDrop.init(userCardDom);

            // Listening drop
            userCardDom.addEventListener('dragend', function () {

                var x = event.clientX, y = event.clientY,
                eltFlewOver = document.elementFromPoint(x, y);

                // player put card on board
                if ((eltFlewOver.className === 'drop-area') || (eltFlewOver.className === 'drop-area show')) {
                    
                    if(round == 1) {
                    eltFlewOver.className = 'drop-area';
                    eltFlewOver.innerHTML = '';
                    }
                    eltFlewOver.appendChild(userCardDom);

                    // Disable draggable
                    const playerCards = document.querySelectorAll(`div[data-player="userDeck"]`);

                    for(const card of playerCards) { card.draggable = false; }

                    // Display message
                    infosField.textContent = 'Click "end of round" or "cancel"';
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

                        cardInState.onBoard = true;

                        document.querySelector('.cancel').remove();

                        play.cpterRound();
                    }

                        endOfRoundButton.addEventListener('click', handleEndOfRound);

                } else if ((eltFlewOver.parentNode.dataset.player === 'cpterDeck') || (eltFlewOver.className === 'card-picture cpter'))  {
                    
                    // Player attack a computer card
                    const cpterCardDom = eltFlewOver.closest('.cardComponent');

                    if(userCardDom.classList.contains("booster")) {
                        alert('You can\'t attack with a booster');
                    } else {

                        // Select user and player cards in state
                        let cardAttack = userDeck.monsters.find(card => card.key == userCardDom.getAttribute('data-key'))
                        let cardDefense = cpterDeck.monsters.find(card => card.key == cpterCardDom.getAttribute('data-key'))

                        play.fight(cardAttack, cardDefense);
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

            play.cpterAttack(cardsOnBoard, cardsOnHand);

         } else {

            // If round 1, add a monster on board
            if(round == 1) {

                infosField.textContent = "...Computer is playing..."

                setTimeout(function(){ 

                // Get random monster
                let cardFirstRound = cpterDeck.monsters[Math.floor(Math.random()*cpterDeck.monsters.length)];

                // Generating card on board
                const cardsContainer = document.querySelector(`div[player="cpter"]`);
                const domCard = cardGenerator.card(cardFirstRound, 'monster', 'cpter')
                cardsContainer.appendChild(domCard);

                // Update status cardOnboard = true
                cpterDeck.monsters.forEach((monster, index) => {
                    if(monster.key === cardFirstRound.key) {
                        cpterDeck.monsters[index].onBoard = true;
                    }
                });

                play.userRound();
                }, 1500);

            // Else if, get random card
            } else if(cards.length > 0) {

                play.cpterAddCard(cardsOnBoard, cardsOnHand);

            } else {
                play.cpterAttack(cardsOnBoard, cardsOnHand);
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
                let attackerHp = cardAttackDom.querySelector('.hitpoint');
                attackerHp.textContent = cardAttack.hit_point;

                attackerHp.classList.add('blink_hit-point');
                setTimeout(function(){ 
                    attackerHp.classList.remove('blink_hit-point');
                }, 1000);
            }

            if(cardDefense.hit_point != initialDefenseHp) {
                let defenserHp = cardDefenseDom.querySelector('.hitpoint');
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
                    console.log("la carte du cpter qui sera supprimée à l'index", index);
                    console.log("state cpter AVANT suppression", cpterDeck.monsters)
                    cpterDeck.monsters.splice(index, 1);
                    console.log("state cpter apres suppression", cpterDeck.monsters)
                } else {
                    let index = userDeck.monsters.indexOf(cardAttack);
                    console.log("la carte du user qui sera supprimée à l'index", index);
                    console.log("state user AVANT suppression", userDeck.monsters)
                    userDeck.monsters.splice(index, 1);
                    console.log("state user apres suppression", userDeck.monsters)
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
                    console.log("la carte du cpter qui sera supprimée à l'index", index);
                    console.log("state cpter AVANT suppression", cpterDeck.monsters)
                    cpterDeck.monsters.splice(index, 1);
                    console.log("state cpter apres suppression", cpterDeck.monsters)
                } else {
                    let index = userDeck.monsters.indexOf(cardDefense);
                    console.log("la carte du user qui sera supprimée à l'index", index);
                    console.log("state user AVANT suppression", userDeck.monsters)
                    userDeck.monsters.splice(index, 1);
                    console.log("state user apres suppression", userDeck.monsters)
                }
                }, 1000);
            }

            // TOGGLE PLAYER ROUND
            if(cardAttack.owner === 'cpter') {
                play.userRound() ;
            } else {
                setTimeout(function(){ 
                    play.cpterRound();
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
            const cardsContainer = document.querySelector(`div[player="cpter"]`);
            const cardBooster = cardGenerator.card(card, 'booster', 'cpter')
            cardsContainer.appendChild(cardBooster);

            // Select monster card on board
            let cardMonsterDom = document.querySelector(`div[data-key="${monsterCard.key}"]`);
            let cardBoosterDom = document.querySelector(`div[data-key="${card.key}"]`);

            console.log(cardBoosterDom, cardMonsterDom)
            animation.moveCards(cardBoosterDom, cardMonsterDom);

            setTimeout(function(){ 

                const typeBooster = card.special_effect_text;

                const bonus = card.special_effect_value + monsterCard[typeBooster];

                // update monster card value in dom
                let textBonus = document.getElementById(`${typeBooster}`);
                textBonus.textContent = bonus;

                // update monster card value
                // let monsterInDeck = cpterDeck.monster.find(card => card.key = monsterCard.key)
                monsterCard[typeBooster] = bonus;

                cardBoosterDom.remove();

                play.userRound();
                }, 2000);

        } else {

            // Computer add a card on board
            const cardsContainer = document.querySelector(`div[player="cpter"]`);
            const domCard = cardGenerator.card(card, 'monster', 'cpter')
            cardsContainer.appendChild(domCard);

            // Update status cardOnboard = true
            cpterDeck.monsters.forEach((monster, index) => {
                if(monster.key === card.key) {
                    cpterDeck.monsters[index].onBoard = true;
                }
            });

            play.userRound();
        }
    },

    cpterAttack: function(cardsOnBoard, cardsOnHand) {

        infosField.textContent = "...Computer is playing..."

        // Getting computer cards on board and select one
        let cardAttack = cardsOnBoard[Math.floor(Math.random()*cardsOnBoard.length)];

        // Getting user cards on board and select one
        const userCards = userDeck.monsters.filter(card => card.onBoard == true);
        let cardDefense = userCards[Math.floor(Math.random()*userCards.length)];

        // Select each card in dom
        let cardAttackDom = document.querySelector(`div[data-key="${cardAttack.key}"]`);
        let cardDefenseDom = document.querySelector(`div[data-key="${cardDefense.key}"]`);

        console.log("cpter want to attack with card in state :", cardAttack)
        console.log("cpter want to attack with card in dom :", cardAttackDom)

        console.log("user will be attack for his card in state :", cardDefense)
        console.log("user will be attack for his card in dom  :", cardDefenseDom)

        setTimeout(function(){ 
            animation.moveCards(cardAttackDom, cardDefenseDom)
            play.fight(cardAttack, cardDefense)
        }, 1000);

    }

}

module.exports = play;