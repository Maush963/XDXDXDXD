const express = require('express');

const router = express.Router();

const rolesController= require('../controllers/roles.controller');

router.get('/consultas', rolesController.get_mostrarRoles);
router.post('/eliminar', rolesController.post_eliminar);
router.get('/agregar', rolesController.get_agregarRol);
router.post('/agregar', rolesController.post_agregarRol);
router.get('/equipo', rolesController.get_equipo);
router.post('/cambiarRol', rolesController.post_cambiarRol);
router.get('/buscar/:q', rolesController.get_buscar);
router.get('/buscar', rolesController.get_buscar);

module.exports = router;
