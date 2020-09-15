[TO DO]

## CONNECTION A LA BDD : psql -U tragic

## REGLER LES PROBLEMES D'ALLER-RETOUR DE DONNEES. RE ORGANISER LES FICHIERS JS + METTRE EN SESSION LES DONNEES POUR EVITER ALLER RETOURS

## AJOUTER UNE ROUTE CHOOSEDECK QUI RECUPERE L'ID DU DECK CHOISI DEPUIS LE FRONT ET L'AJOUTE A LA SESSION

-- Améliorer verifications formulaire creer un compte (supprimer possibilité des champs vides)

-- app.js (dans le dossier FRONT) execute la methode login dans eventListener.js (situé dans le meme dossier)

-- La methode login execute ensuite au clic la methode showLoginForm (DANS LE FICHIER UTILS, meme dossier)

-- Cette méthode masque le menu principal pour laisser la place au formulaire de login
Ensuite je souhaite écouter la soumission du formulaire pour interroger la BDD en back


-- AMELIORER LE ADD / REMOVE CLASSLIST POUR CACHER ET AFFICHER LES ELEMENTS


## GERER LES ERREURS DE KEY ID EN CAS DE RESET DE LA BDD
https://forums.postgresql.fr/viewtopic.php?id=637





Chaque joueur pose en début de match 3 cartes de type character sur le plateau

Le plateau comporte une quatrieme zone pour les boosters.
Au deuxième tour de jeu, le joueur peut assigner un booster de son deck à une carte.
Il pourra ensuite reposer un booster tous les 3 tours (tours 1, 4, 7, 10, 13, 16, 19, 22, 25, 28...)

Lorsque que chaque joueur à poser ses 4 cartes sur le plateau, le combat commence.

Chaque tour le joueur sélectionne la carte qu'il souhaite jouer et cible la carte de l'adversaire




Construction HTML

Le plateau comporte 2 zones, une pour le joueur, une pour l'adversaire.

Chacune de ces zones comporte 4 sous zones pour le placement des cartes avec un id

Pour attaquer une carte le joueur effectue un drag and drop sur la zone de l'adversaire ce qui déclenche
la fonction "combat" en prenant l'id de la carte sélectionnée et l'id de la zone carte adversaire reliée
à la carte

La manche est terminée lorsque l'un des deux jours n'a plus de cartes (hors booster)

Le vainqueur gagne X nombre de points qui correspond au cumule des points de vie restant des cartes
encore présente.

Le joueur à la possibilité en début de partie de changer 1 fois son deck

| character |
-------------
|    id     |
|   nom     |
|  attaque  |
|  defense  |
| hit_point |


|  Booster  |
-------------
|    id     |
|   nom     |
|   type    |
|  effect   |

=> Types de booster : attack, defense, replace card, bonus round every 4 rounds.

|  player   |
-------------
|    id     |
|   firstname     |
|  lastname   |
| pseudo    |
|  email    |
|  victory  |
|   loose   | 


LISTE OF CHARACTERS

const goules = new cards("goules", 7, 5, 4);
const faucheur = new cards("faucheur", 7, 5, 6);
const dementBoucher = new cards("dement Boucher", 6, 4, 7);
const controleur = new cards("controleur", 6, 7, 6);
const mastificateur = new cards("mastificateur", 6, 5, 5);
const ecorcheurs = new cards("Ecorcheurs", 5, 5, 5);
const robotsDeCombat = new cards("robots De Combat", 6, 10, 8);
const brahmines = new cards("brahmines", 5, 7, 3);
const griffemorts = new cards("griffemorts", 9, 7, 9);
const grosRats = new cards("gros Rats", 3, 3, 3);
const mantes = new cards("mantes", 4, 7, 4);
const rats = new cards("rats", 2, 4, 3);
const geckoFeu = new cards("geckos de Feu", 5, 5, 4);




Tuto drag and drop
https://developer.mozilla.org/fr/docs/Web/API/API_HTML_Drag_and_Drop/Op%C3%A9rations_de_glissement
