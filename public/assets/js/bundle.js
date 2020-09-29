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
},{"./game":3,"./user":5,"./utils":6}],2:[function(require,module,exports){
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

        // GETTING LEVEL OF USER // DEBBUG + TARD POUR GENERER LES CARTES CPTER SELON NIVEAU JOUEUR
        // const userDatas = sessionStorage.getItem('userDatas');
        // const user = JSON.parse(userDatas);
        // const userLevel = user.level;
        // console.log(userLevel);

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

    monsters: function(deck, user) {

        for(const monster of deck) {

            const cardComponent = document.createElement('div');
            cardComponent.classList.add('cardComponent');
            cardComponent.classList.add('monster');
            cardComponent.setAttribute('key', monster.key);

            if(user != 'cpter') {
            cardComponent.setAttribute("position", 'in-hand' )
            cardComponent.classList.add('playerCard');
            cardComponent.setAttribute('data-player', 'playerDeck');
            cardComponent.setAttribute("draggable", true);
            }

            if(user === 'cpter') {
                cardComponent.classList.add('cpterCard');
                cardComponent.setAttribute('data-player', 'cpterDeck');
            }
            
            // CARD
            const monsterCard = document.createElement('img');
            monsterCard.classList.add('card-monster');
            monsterCard.src =  `./assets/img/Monster.png`

            const cardElementsContainer = document.createElement('div');
            cardElementsContainer.classList.add('cardElementsContainer');

            // NAME
            const monsterName = document.createElement('p');
            monsterName.classList.add('card-name');
            monsterName.textContent = monster.title;

            // DESCRIPTION
            const monsterDescription = document.createElement('p');
            monsterDescription.classList.add('card-description');
            monsterDescription.textContent = monster.text;

            // PICTURE
            const monsterPicture = document.createElement('img');
            monsterPicture.classList.add('card-picture');
            monsterPicture.src =  `./assets/img/monsters/${monster.id}.jpg`

            // ATTACK - DEFENSE - HIT POINT
            const monsterAttack = document.createElement('p');
            monsterAttack.classList.add('card-attack');
            monsterAttack.textContent = monster.attack;

            const monsterDefense = document.createElement('p');
            monsterDefense.classList.add('card-defense');
            monsterDefense.textContent = monster.defense;

            const monsterHitpoint = document.createElement('p');
            monsterHitpoint.classList.add('card-hitpoint');
            monsterHitpoint.textContent = monster.hit_point;

            const container = document.querySelector(`div[user="${user}"]`);
            container.appendChild(cardComponent);
            cardComponent.appendChild(monsterCard);
            cardComponent.appendChild(cardElementsContainer);
            cardElementsContainer.appendChild(monsterName);
            cardElementsContainer.appendChild(monsterPicture);
            cardElementsContainer.appendChild(monsterDescription);
            cardElementsContainer.appendChild(monsterAttack);
            cardElementsContainer.appendChild(monsterDefense);
            cardElementsContainer.appendChild(monsterHitpoint);
        }
    },

    boosters: function(deck, user) {

        for(const booster of deck) {

            const cardComponent = document.createElement('div');
            cardComponent.classList.add('cardComponent');
            cardComponent.classList.add('booster');
            cardComponent.setAttribute('key', booster.key);

            if(user != 'cpter') {
                cardComponent.setAttribute("position", 'in-hand' )
                cardComponent.classList.add('playerCard');
                cardComponent.setAttribute('data-player', 'playerDeck');
                cardComponent.setAttribute("draggable", true);
            }

            if(user === 'cpter') {
                cardComponent.classList.add('cpterCard');
                cardComponent.setAttribute('data-player', 'cpterDeck');
            }

            // CARD
            const boosterCard = document.createElement('img');
            boosterCard.classList.add('card-booster');
            boosterCard.src =  `./assets/img/Booster.png`

            const cardElementsContainer = document.createElement('div');
            cardElementsContainer.classList.add('cardElementsContainer');

            // NAME
            const boosterName = document.createElement('p');
            boosterName.classList.add('card-name');
            boosterName.textContent = booster.title;

            // DESCRIPTION
            const boosterDescription = document.createElement('p');
            boosterDescription.classList.add('card-description');
            boosterDescription.textContent = booster.special_effect_text;

            // PICTURE
            const boosterPicture = document.createElement('img');
            boosterPicture.classList.add('card-picture');
            boosterPicture.src =  `./assets/img/boosters/${booster.id}.jpg`

            // BOOSTER VALUE
            const boosterValue = document.createElement('p');
            boosterValue.classList.add('card-value');
            boosterValue.textContent = booster.special_effect_value;


            const container = document.querySelector(`div[user="${user}"]`);
            container.appendChild(cardComponent);
            cardComponent.appendChild(boosterCard);
            cardComponent.appendChild(cardElementsContainer);
            cardElementsContainer.appendChild(boosterName);
            cardElementsContainer.appendChild(boosterPicture);
            cardElementsContainer.appendChild(boosterDescription);
            cardElementsContainer.appendChild(boosterValue);
        }

        cardGenerator.displayBigCard();
    },

    displayBigCard: function() {

        const cards = document.getElementsByClassName('cardComponent');

        let bigCard = document.querySelector('.bigCardContainer');


        for(const card of cards) {
            card.addEventListener('click', function(e) {
                bigCard.innerHTML = '';
                const container = document.querySelector('.sideArea')


                const card = e.target.closest('.cardComponent');

                bigCard = card.cloneNode(true);

                container.appendChild(bigCard);

            })
        }
    }

}


module.exports = cardGenerator;
},{"./game":3,"./utils":6}],3:[function(require,module,exports){
const utils = require('./utils');
const play = require('./play');
const cardGenerator = require('./cardGenerator');

const game = {

    baseUrl: 'http://localhost:5000',

    play: async function(event) {
        event.preventDefault();

        // CLEAR DISPLAY
        utils.clearEverything();
        const article = document.querySelector('article');
        if(article) { document.querySelector('article').innerHTML = ''; }
        

        // Checking if user has decks from API

        const userDatas = sessionStorage.getItem('userDatas');
        const user = JSON.parse(userDatas);

        const requestConfig = {
            method: 'GET'
        };

        const response = await fetch(`${game.baseUrl}/user-decks/${user.id}`, requestConfig);
        const jsonResponse = await response.json();

        if(response.status === 404) {

        } else {

            // Creating main elements in dom
            const mainArea = document.querySelector('main');
            const article = document.createElement('article');
            mainArea.appendChild(article);

            // Add decks datas in session (back) !!

                        
            if(jsonResponse[0].userHasDecks.length > 0) {

                const decks = jsonResponse[0].userHasDecks;

                for(const deck of decks) {

                    cardGenerator.deck(deck);

                    // EventListeners for buttons (deck manager / play with deck)

                    const seeThisDeck = document.querySelector('.see-deck');
                    const playThisDeck = document.querySelector('.play-deck');

                    seeThisDeck.addEventListener('click', function(){
                        game.showDeck(deck);
                    });
                    playThisDeck.addEventListener('click', function(){ play.launchGame(deck)});

                }

                // Appendchild un visuel global par deck
                // Onclick du deck afficher les cartes

            } else {
                console.log('no decks')

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
        }

        // ADDING "BACK TO MAIN MENU"
        const backMenu = document.createElement('button');
        backMenu.classList.add('nav-button');
        backMenu.textContent = "GO BACK"
        // document.appendChild(backMenu);

        // EVENTLISTENER "BACK TO MAIN MENU"
        backMenu.addEventListener('click', utils.showLoggedMenu);

    },


    // deckGenerator: async function(data) {

    //     event.preventDefault();

    //     const datas = new FormData(data.target);

    //     const requestConfig = {
    //         method: 'POST',
    //         body: datas
    //     };

    //     await fetch(`${game.baseUrl}/crud/deck`, requestConfig);
    //     // const jsonResponse = await response.json();
        
    //     // console.log(jsonResponse);

    //     // for (var value of datas.values()) {
    //     //     console.log(value); 
    //     //  }

    // },
    
    showDeck: function(deckDatas) {

        // CLEAR DISPLAY
        utils.clearEverything();

        // SHOW ARTICLE AREA 
        const article = document.querySelector('article');
        article.innerHTML = '';
        article.classList.remove('is-hidden');

        const monsters = deckDatas.monsters;
        const boosters = deckDatas.boosters;

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
},{"./cardGenerator":2,"./play":4,"./utils":6}],4:[function(require,module,exports){
const utils = require('./utils');
const cardGenerator = require('./cardGenerator');
// const dragAndDrop = require('./dragAndDrop');

const play = {

    state: {
        playerCardsOnBoard: 0,
        cpterCardsOnBoard: 0,
        playerRound: true,
        playerDeck: null,
        cpterDeck: null,
        playerDeckInHand: null,
        cpterCardInHand: null,
        },
  

    launchGame: async function(playerDeck) {

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

        inc = 0;
        for(const card of playerDeck.monsters) {
            card.key = inc++;
        }

        for(const card of playerDeck.boosters) {
            card.key = inc++;
        }

        // State to handle real card stats
        play.state.playerDeck = playerDeck;
        play.state.cpterDeck = cpterDeck;

        // Deep copy of cpter cards to handle visual cards
        play.state.cpterCardInHand = JSON.parse(JSON.stringify(cpterDeck));
        
        cardGenerator.monsters(playerDeck.monsters, 'player')
        cardGenerator.boosters(playerDeck.boosters, 'player')

        play.dragAndDrop();

        play.game();
    },

    game: function() {

        console.log(play.state.playerDeck.monsters);
        console.log(play.state.cpterDeck.monsters)


        // Le joueur doit déposer une premiere carte sur le plateau puis valide son tour
            // Quand une carte est posée Si le nombre de carte sur le plateau est inférieur à celui avant le début du tour 
            // envoyer un message
        if(play.state.playerRound) {
            play.dragAndDrop();
            // play.listenDrop();
        } else {
            play.cpterRound();
        }



        // Le computer dépose une carte sur le plateau puis c'est au joueur d'agir

        // Le joueur peut soit poser une autre carte, soit jouer
            // Si il joue lancer la fonction "combat" en récupérant l'id de la carte joueur + l'id de la carte cpter
            // Une fois que l'on a la valeur retour du fight on modifie la valeur hit point de la carte computer
            // Si la valeur hit point est à zéro, on supprime la carte du jeu et de l'array cards computer
            // On check la length de l'array cards, si il est à zéro partie terminée : joueur gagne
        
            // Si le joueur pose une carte, il doit valider son tour puis c'est au computer
        
        // Le computer peut soir poser une autre carte, soit jouer

    },

    cpterRound: function() {

        play.state.playerCardsOnBoard += 1;

        const infosField = document.querySelector('.infosField');
        infosField.innerHTML = 'Computer is playing';

        setTimeout(function(){ 
            
        // IF COMPUTER PUT A CARD ON BOARD

            // Getting 1 random card in cpter deck
            const cpterCardInHand = play.state.cpterCardInHand.monsters;

            if(cpterCardInHand.length > 0) {

                let monster = [cpterCardInHand[Math.floor(Math.random()*cpterCardInHand.length)]];

                // Generating card on board
                cardGenerator.monsters(monster, 'cpter')
    
                // Find index of selected card
                let indexMonster = null;
    
                for(var i = 0; i < cpterCardInHand.length; i++) {
                    if(cpterCardInHand[i].id === monster[0].id) {
                        indexMonster = i;
                    }
                }
                // remove from state cardInHand
                cpterCardInHand.splice(indexMonster, 1);
    
            }
            


        // IF COMPUTER PLAY A CARD

            infosField.innerHTML = 'A vous de jouer !'; }, 1000);

    
    
    // END OF ROUND


        play.state.playerRound = true;
        play.game();
    },

    fight: function(attacker, defenser) {

        const playArea = document.querySelector('.playArea');
        const fightArea = document.createElement('div');
        fightArea.classList.add('fightArea');

        // cogwheel 
        const cogWheel = document.createElement('div');
        cogWheel.classList.add('cogwheel')
        cogWheel.classList.add('rotate')
        cogWheel.textContent = '⚙'

        // Components in DOM
        playArea.appendChild(fightArea);
        playArea.appendChild(cogWheel);


        // Algorithm

            // find card in the state to avoid false value write by user in dom
            const attackerKey = attacker.getAttribute('key');
            const defenserKey = defenser.getAttribute('key');

            const attackerName = attacker.getAttribute('data-player');
            const defenserName = defenser.getAttribute('data-player');

            
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

            attacker.querySelector('.card-hitpoint').textContent = attackerCard.hit_point;
            defenser.querySelector('.card-hitpoint').textContent = defenserCard.hit_point;

            setTimeout(function(){ 

            // IF HIT-POINTS ARE NEGATIVES, DELETE CARD FROM BOARD
            if(attackerCard.hit_point <= 0) {
                // delete card on board
                attacker.remove();
                // delete card in state
                attackerCards.monsters.splice(attackerCard.key, 1);
            }
            
            if(defenserCard.hit_point <= 0) {
                // delete card on board
                defenser.remove();
                // delete card in state
                defenserCards.monsters.splice(defenserCard.key, 1);
            }

            // FAIRE UN TOGGLE SUR PLAYERROUND : AMELIORER !!!!
            if(play.state.playerRound = true) { play.state.playerRound = false} else {play.state.playerRound = true};
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


    dragAndDrop: function() {

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
    
    
        const cards = document.getElementsByClassName('cardComponent');
    
        for (const card of cards) {
            new Drag(card);
    ;
            card.addEventListener('dragend', function () {
    
            var x = event.clientX, y = event.clientY,
            elementMouseIsOver = document.elementFromPoint(x, y);
    

            // const dropArea = document.querySelector(`.${elementMouseIsOver.className}`);

            // Handle where user can drop cards
            if((elementMouseIsOver.className === 'sideArea') || (elementMouseIsOver.className === 'cpterCards') || (elementMouseIsOver.className === 'playerCard')) {
                alert('pas ici malheureux !')
            } else {
                if((elementMouseIsOver.className === 'drop-area') || (elementMouseIsOver.className === 'playerCards')) {
                    elementMouseIsOver.appendChild(card);
                    play.listenDrop();
                } else if(elementMouseIsOver.parentNode.dataset.player === 'cpterDeck') {
                    // Ajouter une condition, si carte booster on ne fait rien (ou message alerte pas possible)
                    const cpterCard = elementMouseIsOver.closest('.cardComponent');

                    if(card.classList.contains("booster")) {
                        alert('vous ne pouvez pas combattre avec une carte booster')
                    } else {
                        play.fight(card, cpterCard);
                    }

                }

            }
    
        });
    
        }
    
        },
    
        listenDrop: function() {

            const infosField = document.querySelector('.infosField');
            infosField.innerHTML = '';

    
            let nbrOfChildren = document.querySelector('.drop-area').childElementCount;
    
            const endOfRoundButton = document.querySelector('.endOfRound');
    
            if(play.state.playerCardsOnBoard == nbrOfChildren - 1) {
                infosField.textContent = 'Cliquez sur "end of round" pour valider votre carte';
                endOfRoundButton.classList.remove('inactive');
                endOfRoundButton.addEventListener('click', play.cpterRound);
                // MISE A JOUR DES PLAYERSCARDSONBOARD + DONNER ACCES A FINIR SON TOUR
            } else if(play.state.playerCardsOnBoard < nbrOfChildren)  {
                infosField.textContent = 'Vous ne pouvez jouer qu\'une carte par tour, veuillez en retirer';
            } else if(play.state.playerCardsOnBoard >= nbrOfChildren)  {
                infosField.textContent = 'Veuillez insérer une carte sur le plateau';
            } else {
                console.log('error')
            }
        },


}

module.exports = play;
},{"./cardGenerator":2,"./utils":6}],5:[function(require,module,exports){
const utils = require('./utils');

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

            // Saving json response in local session
            userDatas = JSON.stringify(jsonResponse);
            console.log(userDatas);
            sessionStorage.setItem('userDatas', userDatas);

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
},{"./utils":6}],6:[function(require,module,exports){

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

        const main = document.querySelector('main');
        main.classList.add('board-game');

        // SIDE AREA : SHOW BIG CARD, END OF ROUND...
        const sideArea = document.createElement('div');
        sideArea.classList.add('sideArea');

          // Informations field
          const infosField = document.createElement('div');
          infosField.classList.add('infosField');
          
          // End of round
          const endOfRound = document.createElement('button');
          endOfRound.classList.add('endOfRound')
          endOfRound.classList.add('inactive')
          endOfRound.textContent = 'END OF ROUND'

          // Big card container
          const bigCardContainer = document.createElement('div');
          bigCardContainer.classList.add('bigCardContainer')


        const playArea = document.createElement('div');
        playArea.classList.add('playArea');

        // COMPUTER CARDS AREA
        const cpterCards = document.createElement('div');
        cpterCards.classList.add('cpterCards');
        cpterCards.setAttribute('user', 'cpter')

        // PLAYER CARDS AREA
        const playerCards = document.createElement('div');
        playerCards.classList.add('playerCards');
        playerCards.setAttribute('user', 'player')

        // ALLOW HORIZONTAL SCROLL WITH WHEEL
        window.addEventListener('wheel', function(e) {

        if (e.deltaY > 0) playerCards.scrollLeft += 40;
        else playerCards.scrollLeft -= 40;
        });

        // DROP AREA
        const dropArea = document.createElement('div');
        dropArea.classList.add('drop-area');
        dropArea.setAttribute('draggable', true);

        // ADD ELEMENTS IN DOM

        main.appendChild(sideArea);
        main.appendChild(playArea);

        sideArea.appendChild(infosField);
        sideArea.appendChild(endOfRound);
        sideArea.appendChild(bigCardContainer);

        playArea.appendChild(cpterCards);
        playArea.appendChild(dropArea);
        playArea.appendChild(playerCards);
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
    }

};

module.exports = utils;
},{}]},{},[1]);
