const db = require('../util/database');
const bcrypt = require('bcryptjs');


module.exports = class Lead {
    constructor(mi_idLead, mi_asignado_a, mi_telefono, mi_nombreLead, mi_FechaPrimerMensaje, mi_Embudo, mi_Etapa, mi_Status, mi_Archivado, mi_CreadoManual) {
        this.IDLead = mi_idLead;
        this.asignado_a = mi_asignado_a;
        this.Telefono = mi_telefono;
        this.NombreLead = mi_nombreLead;
        this.FechaPrimerMensaje = mi_FechaPrimerMensaje;
        this.Embudo = mi_Embudo;
        this.Etapa = mi_Etapa;
        this.Status = mi_Status;
        this.Archivado = mi_Archivado;
        this.CreadoManual = mi_CreadoManual;
    }

    save() {
        return toString(this.Embudo)
        .then((Embudo) => {
            return db.execute(
                `INSERT INTO leads (IDLead, asignado_a, Telefono, NombreLead, FechaPrimerMensaje, Embudo, Etapa, Status, Archivado, CreadoManual) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ? )`,
                [this.IDLead, this.asignado_a, this.Telefono, this.NombreLead, this.FechaPrimerMensaje, this.Embudo, this.Etapa, this.Status, this.Archivado, this.CreadoManual]);
            })
            .catch((error) => {
                console.log(error);
            });
        }
        static async fetchAll() {
            console.log(db.execute('SELECT * FROM leads'))
            return await db.execute('SELECT * FROM leads')
        }
        static fetch(id) {
        console.log(id)
        if (id) {
            return this.fetchOne(id);
        } else {
            return this.fetchAll();
        }
    }

    static async fetchLeadsByDay(range) {
        const endDate = new Date(2022, 0, 1);// Fecha actual
        let startDate = new Date(endDate); // Crea una copia de endDate
        let groupBy;
    
        switch (parseInt(range)) {
            case 1:
                startDate.setDate(endDate.getDate() - 7); // Una semana antes de la fecha actual
                groupBy = 'DAY';
                break;
            case 2:
                startDate.setMonth(endDate.getMonth() - 1); // Un mes antes de la fecha actual
                groupBy = 'DAY';
                break;
            case 3:
                startDate.setMonth(endDate.getMonth() - 6); // Seis meses antes de la fecha actual
                groupBy = 'MONTH';
                break;
            case 4:
                startDate.setFullYear(endDate.getFullYear() - 1); // Un año antes de la fecha actual
                groupBy = 'MONTH';
                break;
            default:
                throw new Error('Invalid range');
        }
    
        const query = `
            SELECT DATE(FechaPrimerMensaje) as Fecha, COUNT(*) as CantidadLeads 
            FROM leads 
            WHERE FechaPrimerMensaje >= ? AND FechaPrimerMensaje < ?
            GROUP BY ${groupBy}(FechaPrimerMensaje)
        `;
        return await db.execute(query, [startDate, endDate]);
    }
    

    static fetchOne(NombreLead) {
        return db.execute('Select * FROM usuario WHERE NombreLead = ?', [NombreLead]);
    }
    static fetchOneLeadbyid(id) {
        return db.execute('Select * FROM leads WHERE IDLead = ?', [id]);
    }

    static update(data) {
        console.log('update');
        console.log(data);
        return db.execute('UPDATE leads SET asignado_a = ?, Telefono = ?, NombreLead = ?, FechaPrimerMensaje = ?, Embudo = ?, Etapa = ?, Status = ?, Archivado = ?, CreadoManual = ? WHERE IDLead = ?',
            [data.asignado_a, data.telefono, data.nombre, data.fecha, data.embudo, data.etapa, data.status, data.archivado, data.creadomanual, data.id]);
    }

    static eliminar(id) {
        return db.execute('DELETE FROM leads WHERE IDLead = ?', [id]);
    }
}