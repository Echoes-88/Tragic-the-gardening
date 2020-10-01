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

    fightMoveCpter: function() {
        
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


        const infosField = document.querySelector('.infosField');
        infosField.innerHTML = 'Posez une carte sur le plateau ou attaquez une carte ennemie';
    
    
        const cards = document.getElementsByClassName('cardComponent');
    
        for (const card of cards) {
            new Drag(card);
    ;
            card.addEventListener('dragend', function () {
    
            var x = event.clientX, y = event.clientY,
            elementMouseIsOver = document.elementFromPoint(x, y);
    

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

            




                        
            // if((elementMouseIsOver.className === 'sideArea') || (elementMouseIsOver.className === 'cpterCards') || (elementMouseIsOver.className === 'playerCard')) {
            //     alert('pas ici malheureux !')
            // } else {

            //     if(card.classList.contains("booster")) {

            //         if (elementMouseIsOver.className === 'drop-area') {
            //             alert('Vous devez poser la carte booster sur une de vos cartes au choix')          
            //         } else if (elementMouseIsOver.parentNode.dataset.player === 'cpterDeck') {
            //             alert('Vous ne pouvez pas poser votre booster sur une carte de l\'adversaire');
            //         } else {
            //             console.log('on vise une carte sur notre board')
            //         }

            //     } else if(card.classList.contains("monster")) {

            //         if ((elementMouseIsOver.className === 'playerCards') || (elementMouseIsOver.className === 'drop-area')){
            //             elementMouseIsOver.appendChild(card);
            //             play.listenDrop();
            //         } if (elementMouseIsOver.parentNode.dataset.player === 'playerDeck') {
            //             alert('vous devez poser votre carte sur le plateau de jeu')
            //         } if(elementMouseIsOver.parentNode.dataset.player === 'cpterDeck') {
            //             // Ajouter une condition, si carte booster on ne fait rien (ou message alerte pas possible)
            //             const cpterCard = elementMouseIsOver.closest('.cardComponent');
        
            //             if(card.classList.contains("booster")) {
            //                 alert('vous ne pouvez pas combattre avec une carte booster')
            //             } else {
            //                 play.fight(card, cpterCard);
            //             }
            //         }
    
            //     }
            // }

 
    
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