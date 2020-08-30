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


                console.log(req.body)
           
                const monsters = await TargetModel.findAll({});
                const boosters = await TargetModel.findAll({});
    
                let quantityMonster = 0;

                // CHOPER L'ID DE SESSION A CODER + GET L'USER RELIE A CET ID
                console.log(req.session.id)
                let user = req.session.id;
    
                for (var i = 0; i < 5; i++) {
    
                    let monster = monsters[Math.floor(Math.random()*monsters.length)];
    
                    await models.Deck.create(
                        {include:['deckHasMonster']}, 
                        req.body,
                        /*{ monster_id: monster.id, quantity: monster.text},*/ 
                        {where:{deck_id: req.body.id}});
                    
                }
            } else if(entity === 'monster') {

            } else if (entity === 'booster') {

            } else {

            }

            res.json(instance);
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