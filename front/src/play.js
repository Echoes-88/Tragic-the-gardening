const utils = require('./utils');
const cardGenerator = require('./cardGenerator');
const dragAndDrop = require('./dragAndDrop');

const play = {

    state: {
        amountPlayerCardsOnBoard: 0,
        // cpterCardsOnBoard: 0,
        playerRound: true,
        endRoundReady: false,
        userDeck: null,
        cpterDeck: null,
        // playerDeckInHand: null,
        playerCardsOnboard: [],
        cpterCardInHand: [],
        cpterCardsOnBoard: [],
        round: 0,
        },
  

    launchGame: async function(playerDeck) {

        // CHANGE FLEX DIRECTION
        const container = document.querySelector('.container');
        container.style.flexDirection = 'row';

        // CLEAR DISPLAY
        utils.clearEverything();

        utils.createBoardGame();

        cpterDeck = await cardGenerator.cpterDeck();

        // Add a key to each card for identification
        let inc = 0;
        for(const card of cpterDeck.monsters) {
            card.key = inc++;
        }

        for(const card of cpterDeck.boosters) {
            card.key = inc++;
        }

        // inc = 0;
        for(const card of playerDeck.monsters) {
            card.key = inc++;
        }

        for(const card of playerDeck.boosters) {
            card.key = inc++;
        }
        console.log(playerDeck)
        // State to handle real card stats
        play.state.userDeck = playerDeck;
        play.state.cpterDeck = cpterDeck;

        // Deep copy of cpter cards to handle visual cards
        play.state.cpterCardInHand = JSON.parse(JSON.stringify(cpterDeck));
        
        // GENERATE PLAYER CARDS ON BOARD
        const playerCardsContainer = document.querySelector(`div[user="player"]`);

        for(const card of playerDeck.monsters) {
            const cardGenerate = cardGenerator.cardGenerator(card, 'monster', 'player');
            playerCardsContainer.appendChild(cardGenerate);
        }

        for(const card of playerDeck.boosters) {
            const cardGenerate = cardGenerator.cardGenerator(card, 'booster', 'player');
            playerCardsContainer.appendChild(cardGenerate);
        }

        play.game();
    },

    game: function() {

        const cancel = document.querySelector('.cancel')
        if(cancel){
            cancel.remove();
        }

        console.log('round: ', play.state.round);
        console.log('playerCardsOnboard: ', play.state.playerCardsOnboard);
        console.log('cpterCardsOnBoard: ', play.state.cpterCardsOnBoard);
        const infosField = document.querySelector('.infosField');

        if(play.state.playerRound) {
            play.state.round++;
            infosField.innerHTML = 'A vous de jouer !';
            play.playerRound();

        } else {
            infosField.innerHTML = 'L\'ordinateur joue!';
            play.cpterRound();
        }

    },

    cpterRound: function() {

        play.state.amountPlayerCardsOnBoard += 1;
        play.state.playerRound = false;

        // IF COMPUTER PUT A CARD ON BOARD
        const round = play.state.round;
        if((round == 1 || round == 3 || round == 6 || round == 7 || round == 10 || round == 11 || round == 13) && ((play.state.cpterCardInHand.monsters.length > 0) || (play.state.cpterCardInHand.boosters.length > 0))) {


            // Getting 1 random card in cpter deck
            const cpterCardInHand = play.state.cpterCardInHand.monsters;
            const cpterCardsOnBoard = play.state.cpterCardsOnBoard;

            if(cpterCardInHand.length > 0) {

                let monster = [cpterCardInHand[Math.floor(Math.random()*cpterCardInHand.length)]];

                // Generating card on board
                const cpterCardsContainer = document.querySelector(`div[user="cpter"]`);
                const cpterCardGenerate = cardGenerator.cardGenerator(monster[0], 'monster', 'cpter')
                cpterCardsContainer.appendChild(cpterCardGenerate);

                // Find index of selected card
                let indexMonster = null;
    
                for(var i = 0; i < cpterCardInHand.length; i++) {
                    if(cpterCardInHand[i].id === monster[0].id) {
                        indexMonster = i;
                    }
                }
                // remove from state cardInHand and add cardOnBoard
                cpterCardInHand.splice(indexMonster, 1);
                cpterCardsOnBoard.push(monster)
                play.state.playerRound = true;
                play.game();
            }

        } else {

        // IF COMPUTER PLAY A CARD

            // Choose one random computer card on state
            const cpterCardsOnBoard = play.state.cpterCardsOnBoard;
            let randomCpterCard = cpterCardsOnBoard[Math.floor(Math.random()*cpterCardsOnBoard.length)];
            // same on board
            const cpterCard = document.querySelector(`div[data-key="${randomCpterCard[0].key}"]`);

            // Choose one random player card on state
            const playerCardsOnboard = play.state.playerCardsOnboard;
            let randomPlayerCard = playerCardsOnboard[Math.floor(Math.random()*playerCardsOnboard.length)];

            // same on board
            const key = randomPlayerCard.getAttribute('data-key');
            const playerCard = document.querySelector(`div[data-key="${key}"]`);
            console.log(playerCard)
            // Launch cpter move
            play.fightMoveCpter(cpterCard, playerCard);

        }

    },

    fightMoveCpter: function(cpterCard, playerCard) {


        const positionPlayerCard = utils.getPosition(playerCard);
        const positionCpterCard = utils.getPosition(cpterCard);


        // console.log('playerCard', positionPlayerCard.top, positionPlayerCard.left);

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
        play.fight(cpterCard, playerCard, 'cpterCardsOnBoard', 'playerCardsOnBoard')
        cpterCard.style.position = 'relative';
        }, 1000);


    },

    fight: function(attacker, defenser, attackerBoard, defenserBoard) {
        console.log(attacker.getAttribute('data-player'))
        const boardArea = document.querySelector('.boardArea');
        const fightArea = document.createElement('div');
        fightArea.classList.add('fightArea');

        // cogwheel 
        const cogWheel = document.createElement('div');
        cogWheel.classList.add('cogwheel')
        cogWheel.classList.add('rotate')
        cogWheel.textContent = '⚙'

        // Components in DOM
        boardArea.appendChild(fightArea);
        boardArea.appendChild(cogWheel);


        // Algorithm

            // find card in the state to avoid false value write by user in dom
            const attackerKey = attacker.getAttribute('data-key');
            const defenserKey = defenser.getAttribute('data-key');

            const attackerName = attacker.getAttribute('data-player');
            const defenserName = defenser.getAttribute('data-player');
            console.log('key attack', attackerKey, 'key defense', defenserKey, 'attacker name', attackerName, 'defenser name', defenserName);
            // console.log('state cards computer', play.state.cpterDeck);
            // console.log('state cards user', play.state.userDeck);
            const attackerCards = play.state[attackerName];

            const attackerCard = attackerCards.monsters.find(element => element.key == attackerKey);
    
            const defenserCards = play.state[defenserName];

            const defenserCard = defenserCards.monsters.find(element => element.key == defenserKey);

            const coefficient = attackerCard.attack - defenserCard.defense;

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

            attackerCard.hit_point = attackerCard.hit_point - damageToAttacker;
            defenserCard.hit_point = defenserCard.hit_point - damageToDefenser;


        // Animation

        attacker.classList.add('blink_me');
        defenser.classList.add('blink_me');
        setTimeout(function(){ 
            attacker.classList.remove('blink_me');
            defenser.classList.remove('blink_me');

            attacker.classList.add('shake');
            defenser.classList.add('shake');
            fightArea.remove();
            cogWheel.remove();

            attacker.querySelector('.hitpoint').textContent = attackerCard.hit_point;
            defenser.querySelector('.hitpoint').textContent = defenserCard.hit_point;

            setTimeout(function(){ 

            // IF HIT-POINTS ARE NEGATIVES, DELETE CARD FROM BOARD
            if(attackerCard.hit_point <= 0) {
                // delete card on board
                attacker.remove();
                // delete card in state
                attackerCards.monsters.splice(attackerCard.key, 1);
                // delete carOnBoard
                play.state[attackerBoard].splice(attackerCard.key, 1);
            }
            
            if(defenserCard.hit_point <= 0) {
                // delete card on board
                defenser.remove();
                // delete card in state
                defenserCards.monsters.splice(defenserCard.key, 1);
                // delete carOnBoard
                play.state[defenserBoard].splice(defenserCard.key, 1);

            }

            // FAIRE UN TOGGLE SUR PLAYERROUND : AMELIORER !!!!
            if(play.state.playerRound === true) { play.state.playerRound = false} else {play.state.playerRound = true};
            console.log('state apres un combat', play.state.playerRound);
            attacker.classList.remove('shake');
            defenser.classList.remove('shake');
            play.game();
            }, 1000);
        }, 2000);


        // => return value puis dans game modifier la valeur hit point de la carte qui défend.



    },

    // ============= //
    // DRAG AND DROP //
    // ============= //


    playerRound: function() {

        const infosField = document.querySelector('.infosField');
        infosField.innerHTML = 'Posez une carte sur le plateau ou attaquez une carte ennemie';
    
    
        const cards = document.getElementsByClassName('playerCard');
    
        for (const card of cards) {
            dragAndDrop.init(card);
            
            card.addEventListener('dragend', function () {
    
            var x = event.clientX, y = event.clientY,
            elementMouseIsOver = document.elementFromPoint(x, y);
    

            // Handle where user can drop cards
            if((elementMouseIsOver.className === 'sideArea') || (elementMouseIsOver.className === 'cpterCards') || (elementMouseIsOver.className === 'playerCard')) {
                alert('pas ici malheureux !')
            } else {

                // player put card on board
                if((elementMouseIsOver.className === 'drop-area') || (elementMouseIsOver.className === 'playerCards')) {
                    elementMouseIsOver.appendChild(card);

                    // card.setAttribute('data-status', 'onBoard');

                    play.state.currentPlayedCard = card;
                    console.log(card)

                    // Cancel action
                    const cancel = document.createElement('button');
                    cancel.classList.add('cancel')
                    cancel.textContent = 'CANCEL'

                    document.querySelector('.sideArea').appendChild(cancel);
                    cancel.addEventListener("click", function() {
                        card.remove();
                        cancel.remove();
                        document.querySelector('.playerCards').appendChild(card);

                        const cardsOnHand = document.querySelector('.playerCards').childNodes;
                        console.log(cardsOnHand)
        
                        for(const card of cardsOnHand) {
                            card.draggable = true;
                        }

                        const infosField = document.querySelector('.infosField');
                        infosField.innerHTML = 'Posez une carte sur le plateau ou attaquez une carte ennemie';
                    })

                    const infosField = document.querySelector('.infosField');
                    infosField.innerHTML = '';
    
                    const endOfRoundButton = document.querySelector('.endOfRound');
  
                        infosField.textContent = 'Cliquez sur "end of round" pour valider votre carte';
                        endOfRoundButton.classList.remove('inactive');
        
                        // SELECT ALL PLAYER CARDS AND DISABLE DRAGGABLE
                        // const playerCards = document.querySelector('.playerCards').childNodes;
                        const playerCards = document.querySelectorAll(`div[data-player="userDeck"]`);

                        for(const card of playerCards) {
                            card.draggable = false;
                        }
 
                        const handleEndOfRound = () => {
                            endOfRoundButton.classList.add('inactive');
                            endOfRoundButton.removeEventListener("click", handleEndOfRound);
                            play.state.playerCardsOnboard.push(card);
                            play.state.playerRound = false;
                            play.game()
                        }

                        endOfRoundButton.addEventListener('click', handleEndOfRound);

                // player attack
                } else if((elementMouseIsOver.parentNode.dataset.player === 'cpterDeck') || (elementMouseIsOver.className === 'card-picture cpter'))  {
                    const cpterCard = elementMouseIsOver.closest('.cardComponent');
                    console.log('il attaque')
                    if(card.classList.contains("booster")) {
                        alert('vous ne pouvez pas combattre avec une carte booster')
                    } else {
                        play.fight(card, cpterCard, 'playerCardsOnBoard', 'cpterCardsOnBoard');
                    }

                }

            }
    
        });
    
        }
    },
 
    
        listenDrop: function() {

        },


}

module.exports = play;