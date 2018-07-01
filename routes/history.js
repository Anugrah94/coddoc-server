const router = require('express').Router();
const { getOneHistory } = require('../controllers/history.controller');

router.get('/:id', getOneHistory);

module.exports = router;