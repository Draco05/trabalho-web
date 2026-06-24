const express = require('express');
const router  = express.Router();
const ctrl    = require('../controllers/favoritosController');
const { autenticar } = require('../middleware/auth');

router.use(autenticar);

router.get('/',                   ctrl.listar);
router.post('/',                  ctrl.adicionar);
router.delete('/:receitaId',      ctrl.remover);

module.exports = router;
