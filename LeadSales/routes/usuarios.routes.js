const express = require('express');
const router = express.Router();
const usuariosController= require('../controllers/usuarios.controller');


router.get('/login', usuariosController.get_login);

router.get('/signup', usuariosController.get_signup);

router.post('/signup', usuariosController.post_signup);

module.exports = router;