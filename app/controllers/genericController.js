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
            const allInstances = await TargetModel.findAll();

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
                console.log(req.body)
                // Adding deck in database
                const deck = await models.Deck.create(
                {
                    title: req.body.title,
                    user_id: req.body.id
                });

                deckId = deck.id;

                const monsters = await models.Monster.findAll();
                const boosters = await models.Booster.findAll();

                // Init monster and booster arrays
                let monstersArray = [];
                let boostersArray = [];

                // Choose X random monsters
                for (var i = 0; i < 5; i++) {
                    let monster = monsters[Math.floor(Math.random()*monsters.length)];
                    monstersArray.push(monster.id)       
                }

                // Choose X random booster
                for (var i = 0; i < 2; i++) {
                    let booster = boosters[Math.floor(Math.random()*boosters.length)];
                    boostersArray.push(booster.id)       
                }

                // const monsters =  JSON.parse("[" + req.body.monsters + "]");
                console.log(monstersArray);
                // GET OCCURENCIES OF EACH MONSTER VALUES AND ADDING IN DATABASE
                monstersArray.sort();

                var idMonster = null;
                var cnt = 0;
                for (var i = 0; i < monstersArray.length; i++) {
                    if (monstersArray[i] != idMonster) {
                        if (cnt > 0) {
                            console.log('current is', deck)
                            // await monsters(idMonster, { through: {quantity: cnt}});
                            await MonsterQuantity.create({
                                deck_id: deckId,
                                monster_id: idMonster,
                                quantity: cnt,
                            });
                        }
                        idMonster = monstersArray[i];
                        cnt = 1;
                    } else {
                        cnt++;
                    }
                }
                if (cnt > 0) {
                    await MonsterQuantity.create({
                        deck_id: deckId,
                        monster_id: idMonster,
                        quantity: cnt,
                    });
                }
            

                // GET OCCURENCIES OF EACH BOOSTER VALUES AND ADDING IN DATABASE

                // const boosters =  JSON.parse("[" + req.body.boosters + "]");

                boostersArray.sort();

                var idBooster = null;
                var cnt2 = 0;
                for (var i = 0; i < boostersArray.length; i++) {
                    if (boostersArray[i] != idBooster) {
                        if (cnt2 > 0) {
                            await BoosterQuantity.create({
                                deck_id: deckId,
                                booster_id: idBooster,
                                quantity: cnt2,
                            });

                        }
                        idBooster = boostersArray[i];
                        cnt2 = 1;
                    } else {
                        cnt2++;
                    }
                }
                if (cnt2 > 0) {
                    await BoosterQuantity.create({
                        deck_id: deckId,
                        booster_id: idBooster,
                        quantity: cnt2,
                    });
                }

                const finalDeck = await models.Deck.findByPk(deck.id, {
                    include: ['monsters', 'boosters']
                });
                console.log('finalDeck', finalDeck)
                res.json(finalDeck);

            } else if(entity === 'other') {


            } else {

            }
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