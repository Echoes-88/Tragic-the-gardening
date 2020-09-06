// ------------------------------------------- //
// CRUD CONTROLLER FOR DECK, MONSTER & BOOSTER
// ------------------------------------------- //

const models = require('../models');

// UpperCase firstletter of entity to fit with Model case
const getModelFromName = (name) => {
    const entityName = name[0].toUpperCase() + name.slice(1);
    return models[entityName];
};


const genericController = {
    

    getAll: async(req, res) =>  {
        const entity = req.params.entity;
        const TargetModel = getModelFromName(entity);

        if(!TargetModel) {
            res.status(404).json({error: `Model ${entity} not found`});
        } else {
            const allInstances = await TargetModel.findAll({include: {all:true, nested:true}});

            res.json(allInstances);
        }
    },


    getOne: async(req, res) =>  {
        const {entity, id} = req.params;
        const TargetModel = getModelFromName(entity);

        if(!TargetModel) {
            res.status(404).json({error: `Model ${entity} not found`});
        } else {
            const instance = await TargetModel.findByPk(id, {
                include: {all:true, nested:true}
            });

            if (instance) {
                res.json(instance);
            } else {
                res.status(404).json({error: `Id not found for Model ${entity}`});
            }
        }
    },


    createOne: async(req, res) =>  {
        const entity = req.params.entity;
        const TargetModel = getModelFromName(entity);

        // Checking if class does exist
        if (!TargetModel) {
            res.status(404).json({error: `Model ${entity} not found`});
        } else {

            // CREATE DECK
            if(entity === 'deck') {

                // Adding deck in database
                const deck = await models.Deck.create(
                {
                    title: req.body.title,
                    user_id: req.body.id
                });


                // Getting all monsters and booster from database
                const monsters = await models.Monster.findAll({});
                const boosters = await models.Booster.findAll({});

                let monstersArray = [];
                let boostersArray = [];

                // Choosing X random monsters and adding in deck
                for (var i = 0; i < 10; i++) {

                    let monsterQuantity = 1;

                    let monster = monsters[Math.floor(Math.random()*monsters.length)];

                    await deck.addDeckHasMonster(monster, { through: {quantity: 1}});



                    // monstersArray.push(monster.id);

                    // if (monstersArray.includes(monster.id)) {
                    //     monsterQuantity++;
                    // }



                    // let monsterQuantified = await models.DeckHasMonster.findAll({where: {deck_id: deck.id, monster_id: monster.id}});
                
                    // monsterQuantified.quantity = monsterQuantity;
                    // await monsterQuantified.save();

                }

                for (var j = 0; j < 3; j++) {
                    let booster = boosters[Math.floor(Math.random()*boosters.length)];
                    boostersArray.push(booster);
                }

                // Checker les valeurs des tableaux. Si doublon récupérer l'id concerné et la quantité
                // Faire un update deck_has_monster en modifiant la quantité

                // await deck.addDeckHasMonster(monster);
                // await deck.addDeckHasBooster(booster);


            } else if(entity === 'monster') {

            } else if (entity === 'booster') {

            } else {

            }

            // res.json(instance);
        }
    },


    updateOne: async(req, res) =>  {
        const entity = req.params.entity;
        const TargetModel = getModelFromName(entity);

        if (!TargetModel) {
            res.status(404).json({error: `Model ${entity} not found`});
        } else {

            if(entity === 'deck') {

            } else if(entity === 'monster') {

            } else if (entity === 'booster') {

            } else {

            }

            res.json(instance);
        }
    },


    deleteOne: async(req, res) =>  {

    },
};

module.exports = genericController;