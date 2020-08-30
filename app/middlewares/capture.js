// Module pour factoriser le try/catch des controllers

const capture = (baseFunc) => {
    return async (req, res, next)=> {
        try {
            await baseFunc(req, res, next);
        } catch (error) {
            console.log(error);
            res.status(500).json({error});
        }
    }
};

module.exports = capture;