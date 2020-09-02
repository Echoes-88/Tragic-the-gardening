const sanitizer = require('sanitizer');

const sanitizeObject = (obj) => {
    for (const property in obj) {
        // on va remplacer la valeur par une version assainie
        obj[property] = sanitizer.escape(obj[property]);
    }
};

const sanitizeData = (req, res, next) => {
    // on veut assainir toutes les données qui serait présente dans un éventuel req.body, et pareil pour req.params et req.query !

    if (req.body) {
        // on va parcourir toutes les propriétés du body
        sanitizeObject(req.body);
    }

    // on fait la même pour req.params et req.query
    sanitizeObject(req.params);
    sanitizeObject(req.query);

    // c'est bon tout est propre => on passe à la suite !
    next();
};


module.exports = sanitizeData;