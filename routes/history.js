const router = require('express').Router();
const { 
  getOneHistory, 
  updateHistory 
} = require('../controllers/history.controller');

router.get('/:id', getOneHistory);
router.put('/update/:id', updateHistory);

module.exports = router;