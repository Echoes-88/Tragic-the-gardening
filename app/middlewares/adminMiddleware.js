// Middleware qui permet de vérifier si l'utilisateur a les droits admin ou pas
// Ce middleware va aussi décider de ce qu'il va faire si jamais l'utilisateur n'a pas les droits
module.exports = (req, res, next) => {
    // Si l'utilisateur n'est pas du tout connecté
    if (!req.session || !req.session.user){
        return res.redirect('/login');
    }

    if (req.session.user.role !== 'admin'){
        return res.status(403).render('403');
    }

    next();
};