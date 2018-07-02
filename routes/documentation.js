const router = require('express').Router();
const { 
  dropDocumentationCollections
} = require('../controllers/documentation.controller');

router.get('/drop-documentation', dropDocumentationCollections);

module.exports = router;