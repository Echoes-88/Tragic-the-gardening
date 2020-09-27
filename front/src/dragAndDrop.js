const play = require('./play');

const dragAndDrop = {


    state: {
        playerCardsOnBoard: 0,
        cpterCardsOnBoard: 0,
        gameInProgress: true,
        },


    init: function() {

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
        console.log(dropArea);
        
        if(dropArea != 'drop-area') {
            alert('pas ici malheureux !')
        } else {
            dropArea.appendChild(card);
            dragAndDrop.listenDrop();
        }

        


    });

    }

    },

    listenDrop: function() {

        let nbrOfChildren = document.querySelector('.drop-area').childElementCount;

        const endOfRoundButton = document.querySelector('.endOfRound');

        const infosField = document.querySelector('.infosField');
        infosField.innerHTML = '';

        if(dragAndDrop.state.playerCardsOnBoard == nbrOfChildren - 1) {
            infosField.textContent = 'Cliquez sur "end of round" pour valider votre carte';
            endOfRoundButton.classList.remove('inactive');
            play.state.roundInProgress = false;

            // MISE A JOUR DES PLAYERSCARDSONBOARD + DONNER ACCES A FINIR SON TOUR
        } else if(dragAndDrop.state.playerCardsOnBoard < nbrOfChildren)  {
            infosField.textContent = 'Vous ne pouvez jouer qu\'une carte par tour, veuillez en retirer';
        } else if(dragAndDrop.state.playerCardsOnBoard >= nbrOfChildren)  {
            infosField.textContent = 'Veuillez insérer une carte sur le plateau';
        } else {
            console.log('error')
        }
    }
};

module.exports = dragAndDrop;