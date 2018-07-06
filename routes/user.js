const router = require('express').Router();
const { 
   getAllUser
} = require('../controllers/user.controller');

router.get('/', getAllUser);

module.exports = router;