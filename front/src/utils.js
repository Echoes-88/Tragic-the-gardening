
const moduleUtils = {

    // VERIFIER SI CE PARAMETRE EST UTILE, COMMENT MODIFIER APRES ?
    baseUrl: 'http://localhost:2000',

    showLoginForm: function() {
        event.preventDefault();
        const loginForm = document.querySelector('form[id="login"]')
        const menu = document.querySelector('.menu')

        // On desactive l'affichage du menu
        menu.classList.remove('is-active');
        menu.classList.add('displayNone');

        // On active l'affichage du formulaire login
        loginForm.classList.remove('displayNone');
        loginForm.classList.add('is-active');

        // const loginButton = loginForm.querySelector('button[type="submit"');

        // au click de validation du form login je verifie l'existence de l'utilisateur
        loginForm.addEventListener('submit', function(data){
            event.preventDefault();

            // L'email
            console.log(data.target.elements[0].value);

            // Le mdp
            console.log(data.target.elements[1].value);

            let dataForm = new FormData(data);

            console.log(dataForm);


            // AJOUTER UNE METHODE SPECIFIQUE POUR RECUPERER LES DONNEES PUIS SOUMETTRE LE FORM ??? Voir ligne 112 https://github.com/Echoes-88/Cheat_sheet/blob/master/ALL-IN-ONE/FRONT-IN-API/front/src/card.js

            const requestConfig = {
                method: 'POST',
                body: data
            };

            return (
                fetch(`${moduleUtils.baseUrl}/login`, requestConfig)

                    .then((response) => {

                        return response.json();
                    })
            );

        })
    }

};

module.exports = moduleUtils;