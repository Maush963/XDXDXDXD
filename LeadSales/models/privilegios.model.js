const db = require('../util/database');
const bcrypt = require('bcryptjs');

module.exports = class Privilegios {
    constructor(mi_idfuncion, mi_idrol) {
        this.idfuncion = mi_idfuncion;
        this.idrol = mi_idrol;
    }

    static fetchAll(idRol) {
        return db.execute(`
            SELECT f.IDFuncion, f.Descripcion, r.IDRol, ro.TipoRol 
            FROM funcion f 
            LEFT JOIN (SELECT * FROM rol_adquiere_funcion WHERE IDRol = ?) r ON f.IDFuncion = r.IDFuncion 
            LEFT JOIN rol ro ON r.IDRol = ro.IDRol 
            ORDER BY f.IDFuncion ASC`, [idRol])
        .then(([data]) => {
            //console.log(data);
            return data;
        });
    }
    /*
    En esta consulta, estoy seleccionando todas las funciones y luego haciendo un `LEFT JOIN` 
    con los roles que tienen esas funciones. Esto significa que si un rol no tiene una función,
    esa función todavía se incluirá en los resultados, pero `IDRol` y `TipoRol` serán `NULL` para esa función.
    */ 

    static async actualizarPrivilegios(privilegios) {
        // Primero se obtiene el roleID de uno de los privilegios.
        // Asumimos que todos los privilegios tienen el mismo roleID.
        let roleID = privilegios[0].roleID;
        let rolfuncion = null;
        await db.execute(`
            SELECT FechaRolFuncion FROM rol_adquiere_funcion
            WHERE IDRol = ?
            GROUP BY FechaRolFuncion;
        `, [roleID]).then(([data]) => {
           rolfuncion = data;
        });

        // Luego, elimina sólo los registros que corresponden a ese roleID.
        await db.execute(`
            DELETE FROM rol_adquiere_funcion
            WHERE IDRol = ?
        `, [roleID]);
        
        // Finalmente, inserta los nuevos privilegios.
        for (let privilegio of privilegios) {
            console.log(`Procesando privilegio: ${JSON.stringify(privilegio)}`);
            if (privilegio.checked) {
                await db.execute('INSERT INTO rol_adquiere_funcion (IDRol, IDFuncion, FechaRolFuncion, FechaRolFuncionActualizacion) VALUES (?, ?, ?, CURRENT_TIMESTAMP)',
                [Number(privilegio.roleID), Number(privilegio.privilegeID), rolfuncion[0].FechaRolFuncion]);
            }
        }
    }

    static fetchFunciones() {
        return db.execute('SELECT IDFuncion, Descripcion FROM funcion ORDER BY IDFuncion ASC')
        .then(([data]) => {
            return data;
        });
    }
}