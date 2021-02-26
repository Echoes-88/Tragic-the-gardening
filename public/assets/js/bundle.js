(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
const Store = require('../Store');

const PlayGame = require('./PlayGame');

// Middleware request
const MiddlewareDeck = require('../Middleware/Deck');

// Render
// const DeckGeneratorScreen = require('../DomRender/ManageDeck');
const DomRenderCard = require('../DomRender/Card');

const InitGame = {

    init: () => {
        if(event) {
            event.preventDefault();
        }

        console.log(Store)

        const mainContainer = document.querySelector('.container');
        mainContainer.classList.add('flex');

        // Check if user has decks. Yes => show all decks. No => create one
        if(Store.user.decks.length > 0) {

                mainContainer.innerHTML = DomRenderCard.showDeck(Store.user.decks);

                // const manageDeck = document.getElementsByClassName('manage-deck');

                // for(const deck of manageDeck) {
                //     deck.addEventListener('click', function(){
                //         event.preventDefault();
                //         mainContainer.innerHTML = DomRenderCard.showDeck(deck.id);
                //     });
                // }

                const playDeck = document.getElementsByClassName('play-deck');

                for(const deck of playDeck) {
                    deck.addEventListener('click', function(){
                        event.preventDefault();
                        mainContainer.classList.remove('flex');
                        mainContainer.classList.add('board-game');
                       
                        // Start game;
                        PlayGame.init(deck.id)
                    });
                }


        } else {
            console.log("ça passe car il n a pas de deck")
            mainContainer.innerHTML = DomRenderCard.createDeck();

            const form = document.getElementById('create-deck');
            form.addEventListener('submit', async(data) => { 

                // Create deck in database
                const response = await MiddlewareDeck.createOne(data);
                console.log(response)
                if(response) {
                    InitGame.init();
                }


                
            });
        }
            
    }
}

module.exports = InitGame;
},{"../DomRender/Card":5,"../Middleware/Deck":9,"../Store":11,"./PlayGame":3}],2:[function(require,module,exports){
const DomRenderForm = require('../DomRender/Form');
const DomRenderMenu = require('../DomRender/Menu');

const MiddlewareLog = require('../Middleware/Log');
const InitGame = require('./InitGame');

const Store = require('../Store');

const Menu = {

    unLogged: () => {

        const mainContainer = document.querySelector('.container');
        mainContainer.innerHTML = DomRenderMenu.render('unLogged');

        // LOGIN
        const login = document.querySelector('li[set-menu="login"] a');
        
        login.addEventListener('click', ()=> {
            event.preventDefault();

            // Create Dom elements
            mainContainer.innerHTML = DomRenderForm.login();

            // Listen login form submit
            const loginForm = document.querySelector('form[id="login"]');
            loginForm.addEventListener('submit', async (datas) => {

                const response = await MiddlewareLog.handleLogin(datas);
                (response ? Menu.logged() : console.log("T qui ?"));
            });

            // Listen back to menu
            const backToMenu = document.querySelector('.go-back');
            backToMenu.addEventListener('click', () => {
                event.preventDefault();
                Menu.unLogged();
            });
        });

        // CREATE ACCOUNT
        const createAccount = document.querySelector('li[set-menu="createAccount"] a');

        createAccount.addEventListener('click', ()=> {
            event.preventDefault();

            // Create Dom elements
            const mainContainer = document.querySelector('.container');
            mainContainer.innerHTML = DomRenderForm.createAccount();

            // Listen Create Account form submit
            const createAccountForm = document.querySelector('form[id="createAccount"]');
            createAccountForm.addEventListener('submit', async(datas) => {
                
                const response = MiddlewareLog.handleCreateAccount(datas);
                if(response) {
                    Menu.logged();
                }

            });

            // Listen back to menu
            const backToMenu = document.querySelector('.go-back');
            backToMenu.addEventListener('click', () => {
                event.preventDefault();
                Menu.unLogged();
            });
        });

    },

    logged: () => {

        console.log(Store)
        const mainContainer = document.querySelector('.container');
        mainContainer.innerHTML = DomRenderMenu.render('logged');

        // Listen play button event
        const play = document.querySelector('li[set-menu="play"] a');
        play.addEventListener('click', InitGame.init);
    }
}

module.exports = Menu;
},{"../DomRender/Form":6,"../DomRender/Menu":7,"../Middleware/Log":10,"../Store":11,"./InitGame":1}],3:[function(require,module,exports){
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
        mainContainer.classList.remove('container')
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
                card.type = 'booster'; 
                card.owner = 'user';   
                playerArea.innerHTML += DomRenderCard.booster(card, "user")
            });

            // Add array to scan cards status
            userDeck.cardsOnBoard = [];

            // Save cpter Deck  
            cpterDeck = Store.cpter.deck

            // Deep copy to avoid duplicate key
            cpterDeck = JSON.parse(JSON.stringify(cpterDeck));

            cpterDeck.monsters.forEach(card => {card.key = inc++; card.onBoard = false; card.type = 'monster'; card.owner = 'cpter'});
            cpterDeck.boosters.forEach(card => {card.key = inc++; card.onBoard = false; card.type = 'booster'; card.owner = 'cpter'});
            cpterDeck.cardsOnBoard = [];
         
            // launch game
            PlayGame.userRound();
        })
    },


    userRound: function() {

        round++;

        console.log('user deck', userDeck, 'cpter deck', cpterDeck)

        if((userDeck.monsters.length <= 0) && (userDeck.cardsOnBoard.length <= 0)) {
            console.log("YOU LOOSE !!")
            // const infosField = document.querySelector('.infosField');
        }

        if((userDeck.monsters.length + userDeck.cardsOnBoard.length) < 3) {
            // Change picture vault boy
            let vaultBoy = document.querySelector('.vault-boy');
            vaultBoy.style.backgroundImage = 'url(assets/img/vault-boy/vault-boy-loosing.png)';
        }

        // Display informations to user
        const infosField = document.querySelector('.infosField');

        if(round === 1) {
            infosField.innerHTML = `Welcome ! <br><br> Please drag and drop your first card on the board.`;
        } else {
            infosField.innerHTML = 'Add a card on the board or play a card from the board to attack computer';
        }

        // Handle cards
        const userCardsDom = document.querySelectorAll('.userCard');
    
        for (const userCardDom of userCardsDom) {

            // Initialisation of drag and drop
            dragAndDrop.init(userCardDom);

            // Listening drop
            userCardDom.addEventListener('dragend', function () {

                // Change picture vault boy
                if(userDeck.monsters.length >= 3) {
                    let vaultBoy = document.querySelector('.vault-boy');
                    vaultBoy.style.backgroundImage = 'url(assets/img/vault-boy/vault-boy.png)';
                }


                var x = event.clientX, y = event.clientY,
                eltFlewOver = document.elementFromPoint(x, y);


                if(userCardDom.classList.contains("booster")) {

                    if(eltFlewOver.classList.contains("user")) {

                        // Detect monster card selected
                        const monsterCardDom = eltFlewOver.closest('.cardComponent');

                        // Get monster informations
                        const cardKeyMonster = monsterCardDom.getAttribute('data-key');
                        const monster = userDeck.cardsOnBoard.find(card => card.key == cardKeyMonster);

                        // Get booster informations
                        const cardKeyBooster = userCardDom.getAttribute('data-key');
                        const booster = userDeck.boosters.find(booster => booster.key == cardKeyBooster);


                        // Detect type of booster
                        const typeBooster = booster.special_effect_text;
                        // FAIRE UNE FONCTION PROMESSE OU UNE ANIMATION POUR ATTENDRE LE FIN DE MONSTER
                        const bonus = booster.special_effect_value + monster[typeBooster];

                        // update monster card value in dom
                        let textBonus = monsterCardDom.querySelector(`.${typeBooster}`);
                        textBonus.textContent = bonus;
        
                        // update monster card value
                        monster[typeBooster] = bonus;
        
                        userCardDom.remove();

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
                        
                        // Find card in state
                        const cardKey = userCardDom.getAttribute('data-key');
                        const monster = userDeck.monsters.find(monster => monster.key == cardKey);

                        userDeck.cardsOnBoard.push(monster);

                        // Delete card in main array
                        let index = userDeck.monsters.indexOf(monster);
                        userDeck.monsters.splice(index, 1);

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
                        let cardAttack = userDeck.cardsOnBoard.find(card => card.key == userCardDom.getAttribute('data-key'))
                        let cardDefense = cpterDeck.cardsOnBoard.find(card => card.key == cpterCardDom.getAttribute('data-key'))
                        PlayGame.fight(cardAttack, cardDefense);
                    }
                }
                
                }
            });
        }
    },

    cpterRound: function() {

        // Disable draggable
        const playerCards = document.querySelectorAll('.userCard');
        for(const card of playerCards) { card.draggable = false; }

        if(cpterDeck.monsters.length > 0 || cpterDeck.boosters.length > 0) {

            let randomNbr = Math.floor(Math.random()*10)+1;

            // IF RANDOM NUMBER > 7 OR ROUND 1, CPTER ADD A CARD ON BOARD
            if(randomNbr >= 7 || round == 1 || cpterDeck.cardsOnBoard.length <= 0 || userDeck.cardsOnBoard.length <= 0) {

                // Getting a new random number
                randomNbr = Math.floor(Math.random()*10)+1;

                    if(cpterDeck.monsters.length > 0) {

                        if((randomNbr > 6) && (cpterDeck.boosters.length > 0) && (cpterDeck.cardsOnBoard.length > 0)) {
                            PlayGame.cpterAddCard("booster");
                        } else {
                            PlayGame.cpterAddCard("monster");
                        }

                    } else if (cpterDeck.boosters.length > 0) {

                        if((randomNbr > 0 && randomNbr < 7) && (cpterDeck.monsters.length > 0)) {
                            PlayGame.cpterAddCard("monster");
                        } else if(cpterDeck.cardsOnBoard.length > 0) {
                            PlayGame.cpterAddCard("booster");
                        } else {
                            PlayGame.cpterAddCard("monster");
                        }
                    }
            } else if(randomNbr > 0 && randomNbr <= 6) {
                PlayGame.cpterAttack();
            } 

        } else if((cpterDeck.length <= 0) && (cpterDeck.cardsOnBoard.length > 0)) {
            PlayGame.cpterAttack();
        } else {
            console.log("YOU WIN !!")
        }

    },


    fight: function(cardAttack, cardDefense) {

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
                    let index = cpterDeck.cardsOnBoard.indexOf(cardAttack);
                    cpterDeck.cardsOnBoard.splice(index, 1);
                } else {
                    let indexCardsOnBoard = userDeck.cardsOnBoard.indexOf(cardAttack);
                    userDeck.cardsOnBoard.splice(indexCardsOnBoard, 1);
                }

                }, 1000);
            }

            if(cardDefense.hit_point <= 0) {
                setTimeout(function(){ 
                // delete card on board
                cardDefenseDom.remove();
                // delete card in state
                if(cardDefense.owner === 'cpter') {
                    let index = cpterDeck.cardsOnBoard.indexOf(cardDefense);
                    cpterDeck.cardsOnBoard.splice(index, 1);

                } else {
                    let indexCardsOnBoard = userDeck.cardsOnBoard.indexOf(cardDefense);
                    userDeck.cardsOnBoard.splice(indexCardsOnBoard, 1);

                    // Change picture vault boy
                    let vaultBoy = document.querySelector('.vault-boy');
                    vaultBoy.style.backgroundImage = 'url(assets/img/vault-boy/vault-boy-angry.png)';
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

    cpterAddCard: function(cardType) {

        const infosField = document.querySelector('.infosField');
        infosField.textContent = "...Computer is playing..."

        // Handle booster cards
        if(cardType === 'booster') {

            // Get random booster card
            const booster = cpterDeck.boosters[Math.floor(Math.random()*cpterDeck.boosters.length)];

            // Generating booster card on board
            const cardsContainer = document.querySelector('.cpterCards');
            cardsContainer.innerHTML += DomRenderCard.booster(booster, 'cpter')

            // Get random monster card from board to apply boost
            const monster = cpterDeck.cardsOnBoard[Math.floor(Math.random()*cpterDeck.cardsOnBoard.length)];

            // Get monster card on board
            let monsterDom = document.querySelector(`div[data-key="${monster.key}"]`);
            let boosterDom = document.querySelector(`div[data-key="${booster.key}"]`);

            animation.moveCards(boosterDom, monsterDom);

            setTimeout(function(){ 

                const typeBooster = booster.special_effect_text;

                const bonus = booster.special_effect_value + monster[typeBooster];

                // update monster card value in dom
                let textBonus = monsterDom.querySelector(`.${typeBooster}`);
                textBonus.textContent = bonus;

                // update monster card value
                monster[typeBooster] = bonus;

                // Delete card in dom
                boosterDom.remove();

                // Delete card in state
                let index = cpterDeck.boosters.indexOf(booster);
                cpterDeck.boosters.splice(index, 1);

                PlayGame.userRound();
                }, 2000);

        } else {

            // Get random monster card
            const monster = cpterDeck.monsters[Math.floor(Math.random()*cpterDeck.monsters.length)];

            // Generating monster card on board
            const cardsContainer = document.querySelector('.cpterCards');
            cardsContainer.innerHTML += DomRenderCard.monster(monster, 'cpter')

            // Add card on array "cardsOnBoard"
            cpterDeck.cardsOnBoard.push(monster);

            // Delete card in main array
            let index = cpterDeck.monsters.indexOf(monster);
            cpterDeck.monsters.splice(index, 1);

            PlayGame.userRound();
        }
    },

    cpterAttack: function() {

        const infosField = document.querySelector('.infosField');
        infosField.textContent = "...Computer is playing..."

        // Getting computer cards on board and select one
        let cardAttack = cpterDeck.cardsOnBoard[Math.floor(Math.random()*cpterDeck.cardsOnBoard.length)];

        // Getting user cards on board and select one
        let cardDefense = userDeck.cardsOnBoard[Math.floor(Math.random()*userDeck.cardsOnBoard.length)];

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
},{"../DomRender/BoardGame":4,"../DomRender/Card":5,"../DomRender/Tutorial":8,"../Middleware/Deck":9,"../Store":11,"../Utils/Animation":12,"../Utils/DragAndDrop":13}],4:[function(require,module,exports){
const BoardGame = {
    render: () => {
        
        return `
            <div class="side-and-drop">
                <div class="sideArea">
                    <button class ="endOfRound inactive">END OF ROUND</button>
                    <div class="infosField"></div>
                    <div class="infosField-bubble"></div>
                    <div class="vault-boy"></div>
                </div>
                <div class="boardArea">
                    <div class="cpterCards"></div>
                    <div class="drop-area"></div>
                </div>
            </div>
            <div class="playerArea">
                <div class="border-player-area"></div>
                <div class="playerCards"></div>
                <div class="border-player-area"></div>
            </div>
        `
    }
}

module.exports = BoardGame;
},{}],5:[function(require,module,exports){
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
},{}],6:[function(require,module,exports){
const Form = {
    login: () => {

        return `
            <img src="assets/img/Logo.png" class="logo">
            <form action="" class="form" id="login">
                <div class="form-label-group">
                <label for="email">Email</label>
                    <input type="email" class="form-control" id="email" name="email" aria-describedby="emailHelp" placeholder="Votre courriel">
                </div>
            
                <div class="form-label-group">
                <label for="password">Password</label>
                    <input type="password" class="form-control" id="password" name="password"
                        placeholder="Votre mot de passe" autocomplete="on">
        
                </div>
            
                <div class="checkbox mb-3">
                    <label>
                        <input type="checkbox" name="remember" value="remember-me"> Se souvenir de moi
                    </label>
                </div>
                <div>
                <button class="" type="submit">Se connecter</button>
                </div>
            </form>
            <button class="go-back">GO BACK</button>
        `
    },

    createAccount: () => {
        
        return `
        <img src="assets/img/Logo.png" class="logo">
        <form action="" class="form" id="createAccount">

          <div class="form-label-group">
            <label for="lastname">Lastname</label>
              <input type="lastname" class="form-control" id="lastname" name="lastname" aria-describedby="lastnameHelp" placeholder="Votre nom" value="">
          </div>

          <div class="form-label-group">
            <label for="firstname">Firstname</label>
              <input type="firstname" class="form-control" id="firstname" name="firstname" aria-describedby="firstnameHelp" placeholder="Votre prénom" value="">
          </div>

          <div class="form-label-group">
            <label for="pseudo">Nickname</label>
              <input type="pseudo" class="form-control" id="pseudo" name="pseudo" aria-describedby="pseudoHelp" placeholder="Votre pseudo" value="">
          </div>

          <div class="form-label-group">
            <label for="email">Email</label>
              <input type="email" class="form-control" id="emailCreate" name="email" aria-describedby="emailHelp" placeholder="Votre courriel" autocomplete="username" value="">
          </div>

          <div class="form-label-group">
            <label for="password">Password</label>
              <input type="password" class="form-control" id="passwordCreate" name="password" placeholder="Votre mot de mot de passe" autocomplete="on">
          </div>

          <div class="form-label-group">
            <label for="passwordConfirm">Confirm password</label>
              <input type="password" class="form-control" id="passwordConfirm" name="passwordConfirm" placeholder="Confirmez votre mot de passe" autocomplete="new-password">
          </div>

              <button type="submit" class="">Submit</button>
      </form>
      <button class="go-back">GO BACK</button>
        `
    }
}

module.exports = Form;
},{}],7:[function(require,module,exports){
const Menu = {
    render: (logged) => {

        if(logged === 'logged') {
            return `
            <img src="assets/img/Logo.png" class="logo">
            <nav class="menu">
            <ul>
            <li class="menu-list" set-menu="play"><a href="">PLAY</a></li>
            <li class="menu-list" set-menu="account"><a href="">MON COMPTE</a></li>
            </ul>
        </nav>
        `
        } else {
            return `
            <img src="assets/img/Logo.png" class="logo">
            <nav class="menu">
            <ul>
            <li class="menu-list" set-menu="login"><a href="">LOGIN</a></li>
            <li class="menu-list" set-menu="createAccount"><a href="">CREER UN COMPTE</a></li>
            </ul>
        </nav>
        `
        }
    }
}

module.exports = Menu;
},{}],8:[function(require,module,exports){
const Tutorial = {
    card: () => {

            return `
            <div class="black-filter"></div>
            <div class="exemple-card">
                <img src="assets/img/exempleCard.png">
            </div>
            <button class="close-button">Close</button>
        `
    }
}

module.exports = Tutorial;
},{}],9:[function(require,module,exports){
const Store = require('../Store');
const InitGame = require('../Components/InitGame');

const axios = require('axios');

const MiddlewareDeck = {

    baseUrl: 'http://localhost:5000',

    createOne: async (data) => {

        event.preventDefault();

        let form_data = new FormData();
        form_data.append("title", data.target.title.value);
        form_data.append("id", Store.user.id);

        const requestConfig = {
            method: 'POST',
            body: form_data,
        };

        const response = await fetch(`${MiddlewareDeck.baseUrl}/crud/deck`, requestConfig);
        const jsonResponse = await response.json();

        if(response.status === 404) {

            return false;

        } else {
            // Saving json response in local session
            userDeck = JSON.stringify(jsonResponse);
            sessionStorage.setItem('userDatas', userDeck);
            console.log("le json response est", jsonResponse)
            // Saving datas in store
            Store.user.decks.push(jsonResponse);
            console.log(Store)
            return true
        }

    },

    cpterDeck: async() => {

        const monsters = await axios(`${MiddlewareDeck.baseUrl}/crud/monster`);
        const boosters = await axios(`${MiddlewareDeck.baseUrl}/crud/booster`);

        let monstersArray = [];
        let boostersArray = [];

        // Choosing 5 random monsters and adding in arrays
        for (var i = 0; i < 5; i++) {
            let monster = monsters.data[Math.floor(Math.random()*monsters.data.length)];
            monstersArray.push(monster)       
        }

        // Choosing 3 random booster and adding in arrays
        for (var i = 0; i < 2; i++) {
            let booster = boosters.data[Math.floor(Math.random()*boosters.data.length)];
            boostersArray.push(booster)       
        }

        const deck = {monsters: monstersArray, boosters: boostersArray};

        // Saving datas in store
        Store.cpter.deck = deck;
    }
  
}

module.exports = MiddlewareDeck;
},{"../Components/InitGame":1,"../Store":11,"axios":16}],10:[function(require,module,exports){
const Store = require('../Store');

const MiddlewareLog = {

    baseUrl: 'http://localhost:5000',

    handleLogin: async (data) => {

        event.preventDefault();

        let dataForm = new FormData(data.target);

        const requestConfig = {
            method: 'POST',
            body: dataForm
        };

        const response = await fetch(`${MiddlewareLog.baseUrl}/login`, requestConfig);
		const jsonResponse = await response.json();

        if(response.status === 404) {

            return false;

        } else {

            // Saving datas in local session
            userDatas = JSON.stringify(jsonResponse);
            sessionStorage.setItem('userDatas', userDatas);

            // Saving datas in store
            Store.user = jsonResponse;
            return true;
        }
   
    },
        
    handleCreateAccount: async (data) => {

        event.preventDefault();

        let dataForm = new FormData(data.target);

        const requestConfig = {
            method: 'POST',
            body: dataForm
        }

        const response = await fetch(`${MiddlewareLog.baseUrl}/signup`, requestConfig);

        const jsonResponse = await response.json();

        const form = document.querySelector('form[id="createAccount"]');
        const paragraph = document.createElement('p');

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
            Store.user.decks = [];

            return true;
        }
    }
}

module.exports = MiddlewareLog;
},{"../Store":11}],11:[function(require,module,exports){
const Store = {

    user: {
        id: null,
        firstname: null,
        lastname: null,
        pseudo: null,
        email: null,
        victory: null,
        defeat: null,
        level: null,
        role: null,
        decks: null,
        currentDeck: {
            monsters: [],
            boosters: [],
        }
    },

    cpter: {
        deck: null,
    }
};

module.exports = Store;
},{}],12:[function(require,module,exports){

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

        cpterCard.style.position = 'relative';
        console.log("top", positionPlayerCard.top, "left", positionPlayerCard.left)
        cpterCard.animate([{
            top: '0px',
            left: '0px',
        },
        {
            top: (positionPlayerCard.top - positionCpterCard.top)+'px',
            left: (positionPlayerCard.left - positionCpterCard.left)+'px'
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
},{"./DragAndDrop":13}],13:[function(require,module,exports){

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

    getPosition: function(elt) {

        var rect = elt.getBoundingClientRect(),
        scrollLeft = window.pageXOffset || document.documentElement.scrollLeft,
        scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        return { top: rect.top + scrollTop, left: rect.left + scrollLeft }
    },

};

module.exports = dragAndDrop;
},{}],14:[function(require,module,exports){
var reloadCss = {

    init: function() {

    var link = document.getElementById("cards");

    window.onresize = function(){

        link.href += "";


     }
    },
};

module.exports = reloadCss;
},{}],15:[function(require,module,exports){
// const utils = require('./Utils/ReloadCss');

const Menu = require('./Components/Menu');
const reloadCss = require('./Utils/ReloadCss');



var app = {

init: function () {

    Menu.unLogged();
    reloadCss.init();
    // utils.reloadCss();
    // dragAndDrop.init();
},
};

document.addEventListener('DOMContentLoaded', app.init);
},{"./Components/Menu":2,"./Utils/ReloadCss":14}],16:[function(require,module,exports){
module.exports = require('./lib/axios');
},{"./lib/axios":18}],17:[function(require,module,exports){
'use strict';

var utils = require('./../utils');
var settle = require('./../core/settle');
var cookies = require('./../helpers/cookies');
var buildURL = require('./../helpers/buildURL');
var buildFullPath = require('../core/buildFullPath');
var parseHeaders = require('./../helpers/parseHeaders');
var isURLSameOrigin = require('./../helpers/isURLSameOrigin');
var createError = require('../core/createError');

module.exports = function xhrAdapter(config) {
  return new Promise(function dispatchXhrRequest(resolve, reject) {
    var requestData = config.data;
    var requestHeaders = config.headers;

    if (utils.isFormData(requestData)) {
      delete requestHeaders['Content-Type']; // Let the browser set it
    }

    var request = new XMLHttpRequest();

    // HTTP basic authentication
    if (config.auth) {
      var username = config.auth.username || '';
      var password = config.auth.password ? unescape(encodeURIComponent(config.auth.password)) : '';
      requestHeaders.Authorization = 'Basic ' + btoa(username + ':' + password);
    }

    var fullPath = buildFullPath(config.baseURL, config.url);
    request.open(config.method.toUpperCase(), buildURL(fullPath, config.params, config.paramsSerializer), true);

    // Set the request timeout in MS
    request.timeout = config.timeout;

    // Listen for ready state
    request.onreadystatechange = function handleLoad() {
      if (!request || request.readyState !== 4) {
        return;
      }

      // The request errored out and we didn't get a response, this will be
      // handled by onerror instead
      // With one exception: request that using file: protocol, most browsers
      // will return status as 0 even though it's a successful request
      if (request.status === 0 && !(request.responseURL && request.responseURL.indexOf('file:') === 0)) {
        return;
      }

      // Prepare the response
      var responseHeaders = 'getAllResponseHeaders' in request ? parseHeaders(request.getAllResponseHeaders()) : null;
      var responseData = !config.responseType || config.responseType === 'text' ? request.responseText : request.response;
      var response = {
        data: responseData,
        status: request.status,
        statusText: request.statusText,
        headers: responseHeaders,
        config: config,
        request: request
      };

      settle(resolve, reject, response);

      // Clean up request
      request = null;
    };

    // Handle browser request cancellation (as opposed to a manual cancellation)
    request.onabort = function handleAbort() {
      if (!request) {
        return;
      }

      reject(createError('Request aborted', config, 'ECONNABORTED', request));

      // Clean up request
      request = null;
    };

    // Handle low level network errors
    request.onerror = function handleError() {
      // Real errors are hidden from us by the browser
      // onerror should only fire if it's a network error
      reject(createError('Network Error', config, null, request));

      // Clean up request
      request = null;
    };

    // Handle timeout
    request.ontimeout = function handleTimeout() {
      var timeoutErrorMessage = 'timeout of ' + config.timeout + 'ms exceeded';
      if (config.timeoutErrorMessage) {
        timeoutErrorMessage = config.timeoutErrorMessage;
      }
      reject(createError(timeoutErrorMessage, config, 'ECONNABORTED',
        request));

      // Clean up request
      request = null;
    };

    // Add xsrf header
    // This is only done if running in a standard browser environment.
    // Specifically not if we're in a web worker, or react-native.
    if (utils.isStandardBrowserEnv()) {
      // Add xsrf header
      var xsrfValue = (config.withCredentials || isURLSameOrigin(fullPath)) && config.xsrfCookieName ?
        cookies.read(config.xsrfCookieName) :
        undefined;

      if (xsrfValue) {
        requestHeaders[config.xsrfHeaderName] = xsrfValue;
      }
    }

    // Add headers to the request
    if ('setRequestHeader' in request) {
      utils.forEach(requestHeaders, function setRequestHeader(val, key) {
        if (typeof requestData === 'undefined' && key.toLowerCase() === 'content-type') {
          // Remove Content-Type if data is undefined
          delete requestHeaders[key];
        } else {
          // Otherwise add header to the request
          request.setRequestHeader(key, val);
        }
      });
    }

    // Add withCredentials to request if needed
    if (!utils.isUndefined(config.withCredentials)) {
      request.withCredentials = !!config.withCredentials;
    }

    // Add responseType to request if needed
    if (config.responseType) {
      try {
        request.responseType = config.responseType;
      } catch (e) {
        // Expected DOMException thrown by browsers not compatible XMLHttpRequest Level 2.
        // But, this can be suppressed for 'json' type as it can be parsed by default 'transformResponse' function.
        if (config.responseType !== 'json') {
          throw e;
        }
      }
    }

    // Handle progress if needed
    if (typeof config.onDownloadProgress === 'function') {
      request.addEventListener('progress', config.onDownloadProgress);
    }

    // Not all browsers support upload events
    if (typeof config.onUploadProgress === 'function' && request.upload) {
      request.upload.addEventListener('progress', config.onUploadProgress);
    }

    if (config.cancelToken) {
      // Handle cancellation
      config.cancelToken.promise.then(function onCanceled(cancel) {
        if (!request) {
          return;
        }

        request.abort();
        reject(cancel);
        // Clean up request
        request = null;
      });
    }

    if (!requestData) {
      requestData = null;
    }

    // Send the request
    request.send(requestData);
  });
};

},{"../core/buildFullPath":24,"../core/createError":25,"./../core/settle":29,"./../helpers/buildURL":33,"./../helpers/cookies":35,"./../helpers/isURLSameOrigin":37,"./../helpers/parseHeaders":39,"./../utils":41}],18:[function(require,module,exports){
'use strict';

var utils = require('./utils');
var bind = require('./helpers/bind');
var Axios = require('./core/Axios');
var mergeConfig = require('./core/mergeConfig');
var defaults = require('./defaults');

/**
 * Create an instance of Axios
 *
 * @param {Object} defaultConfig The default config for the instance
 * @return {Axios} A new instance of Axios
 */
function createInstance(defaultConfig) {
  var context = new Axios(defaultConfig);
  var instance = bind(Axios.prototype.request, context);

  // Copy axios.prototype to instance
  utils.extend(instance, Axios.prototype, context);

  // Copy context to instance
  utils.extend(instance, context);

  return instance;
}

// Create the default instance to be exported
var axios = createInstance(defaults);

// Expose Axios class to allow class inheritance
axios.Axios = Axios;

// Factory for creating new instances
axios.create = function create(instanceConfig) {
  return createInstance(mergeConfig(axios.defaults, instanceConfig));
};

// Expose Cancel & CancelToken
axios.Cancel = require('./cancel/Cancel');
axios.CancelToken = require('./cancel/CancelToken');
axios.isCancel = require('./cancel/isCancel');

// Expose all/spread
axios.all = function all(promises) {
  return Promise.all(promises);
};
axios.spread = require('./helpers/spread');

module.exports = axios;

// Allow use of default import syntax in TypeScript
module.exports.default = axios;

},{"./cancel/Cancel":19,"./cancel/CancelToken":20,"./cancel/isCancel":21,"./core/Axios":22,"./core/mergeConfig":28,"./defaults":31,"./helpers/bind":32,"./helpers/spread":40,"./utils":41}],19:[function(require,module,exports){
'use strict';

/**
 * A `Cancel` is an object that is thrown when an operation is canceled.
 *
 * @class
 * @param {string=} message The message.
 */
function Cancel(message) {
  this.message = message;
}

Cancel.prototype.toString = function toString() {
  return 'Cancel' + (this.message ? ': ' + this.message : '');
};

Cancel.prototype.__CANCEL__ = true;

module.exports = Cancel;

},{}],20:[function(require,module,exports){
'use strict';

var Cancel = require('./Cancel');

/**
 * A `CancelToken` is an object that can be used to request cancellation of an operation.
 *
 * @class
 * @param {Function} executor The executor function.
 */
function CancelToken(executor) {
  if (typeof executor !== 'function') {
    throw new TypeError('executor must be a function.');
  }

  var resolvePromise;
  this.promise = new Promise(function promiseExecutor(resolve) {
    resolvePromise = resolve;
  });

  var token = this;
  executor(function cancel(message) {
    if (token.reason) {
      // Cancellation has already been requested
      return;
    }

    token.reason = new Cancel(message);
    resolvePromise(token.reason);
  });
}

/**
 * Throws a `Cancel` if cancellation has been requested.
 */
CancelToken.prototype.throwIfRequested = function throwIfRequested() {
  if (this.reason) {
    throw this.reason;
  }
};

/**
 * Returns an object that contains a new `CancelToken` and a function that, when called,
 * cancels the `CancelToken`.
 */
CancelToken.source = function source() {
  var cancel;
  var token = new CancelToken(function executor(c) {
    cancel = c;
  });
  return {
    token: token,
    cancel: cancel
  };
};

module.exports = CancelToken;

},{"./Cancel":19}],21:[function(require,module,exports){
'use strict';

module.exports = function isCancel(value) {
  return !!(value && value.__CANCEL__);
};

},{}],22:[function(require,module,exports){
'use strict';

var utils = require('./../utils');
var buildURL = require('../helpers/buildURL');
var InterceptorManager = require('./InterceptorManager');
var dispatchRequest = require('./dispatchRequest');
var mergeConfig = require('./mergeConfig');

/**
 * Create a new instance of Axios
 *
 * @param {Object} instanceConfig The default config for the instance
 */
function Axios(instanceConfig) {
  this.defaults = instanceConfig;
  this.interceptors = {
    request: new InterceptorManager(),
    response: new InterceptorManager()
  };
}

/**
 * Dispatch a request
 *
 * @param {Object} config The config specific for this request (merged with this.defaults)
 */
Axios.prototype.request = function request(config) {
  /*eslint no-param-reassign:0*/
  // Allow for axios('example/url'[, config]) a la fetch API
  if (typeof config === 'string') {
    config = arguments[1] || {};
    config.url = arguments[0];
  } else {
    config = config || {};
  }

  config = mergeConfig(this.defaults, config);

  // Set config.method
  if (config.method) {
    config.method = config.method.toLowerCase();
  } else if (this.defaults.method) {
    config.method = this.defaults.method.toLowerCase();
  } else {
    config.method = 'get';
  }

  // Hook up interceptors middleware
  var chain = [dispatchRequest, undefined];
  var promise = Promise.resolve(config);

  this.interceptors.request.forEach(function unshiftRequestInterceptors(interceptor) {
    chain.unshift(interceptor.fulfilled, interceptor.rejected);
  });

  this.interceptors.response.forEach(function pushResponseInterceptors(interceptor) {
    chain.push(interceptor.fulfilled, interceptor.rejected);
  });

  while (chain.length) {
    promise = promise.then(chain.shift(), chain.shift());
  }

  return promise;
};

Axios.prototype.getUri = function getUri(config) {
  config = mergeConfig(this.defaults, config);
  return buildURL(config.url, config.params, config.paramsSerializer).replace(/^\?/, '');
};

// Provide aliases for supported request methods
utils.forEach(['delete', 'get', 'head', 'options'], function forEachMethodNoData(method) {
  /*eslint func-names:0*/
  Axios.prototype[method] = function(url, config) {
    return this.request(mergeConfig(config || {}, {
      method: method,
      url: url,
      data: (config || {}).data
    }));
  };
});

utils.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
  /*eslint func-names:0*/
  Axios.prototype[method] = function(url, data, config) {
    return this.request(mergeConfig(config || {}, {
      method: method,
      url: url,
      data: data
    }));
  };
});

module.exports = Axios;

},{"../helpers/buildURL":33,"./../utils":41,"./InterceptorManager":23,"./dispatchRequest":26,"./mergeConfig":28}],23:[function(require,module,exports){
'use strict';

var utils = require('./../utils');

function InterceptorManager() {
  this.handlers = [];
}

/**
 * Add a new interceptor to the stack
 *
 * @param {Function} fulfilled The function to handle `then` for a `Promise`
 * @param {Function} rejected The function to handle `reject` for a `Promise`
 *
 * @return {Number} An ID used to remove interceptor later
 */
InterceptorManager.prototype.use = function use(fulfilled, rejected) {
  this.handlers.push({
    fulfilled: fulfilled,
    rejected: rejected
  });
  return this.handlers.length - 1;
};

/**
 * Remove an interceptor from the stack
 *
 * @param {Number} id The ID that was returned by `use`
 */
InterceptorManager.prototype.eject = function eject(id) {
  if (this.handlers[id]) {
    this.handlers[id] = null;
  }
};

/**
 * Iterate over all the registered interceptors
 *
 * This method is particularly useful for skipping over any
 * interceptors that may have become `null` calling `eject`.
 *
 * @param {Function} fn The function to call for each interceptor
 */
InterceptorManager.prototype.forEach = function forEach(fn) {
  utils.forEach(this.handlers, function forEachHandler(h) {
    if (h !== null) {
      fn(h);
    }
  });
};

module.exports = InterceptorManager;

},{"./../utils":41}],24:[function(require,module,exports){
'use strict';

var isAbsoluteURL = require('../helpers/isAbsoluteURL');
var combineURLs = require('../helpers/combineURLs');

/**
 * Creates a new URL by combining the baseURL with the requestedURL,
 * only when the requestedURL is not already an absolute URL.
 * If the requestURL is absolute, this function returns the requestedURL untouched.
 *
 * @param {string} baseURL The base URL
 * @param {string} requestedURL Absolute or relative URL to combine
 * @returns {string} The combined full path
 */
module.exports = function buildFullPath(baseURL, requestedURL) {
  if (baseURL && !isAbsoluteURL(requestedURL)) {
    return combineURLs(baseURL, requestedURL);
  }
  return requestedURL;
};

},{"../helpers/combineURLs":34,"../helpers/isAbsoluteURL":36}],25:[function(require,module,exports){
'use strict';

var enhanceError = require('./enhanceError');

/**
 * Create an Error with the specified message, config, error code, request and response.
 *
 * @param {string} message The error message.
 * @param {Object} config The config.
 * @param {string} [code] The error code (for example, 'ECONNABORTED').
 * @param {Object} [request] The request.
 * @param {Object} [response] The response.
 * @returns {Error} The created error.
 */
module.exports = function createError(message, config, code, request, response) {
  var error = new Error(message);
  return enhanceError(error, config, code, request, response);
};

},{"./enhanceError":27}],26:[function(require,module,exports){
'use strict';

var utils = require('./../utils');
var transformData = require('./transformData');
var isCancel = require('../cancel/isCancel');
var defaults = require('../defaults');

/**
 * Throws a `Cancel` if cancellation has been requested.
 */
function throwIfCancellationRequested(config) {
  if (config.cancelToken) {
    config.cancelToken.throwIfRequested();
  }
}

/**
 * Dispatch a request to the server using the configured adapter.
 *
 * @param {object} config The config that is to be used for the request
 * @returns {Promise} The Promise to be fulfilled
 */
module.exports = function dispatchRequest(config) {
  throwIfCancellationRequested(config);

  // Ensure headers exist
  config.headers = config.headers || {};

  // Transform request data
  config.data = transformData(
    config.data,
    config.headers,
    config.transformRequest
  );

  // Flatten headers
  config.headers = utils.merge(
    config.headers.common || {},
    config.headers[config.method] || {},
    config.headers
  );

  utils.forEach(
    ['delete', 'get', 'head', 'post', 'put', 'patch', 'common'],
    function cleanHeaderConfig(method) {
      delete config.headers[method];
    }
  );

  var adapter = config.adapter || defaults.adapter;

  return adapter(config).then(function onAdapterResolution(response) {
    throwIfCancellationRequested(config);

    // Transform response data
    response.data = transformData(
      response.data,
      response.headers,
      config.transformResponse
    );

    return response;
  }, function onAdapterRejection(reason) {
    if (!isCancel(reason)) {
      throwIfCancellationRequested(config);

      // Transform response data
      if (reason && reason.response) {
        reason.response.data = transformData(
          reason.response.data,
          reason.response.headers,
          config.transformResponse
        );
      }
    }

    return Promise.reject(reason);
  });
};

},{"../cancel/isCancel":21,"../defaults":31,"./../utils":41,"./transformData":30}],27:[function(require,module,exports){
'use strict';

/**
 * Update an Error with the specified config, error code, and response.
 *
 * @param {Error} error The error to update.
 * @param {Object} config The config.
 * @param {string} [code] The error code (for example, 'ECONNABORTED').
 * @param {Object} [request] The request.
 * @param {Object} [response] The response.
 * @returns {Error} The error.
 */
module.exports = function enhanceError(error, config, code, request, response) {
  error.config = config;
  if (code) {
    error.code = code;
  }

  error.request = request;
  error.response = response;
  error.isAxiosError = true;

  error.toJSON = function toJSON() {
    return {
      // Standard
      message: this.message,
      name: this.name,
      // Microsoft
      description: this.description,
      number: this.number,
      // Mozilla
      fileName: this.fileName,
      lineNumber: this.lineNumber,
      columnNumber: this.columnNumber,
      stack: this.stack,
      // Axios
      config: this.config,
      code: this.code
    };
  };
  return error;
};

},{}],28:[function(require,module,exports){
'use strict';

var utils = require('../utils');

/**
 * Config-specific merge-function which creates a new config-object
 * by merging two configuration objects together.
 *
 * @param {Object} config1
 * @param {Object} config2
 * @returns {Object} New object resulting from merging config2 to config1
 */
module.exports = function mergeConfig(config1, config2) {
  // eslint-disable-next-line no-param-reassign
  config2 = config2 || {};
  var config = {};

  var valueFromConfig2Keys = ['url', 'method', 'data'];
  var mergeDeepPropertiesKeys = ['headers', 'auth', 'proxy', 'params'];
  var defaultToConfig2Keys = [
    'baseURL', 'transformRequest', 'transformResponse', 'paramsSerializer',
    'timeout', 'timeoutMessage', 'withCredentials', 'adapter', 'responseType', 'xsrfCookieName',
    'xsrfHeaderName', 'onUploadProgress', 'onDownloadProgress', 'decompress',
    'maxContentLength', 'maxBodyLength', 'maxRedirects', 'transport', 'httpAgent',
    'httpsAgent', 'cancelToken', 'socketPath', 'responseEncoding'
  ];
  var directMergeKeys = ['validateStatus'];

  function getMergedValue(target, source) {
    if (utils.isPlainObject(target) && utils.isPlainObject(source)) {
      return utils.merge(target, source);
    } else if (utils.isPlainObject(source)) {
      return utils.merge({}, source);
    } else if (utils.isArray(source)) {
      return source.slice();
    }
    return source;
  }

  function mergeDeepProperties(prop) {
    if (!utils.isUndefined(config2[prop])) {
      config[prop] = getMergedValue(config1[prop], config2[prop]);
    } else if (!utils.isUndefined(config1[prop])) {
      config[prop] = getMergedValue(undefined, config1[prop]);
    }
  }

  utils.forEach(valueFromConfig2Keys, function valueFromConfig2(prop) {
    if (!utils.isUndefined(config2[prop])) {
      config[prop] = getMergedValue(undefined, config2[prop]);
    }
  });

  utils.forEach(mergeDeepPropertiesKeys, mergeDeepProperties);

  utils.forEach(defaultToConfig2Keys, function defaultToConfig2(prop) {
    if (!utils.isUndefined(config2[prop])) {
      config[prop] = getMergedValue(undefined, config2[prop]);
    } else if (!utils.isUndefined(config1[prop])) {
      config[prop] = getMergedValue(undefined, config1[prop]);
    }
  });

  utils.forEach(directMergeKeys, function merge(prop) {
    if (prop in config2) {
      config[prop] = getMergedValue(config1[prop], config2[prop]);
    } else if (prop in config1) {
      config[prop] = getMergedValue(undefined, config1[prop]);
    }
  });

  var axiosKeys = valueFromConfig2Keys
    .concat(mergeDeepPropertiesKeys)
    .concat(defaultToConfig2Keys)
    .concat(directMergeKeys);

  var otherKeys = Object
    .keys(config1)
    .concat(Object.keys(config2))
    .filter(function filterAxiosKeys(key) {
      return axiosKeys.indexOf(key) === -1;
    });

  utils.forEach(otherKeys, mergeDeepProperties);

  return config;
};

},{"../utils":41}],29:[function(require,module,exports){
'use strict';

var createError = require('./createError');

/**
 * Resolve or reject a Promise based on response status.
 *
 * @param {Function} resolve A function that resolves the promise.
 * @param {Function} reject A function that rejects the promise.
 * @param {object} response The response.
 */
module.exports = function settle(resolve, reject, response) {
  var validateStatus = response.config.validateStatus;
  if (!response.status || !validateStatus || validateStatus(response.status)) {
    resolve(response);
  } else {
    reject(createError(
      'Request failed with status code ' + response.status,
      response.config,
      null,
      response.request,
      response
    ));
  }
};

},{"./createError":25}],30:[function(require,module,exports){
'use strict';

var utils = require('./../utils');

/**
 * Transform the data for a request or a response
 *
 * @param {Object|String} data The data to be transformed
 * @param {Array} headers The headers for the request or response
 * @param {Array|Function} fns A single function or Array of functions
 * @returns {*} The resulting transformed data
 */
module.exports = function transformData(data, headers, fns) {
  /*eslint no-param-reassign:0*/
  utils.forEach(fns, function transform(fn) {
    data = fn(data, headers);
  });

  return data;
};

},{"./../utils":41}],31:[function(require,module,exports){
(function (process){(function (){
'use strict';

var utils = require('./utils');
var normalizeHeaderName = require('./helpers/normalizeHeaderName');

var DEFAULT_CONTENT_TYPE = {
  'Content-Type': 'application/x-www-form-urlencoded'
};

function setContentTypeIfUnset(headers, value) {
  if (!utils.isUndefined(headers) && utils.isUndefined(headers['Content-Type'])) {
    headers['Content-Type'] = value;
  }
}

function getDefaultAdapter() {
  var adapter;
  if (typeof XMLHttpRequest !== 'undefined') {
    // For browsers use XHR adapter
    adapter = require('./adapters/xhr');
  } else if (typeof process !== 'undefined' && Object.prototype.toString.call(process) === '[object process]') {
    // For node use HTTP adapter
    adapter = require('./adapters/http');
  }
  return adapter;
}

var defaults = {
  adapter: getDefaultAdapter(),

  transformRequest: [function transformRequest(data, headers) {
    normalizeHeaderName(headers, 'Accept');
    normalizeHeaderName(headers, 'Content-Type');
    if (utils.isFormData(data) ||
      utils.isArrayBuffer(data) ||
      utils.isBuffer(data) ||
      utils.isStream(data) ||
      utils.isFile(data) ||
      utils.isBlob(data)
    ) {
      return data;
    }
    if (utils.isArrayBufferView(data)) {
      return data.buffer;
    }
    if (utils.isURLSearchParams(data)) {
      setContentTypeIfUnset(headers, 'application/x-www-form-urlencoded;charset=utf-8');
      return data.toString();
    }
    if (utils.isObject(data)) {
      setContentTypeIfUnset(headers, 'application/json;charset=utf-8');
      return JSON.stringify(data);
    }
    return data;
  }],

  transformResponse: [function transformResponse(data) {
    /*eslint no-param-reassign:0*/
    if (typeof data === 'string') {
      try {
        data = JSON.parse(data);
      } catch (e) { /* Ignore */ }
    }
    return data;
  }],

  /**
   * A timeout in milliseconds to abort a request. If set to 0 (default) a
   * timeout is not created.
   */
  timeout: 0,

  xsrfCookieName: 'XSRF-TOKEN',
  xsrfHeaderName: 'X-XSRF-TOKEN',

  maxContentLength: -1,
  maxBodyLength: -1,

  validateStatus: function validateStatus(status) {
    return status >= 200 && status < 300;
  }
};

defaults.headers = {
  common: {
    'Accept': 'application/json, text/plain, */*'
  }
};

utils.forEach(['delete', 'get', 'head'], function forEachMethodNoData(method) {
  defaults.headers[method] = {};
});

utils.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
  defaults.headers[method] = utils.merge(DEFAULT_CONTENT_TYPE);
});

module.exports = defaults;

}).call(this)}).call(this,require('_process'))
},{"./adapters/http":17,"./adapters/xhr":17,"./helpers/normalizeHeaderName":38,"./utils":41,"_process":42}],32:[function(require,module,exports){
'use strict';

module.exports = function bind(fn, thisArg) {
  return function wrap() {
    var args = new Array(arguments.length);
    for (var i = 0; i < args.length; i++) {
      args[i] = arguments[i];
    }
    return fn.apply(thisArg, args);
  };
};

},{}],33:[function(require,module,exports){
'use strict';

var utils = require('./../utils');

function encode(val) {
  return encodeURIComponent(val).
    replace(/%3A/gi, ':').
    replace(/%24/g, '$').
    replace(/%2C/gi, ',').
    replace(/%20/g, '+').
    replace(/%5B/gi, '[').
    replace(/%5D/gi, ']');
}

/**
 * Build a URL by appending params to the end
 *
 * @param {string} url The base of the url (e.g., http://www.google.com)
 * @param {object} [params] The params to be appended
 * @returns {string} The formatted url
 */
module.exports = function buildURL(url, params, paramsSerializer) {
  /*eslint no-param-reassign:0*/
  if (!params) {
    return url;
  }

  var serializedParams;
  if (paramsSerializer) {
    serializedParams = paramsSerializer(params);
  } else if (utils.isURLSearchParams(params)) {
    serializedParams = params.toString();
  } else {
    var parts = [];

    utils.forEach(params, function serialize(val, key) {
      if (val === null || typeof val === 'undefined') {
        return;
      }

      if (utils.isArray(val)) {
        key = key + '[]';
      } else {
        val = [val];
      }

      utils.forEach(val, function parseValue(v) {
        if (utils.isDate(v)) {
          v = v.toISOString();
        } else if (utils.isObject(v)) {
          v = JSON.stringify(v);
        }
        parts.push(encode(key) + '=' + encode(v));
      });
    });

    serializedParams = parts.join('&');
  }

  if (serializedParams) {
    var hashmarkIndex = url.indexOf('#');
    if (hashmarkIndex !== -1) {
      url = url.slice(0, hashmarkIndex);
    }

    url += (url.indexOf('?') === -1 ? '?' : '&') + serializedParams;
  }

  return url;
};

},{"./../utils":41}],34:[function(require,module,exports){
'use strict';

/**
 * Creates a new URL by combining the specified URLs
 *
 * @param {string} baseURL The base URL
 * @param {string} relativeURL The relative URL
 * @returns {string} The combined URL
 */
module.exports = function combineURLs(baseURL, relativeURL) {
  return relativeURL
    ? baseURL.replace(/\/+$/, '') + '/' + relativeURL.replace(/^\/+/, '')
    : baseURL;
};

},{}],35:[function(require,module,exports){
'use strict';

var utils = require('./../utils');

module.exports = (
  utils.isStandardBrowserEnv() ?

  // Standard browser envs support document.cookie
    (function standardBrowserEnv() {
      return {
        write: function write(name, value, expires, path, domain, secure) {
          var cookie = [];
          cookie.push(name + '=' + encodeURIComponent(value));

          if (utils.isNumber(expires)) {
            cookie.push('expires=' + new Date(expires).toGMTString());
          }

          if (utils.isString(path)) {
            cookie.push('path=' + path);
          }

          if (utils.isString(domain)) {
            cookie.push('domain=' + domain);
          }

          if (secure === true) {
            cookie.push('secure');
          }

          document.cookie = cookie.join('; ');
        },

        read: function read(name) {
          var match = document.cookie.match(new RegExp('(^|;\\s*)(' + name + ')=([^;]*)'));
          return (match ? decodeURIComponent(match[3]) : null);
        },

        remove: function remove(name) {
          this.write(name, '', Date.now() - 86400000);
        }
      };
    })() :

  // Non standard browser env (web workers, react-native) lack needed support.
    (function nonStandardBrowserEnv() {
      return {
        write: function write() {},
        read: function read() { return null; },
        remove: function remove() {}
      };
    })()
);

},{"./../utils":41}],36:[function(require,module,exports){
'use strict';

/**
 * Determines whether the specified URL is absolute
 *
 * @param {string} url The URL to test
 * @returns {boolean} True if the specified URL is absolute, otherwise false
 */
module.exports = function isAbsoluteURL(url) {
  // A URL is considered absolute if it begins with "<scheme>://" or "//" (protocol-relative URL).
  // RFC 3986 defines scheme name as a sequence of characters beginning with a letter and followed
  // by any combination of letters, digits, plus, period, or hyphen.
  return /^([a-z][a-z\d\+\-\.]*:)?\/\//i.test(url);
};

},{}],37:[function(require,module,exports){
'use strict';

var utils = require('./../utils');

module.exports = (
  utils.isStandardBrowserEnv() ?

  // Standard browser envs have full support of the APIs needed to test
  // whether the request URL is of the same origin as current location.
    (function standardBrowserEnv() {
      var msie = /(msie|trident)/i.test(navigator.userAgent);
      var urlParsingNode = document.createElement('a');
      var originURL;

      /**
    * Parse a URL to discover it's components
    *
    * @param {String} url The URL to be parsed
    * @returns {Object}
    */
      function resolveURL(url) {
        var href = url;

        if (msie) {
        // IE needs attribute set twice to normalize properties
          urlParsingNode.setAttribute('href', href);
          href = urlParsingNode.href;
        }

        urlParsingNode.setAttribute('href', href);

        // urlParsingNode provides the UrlUtils interface - http://url.spec.whatwg.org/#urlutils
        return {
          href: urlParsingNode.href,
          protocol: urlParsingNode.protocol ? urlParsingNode.protocol.replace(/:$/, '') : '',
          host: urlParsingNode.host,
          search: urlParsingNode.search ? urlParsingNode.search.replace(/^\?/, '') : '',
          hash: urlParsingNode.hash ? urlParsingNode.hash.replace(/^#/, '') : '',
          hostname: urlParsingNode.hostname,
          port: urlParsingNode.port,
          pathname: (urlParsingNode.pathname.charAt(0) === '/') ?
            urlParsingNode.pathname :
            '/' + urlParsingNode.pathname
        };
      }

      originURL = resolveURL(window.location.href);

      /**
    * Determine if a URL shares the same origin as the current location
    *
    * @param {String} requestURL The URL to test
    * @returns {boolean} True if URL shares the same origin, otherwise false
    */
      return function isURLSameOrigin(requestURL) {
        var parsed = (utils.isString(requestURL)) ? resolveURL(requestURL) : requestURL;
        return (parsed.protocol === originURL.protocol &&
            parsed.host === originURL.host);
      };
    })() :

  // Non standard browser envs (web workers, react-native) lack needed support.
    (function nonStandardBrowserEnv() {
      return function isURLSameOrigin() {
        return true;
      };
    })()
);

},{"./../utils":41}],38:[function(require,module,exports){
'use strict';

var utils = require('../utils');

module.exports = function normalizeHeaderName(headers, normalizedName) {
  utils.forEach(headers, function processHeader(value, name) {
    if (name !== normalizedName && name.toUpperCase() === normalizedName.toUpperCase()) {
      headers[normalizedName] = value;
      delete headers[name];
    }
  });
};

},{"../utils":41}],39:[function(require,module,exports){
'use strict';

var utils = require('./../utils');

// Headers whose duplicates are ignored by node
// c.f. https://nodejs.org/api/http.html#http_message_headers
var ignoreDuplicateOf = [
  'age', 'authorization', 'content-length', 'content-type', 'etag',
  'expires', 'from', 'host', 'if-modified-since', 'if-unmodified-since',
  'last-modified', 'location', 'max-forwards', 'proxy-authorization',
  'referer', 'retry-after', 'user-agent'
];

/**
 * Parse headers into an object
 *
 * ```
 * Date: Wed, 27 Aug 2014 08:58:49 GMT
 * Content-Type: application/json
 * Connection: keep-alive
 * Transfer-Encoding: chunked
 * ```
 *
 * @param {String} headers Headers needing to be parsed
 * @returns {Object} Headers parsed into an object
 */
module.exports = function parseHeaders(headers) {
  var parsed = {};
  var key;
  var val;
  var i;

  if (!headers) { return parsed; }

  utils.forEach(headers.split('\n'), function parser(line) {
    i = line.indexOf(':');
    key = utils.trim(line.substr(0, i)).toLowerCase();
    val = utils.trim(line.substr(i + 1));

    if (key) {
      if (parsed[key] && ignoreDuplicateOf.indexOf(key) >= 0) {
        return;
      }
      if (key === 'set-cookie') {
        parsed[key] = (parsed[key] ? parsed[key] : []).concat([val]);
      } else {
        parsed[key] = parsed[key] ? parsed[key] + ', ' + val : val;
      }
    }
  });

  return parsed;
};

},{"./../utils":41}],40:[function(require,module,exports){
'use strict';

/**
 * Syntactic sugar for invoking a function and expanding an array for arguments.
 *
 * Common use case would be to use `Function.prototype.apply`.
 *
 *  ```js
 *  function f(x, y, z) {}
 *  var args = [1, 2, 3];
 *  f.apply(null, args);
 *  ```
 *
 * With `spread` this example can be re-written.
 *
 *  ```js
 *  spread(function(x, y, z) {})([1, 2, 3]);
 *  ```
 *
 * @param {Function} callback
 * @returns {Function}
 */
module.exports = function spread(callback) {
  return function wrap(arr) {
    return callback.apply(null, arr);
  };
};

},{}],41:[function(require,module,exports){
'use strict';

var bind = require('./helpers/bind');

/*global toString:true*/

// utils is a library of generic helper functions non-specific to axios

var toString = Object.prototype.toString;

/**
 * Determine if a value is an Array
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an Array, otherwise false
 */
function isArray(val) {
  return toString.call(val) === '[object Array]';
}

/**
 * Determine if a value is undefined
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if the value is undefined, otherwise false
 */
function isUndefined(val) {
  return typeof val === 'undefined';
}

/**
 * Determine if a value is a Buffer
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Buffer, otherwise false
 */
function isBuffer(val) {
  return val !== null && !isUndefined(val) && val.constructor !== null && !isUndefined(val.constructor)
    && typeof val.constructor.isBuffer === 'function' && val.constructor.isBuffer(val);
}

/**
 * Determine if a value is an ArrayBuffer
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an ArrayBuffer, otherwise false
 */
function isArrayBuffer(val) {
  return toString.call(val) === '[object ArrayBuffer]';
}

/**
 * Determine if a value is a FormData
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an FormData, otherwise false
 */
function isFormData(val) {
  return (typeof FormData !== 'undefined') && (val instanceof FormData);
}

/**
 * Determine if a value is a view on an ArrayBuffer
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a view on an ArrayBuffer, otherwise false
 */
function isArrayBufferView(val) {
  var result;
  if ((typeof ArrayBuffer !== 'undefined') && (ArrayBuffer.isView)) {
    result = ArrayBuffer.isView(val);
  } else {
    result = (val) && (val.buffer) && (val.buffer instanceof ArrayBuffer);
  }
  return result;
}

/**
 * Determine if a value is a String
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a String, otherwise false
 */
function isString(val) {
  return typeof val === 'string';
}

/**
 * Determine if a value is a Number
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Number, otherwise false
 */
function isNumber(val) {
  return typeof val === 'number';
}

/**
 * Determine if a value is an Object
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an Object, otherwise false
 */
function isObject(val) {
  return val !== null && typeof val === 'object';
}

/**
 * Determine if a value is a plain Object
 *
 * @param {Object} val The value to test
 * @return {boolean} True if value is a plain Object, otherwise false
 */
function isPlainObject(val) {
  if (toString.call(val) !== '[object Object]') {
    return false;
  }

  var prototype = Object.getPrototypeOf(val);
  return prototype === null || prototype === Object.prototype;
}

/**
 * Determine if a value is a Date
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Date, otherwise false
 */
function isDate(val) {
  return toString.call(val) === '[object Date]';
}

/**
 * Determine if a value is a File
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a File, otherwise false
 */
function isFile(val) {
  return toString.call(val) === '[object File]';
}

/**
 * Determine if a value is a Blob
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Blob, otherwise false
 */
function isBlob(val) {
  return toString.call(val) === '[object Blob]';
}

/**
 * Determine if a value is a Function
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Function, otherwise false
 */
function isFunction(val) {
  return toString.call(val) === '[object Function]';
}

/**
 * Determine if a value is a Stream
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Stream, otherwise false
 */
function isStream(val) {
  return isObject(val) && isFunction(val.pipe);
}

/**
 * Determine if a value is a URLSearchParams object
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a URLSearchParams object, otherwise false
 */
function isURLSearchParams(val) {
  return typeof URLSearchParams !== 'undefined' && val instanceof URLSearchParams;
}

/**
 * Trim excess whitespace off the beginning and end of a string
 *
 * @param {String} str The String to trim
 * @returns {String} The String freed of excess whitespace
 */
function trim(str) {
  return str.replace(/^\s*/, '').replace(/\s*$/, '');
}

/**
 * Determine if we're running in a standard browser environment
 *
 * This allows axios to run in a web worker, and react-native.
 * Both environments support XMLHttpRequest, but not fully standard globals.
 *
 * web workers:
 *  typeof window -> undefined
 *  typeof document -> undefined
 *
 * react-native:
 *  navigator.product -> 'ReactNative'
 * nativescript
 *  navigator.product -> 'NativeScript' or 'NS'
 */
function isStandardBrowserEnv() {
  if (typeof navigator !== 'undefined' && (navigator.product === 'ReactNative' ||
                                           navigator.product === 'NativeScript' ||
                                           navigator.product === 'NS')) {
    return false;
  }
  return (
    typeof window !== 'undefined' &&
    typeof document !== 'undefined'
  );
}

/**
 * Iterate over an Array or an Object invoking a function for each item.
 *
 * If `obj` is an Array callback will be called passing
 * the value, index, and complete array for each item.
 *
 * If 'obj' is an Object callback will be called passing
 * the value, key, and complete object for each property.
 *
 * @param {Object|Array} obj The object to iterate
 * @param {Function} fn The callback to invoke for each item
 */
function forEach(obj, fn) {
  // Don't bother if no value provided
  if (obj === null || typeof obj === 'undefined') {
    return;
  }

  // Force an array if not already something iterable
  if (typeof obj !== 'object') {
    /*eslint no-param-reassign:0*/
    obj = [obj];
  }

  if (isArray(obj)) {
    // Iterate over array values
    for (var i = 0, l = obj.length; i < l; i++) {
      fn.call(null, obj[i], i, obj);
    }
  } else {
    // Iterate over object keys
    for (var key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        fn.call(null, obj[key], key, obj);
      }
    }
  }
}

/**
 * Accepts varargs expecting each argument to be an object, then
 * immutably merges the properties of each object and returns result.
 *
 * When multiple objects contain the same key the later object in
 * the arguments list will take precedence.
 *
 * Example:
 *
 * ```js
 * var result = merge({foo: 123}, {foo: 456});
 * console.log(result.foo); // outputs 456
 * ```
 *
 * @param {Object} obj1 Object to merge
 * @returns {Object} Result of all merge properties
 */
function merge(/* obj1, obj2, obj3, ... */) {
  var result = {};
  function assignValue(val, key) {
    if (isPlainObject(result[key]) && isPlainObject(val)) {
      result[key] = merge(result[key], val);
    } else if (isPlainObject(val)) {
      result[key] = merge({}, val);
    } else if (isArray(val)) {
      result[key] = val.slice();
    } else {
      result[key] = val;
    }
  }

  for (var i = 0, l = arguments.length; i < l; i++) {
    forEach(arguments[i], assignValue);
  }
  return result;
}

/**
 * Extends object a by mutably adding to it the properties of object b.
 *
 * @param {Object} a The object to be extended
 * @param {Object} b The object to copy properties from
 * @param {Object} thisArg The object to bind function to
 * @return {Object} The resulting value of object a
 */
function extend(a, b, thisArg) {
  forEach(b, function assignValue(val, key) {
    if (thisArg && typeof val === 'function') {
      a[key] = bind(val, thisArg);
    } else {
      a[key] = val;
    }
  });
  return a;
}

/**
 * Remove byte order marker. This catches EF BB BF (the UTF-8 BOM)
 *
 * @param {string} content with BOM
 * @return {string} content value without BOM
 */
function stripBOM(content) {
  if (content.charCodeAt(0) === 0xFEFF) {
    content = content.slice(1);
  }
  return content;
}

module.exports = {
  isArray: isArray,
  isArrayBuffer: isArrayBuffer,
  isBuffer: isBuffer,
  isFormData: isFormData,
  isArrayBufferView: isArrayBufferView,
  isString: isString,
  isNumber: isNumber,
  isObject: isObject,
  isPlainObject: isPlainObject,
  isUndefined: isUndefined,
  isDate: isDate,
  isFile: isFile,
  isBlob: isBlob,
  isFunction: isFunction,
  isStream: isStream,
  isURLSearchParams: isURLSearchParams,
  isStandardBrowserEnv: isStandardBrowserEnv,
  forEach: forEach,
  merge: merge,
  extend: extend,
  trim: trim,
  stripBOM: stripBOM
};

},{"./helpers/bind":32}],42:[function(require,module,exports){
// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}]},{},[15]);
