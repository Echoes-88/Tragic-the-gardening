(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){

const utils = require('./utils');

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

        const positionPlayerCard = utils.getPosition(playerCard);
        const positionCpterCard = utils.getPosition(cpterCard);

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
},{"./utils":9}],2:[function(require,module,exports){
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
},{"./game":5,"./user":8,"./utils":9}],3:[function(require,module,exports){
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
        for (var i = 0; i < 4; i++) {
            let monster = monsters[Math.floor(Math.random()*monsters.length)];
            monstersArray.push(monster.id)       
        }

        // Choosing 2 random booster and adding in arrays
        for (var i = 0; i < 2; i++) {
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
        for (var i = 0; i < 4; i++) {
            let monster = monsters[Math.floor(Math.random()*monsters.length)];
            monster.key = null;
            monstersArray.push(monster)       
        }

        // Choosing 3 random booster and adding in arrays
        for (var i = 0; i < 2; i++) {
            let booster = boosters[Math.floor(Math.random()*boosters.length)];
            boostersArray.push(booster)       
        }


        const deck = {monsters: monstersArray, boosters: boostersArray};
        return deck;

    },

    card: function(card, type, user) {

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
},{"./game":5,"./utils":9}],4:[function(require,module,exports){

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
},{}],5:[function(require,module,exports){
const utils = require('./utils');
const play = require('./play');
const cardGenerator = require('./cardGenerator');
const Store = require('./store');

const game = {

    baseUrl: 'http://localhost:5000',

    play: async function(event) {
        event.preventDefault();
        console.log(Store.user)
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
            console.log('on passe par la creation de deck')
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
            userId.value = Store.user.id;
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
        article.appendChild(backMenu);

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

        article.classList.add('deckManager')


        const monsters = deck.monsters;
        const boosters = deck.boosters;

        monsters.map((card) => {
            const monsterCard = cardGenerator.card(card, 'monster', 'user');
            article.appendChild(monsterCard);
        });

        boosters.map((card) => {
            const boosterCard = cardGenerator.card(card, 'booster', 'user');
            article.appendChild(boosterCard);
        });

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
},{"./cardGenerator":3,"./play":6,"./store":7,"./utils":9}],6:[function(require,module,exports){
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
},{"./animation":1,"./cardGenerator":3,"./dragAndDrop":4,"./utils":9}],7:[function(require,module,exports){

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
},{}],8:[function(require,module,exports){
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
            console.log(jsonResponse)
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

        // Saving datas in store
        Store.user = jsonResponse;

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
},{"./store":7,"./utils":9}],9:[function(require,module,exports){

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
          
          //-- End of round
          const endOfRound = document.createElement('button');
          endOfRound.classList.add('endOfRound')
          endOfRound.classList.add('inactive')
          endOfRound.textContent = 'END OF ROUND'

          //-- Informations field
          const infosField = document.createElement('div');
          infosField.classList.add('infosField');
          const infosFieldBubble = document.createElement('div');
          infosFieldBubble.classList.add('infosField-bubble');

          // Vault boy
          const vaultBoy = document.createElement('div');
          vaultBoy.classList.add('vault-boy');

          //-- Big card container
            //   const bigCardContainer = document.createElement('div');
            //   bigCardContainer.classList.add('bigCardContainer')

        // BOARD AREA
        const boardArea = document.createElement('div');
        boardArea.classList.add('boardArea');

          //-- COMPUTER CARDS AREA
          const cpterCards = document.createElement('div');
          cpterCards.classList.add('cpterCards');
          cpterCards.setAttribute('player', 'cpter')

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
          playerCards.setAttribute('player', 'user')

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

        sideArea.appendChild(endOfRound);
        sideArea.appendChild(infosField);
        sideArea.appendChild(infosFieldBubble);
        sideArea.appendChild(vaultBoy);

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
    },

};

module.exports = utils;
},{}]},{},[2]);
