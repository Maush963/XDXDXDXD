const Usuario = require('../models/usuario.model');

exports.get_login = (request, response, next) => {
    response.render('signup', {
        username: request.session.username || '',
        registro: false,
    });
};

exports.get_signup = (req, res, next) => {
    res.render('signup', {
        username: req.session.username || '',
        registro: true,
    });
};

exports.post_signup = (req, res, next) => {
    const nuevo_usuario = new Usuario(
        req.body.username, req.body.name, req.body.password
    );
    nuevo_usuario.save()
        .then(() => {
            res.redirect('/usuario/login');
        })
        .catch((error) => {
            console.log(error);
            req.sesion.error = 'Nombre de usuario ya existe';
            res.redirect('/usuario/signup');
        });
};