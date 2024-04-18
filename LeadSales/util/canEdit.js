module.exports = (request, response, next) => {
    let canEdit =  false;
    for (let permiso of request.session.permisos) {
        if (permiso.permiso == 'editar_libro') {
            canEdit = true;
        }
    }
    if(canEdit) {
        next();
    } else {
        return response.redirect('/usuario/logout');    
    }
}