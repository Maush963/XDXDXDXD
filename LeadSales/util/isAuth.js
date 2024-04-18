module.exports = (request, response, next) => {
    if (!request.session.isLoggedIn) {
        return response.redirect('/usuario/login');
    }
    next();
}