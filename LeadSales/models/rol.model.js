const db = require('../util/database');
const bcrypt = require('bcryptjs');

module.exports = class Rol {
    constructor(mi_idRol, mi_TipoRol) {
        this.IDRol = mi_idRol;
        this.TipoRol = mi_TipoRol;

    }
    static fetchRolesWithUsers() {
        return db.execute(`
            SELECT u.IDUsuario, utr.IDRol, utr.FechaUsuarioRolActualizacion, r.TipoRol, u.UserName
            FROM usuario u
            LEFT JOIN usuario_tiene_rol utr ON utr.IDUsuario = u.IDUsuario
            LEFT JOIN rol r ON utr.IDRol = r.IDRol
            WHERE (r.TipoRol <> 'owner' OR r.TipoRol IS NULL)
            ORDER BY utr.FechaUsuarioRolActualizacion DESC
        `);
    }

    static buscar(q) {
        return db.execute(`
            SELECT u.IDUsuario, utr.IDRol, utr.FechaUsuarioRolActualizacion, r.TipoRol, u.UserName
            FROM usuario u
            LEFT JOIN usuario_tiene_rol utr ON utr.IDUsuario = u.IDUsuario
            LEFT JOIN rol r ON utr.IDRol = r.IDRol
            WHERE (u.UserName LIKE ? OR r.TipoRol LIKE ? OR DATE(utr.FechaUsuarioRolActualizacion) LIKE ?) AND (r.TipoRol <> 'owner' OR r.TipoRol IS NULL)
            ORDER BY utr.FechaUsuarioRolActualizacion DESC
        `, [`%${q}%`, `%${q}%`, `%${q}%`]);
    }

    static agregarRol(req, res) {
        console.log("agregarRol");
        console.log(req.body);
        const nombreRol = req.body.nombreRol;
        const privileges = req.body.privileges;
    
        // Insertar el nuevo rol en la tabla 'rol' y obtener el ID del rol insertado
        db.execute('INSERT INTO rol (TipoRol) VALUES (?)', [nombreRol])
            .then(([rows]) => {
                const idRol = rows.insertId; // Obtener el ID del rol que acabamos de insertar
    
                // Para cada privilegio que esté marcado, insertar una nueva fila en la tabla 'rol_adquiere_funcion'
                privileges.forEach(privilege => {
                    if (privilege.checked) {
                        db.execute(
                            'INSERT INTO rol_adquiere_funcion (IDRol, IDFuncion, FechaRolFuncion) VALUES (?, ?, CURRENT_TIMESTAMP)',
                            [idRol, privilege.privilegeID]
                        )
                        .catch((error) => {
                            console.log(error);
                        });
                    }
                });
    
                res.redirect('/Roles/consultas');
            })
            .catch((error) => {
                console.log(error);
            });
    };

    
    static delete(id) {
        return db.execute('DELETE FROM rol_adquiere_funcion WHERE IDRol = ? ', [id]),db.execute('UPDATE usuario_tiene_rol SET IDRol = 4, FechaUsuarioRolActualizacion = NOW() WHERE IDRol = ? ', [id])    
        .then(()=>{
            return  db.execute('DELETE FROM rol WHERE IDRol = ? ', [id])
        })
        .catch((error => {
            console.log (error)
            throw Error ('Rol no encntrado')
        }));
    }

    static fetchAllParaRoles() {
        return db.execute('SELECT * FROM rol WHERE TipoRol NOT IN ("owner", "SinRol") ORDER BY IDRol ASC');
    }

    static fetchAll() {
        return db.execute('SELECT * FROM rol WHERE TipoRol <> "owner" ORDER BY IDRol ASC');
    }
    static fetch(id) {
        if (id) {
            return this.fetchOne(id);
        } else {
            return this.fetchAll();
        }
    }
    
    static cambiarRol(idUsuario, idRol) {
        return db.execute(`
            UPDATE usuario_tiene_rol
            SET IDRol = ?, FechaUsuarioRolActualizacion = NOW()
            WHERE IDUsuario = ?
        `, [idRol, idUsuario])
        .then(() => {
            console.log('Rol cambiado con éxito');
        }).catch((error) => {
            console.log(error);
        });
    }
}
    
