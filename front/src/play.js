const utils = require('./utils');
const cardGenerator = require('./cardGenerator');
const dragAndDrop = require('./dragAndDrop');

const play = {

    state: {
        playerCardsOnBoard: 0,
        cpterCardsOnBoard: 0,
        playerRound: true,
        playerDeck: null,
        cpterDeck: null,
        },
  

    launchGame: async function(playerDeck) {

        // CLEAR DISPLAY
        utils.clearEverything();

        utils.createBoardGame();

        cpterDeck = await cardGenerator.cpterDeck();

        play.state.playerDeck = playerDeck;
        play.state.cpterDeck = cpterDeck;
         
        cardGenerator.monsters(playerDeck.monsters, 'player')
        cardGenerator.boosters(playerDeck.boosters, 'player')

        play.dragAndDrop();

        play.game();
    },

    game: function() {

        // console.log(play.state.playerDeck.monsters);
        // console.log(play.state.playerDeck.boosters);
        // console.log(play.state.cpterDeck.monsters)
        // console.log(play.state.cpterDeck.boosters)

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
            const cpterDeck = play.state.cpterDeck.monsters;
            let monster = [cpterDeck[Math.floor(Math.random()*cpterDeck.length)]];

            // Generating card on board
            cardGenerator.monsters(monster, 'cpter')

            // Find index of selected card
            let indexMonster = null;

            for(var i = 0; i < cpterDeck.length; i += 1) {
                if(cpterDeck[i].id === monster[0].id) {
                    indexMonster = i;
                }
            }
            // Remove card from deck in hand
            play.state.cpterDeck.monsters.splice(indexMonster, 1);

        // IF COMPUTER PLAY A CARD

            infosField.innerHTML = 'A vous de jouer !'; }, 1000);

    
    
    // END OF ROUND


        play.state.playerRound = true;
        play.game();
    },

    fight: function(attacker, defenser) {
        console.log('hello')
        // formule math : value = attack currentPlayer - defense otherPlayer
            // si value <= 0 : hit-point = random number between 0 & 2
            // si value > 0 : hit-point = random number between value & value +2.

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
    
    
            const dropArea = document.querySelector(`.${elementMouseIsOver.className}`);
            
            // Handle where user can drop cards
            if((dropArea.className === 'sideArea') || (dropArea.className === 'cpterCards') || (dropArea.className === 'playerCard')) {
                alert('pas ici malheureux !')
            } else {
                if((dropArea.className === 'drop-area') || (dropArea.className === 'playerCards')) {
                    dropArea.appendChild(card);
                    play.listenDrop();
                } else if(dropArea.closest('.cpterCard')) {
                    // Ajouter une condition, si carte booster on ne fait rien (ou message alerte pas possible)
                    console.log('le combat peut commencer !')
                    console.log(elementMouseIsOver.closest('.cpterCard'))
                    // play.fight();
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