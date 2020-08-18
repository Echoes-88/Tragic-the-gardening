 UNE PARTIE SE JOUE EN 3 MANCHES

 A CHAQUE MANCHE LE JOUEUR POSE 4 CARTES MONSTRE SUR LE PLATEAU ET 1 BOOSTER

 A CHAQUE TOUR LE JOUEUR SELECTIONNE UNE DE SES CARTES ET CIBLE UNE CARTE DE L'ADVERSAIRE.

 TOUS LES 3 TOURS DE JEU LE JOUEUR PEUT UTILISER UN BOOSTER SUR UNE CARTE

 AU 4eme TOUR DE JEU CHAQUE JOUEUR PEUT AJOUTER 1 CARTE MONSTRE ET 1 CARTE BOOSTER SUR LE PLATEAU
 



Il est possible de créer des decks qui comportent 16 cartes MONSTRE et 6 CARTES BOOSTER

LES CARTES MONSTRE DU DECK UTILISEES LORS D'UNE MANCHE NE SONT PLUS DISPO APRES UNE MANCHE

LES CARTES BOOSTER DU DECK SONT TOUTES DISPONIBLE A CHAQUE MANCHE



Construction HTML

Le plateau comporte 2 zones, une pour le joueur, une pour l'adversaire.

Chacune de ces zones comporte 4 sous zones pour le placement des cartes avec un id

Pour attaquer une carte le joueur effectue un drag and drop sur la zone de l'adversaire ce qui dÃ©clenche
la fonction "combat" en prenant l'id de la carte sÃ©lectionnÃ©e et l'id de la zone carte adversaire reliÃ©e
Ã  la carte

La manche est terminÃ©e lorsque l'un des deux jours n'a plus de cartes (hors booster)

Le vainqueur gagne X nombre de points qui correspond au cumule des points de vie restant des cartes
encore prÃ©sente.

Le joueur Ã  la possibilitÃ© en dÃ©but de partie de changer 1 fois son deck

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

|  players  |
-------------
|    id     |
|   nom     |
|  score    |  


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


LIST OF BOOSTER

stympack = hit_point, 2


CODE 

Tuto drag and drop
https://developer.mozilla.org/fr/docs/Web/API/API_HTML_Drag_and_Drop/Op%C3%A9rations_de_glissement
