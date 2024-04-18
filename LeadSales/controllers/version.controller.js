const Version = require('../models/version.model');
const csv = require('fast-csv');
const fs = require('fs');
const jsPDF = require('jspdf').jsPDF;
const autoTable = require('jspdf-autotable');

exports.get_historial = (req, res, next) => {
    Version.fetch(req.params.IDVersion)
    Version.fetch(req.params.IDUser)
        .then(([rows, fieldData]) => {
            console.log(rows.length);
            res.render('historial', {
                registro: true,
                versiones: rows,
                username: req.session.username || '',
                permisos: req.session.permisos || [],
            });
        })
        .catch((error) => {
            console.log(error);
        });
}

exports.post_historial = (req, res, next) => {
    console.log(req.body);
    console.log(req.file);

    const fileRows = [];
    csv.parseFile(req.file.path)
    .on("data", function (data) {
      fileRows.push(data); // push each row
    })
    .on("end", function () {
      console.log(fileRows)
      fs.unlinkSync(req.file.path);   // remove temp file
      //process "fileRows" and respond
    })

    res.redirect('/lead/historial');

};

exports.post_descargarhistorial = async (req, res, next) => {
    console.log('Descargando historial');
    console.log(req.body);
    let doc = new jsPDF();

    let body = req.body.map(version => [version.IDVersion, version.NombreVersion, version.IDUsuario, version.FechaCreacion]);

    doc.autoTable({
        head: [['IDVersion', 'NombreVersion', 'IDUsuario', 'FechaCreacion']],
        body: body
    });

    let pdf = doc.output('arraybuffer');

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=historial.pdf');

    res.send(Buffer.from(pdf));
};