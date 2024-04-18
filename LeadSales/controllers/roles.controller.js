const Rol = require('../models/rol.model');
const privilegios = require('../models/privilegios.model');

exports.post_eliminar = (request, response, next) => {
    console.log(request.body.IDRol)
    Rol.delete(request.body.IDRol)
        .then(([rows,fieldData]) => {
            Console.log("Registro eliminado exitosamente")
            response.redirect ('/Roles/consultas');
        }).catch((error) => {
            console.log(error)
            response.redirect ('/Roles/consultas');
        })
};

exports.get_buscar = (req, res, next) => {
    Rol.buscar(req.params.q || '')
        .then(([rows, fieldData]) => {
            // Mapea los resultados para formatear la fecha
            const data = rows.map(row => {
                let fecha = new Date(row.FechaUsuarioRolActualizacion);
                let fechaFormateada = fecha.toLocaleDateString('es-ES', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                });
                row.FechaUsuarioRolActualizacion = fechaFormateada;
                return row;
            });

            // Devuelve los datos como JSON
            res.status(200).json({data: data});
        })
        .catch((error) => {
            console.log(error);
            res.status(500).json({error: error});
        });
};   


exports.get_mostrarRoles = (req, res, next) => {
    Rol.fetchAllParaRoles()
        .then(([rows, fieldData]) => {
            res.render('Rol', {
                registro: true,
                rol: rows,
                username: req.session.username || '',
                permisos: req.session.permisos || [],
            });
        })
        .catch((error) => {
            console.log(error);
        });
}

exports.get_agregarRol = (req, res, next) => {
    privilegios.fetchFunciones()
        .then(data => {
            // Crear un objeto para almacenar las funciones
            let funciones = {};

            // Iterar sobre los datos y agregar cada funcion y su ID al objeto funciones
            data.forEach(item => {
                if (!funciones[item.Descripcion]) {
                    funciones[item.Descripcion] = {id: item.IDFuncion};
                }
            });

            // Renderizar la vista con los datos
            res.render('agregarRol', {
                funciones: funciones,
                username: req.session.username || '',
                permisos: req.session.permisos || [],
            });
        })
        .catch((error) => {
            console.log(error);
        });
};

exports.post_agregarRol = (req, res, next) => {
    //console.log(changes);
    Rol.agregarRol(req, res)
        .then(([rows, fieldData]) => {
            res.json({message: 'Rol creado exitosamente'});
        })
        .catch((error) => {
            console.error('Error:', error);
            res.status(500).json({ message: 'Error al crear el rol' });
        });
}

exports.get_equipo = (req, res, next) => {
    Rol.fetchRolesWithUsers()
        .then(([rows, fieldData]) => {
            // Mapea los resultados para formatear la fecha
            const data = rows.map(row => {
                let fecha = new Date(row.FechaUsuarioRolActualizacion);
                let fechaFormateada = fecha.toLocaleDateString('es-ES', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                });
                row.FechaUsuarioRolActualizacion = fechaFormateada;
                return row;
            });

            Rol.fetchAll()
                .then(([roles, fieldData]) => {
                    res.render('equipo', {
                        username: req.session.username || '',
                        permisos: req.session.permisos || [],
                        data: data,  
                        roles: roles
                    });
                })
                .catch((error) => {
                    console.error('Error:', error);
                });
        })
        .catch((error) => {
            console.error('Error:', error);
        });
}

exports.post_cambiarRol = (req, res, next) => {
    console.log(req.body);
    const idUsuario = req.body.idUsuario;
    const idRol = req.body.idRol;
    Rol.cambiarRol(idUsuario, idRol)
        .then(() => {
            res.json({ message: 'Rol cambiado con éxito' });
        })
        .catch((error) => {
            console.error('Error:', error);
        });
}