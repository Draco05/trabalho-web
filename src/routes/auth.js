const express = require('express');
const router  = express.Router();
const ctrl    = require('../controllers/authController');
const { autenticar } = require('../middleware/auth');

router.post('/cadastro',        ctrl.cadastro);
router.post('/login',           ctrl.login);
router.post('/logout',          autenticar, ctrl.logout);
router.get('/perfil',           autenticar, ctrl.perfil);
router.delete('/conta',         autenticar, ctrl.deletarConta);

module.exports = router;
