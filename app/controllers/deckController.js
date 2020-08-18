const { Deck, Monster, Booster } = require('../models');

const deckController = {

    // GET ALL LIST
    getAll: async (req, res) => {
        try {
            const decks = await Deck.findAll({include:['deckHasMonster', 'deckHasBooster']});
        
        res.json(decks)

    }catch(error){
        res.status(500).json(error);
      }
    },

    // INITIALISATION DE DECK

    init: async (req, res) => {
        try {

            const newDeck = new Deck({
                title: req.body.title,
                user_id: req.session.id
              });

              await newDeck.save();
            
            // RECUPERER L'ID DU NOUVEAU DECK CREE PUIS L'INDIQUER DANS LE WHERE DU DECK UPDATE

            // AJOUTER UN CALCUL DANS LE FOR VAR... SI LE MONSTRE EXISTE DEJA INCREMENTER SA QUANTITY
            // FONCTIONNERA PAS, TROUVER UN AUTRE MOYEN DE FILTRER EN FONCTION DES QUANTITES
            
            const monsters = await Monster.findAll({});
            const boosters = await Booster.findAll({});

            let quantityMonster = 0;

            for (var i = 0; i < 5; i++) {

                let monster = monsters[Math.floor(Math.random()*monsters.length)];

                await Deck.update({include:['deckHasMonster']}, { monster_id: monster.id, quantity: monster.text}, {where:{deck_id: req.params.id}});
 
            }



            res.json(deckMonster)

        }catch(error){
        res.status(500).json(error);
      }
    },

    // UPDATE ALL LIST

    updtadeAll: async (req, res) => {

        const newDatas = req.body;

        try {

            await List.update({ title: newDatas.title, position: newDatas.position}, {where:{}});

            // Verification de l'update
            const getAllList = await List.findAll({});
            res.json(getAllList)

        }catch(error){
            res.status(500).json(error);
        }
        },

    // DELETE ALL LIST

    deleteAll: async (req, res) => {

        try {

            await List.destroy({ truncate: true })

            res.send('La suppression a bien été effectuée')

        }catch(error){
            res.status(500).json(error);
            }
        },

    // CREATE ONE LIST

    createOne: async (req, res) => {

        try {

            const newList = new List({
                title: req.body.title,
                position: req.body.position
              });

              await newList.save();

            // Verification de l'ajout
            const getAllList = await List.findAll({});
            res.json(getAllList)

        }catch(error){
            res.status(500).json(error);
            }
        },

    // GET ONE LIST

    getOne: async (req, res) => {

        const id = req.params.id;

        try {

            const getOneList = await List.findByPk(id,{
                include: [{
                    association: "cards",
                    include: ["labels"]
                }]
            });

            res.json(getOneList)

        }catch(error){
            res.status(500).json(error);
            }
        },

    // UPDATE ONE LIST

    updateOne: async (req, res) => {

        const newDatas = req.body;

        try {

            await List.update({ title: newDatas.title, position: newDatas.position}, {where:{id: req.params.id}});

            // Verification de la modification
            const getOneList = await List.findByPk(req.params.id,{});
            res.json(getOneList)

        }catch(error){
            res.status(500).json(error);
            }
        },

    // DELETE ONE LIST

    deleteOne: async (req, res) => {

        const idList = req.params.id;

        try {

            await List.destroy({where:{id: parseInt(idList)}})

            res.send('La suppression a bien été effectuée')

        }catch(error){
            res.status(500).json(error);
            }
        },

}

module.exports = deckController;