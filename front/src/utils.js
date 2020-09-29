
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