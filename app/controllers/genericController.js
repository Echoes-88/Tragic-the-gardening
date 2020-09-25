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

                // Adding deck in database
                const deck = await models.Deck.create(
                {
                    title: req.body.title,
                    user_id: req.body.id
                });

                const monsters =  JSON.parse("[" + req.body.monsters + "]");

                // GET OCCURENCIES OF EACH MONSTER VALUES AND ADDING IN DATABASE
                monsters.sort();

                var current = null;
                var cnt = 0;
                for (var i = 0; i < monsters.length; i++) {
                    if (monsters[i] != current) {
                        if (cnt > 0) {
                            await deck.addDeckHasMonster(current, { through: {quantity: cnt}});
                        }
                        current = monsters[i];
                        cnt = 1;
                    } else {
                        cnt++;
                    }
                }
                if (cnt > 0) {
                    await deck.addDeckHasMonster(current, { through: {quantity: cnt}});
                }
            

                // GET OCCURENCIES OF EACH BOOSTER VALUES AND ADDING IN DATABASE

                const boosters =  JSON.parse("[" + req.body.boosters + "]");

                boosters.sort();

                var current2 = null;
                var cnt2 = 0;
                for (var i = 0; i < boosters.length; i++) {
                    if (boosters[i] != current2) {
                        if (cnt2 > 0) {
                            await deck.addDeckHasBooster(current2, { through: {quantity: cnt2}});
                        }
                        current2 = boosters[i];
                        cnt2 = 1;
                    } else {
                        cnt2++;
                    }
                }
                if (cnt2 > 0) {
                    await deck.addDeckHasBooster(current2, { through: {quantity: cnt2}});
                }


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