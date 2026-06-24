const express = require('express');
const router  = express.Router();
const ctrl    = require('../controllers/receitasController');
const { autenticar } = require('../middleware/auth');

// Todas as rotas de receitas exigem login
router.use(autenticar);

router.get('/',       ctrl.listar);
router.get('/:id',    ctrl.buscarPorId);
router.post('/',      ctrl.criar);
router.put('/:id',    ctrl.atualizar);
router.delete('/:id', ctrl.excluir);

module.exports = router;
