
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