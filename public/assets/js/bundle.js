(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
const utils = require('./utils');
const user = require('./user');
const game = require('./game');
// const dragAndDrop = require('./dragAndDrop');
var app = {

eventListener: function() {

    // SHOW LOGIN FORM
    const menuLogin = document.querySelector('li[set-menu="login"] a');      
    menuLogin.addEventListener('click', utils.showLoginForm);

    // LOGIN SUBMIT
    const loginForm = document.querySelector('form[id="login"]')
    loginForm.addEventListener('submit', user.handleLoginForm);

    // PLAY BUTTON
    const menuPlay = document.querySelector('li[set-menu="play"] a');
    menuPlay.addEventListener('click', game.play);

    // ACCOUNT BUTTON
    const menuAccount = document.querySelector('li[set-menu="account"] a');
    menuAccount.addEventListener('click', user.account);

    // SHOW CREATE ACCOUNT FORM
    const menuCreateAccount = document.querySelector('li[set-menu="createAccount"] a');
    menuCreateAccount.addEventListener('click', utils.showCreateAccountForm);

    // CREATE ACCOUNT SUBMIT
    const createAccountForm = document.querySelector('form[id="createAccount"]');
    createAccountForm.addEventListener('submit', user.handleCreateAccountForm);
    
},

init: function () {
    utils.clearEverything();
    utils.showMainMenu();
    app.eventListener();
    utils.reloadCss();
    // dragAndDrop.init();
},
};

document.addEventListener('DOMContentLoaded', app.init);
},{"./game":4,"./user":7,"./utils":8}],2:[function(require,module,exports){
const game = require('./game');
const utils = require('./utils');

var cardGenerator = {

    baseUrl: 'http://localhost:5000',

    deck: function(deckDatas) {

        // Creating div for the deck with deck picture, title and buttons (deck manager / play with deck)
        const deckContainer = document.createElement('div');
        deckContainer.classList.add('deck-container');
        const deckTitle = document.createElement('p');
        deckTitle.textContent = deckDatas.title;
        const deckImage = document.createElement('div');
        deckImage.classList.add('card-deck');

        const article = document.querySelector('article');

        deckContainer.setAttribute('set-id', deckDatas.id);

        article.appendChild(deckContainer);
        deckContainer.appendChild(deckTitle)
        deckContainer.appendChild(deckImage);

        const seeThisDeck = document.createElement('button');
        seeThisDeck.classList.add('see-deck');
        const playThisDeck = document.createElement('button');
        playThisDeck.classList.add('play-deck');
        seeThisDeck.textContent = 'Manage deck'
        playThisDeck.textContent = 'Play with this deck'

        deckContainer.appendChild(seeThisDeck)
        deckContainer.appendChild(playThisDeck);

    },

    getAllCards: async function() {

        const requestConfig = {
            method: 'GET'
        };

        const getMonsters = await fetch(`${cardGenerator.baseUrl}/crud/monster`, requestConfig);
        const monsters = await getMonsters.json();

        const getBoosters = await fetch(`${cardGenerator.baseUrl}/crud/booster`, requestConfig);
        const boosters = await getBoosters.json();

        const cards = {monsters: monsters, boosters: boosters};

        return cards;

    },

    firstUserDeck: async function(data) {

        event.preventDefault();

        const cards = await cardGenerator.getAllCards();

        const monsters = cards.monsters
        const boosters = cards.boosters

        // Init monster and booster arrays
        let monstersArray = [];
        let boostersArray = [];

        // Choosing 5 random monsters and adding in arrays
        for (var i = 0; i < 5; i++) {
            let monster = monsters[Math.floor(Math.random()*monsters.length)];
            monstersArray.push(monster.id)       
        }

        // Choosing 3 random booster and adding in arrays
        for (var i = 0; i < 3; i++) {
            let booster = boosters[Math.floor(Math.random()*boosters.length)];
            boostersArray.push(booster.id)       
        }

        const datasToSend = {id: data.target.id.value, title: data.target.title.value, monsters: monstersArray, boosters: boostersArray};

        var form_data = new FormData();

        for ( var key in datasToSend ) {
            form_data.append(key, datasToSend[key]);
        }

        const requestConfig = {
            method: 'POST',
            body: form_data
        };

        await fetch(`${cardGenerator.baseUrl}/crud/deck`, requestConfig);

    },

    cpterDeck: async function() {

        const cards = await cardGenerator.getAllCards();

        const monsters = cards.monsters
        const boosters = cards.boosters

        let monstersArray = [];
        let boostersArray = [];

        // Choosing 5 random monsters and adding in arrays
        for (var i = 0; i < 5; i++) {
            let monster = monsters[Math.floor(Math.random()*monsters.length)];
            monstersArray.push(monster)       
        }

        // Choosing 3 random booster and adding in arrays
        for (var i = 0; i < 3; i++) {
            let booster = boosters[Math.floor(Math.random()*boosters.length)];
            boostersArray.push(booster)       
        }


        const deck = {monsters: monstersArray, boosters: boostersArray};
        return deck;

    },

    cardGenerator: function(card, type, user) {

        var template = document.querySelector('#template-card');
        var clone = document.importNode(template.content, true);

        // ATTRIBUTE
        const container = clone.querySelector('.cardComponent');
        container.setAttribute('data-key', card.key);

        if(user != 'cpter') {
            container.classList.add('playerCard');
            container.setAttribute('data-player', 'userDeck');
            container.setAttribute("draggable", true);
            container.setAttribute('data-status', 'onHand');
        }

        if(user === 'cpter') {
            container.setAttribute('data-player', 'cpterDeck');
            clone.querySelector('.card-picture').classList.add('cpter');
        }

        // TITLE
        clone.querySelector('.card-name').textContent = card.title;

        // PICTURE
        clone.querySelector('.card-picture').src =  `./assets/img/${type}/${card.id}.png`;

        // STATISTICS & BACKGROUND
        if(type === 'monster') {
            clone.querySelector('.card-background').src =  `./assets/img/Monster.png`;

            clone.querySelector('.attack').textContent = card.attack;
            clone.querySelector('.defense').textContent = card.defense;
            clone.querySelector('.hitpoint').textContent = card.hit_point;
        } else {
            clone.querySelector('.card-background').src =  `./assets/img/Booster.png`;
            clone.querySelector('.boost').textContent = card.special_effect_value;
        }

        return clone;
    },

}


module.exports = cardGenerator;
},{"./game":4,"./utils":8}],3:[function(require,module,exports){

const dragAndDrop = {

    init: function(elt) {

    function Drag (subject) {
        var dative = this,
            handle,
            dragClickOffsetX,
            dragClickOffsetY,
            lastDragX,
            lastDragY;
    
        subject.draggable = true;
    
        dative.styleHandle(subject);
    
        subject.addEventListener('dragstart', function (e) {    
            handle = dative.makeHandle(subject);
    
            dragClickOffsetX = e.layerX;
            dragClickOffsetY = e.layerY;
    
            this.style.opacity = 0;
        });
    
        subject.addEventListener('drag', function (e) {
            var useX = e.x,
                useY = e.y;
    
            // Odd glitch
            if (useX === 0 && useY === 0) {
                useX = lastDragX;
                useY = lastDragY;
            }
    
            if (useX === lastDragX && useY === lastDragY) {
                return;
            }
    
            dative.translate(useX - dragClickOffsetX, useY - dragClickOffsetY, handle, subject);
    
            lastDragX = useX;
            lastDragY = useY;
        });
    
        subject.addEventListener('dragend', function (e) {
            this.style.opacity = 1;
    
            handle.parentNode.removeChild(handle);
        });
    };
    
    /**
     * Prevent the text contents of the handle element from being selected.
     */
    Drag.prototype.styleHandle = function (node) {
        node.style['userSelect'] = 'none';
    };
    
    /**
     * @param {HTMLElement} subject
     * @return {HTMLElement}
     */
    Drag.prototype.makeHandle = function (subject) {
        return this.makeClone(subject);
    };
    
    /**
     * Clone node.
     * 
     * @param {HTMLElement} node
     * @return {HTMLElement}
     */
    Drag.prototype.makeClone = function (node) {
        var clone;
    
        clone = node.cloneNode(true);
    
        this.styleClone(clone, node.offsetWidth, node.offsetHeight);
    
        node.parentNode.insertBefore(clone, node);
    
        return clone;
    };


            
    /**
     * Make clone width and height static.
     * Take clone out of the element flow.
     *
     * @param {HTMLElement} node
     * @param {Number} width
     * @param {Nubmer} height
     */
    Drag.prototype.styleClone = function (node, width, height) {
        node.style.position = 'fixed';
        node.style.zIndex = 9999;
        node.style.width = width + 'px';
        node.style.height = height + 'px';
        node.style.left = '-9999px';
    
        node.style.margin = 0;
        node.style.padding = 0;
    };
    
    /**
     * Used to position the handle element.
     * 
     * @param {Number} x
     * @param {Number} y
     * @param {HTMLElement} handle
     * @parma {HTMLElement} subject
     */
    Drag.prototype.translate = function (x, y, handle, subject) {
        handle.style.left = x + 'px';
        handle.style.top = y + 'px';
    };

    return new Drag(elt);

    },

};

module.exports = dragAndDrop;
},{}],4:[function(require,module,exports){
const utils = require('./utils');
const play = require('./play');
const cardGenerator = require('./cardGenerator');
const Store = require('./store');

const game = {

    baseUrl: 'http://localhost:5000',

    play: async function(event) {
        event.preventDefault();

        // CLEAR DISPLAY
        utils.clearEverything();

        const logo = document.querySelector('.logo')
        logo.classList.add('is-hidden');

        const container = document.querySelector('.container');
        container.style.justifyContent = 'center';

        // const article = document.querySelector('article');
        // if(article) { document.querySelector('article').innerHTML = ''; }
        
        // Creating main elements in dom
        const mainArea = document.querySelector('main');
        const article = document.createElement('article');
        mainArea.appendChild(article);

        // Checking if user has decks

        if(Store.user.decks) {

            for(const deck of Store.user.decks) {

                cardGenerator.deck(deck);

                const seeThisDeck = document.querySelector('.see-deck');
                const playThisDeck = document.querySelector('.play-deck');

                seeThisDeck.addEventListener('click', function(){ game.showDeck(deck);});
                playThisDeck.addEventListener('click', function(){ play.launchGame(deck)});
            }

        } else {
            
            // Generating a deck for new user

            const textNewDeck = document.createElement('p');
            textNewDeck.textContent = 'Create your first deck to play !'

            const form = document.createElement('form');
            form.classList.add('form');
            article.appendChild(textNewDeck);
            article.appendChild(form);

            const deckName = document.createElement('input');
            deckName.placeholder = 'name';
            deckName.name = 'title';
            form.appendChild(deckName);

            const userId = document.createElement('input');
            userId.name = 'id';
            userId.value = user.id;
            userId.style.display = 'none';
            form.appendChild(userId);

            const createDeckButton = document.createElement('button');
            createDeckButton.type = 'submit';
            createDeckButton.textContent = 'Create a deck';
            form.appendChild(createDeckButton);

            form.addEventListener('submit', cardGenerator.firstUserDeck);
        }

        // ADDING "BACK TO MAIN MENU"
        const backMenu = document.createElement('button');
        backMenu.classList.add('nav-button');
        backMenu.textContent = "GO BACK"
        mainArea.appendChild(backMenu);

        // EVENTLISTENER "BACK TO MAIN MENU"
        backMenu.addEventListener('click', utils.showLoggedMenu);

    },
    
    showDeck: function(deck) {

        // CLEAR DISPLAY
        utils.clearEverything();

        // SHOW ARTICLE AREA 
        const article = document.querySelector('article');
        article.innerHTML = '';
        article.classList.remove('is-hidden');

        const monsters = deck.monsters;
        const boosters = deck.boosters;

        for(const monster of monsters) {

            const monsterCard = document.createElement('div');
            monsterCard.classList.add('card');
            monsterCard.classList.add('monster');

            const monsterPicture = document.createElement('img');
            monsterPicture.classList.add('card-picture');
            monsterPicture.src =  `./assets/img/monsters/${monster.id}.jpg`

            const article = document.querySelector('article');
            article.classList.add('deckContainer')
            article.appendChild(monsterCard);
            monsterCard.appendChild(monsterPicture);
        }

        for(const booster of boosters) {

            const boosterCard = document.createElement('div');
            boosterCard.classList.add('card');
            boosterCard.classList.add('booster');

            const boosterPicture = document.createElement('img');
            boosterPicture.classList.add('card-picture');
            boosterPicture.src =  `./assets/img/boosters/${booster.id}.jpg`

            article.appendChild(boosterCard);
            boosterCard.appendChild(boosterPicture);
        }

        // "BACK TO CHOOSE DECK MENU"
        const backMenu = document.createElement('button');
        backMenu.classList.add('nav-button');
        backMenu.textContent = "GO BACK"
        article.appendChild(backMenu);

        // EVENTLISTENER "BACK TO CHOOSE DECK MENU"
        console.log(game)
        backMenu.addEventListener('click', game.play);
    },

}

module.exports = game;
},{"./cardGenerator":2,"./play":5,"./store":6,"./utils":8}],5:[function(require,module,exports){
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
},{"./cardGenerator":2,"./dragAndDrop":3,"./utils":8}],6:[function(require,module,exports){

let Store = {

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
},{}],7:[function(require,module,exports){
const utils = require('./utils');
const Store = require('./store');

const user = {

    baseUrl: 'http://localhost:5000',


    handleLoginForm: async function(data) {

        event.preventDefault();

        let dataForm = new FormData(data.target);

        const requestConfig = {
            method: 'POST',
            body: dataForm
        };

        const response = await fetch(`${user.baseUrl}/login`, requestConfig);
		const jsonResponse = await response.json();

        if(response.status === 404) {
            // Debugger
            // console.log(jsonResponse)

        } else {

            // Saving datas in local session
            userDatas = JSON.stringify(jsonResponse);
            sessionStorage.setItem('userDatas', userDatas);
            
            // Saving datas in store
            Store.user = jsonResponse;

            utils.showLoggedMenu();
        }

    },

    account: function(event) {

        event.preventDefault();

        // CLEAR DISPLAY
        utils.clearEverything();

        // SHOW MENU
        const menu = document.querySelector('.menu')
        menu.classList.remove('is-hidden');

        // GET DATAS FROM SESSION STORAGE
        const userDatas = sessionStorage.getItem('userDatas');
        const user = JSON.parse(userDatas);

        // CREATING DOM
        const dom = document.querySelector('main');

        const article = document.createElement('article');
        dom.appendChild(article);

        // GENERATING USER INFORMATIONS IN DOM
        for(const elt of Object.entries(user)) {

            console.log(elt)
            const paragraph = document.createElement('p');
            paragraph.classList.add('account-key');
            paragraph.textContent = elt[0] + ' : ' + elt[1];
            article.appendChild(paragraph);
        }

        // ADDING "BACK TO MAIN MENU"
        const backMenu = document.createElement('button');
        backMenu.classList.add('nav-button');
        backMenu.textContent = "GO BACK"
        article.appendChild(backMenu);

        // EVENTLISTENER "BACK TO MAIN MENU"
        backMenu.addEventListener('click', utils.showLoggedMenu);
    },

    handleCreateAccountForm: async function(data) {

        event.preventDefault();

        let dataForm = new FormData(data.target);

        const requestConfig = {
            method: 'POST',
            body: dataForm
        }

        const response = await fetch(`${user.baseUrl}/signup`, requestConfig);

        const jsonResponse = await response.json();

        const form = document.querySelector('form[id="createAccount"]');
        const paragraph = document.createElement('p');

        // responseString = JSON.stringify(jsonResponse);
        console.log(jsonResponse.error);

        if(response.status === 404) {

            paragraph.textContent = `Erreur 404`
            form.appendChild(paragraph);

        } else if (jsonResponse.error === 'userExist') {
            
            paragraph.textContent = `l'utilisateur existe déjà`
            form.appendChild(paragraph);
            
        } else if (jsonResponse.error === 'wrongConfirm') {

            paragraph.textContent = `Erreur de confirmation de mot de passe`
            form.appendChild(paragraph);

        } else {

        // Saving json response in local session
        userDatas = JSON.stringify(jsonResponse);
        sessionStorage.setItem('userDatas', userDatas);

        // CLEAR DISPLAY
        utils.clearEverything();

        // ADDING "BACK TO MAIN MENU"
        const main = document.querySelector('main');
        const backMenu = document.createElement('button');
        backMenu.classList.add('nav-button');
        backMenu.textContent = "GO BACK"
        main.appendChild(backMenu);

        // EVENTLISTENER "BACK TO MAIN MENU"
        backMenu.addEventListener('click', utils.showLoggedMenu);
        }


    }

};

module.exports = user;
},{"./store":6,"./utils":8}],8:[function(require,module,exports){

const utils = {

    showMainMenu: function() {

        // SHOW MENU
        const menu = document.querySelector('.menu')
        menu.classList.remove('is-hidden');

        // SHOW LOGIN, CREATE ACCOUNT, RULES
        const playButton = document.querySelector('li[set-menu="login"]');
        playButton.classList.remove('is-hidden');

        const createAccountButton = document.querySelector('li[set-menu="createAccount"]');
        createAccountButton.classList.remove('is-hidden');
        
        const rulesButton = document.querySelector('li[set-menu="rules"]');
        rulesButton.classList.remove('is-hidden');
    },

    showLoggedMenu: function() {

        // CLEAR DISPLAY
        utils.clearEverything();

        // SHOW MENU
        const menu = document.querySelector('.menu')
        menu.classList.remove('is-hidden');

        const playButton = document.querySelector('li[set-menu="play"]');
        playButton.classList.remove('is-hidden');
        const accountButton = document.querySelector('li[set-menu="account"]');
        accountButton.classList.remove('is-hidden');
        const rulesButton = document.querySelector('li[set-menu="rules"]');
        rulesButton.classList.remove('is-hidden');

    },

    clearEverything: function() {
        const activeElements = document.querySelectorAll('nav, form, article, li');

        for(let activElt of activeElements) {
            activElt.classList.add('is-hidden');
        }
    },


    showLoginForm: function(event) {

        event.preventDefault();

        // CLEAR DISPLAY
        utils.clearEverything();

        // SHOW LOGIN FORM
        const loginForm = document.querySelector('form[id="login"]')
        loginForm.classList.remove('is-hidden');
    },

    showCreateAccountForm: function(event) {
        event.preventDefault();

        // CLEAR DISPLAY
        utils.clearEverything();

        // SHOW CREATE ACCOUNT FORM
        const createAccountForm = document.querySelector('form[id="createAccount"]');
        createAccountForm.classList.remove('is-hidden');
    },

    createBoardGame: function() {

        // THE ALL BOARD GAME
        const main = document.querySelector('main');
        main.classList.add('board-game');

        // SIDE LEFT + DROP AREA
        const sideAndDrop = document.createElement('div');
        sideAndDrop.classList.add('side-and-drop');

        // SIDE AREA.
        const sideArea = document.createElement('div');
        sideArea.classList.add('sideArea');

        const borderSideArea = document.createElement('div');
        borderSideArea.classList.add('border-left-side');

          //-- Informations field
          const infosField = document.createElement('div');
          infosField.classList.add('infosField');
          
          //-- End of round
          const endOfRound = document.createElement('button');
          endOfRound.classList.add('endOfRound')
          endOfRound.classList.add('inactive')
          endOfRound.textContent = 'END OF ROUND'

          //-- Big card container
          const bigCardContainer = document.createElement('div');
          bigCardContainer.classList.add('bigCardContainer')

        // BOARD AREA
        const boardArea = document.createElement('div');
        boardArea.classList.add('boardArea');

          //-- COMPUTER CARDS AREA
          const cpterCards = document.createElement('div');
          cpterCards.classList.add('cpterCards');
          cpterCards.setAttribute('user', 'cpter')

          //-- DROP AREA
          const dropArea = document.createElement('div');
          dropArea.classList.add('drop-area');
        //   dropArea.setAttribute('draggable', true);

        // PLAYER CARDS AREA
        const playerArea = document.createElement('div');
        playerArea.classList.add('playerArea');


          //-- BORDER TOP
          const borderPlayerAreaTop = document.createElement('div');
          borderPlayerAreaTop.classList.add('border-player-area');

          //-- CARDS
          const playerCards = document.createElement('div');
          playerCards.classList.add('playerCards');
          playerCards.setAttribute('user', 'player')

          //-- BORDER BOTTOM
          const borderPlayerAreaBottom = document.createElement('div');
          borderPlayerAreaBottom.classList.add('border-player-area');


        // ALLOW HORIZONTAL SCROLL WITH WHEEL
        window.addEventListener('wheel', function(e) {

        if (e.deltaY > 0) playerArea.scrollLeft += 40;
        else playerArea.scrollLeft -= 40;
        });


        // ADD ELEMENTS IN DOM
        // MAIN
        main.appendChild(sideAndDrop);
        main.appendChild(playerArea);

        // SIDE AND DROP
        sideAndDrop.appendChild(sideArea);
        sideAndDrop.appendChild(borderSideArea);
        sideAndDrop.appendChild(boardArea);

        sideArea.appendChild(bigCardContainer);
        sideArea.appendChild(infosField);
        sideArea.appendChild(endOfRound);

        boardArea.appendChild(cpterCards);
        boardArea.appendChild(dropArea);
        
        // PLAYER AREA
        playerArea.appendChild(borderPlayerAreaTop);
        playerArea.appendChild(playerCards);
        playerArea.appendChild(borderPlayerAreaBottom);


    },

    // Reload du css au changement de la taille de la fenetre pour eviter bug d'affichage sur les cartes joueur
    reloadCss: function() {

    var links = document.getElementsByTagName("link");

    window.onresize = function(){

        for (var cl in links) {
            var link = links[cl];
            if (link.rel === "stylesheet")
                link.href += "";
        }
     }
    },

    getPosition: function(elt) {

        var rect = elt.getBoundingClientRect(),
        scrollLeft = window.pageXOffset || document.documentElement.scrollLeft,
        scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        return { top: rect.top + scrollTop, left: rect.left + scrollLeft }
    }

};

module.exports = utils;
},{}]},{},[1]);
