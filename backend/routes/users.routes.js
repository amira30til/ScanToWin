const express = require('express');
const router = express.Router();
const {
  create,
  findAll,
  findOne,
  update,
  remove,
  findUsersByDate,
} = require('../controllers/users.controller');

router.post('/', create);
router.get('/', findAll);
router.get('/by-date', findUsersByDate);
router.get('/:id', findOne);
router.patch('/:id', update);
router.delete('/:id', remove);

module.exports = router;
