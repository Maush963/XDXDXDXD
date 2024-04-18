const db = require('../util/database');
const bcrypt = require('bcryptjs');

module.exports = class Version {
    constructor(mi_idVersion, mi_iduser, mi_fecha, mi_nombreVersion) {
        this.IDVersion = mi_idVersion;
        this.IDUser = mi_iduser;
        this.NombreVersion = mi_nombreVersion;
    }

    save() {
        return new Date(mi_fecha)
        .then((password_cifrado) => {
            return db.execute(
            `INSERT INTO version (IDVersion, IDUser, FechaCreacion, NombreVersion) 
                VALUES (?, ?, ?, ?)`,
            [this.IDVersion, this.IDUser, this.FechaCreacion, this.NombreVersion]);
        })
        .catch((error) => {
            console.log(error);
        });

    }
    
        static fetchAll() {
            return db.execute('Select * from version')
        }
        static fetch(id) {
            if (id) {
                return this.fetchOne(id);
            } else {
                return this.fetchAll();
            }
        }
        static fetchOne(NombreVersion) {
            return db.execute('Select * from usuario WHERE NombreVersion = ?', [NombreVersion]);
    }
}