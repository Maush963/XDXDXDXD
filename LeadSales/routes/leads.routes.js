const express = require('express');

const router = express.Router();
const isAuth = require('../util/isAuth');
const canEdit = require('../util/canEdit');

const LeadsController = require('../controllers/leads.controller');
const VersionController = require('../controllers/version.controller');

router.get('/analitica', LeadsController.get_analiticaPRESET);
router.get('/analitics/:date?', LeadsController.get_analitica);

router.get('/', LeadsController.get_root);

router.get('/Historial', VersionController.get_historial);
router.post('/Historial', VersionController.post_historial);
router.post('/descargarhistorial', VersionController.post_descargarhistorial);


router.get('/Leads', LeadsController.get_leads);
router.post('/Leads/eliminar', LeadsController.post_eliminar_lead);

router.get('/modificar/:id', LeadsController.get_modificar_lead);
router.post('/modificar', LeadsController.post_modificar_lead);



module.exports = router;